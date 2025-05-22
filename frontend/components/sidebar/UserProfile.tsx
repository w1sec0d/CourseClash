'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User } from '@/lib/auth-hooks';
import { LogOut, ChevronDown, User as UserIcon } from 'lucide-react';

interface UserProfileProps {
  user: User | null;
  onLogout: () => Promise<boolean>;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  
  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  return (
    <div className='relative'>
      <div className='items-center mb-2 flex space-x-3 cursor-pointer' onClick={toggleProfileMenu}>
        {/* Círculo de perfil o avatar */}
        <div className='w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-semibold'>
          {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className='flex-1'>
          <div className='flex items-center'>
            <p className='font-medium text-emerald-800'>{user?.username || 'Usuario'}</p>
            <ChevronDown size={16} className={`ml-1 transition-transform ${profileMenuOpen ? 'transform rotate-180' : ''}`} />
          </div>
          <div className='items-center flex'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4 text-yellow-500'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z'></path>
            </svg>
            <span className='text-sm ml-1'>Nivel {user?.role || 'Usuario'}</span>
          </div>
        </div>
      </div>
      
      {/* Menú desplegable */}
      {profileMenuOpen && (
        <div className='absolute w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50'>
          <Link href='/perfil' className='px-4 py-2 hover:bg-emerald-50 flex items-center'>
            <UserIcon size={16} className='mr-2 text-emerald-600' />
            <span>Mi Perfil</span>
          </Link>
          <button 
            onClick={() => onLogout()} 
            className='w-full text-left px-4 py-2 hover:bg-emerald-50 flex items-center text-red-600'
          >
            <LogOut size={16} className='mr-2' />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
