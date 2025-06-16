db = db.getSiblingDB("duels_db");

// Limpiar la colección de duelos existente
db.duels.drop();

// Limpiar la colección de contadores existente
db.counters.drop();
// Crear el índice único para el contador de duelos
db.counters.createIndex({ _id: 1 });

// Inicializar el contador de duelos
db.counters.insertOne({
  _id: "duel_id",
  seq: 0,
});

// Crear algunos duelos de ejemplo con el nuevo formato (sin IDs hardcodeados)
db.duels.insertMany([
  {
    challenger_id: "user_001",
    opponent_id: "user_002",
    status: "completed",
    winner_id: "user_001",
    created_at: new Date(),
    completed_at: new Date(),
  },
  {
    challenger_id: "user_003",
    opponent_id: "user_004",
    status: "pending",
    winner_id: null,
    created_at: new Date(),
    completed_at: null,
  },
]);

// Insertar preguntas categorizadas para el sistema de duelos
db.questions.insertMany([
  // === MATEMÁTICA ===
  {
    question: "¿Cuánto es 2 + 2?",
    options: ["3", "4", "5", "6"],
    correct_answer: "4",
    category: "matematica",
    difficulty: "easy"
  },
  {
    question: "¿Cuál es la derivada de x²?",
    options: ["x", "2x", "x²", "2x²"],
    correct_answer: "2x",
    category: "matematica",
    difficulty: "medium"
  },
  {
    question: "¿Cuánto es la raíz cuadrada de 144?",
    options: ["10", "11", "12", "13"],
    correct_answer: "12",
    category: "matematica",
    difficulty: "easy"
  },
  {
    question: "¿Cuál es el valor de π (pi) aproximadamente?",
    options: ["3.14", "3.15", "3.16", "3.17"],
    correct_answer: "3.14",
    category: "matematica",
    difficulty: "easy"
  },
  {
    question: "¿Cuánto es 7 × 8?",
    options: ["54", "55", "56", "57"],
    correct_answer: "56",
    category: "matematica",
    difficulty: "easy"
  },
  {
    question: "¿Cuál es la fórmula del área de un círculo?",
    options: ["πr", "πr²", "2πr", "πr³"],
    correct_answer: "πr²",
    category: "matematica",
    difficulty: "medium"
  },
  {
    question: "¿Cuánto es 15% de 200?",
    options: ["25", "30", "35", "40"],
    correct_answer: "30",
    category: "matematica",
    difficulty: "easy"
  },
  {
    question: "¿Cuál es el resultado de (5 + 3) × 2?",
    options: ["13", "16", "11", "18"],
    correct_answer: "16",
    category: "matematica",
    difficulty: "easy"
  },

  // === HISTORIA ===
  {
    question: "¿En qué año comenzó la Segunda Guerra Mundial?",
    options: ["1938", "1939", "1940", "1941"],
    correct_answer: "1939",
    category: "historia",
    difficulty: "medium"
  },
  {
    question: "¿Quién fue el primer presidente de los Estados Unidos?",
    options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
    correct_answer: "George Washington",
    category: "historia",
    difficulty: "easy"
  },
  {
    question: "¿En qué año cayó el Muro de Berlín?",
    options: ["1987", "1988", "1989", "1990"],
    correct_answer: "1989",
    category: "historia",
    difficulty: "medium"
  },
  {
    question: "¿En qué año llegó Cristóbal Colón a América?",
    options: ["1490", "1491", "1492", "1493"],
    correct_answer: "1492",
    category: "historia",
    difficulty: "easy"
  },
  {
    question: "¿Cuál fue la primera civilización en desarrollar la escritura?",
    options: ["Egipcios", "Sumerios", "Griegos", "Romanos"],
    correct_answer: "Sumerios",
    category: "historia",
    difficulty: "hard"
  },
  {
    question: "¿En qué año terminó la Primera Guerra Mundial?",
    options: ["1917", "1918", "1919", "1920"],
    correct_answer: "1918",
    category: "historia",
    difficulty: "medium"
  },
  {
    question: "¿Quién fue el emperador romano que legalizó el cristianismo?",
    options: ["Nerón", "Augusto", "Constantino", "Trajano"],
    correct_answer: "Constantino",
    category: "historia",
    difficulty: "hard"
  },
  {
    question: "¿En qué siglo ocurrió la Revolución Francesa?",
    options: ["XVII", "XVIII", "XIX", "XVI"],
    correct_answer: "XVIII",
    category: "historia",
    difficulty: "medium"
  },

  // === GEOGRAFÍA ===
  {
    question: "¿Cuál es la capital de Francia?",
    options: ["Londres", "Madrid", "París", "Roma"],
    correct_answer: "París",
    category: "geografia",
    difficulty: "easy"
  },
  {
    question: "¿Cuál es el río más largo del mundo?",
    options: ["Amazonas", "Nilo", "Mississippi", "Yangtsé"],
    correct_answer: "Nilo",
    category: "geografia",
    difficulty: "medium"
  },
  {
    question: "¿En qué continente se encuentra Egipto?",
    options: ["Asia", "África", "Europa", "América"],
    correct_answer: "África",
    category: "geografia",
    difficulty: "easy"
  },
  {
    question: "¿Cuál es el país más grande del mundo por superficie?",
    options: ["China", "Canadá", "Estados Unidos", "Rusia"],
    correct_answer: "Rusia",
    category: "geografia",
    difficulty: "medium"
  },
  {
    question: "¿Cuál es la montaña más alta del mundo?",
    options: ["K2", "Monte Everest", "Kilimanjaro", "Mont Blanc"],
    correct_answer: "Monte Everest",
    category: "geografia",
    difficulty: "easy"
  },
  {
    question: "¿Cuál es el océano más grande del mundo?",
    options: ["Atlántico", "Índico", "Pacífico", "Ártico"],
    correct_answer: "Pacífico",
    category: "geografia",
    difficulty: "easy"
  },
  {
    question: "¿Cuál es la capital de Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
    correct_answer: "Canberra",
    category: "geografia",
    difficulty: "medium"
  },
  {
    question: "¿En qué país se encuentra Machu Picchu?",
    options: ["Bolivia", "Perú", "Ecuador", "Colombia"],
    correct_answer: "Perú",
    category: "geografia",
    difficulty: "easy"
  },

  // === CIENCIAS ===
  {
    question: "¿Cuál es el símbolo químico del agua?",
    options: ["HO", "H2O", "H3O", "OH"],
    correct_answer: "H2O",
    category: "ciencias",
    difficulty: "easy"
  },
  {
    question: "¿Cuántos planetas hay en nuestro sistema solar?",
    options: ["7", "8", "9", "10"],
    correct_answer: "8",
    category: "ciencias",
    difficulty: "easy"
  },
  {
    question: "¿Cuál es el elemento químico más abundante en el universo?",
    options: ["Oxígeno", "Carbono", "Hidrógeno", "Helio"],
    correct_answer: "Hidrógeno",
    category: "ciencias",
    difficulty: "medium"
  },
  {
    question: "¿Qué órgano del cuerpo humano produce la insulina?",
    options: ["Hígado", "Páncreas", "Riñón", "Corazón"],
    correct_answer: "Páncreas",
    category: "ciencias",
    difficulty: "medium"
  },
  {
    question: "¿Cuál es la velocidad de la luz en el vacío?",
    options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
    correct_answer: "300,000 km/s",
    category: "ciencias",
    difficulty: "hard"
  },
  {
    question: "¿Qué gas es esencial para la respiración humana?",
    options: ["Dióxido de carbono", "Oxígeno", "Nitrógeno", "Hidrógeno"],
    correct_answer: "Oxígeno",
    category: "ciencias",
    difficulty: "easy"
  },
  {
    question: "¿Cuál es la unidad básica de la herencia?",
    options: ["Cromosoma", "Gen", "ADN", "Célula"],
    correct_answer: "Gen",
    category: "ciencias",
    difficulty: "medium"
  },
  {
    question: "¿Qué planeta es conocido como el planeta rojo?",
    options: ["Venus", "Marte", "Júpiter", "Saturno"],
    correct_answer: "Marte",
    category: "ciencias",
    difficulty: "easy"
  },

  // === LITERATURA ===
  {
    question: "¿Quién escribió 'Don Quijote de la Mancha'?",
    options: ["Lope de Vega", "Miguel de Cervantes", "Francisco de Quevedo", "Calderón de la Barca"],
    correct_answer: "Miguel de Cervantes",
    category: "literatura",
    difficulty: "easy"
  },
  {
    question: "¿Cuál es la primera obra de la literatura española?",
    options: ["El Cantar de Mio Cid", "La Celestina", "El Lazarillo de Tormes", "El Libro de Buen Amor"],
    correct_answer: "El Cantar de Mio Cid",
    category: "literatura",
    difficulty: "medium"
  },
  {
    question: "¿Quién escribió 'Cien años de soledad'?",
    options: ["Jorge Luis Borges", "Gabriel García Márquez", "Mario Vargas Llosa", "Octavio Paz"],
    correct_answer: "Gabriel García Márquez",
    category: "literatura",
    difficulty: "medium"
  },
  {
    question: "¿En qué siglo vivió William Shakespeare?",
    options: ["XV", "XVI", "XVII", "XVIII"],
    correct_answer: "XVI",
    category: "literatura",
    difficulty: "medium"
  },
  {
    question: "¿Quién escribió 'Romeo y Julieta'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correct_answer: "William Shakespeare",
    category: "literatura",
    difficulty: "easy"
  },
  {
    question: "¿Cuál es el primer libro de Harry Potter?",
    options: ["La Cámara Secreta", "El Prisionero de Azkaban", "La Piedra Filosofal", "El Cáliz de Fuego"],
    correct_answer: "La Piedra Filosofal",
    category: "literatura",
    difficulty: "easy"
  },
  {
    question: "¿Quién escribió '1984'?",
    options: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "Philip K. Dick"],
    correct_answer: "George Orwell",
    category: "literatura",
    difficulty: "medium"
  },
  {
    question: "¿En qué obra aparece el personaje de Sherlock Holmes?",
    options: ["Obras de Agatha Christie", "Obras de Arthur Conan Doyle", "Obras de Edgar Allan Poe", "Obras de Raymond Chandler"],
    correct_answer: "Obras de Arthur Conan Doyle",
    category: "literatura",
    difficulty: "easy"
  },

  // === FÍSICA ===
  {
    question: "¿Cuál es la unidad de medida de la fuerza en el Sistema Internacional?",
    options: ["Joule", "Newton", "Pascal", "Watt"],
    correct_answer: "Newton",
    category: "fisica",
    difficulty: "medium"
  },
  {
    question: "¿Quién formuló la ley de la gravedad universal?",
    options: ["Einstein", "Galileo", "Newton", "Kepler"],
    correct_answer: "Newton",
    category: "fisica",
    difficulty: "easy"
  },
  {
    question: "¿Cuál es la velocidad de caída libre en la Tierra?",
    options: ["9.8 m/s²", "10 m/s²", "9 m/s²", "8.9 m/s²"],
    correct_answer: "9.8 m/s²",
    category: "fisica",
    difficulty: "medium"
  },
  {
    question: "¿Qué partícula subatómica tiene carga negativa?",
    options: ["Protón", "Neutrón", "Electrón", "Positrón"],
    correct_answer: "Electrón",
    category: "fisica",
    difficulty: "easy"
  },
  {
    question: "¿Cuál es la primera ley de Newton?",
    options: ["Ley de la gravedad", "Ley de la inercia", "Ley de acción y reacción", "Ley de la fuerza"],
    correct_answer: "Ley de la inercia",
    category: "fisica",
    difficulty: "medium"
  },
  {
    question: "¿Qué es la energía cinética?",
    options: ["Energía de posición", "Energía de movimiento", "Energía térmica", "Energía química"],
    correct_answer: "Energía de movimiento",
    category: "fisica",
    difficulty: "easy"
  },
  {
    question: "¿Cuál es la unidad de medida de la energía?",
    options: ["Newton", "Watt", "Joule", "Pascal"],
    correct_answer: "Joule",
    category: "fisica",
    difficulty: "medium"
  },
  {
    question: "¿Qué tipo de ondas son las ondas de sonido?",
    options: ["Ondas electromagnéticas", "Ondas mecánicas", "Ondas gravitacionales", "Ondas cuánticas"],
    correct_answer: "Ondas mecánicas",
    category: "fisica",
    difficulty: "medium"
  },

  // === QUÍMICA ===
  {
    question: "¿Cuál es el símbolo químico del oro?",
    options: ["Go", "Au", "Ag", "Or"],
    correct_answer: "Au",
    category: "quimica",
    difficulty: "easy"
  },
  {
    question: "¿Cuántos elementos hay en la tabla periódica actual?",
    options: ["116", "117", "118", "119"],
    correct_answer: "118",
    category: "quimica",
    difficulty: "medium"
  },
  {
    question: "¿Cuál es el pH del agua pura?",
    options: ["6", "7", "8", "9"],
    correct_answer: "7",
    category: "quimica",
    difficulty: "medium"
  },
  {
    question: "¿Cuál es la fórmula química del dióxido de carbono?",
    options: ["CO", "CO2", "C2O", "CO3"],
    correct_answer: "CO2",
    category: "quimica",
    difficulty: "easy"
  },
  {
    question: "¿Qué gas constituye aproximadamente el 78% de la atmósfera terrestre?",
    options: ["Oxígeno", "Dióxido de carbono", "Nitrógeno", "Argón"],
    correct_answer: "Nitrógeno",
    category: "quimica",
    difficulty: "medium"
  },
  {
    question: "¿Cuál es el símbolo químico del hierro?",
    options: ["Hi", "Fe", "Ir", "He"],
    correct_answer: "Fe",
    category: "quimica",
    difficulty: "easy"
  },
  {
    question: "¿Cuál es la fórmula química de la sal común?",
    options: ["NaCl", "KCl", "CaCl2", "MgCl2"],
    correct_answer: "NaCl",
    category: "quimica",
    difficulty: "easy"
  },
  {
    question: "¿Qué elemento químico tiene el número atómico 1?",
    options: ["Helio", "Hidrógeno", "Litio", "Carbono"],
    correct_answer: "Hidrógeno",
    category: "quimica",
    difficulty: "medium"
  },

  // === BIOLOGÍA ===
  {
    question: "¿Cuál es la unidad básica de la vida?",
    options: ["Átomo", "Molécula", "Célula", "Tejido"],
    correct_answer: "Célula",
    category: "biologia",
    difficulty: "easy"
  },
  {
    question: "¿Qué proceso permite a las plantas producir su propio alimento?",
    options: ["Respiración", "Fotosíntesis", "Digestión", "Fermentación"],
    correct_answer: "Fotosíntesis",
    category: "biologia",
    difficulty: "easy"
  },
  {
    question: "¿Cuántos cromosomas tiene una célula humana normal?",
    options: ["44", "45", "46", "47"],
    correct_answer: "46",
    category: "biologia",
    difficulty: "medium"
  },
  {
    question: "¿Cuál es el órgano más grande del cuerpo humano?",
    options: ["Hígado", "Pulmones", "Cerebro", "Piel"],
    correct_answer: "Piel",
    category: "biologia",
    difficulty: "medium"
  },
  {
    question: "¿Qué tipo de sangre es considerado donante universal?",
    options: ["A+", "B+", "AB+", "O-"],
    correct_answer: "O-",
    category: "biologia",
    difficulty: "medium"
  },
  {
    question: "¿Cuántas cámaras tiene el corazón humano?",
    options: ["2", "3", "4", "5"],
    correct_answer: "4",
    category: "biologia",
    difficulty: "easy"
  },
  {
    question: "¿Qué molécula contiene la información genética en las células?",
    options: ["ARN", "ADN", "Proteína", "Lípido"],
    correct_answer: "ADN",
    category: "biologia",
    difficulty: "medium"
  },
  {
    question: "¿Cuál es el proceso por el cual las células se dividen?",
    options: ["Meiosis", "Mitosis", "Ambos", "Ninguno"],
    correct_answer: "Ambos",
    category: "biologia",
    difficulty: "hard"
  }
]);

