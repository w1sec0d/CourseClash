package broker

import (
	"encoding/json"
	"log"
	"os"

	amqp "github.com/rabbitmq/amqp091-go"
)

type AnswerMessage struct {
	DuelID     string  `json:"duelId"`
	UserID     string  `json:"userId"`
	QuestionID string  `json:"questionId"`
	Answer     string  `json:"answer"`
	Timestamp  float64 `json:"timestamp"`
}

type PlayerConnectionMessage struct {
	DuelID    string  `json:"duelId"`
	UserID    string  `json:"userId"`
	Timestamp float64 `json:"timestamp"`
}

// StartConsumer starts consuming messages from RabbitMQ
func StartConsumer() error {
	rabbitmqURL := os.Getenv("RABBITMQ_URL")
	if rabbitmqURL == "" {
		rabbitmqURL = "amqp://courseclash:courseclash123@cc_broker:5672/courseclash"
	}

	conn, err := amqp.Dial(rabbitmqURL)
	if err != nil {
		return err
	}

	ch, err := conn.Channel()
	if err != nil {
		return err
	}

	// Declare the queue for critical duel events
	queue, err := ch.QueueDeclare(
		"duel.critical.events", // name
		true,                   // durable
		false,                  // delete when unused
		false,                  // exclusive
		false,                  // no-wait
		amqp.Table{
			"x-message-ttl": 300000, // 5 minutes TTL
		}, // arguments
	)
	if err != nil {
		return err
	}

	msgs, err := ch.Consume(
		queue.Name, // queue
		"",         // consumer
		true,       // auto-ack
		false,      // exclusive
		false,      // no-local
		false,      // no-wait
		nil,        // args
	)
	if err != nil {
		return err
	}

	go func() {
		for d := range msgs {
			log.Printf("Received message: %s", d.Body)
			handleMessage(d.RoutingKey, d.Body)
		}
	}()

	log.Printf("Consumer started, waiting for messages...")
	return nil
}

func handleMessage(routingKey string, body []byte) {
	switch routingKey {
	case "duel.answer.submitted":
		var answer AnswerMessage
		if err := json.Unmarshal(body, &answer); err != nil {
			log.Printf("Error unmarshaling answer message: %v", err)
			return
		}
		handleAnswerSubmission(answer)
	case "duel.player.connected":
		var playerConn PlayerConnectionMessage
		if err := json.Unmarshal(body, &playerConn); err != nil {
			log.Printf("Error unmarshaling player connection message: %v", err)
			return
		}
		handlePlayerConnection(playerConn)
	case "duel.player.disconnected":
		var playerDisconn PlayerConnectionMessage
		if err := json.Unmarshal(body, &playerDisconn); err != nil {
			log.Printf("Error unmarshaling player disconnection message: %v", err)
			return
		}
		handlePlayerDisconnection(playerDisconn)
	default:
		log.Printf("Unknown routing key: %s", routingKey)
	}
}

func handleAnswerSubmission(answer AnswerMessage) {
	log.Printf("Answer submitted: DuelID=%s, UserID=%s, QuestionID=%s, Answer=%s", 
		answer.DuelID, answer.UserID, answer.QuestionID, answer.Answer)
	
	// TODO: Forward this answer to the appropriate duel handler
	// This will require integration with your existing duel synchronization logic
}

func handlePlayerConnection(playerConn PlayerConnectionMessage) {
	log.Printf("Player connected: DuelID=%s, UserID=%s", 
		playerConn.DuelID, playerConn.UserID)
	
	// TODO: Update duel state to reflect player connection
}

func handlePlayerDisconnection(playerDisconn PlayerConnectionMessage) {
	log.Printf("Player disconnected: DuelID=%s, UserID=%s", 
		playerDisconn.DuelID, playerDisconn.UserID)
	
	// TODO: Handle player disconnection gracefully
} 