'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import SidebarOverlay from './SidebarOverlay';
import clsx from 'clsx';
import { Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';

// Componente para manejar el sidebar condicionalmente
export function ConditionalSidebar() {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  
  // Verificar si la ruta actual debe mostrar el sidebar
  const showSidebar = isAuthenticated && (
    pathname?.startsWith('/curso') || 
    pathname?.startsWith('/dashboard') || 
    pathname?.startsWith('/perfil')
  );
  
  if (!showSidebar) {
    return null;
  }
  
  return (
    <>
      <aside className="hidden lg:block w-64 fixed top-16 left-0 h-[calc(100vh-4rem)] z-40">
        <Sidebar />
      </aside>
      <SidebarOverlay />
    </>
  );
}

// Componente para manejar el padding condicional
export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  
  // Verificar si la ruta actual debe mostrar el sidebar
  const showSidebar = isAuthenticated && (
    pathname?.startsWith('/curso') || 
    pathname?.startsWith('/dashboard') || 
    pathname?.startsWith('/perfil')
  );
  
  return (
    <div className={clsx('flex min-h-screen', showSidebar ? 'lg:pl-64' : '')}>
      <ConditionalSidebar />
      <Suspense fallback={<LoadingSpinner />}>
        <main className="w-full">{children}</main>
      </Suspense>
    </div>
  );
}
