'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCourse } from '@/lib/hooks/useCourses';

// Simulación de contexto de usuario - en producción vendría del contexto de autenticación
const mockUser = {
  id: '123',
  role: 'teacher' as 'student' | 'teacher',
  name: 'Usuario de Prueba'
};

export default function CursoPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  const [user] = useState(mockUser);
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'participants'>('overview');

  // En un caso real, obtendríamos los datos del curso desde la API
  const mockCourseData = {
    id: courseId,
    title: `Curso ${courseId}`,
    description: 'Descripción del curso de ejemplo',
    instructor: 'Profesor Ejemplo',
    students: 25,
    activities: 12,
    progress: 65,
    status: 'active'
  };

  const handleTabChange = (tab: 'overview' | 'activities' | 'participants') => {
    if (tab === 'activities') {
      router.push(`/curso/${courseId}/actividades`);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del curso */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

          {/* Información del curso */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {courseId}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{mockCourseData.title}</h1>
                  <p className="text-gray-600">Por {mockCourseData.instructor}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{mockCourseData.description}</p>
              
              {/* Estadísticas */}
              <div className="flex items-center space-x-6 text-sm text-gray-600">
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

            {/* Acciones */}
            <div className="flex space-x-3">
              {user.role === 'teacher' && (
                <button
                  onClick={() => router.push(`/curso/${courseId}/actividades/crear`)}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Nueva Actividad
                </button>
              )}
              <button
                onClick={() => router.push(`/curso/${courseId}/actividades`)}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Ver Actividades
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación por pestañas */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => handleTabChange('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 Resumen
            </button>
            <button
              onClick={() => handleTabChange('activities')}
              className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
            >
              📝 Actividades ({mockCourseData.activities})
            </button>
            <button
              onClick={() => handleTabChange('participants')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'participants'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              👥 Participantes ({mockCourseData.students})
            </button>
          </nav>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Progreso del curso (solo para estudiantes) */}
            {user.role === 'student' && (
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
                      <div className="text-2xl font-bold text-green-600">8</div>
                      <div className="text-sm text-gray-600">Completadas</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">3</div>
                      <div className="text-sm text-gray-600">Pendientes</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">1</div>
                      <div className="text-sm text-gray-600">Vencidas</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actividades recientes */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Actividades Recientes</h3>
                <button
                  onClick={() => router.push(`/curso/${courseId}/actividades`)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Ver todas →
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-medium">
                      📝
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Primer Programa en Python</h4>
                      <p className="text-xs text-gray-600">Tarea • Vence el 20 de enero</p>
                    </div>
                  </div>
                  <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                    Pendiente
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-sm font-medium">
                      ❓
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Quiz: Variables y Tipos de Datos</h4>
                      <p className="text-xs text-gray-600">Quiz • Vence el 15 de enero</p>
                    </div>
                  </div>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Completado
                  </span>
                </div>
              </div>
            </div>

            {/* Información del curso */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Curso</h3>
              <div className="prose max-w-none text-gray-700">
                <p>
                  Este es un curso de ejemplo que contiene actividades de muestra para probar 
                  las funcionalidades del sistema. Puedes navegar a la sección de actividades 
                  para ver las tareas, quizzes y anuncios disponibles.
                </p>
                <p>
                  Como {user.role === 'teacher' ? 'profesor' : 'estudiante'}, tienes acceso a 
                  {user.role === 'teacher' 
                    ? ' crear nuevas actividades, gestionar el contenido del curso y revisar las entregas de los estudiantes.'
                    : ' ver las actividades asignadas, entregar tareas y participar en quizzes.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'participants' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Participantes del Curso</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    P
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Profesor Ejemplo</h4>
                    <p className="text-xs text-gray-600">Instructor</p>
                  </div>
                </div>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  Profesor
                </span>
              </div>
              <div className="text-center py-8 text-gray-500">
                <p>Lista de estudiantes disponible próximamente...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 