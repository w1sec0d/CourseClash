'use client';
import React from 'react';
import { useAuth } from '@/lib/auth-context';

// Componentes modularizados del sidebar
import UserProfile from './sidebar/UserProfile';
import UserMetrics from './sidebar/UserMetrics';
import CommonMenu from './sidebar/CommonMenu';
import AuthenticatedMenu from './sidebar/AuthenticatedMenu';
import CourseList from './sidebar/CourseList';

const Sidebar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  
  // Función para cerrar el sidebar en móvil
  const closeSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth < 1024) { // lg breakpoint en Tailwind
      sidebar?.classList.remove('translate-x-0');
      sidebar?.classList.add('-translate-x-full');
    }
  };
  
  return (
    <div
      className="h-full w-64 bg-white shadow-lg lg:translate-x-0 fixed left-0 top-16 border-r border-gray-200 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 z-40"
      id='sidebar'
    >
      <div className='p-4'>
        {/* Sección de perfil */}
        <UserProfile user={user} onLogout={logout} />

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
      </div>
    </div>
  );
};

export default Sidebar;
