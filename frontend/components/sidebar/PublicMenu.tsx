'use client';

import React from 'react';
import Link from 'next/link';
import { LogIn, UserPlus } from 'lucide-react';

const PublicMenu: React.FC = () => {
  return (
    <div className='mb-6 space-y-2'>
      <p className='text-gray-500 font-medium text-sm mb-2'>¡Bienvenido a Course Clash!</p>
      <Link href='/login' className='flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition'>
        <LogIn size={16} />
        <span>Iniciar Sesión</span>
      </Link>
      <Link href='/registro' className='flex items-center space-x-2 px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition'>
        <UserPlus size={16} />
        <span>Registrarse</span>
      </Link>
    </div>
  );
};

export default PublicMenu;
