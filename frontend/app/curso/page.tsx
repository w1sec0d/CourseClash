'use client';

import { useState, useEffect } from 'react';
import CourseNavbar from './components/CourseNavbar';
import Sidebar from './components/Sidebar';
import SidebarOverlay from './components/SidebarOverlay';
import Post from './components/Post';
import CreatePostForm from './components/CreatePostForm';
import ImportantFilesSection from './components/ImportantFiles';

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

  return (
    <div>
      <CourseNavbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <SidebarOverlay isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <section className='pt-16 lg:pl-64'>
        <div className='mx-auto md:p-6 container p-4'>
          <div className='mb-6'>
            <div className='justify-between items-center mb-4 flex'>
              <h1 className='text-2xl font-bold text-emerald-800'>
                Matemáticas Avanzadas
              </h1>
              <div className='items-center flex space-x-2'>
                <span className='text-sm text-gray-500'>
                  Ranking del curso:
                </span>
                <div className='items-center bg-amber-100 text-amber-800 px-2 py-1 flex rounded'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 mr-1'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z' />
                  </svg>
                  <span className='font-medium'>3º Lugar</span>
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
