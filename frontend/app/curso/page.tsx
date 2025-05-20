'use client';

import { useState, useEffect } from 'react';
import CourseNavbar from './components/CourseNavbar';
import Sidebar from './components/Sidebar';
import SidebarOverlay from './components/SidebarOverlay';
import Post from './components/Post';
import CreatePostForm from './components/CreatePostForm';
import SidebarImportantFiles from './components/SidebarImportantFiles';
import CourseHeader from './components/CourseHeader';
import { AnunciosTab, MaterialesTab, TareasTab, DuelosTab, RankingTab, EstadisticasTab, LogrosTab } from './components/tabs';

export default function Curso() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const sidebarToggle = document.getElementById('sidebarToggle');
      const target = event.target as HTMLElement;

      if (
        isSidebarOpen &&
        !sidebar?.contains(target) &&
        !sidebarToggle?.contains(target) &&
        window.innerWidth < 1024
      ) {
        setIsSidebarOpen(false);
      }
    };

    // Handle window resize
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Set initial state based on screen size
    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, [isSidebarOpen]);

  // Sample data for important files
  const importantFiles = [
    {
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Sílabo del Curso',
      details: 'Actualizado el 15/03/2023',
    },
    {
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Cronograma de Clases',
      details: 'Actualizado el 10/03/2023',
    },
  ];

  // Sample data for the post feed
  const [posts] = useState([
    {
      id: 1,
      author: {
        name: 'Prof. Ana García',
        role: 'Docente',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
      timeAgo: '2h',
      content: '¡Hola a todos! Les recuerdo que la tarea 1 debe ser entregada el próximo lunes. No olviden revisar los materiales de estudio en la sección de archivos.',
      likes: 12,
      comments: 5,
      isLiked: false,
    },
    {
      id: 2,
      author: {
        name: 'Carlos Mendoza',
        role: 'Estudiante',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      },
      timeAgo: '5h',
      content: '¿Alguien podría ayudarme con el ejercicio 3 de la guía de trabajo? No entiendo bien cómo plantear la solución.',
      likes: 8,
      comments: 3,
      isLiked: true,
    },
  ]);

  type TabId = 'Anuncios' | 'Materiales' | 'Tareas' | 'Duelos' | 'Ranking' | 'Estadísticas' | 'Logros';
  const [activeTab, setActiveTab] = useState<TabId>('Anuncios');

  return (
    <div>
      <CourseNavbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <SidebarOverlay isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <section className='pt-16 lg:pl-64'>
        


        <div className='mx-auto md:p-6 container p-4 relative'>
          <div className='mb-6'>
            <CourseHeader
              title="Matemáticas Avanzadas"
              bannerImage="https://placehold.co/1200x300/gray/white?text=Matem%C3%A1ticas+Avanzadas"
              ranking="3º Lugar"
              progress={65}
              level="Intermedio"
              shields={8}
              totalShields={12}
              coins={500}
              power={3}
              activeTab={activeTab}
              onTabChange={(tabId) => setActiveTab(tabId as TabId)}
              tabs={[
                { id: 'Anuncios', label: 'Anuncios' },
                { id: 'Materiales', label: 'Materiales' },
                { id: 'Tareas', label: 'Tareas' },
                { id: 'Duelos', label: 'Duelos' },
                { id: 'Ranking', label: 'Ranking' },
                { id: 'Estadísticas', label: 'Estadísticas' },
                { id: 'Logros', label: 'Logros' }
              ]}
              tabColor="yellow"
              textColor="gray-50"
            />
            <SidebarImportantFiles files={importantFiles} />
            
            {/* Contenido dinámico según la pestaña seleccionada */}
            <div className="mt-6">
              {activeTab === 'Anuncios' && <AnunciosTab posts={posts} />}
              {activeTab === 'Materiales' && <MaterialesTab materials={[]} />}
              {activeTab === 'Tareas' && <TareasTab tareas={[]} />}
              {activeTab === 'Duelos' && <DuelosTab duelos={[]} />}
              {activeTab === 'Ranking' && <RankingTab usuarios={[]} />}
              {activeTab === 'Estadísticas' && <EstadisticasTab />}
              {activeTab === 'Logros' && <LogrosTab />}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
