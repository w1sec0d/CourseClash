db = db.getSiblingDB("duels_db");

// Limpiar la colección de duelos existente
db.duels.drop();

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

// Insertar varias preguntas generales para el curso 123
db.questions.insertMany([
  {
    course_id: 123,
    question: "¿Cuál es la capital de Francia?",
    answer: "París",
    options: ["Madrid", "París", "Londres", "Roma"],
    duration: 30,
  },
  {
    course_id: 123,
    question: "¿Quién pintó La Mona Lisa?",
    answer: "Leonardo da Vinci",
    options: [
      "Pablo Picasso",
      "Vincent van Gogh",
      "Leonardo da Vinci",
      "Miguel Ángel",
    ],
    duration: 30,
  },
  {
    course_id: 123,
    question: "¿Cuál es el planeta más grande del sistema solar?",
    answer: "Júpiter",
    options: ["Tierra", "Júpiter", "Saturno", "Marte"],
    duration: 30,
  },
  {
    course_id: 123,
    question: "¿En qué año comenzó la Segunda Guerra Mundial?",
    answer: "1939",
    options: ["1914", "1939", "1945", "1918"],
    duration: 30,
  },
  {
    course_id: 123,
    question: "¿Cuál es el elemento químico más abundante en el universo?",
    answer: "Hidrógeno",
    options: ["Oxígeno", "Carbono", "Hidrógeno", "Helio"],
    duration: 30,
  },
  {
    course_id: 123,
    question: "¿Cuál es el océano más grande del mundo?",
    answer: "Océano Pacífico",
    options: [
      "Océano Atlántico",
      "Océano Índico",
      "Océano Pacífico",
      "Océano Ártico",
    ],
    duration: 30,
  },
  {
    course_id: 123,
    question: "¿Cuál es el hueso más largo del cuerpo humano?",
    answer: "Fémur",
    options: ["Húmero", "Fémur", "Tibia", "Columna vertebral"],
    duration: 30,
  },
  {
    course_id: 123,
    question: "¿Quién escribió 'Don Quijote de la Mancha'?",
    answer: "Miguel de Cervantes",
    options: [
      "Federico García Lorca",
      "Gabriel García Márquez",
      "Miguel de Cervantes",
      "Pablo Neruda",
    ],
    duration: 30,
  },
  {
    course_id: 123,
    question: "¿Cuál es el país más poblado del mundo?",
    answer: "India",
    options: ["China", "India", "Estados Unidos", "Indonesia"],
    duration: 30,
  },
  {
    course_id: 123,
    question: "¿Cuál es la montaña más alta del mundo?",
    answer: "Monte Everest",
    options: ["Monte Everest", "K2", "Monte Aconcagua", "Monte Kilimanjaro"],
    duration: 30,
  },
]);

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
