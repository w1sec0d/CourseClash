db = db.getSiblingDB("duels_db");

db.duels.insertOne({
  challenger_id: ObjectId("000000000000000000000001"),
  opponent_id: ObjectId("000000000000000000000002"),
  course_id: 123,
  status: "pending",
  winner_id: null,
  created_at: new Date(),
  completed_at: null,
});

db.duel_questions.insertOne({
  duel_id: ObjectId("000000000000000000000010"),
  course_id: 123,
  question: "¿Cuál es la capital de Francia?",
  correct_answer: "París",
  options: ["Madrid", "París", "Londres", "Roma"],
});

db.duel_answers.insertOne({
  duel_id: ObjectId("000000000000000000000010"),
  question_id: ObjectId("000000000000000000000011"),
  user_id: ObjectId("000000000000000000000001"),
  course_id: 123,
  answer: "París",
  is_correct: true,
  answer_time: 12,
});

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
