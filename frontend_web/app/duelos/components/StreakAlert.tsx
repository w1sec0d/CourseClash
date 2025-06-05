interface StreakAlertProps {
  message: string;
}

export function StreakAlert({ message }: StreakAlertProps) {
  return (
    <div className='bg-gradient-to-r text-white rounded-lg shadow-lg items-center from-emerald-500 to-emerald-700 p-4 flex animate-pulse'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-6 w-6 mr-2'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          d='M13 10V3L4 14h7v7l9-11h-7z'
        />
      </svg>
      <span className='font-medium'>{message}</span>
    </div>
  );
}
