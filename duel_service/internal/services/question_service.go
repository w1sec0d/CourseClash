package services

import (
	"context"
	"log"
	"time"

	"courseclash/duel-service/internal/db"
	"courseclash/duel-service/internal/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// Número máximo de preguntas por duelo
const MaxQuestionsPerDuel = 5

// QuestionService maneja la lógica de negocio relacionada con las preguntas
type QuestionService struct {
	collection *mongo.Collection
}

// NewQuestionService crea una nueva instancia del servicio de preguntas
func NewQuestionService() *QuestionService {
	collection := db.MongoClient.Database("duels_db").Collection("questions")
	return &QuestionService{
		collection: collection,
	}
}

// GetQuestionsForDuel obtiene preguntas aleatorias para un duelo específico por categoría
func (s *QuestionService) GetQuestionsForDuel(category string) ([]models.Question, error) {
	// Busca preguntas en la base de datos con un timeout de 5 segundos
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Filtrar por la categoría específica
	filter := bson.M{"category": category}

	// Configurar el pipeline de agregación para obtener documentos aleatorios
	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: filter}},
		{{Key: "$sample", Value: bson.M{"size": MaxQuestionsPerDuel}}},
	}

	cursor, err := s.collection.Aggregate(ctx, pipeline)
	if err != nil {
		log.Printf("Error al obtener preguntas aleatorias para la categoría %s: %v", category, err)
		return getBackupQuestions(), nil
	}
	defer cursor.Close(ctx)

	// Estructura para mapear los documentos de MongoDB
	type DBQuestion struct {
		ID       string   `bson:"_id,omitempty"`
		Category string   `bson:"category"`
		Question string   `bson:"question"`
		Answer   string   `bson:"answer"`
		Options  []string `bson:"options"`
		Duration int      `bson:"duration"`
	}

	var dbQuestions []DBQuestion
	if err := cursor.All(ctx, &dbQuestions); err != nil {
		log.Printf("Error al decodificar preguntas: %v", err)
		return getBackupQuestions(), nil
	}

	// Si no hay preguntas en la base de datos, usar preguntas de respaldo
	if len(dbQuestions) == 0 {
		log.Printf("No hay preguntas en la base de datos para la categoría %s. Usando preguntas de respaldo.", category)
		return getBackupQuestions(), nil
	}

	// Convertir las preguntas de la base de datos al formato del modelo
	questions := make([]models.Question, 0, len(dbQuestions))
	for _, q := range dbQuestions {
		questions = append(questions, models.Question{
			ID:       q.ID,
			Text:     q.Question,
			Answer:   q.Answer,
			Options:  q.Options,
			Duration: q.Duration,
			Category: q.Category,
		})
	}

	// Si no hay suficientes preguntas, complementar con preguntas de respaldo
	if len(questions) < MaxQuestionsPerDuel {
		log.Printf("No hay suficientes preguntas en la base de datos para la categoría %s. Complementando con preguntas de respaldo.", category)
		backupQuestions := getBackupQuestions()
		
		// Añadir preguntas de respaldo hasta completar el máximo
		for i := 0; i < MaxQuestionsPerDuel-len(questions) && i < len(backupQuestions); i++ {
			questions = append(questions, backupQuestions[i])
		}
	}

	// Asegurarse de que no haya más del máximo de preguntas
	if len(questions) > MaxQuestionsPerDuel {
		questions = questions[:MaxQuestionsPerDuel]
	}

	return questions, nil
}

// getBackupQuestions proporciona preguntas de respaldo en caso de que no haya suficientes en la base de datos
func getBackupQuestions() []models.Question {
	return []models.Question{
		{
			ID:       "backup1",
			Text:     "¿Cuál es el río más largo del mundo?",
			Answer:   "Nilo",
			Options:  []string{"Amazonas", "Nilo", "Misisipi", "Yangtsé"},
			Duration: 30,
			Category: "geografia",
		},
		{
			ID:       "backup2",
			Text:     "¿Cuál es el elemento químico con símbolo 'O'?",
			Answer:   "Oxígeno",
			Options:  []string{"Oro", "Osmio", "Oxígeno", "Boro"},
			Duration: 30,
			Category: "ciencias",
		},
		{
			ID:       "backup3",
			Text:     "¿En qué año llegó Cristóbal Colón a América?",
			Answer:   "1492",
			Options:  []string{"1492", "1592", "1392", "1500"},
			Duration: 30,
			Category: "historia",
		},
		{
			ID:       "backup4",
			Text:     "¿Cuál es 2 + 2?",
			Answer:   "4",
			Options:  []string{"3", "4", "5", "6"},
			Duration: 30,
			Category: "matematica",
		},
		{
			ID:       "backup5",
			Text:     "¿Quién escribió 'Cien años de soledad'?",
			Answer:   "Gabriel García Márquez",
			Options:  []string{"Mario Vargas Llosa", "Gabriel García Márquez", "Julio Cortázar", "Pablo Neruda"},
			Duration: 30,
			Category: "literatura",
		},
	}
}

// GetAvailableCategories devuelve las categorías disponibles para duelos
func (s *QuestionService) GetAvailableCategories() []models.Category {
	return []models.Category{
		{ID: "matematica", Name: "Matemática"},
		{ID: "historia", Name: "Historia"},
		{ID: "geografia", Name: "Geografía"},
		{ID: "ciencias", Name: "Ciencias"},
		{ID: "literatura", Name: "Literatura"},
		{ID: "fisica", Name: "Física"},
		{ID: "quimica", Name: "Química"},
		{ID: "biologia", Name: "Biología"},
	}
}
