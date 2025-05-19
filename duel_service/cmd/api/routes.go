package main

import (
	"net/http"

	"courseclash/duel-service/internal/duelsync"
	duelhandlers "courseclash/duel-service/internal/handlers"
	"courseclash/duel-service/internal/models"

	"github.com/gin-gonic/gin"
)

// requestDuelHandler maneja la solicitud de un duelo.
// @Summary Solicita un duelo
// @Description Crea un nuevo duelo entre dos jugadores
// @Tags duelos
// @Accept json
// @Produce json
// @Param request body models.RequestDuelRequest true "Datos del duelo"
// @Success 200 {object} models.RequestDuelResponse
// @Failure 400 {object} models.ErrorResponseInvalidRequest "{\"invalid_request\":\"Invalid request\"}"
// @Failure 409 {object} models.ErrorResponseDuelAlreadyRequested "{\"duel_already_requested\":\"Duel already requested\"}"
// @Router /api/duels/request [post]
func requestDuelHandler(c *gin.Context) {
	var request models.RequestDuelRequest
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
}

// acceptDuelHandler maneja la aceptación de un duelo.
// @Summary Acepta un duelo
// @Description Permite que el oponente acepte un duelo existente
// @Tags duelos
// @Accept json
// @Produce json
// @Param accept body models.AcceptDuelRequest true "ID del duelo"
// @Success 200 {object} models.AcceptDuelResponse 
// @Failure 400 {object} models.ErrorResponseInvalidRequest "{\"invalid_request\":\"Invalid request\"}"
// @Failure 404 {object} models.ErrorResponseDuelNotFound "{\"duel_not_found\":\"Duel not found\"}"
// @Router /api/duels/accept [post]
func acceptDuelHandler(c *gin.Context) {
	var accept models.AcceptDuelRequest
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
}

// wsDuelHandler maneja la conexión WebSocket para un duelo.
// @Summary Conexión WebSocket para duelo
// @Description Establece una conexión WebSocket para un jugador en un duelo
// @Tags duelos
// @Produce json
// @Param duel_id path string true "ID del duelo"
// @Param player_id path string true "ID del jugador"
// @Success 101 {string} string "WebSocket connection established"
// @Router /ws/duels/{duel_id}/{player_id} [get]
func wsDuelHandler(c *gin.Context) {
	duelID := c.Param("duel_id")
	playerID := c.Param("player_id")
	duelhandlers.WsHandler(c.Writer, c.Request, duelID, playerID)
}

// RegisterRoutes configura todas las rutas del servidor Gin.
func RegisterRoutes(r *gin.Engine) {
	r.POST("/api/duels/request", requestDuelHandler)
	r.POST("/api/duels/accept", acceptDuelHandler)
	r.GET("/ws/duels/:duel_id/:player_id", wsDuelHandler)
}
