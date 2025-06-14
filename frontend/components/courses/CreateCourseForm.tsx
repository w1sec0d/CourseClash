'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateCourse } from '@/lib/hooks/useCourses';

// Schema de validación
const createCourseSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(100, 'El título no puede exceder 100 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres').max(500, 'La descripción no puede exceder 500 caracteres'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], {
    errorMap: () => ({ message: 'Selecciona un nivel válido' })
  }),
  category: z.string().min(1, 'Selecciona una categoría')
});

type CreateCourseFormData = z.infer<typeof createCourseSchema>;

const categories = [
  { value: 'MATEMATICAS', label: 'Matemáticas', icon: '🔢' },
  { value: 'CIENCIAS', label: 'Ciencias', icon: '🧪' },
  { value: 'TECNOLOGIA', label: 'Tecnología', icon: '💻' },
  { value: 'LENGUAJE', label: 'Lenguaje', icon: '📚' },
  { value: 'HISTORIA', label: 'Historia', icon: '🏛️' },
  { value: 'ARTE', label: 'Arte', icon: '🎨' },
  { value: 'DEPORTES', label: 'Deportes', icon: '⚽' },
  { value: 'OTROS', label: 'Otros', icon: '📖' }
];

interface CreateCourseFormProps {
  onSuccess?: (course: any) => void;
  onCancel?: () => void;
  className?: string;
}

export default function CreateCourseForm({ 
  onSuccess, 
  onCancel, 
  className = '' 
}: CreateCourseFormProps) {
  const { createCourse, loading } = useCreateCourse();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<CreateCourseFormData>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: '',
      description: '',
      level: 'BEGINNER',
      category: ''
    }
  });

  const watchedCategory = watch('category');
  const watchedLevel = watch('level');

  const onSubmit = async (data: CreateCourseFormData) => {
    setIsSubmitting(true);
    
    try {
      const result = await createCourse(data);
      
      if (result.success) {
        reset();
        onSuccess?.(result.course);
      } else {
        throw new Error(result.error || 'Error al crear el curso');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      throw error; // Re-throw para que el componente padre maneje el error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  const getLevelInfo = (level: string) => {
    switch (level) {
      case 'BEGINNER': return { icon: '🌱', label: 'Principiante', color: 'text-green-600' };
      case 'INTERMEDIATE': return { icon: '🔥', label: 'Intermedio', color: 'text-orange-600' };
      case 'ADVANCED': return { icon: '⚡', label: 'Avanzado', color: 'text-red-600' };
      default: return { icon: '🌱', label: 'Principiante', color: 'text-green-600' };
    }
  };

  const getCategoryInfo = (categoryValue: string) => {
    return categories.find(cat => cat.value === categoryValue);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Crear Nuevo Curso</h2>
          <p className="text-gray-600">
            Completa la información básica de tu curso. Podrás agregar contenido y actividades después.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Título del curso */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Título del curso <span className="text-red-500">*</span>
            </label>
            <input
              {...register('title')}
              type="text"
              id="title"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Ej: Introducción a las Matemáticas"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del curso <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('description')}
              id="description"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors"
              placeholder="Describe de qué trata tu curso, qué aprenderán los estudiantes y qué prerequisitos son necesarios..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Nivel y Categoría */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nivel */}
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                Nivel de dificultad <span className="text-red-500">*</span>
              </label>
              <select
                {...register('level')}
                id="level"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="BEGINNER">🌱 Principiante</option>
                <option value="INTERMEDIATE">🔥 Intermedio</option>
                <option value="ADVANCED">⚡ Avanzado</option>
              </select>
              {errors.level && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.level.message}
                </p>
              )}
            </div>

            {/* Categoría */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                {...register('category')}
                id="category"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.icon} {category.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          {/* Vista previa */}
          {(watchedCategory || watchedLevel) && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-800 mb-3">Vista previa</h3>
              <div className="flex items-center space-x-4">
                {watchedLevel && (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white border ${getLevelInfo(watchedLevel).color}`}>
                    {getLevelInfo(watchedLevel).icon} {getLevelInfo(watchedLevel).label}
                  </span>
                )}
                {watchedCategory && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white border text-gray-700">
                    {getCategoryInfo(watchedCategory)?.icon} {getCategoryInfo(watchedCategory)?.label}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  ¿Qué pasa después de crear el curso?
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Podrás agregar actividades, tareas y contenido</li>
                    <li>Los estudiantes podrán encontrar e inscribirse en tu curso</li>
                    <li>Tendrás acceso a herramientas de gestión y seguimiento</li>
                    <li>Podrás editar la información del curso en cualquier momento</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            {onCancel && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting || loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando curso...
                </div>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Crear Curso
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 