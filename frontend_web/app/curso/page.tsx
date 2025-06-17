'use client';

import { useState } from 'react';
import { AnunciosTab, TareasTab } from './components/tabs';
import CourseHeader from './components/CourseHeader';

// Definir las opciones disponibles para las pestañas
type TabId = 'Anuncios' | 'Materiales' | 'Tareas';

export default function Curso() {
  const [activeTab, setActiveTab] = useState<TabId>('Anuncios');

  // Simulando ID del curso - en una implementación real vendría de los parámetros de la URL
  const courseId = '1';

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Contenido principal */}
      <div className='max-w-7xl mx-auto px-4 py-6'>
        {/* Header del curso con banner */}
        <CourseHeader
          title="Matemáticas Avanzadas"
          bannerImage="https://placehold.co/1200x300/4f46e5/white?text=Matemáticas+Avanzadas"
          ranking="3º Lugar"
          progress={85}
          semester="2024-1"
          shields={8}
          totalShields={12}
          coins={500}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as TabId)}
          tabs={[
            { id: 'Anuncios', label: 'Anuncios' },
            { id: 'Materiales', label: 'Materiales' },
            { id: 'Tareas', label: 'Tareas' },
          ]}
          tabColor="indigo"
        />

        {/* Contenido de las pestañas */}
        <div className='mt-6'>
          {activeTab === 'Anuncios' && <AnunciosTab courseId={courseId} />}
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
          {activeTab === 'Tareas' && (
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <TareasTab courseId={courseId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
