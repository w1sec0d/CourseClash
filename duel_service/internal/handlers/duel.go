package handlers

import (
	"log"
	"strconv"
	"time"

	"courseclash/duel-service/internal/broker"
	"courseclash/duel-service/internal/models"
	"courseclash/duel-service/internal/repositories"
	"courseclash/duel-service/internal/services"
)

// HandleDuelViaRabbitMQ manages duels entirely through RabbitMQ communication
// This replaces the old HandleDuel function that relied on direct WebSocket connections
func HandleDuelViaRabbitMQ(player1ID, player2ID string, questions []models.Question, duelID string) {
	log.Printf("Starting RabbitMQ-based duel %s between %s and %s", duelID, player1ID, player2ID)
	
	// Get player data from database
	playerRepo := repositories.NewPlayerRepository()
	player1Data, err := playerRepo.GetPlayerByID(player1ID)
	if err != nil {
		log.Printf("Error getting player1 data: %v", err)
		return
	}
	player2Data, err := playerRepo.GetPlayerByID(player2ID)
	if err != nil {
		log.Printf("Error getting player2 data: %v", err)
		return
	}
	
	// Create virtual players (no WebSocket connections)
	player1 := &models.Player{
		ID:    player1ID,
		Score: 0,
		Elo:   player1Data.Elo,
		Rank:  player1Data.Rank,
		Conn:  nil, // No direct WebSocket connection
		Done:  make(chan struct{}),
	}
	player2 := &models.Player{
		ID:    player2ID,
		Score: 0,
		Elo:   player2Data.Elo,
		Rank:  player2Data.Rank,
		Conn:  nil, // No direct WebSocket connection
		Done:  make(chan struct{}),
	}
	
	defer func() {
		if player1.Done != nil {
			close(player1.Done)
		}
		if player2.Done != nil {
			close(player2.Done)
		}
		// Clean up answer channels
		broker.UnregisterAnswerChannels(duelID)
		log.Printf("RabbitMQ-based duel %s completed", duelID)
	}()
	
	// Register answer channels for both players
	answer1Chan := make(chan string, 10)
	answer2Chan := make(chan string, 10)
	broker.RegisterAnswerChannel(duelID, player1ID, answer1Chan)
	broker.RegisterAnswerChannel(duelID, player2ID, answer2Chan)
	
	// Send initial status
	err = broker.PublishStatusToWebSocket(duelID, "¡Duelo iniciado!")
	if err != nil {
		log.Printf("Error publishing duel start status: %v", err)
	}
	
	// Process each question
	for i, question := range questions {
		log.Printf("Sending question %d/%d to duel %s", i+1, len(questions), duelID)
		
		// Send question via RabbitMQ
		questionData := map[string]interface{}{
			"id":       question.ID,
			"text":     question.Text,
			"options":  question.Options,
			"answer":   question.Answer,
			"duration": question.Duration,
		}
		
		err := broker.PublishQuestionToWebSocket(duelID, questionData)
		if err != nil {
			log.Printf("Error sending question %s: %v", question.ID, err)
			continue
		}
		
		// Wait for answers from both players (with timeout)
		var answer1, answer2 string
		timeout := time.After(time.Duration(question.Duration+5) * time.Second) // Question duration + 5 seconds buffer
		
		// Collect answers
		answersReceived := 0
		for answersReceived < 2 {
			select {
			case answer1 = <-answer1Chan:
				log.Printf("Received answer from player1 %s: %s", player1ID, answer1)
				answersReceived++
			case answer2 = <-answer2Chan:
				log.Printf("Received answer from player2 %s: %s", player2ID, answer2)
				answersReceived++
			case <-timeout:
				log.Printf("Timeout waiting for answers to question %s", question.ID)
				// Assign empty answers for missing responses
				if answer1 == "" {
					answer1 = "timeout"
				}
				if answer2 == "" {
					answer2 = "timeout"
				}
				answersReceived = 2 // Force exit
			}
		}
		
		// Calculate scores
		startTime := time.Now() // We don't have exact start time, so use current time
		calculateScore(player1, question, answer1, startTime)
		calculateScore(player2, question, answer2, startTime)
		
		log.Printf("Question %d completed. Scores: P1(%s): %d, P2(%s): %d", 
			i+1, player1ID, player1.Score, player2ID, player2.Score)
	}
	
	// Send final results
	endDuelViaRabbitMQ(player1, player2, duelID)
}

