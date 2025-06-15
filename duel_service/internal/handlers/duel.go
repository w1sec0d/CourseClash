package handlers

import (
	"log"
	"strconv"
	"time"

	"courseclash/duel-service/internal/broker"
	"courseclash/duel-service/internal/duelsync"
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
	
	// Clean up duel resources
	duelsync.CleanupDuel(duelID)
}

// Legacy functions kept for compatibility but should be phased out

// Esta función es la encargada de gestionar los duelos, recibe ambos jugadores y las preguntas que regirán el duelo
/* FLUJO POR CADA PREGUNTA
1. Envia la pregunta a ambos jugadores usando broadcastQuestion y comienza a contar el tiempo
2. Recibe las respuestas de cada jugador usando receiveAnswer()
3. Calcula la puntuación de cada jugador de acuerdo a su respuesta y tiempo que tardaron
4. Finalmente se registra el resultado final con las puntuaciones de ambos jugadores y sus rangos actualizados en un JSON
*/

func HandleDuel(player1 *models.Player, player2 *models.Player, questions []models.Question, duelID string) {
	log.Printf("⚠️ WARNING: Using legacy HandleDuel function - should migrate to HandleDuelViaRabbitMQ")
	
	// Asegurarse de que los canales Done se cierren al final de HandleDuel,
	// independientemente de cómo termine la función (normalmente o por pánico).
	defer func() {
		if player1 != nil && player1.Done != nil {
			close(player1.Done)
			log.Printf("Canal Done cerrado para el jugador %s", player1.ID)
		}
		if player2 != nil && player2.Done != nil {
			close(player2.Done)
			log.Printf("Canal Done cerrado para el jugador %s", player2.ID)
		}
		log.Printf("HandleDuel para jugadores %s y %s finalizado.", player1.ID, player2.ID)
	}()

	log.Printf("Iniciando HandleDuel para %s y %s", player1.ID, player2.ID)
	
	// Verificar que ambos jugadores tienen conexiones válidas
	if player1 == nil || player1.Conn == nil {
		log.Printf("ERROR: Player1 es nil o no tiene conexión válida")
		return
	}
	if player2 == nil || player2.Conn == nil {
		log.Printf("ERROR: Player2 es nil o no tiene conexión válida")
		return
	}
	
	log.Printf("Ambos jugadores tienen conexiones válidas. Iniciando duelo con %d preguntas", len(questions))

	// Notificar a través de RabbitMQ que el duelo está comenzando
	err := broker.PublishStatusToWebSocket(duelID, "¡Duelo listo!")
	if err != nil {
		log.Printf("Error al publicar estado inicial del duelo: %v", err)
	}

	for i, question := range questions {
		// Variable para controlar si necesitamos reenviar la pregunta
		needToResend := true
		maxRetries := 3
		retryCount := 0
		var lastAnswer1, lastAnswer2 string
		
		for needToResend && retryCount < maxRetries {
			log.Printf("Enviando pregunta %d (%s) a jugadores %s y %s (intento %d)", i+1, question.ID, player1.ID, player2.ID, retryCount+1)
			
			success := broadcastQuestion(player1, player2, question, duelID)
			if !success {
				log.Printf("Error al enviar pregunta %s. Terminando duelo prematuramente", question.ID)
				return
			}
		

			// Envio sincronizado de respuestas.
			answer1 := receiveAnswer(player1)
			answer2 := receiveAnswer(player2)
			
			// Guardar las últimas respuestas para el caso de fallar todos los reintentos
			lastAnswer1 = answer1
			lastAnswer2 = answer2
			
			// Log de las respuestas recibidas
			log.Printf("Respuestas recibidas - P1 (%s): '%s', P2 (%s): '%s'", player1.ID, answer1, player2.ID, answer2)
			
			// Verificar si alguna respuesta está vacía
			answer1IsEmpty := answer1 == "" || answer1 == "ping" || answer1 == "connection_heartbeat"
			answer2IsEmpty := answer2 == "" || answer2 == "ping" || answer2 == "connection_heartbeat"
			
			if answer1IsEmpty || answer2IsEmpty {
				log.Printf("Respuesta vacía detectada - P1 vacía: %t, P2 vacía: %t. Reenviando pregunta %d", answer1IsEmpty, answer2IsEmpty, i+1)
				retryCount++
				
				// Enviar mensaje informativo a los jugadores via RabbitMQ
				if answer1IsEmpty || answer2IsEmpty {
					err := broker.PublishStatusToWebSocket(duelID, "Respuesta no válida detectada. Reenviando pregunta...")
					if err != nil {
						log.Printf("Error al publicar estado de reenvío: %v", err)
					}
				}
				
				// Pequeña pausa antes de reenviar
				time.Sleep(1 * time.Second)
				continue // Reenviar la misma pregunta
			}
			
			// Si llegamos aquí, ambas respuestas son válidas
			needToResend = false
			calculateScore(player1, question, answer1, time.Now())
			calculateScore(player2, question, answer2, time.Now())
			
			log.Printf("Pregunta %d procesada exitosamente. Puntuaciones: P1: %d, P2: %d", i+1, player1.Score, player2.Score)
		}
		
		// Si después de todos los intentos aún hay respuestas vacías, procesar las últimas respuestas como incorrectas
		if retryCount >= maxRetries {
			log.Printf("Máximo de reintentos alcanzado para pregunta %d. Procesando últimas respuestas como finales", i+1)
			
			// Usar las últimas respuestas recibidas
			calculateScore(player1, question, lastAnswer1, time.Now())
			calculateScore(player2, question, lastAnswer2, time.Now())
		}
	}
	log.Printf("🏁 [TODAS LAS PREGUNTAS COMPLETADAS] Enviando resultados finales del duelo %s", duelID)

	// Enviar resultados finales
	endDuel(player1, player2, duelID)
	log.Printf("Duelo finalizado entre %s y %s. Puntuaciones finales: P1: %d, P2: %d", player1.ID, player2.ID, player1.Score, player2.Score)
	// Los canales Done se cerrarán mediante la instrucción defer
}

