"use client"

import React, { useState } from 'react';
import { ChevronLeft, CheckCircle, Award, Clock, AlertCircle, Video, FileText, BookOpen, MessageSquare, Lock } from 'lucide-react';
import { UserProfileProps, ProfileStatsProps, ProfileCourseProps } from './types';
import { motion } from 'framer-motion';
import Image from 'next/image';

const mockProfile: UserProfileProps = {
  id: '1',
  name: 'Juan Pérez',
  email: 'juan.perez@example.com',
  avatar: '/images/placeholder.png',
  bio: 'Desarrollador web apasionado por la tecnología y el aprendizaje continuo.',
  level: 5,
  xp: 1250,
  completedCourses: 12,
  enrolledCourses: 5,
  achievements: [
    {
      name: 'Principiante',
      icon: <Award className="h-8 w-8" />,
      color: 'blue',
      description: 'Completaste el primer módulo'
    },
    {
      name: 'Puntual',
      icon: <Clock className="h-8 w-8" />,
      color: 'emerald',
      description: 'Siempre entregas tareas a tiempo'
    }
  ],
  rank: 15,
  totalStudents: 1200,
  trending: 'up',
  stats: {
    completedTasks: 85,
    totalTasks: 120,
    coursesProgress: 78,
    weeklyActivity: 15
  },
  currency: {
    balance: 250,
    lastUpdated: '2025-05-18',
    nextReward: '2025-05-25',
    customizationItems: [
      {
        id: '1',
        name: 'Avatar Estelar',
        type: 'avatar',
        price: 100,
        unlocked: true,
        preview: '/images/customization/avatar1.png'
      },
      {
        id: '2',
        name: 'Tema Nocturno',
        type: 'theme',
        price: 150,
        unlocked: false,
        preview: '/images/customization/theme1.png'
      },
      {
        id: '3',
        name: 'Placa de Excelencia',
        type: 'badge',
        price: 200,
        unlocked: false,
        preview: '/images/customization/badge1.png'
      }
    ]
  }
};

const mockCourses: ProfileCourseProps[] = [
  {
    id: '1',
    title: 'Desarrollo Web Moderno',
    progress: 85,
    status: 'in-progress',
    xp: 250,
    avatar: '/images/course1.png',
    lastActivity: '2 días'
  },
  {
    id: '2',
    title: 'Introducción a Python',
    progress: 100,
    status: 'completed',
    xp: 150,
    avatar: '/images/course2.png',
    lastActivity: '5 días'
  }
];

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'achievements' | 'stats' | 'currency'>('courses');

  const stats: ProfileStatsProps[] = [
    {
      icon: <CheckCircle size={20} className="text-emerald-600" />,
      label: 'Progreso general',
      value: `${mockProfile.stats.coursesProgress}% completado`
    },
    {
      icon: <Award size={20} className="text-emerald-600" />,
      label: 'XP acumulados',
      value: `${mockProfile.xp} puntos`
    },
    {
      icon: <Clock size={20} className="text-emerald-600" />,
      label: 'Actividad semanal',
      value: `${mockProfile.stats.weeklyActivity} horas`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Perfil</h1>
          <button className="text-blue-500 hover:text-blue-700 font-medium">Editar perfil</button>
        </div>
        <div className="mt-4">
          <Image
            src={mockProfile.avatar}
            alt={mockProfile.name}
            width={128}
            height={128}
            className="rounded-full border-4 border-white"
          />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">{mockProfile.name}</h2>
          <p className="text-gray-600">Nivel {mockProfile.level}</p>
          <p className="mt-2 text-gray-500">{mockProfile.bio}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('courses')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'courses' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Mis Cursos
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'achievements' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Logros
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'stats' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Estadísticas
          </button>
          <button
            onClick={() => setActiveTab('currency')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'currency' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Monedas
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockCourses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="relative aspect-w-16 aspect-h-9 mb-4">
                  <Image
                    src={course.avatar}
                    alt={course.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                <div className="mt-2 flex items-center">
                  <div className="flex-1">
                    <div className="bg-gray-200 h-2 rounded-full">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">{course.progress}%</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">{course.lastActivity} días atrás</p>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockProfile.achievements.map((achievement) => (
              <motion.div
                key={achievement.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full bg-${achievement.color}-100`}>{achievement.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{achievement.name}</h3>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center">
                  {stat.icon}
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'currency' && (
          <div className="space-y-8">
            {/* Balance Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Monedas Virtuales</h3>
                  <p className="text-sm text-gray-500">Actualizado el {mockProfile.currency.lastUpdated}</p>
                </div>
                <div className="text-4xl font-bold text-emerald-600">
                  {mockProfile.currency.balance}
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <span className="text-sm text-gray-500">Siguiente recompensa en:</span>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                  {mockProfile.currency.nextReward}
                </span>
              </div>
            </motion.div>

            {/* Customization Items */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mockProfile.currency.customizationItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg shadow p-6"
                >
                  <div className="relative aspect-w-16 aspect-h-9 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={item.preview}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.type}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-emerald-600 font-semibold">{item.price}</span>
                      {item.unlocked ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Desbloqueado
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                          Bloqueado
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
