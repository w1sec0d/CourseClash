'use client';

import { useState, useEffect } from 'react';

export default function Curso() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const sidebarToggle = document.getElementById('sidebarToggle');
      const target = event.target as HTMLElement;

      if (
        isSidebarOpen &&
        !sidebar?.contains(target) &&
        !sidebarToggle?.contains(target) &&
        window.innerWidth < 1024
      ) {
        setIsSidebarOpen(false);
      }
    };

    // Handle window resize
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Set initial state based on screen size
    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, [isSidebarOpen]);
  return (
    <div>
      <nav className='bg-emerald-700 text-white shadow-md w-full p-4 fixed top-0 z-50'>
        <div className='mx-auto justify-between items-center container flex'>
          <div className='items-center flex space-x-2'>
            <button
              type='button'
              className='p-2 rounded hover:bg-emerald-600 transition lg:hidden'
              id='sidebarToggle'
              onClick={toggleSidebar}
              aria-label='Toggle sidebar'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                id='Windframe_6haeicRJ0'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='M4 6h16M4 12h16M4 18h16'
                ></path>
              </svg>
            </button>
            <div className='items-center flex space-x-3'>
              {/* <img alt="Logo de Course Clash - Una espada insertada en un birrete de graduación" src="https://placehold.co/50x50/emerald/white?text=CC" className="h-10 w-10 rounded-full"> */}
              <p className='text-xl font-bold'>Course Clash</p>
            </div>
          </div>
          <div className='items-center flex space-x-4'>
            <div className='items-center bg-emerald-600 rounded-full px-3 py-1 flex'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 mr-1'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                id='Windframe_awOrcTv2w'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                ></path>
              </svg>
              <span className='font-medium'>500 Monedas</span>
            </div>
            <div className='relative'>
              <button
                type='submit'
                className='relative p-1 hover:bg-emerald-600 transition rounded-full'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  id='Windframe_Ac7UwEgg2'
                >
                  <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                  ></path>
                </svg>
                <span
                  className='bg-red-500 text-white rounded-full w-4 h-4 items-center justify-center text-xs absolute top-0
                right-0 flex'
                >
                  3
                </span>
              </button>
            </div>
            {/* <img alt="Foto de perfil del estudiante" src="https://placehold.co/40x40/emerald/white?text=MR" className="border-2
            border-white h-8 w-8 rounded-full"> */}
          </div>
        </div>
      </nav>
      <div
        className={`h-full w-64 bg-white shadow-lg lg:translate-x-0 fixed left-0 top-16 border-r border-gray-200 transform
      ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 z-40`}
        id='sidebar'
      >
        <div className='p-4'>
          <div className='items-center mb-6 flex space-x-3'>
            {/* <img alt="Foto de perfil del estudiante" src="https://placehold.co/40x40/emerald/white?text=MR" className="h-10 w-10
            rounded-full"> */}
            <div>
              <p className='font-medium text-emerald-800'>María Rodríguez</p>
              <div className='items-center flex'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 text-yellow-500'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                  id='Windframe_Xc97SMmv3'
                >
                  <path d='M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z'></path>
                </svg>
                <span className='text-sm ml-1'>Nivel 15</span>
              </div>
            </div>
          </div>
          <div className='space-y-2'>
            <a
              href='/9twIWsbSYpNA4lj2s5SG#'
              className='items-center px-4 py-2 rounded-lg bg-emerald-100 text-emerald-800 flex
            space-x-3'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                id='Windframe_GOHlGazbr'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                ></path>
              </svg>
              <span className='font-medium'>Inicio</span>
            </a>
            <a
              href='/9twIWsbSYpNA4lj2s5SG#'
              className='items-center px-4 py-2 rounded-lg flex space-x-3 hover:bg-emerald-50
            transition'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                id='Windframe_VPgYFyWjA'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                ></path>
              </svg>
              <span className='font-medium'>Mis Cursos</span>
            </a>
            <a
              href='/9twIWsbSYpNA4lj2s5SG#'
              className='items-center px-4 py-2 rounded-lg flex space-x-3 hover:bg-emerald-50
            transition'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                id='Windframe_4ReLHxDOl'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                ></path>
              </svg>
              <span className='font-medium'>Mi Perfil</span>
            </a>
            <a
              href='/9twIWsbSYpNA4lj2s5SG#'
              className='items-center px-4 py-2 rounded-lg flex space-x-3 hover:bg-emerald-50
            transition'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                id='Windframe_F6QD9lur2'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                ></path>
              </svg>
              <span className='font-medium'>Logros</span>
            </a>
            <a
              href='/9twIWsbSYpNA4lj2s5SG#'
              className='items-center px-4 py-2 rounded-lg flex space-x-3 hover:bg-emerald-50
            transition'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                id='Windframe_3fN8K8fT7'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='M11 11V9a2 2 0 00-2-2m2 4v4a2 2 0 104 0v-1m-4-3H9m2 0h4m6 1a9 9 0 11-18 0 9 9 0 0118 0z'
                ></path>
              </svg>
              <span className='font-medium'>Tienda de Bonos</span>
            </a>
            <a
              href='/9twIWsbSYpNA4lj2s5SG#'
              className='items-center px-4 py-2 rounded-lg flex space-x-3 hover:bg-emerald-50
            transition'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                id='Windframe_ELbaUh4HM'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                ></path>
              </svg>
              <span className='font-medium'>Duelos Académicos</span>
            </a>
          </div>
          <hr className='my-5 border-gray-200' />
          <div className='space-y-1'>
            <p className='text-sm font-semibold text-gray-500 px-4 mb-2'>
              Mis Cursos
            </p>
            <a
              href='/9twIWsbSYpNA4lj2s5SG#'
              className='items-center px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 flex
            space-x-3 hover:bg-emerald-100 transition'
            >
              <div className='h-2 w-2 rounded-full bg-emerald-500'></div>
              <span>Matemáticas Avanzadas</span>
            </a>
            <a
              href='/9twIWsbSYpNA4lj2s5SG#'
              className='items-center px-4 py-2 rounded-lg flex space-x-3 hover:bg-emerald-50
            transition'
            >
              <div className='h-2 w-2 rounded-full bg-blue-500'></div>
              <span>Programación Web</span>
            </a>
            <a
              href='/9twIWsbSYpNA4lj2s5SG#'
              className='items-center px-4 py-2 rounded-lg flex space-x-3 hover:bg-emerald-50
            transition'
            >
              <div className='h-2 w-2 rounded-full bg-purple-500'></div>
              <span>Física Cuántica</span>
            </a>
            <a
              href='/9twIWsbSYpNA4lj2s5SG#'
              className='items-center px-4 py-2 rounded-lg flex space-x-3 hover:bg-emerald-50
            transition'
            >
              <div className='h-2 w-2 rounded-full bg-yellow-500'></div>
              <span>Literatura Universal</span>
            </a>
          </div>
        </div>
      </div>
      <div
        className={`bg-black lg:hidden fixed inset-0 bg-opacity-50 z-30 transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        id='sidebarOverlay'
        onClick={toggleSidebar}
      ></div>
      <section className='pt-16 lg:pl-64'>
        <div className='mx-auto md:p-6 container p-4'>
          <div className='mb-6'>
            <div className='justify-between items-center mb-4 flex'>
              <p className='text-2xl font-bold text-emerald-800'>
                Matemáticas Avanzadas
              </p>
              <div className='items-center flex space-x-2'>
                <span className='text-sm text-gray-500'>
                  Ranking del curso:
                </span>
                <div className='items-center bg-amber-100 text-amber-800 px-2 py-1 flex rounded'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 mr-1'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                    id='Windframe_HIPqmB0V7'
                  >
                    <path d='M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z'></path>
                  </svg>
                  <span className='font-medium'>3º Lugar</span>
                </div>
              </div>
            </div>
            <div className='bg-emerald-50 rounded-lg mb-6 p-4'>
              <p className='text-lg font-semibold text-emerald-800 mb-3 items-center flex'>
                Archivos Importantes
              </p>
              <div className='md:grid-cols-2 lg:grid-cols-3 grid grid-cols-1 gap-3'>
                <div
                  className='bg-white items-center shadow-sm rounded border border-emerald-200 p-3 flex hover:shadow-md
                transition'
                >
                  <div className='bg-emerald-100 mr-3 p-2 rounded'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6 text-emerald-600'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      id='Windframe_36QZhq20L'
                    >
                      <path
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        stroke-width='2'
                        d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <p className='font-medium text-emerald-800'>
                      Programa del Curso
                    </p>
                    <p className='text-sm text-gray-500'>PDF • 2.3 MB</p>
                  </div>
                </div>
                <div
                  className='bg-white items-center shadow-sm rounded border border-emerald-200 p-3 flex hover:shadow-md
                transition'
                >
                  <div className='bg-emerald-100 mr-3 p-2 rounded'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6 text-emerald-600'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      id='Windframe_fSC2MoFsx'
                    >
                      <path
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        stroke-width='2'
                        d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <p className='font-medium text-emerald-800'>
                      Calendario de Exámenes
                    </p>
                    <p className='text-sm text-gray-500'>PDF • 1.1 MB</p>
                  </div>
                </div>
                <div
                  className='bg-white items-center shadow-sm rounded border border-emerald-200 p-3 flex hover:shadow-md
                transition'
                >
                  <div className='bg-emerald-100 mr-3 p-2 rounded'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6 text-emerald-600'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      id='Windframe_JxgpPXu68'
                    >
                      <path
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        stroke-width='2'
                        d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <p className='font-medium text-emerald-800'>
                      Video de Introducción
                    </p>
                    <p className='text-sm text-gray-500'>MP4 • 42 MB</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='bg-white rounded-lg mb-6 border border-gray-200 p-4'>
              <div className='items-start flex space-x-3'>
                {/* <img alt="Foto de perfil del estudiante" src="https://placehold.co/40x40/emerald/white?text=MR" className="h-10
                w-10 rounded-full"> */}
                <div className='flex-1'>
                  <textarea
                    rows={3}
                    placeholder='Comparte algo con tu clase...'
                    className='w-full rounded-lg
                  border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500
                  focus:border-emerald-500 resize-none'
                  ></textarea>
                  <div className='justify-between mt-3 flex'>
                    <div className='flex space-x-2'>
                      <button
                        type='submit'
                        className='p-2 hover:text-emerald-600 rounded hover:bg-emerald-50 transition
                      text-gray-500'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                          id='Windframe_w4hNhACJI'
                        >
                          <path
                            stroke-linecap='round'
                            stroke-linejoin='round'
                            stroke-width='2'
                            d='M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13'
                          ></path>
                        </svg>
                      </button>
                      <button
                        type='submit'
                        className='p-2 hover:text-emerald-600 rounded hover:bg-emerald-50 transition
                      text-gray-500'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                          id='Windframe_Cw6BSioZB'
                        >
                          <path
                            stroke-linecap='round'
                            stroke-linejoin='round'
                            stroke-width='2'
                            d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                          ></path>
                        </svg>
                      </button>
                      <button
                        type='submit'
                        className='p-2 hover:text-emerald-600 rounded hover:bg-emerald-50 transition
                      text-gray-500'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                          id='Windframe_MDr3GuZ8y'
                        >
                          <path
                            stroke-linecap='round'
                            stroke-linejoin='round'
                            stroke-width='2'
                            d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'
                          ></path>
                          <path
                            stroke-linecap='round'
                            stroke-linejoin='round'
                            stroke-width='2'
                            d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                          ></path>
                        </svg>
                      </button>
                    </div>
                    <button
                      type='submit'
                      className='rounded hover:bg-emerald-700 transition px-4 py-2 bg-emerald-600
                    text-white'
                    >
                      Publicar
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='space-y-6'>
              <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
                <div className='p-4'>
                  <div className='justify-between items-start mb-4 flex'>
                    <div className='items-center flex'>
                      {/* <img alt="Foto de perfil del profesor" src="https://placehold.co/50x50/emerald/white?text=PG" className="h-12 w-12 rounded-full mr-3"> */}
                      <div>
                        <p className='font-medium text-emerald-800'>
                          Prof. García
                        </p>
                        <p className='text-sm text-gray-500'>Hoy, 10:15 AM</p>
                      </div>
                    </div>
                    <div className='items-center flex'>
                      <span
                        className='bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full items-center mr-2
                      flex'
                      >
                        Anuncio
                      </span>
                      <button
                        type='submit'
                        className='hover:text-gray-600 text-gray-400'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                          id='Windframe_Yu2KJjyb0'
                        >
                          <path
                            stroke-linecap='round'
                            stroke-linejoin='round'
                            stroke-width='2'
                            d='M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z'
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className='mb-4'>
                    <p className='text-gray-700 mb-3'>
                      ¡Atención estudiantes! Les recuerdo que este viernes
                      tendremos un duelo académico de ecuaciones diferenciales
                      contra el grupo B. El equipo ganador obtendrá 200 monedas
                      extra para cada miembro. Prepárense bien, ¡confío en
                      ustedes! 💪
                    </p>
                    <div className='bg-emerald-50 p-3 rounded border border-emerald-100'>
                      <div className='items-center text-emerald-700 flex'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5 mr-2'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                          id='Windframe_AV3CXWKBV'
                        >
                          <path
                            stroke-linecap='round'
                            stroke-linejoin='round'
                            stroke-width='2'
                            d='M13 10V3L4 14h7v7l9-11h-7z'
                          ></path>
                        </svg>
                        <p className='font-medium'>
                          Duelo Académico: Ecuaciones Diferenciales
                        </p>
                      </div>
                      <div className='ml-7'>
                        <p className='text-sm text-gray-600 mt-1'>
                          Viernes, 15 de Octubre • 14:30 - 16:00
                        </p>
                        <p className='text-sm text-gray-600'>
                          Recompensa: 200 monedas por participante del equipo
                          ganador
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='items-center justify-between text-sm flex'>
                    <div className='flex space-x-4'>
                      <button
                        type='submit'
                        className='flex hover:text-emerald-600 items-center text-gray-500'
                      >
                        Me gusta (15)
                      </button>
                      <button
                        type='submit'
                        className='flex hover:text-emerald-600 items-center text-gray-500'
                      >
                        Comentar (5)
                      </button>
                    </div>
                    <button
                      type='submit'
                      className='hover:text-emerald-700 text-emerald-600 font-medium'
                    >
                      Participar
                    </button>
                  </div>
                </div>
                <div className='bg-gray-50 p-4 border-t border-gray-200'>
                  <div className='space-y-4'>
                    <div className='flex space-x-3'>
                      {/* <img alt="Foto de perfil del estudiante" src="https://placehold.co/36x36/emerald/white?text=LP" className="h-9 w-9 rounded-full"> */}
                      <div className='bg-white rounded-lg shadow-sm flex-1 p-3'>
                        <div className='justify-between items-center mb-1 flex'>
                          <span className='font-medium text-emerald-800'>
                            Laura Pérez
                          </span>
                          <span className='text-xs text-gray-500'>
                            Hace 45 min
                          </span>
                        </div>
                        <p className='text-gray-700 text-sm'>
                          Profesor, ¿podemos usar nuestras notas durante el
                          duelo?
                        </p>
                      </div>
                    </div>
                    <div className='flex space-x-3'>
                      {/* <img alt="Foto de perfil del profesor" src="https://placehold.co/36x36/emerald/white?text=PG" className="h-9 w-9 rounded-full"> */}
                      <div className='bg-white rounded-lg shadow-sm flex-1 p-3'>
                        <div className='justify-between items-center mb-1 flex'>
                          <span className='font-medium text-emerald-800'>
                            Prof. García
                          </span>
                          <span className='text-xs text-gray-500'>
                            Hace 30 min
                          </span>
                        </div>
                        <p className='text-gray-700 text-sm'>
                          No, Laura. El duelo evaluará su conocimiento sin
                          ayudas externas. Pero tendrán 5 minutos de preparación
                          antes de comenzar.
                        </p>
                      </div>
                    </div>
                    <div className='flex space-x-3'>
                      {/* <img alt="Foto de perfil del estudiante" src="https://placehold.co/36x36/emerald/white?text=MR" className="h-9 w-9 rounded-full"> */}
                      <div className='flex-1'>
                        <textarea
                          rows={2}
                          placeholder='Escribe un comentario...'
                          className='w-full rounded-lg
                        text-sm border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500
                        focus:border-emerald-500 resize-none'
                        ></textarea>
                        <div className='justify-end mt-2 flex'>
                          <button
                            type='submit'
                            className='rounded hover:bg-emerald-700 transition px-3 py-1 bg-emerald-600
                          text-white text-sm'
                          >
                            Comentar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
                <div className='p-4'>
                  <div className='justify-between items-start mb-4 flex'>
                    <div className='items-center flex'>
                      {/* <img alt="Foto de perfil del estudiante" src="https://placehold.co/50x50/emerald/white?text=CR" className="h-12 w-12 rounded-full mr-3"> */}
                      <div>
                        <p className='font-medium text-emerald-800'>
                          Carlos Rodríguez
                        </p>
                        <p className='text-sm text-gray-500'>Ayer, 16:30 PM</p>
                      </div>
                    </div>
                    <div>
                      <button
                        type='submit'
                        className='hover:text-gray-600 text-gray-400'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                          id='Windframe_RWFMPkk97'
                        >
                          <path
                            stroke-linecap='round'
                            stroke-linejoin='round'
                            stroke-width='2'
                            d='M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z'
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className='mb-4'>
                    <p className='text-gray-700 mb-3'>
                      ¡He resuelto todos los ejercicios del capítulo 5! ¿Alguien
                      quiere repasar juntos para el duelo? Podríamos formar un
                      grupo de estudio esta tarde en la biblioteca 📚
                    </p>
                    {/* <img alt="Imagen de ecuaciones diferenciales resueltas" src="https://placehold.co/600x300/emerald/white?text=Ecuaciones+Diferenciales+Resueltas" className="w-full h-auto rounded-lg"> */}
                  </div>
                  <div className='items-center justify-between text-sm flex'>
                    <div className='flex space-x-4'>
                      <button
                        type='submit'
                        className='flex hover:text-emerald-600 items-center text-gray-500'
                      >
                        Me gusta (8)
                      </button>
                      <button
                        type='submit'
                        className='flex hover:text-emerald-600 items-center text-gray-500'
                      >
                        Comentar (2)
                      </button>
                    </div>
                    <div className='items-center flex space-x-1'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4 text-amber-500'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                        id='Windframe_ArVn5hSEv'
                      >
                        <path d='M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z'></path>
                      </svg>
                      <span className='text-xs text-amber-500 font-medium'>
                        +5 puntos por compartir recursos
                      </span>
                    </div>
                  </div>
                </div>
                <div className='bg-gray-50 p-4 border-t border-gray-200'>
                  <div className='space-y-4'>
                    <div className='flex space-x-3'>
                      {/* <img alt="Foto de perfil del estudiante" src="https://placehold.co/36x36/emerald/white?text=AH" className="h-9 w-9 rounded-full"> */}
                      <div className='bg-white rounded-lg shadow-sm flex-1 p-3'>
                        <div className='justify-between items-center mb-1 flex'>
                          <span className='font-medium text-emerald-800'>
                            Ana Hernández
                          </span>
                          <span className='text-xs text-gray-500'>
                            Ayer, 17:00 PM
                          </span>
                        </div>
                        <p className='text-gray-700 text-sm'>
                          ¡Genial idea! Yo me apunto. ¿Nos vemos a las 18:00?
                        </p>
                      </div>
                    </div>
                    <div className='flex space-x-3'>
                      {/* <img alt="Foto de perfil del estudiante" src="https://placehold.co/36x36/emerald/white?text=MR" className="h-9 w-9 rounded-full"> */}
                      <div className='flex-1'>
                        <textarea
                          rows={2}
                          placeholder='Escribe un comentario...'
                          className='w-full rounded-lg
                        text-sm border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500
                        focus:border-emerald-500 resize-none'
                        ></textarea>
                        <div className='justify-end mt-2 flex'>
                          <button
                            type='submit'
                            className='rounded hover:bg-emerald-700 transition px-3 py-1 bg-emerald-600
                          text-white text-sm'
                          >
                            Comentar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='bg-white rounded-lg border border-gray-200 p-4'>
                <div className='justify-between items-start mb-4 flex'>
                  <div className='items-center flex'>
                    {/* <img alt="Foto de perfil del profesor" src="https://placehold.co/50x50/emerald/white?text=PG" className="h-12 w-12 rounded-full mr-3"> */}
                    <div>
                      <p className='font-medium text-emerald-800'>
                        Prof. García
                      </p>
                      <p className='text-sm text-gray-500'>Hace 2 días</p>
                    </div>
                  </div>
                  <div className='items-center flex'>
                    <span className='bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full items-center mr-2 flex'>
                      Logro desbloqueado
                    </span>
                    <button
                      type='submit'
                      className='hover:text-gray-600 text-gray-400'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        id='Windframe_tROAvFR4T'
                      >
                        <path
                          stroke-linecap='round'
                          stroke-linejoin='round'
                          stroke-width='2'
                          d='M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z'
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <p className='text-gray-700 mb-4'>
                    ¡Felicitaciones a todos los que completaron el cuestionario
                    sorpresa de ayer! Han desbloqueado el logro &quot;Maestros
                    de la Derivación&quot; y recibido 50 monedas. Sigan así,
                    estoy muy orgulloso de su progreso.
                  </p>
                  <div className='bg-blue-50 rounded-lg items-center mb-4 p-4 border border-blue-200 flex'>
                    <div className='bg-blue-500 text-white rounded-full mr-4 flex-shrink-0 p-3'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-7 w-7'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        id='Windframe_N8uUyyh93'
                      >
                        <path
                          stroke-linecap='round'
                          stroke-linejoin='round'
                          stroke-width='2'
                          d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <p className='text-lg font-bold text-blue-800'>
                        Logro Desbloqueado: Maestros de la Derivación
                      </p>
                      <p className='text-blue-700'>
                        Completaste con éxito el cuestionario sorpresa sobre
                        derivadas
                      </p>
                      <div className='items-center mt-2 flex'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5 text-yellow-500 mr-1'
                          fill='currentColor'
                          viewBox='0 0 24 24'
                          id='Windframe_XrjiYUf9r'
                        >
                          <path d='M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z'></path>
                        </svg>
                        <span className='text-sm text-blue-700'>
                          +50 monedas
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='items-center justify-between text-sm flex'>
                    <div className='flex space-x-4'>
                      <button
                        type='submit'
                        className='flex hover:text-emerald-600 items-center text-gray-500'
                      >
                        Me gusta (24)
                      </button>
                      <button
                        type='submit'
                        className='flex hover:text-emerald-600 items-center text-gray-500'
                      >
                        Comentar (8)
                      </button>
                    </div>
                    <button
                      type='submit'
                      className='hover:text-emerald-700 flex text-emerald-600 font-medium items-center'
                    >
                      Ver logros
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
