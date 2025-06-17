import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { useActivitiesApollo, Activity } from '@/lib/activities-hooks-apollo';
import { useAuthApollo } from '@/lib/auth-context-apollo';
import TaskDetailModal from './TaskDetailModal';
import Link from 'next/link';

interface TareasTabProps {
  courseId: string;
}

type FilterType = 'all' | 'tasks' | 'quizzes' | 'pending' | 'submitted' | 'graded' | 'overdue';
type SortType = 'dueDate' | 'title' | 'type' | 'status';

const TareasTab: React.FC<TareasTabProps> = ({ courseId }) => {
  const { activities, loading: activitiesLoading, error: activitiesError } = useActivitiesApollo(courseId);
  const { user } = useAuthApollo();
  
  // Estados para filtros y búsqueda
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Estados para el modal
  const [selectedTask, setSelectedTask] = useState<Activity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Verificar si el usuario es profesor o admin
  const isTeacherOrAdmin = user?.role === 'TEACHER' || user?.role === 'ADMIN';
  
  // Filtrar tareas y quizzes de las actividades
  const tasksAndQuizzes = useMemo(() => {
    return activities.filter(activity => 
      activity.activityType === 'TASK' || activity.activityType === 'QUIZ'
    );
  }, [activities]);

  // Filtrar y ordenar actividades
  const filteredAndSortedActivities = useMemo(() => {
    let filtered = [...tasksAndQuizzes];
    const now = new Date();

    // Aplicar filtro de búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtro por tipo y estado
    if (filter !== 'all') {
      filtered = filtered.filter(activity => {
        const dueDate = activity.dueDate ? new Date(activity.dueDate) : null;
        
        switch (filter) {
          case 'tasks':
            return activity.activityType === 'TASK';
          case 'quizzes':
            return activity.activityType === 'QUIZ';
          case 'pending':
            return (!dueDate || dueDate >= now);
          case 'overdue':
            return dueDate && dueDate < now;
          case 'submitted':
          case 'graded':
            // Para estos filtros necesitaríamos las submissions, 
            // por simplicidad los dejamos pasar por ahora
            return true;
          default:
            return true;
        }
      });
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
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'type':
          comparison = a.activityType.localeCompare(b.activityType);
          break;
        case 'status':
          // Ordenar por estado requeriría las submissions
          comparison = a.title.localeCompare(b.title);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [tasksAndQuizzes, searchTerm, filter, sortBy, sortOrder]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'TASK':
        return <AcademicCapIcon className="w-5 h-5" />;
      case 'QUIZ':
        return <ExclamationTriangleIcon className="w-5 h-5" />;
      default:
        return <DocumentTextIcon className="w-5 h-5" />;
    }
  };

  const getActivityColor = (type: string, isOverdue: boolean = false) => {
    if (isOverdue) return { bg: 'bg-red-100', text: 'text-red-600', border: 'border-l-red-500' };
    
    switch (type) {
      case 'TASK':
        return { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-l-blue-500' };
      case 'QUIZ':
        return { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-l-orange-500' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-l-gray-500' };
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'TASK':
        return 'Tarea';
      case 'QUIZ':
        return 'Quiz';
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            <ClockIcon className="w-3 h-3" />
            Pendiente
          </span>
        );
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            <CheckCircleIcon className="w-3 h-3" />
            Entregada
          </span>
        );
      case 'graded':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            <AcademicCapIcon className="w-3 h-3" />
            Calificada
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            <ClockIcon className="w-3 h-3" />
            Vencida
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewActivity = (activity: Activity) => {
    setSelectedTask(activity);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.02 }
  };

  if (activitiesLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-600">Cargando actividades...</p>
      </div>
    );
  }

  if (activitiesError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Error al cargar actividades</h3>
        <p className="text-gray-600 text-center">{activitiesError}</p>
      </div>
    );
  }

  const taskCount = tasksAndQuizzes.filter(a => a.activityType === 'TASK').length;
  const quizCount = tasksAndQuizzes.filter(a => a.activityType === 'QUIZ').length;
  const pendingCount = tasksAndQuizzes.filter(a => !a.dueDate || new Date(a.dueDate) >= new Date()).length;
  const overdueCount = tasksAndQuizzes.filter(a => a.dueDate && new Date(a.dueDate) < new Date()).length;

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
    <div>
          <h2 className="text-2xl font-bold text-gray-900">Tareas y Quizzes</h2>
          <p className="text-gray-600 mt-1">
            {filteredAndSortedActivities.length} de {tasksAndQuizzes.length} actividades
            {taskCount > 0 && ` • ${taskCount} tareas`}
            {quizCount > 0 && ` • ${quizCount} quizzes`}
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

          {/* Filtro por tipo y estado */}
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="all">Todas las actividades</option>
              <option value="tasks">Solo Tareas</option>
              <option value="quizzes">Solo Quizzes</option>
              <option value="pending">Pendientes</option>
              <option value="submitted">Entregadas</option>
              <option value="graded">Calificadas</option>
              <option value="overdue">Vencidas</option>
            </select>
          </div>

          {/* Ordenamiento */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as SortType);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          >
            <option value="dueDate-asc">Fecha límite (más próxima)</option>
            <option value="dueDate-desc">Fecha límite (más lejana)</option>
            <option value="title-asc">Título (A-Z)</option>
            <option value="title-desc">Título (Z-A)</option>
            <option value="type-asc">Tipo (Tareas primero)</option>
            <option value="type-desc">Tipo (Quizzes primero)</option>
          </select>
        </div>
      </div>

      {/* Filtros rápidos */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'Todas', count: tasksAndQuizzes.length, color: 'indigo' },
          { id: 'tasks', label: 'Tareas', count: taskCount, color: 'blue' },
          { id: 'quizzes', label: 'Quizzes', count: quizCount, color: 'orange' },
          { id: 'pending', label: 'Pendientes', count: pendingCount, color: 'yellow' },
          { id: 'overdue', label: 'Vencidas', count: overdueCount, color: 'red' },
        ].map((filterOption) => (
          <motion.button
            key={filterOption.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              filter === filterOption.id
                ? `bg-${filterOption.color}-100 text-${filterOption.color}-700 border border-${filterOption.color}-200`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
            }`}
            onClick={() => setFilter(filterOption.id as FilterType)}
          >
            {filterOption.label}
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              filter === filterOption.id
                ? `bg-${filterOption.color}-200 text-${filterOption.color}-800`
                : 'bg-gray-200 text-gray-600'
            }`}>
              {filterOption.count}
            </span>
          </motion.button>
        ))}
        </div>

      {/* Lista de actividades */}
      <motion.div 
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="wait">
          {filteredAndSortedActivities.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12 bg-white rounded-lg shadow-sm"
            >
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay actividades</h3>
              <p className="text-gray-500">
                {searchTerm || filter !== 'all' 
                  ? 'No se encontraron actividades con los filtros actuales.'
                  : 'Aún no se han creado tareas o quizzes para este curso.'
                }
              </p>
            </motion.div>
          ) : (
            filteredAndSortedActivities.map((activity, index) => {
              const now = new Date();
              const dueDate = activity.dueDate ? new Date(activity.dueDate) : null;
              const isOverdue = dueDate ? dueDate < now : false;
              const status = isOverdue ? 'overdue' : 'pending';
              const colors = getActivityColor(activity.activityType, isOverdue);

              return (
            <motion.div 
                  key={activity.id}
              variants={itemVariants}
              whileHover="hover"
              transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={`bg-white rounded-xl shadow-sm border-l-4 hover:shadow-md transition-all duration-200 ${colors.border}`}
            >
                  <div className="p-6">
            <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.bg}`}>
                              <span className={colors.text}>
                                {getActivityIcon(activity.activityType)}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {activity.title}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                activity.activityType === 'TASK' 
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}>
                                {getTypeLabel(activity.activityType)}
                              </span>
                  </div>
                            {activity.description && (
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {activity.description}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                              {activity.dueDate && (
                                <div className="flex items-center gap-1">
                                  <CalendarDaysIcon className="w-4 h-4" />
                                  <span>Entrega: {formatDate(activity.dueDate)}</span>
                    </div>
                  )}
                              <div className="flex items-center gap-1">
                                <ClockIcon className="w-4 h-4" />
                                <span>Creada: {formatDate(activity.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                </div>
              </div>
                      
                      <div className="flex flex-col items-end gap-3 ml-4">
                        {getStatusBadge(status)}
                
                        <div className="flex gap-2 flex-wrap">
                          {/* Botón Ver - para todos los usuarios */}
                  <motion.button 
                            onClick={() => handleViewActivity(activity)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2"
                  >
                            <EyeIcon className="w-4 h-4" />
                            Ver {getTypeLabel(activity.activityType)}
                  </motion.button>
                          
                          {/* Botones específicos para profesores */}
                          {isTeacherOrAdmin ? (
                            <>
                              {/* Botón Ver Entregas - solo para tareas */}
                              {activity.activityType === 'TASK' && (
                                <Link href={`/actividad/${activity.id}/entregas`}>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition flex items-center gap-2"
                  >
                                    <UserGroupIcon className="w-4 h-4" />
                                    Ver Entregas
                  </motion.button>
                                </Link>
                )}
                
                              {/* Botón Editar - para todas las actividades */}
                              <Link href={`/actividad/${activity.id}`}>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition flex items-center gap-2"
                                >
                                  <PencilIcon className="w-4 h-4" />
                                  Editar
                                </motion.button>
                              </Link>
                            </>
                          ) : (
                            /* Botones para estudiantes */
                            status === 'pending' && !isOverdue && (
                  <motion.button 
                                onClick={() => handleViewActivity(activity)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                                className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition ${
                                  activity.activityType === 'TASK' 
                                    ? 'bg-emerald-600 hover:bg-emerald-700'
                                    : 'bg-orange-600 hover:bg-orange-700'
                                }`}
                  >
                                {activity.activityType === 'TASK' ? 'Entregar' : 'Realizar'}
                  </motion.button>
                            )
                )}
                        </div>
                      </div>
              </div>
            </div>
          </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </motion.div>

      {/* Modal de detalles de actividad */}
      {selectedTask && (
        <TaskDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          task={selectedTask}
        />
      )}
    </div>
  );
};

export default TareasTab;
