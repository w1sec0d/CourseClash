export default function DashboardLoading() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-600 mx-auto'></div>
        <p className='mt-6 text-xl text-gray-700 font-medium'>
          Cargando tu panel de control...
        </p>
        <p className='mt-2 text-sm text-gray-500'>
          Preparando tus cursos y estadísticas
        </p>
      </div>
    </div>
  );
}
