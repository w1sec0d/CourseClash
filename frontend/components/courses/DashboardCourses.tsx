'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCourses, useCourseInfo, type Course } from '@/lib/hooks/useCourses';

interface DashboardCoursesProps {
  userRole: 'student' | 'teacher';
  limit?: number;
}

export default function DashboardCourses({ userRole, limit = 6 }: DashboardCoursesProps) {
  const { courses, loading, error } = useCourses();
  const router = useRouter();

  // Simular cursos del usuario - en producción vendría de useUserCourses
  const userCourses = courses.slice(0, limit);

  const handleViewAllCourses = () => {
    router.push('/dashboard/cursos');
  };

  const handleCourseClick = (courseId: string) => {
    router.push(`/curso/${courseId}`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {userRole === 'teacher' ? 'Mis Cursos' : 'Mis Cursos'}
          </h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Mis Cursos</h2>
        </div>
        <div className="text-center py-8">
          <div className="text-red-600 mb-2">⚠️</div>
          <p className="text-gray-600 text-sm">Error al cargar cursos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {userRole === 'teacher' ? 'Mis Cursos' : 'Mis Cursos'}
        </h2>
        <button
          onClick={handleViewAllCourses}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Ver todos →
        </button>
      </div>

      {/* Lista de cursos */}
      {userCourses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">📚</div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            {userRole === 'teacher' ? 'No tienes cursos creados' : 'No estás inscrito en cursos'}
          </h3>
          <p className="text-xs text-gray-600 mb-4">
            {userRole === 'teacher' ? 'Crea tu primer curso' : 'Explora cursos disponibles'}
          </p>
          <button
            onClick={handleViewAllCourses}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
          >
            {userRole === 'teacher' ? 'Crear Curso' : 'Explorar Cursos'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {userCourses.map((course: Course) => (
            <CourseRowItem
              key={course.id}
              course={course}
              onClick={() => handleCourseClick(course.id)}
            />
          ))}
          
          {courses.length > limit && (
            <div className="pt-3 border-t border-gray-100">
              <button
                onClick={handleViewAllCourses}
                className="w-full text-center text-sm text-gray-600 hover:text-gray-800 py-2"
              >
                Ver {courses.length - limit} cursos más
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Componente para cada fila de curso
interface CourseRowItemProps {
  course: Course;
  onClick: () => void;
}

function CourseRowItem({ course, onClick }: CourseRowItemProps) {
  const courseInfo = useCourseInfo(course);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 cursor-pointer transition-all"
    >
      <div className="flex items-center space-x-3">
        {/* Icono de categoría */}
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
          {courseInfo?.category.icon || '📖'}
        </div>
        
        {/* Información del curso */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {course.title}
          </h4>
          <div className="flex items-center space-x-2 mt-1">
            {/* Nivel */}
            {courseInfo && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${courseInfo.level.color}`}>
                {courseInfo.level.icon} {courseInfo.level.label}
              </span>
            )}
            
            {/* Estado */}
            {courseInfo && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${courseInfo.status.color}`}>
                {courseInfo.status.icon} {courseInfo.status.label}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Información lateral */}
      <div className="flex items-center space-x-3 text-xs text-gray-500">
        {/* Progreso simulado */}
        <div className="hidden sm:flex items-center space-x-2">
          <div className="w-12 bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
              style={{ width: '65%' }}
            ></div>
          </div>
          <span>65%</span>
        </div>
        
        {/* Fecha */}
        <span className="hidden md:block">
          {formatDate(course.createdAt)}
        </span>
        
        {/* Flecha */}
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
} 