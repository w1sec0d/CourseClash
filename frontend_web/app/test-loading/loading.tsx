export default function TestLoading() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-green-50'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-20 w-20 border-t-4 border-blue-600 mx-auto'></div>
        <p className='mt-6 text-2xl text-gray-800 font-bold'>
          🧪 Testing Next.js Loading States
        </p>
        <p className='mt-2 text-sm text-gray-600'>
          This should show for 3 seconds...
        </p>
      </div>
    </div>
  );
}
