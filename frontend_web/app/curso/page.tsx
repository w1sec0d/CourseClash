'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnunciosTab, TareasTab } from './components/tabs';
import CourseHeader from './components/CourseHeader';
import { useCourseApollo } from '@/lib/course-hooks-apollo';

// Definir las opciones disponibles para las pestañas
type TabId = 'Anuncios' | 'Materiales' | 'Tareas';

export default function Curso() {
  const [activeTab, setActiveTab] = useState<TabId>('Anuncios');
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id');

  // Obtener datos del curso específico
  const { course, loading, error, refetch } = useCourseApollo(courseId || '');

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600'></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-red-600 mb-4'>
            Error al cargar el curso
          </h2>
          <p className='text-gray-600 mb-4'>
            {error || 'No se pudo encontrar el curso'}
          </p>
          <button
            onClick={() => refetch()}
            className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700'
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Función para obtener el color basado en la categoría
  const getCategoryColor = (category: string) => {
    const colors = {
      MATHEMATICS: 'indigo',
      PROGRAMMING: 'green',
      PHYSICS: 'purple',
      ARTS: 'pink',
      GENERAL: 'gray',
    };
    return colors[category as keyof typeof colors] || 'indigo';
  };

  // Función para generar una imagen de banner basada en la categoría
  const getCategoryBanner = (category: string, title: string) => {
    const categoryColors = {
      MATHEMATICS: '4f46e5',
      PROGRAMMING: '059669',
      PHYSICS: '7c3aed',
      ARTS: 'd946ef',
      GENERAL: '6b7280',
    };
    const color = categoryColors[category as keyof typeof categoryColors] || '4f46e5';
    return `https://placehold.co/1200x300/${color}/white?text=${encodeURIComponent(title)}`;
  };

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Contenido principal */}
      <div className='max-w-7xl mx-auto px-4 py-6'>
        {/* Header del curso con banner */}
        <CourseHeader
          title={course.title}
          bannerImage={getCategoryBanner(course.category, course.title)}
          ranking="Por determinar" // TODO: Implementar sistema de ranking
          progress={0} // TODO: Implementar cálculo de progreso
          semester="2024-1" // TODO: Obtener del sistema
          shields={0} // TODO: Implementar sistema de logros
          totalShields={12} // TODO: Implementar sistema de logros
          coins={0} // TODO: Implementar sistema de monedas
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as TabId)}
          tabs={[
            { id: 'Anuncios', label: 'Anuncios' },
            { id: 'Materiales', label: 'Materiales' },
            { id: 'Tareas', label: 'Tareas' },
          ]}
          tabColor={getCategoryColor(course.category)}
        />
            
        {/* Contenido de las pestañas */}
        <div className='mt-6'>
          {activeTab === 'Anuncios' && courseId && <AnunciosTab courseId={courseId} />}
          {activeTab === 'Materiales' && (
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <div className='text-center py-12'>
                <svg className='mx-auto h-12 w-12 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' />
                </svg>
                <h3 className='mt-2 text-sm font-medium text-gray-900'>No hay materiales</h3>
                <p className='mt-1 text-sm text-gray-500'>Aún no se han subido materiales para este curso.</p>
              </div>
            </div>
          )}
          {activeTab === 'Tareas' && courseId && (
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <TareasTab courseId={courseId} />
            </div>
          )}
        </div>

        {/* Debug information in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className='mt-8 p-4 bg-gray-100 rounded-lg'>
            <h3 className='font-bold mb-2'>Debug Info:</h3>
            <p><strong>Course ID:</strong> {courseId}</p>
            <p><strong>Course Title:</strong> {course.title}</p>
            <p><strong>Category:</strong> {course.category}</p>
            <p><strong>Level:</strong> {course.level}</p>
            <p><strong>Description:</strong> {course.description || 'Sin descripción'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
