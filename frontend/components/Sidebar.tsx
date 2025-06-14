'use client';
import React from 'react';
import { useAuthApollo } from '@/lib/auth-context-apollo';
import { useRouter } from 'next/navigation';

// Componentes modularizados del sidebar
import UserProfile from './sidebar/UserProfile';
import UserMetrics from './sidebar/UserMetrics';
import CommonMenu from './sidebar/CommonMenu';
import AuthenticatedMenu from './sidebar/AuthenticatedMenu';
import CourseList from './sidebar/CourseList';
import PublicMenu from './sidebar/PublicMenu';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { user, logout, isAuthenticated } = useAuthApollo();
  const router = useRouter();

  const handleLogout = async (): Promise<boolean> => {
    try {
      console.log('🚪 Sidebar logout attempt with Apollo');
      await logout();
      console.log('✅ Sidebar logout successful with Apollo');
      router.push('/');
      onClose();
      return true;
    } catch (error) {
      console.error('❌ Sidebar logout error:', error);

      // Fallback cleanup
      const { clearAuthTokens } = await import('@/lib/cookie-utils');
      clearAuthTokens();
      console.log('🧹 Cleaned cookies manually after logout error');

      router.push('/');
      onClose();
      return false;
    }
  };

  // Función para cerrar el sidebar en móvil
  // const closeSidebar = () => {
  //   const sidebar = document.getElementById('sidebar');
  //   if (window.innerWidth < 1024) { // lg breakpoint en Tailwind
  //     sidebar?.classList.remove('translate-x-0');
  //     sidebar?.classList.add('-translate-x-full');
  //   }
  // };

  return (
    <div
      className='h-full w-64 bg-white shadow-lg lg:translate-x-0 fixed left-0 top-16 border-r border-gray-200 transform -translate-x-full transition-transform duration-300 z-40'
      id='sidebar'
    >
      <div className='p-4 h-full overflow-y-auto'>
        {isAuthenticated ? (
          <>
            {/* Sección de perfil */}
            <UserProfile user={user} onLogout={handleLogout} />

            {/* Métricas del usuario (monedas, notificaciones) */}
            <UserMetrics />

            {/* Menú de navegación */}
            <div className='space-y-2'>
              {/* Enlaces comunes para todos */}
              <CommonMenu />

              {/* Enlaces solo para usuarios autenticados */}
              <AuthenticatedMenu />
            </div>

            {/* Lista de cursos */}
            <CourseList />
          </>
        ) : (
          <>
            {/* Menú para usuarios no autenticados */}
            <PublicMenu />
            
            {/* Enlaces comunes */}
            <div className='space-y-2'>
              <CommonMenu />
            </div>
            
            {/* Información adicional para usuarios no autenticados */}
            <div className='mt-8 p-4 bg-emerald-50 rounded-lg'>
              <h3 className='text-sm font-semibold text-emerald-800 mb-2'>
                ¿Nuevo en Course Clash?
              </h3>
              <p className='text-xs text-emerald-700 mb-3'>
                Únete a nuestra comunidad y comienza tu aventura académica
              </p>
              <ul className='text-xs text-emerald-600 space-y-1'>
                <li className='flex items-center'>
                  <span className='mr-1'>✓</span> Duelos académicos
                </li>
                <li className='flex items-center'>
                  <span className='mr-1'>✓</span> Insignias y logros
                </li>
                <li className='flex items-center'>
                  <span className='mr-1'>✓</span> Tienda de bonificaciones
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
