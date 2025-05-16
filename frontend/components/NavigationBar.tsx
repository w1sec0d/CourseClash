'use client';
import * as React from 'react';
import Link from 'next/link';
import { useState } from 'react';

export const NavigationBar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className='bg-emerald-700 shadow-lg sticky top-0 z-50'>
      <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
        <div className='items-center justify-between h-16 flex'>
          <div className='items-center flex'>
            <div className='flex-shrink-0'>
              {/* <Image
                alt='Logo de Course Clash - Espada insertada en un birrete de graduación'
                src='https://placehold.co/200x80/emerald/white?text=Course+Clash'
                className='h-12 w-auto'
                width={200}
                height={80}
              /> */}
            </div>
            <div className='md:block hidden'>
              <div className='ml-10 items-baseline flex space-x-4'>
                <Link
                  href='/#inicio'
                  className='text-white px-3 py-2 rounded-md text-sm font-medium
                hover:bg-emerald-600'
                >
                  Inicio
                </Link>
                <Link
                  href='/#caracteristicas'
                  className='text-white px-3 py-2 rounded-md text-sm font-medium
                hover:bg-emerald-600'
                >
                  Características
                </Link>
                <Link
                  href='/duelos'
                  className='text-white px-3 py-2 rounded-md text-sm font-medium
                hover:bg-emerald-600'
                >
                  Duelos
                </Link>
                <Link
                  href='/precios'
                  className='text-white px-3 py-2 rounded-md text-sm font-medium
                hover:bg-emerald-600'
                >
                  Precios
                </Link>
              </div>
            </div>
          </div>
          <div className='md:block hidden'>
            <div className='ml-4 items-center md:ml-6 flex space-x-3'>
              <Link
                href='/login'
                className='bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium
              hover:bg-emerald-400 transition-colors duration-300'
              >
                Iniciar Sesión
              </Link>
              <Link
                href='/registro'
                className='bg-white text-emerald-700 px-4 py-2 rounded-md text-sm font-medium
              hover:bg-gray-100 border border-emerald-700 transition-colors duration-300'
              >
                Registrarse
              </Link>
            </div>
          </div>
          <div className='md:hidden -mr-2 flex'>
            <button
              type='button'
              onClick={toggleMobileMenu}
              className='inline-flex p-2 hover:bg-emerald-500 focus:outline-none bg-emerald-600
            items-center justify-center rounded-md text-white'
            >
              <svg
                className='h-6 w-6'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
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
      {mobileMenuOpen && (
        <div className='md:hidden bg-emerald-700'>
          <div className='px-2 pt-2 pb-3 sm:px-3 space-y-1'>
            <Link
              href='/#inicio'
              className='text-white px-3 py-2 rounded-md text-base font-medium
          hover:bg-emerald-600 block'
            >
              Inicio
            </Link>
            <Link
              href='/#caracteristicas'
              className='text-white px-3 py-2 rounded-md text-base font-medium
          hover:bg-emerald-600 block'
            >
              Características
            </Link>
            <Link
              href='/duelos'
              className='text-white px-3 py-2 rounded-md text-base font-medium
          hover:bg-emerald-600 block'
            >
              Duelos
            </Link>
            <Link
              href='/precios'
              className='text-white px-3 py-2 rounded-md text-base font-medium
          hover:bg-emerald-600 block'
            >
              Precios
            </Link>
          </div>
          <div className='pt-4 pb-3 border-t border-emerald-600'>
            <div className='items-center px-5 flex space-x-3'>
              <Link
                href='/login'
                className='bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium
            w-full text-center hover:bg-emerald-400'
              >
                Iniciar Sesión
              </Link>
            </div>
            <div className='mt-3 px-5'>
              <Link
                href='/registro'
                className='bg-white text-emerald-700 px-4 py-2 rounded-md text-sm font-medium
            w-full text-center hover:bg-gray-100 border border-emerald-700 block'
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
