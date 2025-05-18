package main

import (
	"log"

	"github.com/gin-gonic/gin"
)

//----------------------------------------------------------------------------------

func main() {
	r := gin.Default()

	RegisterRoutes(r)

	log.Println("Servicio de Duelos iniciado en el puerto 8080")
	r.Run(":8080")
}
