'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';

// Componentes modularizados del sidebar
import UserProfile from './sidebar/UserProfile';
import UserMetrics from './sidebar/UserMetrics';
import PublicMenu from './sidebar/PublicMenu';
import CommonMenu from './sidebar/CommonMenu';
import AuthenticatedMenu from './sidebar/AuthenticatedMenu';
import CourseList from './sidebar/CourseList';

const Sidebar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <div
      className="h-full w-64 bg-white shadow-lg lg:translate-x-0 fixed left-0 top-16 border-r border-gray-200 transform translate-x-0 transition-transform duration-300 z-40"
      id='sidebar'
    >
      <div className='p-4'>
        {/* Sección de perfil */}
        {isAuthenticated ? (
          <UserProfile user={user} onLogout={logout} />
        ) : (
          <PublicMenu />
        )}

        {/* Métricas del usuario (monedas, notificaciones) */}
        {isAuthenticated && <UserMetrics />}
        
        {/* Menú de navegación */}
        <div className='space-y-2'>
          {/* Enlaces comunes para todos */}
          <CommonMenu />
          
          {/* Enlaces solo para usuarios autenticados */}
          {isAuthenticated && <AuthenticatedMenu />}
        </div>
        
        {/* Lista de cursos - Solo para usuarios autenticados */}
        {isAuthenticated && <CourseList />}
      </div>
    </div>
  );
};

export default Sidebar;
