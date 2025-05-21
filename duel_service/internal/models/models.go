package models

import (
	"github.com/gorilla/websocket"
	"sync"
)

// Player representa a un jugador en el duelo.
type Player struct {
	ID    string
	Score int
	Elo   int    // Puntuación ELO del jugador en el curso específico
	Rank  string // El rango actual del jugador, persistente
	Conn  *websocket.Conn
	Done  chan struct{}
	Mu    sync.Mutex // Mutex para proteger las escrituras a la conexión WebSocket
}

// SafeWriteJSON envía un mensaje JSON de manera segura usando el mutex
func (p *Player) SafeWriteJSON(v interface{}) error {
	p.Mu.Lock()
	defer p.Mu.Unlock()
	return p.Conn.WriteJSON(v)
}

// SafeWriteMessage envía un mensaje de texto de manera segura usando el mutex
func (p *Player) SafeWriteMessage(messageType int, data []byte) error {
	p.Mu.Lock()
	defer p.Mu.Unlock()
	return p.Conn.WriteMessage(messageType, data)
}

// PlayerData representa los datos de un jugador almacenados en MongoDB
type PlayerData struct {
	PlayerID string `bson:"player_id" json:"player_id"`
	Elo      int    `bson:"elo" json:"elo"`
	Rank     string `bson:"rank" json:"rank"`
}

// Question representa una pregunta del duelo.
type Question struct {
	ID       string   `json:"id"`
	Text     string   `json:"text"`
	Answer   string   `json:"answer"`
	Options  []string `json:"options"`
	Duration int      `json:"duration"`
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
