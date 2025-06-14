package broker

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	amqp "github.com/rabbitmq/amqp091-go"
)

type RabbitMQClient struct {
	conn    *amqp.Connection
	channel *amqp.Channel
}

type DuelEvent struct {
	Type     string                 `json:"type"`
	DuelID   string                 `json:"duelId"`
	UserID   string                 `json:"userId,omitempty"`
	Data     map[string]interface{} `json:"data,omitempty"`
	Message  string                 `json:"message,omitempty"`
}

func NewRabbitMQClient() (*RabbitMQClient, error) {
	rabbitmqURL := os.Getenv("RABBITMQ_URL")
	if rabbitmqURL == "" {
		rabbitmqURL = "amqp://courseclash:courseclash123@cc_broker:5672/courseclash"
	}

	conn, err := amqp.Dial(rabbitmqURL)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to RabbitMQ: %v", err)
	}

	ch, err := conn.Channel()
	if err != nil {
		conn.Close()
		return nil, fmt.Errorf("failed to open channel: %v", err)
	}

	// Declare the exchange
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
		ch.Close()
		conn.Close()
		return nil, fmt.Errorf("failed to declare exchange: %v", err)
	}

	return &RabbitMQClient{
		conn:    conn,
		channel: ch,
	}, nil
}

func (r *RabbitMQClient) Close() {
	if r.channel != nil {
		r.channel.Close()
	}
	if r.conn != nil {
		r.conn.Close()
	}
}

func (r *RabbitMQClient) PublishDuelEvent(routingKey string, event DuelEvent) error {
	body, err := json.Marshal(event)
	if err != nil {
		return fmt.Errorf("failed to marshal event: %v", err)
	}

	err = r.channel.Publish(
		"duels.topic", // exchange
		routingKey,    // routing key
		false,         // mandatory
		false,         // immediate
		amqp.Publishing{
			ContentType:  "application/json",
			Body:         body,
			DeliveryMode: amqp.Persistent, // make message persistent
		})

	if err != nil {
		return fmt.Errorf("failed to publish message: %v", err)
	}

	log.Printf("Published event to RabbitMQ: %s -> %s", routingKey, string(body))
	return nil
}

// Convenience methods for common events
func (r *RabbitMQClient) PublishQuestionEvent(duelID string, question map[string]interface{}) error {
	event := DuelEvent{
		Type:   "question",
		DuelID: duelID,
		Data:   question,
	}
	return r.PublishDuelEvent("duel.websocket.question", event)
}

func (r *RabbitMQClient) PublishStatusEvent(duelID, message string) error {
	event := DuelEvent{
		Type:    "status",
		DuelID:  duelID,
		Message: message,
	}
	return r.PublishDuelEvent("duel.websocket.status", event)
}

func (r *RabbitMQClient) PublishResultsEvent(duelID string, results map[string]interface{}) error {
	event := DuelEvent{
		Type:   "results",
		DuelID: duelID,
		Data:   results,
	}
	return r.PublishDuelEvent("duel.websocket.results", event)
}

func (r *RabbitMQClient) PublishPlayerConnectedEvent(duelID, userID string) error {
	event := DuelEvent{
		Type:   "player_connected",
		DuelID: duelID,
		UserID: userID,
	}
	return r.PublishDuelEvent("duel.player.connected", event)
}