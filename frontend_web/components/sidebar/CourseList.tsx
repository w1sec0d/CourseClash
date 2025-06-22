'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthApollo } from '@/lib/auth-context-apollo';
import { useGetCourseByUserId } from '@/lib/courses-hooks-apollo';
import router from 'next/router';

const CourseList: React.FC = () => {
  const { user } = useAuthApollo();
  const { course, loading, error } = useGetCourseByUserId(user?.id || '');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error al cargar los cursos</h2>
          <p className="text-gray-600 mb-4">Cursos no encontrados</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <hr className='my-5 border-gray-200' />
      <div className='space-y-1'>
        <p className='text-sm font-semibold text-gray-500 px-4 mb-2'>
          Mis Cursos
        </p>
        
        {
          course?.map((onecourse:any) => (
              <Link
                href={`/curso/${onecourse.id}`}
                key={onecourse.id}
                className='items-center px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 flex
                space-x-3 hover:bg-emerald-100 transition'
              >
                <div className='h-2 w-2 rounded-full bg-emerald-500'></div>
                <span>{onecourse.title}</span>
              </Link>
          ))
        }
      </div>
    </>
  );
};

export default CourseList;
