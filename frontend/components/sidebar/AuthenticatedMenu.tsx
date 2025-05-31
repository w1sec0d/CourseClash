'use client';

import React from 'react';
import Link from 'next/link';

const AuthenticatedMenu: React.FC = () => {
  return (
    <>
      {/* <Link
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
      </Link> */}
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
    </>
  );
};

export default AuthenticatedMenu;
