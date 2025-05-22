'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { usePathname } from 'next/navigation';

const SidebarOverlay: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Verificar si debe mostrar el sidebar basado en la ruta y autenticación
  const shouldShowSidebar = isAuthenticated && (
    pathname?.startsWith('/curso') || 
    pathname?.startsWith('/dashboard') || 
    pathname?.startsWith('/perfil')
  );
  
  // Escuchar eventos de apertura/cierre del sidebar
  useEffect(() => {
    const sidebar = document.getElementById('sidebar');
    const handleToggleSidebar = () => {
      // Comprobar si el sidebar tiene la clase de traducción
      const isOpen = sidebar?.classList.contains('translate-x-0');
      setIsSidebarOpen(!!isOpen);
    };
    
    // Verificar el estado inicial
    handleToggleSidebar();
    
    // Establecer un observador de mutación para detectar cambios en las clases
    if (sidebar) {
      const observer = new MutationObserver(handleToggleSidebar);
      observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
      
      return () => observer.disconnect();
    }
  }, []);
  
  // No mostrar nada si no se debe mostrar el sidebar
  if (!shouldShowSidebar) {
    return null;
  }
  
  return (
    <div
      className={`bg-black lg:hidden fixed inset-0 bg-opacity-50 z-30 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      id="sidebarOverlay"
      aria-hidden={!isSidebarOpen}
      onClick={() => {
        // Cerrar el sidebar al hacer clic en el overlay
        const sidebar = document.getElementById('sidebar');
        sidebar?.classList.remove('translate-x-0');
        sidebar?.classList.add('-translate-x-full');
        setIsSidebarOpen(false);
      }}
    ></div>
  );
};

export default SidebarOverlay;
