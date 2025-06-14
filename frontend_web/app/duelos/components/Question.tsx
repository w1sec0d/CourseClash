import { useState, useEffect } from "react";

interface Option {
  letter: string;
  text: string;
}

interface QuestionProps {
  questionNumber: number;
  totalQuestions: number;
  // points: number;
  question: string;
  options: Option[];
  onAnswerSelect: (answer: string) => void;
  timeRemaining: number;
  hasAnswered: boolean;
  totalTime: number;
}

export function Question({
  questionNumber,
  totalQuestions,
  // points,
  question,
  options,
  onAnswerSelect,
  timeRemaining,
  hasAnswered,
  totalTime,
}: QuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // Reset selected answer when question changes or time runs out
  useEffect(() => {
    setSelectedAnswer(null);
  }, [questionNumber]);

  const handleAnswerSelect = (letter: string, text: string) => {
    if (selectedAnswer === null && !hasAnswered && timeRemaining > 0) {
      setSelectedAnswer(letter);
      onAnswerSelect(text);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg mb-6 p-6 border-2 border-emerald-300">
      <div className="justify-between mb-3 flex">
        <span className="bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
          Pregunta {questionNumber} de {totalQuestions}
        </span>
        <div className="flex items-center space-x-2">
          <span
            className={`px-4 py-1 rounded-full text-sm font-semibold ${
              timeRemaining <= 10
                ? "bg-red-100 text-red-800 animate-pulse"
                : timeRemaining <= 20
                ? "bg-yellow-100 text-yellow-800"
                : "bg-emerald-100 text-emerald-800"
            }`}
          >
            ⏱️ {timeRemaining}s
          </span>
          {hasAnswered && timeRemaining > 0 && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              ✅ Respondida
            </span>
          )}
          {timeRemaining <= 0 && !hasAnswered && (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
              ⏰ Tiempo agotado
            </span>
          )}
          {timeRemaining <= 0 && hasAnswered && (
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
              ⏰ Finalizado
            </span>
          )}
        </div>
      </div>

      {/* Timer Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              timeRemaining <= 10
                ? "bg-red-500"
                : timeRemaining <= 20
                ? "bg-yellow-500"
                : "bg-emerald-500"
            }`}
            style={{
              width: `${
                hasAnswered ? 100 : (timeRemaining / totalTime) * 100
              }%`,
            }}
          ></div>
        </div>
      </div>

      <p className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
        {question}
      </p>
      <div className="md:grid-cols-2 grid grid-cols-1 gap-4">
        {options.map((option) => (
          <button
            key={option.letter}
            type="button"
            onClick={() => handleAnswerSelect(option.letter, option.text)}
            disabled={
              selectedAnswer !== null || hasAnswered || timeRemaining <= 0
            }
            className={`answer-option border-2 p-4 transition-all duration-200 transform
                bg-white text-gray-700 rounded-lg text-left
                ${
                  hasAnswered || timeRemaining <= 0
                    ? selectedAnswer === option.letter
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 opacity-50 cursor-not-allowed"
                    : selectedAnswer === null
                    ? "hover:bg-emerald-50 border-emerald-300 hover:border-emerald-500 hover:-translate-y-1 hover:shadow-md"
                    : selectedAnswer === option.letter
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 opacity-50 cursor-not-allowed"
                }`}
          >
            <span
              className={`w-8 h-8 rounded-full text-center font-bold leading-8 mr-2 inline-block
                ${
                  selectedAnswer === option.letter
                    ? "bg-emerald-500 text-white"
                    : "bg-emerald-100 text-emerald-700"
                }`}
            >
              {option.letter}
            </span>
            <span className="font-medium">{option.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
