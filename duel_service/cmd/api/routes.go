package main

import (
	"net/http"

	"courseclash/duel-service/internal/duelsync"
	duelhandlers "courseclash/duel-service/internal/handlers"
	"courseclash/duel-service/internal/models"
	"courseclash/duel-service/internal/repositories"

	"github.com/gin-gonic/gin"
)

// requestDuelHandler maneja la solicitud de un duelo.
// @Summary Solicita un duelo
// @Description Crea un nuevo duelo entre dos jugadores
// @Tags duelos
// @Accept json
// @Produce json
// @Param request body models.RequestDuelRequest true "Datos del duelo" example:{"requester_id":"player123","opponent_id":"player456"}
// @Success 200 {object} models.RequestDuelResponse "Duelo solicitado exitosamente"
// @Failure 400 {object} models.ErrorResponseInvalidRequest "Solicitud inválida o malformada"
// @Failure 409 {object} models.ErrorResponseDuelAlreadyRequested "Ya existe un duelo entre estos jugadores"
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
	message := "Duelo solicitado exitosamente"
	c.JSON(http.StatusOK, gin.H{"duel_id": duelID, "message": message})
}

// acceptDuelHandler maneja la aceptación de un duelo.
// @Summary Acepta un duelo
// @Description Permite que el oponente acepte un duelo existente
// @Tags duelos
// @Accept json
// @Produce json
// @Param accept body models.AcceptDuelRequest true "ID del duelo" example:{"duel_id":"player123_vs_player456"}
// @Success 200 {object} models.AcceptDuelResponse "Duelo aceptado exitosamente"
// @Failure 400 {object} models.ErrorResponseInvalidRequest "Solicitud inválida o malformada"
// @Failure 404 {object} models.ErrorResponseDuelNotFound "No se encontró el duelo con el ID proporcionado"
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
// @Description Establece una conexión WebSocket para un jugador en un duelo. Permite la comunicación en tiempo real durante el duelo.
// @Tags duelos
// @Produce json
// @Param duel_id path string true "ID del duelo" example:"player123_vs_player456"
// @Param player_id path string true "ID del jugador" example:"player123"
// @Success 101 {string} string "Conexión WebSocket establecida para comunicación en tiempo real durante el duelo"
// @Failure 404 {object} string "Duelo no encontrado"
// @Failure 401 {object} string "Jugador no autorizado para este duelo"
// @Router /ws/duels/{duel_id}/{player_id} [get]
func wsDuelHandler(c *gin.Context) {
	duelID := c.Param("duel_id")
	playerID := c.Param("player_id")
	duelhandlers.WsHandler(c.Writer, c.Request, duelID, playerID)
}

// getPlayerHandler obtiene la información de un jugador por su ID.
// @Summary Obtiene información de un jugador
// @Description Obtiene los datos de un jugador por su ID, incluyendo ELO y rango
// @Tags jugadores
// @Produce json
// @Param player_id path string true "ID del jugador" example:"player123"
// @Success 200 {object} models.PlayerData "Información del jugador"
// @Failure 500 {object} models.ErrorResponse "Error interno del servidor"
// @Router /api/players/{player_id} [get]
func getPlayerHandler(c *gin.Context) {
	playerID := c.Param("player_id")
	
	// Crear una instancia del repositorio de jugadores
	playerRepo := repositories.NewPlayerRepository()
	
	// Obtener los datos del jugador
	playerData, err := playerRepo.GetPlayerByID(playerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener información del jugador"})
		return
	}
	
	// Devolver los datos del jugador
	c.JSON(http.StatusOK, playerData)
}

// RegisterRoutes configura todas las rutas del servidor Gin.
func RegisterRoutes(r *gin.Engine) {
	r.POST("/api/duels/request", requestDuelHandler)
	r.POST("/api/duels/accept", acceptDuelHandler)
	r.GET("/ws/duels/:duel_id/:player_id", wsDuelHandler)
	r.GET("/api/players/:player_id", getPlayerHandler)
}
