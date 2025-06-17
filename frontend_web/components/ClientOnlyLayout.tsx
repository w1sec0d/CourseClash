'use client';

import React from 'react';
import { useAuthApollo } from '@/lib/auth-context-apollo';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import SidebarOverlay from './SidebarOverlay';
import clsx from 'clsx';

// Componente para manejar el sidebar condicionalmente
function ConditionalSidebar() {
  const { isAuthenticated } = useAuthApollo();
  const pathname = usePathname();

  // Verificar si la ruta actual debe mostrar el sidebar
  const showSidebar =
    isAuthenticated &&
    (pathname?.startsWith('/curso') ||
      pathname?.startsWith('/cursos') ||
      pathname?.startsWith('/dashboard') ||
      pathname?.startsWith('/perfil'));

  if (!showSidebar) {
    return null;
  }

  return (
    <>
      <aside className='hidden lg:sticky w-64 fixed top-16 left-0 h-[calc(100vh-4rem)] z-40'>
        <Sidebar isOpen={true} onClose={() => {}} />
      </aside>
      <SidebarOverlay />
    </>
  );
}

// Componente para manejar el padding condicional (sin envolver children)
export function ClientOnlyLayout() {
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
    '/test-loading',
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
    </div>
  );
}
