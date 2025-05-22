'use client';

import React from 'react';
import Link from 'next/link';

const CourseList: React.FC = () => {
  return (
    <>
      <hr className='my-5 border-gray-200' />
      <div className='space-y-1'>
        <p className='text-sm font-semibold text-gray-500 px-4 mb-2'>
          Mis Cursos
        </p>
        <Link
          href='/curso/matematicas'
          className='items-center px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 flex
          space-x-3 hover:bg-emerald-100 transition'
        >
          <div className='h-2 w-2 rounded-full bg-emerald-500'></div>
          <span>Matemáticas Discretas</span>
        </Link>
        <Link
          href='/curso/paradigmas'
          className='items-center px-4 py-2 rounded-lg flex space-x-3 hover:bg-emerald-50
          transition'
        >
          <div className='h-2 w-2 rounded-full bg-emerald-500'></div>
          <span>Paradigmas de Programación</span>
        </Link>
        <Link
          href='/curso/algoritmos'
          className='items-center px-4 py-2 rounded-lg flex space-x-3 hover:bg-emerald-50
          transition'
        >
          <div className='h-2 w-2 rounded-full bg-emerald-500'></div>
          <span>Algoritmos Avanzados</span>
        </Link>
      </div>
    </>
  );
};

export default CourseList;
