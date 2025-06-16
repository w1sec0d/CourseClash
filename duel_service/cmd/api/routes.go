package main

import (
	"net/http"
	"strconv"
	"time"

	"courseclash/duel-service/internal/broker"
	duelhandlers "courseclash/duel-service/internal/handlers"
	"courseclash/duel-service/internal/models"
	"courseclash/duel-service/internal/repositories"
	"courseclash/duel-service/internal/services"

	"log"

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
	
	// Crear el duelo usando el repositorio con la categoría especificada
	duelRepo := repositories.NewDuelRepository()
	duel, err := duelRepo.CreateDuel(request.RequesterID, request.OpponentID, request.Category)
	if err != nil {
		if err.Error() == "ya existe un duelo pendiente entre estos jugadores" {
			c.JSON(http.StatusConflict, gin.H{"error": "Duel already requested"})
			return
		}
		log.Printf("Error al crear duelo: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error interno del servidor"})
		return
	}
	
	// Convertir el ID del duelo a string para mantener compatibilidad
	duelID := strconv.Itoa(duel.ID)
	
	message := "Duelo solicitado exitosamente"
	
	// Obtener información del solicitante para la notificación
	playerRepo := repositories.NewPlayerRepository()
	requesterData, err := playerRepo.GetPlayerByID(request.RequesterID)
	
	var requesterName string
	if err != nil {
		// Si no podemos obtener los datos del solicitante, usamos su ID como nombre
		requesterName = request.RequesterID
	} else {
		// Si podemos obtener los datos, usamos su nombre o información relevante
		requesterName = requesterData.PlayerID // Aquí podrías usar otro campo como el nombre completo
	}
	
	// Enviar notificación al oponente si está conectado
	notification := map[string]interface{}{
		"type": "duel_request",
		"duelId": duelID,
		"requesterId": request.RequesterID,
		"requesterName": requesterName,
		"timestamp": time.Now().Format(time.RFC3339),
	}
	
	// Enviar notificación a través de RabbitMQ (no bloqueante)
	go func() {
		// Enviar notificación a través de RabbitMQ únicamente
		client := broker.GetGlobalClient()
		if client != nil {
			// Crear el evento de notificación
			notificationEvent := broker.DuelEvent{
				Type:   "notification",
				DuelID: duelID,
				UserID: request.OpponentID,
				Data:   map[string]interface{}{
					"userId":       request.OpponentID,
					"notification": notification,
				},
			}
			
			err := client.PublishDuelEvent("duel.websocket.notification", notificationEvent)
			if err != nil {
				log.Printf("Error al enviar notificación a RabbitMQ para usuario %s: %v", request.OpponentID, err)
			} else {
				log.Printf("Notificación de duelo enviada a RabbitMQ para usuario %s, duelo %s", request.OpponentID, duelID)
			}
		} else {
			log.Printf("Error: RabbitMQ client no disponible - no se puede enviar notificación a %s", request.OpponentID)
		}
	}()
	
	c.JSON(http.StatusOK, gin.H{"duel_id": duelID, "message": message})
}

