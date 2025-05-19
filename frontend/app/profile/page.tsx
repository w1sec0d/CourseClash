"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle, Award, Clock, AlertCircle, Video, FileText, BookOpen, MessageSquare, Lock, Info, Code } from 'lucide-react';
import { UserProfileProps, ProfileStatsProps, ProfileCourseProps, AchievementProps, CustomizationItem, CurrencyActions } from './types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import ProfileImage from '@/components/profile/ProfileImage';
import TabNavigation from '@/components/TabNavigation';

interface CourseAchievement {
  courseName: string;
  achievements: AchievementProps[];
}

const mockProfile: UserProfileProps = {
  id: '1',
  name: 'Juan Pérez',
  email: 'juan.perez@example.com',
  frame: 'default',
  bio: 'Desarrollador web apasionado por la tecnología y el aprendizaje continuo.',
  level: 5,
  xp: 1250,
  completedCourses: 12,
  enrolledCourses: 5,
  achievements: [
    {
      courseName: 'Desarrollo Web Básico',
      achievements: [
        {
          name: 'Principiante',
          icon: <Award className="h-8 w-8" />,
          color: 'blue',
          description: 'Completaste el primer módulo'
        },
        {
          name: 'HTML Maestro',
          icon: <FileText className="h-8 w-8" />,
          color: 'emerald',
          description: 'Dominas HTML avanzado'
        }
      ]
    },
    {
      courseName: 'JavaScript Avanzado',
      achievements: [
        {
          name: 'Puntual',
          icon: <Clock className="h-8 w-8" />,
          color: 'emerald',
          description: 'Siempre entregas tareas a tiempo'
        },
        {
          name: 'Experto en Funciones',
          icon: <Code className="h-8 w-8" />,
          color: 'purple',
          description: 'Dominas funciones de orden superior'
        }
      ]
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
        name: 'Marco Estelar',
        type: 'frame',
        price: 100,
        preview: '/images/customization/frame_stellar.png',
        unlocked: true,
        frameStyle: {
          color: '#2563eb',
          thickness: 4,
          pattern: 'dashed',
          glow: true
        }
      },
      {
        id: '2',
        name: 'Marco Nocturno',
        type: 'frame',
        price: 150,
        unlocked: false,
        preview: '/images/customization/frame-dark.png',
        frameStyle: {
          color: '#1e293b',
          thickness: 6,
          pattern: 'solid',
          glow: false
        }
      },
      {
        id: '3',
        name: 'Marco de Excelencia',
        type: 'badge',
        price: 200,
        unlocked: false,
        preview: '/images/customization/badge-excellence.png'
      }
    ],
    activeTheme: 'default',
    activeFrame: 'default',
    activeBadge: 'default'
  }
};

