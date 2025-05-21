import { useState } from 'react';

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
}

export function Question({
  questionNumber,
  totalQuestions,
  // points,
  question,
  options,
}: QuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleAnswerSelect = (letter: string) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(letter);
    }
  };

  return (
    <div className='bg-white rounded-xl shadow-lg mb-6 p-6 border-2 border-emerald-300'>
      <div className='justify-between mb-3 flex'>
        <span className='bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold'>
          Pregunta {questionNumber} de {totalQuestions}
        </span>
        {/* <span className='bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full text-sm font-semibold'>
          +{points} puntos
        </span> */}
      </div>
      <p className='text-xl md:text-2xl font-bold text-gray-800 mb-6'>
        {question}
      </p>
      <div className='md:grid-cols-2 grid grid-cols-1 gap-4'>
        {options.map((option) => (
          <button
            key={option.letter}
            type='button'
            onClick={() => handleAnswerSelect(option.letter)}
            disabled={selectedAnswer !== null}
            className={`answer-option border-2 p-4 transition-all duration-200 transform
              bg-white text-gray-700 rounded-lg text-left
              ${
                selectedAnswer === null
                  ? 'hover:bg-emerald-50 border-emerald-300 hover:border-emerald-500 hover:-translate-y-1 hover:shadow-md'
                  : selectedAnswer === option.letter
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 opacity-50 cursor-not-allowed'
              }`}
          >
            <span
              className={`w-8 h-8 rounded-full text-center font-bold leading-8 mr-2 inline-block
                ${
                  selectedAnswer === option.letter
                    ? 'bg-emerald-500 text-white'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
            >
              {option.letter}
            </span>
            <span className='font-medium'>{option.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