// Esta función es la que se encarga en esencia de enviar las preguntas via WebSocket a los jugadores
// message es la estructura en que será enviada la pregunta, para ello se utiliza una instancia a la estructura de datos de más arriba
// * Con WriteJSON básicamente se envía cada pregunta a cada jugador utilizando la conexión websocket
// Ahora también publica la pregunta a RabbitMQ para que el WebSocket Manager la envíe a los clientes

func broadcastQuestion(player1, player2 *models.Player, question models.Question, duelID string) bool {
  
	message := map[string]interface{}{
		"type": "question",
		"data": question,
	}
	
	log.Printf("Enviando pregunta ID: %s a jugadores %s y %s", question.ID, player1.ID, player2.ID)
	
	// Publicar la pregunta a RabbitMQ para que el WebSocket Manager la envíe
	questionData := map[string]interface{}{
		"id":       question.ID,
		"text":     question.Text,
		"options":  question.Options,
		"answer":   question.Answer,
		"duration": question.Duration,
	}
	
	err := broker.PublishQuestionToWebSocket(duelID, questionData)
	if err != nil {
		log.Printf("Error al publicar pregunta a RabbitMQ: %v", err)
	}
	
	// Mantener el envío directo por WebSocket como respaldo
	// Enviar a Player1
	err1 := player1.SafeWriteJSON(message)
	if err1 != nil {
		log.Printf("ERROR: No se pudo enviar pregunta a Player1 (%s): %v", player1.ID, err1)
		return false
	}
	log.Printf("✅ Pregunta enviada exitosamente a Player1 (%s)", player1.ID)
	
	// Enviar a Player2
	err2 := player2.SafeWriteJSON(message)
	if err2 != nil {
		log.Printf("ERROR: No se pudo enviar pregunta a Player2 (%s): %v", player2.ID, err2)
		return false
	}
	log.Printf("✅ Pregunta enviada exitosamente a Player2 (%s)", player2.ID)
	
	log.Printf("✅ Pregunta ID: %s enviada exitosamente a ambos jugadores", question.ID)
	return true
}

// Esta función permite recibir un mapa con la clave answer, que representa la respuesta de los jugadores
// Utilizando el método ReadJSON de la conexión WebSocket el servidor recibe las respuestas del jugador/cliente
// * Es necesario que se envie desde el cliente para procesarlo.
// Ahora filtra mensajes de sistema (ping, connection_heartbeat, etc.) y solo procesa respuestas válidas

func receiveAnswer(player *models.Player) string {
	for {
		var response map[string]interface{}
		err := player.Conn.ReadJSON(&response)
		if err != nil {
			log.Printf("Error al leer respuesta del jugador %s: %v", player.ID, err)
			return "" // Retornar respuesta vacía en caso de error
		}
		
		// Log del mensaje recibido para debugging
		log.Printf("Mensaje recibido del jugador %s: %+v", player.ID, response)
		
		// Verificar el tipo de mensaje
		if msgType, exists := response["type"]; exists {
			msgTypeStr, ok := msgType.(string)
			if ok {
				// Filtrar mensajes de sistema que no son respuestas
				switch msgTypeStr {
				case "ping", "connection_heartbeat", "connection_test", "ready_check":
					log.Printf("Mensaje de sistema ignorado del jugador %s: tipo %s", player.ID, msgTypeStr)
					continue // Continuar esperando la respuesta real
				case "answer":
					// Este es el mensaje que esperamos
					if answer, answerExists := response["answer"]; answerExists {
						if answerStr, ok := answer.(string); ok {
							log.Printf("Respuesta válida recibida del jugador %s: '%s'", player.ID, answerStr)
							return answerStr
						}
					}
					log.Printf("Mensaje de respuesta malformado del jugador %s: falta campo 'answer' o no es string", player.ID)
					return ""
				default:
					log.Printf("Tipo de mensaje desconocido del jugador %s: %s", player.ID, msgTypeStr)
					continue // Continuar esperando
				}
			}
		}
		
		// Si no hay campo "type", intentar obtener "answer" directamente (compatibilidad con versiones anteriores)
		if answer, exists := response["answer"]; exists {
			if answerStr, ok := answer.(string); ok {
				log.Printf("Respuesta directa (sin tipo) recibida del jugador %s: '%s'", player.ID, answerStr)
				return answerStr
			}
		}
		
		log.Printf("Mensaje no reconocido del jugador %s, continuando esperando respuesta válida", player.ID)
	}
}