// acceptDuelHandler maneja la aceptación de un duelo.
// @Summary Acepta un duelo
// @Description Permite que el oponente acepte un duelo existente
// @Tags duelos
// @Accept json
// @Produce json
// @Param accept body models.AcceptDuelRequest true "ID del duelo" example:{"duel_id":"123"}
// @Success 200 {object} models.AcceptDuelResponse "Duelo aceptado exitosamente"
// @Failure 400 {object} models.ErrorResponseInvalidRequest "Solicitud inválida o malformada"
// @Failure 404 {object} models.ErrorResponseDuelNotFound "No se encontró el duelo con el ID proporcionado"
// @Router /api/duels/accept [post]
func acceptDuelHandler(c *gin.Context) {
	log.Printf("🎯 [ACCEPT DUEL] Request received")
	
	var accept models.AcceptDuelRequest
	if err := c.ShouldBindJSON(&accept); err != nil {
		log.Printf("❌ [ACCEPT DUEL] Invalid request body: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Peticion invalida"})
		return
	}
	
	log.Printf("🎯 [ACCEPT DUEL] Processing duel ID: %s", accept.DuelID)
	
	// Verificar que el duelo existe en la base de datos
	duelRepo := repositories.NewDuelRepository()
	duelIDInt, err := strconv.Atoi(accept.DuelID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de duelo inválido"})
		return
	}
	
	duel, err := duelRepo.GetDuelByID(duelIDInt)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Duelo no encontrado"})
		return
	}
	
	if duel.Status != "pending" {
		c.JSON(http.StatusConflict, gin.H{"error": "El duelo ya no está pendiente"})
		return
	}
	
	// Actualizar el estado del duelo a aceptado
	err = duelRepo.UpdateDuelStatus(duelIDInt, "accepted", "")
	if err != nil {
		log.Printf("Error al actualizar estado del duelo: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error interno del servidor"})
		return
	}
	
	// Respond immediately to client
	log.Printf("📤 [ACCEPT DUEL] Sending HTTP response for duel %s", accept.DuelID)
	c.JSON(http.StatusOK, gin.H{
		"duel_id": accept.DuelID,
		"message": "Duelo aceptado exitosamente",
	})
	log.Printf("✅ [ACCEPT DUEL] HTTP response sent successfully for duel %s", accept.DuelID)
	
	// Start the RabbitMQ-based duel asynchronously (non-blocking)
	go func() {
		// Wait a moment for players to connect to WebSocket Manager
		time.Sleep(5 * time.Second)
		
		// Get questions for the duel
		questionService := services.NewQuestionService()
		questions, err := questionService.GetQuestionsForDuel(duel.Category)
		if err != nil {
			log.Printf("Error getting questions for duel %s: %v. Using backup questions.", accept.DuelID, err)
			questions = []models.Question{
				{ID: "backup1", Text: "¿Cuál es el río más largo del mundo?", Answer: "Nilo", Options: []string{"Amazonas", "Nilo", "Misisipi", "Yangtsé"}, Duration: 30},
				{ID: "backup2", Text: "¿Cuánto es 2+2?", Answer: "4", Options: []string{"3", "4", "5", "6"}, Duration: 30},
				{ID: "backup3", Text: "¿Quién pintó la Mona Lisa?", Answer: "Leonardo da Vinci", Options: []string{"Pablo Picasso", "Vincent van Gogh", "Leonardo da Vinci", "Miguel Ángel"}, Duration: 30},
				{ID: "backup4", Text: "¿Cuál es el planeta más grande del sistema solar?", Answer: "Júpiter", Options: []string{"Tierra", "Júpiter", "Saturno", "Marte"}, Duration: 30},
				{ID: "backup5", Text: "¿En qué año comenzó la Segunda Guerra Mundial?", Answer: "1939", Options: []string{"1914", "1939", "1945", "1918"}, Duration: 30},
			}
		}
		
		log.Printf("Starting RabbitMQ-based duel %s between %s and %s", accept.DuelID, duel.ChallengerID, duel.OpponentID)
		duelhandlers.HandleDuelViaRabbitMQ(duel.ChallengerID, duel.OpponentID, questions, accept.DuelID)
	}()
}

// wsDuelHandler has been removed - duels now work entirely through WebSocket Manager + RabbitMQ

// wsNotificationHandler maneja la conexión WebSocket para notificaciones.
// @Summary Conexión WebSocket para notificaciones
// @Description Establece una conexión WebSocket para recibir notificaciones de duelos en tiempo real
// @Tags notificaciones
// @Produce json
// @Param user_id path string true "ID del usuario" example:"player123"
// @Success 101 {string} string "Conexión WebSocket establecida para recibir notificaciones"
// @Router /ws/notifications/{user_id} [get]
func wsNotificationHandler(c *gin.Context) {
	userID := c.Param("user_id")
	duelhandlers.NotificationHandler(c.Writer, c.Request, userID)
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

// getCategoriesHandler obtiene las categorías disponibles para duelos.
// @Summary Obtiene categorías disponibles
// @Description Obtiene la lista de categorías disponibles para los duelos
// @Tags categorias
// @Produce json
// @Success 200 {array} models.Category "Lista de categorías disponibles"
// @Failure 500 {object} models.ErrorResponse "Error interno del servidor"
// @Router /api/duels/categories [get]
func getCategoriesHandler(c *gin.Context) {
	// Crear una instancia del servicio de preguntas
	questionService := services.NewQuestionService()
	
	// Obtener las categorías disponibles
	categories := questionService.GetAvailableCategories()
	
	// Devolver las categorías
	c.JSON(http.StatusOK, categories)
}

// RegisterRoutes configura todas las rutas del servidor Gin.
func RegisterRoutes(r *gin.Engine) {
	r.POST("/api/duels/request", requestDuelHandler)
	r.POST("/api/duels/accept", acceptDuelHandler)
	r.GET("/api/duels/categories", getCategoriesHandler)
	r.GET("/ws/notifications/:user_id", wsNotificationHandler)
	r.GET("/api/players/:player_id", getPlayerHandler)
}
