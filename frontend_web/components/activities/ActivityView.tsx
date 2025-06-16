'use client';

import React, { useState } from 'react';
import { useActivity, useCreateSubmission, useSubmissions } from '@/lib/hooks/useActivities';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

interface ActivityViewProps {
  activityId: string;
  userId: string;
  userRole: 'student' | 'teacher';
}

interface SubmissionFormData {
  content: string;
  fileUrl: string;
}

export default function ActivityView({ activityId, userId, userRole }: ActivityViewProps) {
  const { activity, loading, error } = useActivity(activityId);
  const { submissions } = useSubmissions(activityId, userId, userRole);
  const { createSubmission, loading: submissionLoading } = useCreateSubmission();
  
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<SubmissionFormData>();

  const onSubmitWork = async (data: SubmissionFormData) => {
    try {
      const result = await createSubmission({
        activityId: parseInt(activityId),
        content: data.content,
        fileUrl: data.fileUrl || undefined,
      });

      if (result.success) {
        await Swal.fire({
          title: '¡Entrega Realizada!',
          text: 'Tu trabajo se ha enviado exitosamente',
          icon: 'success',
          confirmButtonColor: '#3B82F6'
        });
        
        reset();
        setShowSubmissionForm(false);
      } else {
        await Swal.fire({
          title: 'Error',
          text: result.error || 'No se pudo enviar la entrega',
          icon: 'error',
          confirmButtonColor: '#EF4444'
        });
      }
    } catch {
      await Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error inesperado',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Simular subida de archivo
      const fileUrl = `https://example.com/submissions/${file.name}`;
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setValue('fileUrl', fileUrl);
      
      await Swal.fire({
        title: 'Archivo Subido',
        text: 'El archivo se ha subido correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch {
      await Swal.fire({
        title: 'Error de Subida',
        text: 'No se pudo subir el archivo',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getActivityTypeInfo = (type: string) => {
    switch (type) {
      case 'task':
        return { title: 'Tarea', icon: '📝', color: 'bg-blue-100 text-blue-800' };
      case 'quiz':
        return { title: 'Quiz', icon: '❓', color: 'bg-green-100 text-green-800' };
      case 'announcement':
        return { title: 'Anuncio', icon: '📢', color: 'bg-yellow-100 text-yellow-800' };
      default:
        return { title: 'Actividad', icon: '📄', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date() > new Date(dueDate);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg">Cargando actividad...</span>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
        <h3 className="text-lg font-medium text-red-800 mb-2">
          Error al cargar la actividad
        </h3>
        <p className="text-red-600">{error?.toString() || 'Actividad no encontrada'}</p>
      </div>
    );
  }

  const typeInfo = getActivityTypeInfo(activity.activityType);
  const userSubmission = submissions?.[0]; // Asumiendo que hay máximo una entrega por usuario

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header de la actividad */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${typeInfo.color}`}>
                {typeInfo.icon} {typeInfo.title}
              </span>
              {activity.dueDate && (
                <span className={`ml-3 text-sm ${isOverdue(activity.dueDate) ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                  {isOverdue(activity.dueDate) ? '⚠️ Vencida' : '📅'} {formatDate(activity.dueDate)}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {activity.title}
            </h1>
            <p className="text-gray-600">
              Creada el {formatDate(activity.createdAt)}
            </p>
          </div>
        </div>

        {activity.description && (
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {activity.description}
            </p>
          </div>
        )}

        {activity.fileUrl && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">📎</span>
              <a 
                href={activity.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Archivo adjunto
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Estado de la entrega (para estudiantes) */}
      {userRole === 'student' && activity.activityType !== 'announcement' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tu Entrega</h2>
          
          {userSubmission ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <div className="text-green-600 mr-3">✅</div>
                  <div>
                    <p className="font-medium text-green-800">Entrega realizada</p>
                    <p className="text-sm text-green-600">
                      Enviado el {formatDate(userSubmission.submittedAt || '')}
                    </p>
                  </div>
                </div>
                {userSubmission.isGraded && (
                  <div className="text-right">
                    <p className="font-semibold text-lg text-green-700">
                      {userSubmission.latestGrade}/10
                    </p>
                    <p className="text-sm text-green-600">Calificado</p>
                  </div>
                )}
              </div>

              {userSubmission.content && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Contenido:</h4>
                  <p className="text-gray-700">{userSubmission.content}</p>
                </div>
              )}

              {userSubmission.fileUrl && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">📎</span>
                    <a 
                      href={userSubmission.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Ver archivo enviado
                    </a>
                  </div>
                </div>
              )}

              {userSubmission.canEdit && !isOverdue(activity.dueDate || '') && (
                <button
                  onClick={() => setShowSubmissionForm(true)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Editar Entrega
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              {isOverdue(activity.dueDate || '') ? (
                <div className="text-red-600">
                  <div className="text-4xl mb-2">⚠️</div>
                  <p className="font-medium">Entrega vencida</p>
                  <p className="text-sm mt-1">Ya no puedes enviar tu trabajo</p>
                </div>
              ) : (
                <div>
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-gray-600 mb-4">Aún no has enviado tu entrega</p>
                  <button
                    onClick={() => setShowSubmissionForm(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    Enviar Entrega
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Formulario de entrega */}
      {showSubmissionForm && userRole === 'student' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {userSubmission ? 'Editar Entrega' : 'Nueva Entrega'}
            </h3>
            <button
              onClick={() => setShowSubmissionForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmitWork)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenido de la entrega
              </label>
              <textarea
                {...register('content', {
                  required: 'El contenido es obligatorio',
                  minLength: { value: 10, message: 'Mínimo 10 caracteres' }
                })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Escribe tu respuesta, explicación o desarrollo de la actividad..."
                defaultValue={userSubmission?.content || ''}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Archivo adjunto (Opcional)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                />
                {isUploading && (
                  <div className="flex items-center text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-sm">Subiendo...</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowSubmissionForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submissionLoading || isUploading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
              >
                {submissionLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                )}
                {submissionLoading ? 'Enviando...' : (userSubmission ? 'Actualizar' : 'Enviar')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Comentarios */}
      {activity.comments && activity.comments.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Comentarios ({activity.comments.length})
          </h3>
          <div className="space-y-4">
            {activity.comments.map((comment: { 
              id: string; 
              userId: string; 
              content: string; 
              createdAt: string 
            }) => (
              <div key={comment.id} className="border-l-4 border-blue-200 pl-4 py-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">Usuario {comment.userId}</span>
                  <span className="text-sm text-gray-500">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 