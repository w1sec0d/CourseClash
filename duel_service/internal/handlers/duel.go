package handlers

import (
	"log"
	"time"

	"courseclash/duel-service/internal/models"
)

// Esta función es la encargada de gestionar los duelos, recibe ambos jugadores y las preguntas que regirán el duelo
/* FLUJO POR CADA PREGUNTA
1. Envia la pregunta a ambos jugadores usando broadcastQuestion y comienza a contar el tiempo
2. Recibe las respuestas de cada jugador usando receiveAnswer()
3. Calcula la puntuación de cada jugador de acuerdo a su respuesta y tiempo que tardaron
4. Finalmente se registra el resultado final con las puntuaciones de ambos jugadores
*/

func HandleDuel(player1 *models.Player, player2 *models.Player, questions []models.Question) {
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

	// Notificamos a los jugadores que el duelo va a comenzar
	// ...

	for _, question := range questions {
		broadcastQuestion(player1, player2, question)
		startTime := time.Now()

		// Envio sincronizado de respuestas.
		answer1 := receiveAnswer(player1)
		answer2 := receiveAnswer(player2)

		calculateScore(player1, question, answer1, startTime)
		calculateScore(player2, question, answer2, startTime)
	}

	// Enviar resultados finales
	endDuel(player1, player2)
	log.Printf("Duelo finalizado entre %s y %s. Puntuaciones finales: P1: %d, P2: %d", player1.ID, player2.ID, player1.Score, player2.Score)
	// Los canales Done se cerrarán mediante la instrucción defer
}

// Esta función es la que se encarga en esencia de enviar las preguntas via WebSocket a los jugadores
// message es la estructura en que será enviada la pregunta, para ello se utiliza una instancia a la estructura de datos de más arriba
// * Con WriteJSON básicamente se envía cada pregunta a cada jugador utilizando la conexión websocket

func broadcastQuestion(player1, player2 *models.Player, question models.Question) {
	message := map[string]interface{}{
		"type": "question",
		"data": question,
	}
	// Envio sincronizado de preguntas
	player1.Conn.WriteJSON(message)
	player2.Conn.WriteJSON(message)
}

// Esta función permite recibir un mapa con la clave answer, que representa la respuesta de los jugadores
// Utilizando el método ReadJSON de la conexión WebSocket el servidor recibe las respuestas del jugador/cliente
// * Es necesario que se envie desde el cliente para procesarlo.

func receiveAnswer(player *models.Player) string {
	var response map[string]string
	player.Conn.ReadJSON(&response)
	return response["answer"]
}

// Esta función es la encargada de calcular la puntuación de cada estudiante de acuerdo a si su respuesta fue correcta
// *En caso de que la respuesta sea correcta se suma al puntaje +10, y de acuerdo al tiempo tardado calcula un bonus al estilo Quizzis
// Si la respuesta queda mal se le restan 5 puntos

func calculateScore(player *models.Player, question models.Question, answer string, startTime time.Time) {
	if answer == question.Answer {
		timeTaken := time.Since(startTime).Seconds()
		bonus := int(float64(question.Duration) - timeTaken)
		if bonus < 0 {
			bonus = 0
		}
		player.Score += 10 + bonus
	} else {
		player.Score -= 5
	}
}

// endDuel envía los resultados finales del duelo a ambos jugadores.
func endDuel(player1 *models.Player, player2 *models.Player) {
	var winnerID string
	isDraw := false

	if player1.Score > player2.Score {
		winnerID = player1.ID
	} else if player2.Score > player1.Score {
		winnerID = player2.ID
	} else {
		isDraw = true
	}

	finalMessage := map[string]interface{}{
		"type": "duel_end",
		"data": map[string]interface{}{
			"player1_score": player1.Score,
			"player2_score": player2.Score,
			"is_draw":       isDraw,
			"winner_id":     winnerID, // Será una cadena vacía si isDraw es true
		},
	}

	if player1.Conn != nil {
		if err := player1.Conn.WriteJSON(finalMessage); err != nil {
			log.Printf("Error al enviar mensaje final a jugador %s: %v", player1.ID, err)
		}
	}
	if player2.Conn != nil {
		if err := player2.Conn.WriteJSON(finalMessage); err != nil {
			log.Printf("Error al enviar mensaje final a jugador %s: %v", player2.ID, err)
		}
	}

	log.Printf("Duelo finalizado. P1 (%s): %d, P2 (%s): %d. Ganador: %s, Empate: %t",
		player1.ID, player1.Score, player2.ID, player2.Score, winnerID, isDraw)
}
