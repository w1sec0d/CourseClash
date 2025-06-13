'use client';

import { useState } from 'react';
import MyCoursesList from '@/components/courses/MyCoursesList';

// Simulación de contexto de usuario - en producción vendría del contexto de autenticación
const mockUser = {
  id: '123',
  role: 'student' as 'student' | 'teacher', // Cambiar a 'teacher' para vista de docente
  name: 'Usuario de Prueba'
};

export default function CursosPage() {
  const [user] = useState(mockUser);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {user.role === 'teacher' ? 'Gestión de Cursos' : 'Mis Cursos'}
          </h1>
          <p className="mt-2 text-gray-600">
            {user.role === 'teacher' 
              ? 'Administra tus cursos creados y crea nuevos'
              : 'Accede a tus cursos inscritos y explora nuevas oportunidades de aprendizaje'
            }
          </p>
        </div>

        {/* Componente principal de lista de cursos */}
        <MyCoursesList userRole={user.role} />
      </div>
    </div>
  );
} 