export function PowerUps() {
  return (
    <div className='justify-center mb-6 flex space-x-4'>
      <button
        title='Pista: Elimina dos opciones incorrectas'
        type='submit'
        className='hover:bg-emerald-700 p-3
          transition-transform hover:scale-110 bg-emerald-600 text-white rounded-full shadow-md'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      </button>
      <button
        title='Congelar tiempo: Detiene el contador por 10 segundos'
        type='submit'
        className='hover:bg-emerald-700
          p-3 transition-transform hover:scale-110 bg-emerald-600 text-white rounded-full shadow-md'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      </button>
      <button
        title='Comodín: Respuesta automática correcta'
        type='submit'
        className='hover:bg-emerald-700 p-3
          transition-transform hover:scale-110 bg-emerald-600 text-white rounded-full shadow-md'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
          />
        </svg>
      </button>
    </div>
  );
}
