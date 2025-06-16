package repositories

import (
	"context"
	"errors"
	"log"
	"time"

	"courseclash/duel-service/internal/db"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// DuelData representa los datos de un duelo almacenados en MongoDB
type DuelData struct {
	ID           int    `bson:"_id" json:"id"`
	ChallengerID string `bson:"challenger_id" json:"challenger_id"`
	OpponentID   string `bson:"opponent_id" json:"opponent_id"`
	Category     string `bson:"category" json:"category"`
	Status       string `bson:"status" json:"status"`
	WinnerID     string `bson:"winner_id,omitempty" json:"winner_id,omitempty"`
	CreatedAt    time.Time `bson:"created_at" json:"created_at"`
	CompletedAt  *time.Time `bson:"completed_at,omitempty" json:"completed_at,omitempty"`
}

// DuelRepository maneja las operaciones de base de datos para los duelos
type DuelRepository struct {
	collection *mongo.Collection
	countersCollection *mongo.Collection
}

// NewDuelRepository crea una nueva instancia del repositorio de duelos
func NewDuelRepository() *DuelRepository {
	collection := db.MongoClient.Database("duels_db").Collection("duels")
	countersCollection := db.MongoClient.Database("duels_db").Collection("counters")
	return &DuelRepository{
		collection: collection,
		countersCollection: countersCollection,
	}
}

// GetNextDuelID obtiene el siguiente ID consecutivo para un duelo
func (r *DuelRepository) GetNextDuelID() (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"_id": "duel_id"}
	update := bson.M{"$inc": bson.M{"seq": 1}}
	opts := options.FindOneAndUpdate().SetUpsert(true).SetReturnDocument(options.After)

	var result struct {
		ID  string `bson:"_id"`
		Seq int    `bson:"seq"`
	}

	err := r.countersCollection.FindOneAndUpdate(ctx, filter, update, opts).Decode(&result)
	if err != nil {
		log.Printf("Error al obtener siguiente ID de duelo: %v", err)
		return 0, err
	}

	return result.Seq, nil
}

// CreateDuel crea un nuevo duelo con ID único consecutivo
func (r *DuelRepository) CreateDuel(challengerID, opponentID, category string) (*DuelData, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Note: Allowing multiple pending duels between same players
	// No validation - users can create multiple duel requests

	// Obtener el siguiente ID consecutivo
	duelID, err := r.GetNextDuelID()
	if err != nil {
		return nil, err
	}

	duel := &DuelData{
		ID:           duelID,
		ChallengerID: challengerID,
		OpponentID:   opponentID,
		Category:     category,
		Status:       "pending",
		CreatedAt:    time.Now(),
	}

	_, err = r.collection.InsertOne(ctx, duel)
	if err != nil {
		log.Printf("Error al crear duelo: %v", err)
		return nil, err
	}

	return duel, nil
}

// GetDuelByID obtiene un duelo por su ID
func (r *DuelRepository) GetDuelByID(duelID int) (*DuelData, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var duel DuelData
	filter := bson.M{"_id": duelID}

	err := r.collection.FindOne(ctx, filter).Decode(&duel)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, errors.New("duelo no encontrado")
		}
		log.Printf("Error al buscar duelo %d: %v", duelID, err)
		return nil, err
	}

	return &duel, nil
}

// GetPendingDuelBetweenPlayers verifica si existe un duelo pendiente entre dos jugadores
func (r *DuelRepository) GetPendingDuelBetweenPlayers(player1ID, player2ID string) (*DuelData, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Buscar duelos donde cualquiera de los jugadores sea el retador o el oponente
	filter := bson.M{
		"$and": []bson.M{
			{
				"$or": []bson.M{
					{"challenger_id": player1ID, "opponent_id": player2ID},
					{"challenger_id": player2ID, "opponent_id": player1ID},
				},
			},
			{"status": "pending"},
		},
	}

	var duel DuelData
	err := r.collection.FindOne(ctx, filter).Decode(&duel)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil // No hay duelo pendiente
		}
		log.Printf("Error al buscar duelo pendiente entre %s y %s: %v", player1ID, player2ID, err)
		return nil, err
	}

	return &duel, nil
}

// UpdateDuelStatus actualiza el estado de un duelo
func (r *DuelRepository) UpdateDuelStatus(duelID int, status string, winnerID string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"_id": duelID}
	update := bson.M{"$set": bson.M{
		"status": status,
	}}

	if winnerID != "" {
		update["$set"].(bson.M)["winner_id"] = winnerID
	}

	if status == "completed" {
		now := time.Now()
		update["$set"].(bson.M)["completed_at"] = &now
	}

	_, err := r.collection.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Printf("Error al actualizar duelo %d: %v", duelID, err)
		return err
	}

	return nil
} 