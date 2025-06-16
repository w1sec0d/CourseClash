'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateCourse } from '@/lib/hooks/useCourses';
import Swal from 'sweetalert2';

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
  { value: 'MATEMATICAS', label: 'Matemáticas' },
  { value: 'CIENCIAS', label: 'Ciencias' },
  { value: 'TECNOLOGIA', label: 'Tecnología' },
  { value: 'LENGUAJE', label: 'Lenguaje' },
  { value: 'HISTORIA', label: 'Historia' },
  { value: 'ARTE', label: 'Arte' },
  { value: 'DEPORTES', label: 'Deportes' },
  { value: 'OTROS', label: 'Otros' }
];

export default function CrearCursoPage() {
  const router = useRouter();
  const { createCourse, loading } = useCreateCourse();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCourseFormData>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: '',
      description: '',
      level: 'BEGINNER',
      category: ''
    }
  });

  const onSubmit = async (data: CreateCourseFormData) => {
    setIsSubmitting(true);
    
    try {
      const result = await createCourse(data);
      
      if (result.success) {
        await Swal.fire({
          title: '¡Curso creado exitosamente!',
          text: 'Tu nuevo curso ha sido creado y ya está disponible.',
          icon: 'success',
          confirmButtonText: 'Ver curso',
          confirmButtonColor: '#3B82F6',
          showCancelButton: true,
          cancelButtonText: 'Crear otro curso'
        }).then((alertResult) => {
          if (alertResult.isConfirmed) {
            router.push(`/curso/${result.course?.id}`);
          } else {
            reset();
          }
        });
      } else {
        await Swal.fire({
          title: 'Error al crear el curso',
          text: result.error || 'Ocurrió un error inesperado',
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo',
          confirmButtonColor: '#EF4444'
        });
      }
    } catch (error) {
      console.error('Error creating course:', error);
      await Swal.fire({
        title: 'Error al crear el curso',
        text: 'Ocurrió un error inesperado. Por favor, intenta de nuevo.',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/cursos');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <button
                onClick={() => router.push('/dashboard')}
                className="hover:text-blue-600 transition-colors"
              >
                Dashboard
              </button>
            </li>
            <li className="flex items-center">
              <svg className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <button
                onClick={() => router.push('/dashboard/cursos')}
                className="hover:text-blue-600 transition-colors"
              >
                Cursos
              </button>
            </li>
            <li className="flex items-center">
              <svg className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-900 font-medium">Crear Curso</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Curso</h1>
          <p className="mt-2 text-gray-600">
            Completa la información para crear tu nuevo curso. Podrás agregar contenido y actividades después de crearlo.
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Título del curso */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título del curso <span className="text-red-500">*</span>
              </label>
              <input
                {...register('title')}
                type="text"
                id="title"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Introducción a las Matemáticas"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Describe de qué trata tu curso, qué aprenderán los estudiantes y qué prerequisitos son necesarios..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="BEGINNER">🌱 Principiante</option>
                  <option value="INTERMEDIATE">🔥 Intermedio</option>
                  <option value="ADVANCED">⚡ Avanzado</option>
                </select>
                {errors.level && (
                  <p className="mt-1 text-sm text-red-600">{errors.level.message}</p>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
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
                      <li>Los estudiantes podrán inscribirse en tu curso</li>
                      <li>Tendrás acceso a herramientas de gestión y calificación</li>
                      <li>Podrás editar la información del curso en cualquier momento</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Cancelar
              </button>
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
                  '✨ Crear Curso'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 