'use client';

import { useEffect, useRef } from 'react';
import { useAuthApollo } from '@/lib/auth-context-apollo';
import Swal from 'sweetalert2';

export default function Dashboard() {
  const { user } = useAuthApollo();
  const hasShownWelcome = useRef(false);

  useEffect(() => {
    // Show welcome message when user logs in and we haven't shown it yet
    if (user?.fullName && !hasShownWelcome.current) {
      hasShownWelcome.current = true;
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });

      Toast.fire({
        icon: 'success',
        title: `¡Bienvenid@, ${user.fullName}!`,
        background: '#065f46', // emerald-800
        color: '#ffffff',
        iconColor: '#10b981', // emerald-500
      });
    }
  }, [user]);

  return (
    <div className='bg-white min-h-screen'>
      <nav className='bg-emerald-700 text-white shadow-lg'></nav>
      <div className='mx-auto px-4 py-8 container'>
        <div className='md:grid-cols-4 mb-8 grid grid-cols-1 gap-4'>
          <div className='bg-emerald-50 rounded-lg items-center shadow p-4 flex'>
            <div className='bg-emerald-500 rounded-full mr-4 p-3'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-white'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                id='Windframe_mnWrCWXZN'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
                ></path>
              </svg>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>Rango Actual</p>
              <p className='font-bold text-gray-700'>Aprendiz Nivel 3</p>
            </div>
          </div>
          <div className='bg-emerald-50 rounded-lg items-center shadow p-4 flex'>
            <div className='bg-emerald-500 rounded-full mr-4 p-3'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-white'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                id='Windframe_MZ9udECQe'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                ></path>
              </svg>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>Duelos Ganados</p>
              <p className='font-bold text-gray-700'>27 de 35</p>
            </div>
          </div>
          <div className='bg-emerald-50 rounded-lg items-center shadow p-4 flex'>
            <div className='bg-emerald-500 rounded-full mr-4 p-3'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-white'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                id='Windframe_RMScivfsp'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                ></path>
              </svg>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>Tareas Completadas</p>
              <p className='font-bold text-gray-700'>43 de 50</p>
            </div>
          </div>
          <div className='bg-emerald-50 rounded-lg items-center shadow p-4 flex'>
            <div className='bg-emerald-500 rounded-full mr-4 p-3'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-white'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                id='Windframe_Kjcgihj4U'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                ></path>
              </svg>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>Logros Desbloqueados</p>
              <p className='font-bold text-gray-700'>15 de 30</p>
            </div>
          </div>
        </div>
        <div className='bg-white rounded-lg shadow-md mb-8 p-6'>
          <div className='justify-between items-center mb-2 flex'>
            <p className='text-gray-700 font-bold'>Progreso de Nivel</p>
            <span className='text-emerald-600 font-medium'>350 / 500 XP</span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-4'>
            <div
              style={{ width: '70%' }}
              className='bg-emerald-500 h-4 rounded-full'
            ></div>
          </div>
          <div className='justify-between mt-2 text-sm text-gray-500 flex'>
            <span>Nivel 3</span>
            <span>Nivel 4</span>
          </div>
        </div>
        <div className='justify-between items-center mb-6 flex'>
          <p className='text-2xl font-bold text-gray-700'>Mis Cursos</p>
          <div className='flex space-x-2'>
            <button
              type='submit'
              className='flex space-x-2 hover:bg-emerald-200 transition items-center bg-emerald-100
            text-emerald-700 py-2 px-4 rounded-lg'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                viewBox='0 0 20 20'
                fill='currentColor'
                id='Windframe_aO2LHQpA0'
              >
                <path
                  fillRule='evenodd'
                  d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                  clipRule='evenodd'
                ></path>
              </svg>
              <span>Todos</span>
            </button>
            <button
              type='submit'
              className='flex space-x-2 hover:bg-emerald-100 border border-gray-200 transition items-center
            bg-white text-gray-600 py-2 px-4 rounded-lg'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                viewBox='0 0 20 20'
                fill='currentColor'
                id='Windframe_P6n93SgC2'
              >
                <path d='M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z'></path>
              </svg>
              <span>Filtrar</span>
            </button>
          </div>
        </div>
        <div className='md:grid-cols-2 lg:grid-cols-3 grid grid-cols-1 gap-6'>
          <div
            className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow
          duration-300'
          >
            <div className='bg-emerald-700 h-3'></div>
            <div className='p-6'>
              <div className='justify-between items-start mb-4 flex'>
                <div>
                  <p className='text-xl font-bold text-gray-800 mb-1'>
                    Matemáticas Avanzadas
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
          <div
            className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow
          duration-300'
          >
            <div className='bg-emerald-600 h-3'></div>
            <div className='p-6'>
              <div className='justify-between items-start mb-4 flex'>
                <div>
                  <p className='text-xl font-bold text-gray-800 mb-1'>
                    Programación Web
                  </p>
                  <p className='text-gray-500 text-sm'>
                    Prof. García • 4º Semestre
                  </p>
                </div>
                <span className='bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-1 rounded-full'>
                  Nivel B+
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
                      id='Windframe_8rL2LWrrJ'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      id='Windframe_rrzWw2yGH'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      id='Windframe_tP7aCUHMy'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      id='Windframe_2wfHEG2eU'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                  </div>
                  <div className='text-sm text-gray-500'>4 de 5</div>
                </div>
                <div className='items-center flex'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 text-emerald-500 mr-1'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                    id='Windframe_1EGSOcRuL'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                      clipRule='evenodd'
                    ></path>
                  </svg>
                  <span className='text-gray-500 text-sm'>Asistencia: 90%</span>
                </div>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2.5 mb-4'>
                <div
                  style={{ width: '65%' }}
                  className='bg-emerald-500 h-2.5 rounded-full'
                ></div>
              </div>
              <div className='items-center justify-between flex'>
                <div className='flex -space-x-2'>
                  {/* <img alt="Foto de estudiante 1" src="https://placehold.co/30x30?text=User1" className="border border-white w-6
                  h-6 rounded-full">
              <img alt="Foto de estudiante 2" src="https://placehold.co/30x30?text=User2" className="border border-white w-6
                  h-6 rounded-full"> */}
                  <span
                    className='items-center justify-center w-6 h-6 text-xs font-medium text-white bg-emerald-500
                  rounded-full flex border border-white'
                  >
                    +9
                  </span>
                </div>
                <div className='flex space-x-2'>
                  <span className='px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full'>
                    Proyecto próximo
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow
          duration-300'
          >
            <div className='bg-emerald-500 h-3'></div>
            <div className='p-6'>
              <div className='justify-between items-start mb-4 flex'>
                <div>
                  <p className='text-xl font-bold text-gray-800 mb-1'>
                    Física Moderna
                  </p>
                  <p className='text-gray-500 text-sm'>
                    Prof. Rodríguez • 4º Semestre
                  </p>
                </div>
                <span className='bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-1 rounded-full'>
                  Nivel C
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
                      id='Windframe_iecEgII3n'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      id='Windframe_Hx8NQftSH'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                  </div>
                  <div className='text-sm text-gray-500'>2 de 5</div>
                </div>
                <div className='items-center flex'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 text-emerald-500 mr-1'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                    id='Windframe_crsM7N5vz'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                      clipRule='evenodd'
                    ></path>
                  </svg>
                  <span className='text-gray-500 text-sm'>Asistencia: 75%</span>
                </div>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2.5 mb-4'>
                <div
                  style={{ width: '35%' }}
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
                  h-6 rounded-full">
              <img alt="Foto de estudiante 4" src="https://placehold.co/30x30?text=User4" className="border border-white w-6
                  h-6 rounded-full"> */}
                  <span
                    className='items-center justify-center w-6 h-6 text-xs font-medium text-white bg-emerald-500
                  rounded-full flex border border-white'
                  >
                    +12
                  </span>
                </div>
                <div className='flex space-x-2'>
                  <span className='px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full'>
                    Examen próximo
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow
          duration-300'
          >
            <div className='bg-emerald-800 h-3'></div>
            <div className='p-6'>
              <div className='justify-between items-start mb-4 flex'>
                <div>
                  <p className='text-xl font-bold text-gray-800 mb-1'>
                    Historia del Arte
                  </p>
                  <p className='text-gray-500 text-sm'>
                    Profa. López • 4º Semestre
                  </p>
                </div>
                <span className='bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-1 rounded-full'>
                  Nivel A
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
                      id='Windframe_81PAcIWas'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      id='Windframe_oZeV4r4OJ'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      id='Windframe_nygLhjydS'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      id='Windframe_us9IuwOC6'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      id='Windframe_LQomRf181'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                  </div>
                  <div className='text-sm text-gray-500'>5 de 5</div>
                </div>
                <div className='items-center flex'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 text-emerald-500 mr-1'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                    id='Windframe_ZYQa627eR'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                      clipRule='evenodd'
                    ></path>
                  </svg>
                  <span className='text-gray-500 text-sm'>
                    Asistencia: 100%
                  </span>
                </div>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2.5 mb-4'>
                <div
                  style={{ width: '95%' }}
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
                    +8
                  </span>
                </div>
                <div className='flex space-x-2'>
                  <span className='px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full'>
                    ¡Al día!
                  </span>
                  <span className='px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full'>
                    Logro desbloqueado
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow
          duration-300'
          >
            <div className='bg-emerald-600 h-3'></div>
            <div className='p-6'>
              <div className='justify-between items-start mb-4 flex'>
                <div>
                  <p className='text-xl font-bold text-gray-800 mb-1'>
                    Idioma Extranjero
                  </p>
                  <p className='text-gray-500 text-sm'>
                    Prof. Smith • 4º Semestre
                  </p>
                </div>
                <span className='bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-1 rounded-full'>
                  Nivel B
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
                      id='Windframe_RRbBfoGS1'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      id='Windframe_63Gavdjk6'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      id='Windframe_4FL6bTLMG'
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
                    id='Windframe_AhzfyXic5'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                      clipRule='evenodd'
                    ></path>
                  </svg>
                  <span className='text-gray-500 text-sm'>Asistencia: 85%</span>
                </div>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2.5 mb-4'>
                <div
                  style={{ width: '70%' }}
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
                    +20
                  </span>
                </div>
                <div className='flex space-x-2'>
                  <span className='px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full'>
                    Práctica oral
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow
          duration-300'
          >
            <div className='bg-emerald-400 h-3'></div>
            <div className='p-6'>
              <div className='justify-between items-start mb-4 flex'>
                <div>
                  <p className='text-xl font-bold text-gray-800 mb-1'>
                    Química Orgánica
                  </p>
                  <p className='text-gray-500 text-sm'>
                    Profa. Hernández • 4º Semestre
                  </p>
                </div>
                <span className='bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-1 rounded-full'>
                  Nivel B-
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
                      id='Windframe_hByDIOCIm'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      id='Windframe_YKeLlvH2a'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      id='Windframe_PtneJMRWX'
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
                    id='Windframe_I8OVUFsRn'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                      clipRule='evenodd'
                    ></path>
                  </svg>
                  <span className='text-gray-500 text-sm'>Asistencia: 83%</span>
                </div>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2.5 mb-4'>
                <div
                  style={{ width: '55%' }}
                  className='bg-emerald-500 h-2.5 rounded-full'
                ></div>
              </div>
              <div className='items-center justify-between flex'>
                <div className='flex -space-x-2'>
                  {/* <img alt="Foto de estudiante 1" src="https://placehold.co/30x30?text=User1" className="border border-white w-6
                  h-6 rounded-full"> */}
                  {/* <img alt="Foto de estudiante 2" src="https://placehold.co/30x30?text=User2" className="border border-white w-6
                  h-6 rounded-full"> */}
                  <span
                    className='items-center justify-center w-6 h-6 text-xs font-medium text-white bg-emerald-500
                  rounded-full flex border border-white'
                  >
                    +14
                  </span>
                </div>
                <div className='flex space-x-2'>
                  <span className='px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full'>
                    Laboratorio pendiente
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-12'>
          <p className='text-2xl font-bold text-gray-700 mb-6'>
            Logros Recientes
          </p>
          <div className='md:grid-cols-4 grid grid-cols-2 gap-4'>
            <div
              className='bg-white rounded-lg text-center shadow p-4 border border-gray-100 hover:shadow-md
            transition-shadow'
            >
              <div className='rounded-full bg-yellow-100 text-yellow-500 mb-3 inline-flex p-3'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-8 w-8'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  id='Windframe_kNmQQ1V1W'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M13 10V3L4 14h7v7l9-11h-7z'
                  ></path>
                </svg>
              </div>
              <p className='text-gray-700 font-semibold'>Racha Veloz</p>
              <p className='text-gray-500 text-sm'>
                Completa 5 tareas en menos de 3 días
              </p>
            </div>
            <div
              className='bg-white rounded-lg text-center shadow p-4 border border-gray-100 hover:shadow-md
            transition-shadow'
            >
              <div className='rounded-full bg-emerald-100 text-emerald-500 mb-3 inline-flex p-3'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-8 w-8'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  id='Windframe_bbsFVpZcw'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  ></path>
                </svg>
              </div>
              <p className='text-gray-700 font-semibold'>Asistencia Perfecta</p>
              <p className='text-gray-500 text-sm'>
                Asiste a todas las clases durante un mes
              </p>
            </div>
            <div
              className='bg-white rounded-lg text-center shadow p-4 border border-gray-100 hover:shadow-md
            transition-shadow'
            >
              <div className='rounded-full bg-blue-100 text-blue-500 mb-3 inline-flex p-3'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-8 w-8'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  id='Windframe_Jl8xNXxXN'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9'
                  ></path>
                </svg>
              </div>
              <p className='text-gray-700 font-semibold'>Colaborador</p>
              <p className='text-gray-500 text-sm'>
                Ayuda a 3 compañeros en sus tareas
              </p>
            </div>
            <div
              className='bg-white rounded-lg text-center shadow p-4 border border-gray-100 hover:shadow-md
            transition-shadow'
            >
              <div className='rounded-full bg-purple-100 text-purple-500 mb-3 inline-flex p-3'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-8 w-8'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  id='Windframe_K0MGCzBML'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
                  ></path>
                </svg>
              </div>
              <p className='text-gray-700 font-semibold'>Primer Duelo</p>
              <p className='text-gray-500 text-sm'>
                Gana tu primer duelo académico
              </p>
            </div>
          </div>
        </div>
        <div className='mt-12 bg-white rounded-lg shadow-md p-6'>
          <p className='text-2xl font-bold text-gray-700 mb-4'>
            Próximos Eventos
          </p>
          <div className='space-y-4'>
            <div className='items-center bg-emerald-50 rounded-lg flex p-3'>
              <div className='mr-4 bg-white rounded-lg text-center shadow-sm flex-shrink-0 p-3'>
                <span className='text-2xl font-bold text-emerald-600 block'>
                  15
                </span>
                <span className='text-xs text-gray-500 block'>Jun</span>
              </div>
              <div className='flex-grow'>
                <div className='justify-between items-center flex'>
                  <p className='font-semibold text-gray-700'>
                    Examen Final - Matemáticas Avanzadas
                  </p>
                  <span className='bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded-full'>
                    Importante
                  </span>
                </div>
                <p className='text-gray-500 text-sm'>9:00 AM - Aula 203</p>
              </div>
            </div>
            <div className='items-center bg-emerald-50 rounded-lg flex p-3'>
              <div className='mr-4 bg-white rounded-lg text-center shadow-sm flex-shrink-0 p-3'>
                <span className='text-2xl font-bold text-emerald-600 block'>
                  18
                </span>
                <span className='text-xs text-gray-500 block'>Jun</span>
              </div>
              <div className='flex-grow'>
                <div className='justify-between items-center flex'>
                  <p className='font-semibold text-gray-700'>
                    Duelo de Programación - Nivel Intermedio
                  </p>
                  <span className='bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full'>
                    Competencia
                  </span>
                </div>
                <p className='text-gray-500 text-sm'>
                  2:00 PM - Sala de Informática
                </p>
              </div>
            </div>
            <div className='items-center bg-emerald-50 rounded-lg flex p-3'>
              <div className='mr-4 bg-white rounded-lg text-center shadow-sm flex-shrink-0 p-3'>
                <span className='text-2xl font-bold text-emerald-600 block'>
                  22
                </span>
                <span className='text-xs text-gray-500 block'>Jun</span>
              </div>
              <div className='flex-grow'>
                <div className='justify-between items-center flex'>
                  <p className='font-semibold text-gray-700'>
                    Entrega de Proyecto Final - Física
                  </p>
                  <span className='bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1 rounded-full'>
                    Fecha límite
                  </span>
                </div>
                <p className='text-gray-500 text-sm'>
                  11:59 PM - Plataforma en línea
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
