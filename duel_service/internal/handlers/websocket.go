package handlers

import (
	"log"
	"net/http"
	"strconv"
	"time"

	"courseclash/duel-service/internal/duelsync"
	"courseclash/duel-service/internal/models"
	"courseclash/duel-service/internal/repositories"
	"courseclash/duel-service/internal/services"

	"github.com/gorilla/websocket"
)

// WsHandler gestiona la conexión WebSocket de un jugador para un duelo.
// Se encarga de la lógica de conexión y sincronización entre los dos jugadores de un duelo.
func WsHandler(w http.ResponseWriter, r *http.Request, duelID string, playerID string) {
	// Convertir duelID a entero para buscar en la base de datos
	duelIDInt, err := strconv.Atoi(duelID)
	if err != nil {
		log.Printf("ID de duelo inválido: %s", duelID)
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("ID de duelo inválido"))
		return
	}
	
	// Verificar que el duelo existe en la base de datos
	duelRepo := repositories.NewDuelRepository()
	duel, err := duelRepo.GetDuelByID(duelIDInt)
	if err != nil {
		log.Printf("Duelo %s no encontrado: %v", duelID, err)
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("Duelo no encontrado"))
		return
	}
	
	// Verificar si el jugador es parte del duelo
	validPlayer := false
	requesterID := duel.ChallengerID
	opponentID := duel.OpponentID
	
	if playerID == requesterID || playerID == opponentID {
		validPlayer = true
	}
	
	// Si el jugador no es parte del duelo, rechazar la conexión
	if !validPlayer {
		log.Printf("Jugador %s intentó conectarse al duelo %s pero no es parte de él", playerID, duelID)
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("No estás autorizado para conectarte a este duelo"))
		return
	}
	// Eleva o actualiza el estado de la conexión HTTP del jugador a WebSocket
	conn, err := duelsync.Upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Error al actualizar a WebSocket para el jugador %s en el duelo %s: %v", playerID, duelID, err)
		return
	}
	// Termina la conexión cuando todo se ha ejecutado
	defer conn.Close()

	// Crear una instancia del repositorio de jugadores para obtener el elo y el rango
	playerRepo := repositories.NewPlayerRepository()
	
	// Obtener los datos del jugador desde MongoDB
	playerData, err := playerRepo.GetPlayerByID(playerID)
	if err != nil {
		log.Printf("Error al obtener datos del jugador %s desde MongoDB: %v", playerID, err)
		conn.WriteMessage(websocket.TextMessage, []byte("Error al obtener datos del jugador. Cerrando conexión."))
		return
	}
	
	// Usar el ELO obtenido de MongoDB
	playerElo := playerData.Elo

	// Crear el canal Done para este jugador. Este canal permite reconocder cuando un jugador termino
	playerDoneChan := make(chan struct{})
	player := &models.Player{
		ID:    playerID,
		Score: 0,
		Elo:   playerElo,
		Conn:  conn,
		Done:  playerDoneChan,
	}

	// Usar el rango obtenido de MongoDB
	player.Rank = playerData.Rank

	duelsync.Mu.Lock()

	// Verifica si hay un mapa de las conexiones de los jugadores para un duelo determinado
	// Si no hay lo crea y lo asigna a playersConnected
	playersConnected, playersConnectedExists := duelsync.DuelConnections[duelID]
	if !playersConnectedExists {
		playersConnected = &models.DuelConnection{}
		duelsync.DuelConnections[duelID] = playersConnected
	}

	// Revisa si existe un canal para sincronizar el duelo, si no lo hay lo crea
	syncChannel, syncChannelExists := duelsync.DuelSyncChans[duelID]
	if !syncChannelExists {
		syncChannel = make(chan struct{})
		duelsync.DuelSyncChans[duelID] = syncChannel
	}

	// Determinar si es el retador o el aceptador basándose en los datos del duelo
	isRequester := playerID == requesterID
	isOpponent := playerID == opponentID
	
	// Verificar que el duelo existe antes de asignar jugadores
	duelRequestExists := false
	_, duelRequestExists = duelsync.DuelRequests[duelID]

	log.Printf("🔗 [CONEXION] Jugador %s conectándose al duelo %s. Es retador: %t, Es oponente: %t, Duelo existe: %t", 
		playerID, duelID, isRequester, isOpponent, duelRequestExists)
	log.Printf("🔗 [ESTADO] Player1 existe: %t, Player2 existe: %t", 
		playersConnected.Player1 != nil, playersConnected.Player2 != nil)

	isPlayer1 := false

	// CASO 1: Es el RETADOR (quien solicita el duelo)
	if isRequester {
		// El retador se conecta después de solicitar el duelo
		// Debe ser asignado como Player1 y esperar la aceptación
		playersConnected.Player1 = player
		isPlayer1 = true
		duelsync.Mu.Unlock()
		
		if !duelRequestExists {
			conn.WriteMessage(websocket.TextMessage, []byte("El duelo no existe o ya expiró."))
			return
		}

		log.Printf("Retador %s esperando aceptación del duelo %s", playerID, duelID)
		
		// Esperar la aceptación del duelo
		duelsync.Mu.Lock()
		acceptChan, exists := duelsync.DuelRequests[duelID]
		duelsync.Mu.Unlock()
		
		if !exists {
			conn.WriteMessage(websocket.TextMessage, []byte("El duelo no existe o ya expiró."))
			return
		}
		
		select {
		case accepted := <-acceptChan:
			if !accepted {
				conn.WriteMessage(websocket.TextMessage, []byte("El duelo fue rechazado."))
				return
			}
			// El duelo fue aceptado, eliminamos el canal para evitar doble lectura
			duelsync.Mu.Lock()
			delete(duelsync.DuelRequests, duelID)
			duelsync.Mu.Unlock()
		case <-time.After(30 * time.Second):
			conn.WriteMessage(websocket.TextMessage, []byte("El duelo no fue aceptado a tiempo. Cerrando conexión."))
			// Limpiar estado
			duelsync.Mu.Lock()
			delete(duelsync.DuelRequests, duelID)
			delete(duelsync.DuelConnections, duelID)
			delete(duelsync.DuelSyncChans, duelID)
			duelsync.Mu.Unlock()
			return
		}
		
		// Duelo aceptado, esperando al oponente
		conn.WriteMessage(websocket.TextMessage, []byte("Duelo aceptado. Esperando al oponente..."))
		log.Printf("Retador %s: duelo %s aceptado. Esperando al oponente...", playerID, duelID)
		
		// Esperar a que el oponente se conecte
		<-syncChannel
		
		log.Printf("Retador %s: oponente conectado para el duelo %s", playerID, duelID)
		if err := player.SafeWriteMessage(websocket.TextMessage, []byte("¡Oponente conectado! El duelo comenzará pronto.")); err != nil {
			log.Printf("Error al enviar mensaje 'Oponente conectado' al retador %s: %v", playerID, err)
		}

	// CASO 2: Es el OPONENTE (quien acepta el duelo)  
	} else if isOpponent {
		// El oponente se conecta después de aceptar el duelo
		// El duelo ya debe haber sido aceptado, así que no debe existir en DuelRequests
		
		if duelRequestExists {
			duelsync.Mu.Unlock()
			conn.WriteMessage(websocket.TextMessage, []byte("El duelo aún no ha sido aceptado. Acepta primero el duelo."))
			return
		}
		
		// Verificar que el retador ya esté conectado
		if playersConnected.Player1 == nil {
			duelsync.Mu.Unlock()
			log.Printf("❌ [ERROR] Oponente %s intentó conectar pero retador no está conectado para duelo %s", playerID, duelID)
			conn.WriteMessage(websocket.TextMessage, []byte("El retador aún no se ha conectado. Espera un momento."))
			return
		}
		
		log.Printf("✅ [OK] Oponente %s conectando - retador %s ya está conectado", playerID, playersConnected.Player1.ID)
		
		// Asignar como Player2
		playersConnected.Player2 = player
		p1ToUse := playersConnected.Player1
		p2ToUse := playersConnected.Player2
		
		// Verificar que las asignaciones sean correctas antes de liberar el mutex
		log.Printf("🔍 [DEBUG] Antes de StartDuel - P1: %s (conn: %v), P2: %s (conn: %v)", 
			p1ToUse.ID, p1ToUse.Conn != nil, p2ToUse.ID, p2ToUse.Conn != nil)
		
		duelsync.Mu.Unlock()
		
		log.Printf("Oponente %s conectado al duelo %s. Notificando al retador %s e iniciando duelo.", 
			playerID, duelID, p1ToUse.ID)
		
		if err := player.SafeWriteMessage(websocket.TextMessage, []byte("¡Duelo listo!")); err != nil {
			log.Printf("Error al enviar mensaje 'Duelo listo' al oponente %s: %v", playerID, err)
		} else {
			log.Printf("✅ Mensaje '¡Duelo listo!' enviado exitosamente al oponente %s", playerID)
		}
		
		// Notificar al retador que el oponente se conectó
		syncChannel <- struct{}{}
		
		// Aumentar delay para asegurar que ambos jugadores procesen los mensajes y configuren sus listeners
		log.Printf("⏳ Esperando 2 segundos antes de iniciar el duelo para sincronización...")
		time.Sleep(2 * time.Second)
		
		// Iniciar el duelo
		log.Printf("Iniciando duelo %s: Retador %s vs Oponente %s", duelID, p1ToUse.ID, p2ToUse.ID)
		
		// Obtener preguntas aleatorias de la base de datos para el duelo
		questionService := services.NewQuestionService()
		questions, err := questionService.GetQuestionsForDuel(123)
		if err != nil {
			log.Printf("Error al obtener preguntas para el duelo %s: %v. Usando preguntas de respaldo.", duelID, err)
			questions = []models.Question{
				{ID: "backup1", Text: "¿Cuál es el río más largo del mundo?", Answer: "Nilo", Options: []string{"Amazonas", "Nilo", "Misisipi", "Yangtsé"}, Duration: 30},
				{ID: "backup2", Text: "¿Cuánto es 2+2?", Answer: "4", Options: []string{"3", "4", "5", "6"}, Duration: 30},
				{ID: "backup3", Text: "¿Quién pintó la Mona Lisa?", Answer: "Leonardo da Vinci", Options: []string{"Pablo Picasso", "Vincent van Gogh", "Leonardo da Vinci", "Miguel Ángel"}, Duration: 30},
				{ID: "backup4", Text: "¿Cuál es el planeta más grande del sistema solar?", Answer: "Júpiter", Options: []string{"Tierra", "Júpiter", "Saturno", "Marte"}, Duration: 30},
				{ID: "backup5", Text: "¿En qué año comenzó la Segunda Guerra Mundial?", Answer: "1939", Options: []string{"1914", "1939", "1945", "1918"}, Duration: 30},
			}
		}
		
		log.Printf("Duelo %s: Obtenidas %d preguntas para el duelo", duelID, len(questions))
		
		// Verificar nuevamente que ambos jugadores tengan conexiones válidas antes de StartDuel
		if p1ToUse.Conn == nil {
			log.Printf("❌ [ERROR CRÍTICO] P1 (%s) no tiene conexión válida antes de StartDuel", p1ToUse.ID)
			return
		}
		if p2ToUse.Conn == nil {
			log.Printf("❌ [ERROR CRÍTICO] P2 (%s) no tiene conexión válida antes de StartDuel", p2ToUse.ID)
			return
		}
		
		log.Printf("🚀 [INICIANDO] StartDuel con P1: %s, P2: %s, DuelID: %s", p1ToUse.ID, p2ToUse.ID, duelID)
		duelsync.StartDuel(p1ToUse, p2ToUse, duelID, questions, HandleDuel)
		
	// CASO 3: Jugador no autorizado 
	} else {
		duelsync.Mu.Unlock()
		log.Printf("Duelo %s: jugador %s no autorizado.", duelID, playerID)
		conn.WriteMessage(websocket.TextMessage, []byte("No puedes unirte a este duelo."))
		return
	}

	// Ambos jugadores (P1 después de ser notificado, P2 después de iniciar el duelo y notificar)
	// esperan aquí hasta que su participación en el duelo termine (HandleDuel cierra player.Done).
	playerRole := "P2"
	if isPlayer1 {
		playerRole = "P1"
	}
	log.Printf("Jugador %s (ID: %s) esperando finalización del duelo %s.", player.ID, playerRole, duelID)
	<-player.Done
	log.Printf("Jugador %s (ID: %s) finalizó participación en duelo %s. Cerrando conexión.", player.ID, playerRole, duelID)
	// defer conn.Close() se ejecutará al salir de WsHandler.
}
