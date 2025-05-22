"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Star, Plus, Home, BookOpen, Users, Award, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

// Tipos
export interface CourseItem {
  id: string;
  name: string;
  image?: string;
  category?: string;
  isFavorite?: boolean;
  progress?: number;
  lastPlayed?: string;
  totalHours?: number;
}

interface CategoryProps {
  name: string;
  courses: CourseItem[];
  isExpanded?: boolean;
  isFavorite?: boolean;
  count?: number;
}

interface CourseSidebarProps {
  favorites: CourseItem[];
  categorizedCourses: CategoryProps[];
  activeCourseId?: string;
}

const CourseCategory: React.FC<CategoryProps & { activeCourseId?: string }> = ({ 
  name, 
  courses, 
  isExpanded: initialExpanded = true,
  // isFavorite no se utiliza en este componente
  activeCourseId,
  count
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  
  return (
    <div className="mb-2">
      <div 
        className="flex items-center py-1 px-1 text-emerald-900 hover:text-white cursor-pointer select-none group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? 
          <ChevronDown size={14} className="mr-1" /> : 
          <ChevronRight size={14} className="mr-1" />
        }
        <span className="text-xs uppercase group-hover:text-emerald-700">{name}</span>
        <span className="text-xs ml-1">({count || courses.length})</span>
      </div>
      
      {isExpanded && (
        <div className="pl-2">
          {courses.map((course) => (
            <Link 
              href={`/curso/${course.id}`} 
              key={course.id}
              className={twMerge(
                "flex items-center py-1 px-2 text-sm rounded hover:bg-gray-700/30 text-gray-900 hover:text-white",
                activeCourseId === course.id ? "bg-emerald-900/80 text-emerald-50" : ""
              )}
            >
              {course.isFavorite && <Star size={14} className="text-yellow-400 fill-yellow-400 mr-1" />}
              <span className="truncate">{course.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const mockUser = {
  name: "María Rodríguez",
  level: 15,
  avatar: undefined, // Puedes poner una URL si tienes imagen
};

const sidebarMenu = [
  { label: "Inicio", icon: <Home size={18} />, href: "/" },
  { label: "Mis Cursos", icon: <BookOpen size={18} />, href: "/mis-cursos" },
  { label: "Mi Perfil", icon: <Users size={18} />, href: "/perfil" },
  { label: "Logros", icon: <Award size={18} />, href: "/logros" },
  { label: "Tienda de Bonos", icon: <Star size={18} />, href: "/tienda" },
  { label: "Duelos Académicos", icon: <AlertCircle size={18} />, href: "/duelos" },
];

const CourseSidebar: React.FC<CourseSidebarProps> = ({ 
  favorites, 
  categorizedCourses,
  activeCourseId
}) => {
  // Comentario: Se eliminó la variable myCourses que no se utilizaba

  return (
    <aside className="bg-white h-screen w-64 flex flex-col border-r border-gray-200">
      {/* User Info */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-emerald-100">
        <div className="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center text-lg font-semibold text-emerald-800">
          {mockUser.avatar ? (
            <div className="relative w-full h-full">
              <Image 
                src={mockUser.avatar} 
                alt="avatar" 
                className="rounded-full object-cover" 
                fill
                sizes="40px"
              />
            </div>
          ) : "MR"}
        </div>
        <div>
          <div className="font-semibold text-emerald-900 leading-tight">{mockUser.name}</div>
          <div className="text-xs text-emerald-700">⭐ Nivel {mockUser.level}</div>
        </div>
      </div>
      {/* Main Menu */}
      <nav className="flex flex-col gap-1 px-2 py-2 border-b border-emerald-100 bg-emerald-50">
        {sidebarMenu.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center gap-2 px-3 py-2 rounded text-emerald-900 hover:bg-emerald-100 transition-colors text-sm font-medium">
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      {/* Mis Cursos */}
      <div className="px-4 pt-3 pb-1 text-xs text-gray-900 font-semibold">Mis Cursos</div>
      {/* Course List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        
        {/* Favorites */}
        {favorites.length > 0 && (
          <CourseCategory 
            name="Favoritos" 
            courses={favorites} 
            isExpanded={true}
            isFavorite={true}
            activeCourseId={activeCourseId}
          />
        )}
        
        {/* Categories */}
        {categorizedCourses.map((category, index) => (
          <CourseCategory 
            key={index}
            name={category.name} 
            courses={category.courses} 
            isExpanded={category.isExpanded}
            activeCourseId={activeCourseId}
            count={category.count}
          />
        ))}
      </div>
      {/* Footer */}
      <div className="p-2 border-t border-gray-800">
        <button className="w-full flex items-center justify-center py-1 px-2 bg-emerald-600 hover:bg-emerald-700 rounded text-white text-sm">
          <Plus size={16} className="mr-1" />
          <span>Añadir Curso</span>
        </button>
      </div>
    </aside>
  );
};

export default CourseSidebar;
