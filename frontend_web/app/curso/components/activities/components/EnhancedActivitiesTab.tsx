import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDaysIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon,
  SpeakerWaveIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import ActivityStatsCard from './ActivityStatsCard';
import QuickFilters from './QuickFilters';

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

interface EnhancedActivitiesTabProps {
  activities: Activity[];
  loading?: boolean;
  error?: string;
}

type SortOption = 'dueDate' | 'createdAt' | 'title' | 'type';
type FilterOption = 'all' | 'TASK' | 'QUIZ' | 'ANNOUNCEMENT' | 'upcoming' | 'overdue';

const EnhancedActivitiesTab: React.FC<EnhancedActivitiesTabProps> = ({ 
  activities = [], 
  loading = false, 
  error = null 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterOption>('all');
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filtrar y ordenar actividades
  const filteredAndSortedActivities = useMemo(() => {
    let filtered = activities;
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Filtrar por tipo
    if (filterType !== 'all') {
      if (filterType === 'upcoming') {
        filtered = filtered.filter(activity => {
          if (!activity.dueDate) return false;
          const dueDate = new Date(activity.dueDate);
          return dueDate >= now && dueDate <= nextWeek;
        });
      } else if (filterType === 'overdue') {
        filtered = filtered.filter(activity => {
          if (!activity.dueDate) return false;
          return new Date(activity.dueDate) < now;
        });
      } else {
        filtered = filtered.filter(activity => activity.activityType === filterType);
      }
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'dueDate':
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          comparison = dateA - dateB;
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'type':
          comparison = a.activityType.localeCompare(b.activityType);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [activities, searchTerm, filterType, sortBy, sortOrder]);

  // Funciones auxiliares
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'TASK':
        return <AcademicCapIcon className="w-5 h-5" />;
      case 'QUIZ':
        return <ExclamationTriangleIcon className="w-5 h-5" />;
      case 'ANNOUNCEMENT':
        return <SpeakerWaveIcon className="w-5 h-5" />;
      default:
        return <CalendarDaysIcon className="w-5 h-5" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'TASK':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'QUIZ':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'ANNOUNCEMENT':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'TASK':
        return 'Tarea';
      case 'QUIZ':
        return 'Quiz';
      case 'ANNOUNCEMENT':
        return 'Anuncio';
      default:
        return type;
    }
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Estados de carga y error mejorados
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-600">Cargando actividades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <XCircleIcon className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-red-600 mb-2">Error al cargar actividades</h3>
        <p className="text-gray-600 text-center">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <CalendarDaysIcon className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay actividades</h3>
        <p className="text-gray-500 text-center">
          Aún no se han creado actividades para este curso.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas de actividades */}
      <ActivityStatsCard activities={activities} />
      
      {/* Filtros rápidos */}
      <QuickFilters 
        activities={activities}
        onFilterChange={(filter) => setFilterType(filter as FilterOption)}
        activeFilter={filterType}
      />
      
      {/* Header con controles */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Actividades del Curso</h2>
          <p className="text-gray-600 mt-1">
            {filteredAndSortedActivities.length} de {activities.length} actividades
          </p>
        </div>

        {/* Controles de búsqueda y filtros */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Barra de búsqueda */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar actividades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64"
            />
          </div>

          {/* Filtro por tipo */}
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as FilterOption)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="all">Todos los tipos</option>
              <option value="TASK">Tareas</option>
              <option value="QUIZ">Quizzes</option>
              <option value="ANNOUNCEMENT">Anuncios</option>
            </select>
          </div>

          {/* Ordenamiento */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as SortOption);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          >
            <option value="dueDate-desc">Fecha límite (más reciente)</option>
            <option value="dueDate-asc">Fecha límite (más antigua)</option>
            <option value="createdAt-desc">Creación (más reciente)</option>
            <option value="createdAt-asc">Creación (más antigua)</option>
            <option value="title-asc">Título (A-Z)</option>
            <option value="title-desc">Título (Z-A)</option>
            <option value="type-asc">Tipo</option>
          </select>
        </div>
      </div>

      {/* Lista de actividades */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {filteredAndSortedActivities.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-8"
            >
              <p className="text-gray-500">No se encontraron actividades con los filtros actuales.</p>
            </motion.div>
          ) : (
            filteredAndSortedActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`bg-white rounded-xl shadow-sm border-l-4 hover:shadow-md transition-all duration-200 ${
                  activity.activityType === 'TASK' ? 'border-l-blue-500' :
                  activity.activityType === 'QUIZ' ? 'border-l-red-500' :
                  'border-l-green-500'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Header con tipo y título */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getActivityColor(activity.activityType)}`}>
                          {getActivityIcon(activity.activityType)}
                          {getTypeLabel(activity.activityType)}
                        </div>
                        {activity.dueDate && isOverdue(activity.dueDate) && (
                          <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            <ExclamationTriangleIcon className="w-3 h-3" />
                            Vencida
                          </div>
                        )}
                      </div>

                      {/* Título */}
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                        {activity.title}
                      </h3>

                      {/* Descripción */}
                      {activity.description && (
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {activity.description}
                        </p>
                      )}

                      {/* Metadatos */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        {activity.dueDate && (
                          <div className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            <span>Vence: {formatDate(activity.dueDate)}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <CalendarDaysIcon className="w-4 h-4" />
                          <span>Creada: {formatDate(activity.createdAt)}</span>
                        </div>
                        {activity.comments && activity.comments.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span>{activity.comments.length} comentarios</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col gap-2 ml-4">
                      {activity.activityType === 'TASK' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                        >
                          Ver Tarea
                        </motion.button>
                      )}
                      {activity.activityType === 'QUIZ' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
                        >
                          Tomar Quiz
                        </motion.button>
                      )}
                      {activity.activityType === 'ANNOUNCEMENT' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
                        >
                          Ver Detalles
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default EnhancedActivitiesTab; 