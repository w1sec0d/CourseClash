'use client';

import { useState, useEffect } from 'react';
import { Activity, useUpdateActivityApollo } from '@/lib/activities-hooks-apollo';

interface EditActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity;
  onActivityUpdated?: () => void;
}

const EditActivityModal: React.FC<EditActivityModalProps> = ({
  isOpen,
  onClose,
  activity,
  onActivityUpdated
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    activityType: 'TASK' as 'TASK' | 'QUIZ' | 'ANNOUNCEMENT',
    dueDate: '',
    fileUrl: ''
  });

  const { updateActivity, loading, error } = useUpdateActivityApollo();

  // Inicializar formulario con datos de la actividad
  useEffect(() => {
    if (activity) {
      setFormData({
        title: activity.title,
        description: activity.description || '',
        activityType: activity.activityType,
        dueDate: activity.dueDate ? new Date(activity.dueDate).toISOString().slice(0, 16) : '',
        fileUrl: activity.fileUrl || ''
      });
    }
  }, [activity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateActivity({
        id: activity.id.toString(),
        title: formData.title,
        description: formData.description || undefined,
        activityType: formData.activityType,
        dueDate: formData.dueDate || undefined,
        fileUrl: formData.fileUrl || undefined
      });
      
      // Notificar que se actualizó la actividad
      onActivityUpdated?.();
      
      // Cerrar modal
      onClose();
      
    } catch (err) {
      console.error('Error actualizando actividad:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Editar Actividad
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Ej: Tarea de Programación"
            />
          </div>

          {/* Tipo de Actividad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Actividad *
            </label>
            <select
              name="activityType"
              value={formData.activityType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="TASK">📋 Tarea</option>
              <option value="QUIZ">❓ Quiz</option>
              <option value="ANNOUNCEMENT">📢 Anuncio</option>
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Describe los detalles de la actividad..."
            />
          </div>

          {/* Fecha de Vencimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Vencimiento
            </label>
            <input
              type="datetime-local"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* URL de Archivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de Archivo (opcional)
            </label>
            <input
              type="url"
              name="fileUrl"
              value={formData.fileUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="https://ejemplo.com/archivo.pdf"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Información adicional */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Información actual:</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>ID:</strong> {activity.id}</p>
              <p><strong>Creada:</strong> {new Date(activity.createdAt).toLocaleDateString()}</p>
              <p><strong>Curso:</strong> {activity.courseId}</p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Actualizando...' : 'Actualizar Actividad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditActivityModal; 