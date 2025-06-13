package handlers

import (
	"log"
	"net/http"
	"time"

	"courseclash/duel-service/internal/duelsync"

	"github.com/gorilla/websocket"
)

// NotificationHandler maneja las conexiones WebSocket para notificaciones de duelos
func NotificationHandler(w http.ResponseWriter, r *http.Request, userID string) {
	log.Printf("Intento de conexión WebSocket para notificaciones del usuario %s", userID)
	
	// Agregar encabezados CORS
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	
	// Si es una solicitud de verificación previa OPTIONS, respondemos con éxito
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	
	// Actualizar la conexión HTTP a WebSocket
	conn, err := duelsync.Upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Error al actualizar a WebSocket para notificaciones: %v", err)
		log.Printf("Headers de la solicitud: %v", r.Header)
		return
	}
	
	log.Printf("Nueva conexión de notificaciones establecida para el usuario %s", userID)
	
	// Almacenar la conexión en el mapa de conexiones de notificaciones
	duelsync.NotificationMu.Lock()
	
	// Si ya existe una conexión para este usuario, la cerramos
	if existingConn, exists := duelsync.NotificationConnections[userID]; exists && existingConn != nil {
		duelsync.NotificationMu.Unlock()
		log.Printf("Cerrando conexión de notificaciones anterior para el usuario %s", userID)
		// Cerrar la conexión anterior con código de cierre normal
		existingConn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, "Nueva conexión establecida"))
		existingConn.Close()
		
		// Volvemos a adquirir el lock después de cerrar la conexión anterior
		duelsync.NotificationMu.Lock()
	}
	
	// Guardar la nueva conexión
	duelsync.NotificationConnections[userID] = conn
	duelsync.NotificationMu.Unlock()
	
	// Enviar mensaje de bienvenida
	welcomeMsg := map[string]interface{}{
		"type": "welcome",
		"message": "Conexión de notificaciones establecida",
		"timestamp": time.Now().Format(time.RFC3339),
	}
	conn.WriteJSON(welcomeMsg)
	
	// Configurar cleanup cuando se cierre la conexión
	defer func() {
		conn.Close()
		duelsync.NotificationMu.Lock()
		// Solo eliminar si esta conexión sigue siendo la actual para este usuario
		if currentConn, exists := duelsync.NotificationConnections[userID]; exists && currentConn == conn {
			delete(duelsync.NotificationConnections, userID)
			log.Printf("Conexión de notificaciones cerrada para el usuario %s", userID)
		}
		duelsync.NotificationMu.Unlock()
	}()
	
	// Mantener la conexión activa y responder a pings
	for {
		messageType, message, err := conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("Error de lectura en la conexión de notificaciones: %v", err)
			}
			break
		}
		
		// Si recibimos un ping, respondemos con un pong
		if messageType == websocket.PingMessage {
			if err := conn.WriteMessage(websocket.PongMessage, nil); err != nil {
				log.Printf("Error al enviar pong: %v", err)
				break
			}
		} else {
			log.Printf("Mensaje recibido en la conexión de notificaciones de %s: %s", userID, message)
		}
	}
} 