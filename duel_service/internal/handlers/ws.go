package handlers

import (
	"log"
	"net/http"

	"courseclash/duel-service/internal/duelcore"
	"courseclash/duel-service/internal/models"

	"github.com/gorilla/websocket"
)

// WsHandler gestiona la conexión WebSocket de un jugador para un duelo.
func WsHandler(w http.ResponseWriter, r *http.Request, duelID string, playerID string) {
	conn, err := duelcore.Upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Error al actualizar a WebSocket para el jugador %s en el duelo %s: %v", playerID, duelID, err)
		return
	}
	defer conn.Close()

	playerDoneChan := make(chan struct{})
	player := &models.Player{
		ID:    playerID,
		Score: 0,
		Conn:  conn,
		Done:  playerDoneChan,
	}

	duelcore.Mu.Lock()
	playersConnected, playersConnectedExists := duelcore.DuelConnections[duelID]
	if !playersConnectedExists {
		playersConnected = &models.DuelConnection{}
		duelcore.DuelConnections[duelID] = playersConnected
	}
	syncChannel, syncChannelExists := duelcore.DuelSyncChans[duelID]
	if !syncChannelExists {
		syncChannel = make(chan struct{})
		duelcore.DuelSyncChans[duelID] = syncChannel
	}
	isPlayer1 := false
	if playersConnected.Player1 == nil {
		playersConnected.Player1 = player
		isPlayer1 = true
		duelcore.Mu.Unlock()
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
		duelcore.Mu.Unlock()
		log.Printf("Jugador %s (P2) conectado al duelo %s. Notificando a P1 (%s) e iniciando duelo.", playerID, duelID, p1ToUse.ID)
		if err := conn.WriteMessage(websocket.TextMessage, []byte("¡Duelo listo!")); err != nil {
			log.Printf("Error al enviar mensaje 'Duelo listo' a P2 %s: %v", playerID, err)
		}
		log.Printf("P2 (%s) iniciando duelo con P1 (%s) para el duelID %s.", p2ToUse.ID, p1ToUse.ID, duelID)
		questions := []models.Question{
			{ID: "1", Text: "¿Cuál es la capital de Francia?", Answer: "Paris", Duration: 10},
			{ID: "2", Text: "¿Cuánto es 2+2?", Answer: "4", Duration: 5},
		}
		duelcore.StartDuel(p1ToUse, p2ToUse, duelID, questions, HandleDuel)
		syncChannel <- struct{}{}
	} else {
		duelcore.Mu.Unlock()
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
