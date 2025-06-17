'use client';

import React from 'react';
import { useAuthApollo } from '@/lib/auth-context-apollo';
import Footer from './Footer';

// Componente para manejar el sidebar condicionalmente
export function ConditionalSidebar() {
  // Sidebar deshabilitado - toda la información del perfil está ahora en la navbar
  return null;
}

// Componente para manejar el padding condicional
export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen flex-col'>
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
