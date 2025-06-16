'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import CourseHeader from '../components/CourseHeader';
import { AnunciosTab, MaterialesTab, TareasTab, DuelosTab, RankingTab, EstadisticasTab, LogrosTab } from '../components/tabs';

// Simulación de contexto de usuario - en producción vendría del contexto de autenticación
const mockUser = {
  id: '4', // Usuario ID 4 que tiene permisos en todos los cursos
  role: 'teacher' as 'student' | 'teacher',
  name: 'Usuario con Permisos Especiales'
};

// Simulación de permisos por curso - en producción vendría de la API
const getCoursePermissions = (userId: string, courseId: string) => {
  // Usuario ID 4 tiene permisos especiales en TODOS los cursos
  const superAdminUsers = ['4'];
  
  // Permisos específicos por curso para otros usuarios
  const coursePermissions: Record<string, string[]> = {
    // Curso 1: Profesores específicos
    '1': ['1', '2'],
    // Curso 2: Diferentes profesores
    '2': ['3', '5'],
    // Curso 3: Más profesores
    '3': ['1', '6'],
    // Curso 4: Otros profesores
    '4': ['2', '7'],
    // Curso 5: Más profesores
    '5': ['8', '9']
  };

  // Verificar si es super admin (usuario ID 4)
  const isSuperAdmin = superAdminUsers.includes(userId);
  
  // Verificar permisos específicos del curso
  const authorizedUsers = coursePermissions[courseId] || [];
  const hasSpecificPermission = authorizedUsers.includes(userId);
  
  // El usuario tiene permisos si es super admin O tiene permisos específicos del curso
  const hasPermissions = isSuperAdmin || hasSpecificPermission;
  
  return {
    canPublish: hasPermissions,
    canEdit: hasPermissions,
    canDelete: hasPermissions,
    canViewSubmissions: hasPermissions,
    isSuperAdmin: isSuperAdmin
  };
};

