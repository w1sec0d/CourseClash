// @title           CourseClash Duel Service API
// @version         1.0
// @description     API para el servicio de duelos de CourseClash
// @host            localhost:8002
// @BasePath        /api
// @schemes         http

package main

import (
	"context"
	"log"

	_ "courseclash/duel-service/docs"
	"courseclash/duel-service/internal/db"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

//-----------------------------INICIALIZA SERVIDOR-----------------------------------------------------

func main() {
	// Inicializar MongoDB
	db.InitMongo()
	defer func() {
		if err := db.MongoClient.Disconnect(context.Background()); err != nil {
			log.Fatal("Error al desconectar MongoDB:", err)
		}
	}()

	r := gin.Default()
	RegisterRoutes(r)

	log.Println("Servicio de Duelos iniciado en el puerto 8002")
	// Ruta para la documentación Swagger
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	
	if err := r.Run(":8002"); err != nil {
		log.Fatal("Error al iniciar el servidor:", err)
	}
}
