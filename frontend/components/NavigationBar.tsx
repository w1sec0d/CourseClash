'use client';
import * as React from 'react';
import { useState } from 'react';

export const NavigationBar: React.FC = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleMobileMenu();
    }
  };

  return (
    <nav className='fixed top-0 p-4 w-full bg-white border-b border-solid border-b-black border-b-opacity-10 shadow-[0_2px_4px_rgba(0,0,0,0.05)] z-[100]'>
      <div className='flex justify-between items-center mx-auto my-0 max-w-[1200px]'>
        <div className='flex gap-2 items-center'>
          <img
            alt='Course Clash Logo'
            src='https://images.pexels.com/photos/14875105/pexels-photo-14875105.jpeg'
            className='object-cover overflow-hidden w-10 h-10 aspect-square'
          />
          <span className='text-2xl font-bold'>Course Clash</span>
        </div>
        <div className='flex gap-8 items-center max-sm:hidden'>
          <a className='no-underline text-zinc-800' href='/inicio'>
            Inicio
          </a>
          <a className='no-underline text-zinc-800' href='/caracteristicas'>
            Características
          </a>
          <a className='no-underline text-zinc-800' href='/duelos'>
            Duelos
          </a>
          <a className='no-underline text-zinc-800' href='/precios'>
            Precios
          </a>
        </div>
        <div className='flex gap-4 items-center'>
          <button
            className='px-4 py-2 text-violet-400 rounded-lg border border-violet-400 border-solid cursor-pointer'
            aria-label='Iniciar Sesión'
            onClick={() => (window.location.href = '/login')}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                window.location.href = '/login';
              }
            }}
          >
            Iniciar Sesión
          </button>
          <button
            className='px-4 py-2 text-black bg-violet-400 rounded-lg cursor-pointer border-[none]'
            aria-label='Registrarse'
            onClick={() => (window.location.href = '/registro')}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                window.location.href = '/registro';
              }
            }}
          >
            Registrarse
          </button>
          <button
            aria-label='Menú móvil'
            aria-controls='mobile-menu'
            className='hidden text-white cursor-pointer border-[none] max-sm:block'
            aria-expanded={showMobileMenu}
            onClick={toggleMobileMenu}
            onKeyDown={handleKeyPress}
          >
            <span className='block mb-1.5 w-6 h-0.5 bg-white transition-[0.3s]' />
            <span className='block mb-1.5 w-6 h-0.5 bg-white transition-[0.3s]' />
            <span className='block w-6 h-0.5 bg-white transition-[0.3s]' />
          </button>
        </div>
      </div>
      {showMobileMenu && (
        <div
          className='absolute inset-x-0 top-full p-4 border-t border-solid bg-neutral-950 border-t-white border-t-opacity-10'
          id='mobile-menu'
        >
          <div className='flex flex-col gap-4'>
            <a
              className='px-4 py-2 text-white no-underline rounded'
              href='/inicio'
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  window.location.href = '/inicio';
                }
              }}
            >
              Inicio
            </a>
            <a
              className='px-4 py-2 text-white no-underline rounded'
              href='/caracteristicas'
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  window.location.href = '/caracteristicas';
                }
              }}
            >
              Características
            </a>
            <a
              className='px-4 py-2 text-white no-underline rounded'
              href='/duelos'
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  window.location.href = '/duelos';
                }
              }}
            >
              Duelos
            </a>
            <a
              className='px-4 py-2 text-white no-underline rounded'
              href='/precios'
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  window.location.href = '/precios';
                }
              }}
            >
              Precios
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
