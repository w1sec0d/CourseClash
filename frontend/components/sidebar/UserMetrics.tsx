'use client';

import React from 'react';

const UserMetrics: React.FC = () => {
  return (
    <>
      {/* Monedas */}
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
          {/* TODO: Implementar monedas */}
          <span className='font-medium'>{500} Monedas</span>
        </div>
      </div>
      
      {/* Notificaciones */}
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
            {/* TODO: Implementar notificaciones */}
            {3}
          </span>
        </button>
      </div>
    </>
  );
};

export default UserMetrics;
