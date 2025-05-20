db = db.getSiblingDB('duels_db');

db.duels.insertOne({
  challenger_id: ObjectId("000000000000000000000001"),
  opponent_id: ObjectId("000000000000000000000002"),
  course_id: 123,
  status: "pending",
  winner_id: null,
  created_at: new Date(),
  completed_at: null
});

db.duel_questions.insertOne({
  duel_id: ObjectId("000000000000000000000010"),
  course_id: 123,
  question: "¿Cuál es la capital de Francia?",
  correct_answer: "París",
  options: ["Madrid", "París", "Londres", "Roma"]
});

db.duel_answers.insertOne({
  duel_id: ObjectId("000000000000000000000010"),
  question_id: ObjectId("000000000000000000000011"),
  user_id: ObjectId("000000000000000000000001"),
  course_id: 123,
  answer: "París",
  is_correct: true,
  answer_time: 12
});

db.user_profiles.insertMany([
  { user_id: ObjectId("000000000000000000000001"), experience: 4500 }
]);
