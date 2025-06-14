'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import ActivityList from '@/components/activities/ActivityList';

// Simulación de contexto de usuario - en producción vendría del contexto de autenticación
const mockUser = {
  id: '4', // Usuario ID 4 que tiene permisos especiales
  role: 'teacher' as 'student' | 'teacher', // Cambiar a 'student' para probar vista de estudiante
  name: 'Usuario con Permisos Especiales'
};

export default function ActividadesPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  // En producción, estos datos vendrían del contexto de autenticación
  const [user] = useState(mockUser);

  const handleCreateActivity = () => {
    router.push(`/curso/${courseId}/actividades/crear`);
  };

  const handleBackToCourse = () => {
    router.push(`/curso/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <nav className="mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <button
                  onClick={handleBackToCourse}
                  className="hover:text-blue-600"
                >
                  Curso {courseId}
                </button>
              </li>
              <li className="flex items-center">
                <svg className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-900 font-medium">Actividades</span>
              </li>
            </ol>
          </nav>

          {/* Título y acciones */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Actividades del Curso
              </h1>
              <p className="mt-2 text-gray-600">
                {user.role === 'teacher' 
                  ? 'Gestiona las actividades de tu curso'
                  : 'Revisa y entrega tus tareas'
                }
              </p>
            </div>

            {/* Botón crear actividad - solo para docentes */}
            {user.role === 'teacher' && (
              <button
                onClick={handleCreateActivity}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nueva Actividad
              </button>
            )}
          </div>
        </div>

        {/* Filtros y estadísticas rápidas */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Estadísticas rápidas */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">Resumen</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total de actividades:</span>
                  <span className="font-medium">12</span>
                </div>
                {user.role === 'student' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Pendientes:</span>
                      <span className="font-medium text-orange-600">3</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Entregadas:</span>
                      <span className="font-medium text-green-600">8</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Vencidas:</span>
                      <span className="font-medium text-red-600">1</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Filtros por tipo */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">Filtrar por tipo</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">📝 Tareas</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">❓ Quizzes</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">📢 Anuncios</span>
                </label>
              </div>
            </div>

            {/* Filtros por estado (solo estudiantes) */}
            {user.role === 'student' && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Filtrar por estado</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">⏳ Pendientes</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">✅ Entregadas</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">⚠️ Vencidas</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lista de actividades */}
        <ActivityList 
          courseId={courseId} 
          userPermissions={{
            canEdit: user.role === 'teacher',
            canPublish: user.role === 'teacher'
          }}
        />

        {/* Botón flotante para crear actividad en móvil (solo docentes) */}
        {user.role === 'teacher' && (
          <button
            onClick={handleCreateActivity}
            className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
} 