// endDuelViaRabbitMQ sends final results via RabbitMQ
func endDuelViaRabbitMQ(player1, player2 *models.Player, duelID string) {
	var winnerID string
	isDraw := false

	if player1.Score > player2.Score {
		winnerID = player1.ID
	} else if player2.Score > player1.Score {
		winnerID = player2.ID
	} else {
		isDraw = true
	}

	// Calculate ELO changes
	player1Won := player1.Score > player2.Score
	player2Won := player2.Score > player1.Score
	
	oldElo1 := player1.Elo
	oldElo2 := player2.Elo
	
	player1.Elo = services.CalculateEloChange(player1.Elo, player2.Elo, player1Won, isDraw)
	player2.Elo = services.CalculateEloChange(player2.Elo, player1.Elo, player2Won, isDraw)
	
	// Update ranks
	newRank1 := services.GetRankByElo(player1.Elo)
	newRank2 := services.GetRankByElo(player2.Elo)
	
	player1.Rank = string(newRank1)
	player2.Rank = string(newRank2)
	
	// Update database
	duelIDInt, err := strconv.Atoi(duelID)
	if err == nil {
		duelRepo := repositories.NewDuelRepository()
		if err := duelRepo.UpdateDuelStatus(duelIDInt, "completed", winnerID); err != nil {
			log.Printf("Error updating duel status: %v", err)
		}
	}
	
	// Update player data in database
	playerRepo := repositories.NewPlayerRepository()
	
	player1Data := &models.PlayerData{
		PlayerID: player1.ID,
		Elo:      player1.Elo,
		Rank:     player1.Rank,
	}
	if err := playerRepo.UpdatePlayer(player1Data); err != nil {
		log.Printf("Error updating player1 data: %v", err)
	}
	
	player2Data := &models.PlayerData{
		PlayerID: player2.ID,
		Elo:      player2.Elo,
		Rank:     player2.Rank,
	}
	if err := playerRepo.UpdatePlayer(player2Data); err != nil {
		log.Printf("Error updating player2 data: %v", err)
	}

	// Create results data
	resultsData := map[string]interface{}{
		"player1_id": player1.ID,
		"player2_id": player2.ID,
		"player1_score": player1.Score,
		"player2_score": player2.Score,
		"player1_elo": map[string]interface{}{
			"previous": oldElo1,
			"current":  player1.Elo,
			"change":   player1.Elo - oldElo1,
		},
		"player2_elo": map[string]interface{}{
			"previous": oldElo2,
			"current":  player2.Elo,
			"change":   player2.Elo - oldElo2,
		},
		"player1_rank": player1.Rank,
		"player2_rank": player2.Rank,
		"is_draw":      isDraw,
		"winner_id":    winnerID,
	}

	// Send results via RabbitMQ
	if err := broker.PublishResultsToWebSocket(duelID, resultsData); err != nil {
		log.Printf("Error publishing results to RabbitMQ: %v", err)
	}

	log.Printf("Duel %s completed. Winner: %s, Draw: %t, Scores: P1: %d, P2: %d", 
		duelID, winnerID, isDraw, player1.Score, player2.Score)
	
	// Duel resources are automatically cleaned up by RabbitMQ-based architecture
	log.Printf("Recursos del duelo %s liberados correctamente", duelID)
}

// Legacy functions removed - now using 100% RabbitMQ architecture

// REMOVED: Legacy HandleDuel, broadcastQuestion, receiveAnswer, endDuel functions 
// All communication now goes through RabbitMQ message broker for better scalability and reliability

// calculateScore is kept as it's still used by the RabbitMQ-based HandleDuelViaRabbitMQ
func calculateScore(player *models.Player, question models.Question, answer string, startTime time.Time) {
	// Handle timeout responses
	if answer == "timeout" {
		player.Score -= 5
		log.Printf("Respuesta incorrecta para jugador %s. Respuesta: '%s', Correcta: '%s'. Penalización: -5 puntos", player.ID, answer, question.Answer)
		return
	}
	
	// Verificar si es una respuesta vacía o mensaje de sistema
	if answer == "" || answer == "ping" || answer == "connection_heartbeat" {
		log.Printf("Respuesta vacía o de sistema para jugador %s, no se modifica puntuación. Respuesta: '%s'", player.ID, answer)
		return // No modificar puntuación para respuestas vacías
	}
	
	if answer == question.Answer {
		timeTaken := time.Since(startTime).Seconds()
		bonus := int(float64(question.Duration) - timeTaken)
		if bonus < 0 {
			bonus = 0
		}
		pointsEarned := 10 + bonus
		player.Score += pointsEarned
		log.Printf("Respuesta correcta para jugador %s. Puntos ganados: %d (base: 10, bonus: %d)", player.ID, pointsEarned, bonus)
	} else {
		player.Score -= 5
		log.Printf("Respuesta incorrecta para jugador %s. Respuesta: '%s', Correcta: '%s'. Penalización: -5 puntos", player.ID, answer, question.Answer)
	}
}
