import React from 'react';
import Link from 'next/link';

interface Activity {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  activityType: 'TASK' | 'QUIZ' | 'ANNOUNCEMENT';
  dueDate?: string;
  fileUrl?: string;
  createdAt: string;
  createdBy: number;
}

interface BasicActivitiesTabProps {
  activities: Activity[];
  loading?: boolean;
  error?: string | null;
}

const BasicActivitiesTab: React.FC<BasicActivitiesTabProps> = ({ 
  activities = [], 
  loading = false, 
  error = null 
}) => {
  // Estados de carga y error
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-600">Cargando actividades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Error al cargar actividades</h3>
        <p className="text-gray-600 text-center">{error}</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay actividades</h3>
        <p className="text-gray-500 text-center">
          Aún no se han creado actividades para este curso.
        </p>
      </div>
    );
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'TASK':
        return 'border-l-blue-500';
      case 'QUIZ':
        return 'border-l-red-500';
      case 'ANNOUNCEMENT':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'TASK':
        return 'Tarea';
      case 'QUIZ':
        return 'Quiz';
      case 'ANNOUNCEMENT':
        return 'Anuncio';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Actividades del Curso</h2>
        <p className="text-gray-600 mb-6">
          Total: {activities.length} actividades
        </p>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`bg-white rounded-xl shadow-sm border-l-4 p-6 ${getActivityColor(activity.activityType)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {getTypeLabel(activity.activityType)}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {activity.title}
                </h3>

                {activity.description && (
                  <p className="text-gray-600 mb-4">
                    {activity.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  {activity.dueDate && (
                    <span>Vence: {new Date(activity.dueDate).toLocaleDateString()}</span>
                  )}
                  <span>Creada: {new Date(activity.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-4">
                <Link href={`/actividad/${activity.id}`}>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                    Ver Detalles
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BasicActivitiesTab; 