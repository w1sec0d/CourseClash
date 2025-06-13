'use client';

import React, { useState } from 'react';
import { useCourses, useEnrollInCourse, type Course } from '@/lib/hooks/useCourses';
import CourseCard from './CourseCard';
import Swal from 'sweetalert2';

interface MyCoursesListProps {
  userRole: 'student' | 'teacher';
}

export default function MyCoursesList({ userRole }: MyCoursesListProps) {
  const { courses, loading, error, refetch } = useCourses();
  const { enrollInCourse, loading: enrollLoading } = useEnrollInCourse();
  
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'archived'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Simular cursos del usuario - en producción vendría de useUserCourses
  const userCourses = courses.slice(0, 4); // Simular que el usuario está en los primeros 4 cursos
  const availableCourses = courses.slice(4); // El resto son cursos disponibles

  const handleEnroll = async (courseId: string) => {
    try {
      const result = await enrollInCourse(courseId);
      
      if (result.success) {
        await Swal.fire({
          title: '¡Inscripción Exitosa!',
          text: result.message,
          icon: 'success',
          confirmButtonColor: '#3B82F6'
        });
        refetch(); // Actualizar la lista
      } else {
        await Swal.fire({
          title: 'Error',
          text: result.error || 'No se pudo completar la inscripción',
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

  // Filtrar cursos
  const filteredUserCourses = userCourses.filter((course: Course) => {
    const matchesStatus = filter === 'all' || course.status.toLowerCase() === filter;
    const matchesCategory = categoryFilter === 'all' || course.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const filteredAvailableCourses = availableCourses.filter((course: Course) => {
    const matchesCategory = categoryFilter === 'all' || course.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Obtener categorías únicas
  const categories = Array.from(new Set(courses.map((course: Course) => course.category))).filter(Boolean);

  // Estadísticas
  const stats = {
    total: userCourses.length,
    active: userCourses.filter((c: Course) => c.status.toLowerCase() === 'active').length,
    completed: userCourses.filter((c: Course) => c.status.toLowerCase() === 'completed').length,
    archived: userCourses.filter((c: Course) => c.status.toLowerCase() === 'archived').length,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-lg">Cargando cursos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
        <h3 className="text-lg font-medium text-red-800 mb-2">
          Error al cargar cursos
        </h3>
        <p className="text-red-600">{error.toString()}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-gray-600">Activos</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completados</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.archived}</div>
          <div className="text-sm text-gray-600">Archivados</div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar cursos
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por título o descripción..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtro por estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'completed' | 'archived')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="completed">Completados</option>
              <option value="archived">Archivados</option>
            </select>
          </div>

          {/* Filtro por categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas</option>
              {(categories as string[]).map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mis cursos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {userRole === 'teacher' ? 'Mis Cursos Creados' : 'Mis Cursos'}
          </h2>
          <span className="text-sm text-gray-600">
            {filteredUserCourses.length} de {userCourses.length} cursos
          </span>
        </div>

        {filteredUserCourses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filter !== 'all' || categoryFilter !== 'all' 
                ? 'No se encontraron cursos'
                : userRole === 'teacher' 
                  ? 'Aún no has creado cursos'
                  : 'Aún no estás inscrito en ningún curso'
              }
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filter !== 'all' || categoryFilter !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : userRole === 'teacher'
                  ? 'Crea tu primer curso para comenzar'
                  : 'Explora los cursos disponibles y comienza a aprender'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUserCourses.map((course: Course) => (
              <CourseCard
                key={course.id}
                course={course}
                showEnrollButton={false}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cursos disponibles (solo para estudiantes) */}
      {userRole === 'student' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Cursos Disponibles
            </h2>
            <span className="text-sm text-gray-600">
              {filteredAvailableCourses.length} cursos disponibles
            </span>
          </div>

          {filteredAvailableCourses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron cursos disponibles
              </h3>
              <p className="text-gray-600">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAvailableCourses.map((course: Course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  showEnrollButton={true}
                  onEnroll={handleEnroll}
                  enrollLoading={enrollLoading}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 