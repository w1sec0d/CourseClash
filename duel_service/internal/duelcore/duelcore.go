package duelcore

import (
	"log"
	"net/http"
	"sync"

	"courseclash/duel-service/internal/handlers"

	"github.com/gorilla/websocket"
)

// VARIABLES Y ESTRUCTURAS ---------------------------------------------

var Upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// En este map se almacenan los desafios de los duelos
var DuelRequests = make(map[string]chan bool)

// DuelConnection almacena los jugadores de un duelo.
type DuelConnection struct {
	Player1 *handlers.Player
	Player2 *handlers.Player
}

var (
	DuelConnections = make(map[string]*DuelConnection)
	// Canal para sincronizar la conexión de P1 y P2, es decir un estudiante con otro
	DuelSyncChans   = make(map[string]chan struct{})
	// Mutex para proteger el acceso a DuelConnections y DuelSyncChans 
	Mu              sync.Mutex                      
)

// WsHandler gestiona la conexión WebSocket de un jugador para un duelo.
func WsHandler(w http.ResponseWriter, r *http.Request, duelID string, playerID string) {
	conn, err := Upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Error al actualizar a WebSocket para el jugador %s en el duelo %s: %v", playerID, duelID, err)
		return
	}
	defer conn.Close()

	playerDoneChan := make(chan struct{})
	player := &handlers.Player{
		ID:    playerID,
		Score: 0,
		Conn:  conn,
		Done:  playerDoneChan,
	}

	Mu.Lock()
	playersConnected, playersConnectedExists := DuelConnections[duelID]
	if !playersConnectedExists {
		playersConnected = &DuelConnection{}
		DuelConnections[duelID] = playersConnected
	}
	syncChannel, syncChannelExists := DuelSyncChans[duelID]
	if !syncChannelExists {
		syncChannel = make(chan struct{})
		DuelSyncChans[duelID] = syncChannel
	}
	isPlayer1 := false
	if playersConnected.Player1 == nil {
		playersConnected.Player1 = player
		isPlayer1 = true
		Mu.Unlock()
		log.Printf("Jugador %s (P1) conectado al duelo %s. Esperando al oponente...", playerID, duelID)
		if err := conn.WriteMessage(websocket.TextMessage, []byte("Esperando al oponente...")); err != nil {
			log.Printf("Error al enviar mensaje 'Esperando oponente' a P1 %s: %v", playerID, err)
			return
		}
		<-syncChannel
		log.Printf("Jugador %s (P1) notificado por P2 para el duelo %s.", playerID, duelID)
		if err := conn.WriteMessage(websocket.TextMessage, []byte("¡Oponente conectado! El duelo comenzará pronto.")); err != nil {
			log.Printf("Error al enviar mensaje 'Oponente conectado' a P1 %s: %v", playerID, err)
		}
	} else if playersConnected.Player2 == nil {
		playersConnected.Player2 = player
		p1ToUse := playersConnected.Player1
		p2ToUse := playersConnected.Player2
		Mu.Unlock()
		log.Printf("Jugador %s (P2) conectado al duelo %s. Notificando a P1 (%s) e iniciando duelo.", playerID, duelID, p1ToUse.ID)
		if err := conn.WriteMessage(websocket.TextMessage, []byte("¡Duelo listo!")); err != nil {
			log.Printf("Error al enviar mensaje 'Duelo listo' a P2 %s: %v", playerID, err)
		}
		log.Printf("P2 (%s) iniciando duelo con P1 (%s) para el duelID %s.", p2ToUse.ID, p1ToUse.ID, duelID)
		StartDuel(p1ToUse, p2ToUse, duelID)
		syncChannel <- struct{}{}
	} else {
		Mu.Unlock()
		log.Printf("Duelo %s ya tiene dos jugadores. Jugador %s (%s) no puede unirse.", duelID, player.ID, playerID)
		conn.WriteMessage(websocket.TextMessage, []byte("Ya hay dos jugadores conectados."))
		return
	}
	playerRole := "P2"
	if isPlayer1 {
		playerRole = "P1"
	}
	log.Printf("Jugador %s (ID: %s) esperando finalización del duelo %s.", player.ID, playerRole, duelID)
	<-player.Done
	log.Printf("Jugador %s (ID: %s) finalizó participación en duelo %s. Cerrando conexión.", player.ID, playerRole, duelID)
}

// StartDuel inicia el duelo entre dos jugadores.
func StartDuel(player1, player2 *handlers.Player, duelID string) {
	if player1 == nil || player2 == nil {
		log.Printf("Error en startDuel para el duelo %s: uno o ambos jugadores son nil. P1: %v, P2: %v", duelID, player1, player2)
		if p1c := player1; p1c != nil && p1c.Conn != nil {
			p1c.Conn.WriteMessage(websocket.TextMessage, []byte("Error al iniciar el duelo: oponente no encontrado o inválido."))
		}
		if p2c := player2; p2c != nil && p2c.Conn != nil {
			p2c.Conn.WriteMessage(websocket.TextMessage, []byte("Error al iniciar el duelo: oponente no encontrado o inválido."))
		}
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
	go handlers.HandleDuel(player1, player2, questions)
	log.Printf("Goroutine HandleDuel iniciada para el duelo %s entre %s y %s", duelID, player1.ID, player2.ID)
}
