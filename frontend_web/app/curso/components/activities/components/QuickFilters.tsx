import React from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDaysIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon,
  SpeakerWaveIcon,
  FireIcon,
} from '@heroicons/react/24/outline';

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
  comments?: Array<{
    id: number;
    userId: number;
    content: string;
    createdAt: string;
  }>;
}

interface QuickFiltersProps {
  activities: Activity[];
  onFilterChange: (filter: string) => void;
  activeFilter: string;
}

const QuickFilters: React.FC<QuickFiltersProps> = ({ 
  activities, 
  onFilterChange, 
  activeFilter 
}) => {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const filters = [
    {
      id: 'all',
      label: 'Todas',
      icon: CalendarDaysIcon,
      count: activities.length,
      color: 'indigo'
    },
    {
      id: 'TASK',
      label: 'Tareas',
      icon: AcademicCapIcon,
      count: activities.filter(a => a.activityType === 'TASK').length,
      color: 'blue'
    },
    {
      id: 'QUIZ',
      label: 'Quizzes',
      icon: ExclamationTriangleIcon,
      count: activities.filter(a => a.activityType === 'QUIZ').length,
      color: 'red'
    },
    {
      id: 'ANNOUNCEMENT',
      label: 'Anuncios',
      icon: SpeakerWaveIcon,
      count: activities.filter(a => a.activityType === 'ANNOUNCEMENT').length,
      color: 'green'
    },
    {
      id: 'upcoming',
      label: 'Próximas',
      icon: ClockIcon,
      count: activities.filter(activity => {
        if (!activity.dueDate) return false;
        const dueDate = new Date(activity.dueDate);
        return dueDate >= now && dueDate <= nextWeek;
      }).length,
      color: 'yellow'
    },
    {
      id: 'overdue',
      label: 'Vencidas',
      icon: FireIcon,
      count: activities.filter(activity => {
        if (!activity.dueDate) return false;
        return new Date(activity.dueDate) < now;
      }).length,
      color: 'red'
    }
  ];

  const getButtonClasses = (color: string, isActive: boolean) => {
    const baseClasses = "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border";
    
    if (isActive) {
      switch (color) {
        case 'indigo':
          return `${baseClasses} bg-indigo-100 text-indigo-700 border-indigo-200`;
        case 'blue':
          return `${baseClasses} bg-blue-100 text-blue-700 border-blue-200`;
        case 'red':
          return `${baseClasses} bg-red-100 text-red-700 border-red-200`;
        case 'green':
          return `${baseClasses} bg-green-100 text-green-700 border-green-200`;
        case 'yellow':
          return `${baseClasses} bg-yellow-100 text-yellow-700 border-yellow-200`;
        default:
          return `${baseClasses} bg-gray-100 text-gray-700 border-gray-200`;
      }
    }
    
    return `${baseClasses} bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300`;
  };

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg mb-6">
      <span className="text-sm font-medium text-gray-700 flex items-center mr-2">
        Filtros rápidos:
      </span>
      {filters.map((filter, index) => (
        <motion.button
          key={filter.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onFilterChange(filter.id)}
          className={getButtonClasses(filter.color, activeFilter === filter.id)}
        >
          <filter.icon className="w-4 h-4" />
          <span>{filter.label}</span>
          {filter.count > 0 && (
            <span className="bg-white/80 text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
              {filter.count}
            </span>
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default QuickFilters; 