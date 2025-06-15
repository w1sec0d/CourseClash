// Script para poblar la base de datos con preguntas categorizadas

// Conectar a la base de datos de duelos
use duels_db

// Limpiar colección existente
db.questions.deleteMany({})

// Preguntas de Matemática
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
    question: "¿Cuánto es la raíz cuadrada de 144?",
    options: ["10", "11", "12", "13"],
    correct_answer: 2,
    category: "matematica",
    difficulty: "easy"
  },
  {
    question: "¿Cuál es el valor de π (pi) aproximadamente?",
    options: ["3.14", "3.15", "3.16", "3.17"],
    correct_answer: 0,
    category: "matematica",
    difficulty: "easy"
  },
  {
    question: "¿Cuánto es 7 × 8?",
    options: ["54", "55", "56", "57"],
    correct_answer: 2,
    category: "matematica",
    difficulty: "easy"
  }
])

// Preguntas de Historia
db.questions.insertMany([
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
    question: "¿En qué año cayó el Muro de Berlín?",
    options: ["1987", "1988", "1989", "1990"],
    correct_answer: 2,
    category: "historia",
    difficulty: "medium"
  },
  {
    question: "¿Cuál fue la primera civilización en desarrollar la escritura?",
    options: ["Egipcios", "Sumerios", "Griegos", "Romanos"],
    correct_answer: 1,
    category: "historia",
    difficulty: "hard"
  },
  {
    question: "¿En qué año llegó Cristóbal Colón a América?",
    options: ["1490", "1491", "1492", "1493"],
    correct_answer: 2,
    category: "historia",
    difficulty: "easy"
  }
])

// Preguntas de Geografía
db.questions.insertMany([
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
    question: "¿En qué continente se encuentra Egipto?",
    options: ["Asia", "África", "Europa", "América"],
    correct_answer: 1,
    category: "geografia",
    difficulty: "easy"
  },
  {
    question: "¿Cuál es el país más grande del mundo por superficie?",
    options: ["China", "Canadá", "Estados Unidos", "Rusia"],
    correct_answer: 3,
    category: "geografia",
    difficulty: "medium"
  },
  {
    question: "¿Cuál es la montaña más alta del mundo?",
    options: ["K2", "Monte Everest", "Kilimanjaro", "Mont Blanc"],
    correct_answer: 1,
    category: "geografia",
    difficulty: "easy"
  }
])

// Preguntas de Ciencias
db.questions.insertMany([
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
    question: "¿Cuál es el elemento químico más abundante en el universo?",
    options: ["Oxígeno", "Carbono", "Hidrógeno", "Helio"],
    correct_answer: 2,
    category: "ciencias",
    difficulty: "medium"
  },
  {
    question: "¿A qué velocidad viaja la luz en el vacío?",
    options: ["300,000 km/s", "299,792,458 m/s", "150,000 km/s", "500,000 km/s"],
    correct_answer: 1,
    category: "ciencias",
    difficulty: "hard"
  },
  {
    question: "¿Qué órgano del cuerpo humano produce la insulina?",
    options: ["Hígado", "Páncreas", "Riñón", "Corazón"],
    correct_answer: 1,
    category: "ciencias",
    difficulty: "medium"
  }
])

// Preguntas de Literatura
db.questions.insertMany([
  {
    question: "¿Quién escribió 'Don Quijote de la Mancha'?",
    options: ["Lope de Vega", "Miguel de Cervantes", "Francisco de Quevedo", "Calderón de la Barca"],
    correct_answer: 1,
    category: "literatura",
    difficulty: "easy"
  },
  {
    question: "¿Cuál es la primera obra de la literatura española?",
    options: ["El Cantar de Mio Cid", "La Celestina", "El Lazarillo de Tormes", "El Libro de Buen Amor"],
    correct_answer: 0,
    category: "literatura",
    difficulty: "medium"
  },
  {
    question: "¿Quién escribió 'Cien años de soledad'?",
    options: ["Jorge Luis Borges", "Gabriel García Márquez", "Mario Vargas Llosa", "Octavio Paz"],
    correct_answer: 1,
    category: "literatura",
    difficulty: "medium"
  },
  {
    question: "¿En qué siglo vivió William Shakespeare?",
    options: ["XV", "XVI", "XVII", "XVIII"],
    correct_answer: 1,
    category: "literatura",
    difficulty: "medium"
  },
  {
    question: "¿Cuál es el primer libro de Harry Potter?",
    options: ["La Cámara Secreta", "El Prisionero de Azkaban", "La Piedra Filosofal", "El Cáliz de Fuego"],
    correct_answer: 2,
    category: "literatura",
    difficulty: "easy"
  }
])

