interface DuelHeaderProps {
  title: string;
  opponent: string;
  timeRemaining: string;
  playerProgress: number;
  opponentProgress: number;
  totalQuestions: number;
}

export function DuelHeader({
  title,
  opponent,
  timeRemaining,
  playerProgress,
  opponentProgress,
  totalQuestions,
}: DuelHeaderProps) {
  return (
    <div className='bg-emerald-100 rounded-lg mb-6 shadow-sm p-4'>
      <div className='justify-between items-center flex'>
        <div>
          <p className='text-xl font-bold text-emerald-800'>{title}</p>
          <p className='text-gray-600'>Vs. {opponent}</p>
        </div>
        <div className='text-center bg-white rounded-lg shadow-md p-3'>
          <p className='text-xl font-bold text-emerald-700'>{timeRemaining}</p>
          <p className='text-sm text-gray-500'>Tiempo restante</p>
        </div>
      </div>
      <div className='mt-4 items-center justify-between flex'>
        <div className='items-center mr-4 flex space-x-2 flex-1'>
          <div className='h-3 bg-emerald-200 rounded-full flex-grow'>
            <div
              style={{ width: `${(playerProgress / totalQuestions) * 100}%` }}
              className='h-3 bg-emerald-500 rounded-full'
            ></div>
          </div>
          <span className='font-medium text-gray-700'>
            {playerProgress}/{totalQuestions}
          </span>
        </div>
        <div className='items-center flex space-x-2 flex-1'>
          <div className='h-3 bg-gray-200 rounded-full flex-grow'>
            <div
              style={{ width: `${(opponentProgress / totalQuestions) * 100}%` }}
              className='h-3 bg-gray-500 rounded-full'
            ></div>
          </div>
          <span className='font-medium text-gray-700'>
            {opponentProgress}/{totalQuestions}
          </span>
        </div>
      </div>
    </div>
  );
}
