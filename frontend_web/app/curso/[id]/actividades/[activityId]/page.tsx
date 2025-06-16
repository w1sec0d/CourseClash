'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import ActivityView from '@/components/activities/ActivityView';

// Simulación de contexto de usuario - en producción vendría del contexto de autenticación
const mockUser = {
  id: '4', // Usuario ID 4 que tiene permisos especiales
  role: 'teacher' as 'student' | 'teacher',
  name: 'Usuario con Permisos Especiales'
};

// Simulación de permisos por curso
const getCoursePermissions = (userId: string, courseId: string) => {
  const superAdminUsers = ['4'];
  const coursePermissions: Record<string, string[]> = {
    '1': ['1', '2'],
    '2': ['3', '5'], 
    '3': ['1', '6'],
    '4': ['2', '7'],
    '5': ['8', '9']
  };

  const isSuperAdmin = superAdminUsers.includes(userId);
  const authorizedUsers = coursePermissions[courseId] || [];
  const hasSpecificPermission = authorizedUsers.includes(userId);
  const hasPermissions = isSuperAdmin || hasSpecificPermission;
  
  return {
    canEdit: hasPermissions,
    canPublish: hasPermissions,
    canDelete: hasPermissions,
    canViewSubmissions: hasPermissions,
    isSuperAdmin: isSuperAdmin
  };
};

export default function ActividadPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const activityId = params.activityId as string;
  
  // En producción, estos datos vendrían del contexto de autenticación
  const [user] = useState(mockUser);

  // Obtener permisos específicos del curso para el usuario actual
  const userPermissions = getCoursePermissions(user.id, courseId);

  const handleBackToCourse = () => {
    router.push(`/curso/${courseId}`);
  };

  const handleEditActivity = () => {
    router.push(`/curso/${courseId}/actividades/${activityId}/editar`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header de navegación */}
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
                <span className="text-gray-900 font-medium">Actividad</span>
              </li>
            </ol>
          </nav>

          {/* Botón de regreso */}
          <button
            onClick={handleBackToCourse}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al curso
          </button>
        </div>

        {/* Vista de la actividad */}
        <ActivityView
          activityId={activityId}
          userId={user.id}
          userRole={user.role}
        />

        {/* Acciones adicionales para docentes */}
        {userPermissions.canEdit && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Acciones del Docente
              </h3>
              {userPermissions.isSuperAdmin && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  👑 Admin
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleEditActivity}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                ✏️ Editar Actividad
              </button>
              
              {userPermissions.canViewSubmissions && (
                <button
                  onClick={() => {
                    // Implementar vista de entregas
                    router.push(`/curso/${courseId}/actividades/${activityId}/entregas`);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  📋 Ver Entregas
                </button>
              )}
              
              <button
                onClick={() => {
                  // Implementar estadísticas
                  console.log('Ver estadísticas');
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                📊 Estadísticas
              </button>
              
              {userPermissions.canDelete && (
                <button
                  onClick={() => {
                    // Implementar eliminación con confirmación
                    if (confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
                      console.log('Eliminar actividad');
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  🗑️ Eliminar
                </button>
              )}
            </div>
          </div>
        )}

        {/* Información adicional para estudiantes */}
        {!userPermissions.canEdit && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="text-blue-600 text-2xl">💡</div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Consejos para tu entrega
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Lee cuidadosamente las instrucciones antes de comenzar</li>
                    <li>Revisa tu trabajo antes de enviarlo</li>
                    <li>Si tienes dudas, puedes contactar al profesor</li>
                    <li>Asegúrate de enviar tu trabajo antes de la fecha límite</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 