// Preguntas de Física
db.questions.insertMany([
  {
    question: "¿Cuál es la unidad de medida de la fuerza en el Sistema Internacional?",
    options: ["Joule", "Newton", "Pascal", "Watt"],
    correct_answer: 1,
    category: "fisica",
    difficulty: "medium"
  },
  {
    question: "¿Quién formuló la ley de la gravedad universal?",
    options: ["Einstein", "Galileo", "Newton", "Kepler"],
    correct_answer: 2,
    category: "fisica",
    difficulty: "easy"
  },
  {
    question: "¿Cuál es la velocidad de caída libre en la Tierra?",
    options: ["9.8 m/s²", "10 m/s²", "9 m/s²", "8.9 m/s²"],
    correct_answer: 0,
    category: "fisica",
    difficulty: "medium"
  },
  {
    question: "¿Qué partícula subatómica tiene carga negativa?",
    options: ["Protón", "Neutrón", "Electrón", "Positrón"],
    correct_answer: 2,
    category: "fisica",
    difficulty: "easy"
  },
  {
    question: "¿Cuál es la primera ley de Newton?",
    options: ["Ley de la gravedad", "Ley de la inercia", "Ley de acción y reacción", "Ley de la fuerza"],
    correct_answer: 1,
    category: "fisica",
    difficulty: "medium"
  }
])

// Preguntas de Química
db.questions.insertMany([
  {
    question: "¿Cuál es el símbolo químico del oro?",
    options: ["Go", "Au", "Ag", "Or"],
    correct_answer: 1,
    category: "quimica",
    difficulty: "easy"
  },
  {
    question: "¿Cuántos elementos hay en la tabla periódica actual?",
    options: ["116", "117", "118", "119"],
    correct_answer: 2,
    category: "quimica",
    difficulty: "medium"
  },
  {
    question: "¿Cuál es el pH del agua pura?",
    options: ["6", "7", "8", "9"],
    correct_answer: 1,
    category: "quimica",
    difficulty: "medium"
  },
  {
    question: "¿Cuál es la fórmula química del dióxido de carbono?",
    options: ["CO", "CO2", "C2O", "CO3"],
    correct_answer: 1,
    category: "quimica",
    difficulty: "easy"
  },
  {
    question: "¿Qué gas constituye aproximadamente el 78% de la atmósfera terrestre?",
    options: ["Oxígeno", "Dióxido de carbono", "Nitrógeno", "Argón"],
    correct_answer: 2,
    category: "quimica",
    difficulty: "medium"
  }
])

// Preguntas de Biología
db.questions.insertMany([
  {
    question: "¿Cuál es la unidad básica de la vida?",
    options: ["Átomo", "Molécula", "Célula", "Tejido"],
    correct_answer: 2,
    category: "biologia",
    difficulty: "easy"
  },
  {
    question: "¿Qué proceso permite a las plantas producir su propio alimento?",
    options: ["Respiración", "Fotosíntesis", "Digestión", "Fermentación"],
    correct_answer: 1,
    category: "biologia",
    difficulty: "easy"
  },
  {
    question: "¿Cuántos cromosomas tiene una célula humana normal?",
    options: ["44", "45", "46", "47"],
    correct_answer: 2,
    category: "biologia",
    difficulty: "medium"
  },
  {
    question: "¿Cuál es el órgano más grande del cuerpo humano?",
    options: ["Hígado", "Pulmones", "Cerebro", "Piel"],
    correct_answer: 3,
    category: "biologia",
    difficulty: "medium"
  },
  {
    question: "¿Qué estructura celular contiene el ADN en las células eucariotas?",
    options: ["Citoplasma", "Núcleo", "Mitocondria", "Ribosoma"],
    correct_answer: 1,
    category: "biologia",
    difficulty: "medium"
  }
])

print("✅ Base de datos poblada exitosamente con preguntas categorizadas!")
print("📊 Total de preguntas añadidas:", db.questions.countDocuments())
print("📚 Categorías disponibles:")
db.questions.distinct("category").forEach(category => {
  const count = db.questions.countDocuments({category: category})
  print(`  - ${category}: ${count} preguntas`)
})
