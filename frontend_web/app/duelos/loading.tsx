export default function DuelosLoading() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100'>
      <div className='text-center'>
        <div className='relative'>
          {/* Crossed swords animation */}
          <div className='flex items-center justify-center space-x-2 mb-6'>
            <div className='animate-pulse'>⚔️</div>
            <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-emerald-600'></div>
            <div className='animate-pulse'>⚔️</div>
          </div>
        </div>
        <p className='text-2xl text-gray-800 font-bold mb-2'>
          Preparando el campo de batalla...
        </p>
        <p className='text-sm text-gray-600'>
          Cargando duelos y desafíos académicos
        </p>
      </div>
    </div>
  );
}
