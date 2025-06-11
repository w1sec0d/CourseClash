'use client';

import React from 'react';
import Link from 'next/link';

const CommonMenu: React.FC = () => {
  return (
    <>
      {/* Inicio - Visible para todos */}
      <Link
        href='/dashboard'
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
      
      {/* Tienda - Visible para todos */}
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
    </>
  );
};

export default CommonMenu;
