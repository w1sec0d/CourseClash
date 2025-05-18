package main

import (
	"net/http"

	"courseclash/duel-service/internal/duelsync"
	duelhandlers "courseclash/duel-service/internal/handlers"

	"github.com/gin-gonic/gin"
)

// RegisterRoutes configura todas las rutas del servidor Gin.
func RegisterRoutes(r *gin.Engine) {
	// * Ruta que permite solicitar un duelo
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
		duelsync.Mu.Lock()
		if _, exists := duelsync.DuelRequests[duelID]; exists {
			duelsync.Mu.Unlock()
			c.JSON(http.StatusConflict, gin.H{"error": "Duel already requested"})
			return
		}
		duelsync.DuelRequests[duelID] = make(chan bool)
		duelsync.Mu.Unlock()
		c.JSON(http.StatusOK, gin.H{"duel_id": duelID})
	})

	// *  Ruta que permite aceptar un duelo
	r.POST("/api/duels/accept", func(c *gin.Context) {
		var accept struct {
			DuelID string `json:"duel_id"`
		}
		if err := c.ShouldBindJSON(&accept); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}
		duelsync.Mu.Lock()
		channel, exists := duelsync.DuelRequests[accept.DuelID]
		duelsync.Mu.Unlock()
		if exists {
			channel <- true
			c.JSON(http.StatusOK, gin.H{"message": "Duel accepted"})
		} else {
			c.JSON(http.StatusNotFound, gin.H{"error": "Duel not found"})
		}
	})

	// * Ruta para que un jugador pueda acceder a la conexión web socket.
	r.GET("/ws/duels/:duel_id/:player_id", func(c *gin.Context) {
		duelID := c.Param("duel_id")
		playerID := c.Param("player_id")
		duelhandlers.WsHandler(c.Writer, c.Request, duelID, playerID)
	})
}
