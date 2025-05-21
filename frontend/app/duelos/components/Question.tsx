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
            type='submit'
            className='answer-option hover:bg-emerald-50 border-2 border-emerald-300
              hover:border-emerald-500 p-4 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md
              bg-white text-gray-700 rounded-lg text-left'
          >
            <span
              className='w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full text-center font-bold leading-8 mr-2
              inline-block'
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
