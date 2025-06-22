export default function CourseTile({title}: {title: string}) {
    return (
        <div
            className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow
            duration-300'
            >
            <div className='bg-emerald-700 h-3'></div>
            <div className='p-6'>
                <div className='justify-between items-start mb-4 flex'>
                <div>
                    <p className='text-xl font-bold text-gray-800 mb-1'>
                    {title}
                    </p>
                    <p className='text-gray-500 text-sm'>
                    Prof. Martínez • 4º Semestre
                    </p>
                </div>
                <span className='bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-1 rounded-full'>
                    Nivel A+
                </span>
                </div>
                <div className='justify-between items-center mb-4 flex'>
                <div className='flex space-x-2'>
                    <div className='items-center text-yellow-500 flex'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                        id='Windframe_X0JPXSXkX'
                    >
                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                        id='Windframe_cxvHxX9wT'
                    >
                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                        id='Windframe_PyjAhASDs'
                    >
                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                    </div>
                    <div className='text-sm text-gray-500'>3 de 5</div>
                </div>
                <div className='items-center flex'>
                    <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 text-emerald-500 mr-1'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                    id='Windframe_ADHdDZ4r2'
                    >
                    <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                        clipRule='evenodd'
                    ></path>
                    </svg>
                    <span className='text-gray-500 text-sm'>Asistencia: 95%</span>
                </div>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2.5 mb-4'>
                <div
                    style={{ width: '80%' }}
                    className='bg-emerald-500 h-2.5 rounded-full'
                ></div>
                </div>
                <div className='items-center justify-between flex'>
                <div className='flex -space-x-2'>
                    {/* <img alt="Foto de estudiante 1" src="https://placehold.co/30x30?text=User1" className="border border-white w-6
                    h-6 rounded-full">
                <img alt="Foto de estudiante 2" src="https://placehold.co/30x30?text=User2" className="border border-white w-6
                    h-6 rounded-full">
                <img alt="Foto de estudiante 3" src="https://placehold.co/30x30?text=User3" className="border border-white w-6
                    h-6 rounded-full"> */}
                    <span
                    className='items-center justify-center w-6 h-6 text-xs font-medium text-white bg-emerald-500
                    rounded-full flex border border-white'
                    >
                    +15
                    </span>
                </div>
                <div className='flex space-x-2'>
                    <span className='px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full'>
                    Tarea pendiente
                    </span>
                    <span className='px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full'>
                    Duelo disponible
                    </span>
                </div>
                </div>
            </div>
        </div>
    );