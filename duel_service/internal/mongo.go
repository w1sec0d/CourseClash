package db

import (
    "context"
    "fmt"
    "log"
    "os"
    "time"

    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

var MongoClient *mongo.Client

func InitMongo() {
    mongoURI := os.Getenv("MONGODB_URI")
    if mongoURI == "" {
        log.Fatal("MONGODB_URI no está definido en el entorno")
    }

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
    if err != nil {
        log.Fatal("Error al conectar a MongoDB Atlas:", err)
    }

    // Verificar conexión
    err = client.Ping(ctx, nil)
    if err != nil {
        log.Fatal("Error al hacer ping a MongoDB Atlas:", err)
    }

    fmt.Println("✅ Conectado a MongoDB Atlas")
    MongoClient = client
}

