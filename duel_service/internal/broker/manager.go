package broker

import (
	"log"
	"sync"
)

var (
	globalClient *RabbitMQClient
	clientMutex  sync.RWMutex
)

// SetGlobalClient sets the global RabbitMQ client
func SetGlobalClient(client *RabbitMQClient) {
	clientMutex.Lock()
	defer clientMutex.Unlock()
	globalClient = client
}

// GetGlobalClient returns the global RabbitMQ client
func GetGlobalClient() *RabbitMQClient {
	clientMutex.RLock()
	defer clientMutex.RUnlock()
	return globalClient
}

// PublishQuestionToWebSocket publishes a question event to WebSocket clients
func PublishQuestionToWebSocket(duelID string, question map[string]interface{}) error {
	client := GetGlobalClient()
	if client == nil {
		log.Printf("WARNING: RabbitMQ client not initialized, skipping question publish")
		return nil
	}
	return client.PublishQuestionEvent(duelID, question)
}

// PublishStatusToWebSocket publishes a status event to WebSocket clients
func PublishStatusToWebSocket(duelID, message string) error {
	client := GetGlobalClient()
	if client == nil {
		log.Printf("WARNING: RabbitMQ client not initialized, skipping status publish")
		return nil
	}
	return client.PublishStatusEvent(duelID, message)
}

// PublishResultsToWebSocket publishes results to WebSocket clients
func PublishResultsToWebSocket(duelID string, results map[string]interface{}) error {
	client := GetGlobalClient()
	if client == nil {
		log.Printf("WARNING: RabbitMQ client not initialized, skipping results publish")
		return nil
	}
	return client.PublishResultsEvent(duelID, results)
}

// PublishPlayerConnected publishes player connection event
func PublishPlayerConnected(duelID, userID string) error {
	client := GetGlobalClient()
	if client == nil {
		log.Printf("WARNING: RabbitMQ client not initialized, skipping player connected publish")
		return nil
	}
	return client.PublishPlayerConnectedEvent(duelID, userID)
} 