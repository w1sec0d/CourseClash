'use client';
import * as React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import clsx from 'clsx';
import {
  HomeIcon,
  SparklesIcon,
  TrophyIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export const NavigationBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout, isInitialized } = useAuth();
  const router = useRouter();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (!isInitialized) {
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
                    href='/'
                    className={clsx(
                      'text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2',
                      'hover:bg-emerald-600'
                    )}
                  >
                    <HomeIcon className='h-5 w-5' />
                    Inicio
                  </Link>
                  <Link
                    href='/#caracteristicas'
                    className={clsx(
                      'text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2',
                      'hover:bg-emerald-600'
                    )}
                  >
                    <SparklesIcon className='h-5 w-5' />
                    Características
                  </Link>
                  <Link
                    href='/duelos'
                    className={clsx(
                      'text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2',
                      'hover:bg-emerald-600'
                    )}
                  >
                    <TrophyIcon className='h-5 w-5' />
                    Duelos
                  </Link>
                </div>
              </div>
            </div>
            <div className='md:block hidden'>
              <div className='ml-4 items-center md:ml-6 flex space-x-3'>
                <div className='h-10 w-32 bg-emerald-600 animate-pulse rounded-md'></div>
              </div>
            </div>
            <div className='md:hidden -mr-2 flex'>
              <button
                type='button'
                onClick={toggleMobileMenu}
                className={clsx(
                  'inline-flex p-2 bg-emerald-600 items-center justify-center rounded-md text-white',
                  'hover:bg-emerald-500 focus:outline-none'
                )}
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
      </nav>
    );
  }

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
                  href='/'
                  className={clsx(
                    'text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2',
                    'hover:bg-emerald-600'
                  )}
                >
                  <HomeIcon className='h-5 w-5' />
                  Inicio
                </Link>
                <Link
                  href='/#caracteristicas'
                  className={clsx(
                    'text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2',
                    'hover:bg-emerald-600'
                  )}
                >
                  <SparklesIcon className='h-5 w-5' />
                  Características
                </Link>
                <Link
                  href='/duelos'
                  className={clsx(
                    'text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2',
                    'hover:bg-emerald-600'
                  )}
                >
                  <TrophyIcon className='h-5 w-5' />
                  Duelos
                </Link>
              </div>
            </div>
          </div>
          <div className='md:block hidden'>
            <div className='ml-4 items-center md:ml-6 flex space-x-3'>
              {!isAuthenticated ? (
                <>
                  <Link
                    href='/login'
                    className={clsx(
                      'bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2',
                      'hover:bg-emerald-400 transition-colors duration-300'
                    )}
                  >
                    <ArrowRightOnRectangleIcon className='h-5 w-5' />
                    Iniciar Sesión
                  </Link>
                  <Link
                    href='/registro'
                    className={clsx(
                      'bg-white text-emerald-700 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2',
                      'hover:bg-gray-100 border border-emerald-700 transition-colors duration-300'
                    )}
                  >
                    <UserPlusIcon className='h-5 w-5' />
                    Registrarse
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className={clsx(
                    'bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2',
                    'hover:bg-emerald-400 transition-colors duration-300 hover:cursor-pointer'
                  )}
                >
                  <ArrowLeftOnRectangleIcon className='h-5 w-5' />
                  Cerrar Sesión
                </button>
              )}
            </div>
          </div>
          <div className='md:hidden -mr-2 flex'>
            <button
              type='button'
              onClick={toggleMobileMenu}
              className={clsx(
                'inline-flex p-2 bg-emerald-600 items-center justify-center rounded-md text-white',
                'hover:bg-emerald-500 focus:outline-none'
              )}
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
              className={clsx(
                'text-white px-3 py-2 rounded-md text-base font-medium flex items-center gap-2',
                'hover:bg-emerald-600'
              )}
            >
              <HomeIcon className='h-5 w-5' />
              Inicio
            </Link>
            <Link
              href='/#caracteristicas'
              className={clsx(
                'text-white px-3 py-2 rounded-md text-base font-medium flex items-center gap-2',
                'hover:bg-emerald-600'
              )}
            >
              <SparklesIcon className='h-5 w-5' />
              Características
            </Link>
            <Link
              href='/duelos'
              className={clsx(
                'text-white px-3 py-2 rounded-md text-base font-medium flex items-center gap-2',
                'hover:bg-emerald-600'
              )}
            >
              <TrophyIcon className='h-5 w-5' />
              Duelos
            </Link>
          </div>
          <div className='pt-4 pb-3 border-t border-emerald-600'>
            {!isAuthenticated ? (
              <>
                <div className='items-center px-5 flex space-x-3'>
                  <Link
                    href='/login'
                    className={clsx(
                      'bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2',
                      'w-full text-center hover:bg-emerald-400'
                    )}
                  >
                    <ArrowRightOnRectangleIcon className='h-5 w-5' />
                    Iniciar Sesión
                  </Link>
                </div>
                <div className='mt-3 px-5'>
                  <Link
                    href='/registro'
                    className={clsx(
                      'bg-white text-emerald-700 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2',
                      'w-full text-center hover:bg-gray-100 border border-emerald-700 block'
                    )}
                  >
                    <UserPlusIcon className='h-5 w-5' />
                    Registrarse
                  </Link>
                </div>
              </>
            ) : (
              <div className='px-5'>
                <button
                  onClick={handleLogout}
                  className={clsx(
                    'bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2',
                    'w-full text-center hover:bg-emerald-400'
                  )}
                >
                  <ArrowLeftOnRectangleIcon className='h-5 w-5' />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
