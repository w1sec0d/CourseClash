'use client';

import React from 'react';
import { useActivitiesByCourse, useCreateActivity } from '@/lib/hooks/useActivities';
import type { CreateActivityInput } from '@/lib/hooks/useActivities';

interface ActivityListProps {
  courseId: string;
}

export default function ActivityList({ courseId }: ActivityListProps) {
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
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Ver detalles
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                    Editar
                  </button>
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