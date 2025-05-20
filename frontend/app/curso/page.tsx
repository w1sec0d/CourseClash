"use client"

import React, { useState } from 'react';
import { ChevronLeft, CheckCircle, Award, Clock, AlertCircle, Video, FileText, BookOpen, MessageSquare, Lock, Settings, Info, Star, Calendar, Users, Download } from 'lucide-react';
import AchievementCard from '../../components/course/AchievementCard';
import CourseProgress from '../../components/course/CourseProgress';
import UpcomingActivities from '../../components/course/UpcomingActivities';
import CourseHeader from '../../components/course/CourseHeader';
import CourseStats from '../../components/course/CourseStats';
import ModuleCard from '../../components/course/ModuleCard';
import AnnouncementCard from '../../components/course/AnnouncementCard';
import ResourceCard from '../../components/course/ResourceCard';
import RankingCard from '../../components/course/Ranking';
import TabNavigation from '../../components/TabNavigation';
import CourseSidebar from '../../components/sidebar/CourseSidebar';
import { mockFavorites, mockCategorizedCourses } from '../../components/sidebar/mockData';
import { AchievementProps } from './types';
import { mockModules, mockAnnouncements, mockResources, mockRanking } from './data';
import Link from 'next/link';

// Types
interface CourseContentProps {
  id: string;
  title: string;
  type: 'video' | 'document' | 'quiz' | 'task' | 'forum';
  duration?: number;
  status: 'completed' | 'in-progress' | 'locked' | 'available';
  dueDate?: string;
  xpReward: number;
  hasChallenge?: boolean;
}

interface ModuleProps {
  id: string;
  title: string;
  progress: number;
  content: CourseContentProps[];
  isExpanded: boolean;
}


