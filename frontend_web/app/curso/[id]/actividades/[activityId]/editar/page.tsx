'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useActivitiesByCourse } from '@/lib/hooks/useActivities';

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
    isSuperAdmin: isSuperAdmin
  };
};

export default function EditarActividadPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const activityId = params.activityId as string;
  
  const [user] = useState(mockUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Obtener permisos del usuario
  const userPermissions = getCoursePermissions(user.id, courseId);
  
  // Cargar actividades para obtener los datos de la actividad específica
  const { activities, loading: activitiesLoading } = useActivitiesByCourse(courseId);
  const currentActivity = activities.find((a: { 
    id: string; 
    title: string; 
    description?: string; 
    activityType: string; 
    dueDate?: string;
    instructions?: string;
    maxScore?: number;
    allowLateSubmissions?: boolean;
    isVisible?: boolean;
  }) => a.id === activityId);

  // Formulario de edición
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    activityType: 'task',
    dueDate: '',
    instructions: '',
    maxScore: 100,
    allowLateSubmissions: true,
    isVisible: true
  });

  // Cargar datos de la actividad cuando se encuentra
  useEffect(() => {
    if (currentActivity) {
      setFormData({
        title: currentActivity.title || '',
        description: currentActivity.description || '',
        activityType: currentActivity.activityType || 'task',
        dueDate: currentActivity.dueDate ? new Date(currentActivity.dueDate).toISOString().split('T')[0] : '',
        instructions: currentActivity.instructions || '',
        maxScore: currentActivity.maxScore || 100,
        allowLateSubmissions: currentActivity.allowLateSubmissions ?? true,
        isVisible: currentActivity.isVisible ?? true
      });
    }
  }, [currentActivity]);

  // Verificar permisos
  if (!userPermissions.canEdit) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Acceso denegado</h3>
                <p className="mt-1 text-sm text-red-700">
                  No tienes permisos para editar actividades en este curso.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Aquí iría la lógica para actualizar la actividad
      console.log('Actualizando actividad:', formData);
      
      // Simular actualización
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirigir a la página de la actividad
      router.push(`/curso/${courseId}/actividades/${activityId}`);
    } catch (err) {
      setError('Error al actualizar la actividad');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/curso/${courseId}/actividades/${activityId}`);
  };

  if (activitiesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Cargando actividad...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!currentActivity) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6">
            <h3 className="text-sm font-medium text-yellow-800">Actividad no encontrada</h3>
            <p className="mt-1 text-sm text-yellow-700">
              La actividad que intentas editar no existe o ha sido eliminada.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <nav className="mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <button
                  onClick={() => router.push(`/curso/${courseId}`)}
                  className="hover:text-blue-600"
                >
                  Curso {courseId}
                </button>
              </li>
              <li className="flex items-center">
                <svg className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <button
                  onClick={() => router.push(`/curso/${courseId}/actividades`)}
                  className="hover:text-blue-600"
                >
                  Actividades
                </button>
              </li>
              <li className="flex items-center">
                <svg className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <button
                  onClick={() => router.push(`/curso/${courseId}/actividades/${activityId}`)}
                  className="hover:text-blue-600"
                >
                  {currentActivity.title}
                </button>
              </li>
              <li className="flex items-center">
                <svg className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-900 font-medium">Editar</span>
              </li>
            </ol>
          </nav>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Editar Actividad</h1>
              <p className="mt-2 text-gray-600">
                Modifica los detalles de la actividad "{currentActivity.title}"
              </p>
            </div>
            {userPermissions.isSuperAdmin && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                👑 Admin
              </span>
            )}
          </div>
        </div>

        {/* Formulario de edición */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Información de la Actividad</h2>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {/* Título */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Título de la actividad
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Tipo de actividad */}
            <div>
              <label htmlFor="activityType" className="block text-sm font-medium text-gray-700">
                Tipo de actividad
              </label>
              <select
                id="activityType"
                value={formData.activityType}
                onChange={(e) => setFormData(prev => ({ ...prev, activityType: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="task">📝 Tarea</option>
                <option value="quiz">❓ Quiz</option>
                <option value="exam">📋 Examen</option>
                <option value="project">🚀 Proyecto</option>
                <option value="discussion">💬 Discusión</option>
                <option value="assignment">📄 Asignación</option>
              </select>
            </div>

            {/* Fecha límite */}
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                Fecha límite
              </label>
              <input
                type="date"
                id="dueDate"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Instrucciones */}
            <div>
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                Instrucciones detalladas
              </label>
              <textarea
                id="instructions"
                value={formData.instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                rows={5}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Proporciona instrucciones detalladas para completar esta actividad..."
              />
            </div>

            {/* Puntuación máxima */}
            <div>
              <label htmlFor="maxScore" className="block text-sm font-medium text-gray-700">
                Puntuación máxima
              </label>
              <input
                type="number"
                id="maxScore"
                value={formData.maxScore}
                onChange={(e) => setFormData(prev => ({ ...prev, maxScore: parseInt(e.target.value) || 0 }))}
                min="0"
                max="1000"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Opciones adicionales */}
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="allowLateSubmissions"
                  type="checkbox"
                  checked={formData.allowLateSubmissions}
                  onChange={(e) => setFormData(prev => ({ ...prev, allowLateSubmissions: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="allowLateSubmissions" className="ml-2 block text-sm text-gray-900">
                  Permitir entregas tardías
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="isVisible"
                  type="checkbox"
                  checked={formData.isVisible}
                  onChange={(e) => setFormData(prev => ({ ...prev, isVisible: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isVisible" className="ml-2 block text-sm text-gray-900">
                  Visible para estudiantes
                </label>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 