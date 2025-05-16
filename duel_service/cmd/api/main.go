package main

import (
    "fmt"
    "context"
    "log"
    "os"

    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
    // ejemplo básico de conexión a Mongo
    client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(os.Getenv("MONGO_URI")))
    if err != nil {
        log.Fatal(err)
    }
    defer client.Disconnect(context.TODO())


    fmt.Println("duel_service running")
}