// Esta función es la encargada de calcular la puntuación de cada estudiante de acuerdo a si su respuesta fue correcta
// *En caso de que la respuesta sea correcta se suma al puntaje +10, y de acuerdo al tiempo tardado calcula un bonus al estilo Quizzis
// Si la respuesta queda mal se le restan 5 puntos
// Si la respuesta está vacía o es un mensaje de sistema (ping, etc.), no se penaliza pero tampoco se otorgan puntos

func calculateScore(player *models.Player, question models.Question, answer string, startTime time.Time) {
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

// endDuel envía los resultados finales del duelo a ambos jugadores.
func endDuel(player1 *models.Player, player2 *models.Player, duelID string) {
	var winnerID string
	isDraw := false

	if player1.Score > player2.Score {
		winnerID = player1.ID
	} else if player2.Score > player1.Score {
		winnerID = player2.ID
	} else {
		isDraw = true
	}

	// Calcular los nuevos ELOs basados en el resultado del duelo
	player1Won := player1.Score > player2.Score
	player2Won := player2.Score > player1.Score
	
	// Guardar los ELOs originales para reportar el cambio
	oldElo1 := player1.Elo
	oldElo2 := player2.Elo
	
	// Calcular los nuevos ELOs
	player1.Elo = services.CalculateEloChange(player1.Elo, player2.Elo, player1Won, isDraw)
	player2.Elo = services.CalculateEloChange(player2.Elo, player1.Elo, player2Won, isDraw)
	
	// Calcular los nuevos rangos basados en el ELO actualizado
	newRank1 := services.GetRankByElo(player1.Elo)
	newRank2 := services.GetRankByElo(player2.Elo)
	
	// Actualizar los rangos de los jugadores
	player1.Rank = string(newRank1)
	player2.Rank = string(newRank2)
	
	// Actualizar el estado del duelo en la base de datos
	duelIDInt, err := strconv.Atoi(duelID)
	if err == nil {
		duelRepo := repositories.NewDuelRepository()
		if err := duelRepo.UpdateDuelStatus(duelIDInt, "completed", winnerID); err != nil {
			log.Printf("Error al actualizar estado del duelo %s en la base de datos: %v", duelID, err)
		}
	} else {
		log.Printf("Error al convertir duelID %s a entero: %v", duelID, err)
	}
	
	// Guardar los cambios en MongoDB
	playerRepo := repositories.NewPlayerRepository()
	
	// Actualizar jugador 1
	player1Data := &models.PlayerData{
		PlayerID: player1.ID,
		Elo:      player1.Elo,
		Rank:     player1.Rank,
	}
	if err := playerRepo.UpdatePlayer(player1Data); err != nil {
		log.Printf("Error al actualizar datos del jugador %s en MongoDB: %v", player1.ID, err)
	}
	
	// Actualizar jugador 2
	player2Data := &models.PlayerData{
		PlayerID: player2.ID,
		Elo:      player2.Elo,
		Rank:     player2.Rank,
	}
	if err := playerRepo.UpdatePlayer(player2Data); err != nil {
		log.Printf("Error al actualizar datos del jugador %s en MongoDB: %v", player2.ID, err)
	}

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
		"winner_id":    winnerID, // Será una cadena vacía si isDraw es true
	}

	finalMessage := map[string]interface{}{
		"type": "duel_end",
		"data": resultsData,
	}

	// Publicar resultados a RabbitMQ para que el WebSocket Manager los envíe
	if err := broker.PublishResultsToWebSocket(duelID, resultsData); err != nil {
		log.Printf("Error al publicar resultados a RabbitMQ: %v", err)
	}

	// Mantener el envío directo por WebSocket como respaldo
	if player1.Conn != nil {
		if err := player1.SafeWriteJSON(finalMessage); err != nil {
			log.Printf("Error al enviar mensaje final a jugador %s: %v", player1.ID, err)
		}
	}
	if player2.Conn != nil {
		if err := player2.SafeWriteJSON(finalMessage); err != nil {
			log.Printf("Error al enviar mensaje final a jugador %s: %v", player2.ID, err)
		}
	}

	log.Printf("Duelo finalizado. P1 (%s): %d, P2 (%s): %d. Ganador: %s, Empate: %t | ELOs: P1: %d→%d, P2: %d→%d | Rangos: P1: %s, P2: %s",
		player1.ID, player1.Score, player2.ID, player2.Score, winnerID, isDraw, 
		oldElo1, player1.Elo, oldElo2, player2.Elo, player1.Rank, player2.Rank)
	
	// Limpiar los recursos del duelo usando el duelID pasado como parámetro
	duelsync.CleanupDuel(duelID)
	log.Printf("Recursos del duelo %s liberados en endDuel", duelID)
}
