'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthApollo } from '@/lib/auth-context-apollo';

const CommonMenu: React.FC = () => {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthApollo();
  
  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname?.startsWith('/dashboard')) {
      return true;
    }
    return pathname === path;
  };

  const linkClasses = (path: string) => {
    const baseClasses = 'items-center px-4 py-2 rounded-lg flex space-x-3 transition font-medium';
    const activeClasses = 'bg-emerald-100 text-emerald-800';
    const inactiveClasses = 'hover:bg-emerald-50 text-gray-700 hover:text-emerald-800';
    
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };

  return (
    <>
      {/* Inicio/Dashboard - Visible para todos */}
      <Link
        href={isAuthenticated ? '/dashboard' : '/'}
        className={linkClasses(isAuthenticated ? '/dashboard' : '/')}
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
        <span>{isAuthenticated ? 'Inicio' : 'Página Principal'}</span>
      </Link>
      
      {/* Tienda - Visible para todos */}
      <Link
        href='/tienda'
        className={linkClasses('/tienda')}
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
            d='M16 11V7a4 4 0 00-8 0v4M8 11v4a4 4 0 008 0v-4M5 11h14l-1 7H6l-1-7z'
          ></path>
        </svg>
        <span>Tienda de Bonos</span>
      </Link>
    </>
  );
};

export default CommonMenu;
