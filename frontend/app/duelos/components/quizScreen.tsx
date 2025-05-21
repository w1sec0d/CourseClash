import { useState, useEffect } from 'react';
import { Question } from './Question';
import { DuelHeader } from './DuelHeader';
// import { PowerUps } from './PowerUps';
// import { StreakAlert } from './StreakAlert';

interface QuestionData {
  id: string;
  text: string;
  answer: string;
  options: string[];
}

interface QuizScreenProps {
  wsConnection: WebSocket | null;
  duelId: string;
  playerId: string;
  opponentId: string;
}

export default function QuizScreen({
  wsConnection,
  duelId,
  playerId,
  opponentId,
}: QuizScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(
    null
  );
  const [isWaiting, setIsWaiting] = useState(true);
  const [playerProgress, setPlayerProgress] = useState(0);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [totalQuestions] = useState(5);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!wsConnection) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        console.log('Raw WebSocket message:', event.data);

        const data = JSON.parse(event.data);
        console.log('Parsed WebSocket message:', data);

        if (data.type === 'question') {
          setIsWaiting(false);
          setCurrentQuestion(data.data);
          setError(null);
        } else if (data.type === 'opponent_progress') {
          setOpponentProgress(data.progress);
        } else if (data.type === 'error') {
          setError(data.message);
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
        setError('Error al procesar el mensaje del servidor');
      }
    };

    wsConnection.addEventListener('message', handleMessage);
    return () => wsConnection.removeEventListener('message', handleMessage);
  }, [wsConnection]);

  const handleAnswerSelect = (selectedOption: string) => {
    if (!wsConnection || !currentQuestion) return;

    try {
      wsConnection.send(
        JSON.stringify({
          type: 'answer',
          questionId: currentQuestion.id,
          answer: selectedOption,
        })
      );

      setPlayerProgress((prev) => prev + 1);
      setError(null);
    } catch (err) {
      console.error('Error sending answer:', err);
      setError('Error al enviar la respuesta');
    }
  };

  if (isWaiting) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4'></div>
          <h2 className='text-xl font-semibold text-gray-700'>
            Esperando al oponente...
          </h2>
          <p className='text-gray-500 mt-2'>
            El duelo comenzará cuando ambos jugadores estén listos
          </p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-gray-700'>
            Esperando la siguiente pregunta...
          </h2>
          {error && <p className='text-red-500 mt-2'>{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <main className='mx-auto px-4 py-6 flex-grow container'>
        <div className='mx-auto max-w-3xl'>
          {error && (
            <div className='mb-4 p-4 bg-red-100 rounded-lg'>
              <p className='text-red-700'>{error}</p>
            </div>
          )}

          <DuelHeader
            title='Duelo de Matemáticas'
            opponent={opponentId}
            timeRemaining='--:--'
            playerProgress={playerProgress}
            opponentProgress={opponentProgress}
            totalQuestions={totalQuestions}
          />

          <Question
            key={currentQuestion.id}
            questionNumber={playerProgress + 1}
            totalQuestions={totalQuestions}
            question={currentQuestion.text}
            options={currentQuestion.options.map((option, index) => ({
              letter: String.fromCharCode(65 + index),
              text: option,
            }))}
            onAnswerSelect={handleAnswerSelect}
          />

          {/* <PowerUps />

          <StreakAlert
            streak={3}
            message='¡Racha de 3 respuestas correctas! Próxima respuesta con puntos dobles.'
          /> */}
        </div>
      </main>
    </div>
  );
}