// Mostrar estadísticas de inicialización
print("=== INICIALIZACIÓN DE BASE DE DATOS COMPLETADA ===");
print("✅ Base de datos: duels_db");
print("✅ Contador de duelos inicializado");
print("✅ Duelos de ejemplo creados:", db.duels.countDocuments());
print("✅ Preguntas categorizadas creadas:", db.questions.countDocuments());
print("✅ Perfiles de jugadores creados:", db.players.countDocuments());
print("");
print("📚 Preguntas por categoría:");
db.questions.distinct("category").forEach(function (category) {
  var count = db.questions.countDocuments({ category: category });
  print("  - " + category + ": " + count + " preguntas");
});
print("");
print("🎯 Sistema de duelos categorizados listo para usar!");

/* db.duel_answers.insertOne({
  duel_id: ObjectId("000000000000000000000010"),
  question_id: ObjectId("000000000000000000000011"),
  user_id: ObjectId("000000000000000000000001"),
  course_id: 123,
  answer: "París",
  is_correct: true,
  answer_time: 12,
}); */

// Insertar perfiles de usuario de ejemplo con diferentes rangos y ELO
db.players.insertMany([
  // Jugador novato (Bronce)
  {
    player_id: "user_001",
    elo: 350,
    rank: "Bronce",
  },

  // Jugador intermedio (Plata)
  {
    player_id: "user_002",
    elo: 850,
    rank: "Plata",
  },

  // Jugador avanzado (Oro)
  {
    player_id: "user_003",
    elo: 1500,
    rank: "Oro",
  },

  // Jugador experto (Diamante)
  {
    player_id: "user_004",
    elo: 2500,
    rank: "Diamante",
  },

  // Jugador élite (Maestro)
  {
    player_id: "user_005",
    elo: 3200,
    rank: "Maestro",
  },
]);
