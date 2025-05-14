package main

import (
	//HTTP
	"net/http"

	//Para peticiones HTTP sencillas
	"github.com/gin-gonic/gin"

	//Para gestionar los WebSockets
	"github.com/gorilla/websocket"
)

//Este es el objeto encargado de convertir una petición http a web socket
//Además CheckOrigin se utliza para validar el origen de una solicitud WebSocket
//De esta manera se establece un canal de comunicación real entre cliente servidor

// ! Actualmente acepta cualquier origen, es necesario revisarlo por serguridad
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}


// * Este es el punto de entrada del servicio, aquí se inicializa. 
// De manera general, define un router con r para manejar las peticiones al servicio
// * Aquí se define la URL de un cliente WEB SOCKET, al entrar al  endpoint especificado
// De igual manera se establace wsHandler que establace la conexión websocket
// * PUERTO DE CONEXIÓN 8080


func main() {
	r := gin.Default()

	r.GET("/ws/duels/:duel_id", func(c *gin.Context) {
		duelID := c.Param("duel_id")
		wsHandler(c.Writer, c.Request, duelID)
	})

	r.Run(":8080")
}



// Aquí se utiliza el upgrader para convertir una conexión HTTP a una conexión web socket si no hay errores
// * Lo más importante es que se establece un bucle infinito manteniendo la conexión entre cliente-servidor activa
// Siempre que no haya errores tanto cliente como servidor pueden enviar mensajes en tiempo real

// TODO Probar que funcione con alguna prueba básica de conexión. 
func wsHandler(w http.ResponseWriter, r *http.Request, duelID string) {
	
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	//Cierra la conexión web socket automáticamente cuándo la función termine
	defer conn.Close()

	for {
		// Si el cliente no envia nada el servidor se queda esperando un mensaje, pero no se bloquea
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			break
		}
		response := "Received: " + string(p) + " in duel " + duelID
		if err := conn.WriteMessage(messageType, []byte(response)); err != nil {
			break
		}
	}
}