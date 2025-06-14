'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthApollo } from '@/lib/auth-context-apollo';
import { useUserCourses, useCourses, type Course } from '@/lib/hooks/useCourses';

const CourseList: React.FC = () => {
  const { user } = useAuthApollo();
  const { userCourses, loading: userCoursesLoading, error: userCoursesError } = useUserCourses(user?.id || '');
  const { courses: allCourses, loading: allCoursesLoading } = useCourses();

  // Fallback: si no se pueden obtener cursos del usuario, usar cursos generales filtrados
  const loading = userCoursesLoading || allCoursesLoading;
  let displayCourses = userCourses;

  // Si hay error obteniendo cursos del usuario, usar fallback con cursos generales
  if (userCoursesError && allCourses.length > 0) {
    // Simular cursos del usuario tomando los primeros cursos disponibles
    displayCourses = allCourses.slice(0, 3);
  } else {
    displayCourses = userCourses.slice(0, 3);
  }

  return (
    <>
      <hr className='my-5 border-gray-200' />
      <div className='space-y-1'>
        <div className='flex items-center justify-between px-4 mb-2'>
          <p className='text-sm font-semibold text-gray-500'>
            Mis Cursos
          </p>
          {(userCourses.length > 3 || (!userCoursesError && displayCourses.length > 3)) && (
            <Link 
              href='/dashboard/cursos'
              className='text-xs text-emerald-600 hover:text-emerald-800'
            >
              Ver todos
            </Link>
          )}
        </div>
        
        {loading ? (
          <div className='px-4 py-2 text-sm text-gray-500 flex items-center'>
            <div className='animate-spin rounded-full h-3 w-3 border-b-2 border-emerald-500 mr-2'></div>
            Cargando cursos...
          </div>
        ) : displayCourses.length === 0 ? (
          <div className='px-4 py-2 space-y-2'>
            <div className='text-sm text-gray-500'>
              No tienes cursos aún
            </div>
            <Link
              href='/dashboard/cursos'
              className='items-center px-2 py-1 rounded-md flex space-x-2 hover:bg-emerald-50 transition text-emerald-600 hover:text-emerald-800 text-xs'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-3 w-3'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                />
              </svg>
              <span>Explorar cursos</span>
            </Link>
          </div>
        ) : (
          displayCourses.map((course: Course) => (
            <Link
              key={course.id}
              href={`/curso/${course.id}`}
              className='items-center px-4 py-2 rounded-lg flex space-x-3 hover:bg-emerald-50 transition group'
            >
              <div className='h-2 w-2 rounded-full bg-emerald-500 group-hover:bg-emerald-600 flex-shrink-0'></div>
              <span className='text-sm font-medium text-gray-700 group-hover:text-emerald-800 truncate'>
                {course.title}
              </span>
              {userCoursesError && (
                <span className='text-xs text-gray-400 ml-auto flex-shrink-0'>
                  📚
                </span>
              )}
            </Link>
          ))
        )}
        
        {/* Error state con opción de ver todos los cursos */}
        {userCoursesError && displayCourses.length === 0 && !loading && (
          <div className='px-4 py-2 space-y-2'>
            <div className='text-xs text-yellow-600 bg-yellow-50 p-2 rounded'>
              Error cargando tus cursos
            </div>
            <Link
              href='/dashboard/cursos'
              className='items-center px-2 py-1 rounded-md flex space-x-2 hover:bg-emerald-50 transition text-emerald-600 hover:text-emerald-800 text-xs'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-3 w-3'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                />
              </svg>
              <span>Ver cursos disponibles</span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CourseList;
