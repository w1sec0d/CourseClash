package handlers

import (
	"log"
	"net/http"
)

// LEGACY: NotificationHandler removed - all notifications now go through WebSocket Manager
// This ensures 100% RabbitMQ-based architecture

// NotificationHandler is a legacy compatibility handler that redirects to WebSocket Manager
func NotificationHandler(w http.ResponseWriter, r *http.Request, userID string) {
	log.Printf("LEGACY: Direct notification WebSocket connection attempted for user %s", userID)
	log.Printf("REDIRECT: Use WebSocket Manager at ws://websocket_manager:8004/ws/notifications/%s", userID)
	
	// Return a 410 Gone status to indicate this endpoint is deprecated
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusGone)
	w.Write([]byte(`{
		"error": "Endpoint deprecated", 
		"message": "Use WebSocket Manager for notifications",
		"websocket_manager_url": "ws://websocket_manager:8004/ws/notifications/` + userID + `"
	}`))
} 