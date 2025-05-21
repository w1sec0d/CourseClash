package repositories

import (
	"context"
	"errors"
	"log"
	"time"

	"courseclash/duel-service/internal/db"
	"courseclash/duel-service/internal/models"
	"courseclash/duel-service/internal/services"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// PlayerRepository maneja las operaciones de base de datos para los jugadores
type PlayerRepository struct {
	collection *mongo.Collection
}

// NewPlayerRepository crea una nueva instancia del repositorio de jugadores
func NewPlayerRepository() *PlayerRepository {
	collection := db.MongoClient.Database("courseclash").Collection("players")
	return &PlayerRepository{
		collection: collection,
	}
}

// GetPlayerByID obtiene un jugador por su ID
func (r *PlayerRepository) GetPlayerByID(playerID string) (*models.PlayerData, error) {
	// Busca el jugador en la base de datos y si pasa el timeout se cancela la operación
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var player models.PlayerData
	// Busca el jugador por su ID
	filter := bson.M{"player_id": playerID}

	err := r.collection.FindOne(ctx, filter).Decode(&player)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			// Si el jugador no existe, creamos uno nuevo con valores por defecto
			player = models.PlayerData{
				PlayerID: playerID,
				Elo:      services.DefaultElo,
				Rank:     string(services.GetRankByElo(services.DefaultElo)),
			}
			return &player, nil
		}
		log.Printf("Error al buscar jugador %s: %v", playerID, err)
		return nil, err
	}

	return &player, nil
}

// UpdatePlayer actualiza o crea un jugador en la base de datos
func (r *PlayerRepository) UpdatePlayer(player *models.PlayerData) error {
	// Busca el jugador en la base de datos y si pasa el timeout se cancela la operación
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"player_id": player.PlayerID}
	update := bson.M{"$set": bson.M{
		"elo":  player.Elo,
		"rank": player.Rank,
	}}
	opts := options.Update().SetUpsert(true)

	_, err := r.collection.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		log.Printf("Error al actualizar jugador %s: %v", player.PlayerID, err)
		return err
	}

	return nil
}
