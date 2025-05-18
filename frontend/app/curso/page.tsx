"use client"

import React, { useState } from 'react';
import { ChevronLeft, CheckCircle, Award, Clock, AlertCircle, Video, FileText, BookOpen, MessageSquare, Lock } from 'lucide-react';
import AchievementCard from '../../components/course/AchievementCard';
import CourseProgress from '../../components/course/CourseProgress';
import UpcomingActivities from '../../components/course/UpcomingActivities';
import CourseHeader from '../../components/course/CourseHeader';
import CourseStats from '../../components/course/CourseStats';
import ModuleCard from '../../components/course/ModuleCard';
import AnnouncementCard from '../../components/course/AnnouncementCard';
import ResourceCard from '../../components/course/ResourceCard';
import Ranking from '../../components/course/Ranking';
import { AchievementProps } from './types';
import { mockModules, mockAnnouncements, mockResources, mockRanking } from './data';

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
  const announcements = mockAnnouncements;
  const resources = mockResources;
  const ranking = mockRanking;

  // Obtener actividades incompletas y no bloqueadas
  const upcomingActivities = modules.flatMap(module => 
    module.content
      .filter(content => 
        content.status === 'available' || content.status === 'in-progress'
      )
      .map(content => ({
        title: content.title,
        module: `Módulo ${module.id}`,
        daysUntil: content.dueDate ? Math.floor((new Date(content.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0,
        xpReward: content.xpReward
      }))
  );

  const toggleModule = (moduleId: string) => {
    setModules(modules.map(module => 
      module.id === moduleId ? { ...module, isExpanded: !module.isExpanded } : module
    ));
  };

  const stats = [
    {
      icon: <CheckCircle size={20} className="text-emerald-600" />,
      label: 'Progreso del curso',
      value: '50% completado'
    },
    {
      icon: <Award size={20} className="text-emerald-600" />,
      label: 'XP acumulados',
      value: '185 puntos'
    },
    {
      icon: <Clock size={20} className="text-emerald-600" />,
      label: 'Próxima tarea',
      value: 'En 3 días'
    }
  ];

  // Lista de logros
  const achievements: AchievementProps[] = [
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
      description: 'Entregaste todas las tareas a tiempo'
    },
    {
      name: 'Consistente',
      icon: <CheckCircle className="h-8 w-8" />,
      color: 'rose',
      description: 'Has completado actividades diariamente'
    }
  ];

  return (
    <div className="bg-emerald-50 min-h-screen">
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <a href="#" className="flex items-center text-emerald-800 mr-4">
            <ChevronLeft size={20} />
            <span>Volver a mis cursos</span>
          </a>
        </div>

        <CourseHeader
          title="Programación Web"
          students={42}
          semester="2025-1"
          level="Nivel B+"
          rating={4}
          attendance="90%"
        />

        <CourseStats
          stats={stats}
          progress={50}
          completed="7/14 actividades completadas"
        />

        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button 
                className={`px-6 py-4 text-sm font-medium ${activeTab === 'content' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('content')}
              >
                Contenido del curso
              </button>
              <button 
                className={`px-6 py-4 text-sm font-medium ${activeTab === 'announcements' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('announcements')}
              >
                Anuncios
              </button>
              <button 
                className={`px-6 py-4 text-sm font-medium ${activeTab === 'resources' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('resources')}
              >
                Recursos
              </button>
              <button 
                className={`px-6 py-4 text-sm font-medium ${activeTab === 'progress' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('progress')}
              >
                Mi progreso
              </button>
              <button 
                className={`px-6 py-4 text-sm font-medium ${activeTab === 'ranking' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('ranking')}
              >
                Ranking
              </button>
            </nav>
          </div>

          {activeTab === 'content' && (
            <div className="p-6">
              {modules.map((module) => (
                <ModuleCard
                  key={module.id}
                  id={module.id}
                  title={module.title}
                  progress={module.progress}
                  content={module.content}
                  isExpanded={module.isExpanded}
                  onToggle={() => toggleModule(module.id)}
                />
              ))}
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className="p-6">
              {announcements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  {...announcement}
                />
              ))}
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="p-6">
              {resources.map((resource) => (
                <ResourceCard
                  key={resource.title}
                  {...resource}
                />
              ))}
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="p-6">
              <div className="space-y-8">
                  
                {/* Sección de detalles del progreso */}
                <CourseProgress modules={modules} />

                {/* Sección de logros */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-4">Logros desbloqueados</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {achievements.map((achievement, index) => (
                      <AchievementCard
                        key={achievement.name}
                        achievement={achievement}
                        index={index}
                      />
                    ))}
                  </div>
                </div>

                {/* Sección de próximas actividades */}
                <UpcomingActivities activities={upcomingActivities} />
              </div>
            </div>
          )}

          {activeTab === 'ranking' && (
            <div className="p-6">
              <Ranking ranking={ranking} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailView;
