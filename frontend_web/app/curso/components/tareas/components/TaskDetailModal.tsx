'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  CalendarDaysIcon, 
  ClockIcon, 
  DocumentTextIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Activity, useSubmissionsApollo } from '@/lib/activities-hooks-apollo';
import { useAuthApollo } from '@/lib/auth-context-apollo';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Activity;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ isOpen, onClose, task }) => {
  const { user } = useAuthApollo();
  const [submissionContent, setSubmissionContent] = useState('');
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Obtener submissions para esta actividad
  const { 
    submissions,
    refetch: refetchSubmissions 
  } = useSubmissionsApollo(
    task.id.toString(), 
    user?.id?.toString() || '', 
    user?.role || 'STUDENT'
  );

  const getActivityIcon = () => {
    switch (task.activityType) {
      case 'TASK':
        return <AcademicCapIcon className="w-5 h-5 text-blue-600" />;
      case 'QUIZ':
        return <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />;
      default:
        return <AcademicCapIcon className="w-5 h-5 text-blue-600" />;
    }
  };

  const getActivityLabel = () => {
    switch (task.activityType) {
      case 'TASK':
        return 'Tarea';
      case 'QUIZ':
        return 'Quiz';
      default:
        return 'Actividad';
    }
  };

  const getActivityColor = () => {
    switch (task.activityType) {
      case 'TASK':
        return 'bg-blue-100';
      case 'QUIZ':
        return 'bg-orange-100';
      default:
        return 'bg-blue-100';
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

  const isOverdue = task.dueDate ? new Date(task.dueDate) < new Date() : false;
  const hasSubmission = submissions && submissions.length > 0;
  const latestSubmission = hasSubmission ? submissions[0] : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionContent.trim() && !submissionFile) return;

    setIsSubmitting(true);
    try {
      // Aquí iría la lógica para enviar la submission
      // Por ahora simulamos un delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Limpiar formulario
      setSubmissionContent('');
      setSubmissionFile(null);
      
      // Refrescar submissions
      await refetchSubmissions();
      
    } catch (error) {
      console.error('Error al enviar la actividad:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSubmissionFile(file);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getActivityColor()}`}>
                {getActivityIcon()}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
                <p className="text-sm text-gray-500">{getActivityLabel()} del curso</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Información de la actividad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {task.dueDate && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarDaysIcon className="w-4 h-4" />
                  <span>Fecha límite: {formatDate(task.dueDate)}</span>
                  {isOverdue && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                      Vencida
                    </span>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ClockIcon className="w-4 h-4" />
                <span>Creada: {formatDate(task.createdAt)}</span>
              </div>
            </div>

            {/* Descripción */}
            {task.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
                </div>
              </div>
            )}

            {/* Archivo adjunto */}
            {task.fileUrl && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Archivo adjunto</h3>
                <a
                  href={task.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <DocumentTextIcon className="w-4 h-4" />
                  Ver archivo
                </a>
              </div>
            )}

            {/* Estado de la entrega */}
            {hasSubmission && latestSubmission && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tu entrega</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">
                      {latestSubmission.isGraded ? 'Calificada' : 'Entregada'}
                    </span>
                    {latestSubmission.submittedAt && (
                      <span className="text-sm text-green-600">
                        - {formatDate(latestSubmission.submittedAt)}
                      </span>
                    )}
                  </div>
                  
                  {latestSubmission.content && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-700">{latestSubmission.content}</p>
                    </div>
                  )}
                  
                  {latestSubmission.isGraded && latestSubmission.latestGrade && (
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <AcademicCapIcon className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-gray-900">
                          Calificación: {latestSubmission.latestGrade.score}/100
                        </span>
                      </div>
                      {latestSubmission.latestGrade.feedback && (
                        <p className="text-sm text-gray-600">
                          <strong>Comentarios:</strong> {latestSubmission.latestGrade.feedback}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Formulario de entrega */}
            {(!hasSubmission || (latestSubmission && latestSubmission.canEdit)) && !isOverdue && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {hasSubmission ? `Actualizar ${getActivityLabel().toLowerCase()}` : 
                   task.activityType === 'TASK' ? 'Entregar tarea' : 'Realizar quiz'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {task.activityType === 'TASK' ? 'Comentarios o respuesta' : 'Respuestas del quiz'}
                    </label>
                    <textarea
                      value={submissionContent}
                      onChange={(e) => setSubmissionContent(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={
                        task.activityType === 'TASK' 
                          ? "Escribe tu respuesta o comentarios sobre la tarea..."
                          : "Escribe tus respuestas al quiz..."
                      }
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Archivo (opcional)
                    </label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    />
                    {submissionFile && (
                      <p className="text-sm text-gray-600 mt-1">
                        Archivo seleccionado: {submissionFile.name}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting || (!submissionContent.trim() && !submissionFile)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <PaperAirplaneIcon className="w-4 h-4" />
                      )}
                      {isSubmitting ? 'Enviando...' : 
                       hasSubmission ? 'Actualizar' : 
                       task.activityType === 'TASK' ? 'Entregar' : 'Enviar'}
                    </motion.button>
                    
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Mensaje si está vencida */}
            {isOverdue && !hasSubmission && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <ClockIcon className="w-5 h-5" />
                  <span className="font-medium">Esta {getActivityLabel().toLowerCase()} ha vencido</span>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  Ya no es posible {task.activityType === 'TASK' ? 'entregar esta tarea' : 'realizar este quiz'}.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskDetailModal; 