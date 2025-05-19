package main

import (
	"log"

	_ "courseclash/duel-service/docs" // Importa los docs generados por swag

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

//-----------------------------INICIALIZA SERVIDOR-----------------------------------------------------

func main() {
	r := gin.Default()

	RegisterRoutes(r)

	log.Println("Servicio de Duelos iniciado en el puerto 8080")
	// Ruta para la documentación Swagger
    r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	r.Run(":8080")
}
