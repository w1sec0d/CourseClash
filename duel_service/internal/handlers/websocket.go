package handlers

import (
	"log"
	"net/http"
	"strings"
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
	// Validar que el jugador sea parte del duelo
	// El formato del duelID es "requesterID_vs_opponentID"
	validPlayer := false
	
	// Extraer los IDs de los jugadores del duelID
	parts := strings.Split(duelID, "_vs_")
	if len(parts) == 2 {
		requesterID := parts[0]
		opponentID := parts[1]
		
		// Verificar si el playerID corresponde a alguno de los jugadores del duelo
		if playerID == requesterID || playerID == opponentID {
			validPlayer = true
		}
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

	isPlayer1 := false
	isFirstConnection := false
	// En caso de que el player 1 no este conectado la primera conexión webSocket será la de el.
	if playersConnected.Player1 == nil {
		playersConnected.Player1 = player
		isPlayer1 = true
		isFirstConnection = true
	}
	duelsync.Mu.Unlock()

	if isPlayer1 && isFirstConnection {
		// Solo el retador espera la aceptación del duelo
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
		// Si fue aceptado, ahora sí espera al oponente
		conn.WriteMessage(websocket.TextMessage, []byte("Duelo aceptado. Esperando al oponente..."))
		log.Printf("Jugador %s (P1) conectado al duelo %s. Esperando al oponente...", playerID, duelID)
		<-syncChannel
		log.Printf("Jugador %s (P1) notificado por P2 para el duelo %s.", playerID, duelID)
		// Ahora la conexión ya está asignada a un Player, usamos el método seguro
		if err := player.SafeWriteMessage(websocket.TextMessage, []byte("¡Oponente conectado! El duelo comenzará pronto.")); err != nil {
			log.Printf("Error al enviar mensaje 'Oponente conectado' a P1 %s: %v", playerID, err)
			// No retornar necesariamente, P1 aún debe esperar en player.Done
		}

	// Lógica para cuando el jugador se conecta
	} else if playersConnected.Player2 == nil {
		// El oponente solo puede entrar si el duelo ya fue aceptado
		duelsync.Mu.Lock()
		_, exists := duelsync.DuelRequests[duelID]
		duelsync.Mu.Unlock()
		if exists {
			conn.WriteMessage(websocket.TextMessage, []byte("No puedes unirte hasta que el duelo sea aceptado."))
			return
		}
		playersConnected.Player2 = player
		// Capturar P1 y P2 para startDuel. Es seguro leer playersConnected.Player1 aquí porque está protegido por el mutex.
		p1ToUse := playersConnected.Player1
		p2ToUse := playersConnected.Player2
		log.Printf("Jugador %s (P2) conectado al duelo %s. Notificando a P1 (%s) e iniciando duelo.", playerID, duelID, p1ToUse.ID)
		// Ahora la conexión ya está asignada a un Player, usamos el método seguro
		if err := player.SafeWriteMessage(websocket.TextMessage, []byte("¡Duelo listo!")); err != nil {
			log.Printf("Error al enviar mensaje 'Duelo listo' a P2 %s: %v", playerID, err)
			// No retornar, aún necesitamos notificar a P1 e iniciar el duelo.
		}

		
		// Notifica al Jugador 1 que P2 está listo y el duelo ha comenzado/está comenzando
		syncChannel <- struct{}{}
		
		// P2 inicia el duelo
		log.Printf("P2 (%s) iniciando duelo con P1 (%s) para el duelID %s.", p2ToUse.ID, p1ToUse.ID, duelID)
		
		// Obtener preguntas aleatorias de la base de datos para el duelo
		questionService := services.NewQuestionService()
		questions, err := questionService.GetQuestionsForDuel(123) // Usar el curso 123 como ejemplo
		if err != nil {
			log.Printf("Error al obtener preguntas para el duelo %s: %v. Usando preguntas de respaldo.", duelID, err)
			// Usar preguntas de respaldo en caso de error
			questions = []models.Question{
				{ID: "1", Text: "¿Cuál es la capital de Francia?", Answer: "París", Options: []string{"Madrid", "París", "Londres", "Roma"}, Duration: 30},
				{ID: "2", Text: "¿Cuánto es 2+2?", Answer: "4", Options: []string{"3", "4", "5", "6"}, Duration: 30},
				{ID: "3", Text: "¿Quién pintó la Mona Lisa?", Answer: "Leonardo da Vinci", Options: []string{"Pablo Picasso", "Vincent van Gogh", "Leonardo da Vinci", "Miguel Ángel"}, Duration: 30},
				{ID: "4", Text: "¿Cuál es el planeta más grande del sistema solar?", Answer: "Júpiter", Options: []string{"Tierra", "Júpiter", "Saturno", "Marte"}, Duration: 30},
				{ID: "5", Text: "¿En qué año comenzó la Segunda Guerra Mundial?", Answer: "1939", Options: []string{"1914", "1939", "1945", "1918"}, Duration: 30},
			}
		}
		
		log.Printf("Duelo %s: Obtenidas %d preguntas para el duelo", duelID, len(questions))
		duelsync.StartDuel(p1ToUse, p2ToUse, duelID, questions, HandleDuel)
		
	// En caso de que el duelo este lleno
	} else {
		log.Printf("Duelo %s ya tiene dos jugadores. Jugador %s (%s) no puede unirse.", duelID, player.ID, playerID)
		conn.WriteMessage(websocket.TextMessage, []byte("Ya hay dos jugadores conectados."))
		return // Salir temprano, no esperar en player.Done
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
