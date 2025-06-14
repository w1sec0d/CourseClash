'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateActivity } from '@/lib/hooks/useActivities';
import type { CreateActivityInput } from '@/lib/hooks/useActivities';
import Swal from 'sweetalert2';

interface CreateActivityFormProps {
  courseId: number;
  onSuccess?: (activity: { id: string; title: string }) => void;
  onCancel?: () => void;
}

interface FormData {
  title: string;
  description: string;
  activityType: 'task' | 'quiz' | 'announcement';
  dueDate: string;
  fileUrl: string;
}

export default function CreateActivityForm({ 
  courseId, 
  onSuccess, 
  onCancel 
}: CreateActivityFormProps) {
  const { createActivity, loading } = useCreateActivity();
  const [isUploading, setIsUploading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<FormData>({
    defaultValues: {
      activityType: 'task'
    }
  });

  const selectedType = watch('activityType');

  const onSubmit = async (data: FormData) => {
    try {
      const activityData: CreateActivityInput = {
        courseId,
        title: data.title,
        description: data.description,
        activityType: data.activityType,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
        fileUrl: data.fileUrl || undefined,
      };

      const result = await createActivity(activityData);

      if (result.success) {
        await Swal.fire({
          title: '¡Actividad Creada!',
          text: 'La actividad se ha creado exitosamente',
          icon: 'success',
          confirmButtonColor: '#3B82F6'
        });
        
        reset();
        onSuccess?.(result.activity);
      } else {
        // Manejar errores de autenticación de forma especial
        if (result.isAuthError) {
          const authResult = await Swal.fire({
            title: 'Sesión Expirada',
            text: result.error || 'Tu sesión ha expirado. Debes iniciar sesión nuevamente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3B82F6',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Iniciar Sesión',
            cancelButtonText: 'Cancelar'
          });

          if (authResult.isConfirmed) {
            window.location.href = '/login';
          }
        } else {
          await Swal.fire({
            title: 'Error',
            text: result.error || 'No se pudo crear la actividad',
            icon: 'error',
            confirmButtonColor: '#EF4444'
          });
        }
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
      // Aquí iría la lógica de subida de archivos
      // Por ahora simulo una URL de archivo
      const fileUrl = `https://example.com/files/${file.name}`;
      
      // Simular delay de subida
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Actualizar el formulario con la URL del archivo
      register('fileUrl', { value: fileUrl });
      
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
        return {
          title: 'Tarea',
          description: 'Los estudiantes deberán entregar un trabajo',
          icon: '📝',
          color: 'bg-blue-50 border-blue-200 text-blue-800'
        };
      case 'quiz':
        return {
          title: 'Quiz',
          description: 'Evaluación con preguntas para los estudiantes',
          icon: '❓',
          color: 'bg-green-50 border-green-200 text-green-800'
        };
      case 'announcement':
        return {
          title: 'Anuncio',
          description: 'Información general para los estudiantes',
          icon: '📢',
          color: 'bg-yellow-50 border-yellow-200 text-yellow-800'
        };
      default:
        return {
          title: 'Actividad',
          description: 'Actividad general',
          icon: '📄',
          color: 'bg-gray-50 border-gray-200 text-gray-800'
        };
    }
  };

  const typeInfo = getActivityTypeInfo(selectedType);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Crear Nueva Actividad</h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Tipo de Actividad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tipo de Actividad
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['task', 'quiz', 'announcement'] as const).map((type) => {
              const info = getActivityTypeInfo(type);
              return (
                <label
                  key={type}
                  className={`
                    relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                    ${selectedType === type 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <input
                    {...register('activityType', { required: 'Selecciona un tipo de actividad' })}
                    type="radio"
                    value={type}
                    className="sr-only"
                  />
                  <div className="text-2xl mb-2">{info.icon}</div>
                  <div className="text-sm font-medium text-gray-900">{info.title}</div>
                  <div className="text-xs text-gray-500 text-center mt-1">
                    {info.description}
                  </div>
                </label>
              );
            })}
          </div>
          {errors.activityType && (
            <p className="mt-1 text-sm text-red-600">{errors.activityType.message}</p>
          )}
        </div>

        {/* Información del tipo seleccionado */}
        <div className={`p-3 rounded-lg border ${typeInfo.color}`}>
          <div className="flex items-center">
            <span className="text-lg mr-2">{typeInfo.icon}</span>
            <div>
              <span className="font-medium">{typeInfo.title}</span>
              <p className="text-sm opacity-75">{typeInfo.description}</p>
            </div>
          </div>
        </div>

        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título *
          </label>
          <input
            {...register('title', { 
              required: 'El título es obligatorio',
              minLength: { value: 3, message: 'Mínimo 3 caracteres' },
              maxLength: { value: 100, message: 'Máximo 100 caracteres' }
            })}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Tarea de Matemáticas - Capítulo 5"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            {...register('description', {
              maxLength: { value: 1000, message: 'Máximo 1000 caracteres' }
            })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Describe la actividad, instrucciones, objetivos, etc."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Fecha límite (solo para tareas y quizzes) */}
        {(selectedType === 'task' || selectedType === 'quiz') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Límite
            </label>
            <input
              {...register('dueDate')}
              type="datetime-local"
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Archivo adjunto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Archivo Adjunto (Opcional)
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            />
            {isUploading && (
              <div className="flex items-center text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-sm">Subiendo...</span>
              </div>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Formatos permitidos: PDF, DOC, DOCX, TXT, JPG, PNG
          </p>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={loading || isUploading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            {loading ? 'Creando...' : 'Crear Actividad'}
          </button>
        </div>
      </form>
    </div>
  );
} 