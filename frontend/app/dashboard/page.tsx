'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import Swal from 'sweetalert2';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useAuth();
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
      <nav className='bg-emerald-700 text-white shadow-lg'>
        <div className='mx-auto px-4 container'>
          <div className='justify-between items-center py-4 flex'>
            <div className='items-center flex space-x-2'>
              {/* <img alt="Logo de Course Clash - Una espada insertada en un birrete de graduación" src="https://placehold.co/50x50?text=Logo" className="h-10"> */}
              <span className='font-bold text-xl'>Course Clash</span>
            </div>
            <div className='md:flex hidden space-x-6'>
              <a
                href='/9twIWsbSYpNA4lj2s5SG#'
                className='hover:text-emerald-200 transition'
              >
                Inicio
              </a>
              <a
                href='/9twIWsbSYpNA4lj2s5SG#'
                className='hover:text-emerald-200 transition'
              >
                Mis Cursos
              </a>
              <Link
                href='/duelos'
                className='hover:text-emerald-200 transition'
              >
                Duelos
              </Link>
              <a
                href='/9twIWsbSYpNA4lj2s5SG#'
                className='hover:text-emerald-200 transition'
              >
                Tienda
              </a>
              <a
                href='/9twIWsbSYpNA4lj2s5SG#'
                className='hover:text-emerald-200 transition'
              >
                Logros
              </a>
            </div>
            <div className='items-center flex space-x-4'>
              <div className='items-center bg-emerald-600 rounded-full px-3 py-1 flex'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-yellow-400'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  id='Windframe_oyn9wVj2Z'
                >
                  <path d='M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z'></path>
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z'
                    clipRule='evenodd'
                  ></path>
                </svg>
                <span className='ml-1 font-medium'>350</span>
              </div>
              <div className='relative'>
                <button
                  type='submit'
                  className='flex focus:outline-none items-center'
                >
                  <div className='relative'>
                    {/* <img alt="Foto de perfil del estudiante" src="https://placehold.co/40x40?text=Avatar" className="border-2
                    border-emerald-300 h-8 w-8 rounded-full"> */}
                    <div
                      className='bg-emerald-500 rounded-full h-4 w-4 items-center justify-center absolute -top-1 -right-1
                    border-2 border-white flex'
                    >
                      <span className='text-white text-xs'>3</span>
                    </div>
                  </div>
                  <span className='ml-2 md:block font-medium hidden'>
                    Carlos Sánchez
                  </span>
                </button>
              </div>
              <button type='submit' className='md:hidden'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  id='Windframe_qeSj29jDA'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M4 6h16M4 12h16M4 18h16'
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
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
      <div className='bg-white md:hidden fixed bottom-0 left-0 right-0 border-t border-gray-200'>
        <div className='justify-around items-center flex p-3'>
          <a
            href='/9twIWsbSYpNA4lj2s5SG#'
            className='items-center text-emerald-600 flex flex-col'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              id='Windframe_tYacVZcA3'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M3 12l2-2m0 0l7-7 7 7m-14 0l2 2m0 0l7 7 7-7m-14 0l2-2m0 0l7-7 7 7m-14 0l2 2m0 0l7 7 7-7'
              ></path>
            </svg>
            <span className='text-xs'>Inicio</span>
          </a>
          <a
            href='/9twIWsbSYpNA4lj2s5SG#'
            className='items-center text-gray-500 flex flex-col'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              id='Windframe_Qlfle1Kj6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
              ></path>
            </svg>
            <span className='text-xs'>Cursos</span>
          </a>
          <a
            href='/9twIWsbSYpNA4lj2s5SG#'
            className='items-center text-gray-500 flex flex-col'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              id='Windframe_AsBQRXEK6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'
              ></path>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              ></path>
            </svg>
            <span className='text-xs'>Duelos</span>
          </a>
          <a
            href='/9twIWsbSYpNA4lj2s5SG#'
            className='items-center text-gray-500 flex flex-col'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              id='Windframe_LCn5RZ2dF'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
              ></path>
            </svg>
            <span className='text-xs'>Tienda</span>
          </a>
          <a
            href='/9twIWsbSYpNA4lj2s5SG#'
            className='items-center text-gray-500 flex flex-col'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              id='Windframe_QxkJOj3Ht'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
              ></path>
            </svg>
            <span className='text-xs'>Perfil</span>
          </a>
        </div>
      </div>
    </div>
  );
}
