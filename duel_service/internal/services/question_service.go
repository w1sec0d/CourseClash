package services

import (
	"context"
	"log"
	"math/rand"
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
		return GetBackupQuestionsByCategory(category), nil
	}
	defer cursor.Close(ctx)

	// Estructura para mapear los documentos de MongoDB
	type DBQuestion struct {
		ID       string   `bson:"_id,omitempty"`
		Category string   `bson:"category"`
		Question string   `bson:"question"`
		Answer   string   `bson:"correct_answer"`
		Options  []string `bson:"options"`
		Duration int      `bson:"duration"`
	}

	var dbQuestions []DBQuestion
	if err := cursor.All(ctx, &dbQuestions); err != nil {
		log.Printf("Error al decodificar preguntas: %v", err)
		return GetBackupQuestionsByCategory(category), nil
	}

	// Si no hay preguntas en la base de datos, usar preguntas de respaldo específicas por categoría
	if len(dbQuestions) == 0 {
		log.Printf("No hay preguntas en la base de datos para la categoría %s. Usando preguntas de respaldo específicas.", category)
		return GetBackupQuestionsByCategory(category), nil
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

	// Si no hay suficientes preguntas, complementar con preguntas de respaldo específicas por categoría
	if len(questions) < MaxQuestionsPerDuel {
		log.Printf("No hay suficientes preguntas en la base de datos para la categoría %s. Complementando con preguntas de respaldo específicas.", category)
		backupQuestions := GetBackupQuestionsByCategory(category)
		
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

// GetBackupQuestionsByCategory proporciona preguntas de respaldo específicas por categoría
func GetBackupQuestionsByCategory(category string) []models.Question {
	var questions []models.Question
	switch category {
	case "matematica":
		questions = []models.Question{
			{ID: "backup_math1", Text: "¿Cuánto es 2+2?", Answer: "4", Options: []string{"3", "4", "5", "6"}, Duration: 30, Category: "matematica"},
			{ID: "backup_math2", Text: "¿Cuál es la raíz cuadrada de 16?", Answer: "4", Options: []string{"2", "4", "6", "8"}, Duration: 30, Category: "matematica"},
			{ID: "backup_math3", Text: "¿Cuánto es 5 × 7?", Answer: "35", Options: []string{"30", "35", "40", "45"}, Duration: 30, Category: "matematica"},
			{ID: "backup_math4", Text: "¿Cuánto es 10 ÷ 2?", Answer: "5", Options: []string{"4", "5", "6", "7"}, Duration: 30, Category: "matematica"},
			{ID: "backup_math5", Text: "¿Cuál es el valor de π (pi) aproximadamente?", Answer: "3.14", Options: []string{"3.12", "3.14", "3.16", "3.18"}, Duration: 30, Category: "matematica"},
			{ID: "backup_math6", Text: "¿Cuánto es 15% de 100?", Answer: "15", Options: []string{"10", "15", "20", "25"}, Duration: 30, Category: "matematica"},
			{ID: "backup_math7", Text: "¿Cuál es la fórmula del área de un triángulo?", Answer: "base × altura ÷ 2", Options: []string{"base × altura", "base × altura ÷ 2", "base + altura", "base ÷ altura"}, Duration: 30, Category: "matematica"},
			{ID: "backup_math8", Text: "¿Cuánto es 8²?", Answer: "64", Options: []string{"56", "64", "72", "80"}, Duration: 30, Category: "matematica"},
		}
	case "historia":
		questions = []models.Question{
			{ID: "backup_hist1", Text: "¿En qué año comenzó la Segunda Guerra Mundial?", Answer: "1939", Options: []string{"1914", "1939", "1945", "1918"}, Duration: 30, Category: "historia"},
			{ID: "backup_hist2", Text: "¿Quién fue el primer presidente de Estados Unidos?", Answer: "George Washington", Options: []string{"Thomas Jefferson", "George Washington", "John Adams", "Benjamin Franklin"}, Duration: 30, Category: "historia"},
			{ID: "backup_hist3", Text: "¿En qué año cayó el Muro de Berlín?", Answer: "1989", Options: []string{"1987", "1989", "1991", "1993"}, Duration: 30, Category: "historia"},
			{ID: "backup_hist4", Text: "¿En qué año llegó Cristóbal Colón a América?", Answer: "1492", Options: []string{"1490", "1492", "1494", "1496"}, Duration: 30, Category: "historia"},
			{ID: "backup_hist5", Text: "¿Quién fue el emperador romano que legalizó el cristianismo?", Answer: "Constantino", Options: []string{"Nerón", "Constantino", "Augusto", "Trajano"}, Duration: 30, Category: "historia"},
			{ID: "backup_hist6", Text: "¿En qué año terminó la Primera Guerra Mundial?", Answer: "1918", Options: []string{"1917", "1918", "1919", "1920"}, Duration: 30, Category: "historia"},
			{ID: "backup_hist7", Text: "¿Cuál fue la primera civilización en desarrollar la escritura?", Answer: "Sumerios", Options: []string{"Egipcios", "Sumerios", "Griegos", "Romanos"}, Duration: 30, Category: "historia"},
			{ID: "backup_hist8", Text: "¿En qué siglo ocurrió la Revolución Francesa?", Answer: "XVIII", Options: []string{"XVII", "XVIII", "XIX", "XVI"}, Duration: 30, Category: "historia"},
		}
	case "geografia":
		questions = []models.Question{
			{ID: "backup_geo1", Text: "¿Cuál es el río más largo del mundo?", Answer: "Nilo", Options: []string{"Amazonas", "Nilo", "Mississippi", "Yangtsé"}, Duration: 30, Category: "geografia"},
			{ID: "backup_geo2", Text: "¿Cuál es la capital de Australia?", Answer: "Canberra", Options: []string{"Sydney", "Melbourne", "Canberra", "Perth"}, Duration: 30, Category: "geografia"},
			{ID: "backup_geo3", Text: "¿En qué continente está ubicado Egipto?", Answer: "África", Options: []string{"Asia", "África", "Europa", "América"}, Duration: 30, Category: "geografia"},
			{ID: "backup_geo4", Text: "¿Cuál es la capital de Francia?", Answer: "París", Options: []string{"Londres", "Madrid", "París", "Roma"}, Duration: 30, Category: "geografia"},
			{ID: "backup_geo5", Text: "¿Cuál es el país más grande del mundo por superficie?", Answer: "Rusia", Options: []string{"China", "Canadá", "Estados Unidos", "Rusia"}, Duration: 30, Category: "geografia"},
			{ID: "backup_geo6", Text: "¿Cuál es la montaña más alta del mundo?", Answer: "Monte Everest", Options: []string{"K2", "Monte Everest", "Kilimanjaro", "Mont Blanc"}, Duration: 30, Category: "geografia"},
			{ID: "backup_geo7", Text: "¿Cuál es el océano más grande del mundo?", Answer: "Pacífico", Options: []string{"Atlántico", "Índico", "Pacífico", "Ártico"}, Duration: 30, Category: "geografia"},
			{ID: "backup_geo8", Text: "¿En qué país se encuentra Machu Picchu?", Answer: "Perú", Options: []string{"Bolivia", "Perú", "Ecuador", "Colombia"}, Duration: 30, Category: "geografia"},
		}
	case "ciencias":
		questions = []models.Question{
			{ID: "backup_sci1", Text: "¿Cuál es el planeta más grande del sistema solar?", Answer: "Júpiter", Options: []string{"Tierra", "Júpiter", "Saturno", "Marte"}, Duration: 30, Category: "ciencias"},
			{ID: "backup_sci2", Text: "¿Cuál es el símbolo químico del oro?", Answer: "Au", Options: []string{"Go", "Au", "Ag", "Al"}, Duration: 30, Category: "ciencias"},
			{ID: "backup_sci3", Text: "¿Cuántos huesos tiene un adulto humano?", Answer: "206", Options: []string{"206", "208", "210", "212"}, Duration: 30, Category: "ciencias"},
			{ID: "backup_sci4", Text: "¿Cuál es el símbolo químico del agua?", Answer: "H2O", Options: []string{"HO", "H2O", "H3O", "OH"}, Duration: 30, Category: "ciencias"},
			{ID: "backup_sci5", Text: "¿Cuántos planetas hay en nuestro sistema solar?", Answer: "8", Options: []string{"7", "8", "9", "10"}, Duration: 30, Category: "ciencias"},
			{ID: "backup_sci6", Text: "¿Qué gas es esencial para la respiración humana?", Answer: "Oxígeno", Options: []string{"Dióxido de carbono", "Oxígeno", "Nitrógeno", "Hidrógeno"}, Duration: 30, Category: "ciencias"},
			{ID: "backup_sci7", Text: "¿Qué planeta es conocido como el planeta rojo?", Answer: "Marte", Options: []string{"Venus", "Marte", "Júpiter", "Saturno"}, Duration: 30, Category: "ciencias"},
			{ID: "backup_sci8", Text: "¿Cuál es la velocidad de la luz en el vacío?", Answer: "300,000 km/s", Options: []string{"300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"}, Duration: 30, Category: "ciencias"},
		}
	case "literatura":
		questions = []models.Question{
			{ID: "backup_lit1", Text: "¿Quién escribió 'Don Quijote de la Mancha'?", Answer: "Miguel de Cervantes", Options: []string{"Federico García Lorca", "Miguel de Cervantes", "Francisco de Quevedo", "Lope de Vega"}, Duration: 30, Category: "literatura"},
			{ID: "backup_lit2", Text: "¿Quién escribió 'Cien años de soledad'?", Answer: "Gabriel García Márquez", Options: []string{"Mario Vargas Llosa", "Gabriel García Márquez", "Jorge Luis Borges", "Octavio Paz"}, Duration: 30, Category: "literatura"},
			{ID: "backup_lit3", Text: "¿En qué siglo vivió William Shakespeare?", Answer: "XVI-XVII", Options: []string{"XV-XVI", "XVI-XVII", "XVII-XVIII", "XVIII-XIX"}, Duration: 30, Category: "literatura"},
			{ID: "backup_lit4", Text: "¿Quién escribió 'Romeo y Julieta'?", Answer: "William Shakespeare", Options: []string{"Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"}, Duration: 30, Category: "literatura"},
			{ID: "backup_lit5", Text: "¿Cuál es la primera obra de la literatura española?", Answer: "El Cantar de Mio Cid", Options: []string{"El Cantar de Mio Cid", "La Celestina", "El Lazarillo de Tormes", "El Libro de Buen Amor"}, Duration: 30, Category: "literatura"},
			{ID: "backup_lit6", Text: "¿Quién escribió '1984'?", Answer: "George Orwell", Options: []string{"Aldous Huxley", "George Orwell", "Ray Bradbury", "Philip K. Dick"}, Duration: 30, Category: "literatura"},
			{ID: "backup_lit7", Text: "¿Cuál es el primer libro de Harry Potter?", Answer: "La Piedra Filosofal", Options: []string{"La Cámara Secreta", "El Prisionero de Azkaban", "La Piedra Filosofal", "El Cáliz de Fuego"}, Duration: 30, Category: "literatura"},
			{ID: "backup_lit8", Text: "¿En qué obra aparece el personaje de Sherlock Holmes?", Answer: "Obras de Arthur Conan Doyle", Options: []string{"Obras de Agatha Christie", "Obras de Arthur Conan Doyle", "Obras de Edgar Allan Poe", "Obras de Raymond Chandler"}, Duration: 30, Category: "literatura"},
		}
	case "fisica":
		questions = []models.Question{
			{ID: "backup_fis1", Text: "¿Cuál es la unidad de medida de la fuerza en el Sistema Internacional?", Answer: "Newton", Options: []string{"Joule", "Newton", "Pascal", "Watt"}, Duration: 30, Category: "fisica"},
			{ID: "backup_fis2", Text: "¿Quién formuló la ley de la gravedad universal?", Answer: "Newton", Options: []string{"Einstein", "Galileo", "Newton", "Kepler"}, Duration: 30, Category: "fisica"},
			{ID: "backup_fis3", Text: "¿Cuál es la velocidad de caída libre en la Tierra?", Answer: "9.8 m/s²", Options: []string{"9.8 m/s²", "10 m/s²", "9 m/s²", "8.9 m/s²"}, Duration: 30, Category: "fisica"},
			{ID: "backup_fis4", Text: "¿Qué partícula subatómica tiene carga negativa?", Answer: "Electrón", Options: []string{"Protón", "Neutrón", "Electrón", "Positrón"}, Duration: 30, Category: "fisica"},
			{ID: "backup_fis5", Text: "¿Cuál es la primera ley de Newton?", Answer: "Ley de la inercia", Options: []string{"Ley de la gravedad", "Ley de la inercia", "Ley de acción y reacción", "Ley de la fuerza"}, Duration: 30, Category: "fisica"},
			{ID: "backup_fis6", Text: "¿Qué es la energía cinética?", Answer: "Energía de movimiento", Options: []string{"Energía de posición", "Energía de movimiento", "Energía térmica", "Energía química"}, Duration: 30, Category: "fisica"},
			{ID: "backup_fis7", Text: "¿Cuál es la unidad de medida de la energía?", Answer: "Joule", Options: []string{"Newton", "Watt", "Joule", "Pascal"}, Duration: 30, Category: "fisica"},
			{ID: "backup_fis8", Text: "¿Qué tipo de ondas son las ondas de sonido?", Answer: "Ondas mecánicas", Options: []string{"Ondas electromagnéticas", "Ondas mecánicas", "Ondas gravitacionales", "Ondas cuánticas"}, Duration: 30, Category: "fisica"},
		}
	case "quimica":
		questions = []models.Question{
			{ID: "backup_qui1", Text: "¿Cuál es el símbolo químico del hierro?", Answer: "Fe", Options: []string{"Hi", "Fe", "Ir", "He"}, Duration: 30, Category: "quimica"},
			{ID: "backup_qui2", Text: "¿Cuántos elementos hay en la tabla periódica actual?", Answer: "118", Options: []string{"116", "117", "118", "119"}, Duration: 30, Category: "quimica"},
			{ID: "backup_qui3", Text: "¿Cuál es el pH del agua pura?", Answer: "7", Options: []string{"6", "7", "8", "9"}, Duration: 30, Category: "quimica"},
			{ID: "backup_qui4", Text: "¿Cuál es la fórmula química del dióxido de carbono?", Answer: "CO2", Options: []string{"CO", "CO2", "C2O", "CO3"}, Duration: 30, Category: "quimica"},
			{ID: "backup_qui5", Text: "¿Qué gas constituye aproximadamente el 78% de la atmósfera terrestre?", Answer: "Nitrógeno", Options: []string{"Oxígeno", "Dióxido de carbono", "Nitrógeno", "Argón"}, Duration: 30, Category: "quimica"},
			{ID: "backup_qui6", Text: "¿Cuál es la fórmula química de la sal común?", Answer: "NaCl", Options: []string{"NaCl", "KCl", "CaCl2", "MgCl2"}, Duration: 30, Category: "quimica"},
			{ID: "backup_qui7", Text: "¿Qué elemento químico tiene el número atómico 1?", Answer: "Hidrógeno", Options: []string{"Helio", "Hidrógeno", "Litio", "Carbono"}, Duration: 30, Category: "quimica"},
			{ID: "backup_qui8", Text: "¿Cuál es el elemento químico más abundante en el universo?", Answer: "Hidrógeno", Options: []string{"Oxígeno", "Carbono", "Hidrógeno", "Helio"}, Duration: 30, Category: "quimica"},
		}
	case "biologia":
		questions = []models.Question{
			{ID: "backup_bio1", Text: "¿Cuál es la unidad básica de la vida?", Answer: "Célula", Options: []string{"Átomo", "Molécula", "Célula", "Tejido"}, Duration: 30, Category: "biologia"},
			{ID: "backup_bio2", Text: "¿Qué proceso permite a las plantas producir su propio alimento?", Answer: "Fotosíntesis", Options: []string{"Respiración", "Fotosíntesis", "Digestión", "Fermentación"}, Duration: 30, Category: "biologia"},
			{ID: "backup_bio3", Text: "¿Cuántos cromosomas tiene una célula humana normal?", Answer: "46", Options: []string{"44", "45", "46", "47"}, Duration: 30, Category: "biologia"},
			{ID: "backup_bio4", Text: "¿Cuál es el órgano más grande del cuerpo humano?", Answer: "Piel", Options: []string{"Hígado", "Pulmones", "Cerebro", "Piel"}, Duration: 30, Category: "biologia"},
			{ID: "backup_bio5", Text: "¿Qué tipo de sangre es considerado donante universal?", Answer: "O-", Options: []string{"A+", "B+", "AB+", "O-"}, Duration: 30, Category: "biologia"},
			{ID: "backup_bio6", Text: "¿Cuántas cámaras tiene el corazón humano?", Answer: "4", Options: []string{"2", "3", "4", "5"}, Duration: 30, Category: "biologia"},
			{ID: "backup_bio7", Text: "¿Qué molécula contiene la información genética en las células?", Answer: "ADN", Options: []string{"ARN", "ADN", "Proteína", "Lípido"}, Duration: 30, Category: "biologia"},
			{ID: "backup_bio8", Text: "¿Qué órgano del cuerpo humano produce la insulina?", Answer: "Páncreas", Options: []string{"Hígado", "Páncreas", "Riñón", "Corazón"}, Duration: 30, Category: "biologia"},
		}
	default:
		// Preguntas generales si la categoría no coincide
		questions = []models.Question{
			{ID: "backup_gen1", Text: "¿Quién pintó la Mona Lisa?", Answer: "Leonardo da Vinci", Options: []string{"Pablo Picasso", "Vincent van Gogh", "Leonardo da Vinci", "Miguel Ángel"}, Duration: 30, Category: "general"},
			{ID: "backup_gen2", Text: "¿Cuál es el océano más grande?", Answer: "Pacífico", Options: []string{"Atlántico", "Pacífico", "Índico", "Ártico"}, Duration: 30, Category: "general"},
			{ID: "backup_gen3", Text: "¿Cuántos continentes hay?", Answer: "7", Options: []string{"5", "6", "7", "8"}, Duration: 30, Category: "general"},
		}
	}
	
	// Randomly select MaxQuestionsPerDuel questions from available questions
	if len(questions) > MaxQuestionsPerDuel {
		// Create a random permutation of indices
		indices := rand.Perm(len(questions))
		
		// Select the first MaxQuestionsPerDuel questions from the shuffled indices
		selectedQuestions := make([]models.Question, MaxQuestionsPerDuel)
		for i := 0; i < MaxQuestionsPerDuel; i++ {
			selectedQuestions[i] = questions[indices[i]]
		}
		questions = selectedQuestions
	}
	
	return questions
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