const CourseDetailView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'content' | 'announcements' | 'resources' | 'progress' | 'ranking'>('content');
  const [modules, setModules] = useState<ModuleProps[]>(mockModules);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  
  // Datos de ejemplo para el curso
  const courseData = {
    title: "Programación Avanzada",
    header: "Ingeniería de Software",
    students: 248,
    semester: "Semestre 2023-II",
    level: "Avanzado",
    attendance: "90%",
    rating: 4,
    lastActivity: "14 Ago",
    hoursCompleted: 24,
    achievementCount: {
      total: 30,
      unlocked: 12
    },
    progression: 45,
    rankingPosition: 12
  };
  
  // Mock achievements
  const achievements = [
    { name: "Maestro del Código", description: "Obtén una nota perfecta en 5 evaluaciones", color: "blue", unlocked: true, icon: <Award className="text-blue-600" size={24} /> },
    { name: "Colaborador Experto", description: "Participa en 10 discusiones de foro", color: "green", unlocked: true, icon: <MessageSquare className="text-green-600" size={24} /> },
    { name: "Puntualidad Perfecta", description: "Entrega todas las tareas a tiempo", color: "yellow", unlocked: false, icon: <Clock className="text-yellow-600" size={24} /> },
    { name: "Explorador de Contenido", description: "Visualiza todo el material del curso", color: "purple", unlocked: false, icon: <BookOpen className="text-purple-600" size={24} /> },
  ];
  
  const toggleModule = (moduleId: string) => {
    if (expandedModule === moduleId) {
      setExpandedModule(null);
    } else {
      setExpandedModule(moduleId);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <CourseSidebar 
        favorites={mockFavorites}
        categorizedCourses={mockCategorizedCourses}
        activeCourseId="1"
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto py-4">
          {/* Back button and navigation */}
          <div className="flex items-center mb-2 px-4">
            <Link href="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <ChevronLeft size={20} />
              <span className="ml-1">Volver a mis cursos</span>
            </Link>
          </div>
          
          {/* Course Banner with Hero Image */}
          <div className="relative w-full h-64 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-lg overflow-hidden mb-4">
            {/* Background image would go here */}
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-5xl font-bold text-white tracking-wider">{courseData.title.toUpperCase()}</h1>
            </div>
            
            {/* Bottom stats bar - similar to Steam UI */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center bg-black/40 backdrop-blur-sm p-4 text-white">
              <div className="flex space-x-6">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-300">ÚLTIMA ACTIVIDAD</span>
                  <span className="font-medium">{courseData.lastActivity}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-300">TIEMPO TOTAL</span>
                  <span className="font-medium">{courseData.hoursCompleted} horas</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-300">LOGROS</span>
                  <span className="font-medium">{courseData.achievementCount.unlocked}/{courseData.achievementCount.total}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-300">RANKING</span>
                  <span className="font-medium">#{courseData.rankingPosition}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors">
                  <Settings size={18} />
                </button>
                <button className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors">
                  <Info size={18} />
                </button>
                <button className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors">
                  <Star size={18} className="text-yellow-400 fill-yellow-400" />
                </button>
              </div>
            </div>
          </div>
      
          {/* Main content area */}
          <div className="flex flex-col md:flex-row gap-4 px-4">
            {/* Left column - Main content */}
            <div className="w-full md:w-2/3">
          {/* Course Progress Bar - Steam Style */}
          <div className="bg-gradient-to-r from-green-500 to-green-800 text-white rounded-lg mb-6 overflow-hidden">
            <div className="flex justify-between items-center p-4">
              <div className="flex flex-col">
                <h2 className="text-xl font-bold">Progreso del curso</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-green-100">{courseData.progression}% completado</span>
                  <span className="text-xs text-green-200 bg-green-700/50 px-2 py-0.5 rounded-full">Nivel 3</span>
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="h-2 w-full bg-green-900/30">
              <div 
                className="h-2 bg-white" 
                style={{ width: `${courseData.progression}%` }}
              ></div>
            </div>
          </div>
          
          {/* Tabs Navigation */}
          <div className="mb-6">
            <TabNavigation
              tabs={[
                { id: 'content', label: 'Contenido' },
                { id: 'announcements', label: 'Anuncios' },
                { id: 'resources', label: 'Recursos' },
                { id: 'progress', label: 'Progreso' },
                { id: 'ranking', label: 'Ranking' }
              ]}
              activeTab={activeTab}
              onTabChange={(tabId: any) => setActiveTab(tabId)}
            />
          </div>
          
          {/* Tab content area */}
          <div className="bg-white p-4 rounded-lg shadow-lg">
            {/* Activity Feed Header - similar to Steam's "ACTIVITY" */}
            <h2 className="text-sm font-medium text-gray-500 mb-4">
              {activeTab === 'content' ? 'CONTENIDO DEL CURSO' :
               activeTab === 'announcements' ? 'ANUNCIOS RECIENTES' :
               activeTab === 'resources' ? 'RECURSOS DISPONIBLES' :
               activeTab === 'progress' ? 'PROGRESO DEL CURSO' : 'RANKING DE ESTUDIANTES'}
            </h2>
            
            {/* Content */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                {modules.map((module) => (
                  <div key={module.id} className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                    <div 
                      className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => toggleModule(module.id)}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                          {module.id}
                        </div>
                        <h3 className="font-medium">{module.title}</h3>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500">{module.progress}%</span>
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-blue-600 rounded-full" 
                            style={{ width: `${module.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    {expandedModule === module.id && (
                      <div className="p-3">
                        {module.content.map((content) => (
                          <div 
                            key={content.id} 
                            className={`p-3 mb-2 rounded-lg flex justify-between items-center ${content.status === 'locked' ? 'bg-gray-100' : 'bg-white hover:bg-blue-50 cursor-pointer transition-colors border border-gray-100'}`}
                          >
                            <div className="flex items-center">
                              {content.type === 'video' && <Video size={18} className="text-blue-500" />}
                              {content.type === 'document' && <FileText size={18} className="text-green-500" />}
                              {content.type === 'quiz' && <BookOpen size={18} className="text-purple-500" />}
                              {content.type === 'task' && <CheckCircle size={18} className="text-red-500" />}
                              {content.type === 'forum' && <MessageSquare size={18} className="text-yellow-500" />}
                              {content.status === 'locked' && <Lock size={18} className="text-gray-400" />}
                              <span className="ml-3">{content.title}</span>
                              {content.hasChallenge && (
                                <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                                  Desafío
                                </span>
                              )}
                            </div>
                            <div className="flex items-center">
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                content.status === 'completed' ? 'bg-green-100 text-green-600' :
                                content.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                                content.status === 'available' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-gray-100 text-gray-500'
                              }`}>
                                {content.status === 'completed' ? 'Completado' :
                                content.status === 'in-progress' ? 'En progreso' :
                                content.status === 'available' ? 'Disponible' : 'Bloqueado'}
                              </span>
                              {content.xpReward && (
                                <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-600 text-xs rounded-full">
                                  {content.xpReward} XP
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'announcements' && (
              <div className="space-y-4">
                {mockAnnouncements.map((announcement) => (
                  <AnnouncementCard
                    key={announcement.id}
                    id={announcement.id}
                    title={announcement.title}
                    date={announcement.date}
                    content={announcement.content}
                    author={announcement.author}
                  />
                ))}
              </div>
            )}
            
            {activeTab === 'resources' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    title={resource.title}
                    type={resource.type}
                    size={resource.size}
                    count={resource.count}
                  />
                ))}
              </div>
            )}
            
            {activeTab === 'progress' && (
              <div className="space-y-6">
                {modules.map((module) => (
                  <div key={module.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>
                    <div className="mt-1 text-right text-sm text-gray-500">{module.progress}%</div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'ranking' && (
              <RankingCard ranking={mockRanking} />
            )}
          </div>
        </div>
        
        {/* Right column - Sidebar */}
        <div className="w-full md:w-1/3 space-y-6">
          {/* Course Information */}
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-sm font-medium text-gray-500 mb-3">INFORMACIÓN DEL CURSO</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 flex items-center"><Users size={16} className="mr-2" /> Estudiantes:</span>
                <span className="font-medium">{courseData.students}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 flex items-center"><Calendar size={16} className="mr-2" /> Semestre:</span>
                <span className="font-medium">{courseData.semester}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 flex items-center"><Award size={16} className="mr-2" /> Nivel:</span>
                <span className="font-medium">{courseData.level}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 flex items-center"><Clock size={16} className="mr-2" /> Asistencia:</span>
                <span className="font-medium">{courseData.attendance}</span>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-gray-700 mr-2">Valoración:</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={`${i < courseData.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} mr-1`} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Achievements Section */}
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-sm font-medium text-gray-500 mb-3">LOGROS</h2>
            <div className="flex justify-between items-center mb-3">
              <span>Has desbloqueado {courseData.achievementCount.unlocked} de {courseData.achievementCount.total}</span>
              <div className="w-24 h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-blue-600 rounded-full" 
                  style={{ width: `${(courseData.achievementCount.unlocked / courseData.achievementCount.total) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement, index) => (
                <div 
                  key={index} 
                  className={`flex items-center p-2 rounded-md ${achievement.unlocked ? 'bg-gray-50' : 'bg-gray-100 opacity-70'}`}
                >
                  <div className={`w-10 h-10 rounded-full ${achievement.unlocked ? `bg-${achievement.color}-100` : 'bg-gray-200'} flex items-center justify-center mr-2`}>
                    {achievement.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{achievement.name}</p>
                    <p className="text-xs text-gray-500">{achievement.unlocked ? 'Desbloqueado' : 'Bloqueado'}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-3 text-center text-sm text-blue-600 hover:text-blue-800 transition-colors">
              Ver todos los logros
            </button>
          </div>
          
          {/* Recent Activity or Friends Activity */}
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-sm font-medium text-gray-500 mb-3">ACTIVIDAD RECIENTE</h2>
            <div className="p-3 bg-gray-50 rounded-md mb-3">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium">Profesor Jorge Pérez</p>
                  <p className="text-xs text-gray-500 mb-1">Hace 2 días</p>
                  <p className="text-sm">Ha publicado nuevos materiales en el módulo 3</p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium">Sistema</p>
                  <p className="text-xs text-gray-500 mb-1">Hace 3 días</p>
                  <p className="text-sm">Has completado el Quiz #2 con 85 puntos</p>
                </div>
              </div>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailView;
