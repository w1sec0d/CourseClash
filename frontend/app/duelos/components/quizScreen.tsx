import { Question } from './Question';
import { DuelHeader } from './DuelHeader';
// import { PowerUps } from './PowerUps';
// import { StreakAlert } from './StreakAlert';

export default function QuizScreen() {
  return (
    <div className='min-h-screen flex flex-col'>
      <main className='mx-auto px-4 py-6 flex-grow container'>
        <div className='mx-auto max-w-3xl'>
          <DuelHeader
            title='Duelo de Matemáticas'
            opponent='CarlosM92'
            timeRemaining='0:45'
            playerProgress={3}
            opponentProgress={2}
            totalQuestions={5}
          />

          <Question
            questionNumber={4}
            totalQuestions={5}
            // points={150}
            question='Si 2x + 3y = 12 y 3x - y = 4, ¿cuál es el valor de x + y?'
            options={[
              { letter: 'A', text: '3' },
              { letter: 'B', text: '4' },
              { letter: 'C', text: '5' },
              { letter: 'D', text: '6' },
            ]}
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
