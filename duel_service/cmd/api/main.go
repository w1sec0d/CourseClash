package main

import (
	"log"
	"net/http"
	"sync" // Importar sync

	"courseclash/duel-service/internal/handlers"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

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
	duelSyncChans   = make(map[string]chan struct{}) // Canal para sincronizar la conexión de P1 y P2
	mu              sync.Mutex                      // Mutex para proteger el acceso a duelConnections y duelSyncChans
)

func main() {
	r := gin.Default()

	// Ruta que permite solicitar un duelo (lógica existente)
	r.POST("/api/duels/request", func(c *gin.Context) {
		var request struct {
			RequesterID string `json:"requester_id"`
			OpponentID  string `json:"opponent_id"`
		}
		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}
		duelID := request.RequesterID + "_vs_" + request.OpponentID
		mu.Lock() // Proteger acceso a duelRequests
		if _, exists := duelRequests[duelID]; exists {
			mu.Unlock()
			c.JSON(http.StatusConflict, gin.H{"error": "Duel already requested"})
			return
		}
		duelRequests[duelID] = make(chan bool)
		mu.Unlock()
		c.JSON(http.StatusOK, gin.H{"duel_id": duelID})
	})

	// Ruta que permite aceptar un duelo (lógica existente)
	r.POST("/api/duels/accept", func(c *gin.Context) {
		var accept struct {
			DuelID string `json:"duel_id"`
		}
		if err := c.ShouldBindJSON(&accept); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}
		mu.Lock() // Proteger acceso a duelRequests
		ch, exists := duelRequests[accept.DuelID]
		mu.Unlock() // Desbloquear pronto para no retener el lock durante la operación de canal
		if exists {
			ch <- true // Esto podría bloquear si nadie está escuchando en duelRequests[accept.DuelID]
			c.JSON(http.StatusOK, gin.H{"message": "Duel accepted"})
		} else {
			c.JSON(http.StatusNotFound, gin.H{"error": "Duel not found"})
		}
	})

	r.GET("/ws/duels/:duel_id/:player_id", func(c *gin.Context) {
		duelID := c.Param("duel_id")
		playerID := c.Param("player_id")
		wsHandler(c.Writer, c.Request, duelID, playerID)
	})

	log.Println("Servicio de Duelos iniciado en el puerto 8080")
	r.Run(":8080")
}

func wsHandler(w http.ResponseWriter, r *http.Request, duelID string, playerID string) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Error al actualizar a WebSocket para el jugador %s en el duelo %s: %v", playerID, duelID, err)
		return
	}
	defer conn.Close() // Se ejecutará cuando wsHandler retorne

	// Crear el canal Done para este jugador. HandleDuel lo cerrará.
	playerDoneChan := make(chan struct{})
	player := &handlers.Player{
		ID:    playerID,
		Score: 0,
		Conn:  conn,
		Done:  playerDoneChan, // Asignar el canal Done
	}

	mu.Lock()
	dc, dcExists := duelConnections[duelID]
	if !dcExists {
		dc = &DuelConnection{}
		duelConnections[duelID] = dc
	}

	syncChan, syncChanExists := duelSyncChans[duelID]
	if !syncChanExists {
		syncChan = make(chan struct{})
		duelSyncChans[duelID] = syncChan
	}

	isPlayer1 := false
	if dc.Player1 == nil { // Este es el Jugador 1
		dc.Player1 = player
		isPlayer1 = true
		mu.Unlock() // Desbloquear ANTES de la operación de bloqueo (espera en el canal)

		log.Printf("Jugador %s (P1) conectado al duelo %s. Esperando al oponente...", playerID, duelID)
		if err := conn.WriteMessage(websocket.TextMessage, []byte("Esperando al oponente...")); err != nil {
			log.Printf("Error al enviar mensaje 'Esperando oponente' a P1 %s: %v", playerID, err)
			return // Salir si no se puede comunicar
		}

		<-syncChan // Esperar señal del Jugador 2

		log.Printf("Jugador %s (P1) notificado por P2 para el duelo %s.", playerID, duelID)
		if err := conn.WriteMessage(websocket.TextMessage, []byte("¡Oponente conectado! El duelo comenzará pronto.")); err != nil {
			log.Printf("Error al enviar mensaje 'Oponente conectado' a P1 %s: %v", playerID, err)
			// No retornar necesariamente, P1 aún debe esperar en player.Done
		}
		// P1 no llama a startDuel; P2 lo hará. P1 ahora espera a que el duelo termine.

	} else if dc.Player2 == nil { // Este es el Jugador 2
		dc.Player2 = player
		// Capturar P1 y P2 para startDuel. Es seguro leer dc.Player1 aquí porque está protegido por el mutex.
		p1ToUse := dc.Player1
		p2ToUse := dc.Player2
		mu.Unlock() // Desbloquear después de asignar Player2 y capturar P1/P2

		log.Printf("Jugador %s (P2) conectado al duelo %s. Notificando a P1 (%s) e iniciando duelo.", playerID, duelID, p1ToUse.ID)
		if err := conn.WriteMessage(websocket.TextMessage, []byte("¡Duelo listo!")); err != nil {
			log.Printf("Error al enviar mensaje 'Duelo listo' a P2 %s: %v", playerID, err)
			// No retornar, aún necesitamos notificar a P1 e iniciar el duelo.
		}

		// P2 inicia el duelo
		log.Printf("P2 (%s) iniciando duelo con P1 (%s) para el duelID %s.", p2ToUse.ID, p1ToUse.ID, duelID)
		startDuel(p1ToUse, p2ToUse, duelID)

		syncChan <- struct{}{} // Notificar al Jugador 1 que P2 está listo y el duelo ha comenzado/está comenzando
		// P2 ahora espera a que el duelo termine.

	} else { // Duelo lleno
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
	// defer conn.Close() se ejecutará al salir de wsHandler.
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
