'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useActivityApollo } from '@/lib/activities-hooks-apollo';
import { useAuthApollo } from '@/lib/auth-context-apollo';
import EditActivityModal from './components/EditActivityModal';
import StudentSubmission from './components/StudentSubmission';
import Link from 'next/link';

export default function ActivityDetail() {
  const params = useParams();
  const router = useRouter();
  const activityId = params.id as string;
  
  const { user } = useAuthApollo();
  const { activity, loading, error, refetch } = useActivityApollo(activityId);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Verificar si el usuario es profesor o admin
  const isTeacherOrAdmin = user?.role === 'TEACHER' || user?.role === 'ADMIN';
  
  // Verificar si el usuario es estudiante
  const isStudent = user?.role === 'STUDENT';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error al cargar la actividad</h2>
          <p className="text-gray-600 mb-4">{error || 'Actividad no encontrada'}</p>
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'TASK':
        return '📋';
      case 'QUIZ':
        return '❓';
      case 'ANNOUNCEMENT':
        return '📢';
      default:
        return '📄';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'TASK':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'QUIZ':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'ANNOUNCEMENT':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header con navegación */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href={`/curso?id=${activity.courseId}`} className="hover:text-indigo-600 transition">
              Curso
            </Link>
            <span>{'>'}</span>
            <span className="text-gray-900 font-medium">Actividad</span>
          </nav>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getActivityColor(activity.activityType)}`}>
                  <span className="text-lg">{getActivityIcon(activity.activityType)}</span>
                  {getTypeLabel(activity.activityType)}
                </span>
                {activity.dueDate && isOverdue(activity.dueDate) && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    ⚠️ Vencida
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{activity.title}</h1>
            </div>
            
            {/* Botones de acción */}
            <div className="flex gap-3">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Volver
              </button>
              {isTeacherOrAdmin && (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Descripción */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Descripción</h2>
              {activity.description ? (
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {activity.description}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 italic">No hay descripción disponible.</p>
              )}
            </div>

            {/* Archivo adjunto */}
            {activity.fileUrl && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Archivo adjunto</h2>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Archivo de la actividad</p>
                    <p className="text-xs text-gray-500">{activity.fileUrl}</p>
                  </div>
                  <a
                    href={activity.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                  >
                    Descargar
                  </a>
                </div>
              </div>
            )}

            {/* Comentarios */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Comentarios ({activity.comments?.length || 0})
              </h2>
              {activity.comments && activity.comments.length > 0 ? (
                <div className="space-y-4">
                  {activity.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600">
                          U{comment.userId}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">Usuario {comment.userId}</span>
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No hay comentarios aún.</p>
              )}
            </div>

            {/* Entrega de tarea - Solo para estudiantes y solo para tareas */}
            {isStudent && user && activity.activityType === 'TASK' && (
              <StudentSubmission
                activityId={activity.id.toString()}
                userId={user.id.toString()}
                dueDate={activity.dueDate}
                onSubmissionSuccess={() => {
                  // Opcional: recargar actividad o mostrar mensaje
                  console.log('Tarea entregada exitosamente');
                }}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Información de la actividad */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información</h3>
              <div className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tipo</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.activityType)}`}>
                      {getActivityIcon(activity.activityType)} {getTypeLabel(activity.activityType)}
                    </span>
                  </dd>
                </div>
                
                {activity.dueDate && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Fecha límite</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatDate(activity.dueDate)}
                      {isOverdue(activity.dueDate) && (
                        <span className="ml-2 text-red-600 font-medium">(Vencida)</span>
                      )}
                    </dd>
                  </div>
                )}
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Creada</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(activity.createdAt)}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Creado por</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    Usuario ID: {activity.createdBy}
                  </dd>
                </div>
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones</h3>
              <div className="space-y-3">
                <Link
                  href={`/curso?id=${activity.courseId}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Volver al curso
                </Link>
                
                {activity.fileUrl && (
                  <a
                    href={activity.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Descargar archivo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      {isTeacherOrAdmin && (
        <EditActivityModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          activity={activity}
          onActivityUpdated={() => {
            refetch();
            setIsEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
} 