export default function CursoPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  const [user] = useState(mockUser);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Obtener permisos específicos del curso para el usuario actual
  const userPermissions = getCoursePermissions(user.id, courseId);
  
  // Debug: Mostrar información de permisos en la consola (remover en producción)
  console.log(`Usuario ${user.id} en curso ${courseId}:`, userPermissions);

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

  // En un caso real, obtendríamos los datos del curso desde la API
  const mockCourseData = {
    id: courseId,
    title: `Curso ${courseId}`,
    description: 'Descripción del curso de ejemplo',
    instructor: 'Profesor Ejemplo',
    students: 25,
    activities: 12,
    progress: 65,
    status: 'active',
    semester: '2023-1',
    shields: 8,
    totalShields: 12,
    coins: 500,
    ranking: '3º Lugar'
  };

  // Sample data for the post feed (anuncios)
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

  // Datos de tareas/actividades específicas
  const [tareas] = useState([
    {
      id: '1',
      title: 'Primer Programa en Python',
      description: 'Desarrolla tu primer programa utilizando Python',
      dueDate: '2024-01-20',
      status: 'pending',
      type: 'tarea',
      submissions: 15,
      totalStudents: mockCourseData.students
    },
    {
      id: '2', 
      title: 'Quiz: Variables y Tipos de Datos',
      description: 'Examen sobre conceptos básicos de programación',
      dueDate: '2024-01-15',
      status: 'completed',
      type: 'quiz',
      submissions: 23,
      totalStudents: mockCourseData.students
    },
    {
      id: '3',
      title: 'Proyecto Final - Sistema Web',
      description: 'Desarrollo de una aplicación web completa',
      dueDate: '2024-02-15',
      status: 'pending',
      type: 'proyecto',
      submissions: 3,
      totalStudents: mockCourseData.students
    }
  ]);

  type TabId = 'Anuncios' | 'Materiales' | 'Tareas' | 'Duelos' | 'Ranking' | 'Estadísticas' | 'Logros';
  const [activeTab, setActiveTab] = useState<TabId>('Anuncios');

  // Función personalizada para manejar cambio de pestañas con lógica específica de actividades
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as TabId);
  };

  // Función para crear nueva actividad (solo profesores)
  const handleCreateActivity = () => {
    router.push(`/curso/${courseId}/actividades/crear`);
  };

  // Función para ver todas las actividades
  const handleViewActivities = () => {
    router.push(`/curso/${courseId}/actividades`);
  };

  // Función para ver actividad específica
  const handleViewActivity = (activityId: string) => {
    router.push(`/curso/${courseId}/actividades/${activityId}`);
  };

  return (
    <div>
      <div className='mx-auto md:p-6 container p-4 relative'>
        <div className='mb-6'>
          {/* Breadcrumb */}
          <nav className="mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="hover:text-blue-600"
                >
                  Dashboard
                </button>
              </li>
              <li className="flex items-center">
                <svg className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <button
                  onClick={() => router.push('/dashboard/cursos')}
                  className="hover:text-blue-600"
                >
                  Cursos
                </button>
              </li>
              <li className="flex items-center">
                <svg className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-900 font-medium">{mockCourseData.title}</span>
              </li>
            </ol>
          </nav>

          <CourseHeader
            title={mockCourseData.title}
            bannerImage="https://placehold.co/1200x300/gray/white?text=Curso+Espec%C3%ADfico"
            ranking={mockCourseData.ranking}
            progress={mockCourseData.progress}
            semester={mockCourseData.semester}
            shields={mockCourseData.shields}
            totalShields={mockCourseData.totalShields}
            coins={mockCourseData.coins}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            tabs={[
              { id: 'Anuncios', label: 'Anuncios' },
              { id: 'Materiales', label: 'Materiales' },
              { id: 'Tareas', label: `Tareas (${tareas.length})` },
              { id: 'Duelos', label: 'Duelos' },
              { id: 'Ranking', label: 'Ranking' },
              { id: 'Estadísticas', label: 'Estadísticas' },
              { id: 'Logros', label: 'Logros' }
            ]}
            tabColor="indigo"
            textColor="gray-50"
          />

          {/* Acciones específicas para el curso - basado en permisos específicos */}
          {userPermissions.canPublish && (
            <div className="mt-6">
              {/* Indicador de permisos especiales */}
              {userPermissions.isSuperAdmin && (
                <div className="mb-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  👑 Permisos de administrador en todos los cursos
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={handleCreateActivity}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Nueva Actividad
                </button>
                <button
                  onClick={handleViewActivities}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Gestionar Actividades
                </button>
              </div>
            </div>
          )}
          
          {/* Contenido dinámico según la pestaña seleccionada */}
          <div className="mt-6">
            {activeTab === 'Anuncios' && <AnunciosTab posts={posts} />}
            {activeTab === 'Materiales' && <MaterialesTab materials={[]} />}
            {activeTab === 'Tareas' && (
              <div className="space-y-6">
                {/* Progreso del curso (solo para estudiantes - usuarios sin permisos de publicación) */}
                {!userPermissions.canPublish && (
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Tu Progreso</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progreso general</span>
                          <span>{mockCourseData.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${mockCourseData.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {tareas.filter(t => t.status === 'completed').length}
                          </div>
                          <div className="text-sm text-gray-600">Completadas</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-orange-600">
                            {tareas.filter(t => t.status === 'pending').length}
                          </div>
                          <div className="text-sm text-gray-600">Pendientes</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-red-600">
                            {tareas.filter(t => t.status === 'overdue').length}
                          </div>
                          <div className="text-sm text-gray-600">Vencidas</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lista de actividades/tareas */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Actividades del Curso
                    </h3>
                    <button
                      onClick={handleViewActivities}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Ver todas →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {tareas.map((tarea) => (
                      <div 
                        key={tarea.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                        onClick={() => handleViewActivity(tarea.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                            tarea.type === 'tarea' ? 'bg-blue-100 text-blue-600' :
                            tarea.type === 'quiz' ? 'bg-green-100 text-green-600' :
                            'bg-purple-100 text-purple-600'
                          }`}>
                            {tarea.type === 'tarea' ? '📝' : 
                             tarea.type === 'quiz' ? '❓' : '📋'}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{tarea.title}</h4>
                            <p className="text-xs text-gray-600">
                              {tarea.type.charAt(0).toUpperCase() + tarea.type.slice(1)} • 
                              Vence el {new Date(tarea.dueDate).toLocaleDateString()}
                            </p>
                            {userPermissions.canViewSubmissions && (
                              <p className="text-xs text-gray-500">
                                Entregas: {tarea.submissions}/{tarea.totalStudents}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          tarea.status === 'completed' ? 'text-green-600 bg-green-100' :
                          tarea.status === 'pending' ? 'text-orange-600 bg-orange-100' :
                          'text-red-600 bg-red-100'
                        }`}>
                          {tarea.status === 'completed' ? 'Completado' :
                           tarea.status === 'pending' ? 'Pendiente' : 'Vencido'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Información adicional */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Curso</h3>
                  <div className="prose max-w-none text-gray-700">
                    <p>{mockCourseData.description}</p>
                    <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        {mockCourseData.students} estudiantes
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        {mockCourseData.activities} actividades
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          mockCourseData.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {mockCourseData.status === 'active' ? '🟢 Activo' : '⚪ Inactivo'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'Duelos' && <DuelosTab duelos={[]} />}
            {activeTab === 'Ranking' && <RankingTab usuarios={[]} />}
            {activeTab === 'Estadísticas' && <EstadisticasTab />}
            {activeTab === 'Logros' && <LogrosTab />}
          </div>
        </div>
      </div>
    </div>
  );
} 