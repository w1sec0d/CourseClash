'use client';

import React from 'react';
import { useAuthApollo } from '@/lib/auth-context-apollo';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Componente para manejar el sidebar condicionalmente
function ConditionalSidebar() {
  // Sidebar deshabilitado - toda la información del perfil está ahora en la navbar
  return null;
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
