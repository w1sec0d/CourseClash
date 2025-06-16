import React from 'react';
import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  ExclamationTriangleIcon,
  SpeakerWaveIcon,
  CalendarDaysIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface ActivityComment {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
}

interface Activity {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  activityType: 'TASK' | 'QUIZ' | 'ANNOUNCEMENT';
  dueDate?: string;
  fileUrl?: string;
  createdAt: string;
  createdBy: number;
  comments?: ActivityComment[];
}

interface ActivityStatsCardProps {
  activities: Activity[];
}

const ActivityStatsCard: React.FC<ActivityStatsCardProps> = ({ activities }) => {
  // Calcular estadísticas
  const totalActivities = activities.length;
  const taskCount = activities.filter(a => a.activityType === 'TASK').length;
  const quizCount = activities.filter(a => a.activityType === 'QUIZ').length;
  const announcementCount = activities.filter(a => a.activityType === 'ANNOUNCEMENT').length;
  
  // Actividades próximas a vencer (próximos 7 días)
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingActivities = activities.filter(activity => {
    if (!activity.dueDate) return false;
    const dueDate = new Date(activity.dueDate);
    return dueDate >= now && dueDate <= nextWeek;
  }).length;

  // Actividades vencidas
  const overdueActivities = activities.filter(activity => {
    if (!activity.dueDate) return false;
    return new Date(activity.dueDate) < now;
  }).length;

  const stats = [
    {
      title: 'Total de Actividades',
      value: totalActivities,
      icon: CalendarDaysIcon,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Tareas',
      value: taskCount,
      icon: AcademicCapIcon,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Quizzes',
      value: quizCount,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Anuncios',
      value: announcementCount,
      icon: SpeakerWaveIcon,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Próximas a Vencer',
      value: upcomingActivities,
      icon: ClockIcon,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Vencidas',
      value: overdueActivities,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`${stat.bgColor} rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all duration-200`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
            </div>
            <div className={`${stat.color} rounded-lg p-2`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ActivityStatsCard; 