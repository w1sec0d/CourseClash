package duelsync

import (
	"log"
	"net/http"
	"sync"

	"courseclash/duel-service/internal/models"

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

// DuelConnections es el mapa que almacena las conexiones de los duelos activos
var (
	DuelConnections = make(map[string]*models.DuelConnection)
	// Canal para sincronizar la conexión de P1 y P2, es decir un estudiante con otro
	DuelSyncChans   = make(map[string]chan struct{})
	// Mutex para proteger el acceso a DuelConnections y DuelSyncChans 
	Mu              sync.Mutex                      
)

// StartDuel inicia el duelo entre dos jugadores.
// Ahora solo coordina, la llamada a HandleDuel debe hacerse desde handlers/ws.go
func StartDuel(player1, player2 *models.Player, duelID string, questions []models.Question, handleDuelFunc func(*models.Player, *models.Player, []models.Question)) {
	if player1 == nil || player2 == nil {
		log.Printf("Error en startDuel para el duelo %s: uno o ambos jugadores son nil. P1: %v, P2: %v", duelID, player1, player2)
		if p1c := player1; p1c != nil && p1c.Conn != nil {
			p1c.SafeWriteMessage(websocket.TextMessage, []byte("Error al iniciar el duelo: oponente no encontrado o inválido."))
		}
		if p2c := player2; p2c != nil && p2c.Conn != nil {
			p2c.SafeWriteMessage(websocket.TextMessage, []byte("Error al iniciar el duelo: oponente no encontrado o inválido."))
		}
		if player1 != nil && player1.Done != nil { close(player1.Done) }
		if player2 != nil && player2.Done != nil { close(player2.Done) }
		return
	}
	if player1.Conn == nil || player2.Conn == nil {
		log.Printf("Error en startDuel para el duelo %s: uno o ambos jugadores tienen conexión nil. P1 conn: %v, P2 conn: %v", duelID, player1.Conn, player2.Conn)
		if player2.Conn != nil && player1.Conn == nil {
			player2.SafeWriteMessage(websocket.TextMessage, []byte("Error: El oponente se desconectó antes de iniciar el duelo."))
		}
		if player2.Conn == nil && player1.Conn != nil {
			player1.SafeWriteMessage(websocket.TextMessage, []byte("Error: El oponente se desconectó antes de iniciar el duelo."))
		}
		if player1.Done != nil { close(player1.Done) }
		if player2.Done != nil { close(player2.Done) }
		return
	}
	log.Printf("Iniciando duelo %s entre %s y %s", duelID, player1.ID, player2.ID)
	go handleDuelFunc(player1, player2, questions)
	log.Printf("Goroutine HandleDuel iniciada para el duelo %s entre %s y %s", duelID, player1.ID, player2.ID)
}
