use duels_db
db.questions.deleteMany({})

db.questions.insertMany([
  {
    question: "¿Cuánto es 2 + 2?",
    options: ["3", "4", "5", "6"],
    correct_answer: 1,
    category: "matematica",
    difficulty: "easy"
  },
  {
    question: "¿Cuál es la derivada de x²?",
    options: ["x", "2x", "x²", "2x²"],
    correct_answer: 1,
    category: "matematica",
    difficulty: "medium"
  },
  {
    question: "¿En qué año comenzó la Segunda Guerra Mundial?",
    options: ["1938", "1939", "1940", "1941"],
    correct_answer: 1,
    category: "historia",
    difficulty: "medium"
  },
  {
    question: "¿Quién fue el primer presidente de los Estados Unidos?",
    options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
    correct_answer: 2,
    category: "historia",
    difficulty: "easy"
  },
  {
    question: "¿Cuál es la capital de Francia?",
    options: ["Londres", "Madrid", "París", "Roma"],
    correct_answer: 2,
    category: "geografia",
    difficulty: "easy"
  },
  {
    question: "¿Cuál es el río más largo del mundo?",
    options: ["Amazonas", "Nilo", "Mississippi", "Yangtsé"],
    correct_answer: 1,
    category: "geografia",
    difficulty: "medium"
  },
  {
    question: "¿Cuál es el símbolo químico del agua?",
    options: ["HO", "H2O", "H3O", "OH"],
    correct_answer: 1,
    category: "ciencias",
    difficulty: "easy"
  },
  {
    question: "¿Cuántos planetas hay en nuestro sistema solar?",
    options: ["7", "8", "9", "10"],
    correct_answer: 1,
    category: "ciencias",
    difficulty: "easy"
  },
  {
    question: "¿Quién escribió Don Quijote de la Mancha?",
    options: ["Lope de Vega", "Miguel de Cervantes", "Francisco de Quevedo", "Calderón de la Barca"],
    correct_answer: 1,
    category: "literatura",
    difficulty: "easy"
  },
  {
    question: "¿Cuál es la unidad de medida de la fuerza en el Sistema Internacional?",
    options: ["Joule", "Newton", "Pascal", "Watt"],
    correct_answer: 1,
    category: "fisica",
    difficulty: "medium"
  },
  {
    question: "¿Cuál es el símbolo químico del oro?",
    options: ["Go", "Au", "Ag", "Or"],
    correct_answer: 1,
    category: "quimica",
    difficulty: "easy"
  },
  {
    question: "¿Cuál es la unidad básica de la vida?",
    options: ["Átomo", "Molécula", "Célula", "Tejido"],
    correct_answer: 2,
    category: "biologia",
    difficulty: "easy"
  }
])

print("Preguntas añadidas exitosamente!")
print("Total:", db.questions.countDocuments())
