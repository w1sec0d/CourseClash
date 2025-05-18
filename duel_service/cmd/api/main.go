package main

import (
	"log"
	"net/http"
	"sync" // Importar sync

	"courseclash/duel-service/internal/handlers"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

// VARIABLES Y ESTRUCTURAS ---------------------------------------------

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// En este map se almdacenan los desafios de los duelos
var duelRequests = make(map[string]chan bool)

// DuelConnection almacena los jugadores de un duelo.
type DuelConnection struct {
	Player1 *handlers.Player
	Player2 *handlers.Player
}

var (
	duelConnections = make(map[string]*DuelConnection)
	// Canal para sincronizar la conexión de P1 y P2, es decir un estudiante con otro
	duelSyncChans   = make(map[string]chan struct{})
	// Mutex para proteger el acceso a duelConnections y duelSyncChans 
	mu              sync.Mutex                      
)

//----------------------------------------------------------------------------------

func main() {
	r := gin.Default()

	RegisterRoutes(r)

	log.Println("Servicio de Duelos iniciado en el puerto 8080")
	r.Run(":8080")
}

func wsHandler(w http.ResponseWriter, r *http.Request, duelID string, playerID string) {
	// Verificar si el duelo fue aceptado
	mu.Lock()
	channel, exists := duelRequests[duelID]
	mu.Unlock()
	if !exists {
		log.Printf("El duelo %s no ha sido solicitado o aceptado. Jugador %s no puede unirse.", duelID, playerID)
		http.Error(w, "El duelo no ha sido aceptado.", http.StatusForbidden)
		return
	}

	select {
	case <-channel: // Esperar a que el duelo sea aceptado
		log.Printf("El duelo %s fue aceptado. Jugador %s puede unirse.", duelID, playerID)
	default:
		log.Printf("El duelo %s aún no ha sido aceptado. Jugador %s no puede unirse.", duelID, playerID)
		http.Error(w, "El duelo no ha sido aceptado.", http.StatusForbidden)
		return
	}

	//Eleva o actualiza el estado de la conexión HTTP del jugador a WebSocket
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Error al actualizar a WebSocket para el jugador %s en el duelo %s: %v", playerID, duelID, err)
		return
	}
	// Termina la conexión cuando todo se ha ejecutado
	defer conn.Close() 

	// Crear el canal Done para este jugador. Este canal permite reconocder cuando un jugador termino
	playerDoneChan := make(chan struct{})
	
	//Asigna la conexión webSocket al jugador
	player := &handlers.Player{
		ID:    playerID,
		Score: 0,
		Conn:  conn,
		Done:  playerDoneChan,
	}

	mu.Lock()

	// Verifica si hay un mapa de las conexiones de los jugadores para un duelo determinado
	// Si no hay lo crea y lo asigna a playersConnected
	playersConnected, playersConnectedExists := duelConnections[duelID]
	if !playersConnectedExists {
		playersConnected = &DuelConnection{}
		duelConnections[duelID] = playersConnected
	}

	//Revisa si existe un canal para sincronizar el duelo, si no lo hay lo crea
	syncChannel, syncChannelExists := duelSyncChans[duelID]
	if !syncChannelExists {
		syncChannel = make(chan struct{})
		duelSyncChans[duelID] = syncChannel
	}

	isPlayer1 := false
	//En caso de que el player 1 no este conectado la primera conexión webSocket será la de el.
	if playersConnected.Player1 == nil { 
		playersConnected.Player1 = player
		isPlayer1 = true
		mu.Unlock() 

		//En caso de que salga bien escribe en la conexión webSocket Esperando al oponente
		log.Printf("Jugador %s (P1) conectado al duelo %s. Esperando al oponente...", playerID, duelID)
		if err := conn.WriteMessage(websocket.TextMessage, []byte("Esperando al oponente...")); err != nil {
			log.Printf("Error al enviar mensaje 'Esperando oponente' a P1 %s: %v", playerID, err)
			return // Salir si no se puede comunicar
		}
		
		// El jugador 1(estudiante) se queda esperando a que el segundo jugador envie un valor al canal (es decir cuándo se conecte)
		<-syncChannel 

		log.Printf("Jugador %s (P1) notificado por P2 para el duelo %s.", playerID, duelID)
		if err := conn.WriteMessage(websocket.TextMessage, []byte("¡Oponente conectado! El duelo comenzará pronto.")); err != nil {
			log.Printf("Error al enviar mensaje 'Oponente conectado' a P1 %s: %v", playerID, err)
			// No retornar necesariamente, P1 aún debe esperar en player.Done
		}

	//Lógica para cuando el jugador se conecta
	} else if playersConnected.Player2 == nil { 
		playersConnected.Player2 = player
		// Capturar P1 y P2 para startDuel. Es seguro leer playersConnected.Player1 aquí porque está protegido por el mutex.
		p1ToUse := playersConnected.Player1
		p2ToUse := playersConnected.Player2
		mu.Unlock() 

		log.Printf("Jugador %s (P2) conectado al duelo %s. Notificando a P1 (%s) e iniciando duelo.", playerID, duelID, p1ToUse.ID)
		if err := conn.WriteMessage(websocket.TextMessage, []byte("¡Duelo listo!")); err != nil {
			log.Printf("Error al enviar mensaje 'Duelo listo' a P2 %s: %v", playerID, err)
			// No retornar, aún necesitamos notificar a P1 e iniciar el duelo.
		}

		// P2 inicia el duelo
		log.Printf("P2 (%s) iniciando duelo con P1 (%s) para el duelID %s.", p2ToUse.ID, p1ToUse.ID, duelID)
		startDuel(p1ToUse, p2ToUse, duelID)

		// Notifica al Jugador 1 que P2 está listo y el duelo ha comenzado/está comenzando
		syncChannel <- struct{}{} 

		//En caso de que el duelo este lleno
	} else { 
		mu.Unlock()
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
	// defer conn.Close() se ejque es dc en este códigoecutará al salir de wsHandler.
}

func startDuel(player1, player2 *handlers.Player, duelID string) {
	if player1 == nil || player2 == nil {
		log.Printf("Error en startDuel para el duelo %s: uno o ambos jugadores son nil. P1: %v, P2: %v", duelID, player1, player2)
		// Notificar a los jugadores conectados si es posible y sus conexiones no son nil.
		if p1c := player1; p1c != nil && p1c.Conn != nil {
			p1c.Conn.WriteMessage(websocket.TextMessage, []byte("Error al iniciar el duelo: oponente no encontrado o inválido."))
		}
		if p2c := player2; p2c != nil && p2c.Conn != nil {
			p2c.Conn.WriteMessage(websocket.TextMessage, []byte("Error al iniciar el duelo: oponente no encontrado o inválido."))
		}
		// Si los jugadores son nil, sus canales Done no se cerrarán por HandleDuel.
		// Debemos cerrarlos aquí para evitar que wsHandler bloquee indefinidamente.
		if player1 != nil && player1.Done != nil { close(player1.Done) }
		if player2 != nil && player2.Done != nil { close(player2.Done) }
		return
	}
	if player1.Conn == nil || player2.Conn == nil {
		log.Printf("Error en startDuel para el duelo %s: uno o ambos jugadores tienen conexión nil. P1 conn: %v, P2 conn: %v", duelID, player1.Conn, player2.Conn)
		if player1.Conn == nil && player2.Conn != nil {
			player2.Conn.WriteMessage(websocket.TextMessage, []byte("Error: El oponente se desconectó antes de iniciar el duelo."))
		}
		if player2.Conn == nil && player1.Conn != nil {
			player1.Conn.WriteMessage(websocket.TextMessage, []byte("Error: El oponente se desconectó antes de iniciar el duelo."))
		}
		if player1.Done != nil { close(player1.Done) }
		if player2.Done != nil { close(player2.Done) }
		return
	}

	log.Printf("Iniciando duelo %s entre %s y %s", duelID, player1.ID, player2.ID)
	questions := []handlers.Question{
		{ID: "1", Text: "¿Cuál es la capital de Francia?", Answer: "Paris", Duration: 10},
		{ID: "2", Text: "¿Cuánto es 2+2?", Answer: "4", Duration: 5},
	}

	// Iniciar HandleDuel en una nueva goroutine.
	// HandleDuel será responsable de cerrar los canales Done de los jugadores.
	go handlers.HandleDuel(player1, player2, questions)
	log.Printf("Goroutine HandleDuel iniciada para el duelo %s entre %s y %s", duelID, player1.ID, player2.ID)
}
