import { Suspense } from 'react';

// Simulate a slow component
async function SlowComponent() {
  // Simulate slow server component
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return (
    <div className='p-8 text-center'>
      <h1 className='text-2xl font-bold text-green-600'>
        ✅ Test Loading Complete!
      </h1>
      <p className='mt-4 text-gray-600'>
        If you saw a loading screen, it&apos;s working correctly!
      </p>
    </div>
  );
}

export default function TestLoadingPage() {
  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-3xl font-bold text-center mb-8'>
          Loading Test Page
        </h1>
        <Suspense
          fallback={
            <div className='text-center p-8'>
              <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 mx-auto'></div>
              <p className='mt-4 text-lg text-gray-600'>
                Testing loading state...
              </p>
            </div>
          }
        >
          <SlowComponent />
        </Suspense>
      </div>
    </div>
  );
}
