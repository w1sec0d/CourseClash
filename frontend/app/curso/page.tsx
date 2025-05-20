'use client';

import { useState, useEffect } from 'react';
import CourseNavbar from './components/CourseNavbar';
import Sidebar from './components/Sidebar';
import SidebarOverlay from './components/SidebarOverlay';
import Post from './components/Post';
import CreatePostForm from './components/CreatePostForm';
import ImportantFilesSection from './components/ImportantFiles';
import TabNavigation from '@/components/TabNavigation';

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

  type TabId = 'Anuncios' | 'Materiales' | 'Tareas' | 'Duelos' | 'Ranking' | 'Estadísticas';
  const [activeTab, setActiveTab] = useState<TabId>('Anuncios');

  return (
    <div>
      <CourseNavbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <SidebarOverlay isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <section className='pt-16 lg:pl-64'>
        


        <div className='mx-auto md:p-6 container p-4'>
          <div className='mb-6'>
            <div className="bg-green-500 rounded-lg mb-6 overflow-hidden">
              <div className="h-40 bg-gradient-to-r from-blue-600 to-purple-600 relative">
                <img alt="Banner del curso" src="https://placehold.co/1200x300/gray/white?text=Matem%C3%A1ticas+Avanzadas" className="object-cover opacity-60 w-full h-full"></img>
                <div className="absolute inset-0 flex items-end m-3">
                  <p className="text-4xl font-bold text-white drop-shadow-lg">Matemáticas Avanzadas</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-5">
                <div className="justify-between items-center mb-4 flex flex-wrap">
                  <div className="flex flex-wrap gap-5">
                    <div className="bg-emerald-700 rounded-lg p-3 shadow-lg">
                      <div className="text-slate-100 text-sm mb-1">Ranking</div>
                      <div className="items-center flex">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 24 24" id="Windframe_vpfdGyPdR">
                                                  <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"></path>
                                              </svg>
                        <span className="text-xl font-bold text-white">3º Lugar</span>
                      </div>
                    </div>
                    <div className="bg-emerald-700 rounded-lg p-3 shadow-lg">
                      <div className="text-slate-100 text-sm mb-1">Progreso</div>
                      <div className="items-center flex">
                        <div className="w-32 bg-gray-600 rounded-full h-2.5 mr-2">
                          <div style={{ width: '65%' }} className="bg-purple-600 h-2.5 rounded-full"></div>
                        </div>
                        <span className="text-xl font-bold text-white">65%</span>
                      </div>
                    </div>
                    <div className="bg-emerald-700 rounded-lg p-3 shadow-lg">
                      <div className="text-slate-100 text-sm mb-1">Nivel</div>
                      <div className="items-center flex">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" id="Windframe_byfzgzcjg">
                                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                              </svg>
                        <span className="text-xl font-bold text-white">Intermedio</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0 flex gap-2">
                    <div className="bg-emerald-800 rounded-lg items-center p-2 flex">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" id="Windframe_H0gDltI4q">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                          </svg>
                      <span className="ml-1 text-white">8/12</span>
                    </div>
                    <div className="bg-emerald-800 rounded-lg items-center p-2 flex">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" id="Windframe_pJN7xNJ0w">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                          </svg>
                      <span className="ml-1 text-white">500</span>
                    </div>
                    <div className="bg-emerald-800 rounded-lg items-center p-2 flex">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" id="Windframe_AxdSGjqxD">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                          </svg>
                      <span className="ml-1 text-white">3</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className=" ">
                    <TabNavigation 
                       tabs={[
                        { id: 'Anuncios' as TabId, label: 'Anuncios' },
                        { id: 'Materiales' as TabId, label: 'Materiales' },
                        { id: 'Tareas' as TabId, label: 'Tareas' },
                        { id: 'Duelos' as TabId, label: 'Duelos' },
                        { id: 'Ranking' as TabId, label: 'Ranking' },
                        { id: 'Estadísticas' as TabId, label: 'Estadísticas' }
                      ] as const}
                      activeTab={activeTab} 
                      onTabChange={(tabId) => setActiveTab(tabId)}
                      tabColor="purple"
                      text="gray-50" />
                  </div>
                </div>
              </div>
            </div>
            <ImportantFilesSection files={importantFiles} />
            <CreatePostForm />
            <div className='space-y-6'>
              {posts.map((post) => (
                <Post
                  key={post.id}
                  author={post.author.name}
                  authorRole={post.author.role}
                  timeAgo={post.timeAgo}
                  content={post.content}
                  likes={post.likes}
                  comments={post.comments}
                  badge={post.author.role === 'Docente' ? { text: 'Docente', color: 'emerald' } : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
