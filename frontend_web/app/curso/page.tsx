'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import CourseHeader from './components/CourseHeader';
import { AnunciosTab, MaterialesTab, TareasTab, DuelosTab, RankingTab, EstadisticasTab, LogrosTab, EnhancedActivitiesTab } from './components/tabs';
import { useCourseApollo } from '@/lib/course-hooks-apollo';
import { useActivitiesApollo } from '@/lib/activities-hooks-apollo';
import { useAuthApollo } from '@/lib/auth-context-apollo';

export default function Curso() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Obtener el ID del curso de los parámetros de búsqueda
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id') || '1'; // Usar curso por defecto si no se especifica
  
  // Hooks para datos
  const { user } = useAuthApollo();
  const { course, loading: courseLoading, error: courseError } = useCourseApollo(courseId);
  const { activities, error: activitiesError } = useActivitiesApollo(courseId);

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

  // Sample data for the post feed (mantener como backup)
  const [posts] = useState([
    {
      id: 1,
      author: {
        name: 'Prof. Ana García',
        role: 'Docente',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
      timeAgo: '2h',
      content:
        '¡Hola a todos! Les recuerdo que la tarea 1 debe ser entregada el próximo lunes. No olviden revisar los materiales de estudio en la sección de archivos.',
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
      content:
        '¿Alguien podría ayudarme con el ejercicio 3 de la guía de trabajo? No entiendo bien cómo plantear la solución.',
      likes: 8,
      comments: 3,
      isLiked: true,
    },
  ]);

  type TabId = 'Anuncios' | 'Materiales' | 'Tareas' | 'Duelos' | 'Ranking' | 'Estadísticas' | 'Logros' | 'TodasActividades';
  const [activeTab, setActiveTab] = useState<TabId>('TodasActividades');

  // Mostrar loading state
  if (courseLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Mostrar error state
  if (courseError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error al cargar el curso</h2>
          <p className="text-gray-600">{courseError}</p>
        </div>
      </div>
    );
  }

  // Si no se encuentra el curso, usar datos por defecto
  const courseData = course || {
    id: '1',
    title: 'Matemáticas Avanzadas',
    description: 'Curso avanzado de matemáticas que incluye cálculo diferencial e integral, álgebra lineal y estadística aplicada.',
    level: 'ADVANCED',
    category: 'MATHEMATICS',
    status: 'ACTIVE'
  };

  // Filtrar actividades por tipo
  const announcements = activities.filter(activity => activity.activityType === 'ANNOUNCEMENT');
  const tasks = activities.filter(activity => activity.activityType === 'TASK');

  // Calcular progreso basado en tareas completadas (simulado)
  const totalTasks = tasks.length || 4;
  const completedTasks = Math.floor(totalTasks * 0.65); // 65% de progreso simulado
  const progress = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div>
        <div className='mx-auto md:p-6 container p-4 relative'>
          <div className='mb-6'>
            <CourseHeader
              title={courseData.title}
              bannerImage="https://placehold.co/1200x300/gray/white?text=Curso"
              ranking="3º Lugar"
              progress={progress}
              semester="2024-1"
              shields={8}
              totalShields={12}
              coins={500}
              activeTab={activeTab}
              onTabChange={(tabId) => setActiveTab(tabId as TabId)}
              tabs={[
                { id: 'TodasActividades', label: 'Todas las Actividades' },
                { id: 'Anuncios', label: 'Anuncios' },
                { id: 'Materiales', label: 'Materiales' },
                { id: 'Tareas', label: 'Tareas' },
                { id: 'Duelos', label: 'Duelos' },
                { id: 'Ranking', label: 'Ranking' },
                { id: 'Estadísticas', label: 'Estadísticas' },
                { id: 'Logros', label: 'Logros' }
              ]}
              tabColor="indigo"
              textColor="gray-50"
            />
            
            {/* Contenido dinámico según la pestaña seleccionada */}
            <div className="mt-6">
              {activeTab === 'TodasActividades' && (
                <EnhancedActivitiesTab 
                  activities={activities}
                  loading={courseLoading}
                  error={activitiesError}
                />
              )}
              {activeTab === 'Anuncios' && (
                <AnunciosTab 
                  posts={announcements.length > 0 ? announcements.map(announcement => ({
                    id: announcement.id,
                    author: {
                      name: 'Prof. Sistema',
                      role: 'Docente',
                      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                    },
                    timeAgo: new Date(announcement.createdAt).toLocaleDateString(),
                    content: announcement.description || announcement.title,
                    likes: 0,
                    comments: announcement.comments?.length || 0,
                    isLiked: false,
                  })) : posts} 
                />
              )}
              {activeTab === 'Materiales' && <MaterialesTab materials={[]} />}
              {activeTab === 'Tareas' && (
                <TareasTab 
                  tareas={tasks.map(task => ({
                    id: task.id,
                    title: task.title,
                    description: task.description || '',
                    dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Sin fecha límite',
                    status: 'pendiente' as const,
                    maxScore: 20
                  }))} 
                />
              )}
              {activeTab === 'Duelos' && <DuelosTab duelos={[]} />}
              {activeTab === 'Ranking' && <RankingTab usuarios={[]} />}
              {activeTab === 'Estadísticas' && <EstadisticasTab />}
              {activeTab === 'Logros' && <LogrosTab />}
            </div>

            {/* Mostrar información de debugging en desarrollo */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-bold mb-2">Debug Info:</h3>
                <p><strong>Course ID:</strong> {courseId}</p>
                <p><strong>Course:</strong> {course?.title || 'Not found'}</p>
                <p><strong>Activities:</strong> {activities.length}</p>
                <p><strong>Announcements:</strong> {announcements.length}</p>
                <p><strong>Tasks:</strong> {tasks.length}</p>
                <p><strong>User:</strong> {user?.username || 'Not logged in'}</p>
                {activitiesError && <p className="text-red-600"><strong>Activities Error:</strong> {activitiesError}</p>}
              </div>
            )}
          </div>
        </div>
    </div>
  );
}
