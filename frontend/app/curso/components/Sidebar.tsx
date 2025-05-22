'use client';

import React from 'react';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <div
      className={`h-full w-64 bg-white shadow-lg lg:translate-x-0 fixed left-0 top-16 border-r border-gray-200 transform
      ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 z-40`}
      id='sidebar'
    >
      <div className='p-4'>
        <div className='items-center mb-6 flex space-x-3'>
          {/* <img alt="Foto de perfil del estudiante" src="https://placehold.co/40x40/emerald/white?text=MR" className="h-10 w-10 rounded-full"> */}
          <div>
            <p className='font-medium text-emerald-800'>María Rodríguez</p>
            <div className='items-center flex'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4 text-yellow-500'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z'></path>
              </svg>
              <span className='text-sm ml-1'>Nivel 15</span>
            </div>
          </div>
        </div>
        
        <div className='items-center mb-4 flex space-x-3'>
          <div className='items-center bg-emerald-600 rounded-full px-3 py-2 text-white flex w-full'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 mr-2'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              ></path>
            </svg>
            <span className='font-medium'>500 Monedas</span>
          </div>
        </div>
        
        <div className='items-center mb-4 flex'>
          <button
            type='button'
            className='relative w-full p-2 hover:bg-emerald-50 transition rounded-lg flex items-center'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 text-emerald-700 mr-2'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
              ></path>
            </svg>
            <span className='font-medium'>Notificaciones</span>
            <span className='bg-red-500 text-white rounded-full w-5 h-5 items-center justify-center text-xs absolute right-2 flex'>
              3
            </span>
          </button>
        </div>
        <div className='space-y-2'>
          <Link
            href='/inicio'
            className='items-center px-4 py-2 rounded-lg bg-emerald-100 text-emerald-800 flex
            space-x-3'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
              ></path>
            </svg>
            <span className='font-medium'>Inicio</span>
          </Link>
          <Link
            href='/mis-cursos'
            className='items-center px-4 py-2 rounded-lg flex space-x-3 hover:bg-emerald-50
            transition'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
              ></path>
            </svg>
            <span className='font-medium'>Mis Cursos</span>
          </Link>
          <Link
            href='/perfil'
            className='items-center px-4 py-2 rounded-lg flex space-x-3 hover:bg-emerald-50
            transition'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
              ></path>
            </svg>
            <span className='font-medium'>Mi Perfil</span>
          </Link>
          <Link
            href='/logros'
            className='items-center px-4 py-2 rounded-lg flex space-x-3 hover:bg-emerald-50
            transition'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
              ></path>
            </svg>
            <span className='font-medium'>Logros</span>
          </Link>
          <Link
            href='/tienda'
            className='items-center px-4 py-2 rounded-lg flex space-x-3 hover:bg-emerald-50
            transition'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M11 11V9a2 2 0 00-2-2m2 4v4a2 2 0 104 0v-1m-4-3H9m2 0h4m6 1a9 9 0 11-18 0 9 9 0 0118 0z'
              ></path>
            </svg>
            <span className='font-medium'>Tienda de Bonos</span>
          </Link>
          <Link
            href='/duelos'
            className='items-center px-4 py-2 rounded-lg flex space-x-3 hover:bg-emerald-50
            transition'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
              ></path>
            </svg>
            <span className='font-medium'>Duelos Académicos</span>
          </Link>
        </div>
        <hr className='my-5 border-gray-200' />
        <div className='space-y-1'>
          <p className='text-sm font-semibold text-gray-500 px-4 mb-2'>
            Mis Cursos
          </p>
          <Link
            href='/curso/matematicas'
            className='items-center px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 flex
            space-x-3 hover:bg-emerald-100 transition'
          >
            <div className='h-2 w-2 rounded-full bg-emerald-500'></div>
            <span>Matemáticas Avanzadas</span>
          </Link>
          <Link
            href='/curso/programacion'
            className='items-center px-4 py-2 rounded-lg flex space-x-3 hover:bg-emerald-50
            transition'
          >
            <div className='h-2 w-2 rounded-full bg-blue-500'></div>
            <span>Programación Web</span>
          </Link>
          <Link
            href='/curso/fisica'
            className='items-center px-4 py-2 rounded-lg flex space-x-3 hover:bg-emerald-50
            transition'
          >
            <div className='h-2 w-2 rounded-full bg-purple-500'></div>
            <span>Física Cuántica</span>
          </Link>
          <Link
            href='/curso/literatura'
            className='items-center px-4 py-2 rounded-lg flex space-x-3 hover:bg-emerald-50
            transition'
          >
            <div className='h-2 w-2 rounded-full bg-yellow-500'></div>
            <span>Literatura Universal</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
