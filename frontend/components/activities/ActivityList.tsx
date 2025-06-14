'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useActivitiesByCourse, useCreateActivity } from '@/lib/hooks/useActivities';
import type { CreateActivityInput } from '@/lib/hooks/useActivities';

interface ActivityListProps {
  courseId: string;
  userPermissions?: {
    canEdit?: boolean;
    canPublish?: boolean;
  };
}

export default function ActivityList({ courseId, userPermissions }: ActivityListProps) {
  const router = useRouter();
  const { activities, loading, error, refetch } = useActivitiesByCourse(courseId);
  const { createActivity, loading: createLoading } = useCreateActivity();

  const handleCreateActivity = async (input: CreateActivityInput) => {
    const result = await createActivity(input);
    if (result.success) {
      console.log('Actividad creada:', result.activity);
      refetch(); // Actualizar la lista
    } else {
      console.error('Error:', result.error);
    }
  };

  const handleViewActivity = (activityId: string) => {
    router.push(`/curso/${courseId}/actividades/${activityId}`);
  };

  const handleEditActivity = (activityId: string) => {
    router.push(`/curso/${courseId}/actividades/${activityId}/editar`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Cargando actividades...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error al cargar actividades
            </h3>
            <div className="mt-2 text-sm text-red-700">
              {error.toString()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Actividades del Curso</h2>
        {userPermissions?.canPublish && (
          <button
            onClick={() => handleCreateActivity({
              courseId: parseInt(courseId),
              title: 'Nueva Actividad',
              activityType: 'task',
              description: 'Descripción de la actividad'
            })}
            disabled={createLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {createLoading ? 'Creando...' : 'Crear Actividad'}
          </button>
        )}
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <p className="text-lg">No hay actividades en este curso</p>
            <p className="text-sm mt-2">Crea la primera actividad para comenzar</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {activities.map((activity: { 
            id: string; 
            title: string; 
            description?: string; 
            activityType: string; 
            dueDate?: string; 
            comments?: unknown[] 
          }) => (
            <div
              key={activity.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {activity.title}
                  </h3>
                  {activity.description && (
                    <p className="text-gray-600 mt-1">{activity.description}</p>
                  )}
                  <div className="flex items-center mt-3 space-x-4 text-sm text-gray-500">
                    <span className="capitalize bg-gray-100 px-2 py-1 rounded">
                      {activity.activityType}
                    </span>
                    {activity.dueDate && (
                      <span>
                        Fecha límite: {new Date(activity.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleViewActivity(activity.id)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Ver detalles
                  </button>
                  {userPermissions?.canEdit && (
                    <button 
                      onClick={() => handleEditActivity(activity.id)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                  )}
                </div>
              </div>

              {activity.comments && activity.comments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    {activity.comments.length} comentario(s)
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 