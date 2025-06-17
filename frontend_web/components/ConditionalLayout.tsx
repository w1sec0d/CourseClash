'use client';

import React from 'react';
import { useAuthApollo } from '@/lib/auth-context-apollo';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import SidebarOverlay from './SidebarOverlay';
import clsx from 'clsx';

import Footer from './Footer';

// Componente para manejar el sidebar condicionalmente
export function ConditionalSidebar() {
  const { isAuthenticated } = useAuthApollo();
  const pathname = usePathname();

  // Verificar si la ruta actual debe mostrar el sidebar
  const showSidebar =
    isAuthenticated &&
    (pathname?.startsWith('/curso') ||
      pathname?.startsWith('/dashboard') ||
      pathname?.startsWith('/perfil'));

  if (!showSidebar) {
    return null;
  }

  return (
    <>
      <aside className='hidden lg:block w-64 fixed top-16 left-0 h-[calc(100vh-4rem)] z-40'>
        <Sidebar isOpen={true} onClose={() => {}} />
      </aside>
      <SidebarOverlay />
    </>
  );
}

// Componente para manejar el padding condicional
export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthApollo();
  const pathname = usePathname();

  // Lista de rutas que NO deben mostrar el sidebar
  const routesWithoutSidebar = [
    '/',
    '/login',
    '/registro',
    '/login-apollo',
    '/ejemplo-ssr',
    '/reset-password',
    '/duelos',
    '/duelos-ssr',
  ];

  const shouldShowSidebar =
    isAuthenticated && !routesWithoutSidebar.includes(pathname || '');

  return (
    <div
      className={clsx(
        'flex min-h-screen flex-col',
        shouldShowSidebar ? 'lg:pl-64' : ''
      )}
    >
      <ConditionalSidebar />
      <main className='w-full'>{children}</main>
      <Footer />
    </div>
  );
}

function LoadingOverlay() {
  const { isAuthenticated } = useAuthApollo();
  return isAuthenticated ? (
    <div className='fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto'></div>
        <p className='mt-4 text-lg text-gray-600'>Cargando...</p>
      </div>
    </div>
  ) : null;
}

export { LoadingOverlay };
