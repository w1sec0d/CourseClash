'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Course, useCourseInfo } from '@/lib/hooks/useCourses';

interface CourseCardProps {
  course: Course;
  showEnrollButton?: boolean;
  onEnroll?: (courseId: string) => void;
  enrollLoading?: boolean;
}

export default function CourseCard({ 
  course, 
  showEnrollButton = false, 
  onEnroll,
  enrollLoading = false 
}: CourseCardProps) {
  const router = useRouter();
  const courseInfo = useCourseInfo(course);

  const handleCourseClick = () => {
    router.push(`/curso/${course.id}`);
  };

  const handleEnrollClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se active el click del curso
    if (onEnroll) {
      onEnroll(course.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div 
      onClick={handleCourseClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden group"
    >
      {/* Header del curso */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {course.title}
            </h3>
          </div>
          
          {/* Estado del curso */}
          {courseInfo && (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${courseInfo.status.color} ml-3`}>
              {courseInfo.status.icon} {courseInfo.status.label}
            </span>
          )}
        </div>

        {/* Descripción */}
        {course.description && (
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {course.description}
          </p>
        )}

        {/* Metadatos del curso */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            {/* Nivel */}
            {courseInfo && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${courseInfo.level.color}`}>
                {courseInfo.level.icon} {courseInfo.level.label}
              </span>
            )}
            
            {/* Categoría */}
            {courseInfo && (
              <span className="inline-flex items-center text-xs text-gray-600">
                {courseInfo.category.icon} {courseInfo.category.label}
              </span>
            )}
          </div>
        </div>

        {/* Fecha de creación */}
        <div className="text-xs text-gray-400">
          Creado el {formatDate(course.createdAt)}
        </div>
      </div>

      {/* Footer con acciones */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Progreso simulado para estudiantes */}
            <div className="flex items-center text-xs text-gray-600">
              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: '65%' }}
                ></div>
              </div>
              <span>65%</span>
            </div>
          </div>

          {/* Botón de inscripción (si aplica) */}
          {showEnrollButton && (
            <button
              onClick={handleEnrollClick}
              disabled={enrollLoading}
              className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {enrollLoading ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                  Inscribiendo...
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Inscribirse
                </>
              )}
            </button>
          )}
          
          {!showEnrollButton && (
            <button className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium">
              Ver curso
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 