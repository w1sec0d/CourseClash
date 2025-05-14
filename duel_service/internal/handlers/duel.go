package handlers

import (
	// Para mensajes en consola
	"log"
	// Funciones de tiempo
	"time"

	"github.com/gorilla/websocket"
)

// Esta sería la estructura inicial de una pregunta dentro de un duelo
// ! Puede variar de acuerdo a como se plantee en la base de datos
// *Así entonces una pregunta tiene texto, su respuesta y su duración (s) en pantalla

type Question struct {
   ID       string `json:"id"`
   Text     string `json:"text"`
   Answer   string `json:"answer"`
   Duration int    `json:"duration"` 
}

// Esta es la estructura básica de cada jugador en el duelo 
// *Tiene un identificador, la puntuación que lleva acumulada y la conexión websocket asociada

type Player struct {
   ID       string
   Score    int
   Conn     *websocket.Conn
}

// Esta función es la encargada de gestionar los duelos, recibe ambos jugadores y las preguntas que regirán el duelo
/* FLUJO POR CADA PREGUNTA
	1. Envia la pregunta a ambos jugadores usando broadcastQuestion y comienza a contar el tiempo
	2. Recibe las respuestas de cada jugador usando receiveAnswer()
	3. Calcula la puntuación de cada jugador de acuerdo a su respuesta y tiempo que tardaron
	4. Finalmente se registra el resultado final con las puntuaciones de ambos jugadores
	*/
	 
func HandleDuel(player1 *Player, player2 *Player, questions []Question) {
   for _, question := range questions {
       broadcastQuestion(player1, player2, question)
       startTime := time.Now()


       answer1 := receiveAnswer(player1)
       answer2 := receiveAnswer(player2)


       calculateScore(player1, question, answer1, startTime)
       calculateScore(player2, question, answer2, startTime)
   }


   log.Printf("Duel finished: Player1: %d, Player2: %d", player1.Score, player2.Score)
}

// Esta función es la que se encarga en esencia de enviar las preguntas via WebSocket a los jugadores
// message es la estructura en que será enviada la pregunta, para ello se utiliza una instancia a la estructura de datos de más arriba
// * Con WriteJSON básicamente se envía cada pregunta a cada jugador utilizando la conexión websocket

func broadcastQuestion(player1, player2 *Player, question Question) {
   message := map[string]interface{}{
       "type": "question",
       "data": question,
   }
   player1.Conn.WriteJSON(message)
   player2.Conn.WriteJSON(message)
}

// Esta función permite recibir un mapa con la clave answer, que representa la respuesta de los jugadores
// Utilizando el método ReadJSON de la conexión WebSocket el servidor recibe las respuestas del jugador/cliente
// * Es necesario que se envie desde el cliente para procesarlo.

func receiveAnswer(player *Player) string {
   var response map[string]string
   player.Conn.ReadJSON(&response)
   return response["answer"]
}


// Esta función es la encargada de calcular la puntuación de cada estudiante de acuerdo a si su respuesta fue correcta
// *En caso de que la respuesta sea correcta se suma al puntaje +10, y de acuerdo al tiempo tardado calcula un bonus al estilo Quizzis
// Si la respuesta queda mal se le restan 5 puntos

func calculateScore(player *Player, question Question, answer string, startTime time.Time) {
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
