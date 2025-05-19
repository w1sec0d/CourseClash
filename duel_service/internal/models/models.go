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

// RequestDuelRequest representa el body para solicitar un duelo.
type RequestDuelRequest struct {
	RequesterID string `json:"requester_id" example:"player123" binding:"required"`
	OpponentID  string `json:"opponent_id" example:"player456" binding:"required"`
}

// AcceptDuelRequest representa el body para aceptar un duelo.
type AcceptDuelRequest struct {
	DuelID string `json:"duel_id" example:"player123_vs_player456" binding:"required"`
}
