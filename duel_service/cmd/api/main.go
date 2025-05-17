package main

// !! PARA QUE TODO ESTO FUNCIONE EL RETADOR DEBE CONECTARSE AL WEB SOCKKET PARA escuchar el canal

import (
	//HTTP
	"net/http"

	//Para peticiones HTTP sencillas
	"github.com/gin-gonic/gin"

	"courseclash/duel-service/internal/handlers"
	"time"

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


// Aqui se guarda la información acerca de cada una de las solicitudes de los duelos
// *Se crea un canal, que permite que un jugador espere hasta que llegue la confirmación del duelo del otro jugador (true|false)
// ? Se podría intentar enviar esto a una base de datos. Sin embargo de momento debería funcionar perfectamente. 
var duelRequests = make(map[string]chan bool) 


// Mapa que almacena las conexiones webSocket para cada uno de los jugadores
type DuelConnection struct {
	Player1 *handlers.Player
	Player2 *handlers.Player
}

var duelConnections = make(map[string] *DuelConnection)

// * Este es el punto de entrada del servicio, aquí se inicializa. 
// De manera general, define un router con r para manejar las peticiones al servicio
// * PUERTO DE CONEXIÓN 8080

func main() {
	r := gin.Default()


	// Ruta que permite solicitar un duelo, recibe un json con la ID del que lo solicita y la del que la recibe
	r.POST("/api/duels/request", func(c *gin.Context) {

		// TODO cambiar  estoa  una id numérica
		var request struct {
			RequesterID string `json:"requester_id"`
			OpponentID  string `json:"opponent_id"`
		}

		// Si hay un error en el JSON devuelve un mensaje de error (400)
		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		//Crea el ID del duelo y revisa si ya existe, en caso de que si devuelve que el duelo ya habia sido creado
		duelID := request.RequesterID + "_vs_" + request.OpponentID
		if _, exists := duelRequests[duelID]; exists {
			c.JSON(http.StatusConflict, gin.H{"error": "Duel already requested"})
			return
		}

		// * Crea un canal, esto permite que el que hace el reto espere hasta ser aceptado así mismo devuelve el id del duelo
		duelRequests[duelID] = make(chan bool)
		c.JSON(http.StatusOK, gin.H{"duel_id": duelID})
	})


	// Ruta que permite aceptar un duelo, recibe como entrada un ID de duelo. 
	r.POST("/api/duels/accept", func(c *gin.Context) {
		var accept struct {
			DuelID string `json:"duel_id"`
		}

		// Si el ID del duelo no es correcto devuelve un error (400)
		if err := c.ShouldBindJSON(&accept); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		// Si efectivamente existe el duelo se devuelve al canal un true, de manera que el que habia solicitado el 
		// Esto permitirá que el retador y el retado sigan con el duelo. 
		if ch, exists := duelRequests[accept.DuelID]; exists {
			/**/
			ch <- true
			c.JSON(http.StatusOK, gin.H{"message": "Duel accepted"})
		} else {
			c.JSON(http.StatusNotFound, gin.H{"error": "Duel not found"})
		}
	})


	// * Aquí se define la URL de un cliente WEB SOCKET, al entrar al  endpoint especificado
	// De igual manera se establace wsHandler que establace la conexión websocket
	
	r.GET("/ws/duels/:duel_id/:player_id", func(c *gin.Context) {
		duelID := c.Param("duel_id")
		PlayerID := c.Param("player_id")
		wsHandler(c.Writer, c.Request, duelID, PlayerID)
	})

	r.Run(":8080")
}

// Aquí se utiliza el upgrader para convertir una conexión HTTP a una conexión web socket si no hay errores
// * En caso de que exista un duelo y haya sido aceptado se iniciará el duelo. 

func wsHandler(w http.ResponseWriter, r *http.Request, duelID, playerID string) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	defer conn.Close()

	// Esperar a que el duelo haya sido aceptado
	ch, exists := duelRequests[duelID]
	if !exists {
		conn.WriteMessage(websocket.TextMessage, []byte("Invalid duel ID"))
		return
	}

	select {
	case accepted := <-ch:
		if !accepted {
			conn.WriteMessage(websocket.TextMessage, []byte("Duel not accepted"))
			return
		}
	case <-time.After(30 * time.Second):
		conn.WriteMessage(websocket.TextMessage, []byte("Duel request timed out"))
		delete(duelRequests, duelID)
		return
	}

	// Crear el jugador
	player := &handlers.Player{
		ID:    playerID,
		Score: 0,
		Conn:  conn,
	}

	// Guardar el jugador en el mapa
	if duelConnections[duelID] == nil {
		duelConnections[duelID] = &DuelConnection{}
	}

	dc := duelConnections[duelID]
	if dc.Player1 == nil {
		dc.Player1 = player
		conn.WriteMessage(websocket.TextMessage, []byte("Esperando al oponente..."))
		// Esperar indefinidamente hasta que llegue el segundo jugador
		for {
			time.Sleep(1 * time.Second)
			if dc.Player2 != nil {
				break
			}
		}
		startDuel(dc.Player1, dc.Player2, duelID)
	} else if dc.Player2 == nil {
		dc.Player2 = player
		conn.WriteMessage(websocket.TextMessage, []byte("¡Duelo listo!"))
		startDuel(dc.Player1, dc.Player2, duelID)
	} else {
		conn.WriteMessage(websocket.TextMessage, []byte("Ya hay dos jugadores conectados."))
	}
}

func startDuel(player1, player2 *handlers.Player, duelID string) {
	questions := []handlers.Question{
		{ID: "1", Text: "¿Cuál es la capital de Francia?", Answer: "Paris", Duration: 10},
		{ID: "2", Text: "¿Cuánto es 2+2?", Answer: "4", Duration: 5},
	}

	go handlers.HandleDuel(player1, player2, questions)
}
