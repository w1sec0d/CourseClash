'use client';

import { useEffect, useRef } from 'react';
import { useAuthApollo } from '@/lib/auth-context-apollo';
import Swal from 'sweetalert2';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardCourses from '@/components/courses/DashboardCourses';

function DashboardContent() {
  const { user } = useAuthApollo();
  const hasShownWelcome = useRef(false);

  useEffect(() => {
    // Show welcome message when user logs in and we haven't shown it yet
    if (user?.fullName && !hasShownWelcome.current) {
      hasShownWelcome.current = true;
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });

      Toast.fire({
        icon: 'success',
        title: `¡Bienvenid@, ${user.fullName}!`,
        background: '#065f46', // emerald-800
        color: '#ffffff',
        iconColor: '#10b981', // emerald-500
      });
    }
  }, [user]);

  return (
    <div className='bg-white min-h-screen'>
      <nav className='bg-emerald-700 text-white shadow-lg'></nav>
      <div className='mx-auto px-4 py-8 container'>
        <div className='md:grid-cols-4 mb-8 grid grid-cols-1 gap-4'>
          <div className='bg-emerald-50 rounded-lg items-center shadow p-4 flex'>
            <div className='bg-emerald-500 rounded-full mr-4 p-3'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-white'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
                ></path>
              </svg>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>Rango Actual</p>
              <p className='font-bold text-gray-700'>Aprendiz Nivel 3</p>
            </div>
          </div>
          <div className='bg-emerald-50 rounded-lg items-center shadow p-4 flex'>
            <div className='bg-emerald-500 rounded-full mr-4 p-3'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-white'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                ></path>
              </svg>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>Duelos Ganados</p>
              <p className='font-bold text-gray-700'>27 de 35</p>
            </div>
          </div>
          <div className='bg-emerald-50 rounded-lg items-center shadow p-4 flex'>
            <div className='bg-emerald-500 rounded-full mr-4 p-3'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-white'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                ></path>
              </svg>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>Tareas Completadas</p>
              <p className='font-bold text-gray-700'>43 de 50</p>
            </div>
          </div>
          <div className='bg-emerald-50 rounded-lg items-center shadow p-4 flex'>
            <div className='bg-emerald-500 rounded-full mr-4 p-3'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-white'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                ></path>
              </svg>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>Logros Desbloqueados</p>
              <p className='font-bold text-gray-700'>15 de 30</p>
            </div>
          </div>
        </div>
        <div className='bg-white rounded-lg shadow-md mb-8 p-6'>
          <div className='justify-between items-center mb-2 flex'>
            <p className='text-gray-700 font-bold'>Progreso de Nivel</p>
            <span className='text-emerald-600 font-medium'>350 / 500 XP</span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-4'>
            <div
              style={{ width: '70%' }}
              className='bg-emerald-500 h-4 rounded-full'
            ></div>
          </div>
          <div className='justify-between mt-2 text-sm text-gray-500 flex'>
            <span>Nivel 3</span>
            <span>Nivel 4</span>
          </div>
        </div>
        <DashboardCourses 
          userRole="student" 
          limit={6} 
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
