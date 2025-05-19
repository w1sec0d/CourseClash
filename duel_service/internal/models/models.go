package models

import (
	"github.com/gorilla/websocket"
)

// Player representa a un jugador en el duelo.
type Player struct {
	ID    string
	Score int
	Rank  string // El rango actual del jugador, persistente
	Conn  *websocket.Conn
	Done  chan struct{}
}

// Question representa una pregunta del duelo.
type Question struct {
	ID       string
	Text     string
	Answer   string
	Duration int
}

// DuelConnection almacena los jugadores de un duelo.
type DuelConnection struct {
	Player1 *Player
	Player2 *Player
}
