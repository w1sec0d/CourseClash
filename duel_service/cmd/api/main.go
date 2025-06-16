// @title           CourseClash Duel Service API
// @version         1.0
// @description     API para el servicio de duelos de CourseClash
// @host            localhost:8002
// @BasePath        /api
// @schemes         http

package main

import (
	"context"
	"fmt"
	"log"

	_ "courseclash/duel-service/docs"
	"courseclash/duel-service/internal/broker"
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

	// Inicializar RabbitMQ
	rabbitMQClient, err := broker.NewRabbitMQClient()
	if err != nil {
		log.Fatal("Error al conectar con RabbitMQ:", err)
	}
	defer rabbitMQClient.Close()
	
	// Set global client
	broker.SetGlobalClient(rabbitMQClient)
	log.Println("RabbitMQ conectado exitosamente")

	// Start RabbitMQ consumer
	if err := broker.StartConsumer(); err != nil {
		log.Printf("Warning: Failed to start RabbitMQ consumer: %v", err)
	} else {
		log.Println("RabbitMQ consumer iniciado exitosamente")
	}

	r := gin.Default()
	
	// Add request logging middleware
	r.Use(gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		return fmt.Sprintf("🌐 [HTTP] %s %s %d %v\n",
			param.Method,
			param.Path,
			param.StatusCode,
			param.Latency,
		)
	}))
	
	RegisterRoutes(r)

	log.Println("Servicio de Duelos iniciado en el puerto 8002")
	// Ruta para la documentación Swagger
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	
	if err := r.Run(":8002"); err != nil {
		log.Fatal("Error al iniciar el servidor:", err)
	}
}