// Currency Actions Implementation
const currencyActions: CurrencyActions = {
  async purchaseItem(itemId: string) {
    const item = mockProfile.currency.customizationItems.find(i => i.id === itemId);
    if (!item) return;

    if (!this.canPurchase(item)) {
      throw new Error('Insufficient funds');
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update state
    mockProfile.currency.balance -= item.price;
    item.unlocked = true;

    // Update active customization if it's the first unlocked item of its type
    if (item.type === 'frame' && !mockProfile.currency.customizationItems.some(i => i.type === 'frame' && i.unlocked)) {
      mockProfile.currency.activeFrame = itemId;
    }
    if (item.type === 'theme' && !mockProfile.currency.customizationItems.some(i => i.type === 'theme' && i.unlocked)) {
      mockProfile.currency.activeTheme = itemId;
    }
    if (item.type === 'badge' && !mockProfile.currency.customizationItems.some(i => i.type === 'badge' && i.unlocked)) {
      mockProfile.currency.activeBadge = itemId;
    }
  },

  applyCustomization(itemId: string) {
    const item = mockProfile.currency.customizationItems.find(i => i.id === itemId);
    if (!item || !item.unlocked) return;

    // Update active customization
    if (item.type === 'frame') mockProfile.currency.activeFrame = itemId;
    if (item.type === 'theme') mockProfile.currency.activeTheme = itemId;
    if (item.type === 'badge') mockProfile.currency.activeBadge = itemId;
  },

  async getDailyReward() {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Add daily reward
    mockProfile.currency.balance += 50;
    mockProfile.currency.lastUpdated = new Date().toISOString();
    mockProfile.currency.nextReward = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString();
  },

  canPurchase(item: CustomizationItem) {
    return item.price <= mockProfile.currency.balance;
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

type TabId = 'courses' | 'achievements' | 'stats' | 'currency';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('courses');

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
      {/* User info */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Perfil</h1>
          <button className="text-blue-500 hover:text-blue-700 font-medium">Editar perfil</button>
        </div>
        <div className="mt-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-transform duration-300"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <ProfileImage className="w-32 h-32 mb-4" />
              <h2 className="text-3xl font-bold text-white">{mockProfile.name}</h2>
              <div className="flex items-center space-x-2">
                <span className="text-white">Nivel</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold text-white">{mockProfile.level}</span>
              </div>
              <p className="text-white/90">{mockProfile.bio}</p>
              <div className="flex items-center justify-center space-x-4 mt-4">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-white" />
                  <span className="text-white/90">{mockProfile.completedCourses} cursos completados</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-white" />
                  <span className="text-white/90">{mockProfile.enrolledCourses} cursos en progreso</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <TabNavigation
        tabs={[
          { id: 'courses' as TabId, label: 'Mis Cursos' },
          { id: 'achievements' as TabId, label: 'Logros' },
          { id: 'stats' as TabId, label: 'Estadísticas' },
          { id: 'currency' as TabId, label: 'Monedas' }
        ] as const}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId)}
      />

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
          <div className="space-y-8">
            {mockProfile.achievements.map((courseAchievement: CourseAchievement) => (
              <motion.div
                key={courseAchievement.courseName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-emerald-100 rounded-full">
                        <BookOpen className="h-6 w-6 text-emerald-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {courseAchievement.courseName}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                        {courseAchievement.achievements.length}
                      </span>
                      <span className="text-sm text-gray-500">logros</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {courseAchievement.achievements.map((achievement: AchievementProps) => (
                      <div
                        key={achievement.name}
                        className="bg-white p-4 rounded-lg shadow-sm transform hover:scale-105 transition-transform duration-300 border border-gray-100"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-full bg-${achievement.color}-100`}>
                            {achievement.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                            {achievement.unlocked === false && (
                              <div className="mt-2 flex items-center space-x-2">
                                <Lock className="h-4 w-4 text-gray-400" />
                                <span className="text-xs text-gray-400">Pendiente</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
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
              <div className="mt-4">
                <button
                  onClick={() => currencyActions.getDailyReward()}
                  className="w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={new Date(mockProfile.currency.nextReward) > new Date()}
                >
                  Recoger recompensa diaria
                </button>
              </div>
            </motion.div>

            {/* Active Customizations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personalización activa</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Marco</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full border-2 border-gray-200">
                        <Image
                          src="/images/default-profile.png"
                          alt="Marco activo"
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{mockProfile.currency.activeFrame}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Tema</h4>
                  <span className="text-sm text-gray-500">{mockProfile.currency.activeTheme}</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Insignia</h4>
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <Image
                      src={`/images/customization/${mockProfile.currency.activeBadge}.png`}
                      alt="Insignia activa"
                      width={32}
                      height={32}
                    />
                  </div>
                </div>
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
                  <div className="mt-4">
                    {item.unlocked ? (
                      <button
                        onClick={() => currencyActions.applyCustomization(item.id)}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Aplicar
                      </button>
                    ) : (
                      <button
                        onClick={() => currencyActions.purchaseItem(item.id)}
                        className={`w-full px-4 py-2 rounded-md text-sm font-medium ${
                          currencyActions.canPurchase(item)
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!currencyActions.canPurchase(item)}
                      >
                        {currencyActions.canPurchase(item) ? 'Comprar' : 'Fondos insuficientes'}
                      </button>
                    )}
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
