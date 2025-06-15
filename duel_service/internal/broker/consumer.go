package broker

import (
	"encoding/json"
	"log"
	"os"
	"sync"

	"courseclash/duel-service/internal/duelsync"

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

// AnswerChannel stores the answer channel for each player in each duel
var AnswerChannels = make(map[string]map[string]chan string) // duelID -> playerID -> answer channel
var AnswerChannelsMu sync.RWMutex

// PlayerConnectionStatus tracks which players are connected to which duels via WebSocket Manager
var PlayerConnections = make(map[string]map[string]bool) // duelID -> playerID -> connected
var PlayerConnectionsMu sync.RWMutex

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

	// Declare the exchange first
	err = ch.ExchangeDeclare(
		"duels.topic", // name
		"topic",       // type
		true,          // durable
		false,         // auto-deleted
		false,         // internal
		false,         // no-wait
		nil,           // arguments
	)
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

	// Bind the queue to receive answer and player connection events
	err = ch.QueueBind(
		queue.Name,      // queue name
		"duel.answer.*", // routing key pattern
		"duels.topic",   // exchange
		false,           // no-wait
		nil,             // arguments
	)
	if err != nil {
		return err
	}

	err = ch.QueueBind(
		queue.Name,       // queue name
		"duel.player.*",  // routing key pattern
		"duels.topic",    // exchange
		false,            // no-wait
		nil,              // arguments
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
	
	// Forward the answer to the appropriate duel handler
	AnswerChannelsMu.RLock()
	if duelChannels, exists := AnswerChannels[answer.DuelID]; exists {
		if answerChan, exists := duelChannels[answer.UserID]; exists {
			select {
			case answerChan <- answer.Answer:
				log.Printf("Answer forwarded to duel handler for player %s in duel %s", answer.UserID, answer.DuelID)
			default:
				log.Printf("Warning: Answer channel full for player %s in duel %s", answer.UserID, answer.DuelID)
			}
		} else {
			log.Printf("Warning: No answer channel found for player %s in duel %s", answer.UserID, answer.DuelID)
		}
	} else {
		log.Printf("Warning: No answer channels found for duel %s", answer.DuelID)
	}
	AnswerChannelsMu.RUnlock()
}

func handlePlayerConnection(playerConn PlayerConnectionMessage) {
	log.Printf("Player connected: DuelID=%s, UserID=%s", 
		playerConn.DuelID, playerConn.UserID)
	
	PlayerConnectionsMu.Lock()
	if PlayerConnections[playerConn.DuelID] == nil {
		PlayerConnections[playerConn.DuelID] = make(map[string]bool)
	}
	PlayerConnections[playerConn.DuelID][playerConn.UserID] = true
	PlayerConnectionsMu.Unlock()
	
	// Check if both players are now connected and start the duel if so
	checkAndStartDuel(playerConn.DuelID)
}

func handlePlayerDisconnection(playerDisconn PlayerConnectionMessage) {
	log.Printf("Player disconnected: DuelID=%s, UserID=%s", 
		playerDisconn.DuelID, playerDisconn.UserID)
	
	PlayerConnectionsMu.Lock()
	if PlayerConnections[playerDisconn.DuelID] != nil {
		PlayerConnections[playerDisconn.DuelID][playerDisconn.UserID] = false
	}
	PlayerConnectionsMu.Unlock()
	
	// TODO: Handle graceful disconnection during duel
}

// RegisterAnswerChannel registers an answer channel for a player in a duel
func RegisterAnswerChannel(duelID, playerID string, answerChan chan string) {
	AnswerChannelsMu.Lock()
	defer AnswerChannelsMu.Unlock()
	
	if AnswerChannels[duelID] == nil {
		AnswerChannels[duelID] = make(map[string]chan string)
	}
	AnswerChannels[duelID][playerID] = answerChan
	log.Printf("Answer channel registered for player %s in duel %s", playerID, duelID)
}

// UnregisterAnswerChannels cleans up answer channels for a duel
func UnregisterAnswerChannels(duelID string) {
	AnswerChannelsMu.Lock()
	defer AnswerChannelsMu.Unlock()
	
	delete(AnswerChannels, duelID)
	log.Printf("Answer channels cleaned up for duel %s", duelID)
}

// IsPlayerConnected checks if a player is connected to a duel via WebSocket Manager
func IsPlayerConnected(duelID, playerID string) bool {
	PlayerConnectionsMu.RLock()
	defer PlayerConnectionsMu.RUnlock()
	
	if duelConnections, exists := PlayerConnections[duelID]; exists {
		return duelConnections[playerID]
	}
	return false
}

// checkAndStartDuel checks if both players are connected and starts the duel
func checkAndStartDuel(duelID string) {
	// Get duel info from database to know who the players are
	duelsync.Mu.Lock()
	duelExists := false
	_, duelExists = duelsync.DuelRequests[duelID]
	duelsync.Mu.Unlock()
	
	if !duelExists {
		log.Printf("Duel %s not found in active requests, cannot start", duelID)
		return
	}
	
	// This is a simplified check - in a real implementation you'd get player IDs from the database
	// For now, we'll let the existing WebSocket handler logic handle the duel start
	log.Printf("Player connection registered for duel %s, letting WebSocket handler manage start", duelID)
} 