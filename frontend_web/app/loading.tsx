import LoadingSpinner from '../components/LoadingSpinner';

export default function Loading() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='text-center'>
        <LoadingSpinner />
        <p className='mt-4 text-lg text-gray-600 animate-pulse'>
          Cargando página...
        </p>
      </div>
    </div>
  );
}
