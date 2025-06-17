'use client';

import Link from 'next/link';
import { useCoursesApollo } from '@/lib/course-hooks-apollo';
import { useAuthApollo } from '@/lib/auth-context-apollo';

export default function CursosPage() {
  const { user } = useAuthApollo();
  const { courses, loading, error, refetch } = useCoursesApollo();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error al cargar los cursos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => refetch()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const getCategoryBadge = (category: string) => {
    const colors = {
      MATHEMATICS: 'bg-blue-100 text-blue-800',
      PROGRAMMING: 'bg-green-100 text-green-800',
      PHYSICS: 'bg-purple-100 text-purple-800',
      ARTS: 'bg-pink-100 text-pink-800',
      GENERAL: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.GENERAL;
  };

  const getLevelBadge = (level: string) => {
    const colors = {
      BEGINNER: 'bg-emerald-100 text-emerald-800',
      INTERMEDIATE: 'bg-yellow-100 text-yellow-800',
      ADVANCED: 'bg-red-100 text-red-800'
    };
    return colors[level as keyof typeof colors] || colors.BEGINNER;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Cursos</h1>
        <p className="text-gray-600">Explora y accede a tus cursos matriculados</p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No hay cursos disponibles</h3>
          <p className="text-gray-500">Contacta con tu administrador para ser inscrito en cursos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white text-xl font-bold mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadge(course.category)}`}>
                      {course.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelBadge(course.level)}`}>
                      {course.level}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {course.description || 'Sin descripción disponible'}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    <span>Actualizado: {new Date(course.updatedAt || course.createdAt).toLocaleDateString()}</span>
                  </div>
                  <Link
                    href={`/curso?id=${course.id}`}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Ver Curso
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Debug information in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-bold mb-2">Debug Info:</h3>
          <p><strong>Total Courses:</strong> {courses.length}</p>
          <p><strong>User:</strong> {user?.username || 'Not logged in'}</p>
          <p><strong>User Role:</strong> {user?.role || 'N/A'}</p>
          {error && <p className="text-red-600"><strong>Error:</strong> {error}</p>}
        </div>
      )}
    </div>
  );
} 