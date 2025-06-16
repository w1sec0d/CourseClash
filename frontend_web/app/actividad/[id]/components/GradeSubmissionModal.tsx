'use client';

import { useState, useEffect } from 'react';
import { useGradeSubmissionApollo, Submission } from '@/lib/activities-hooks-apollo';

interface GradeSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: Submission;
  onSuccess: () => void;
}

export default function GradeSubmissionModal({
  isOpen,
  onClose,
  submission,
  onSuccess,
}: GradeSubmissionModalProps) {
  const [score, setScore] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { gradeSubmission, loading } = useGradeSubmissionApollo();

  // Pre-llenar el formulario si ya existe una calificación
  useEffect(() => {
    if (isOpen && submission) {
      if (submission.latestGrade) {
        setScore(submission.latestGrade.score.toString());
        setFeedback(submission.latestGrade.feedback || '');
      } else {
        setScore('');
        setFeedback('');
      }
      setError(null);
    }
  }, [isOpen, submission]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!score || isNaN(Number(score))) {
      setError('Por favor ingresa una calificación válida');
      return;
    }

    const numScore = Number(score);
    if (numScore < 0 || numScore > 100) {
      setError('La calificación debe estar entre 0 y 100');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await gradeSubmission({
        submissionId: submission.id,
        score: numScore,
        feedback: feedback.trim() || undefined,
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al calificar la entrega');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {submission.isGraded ? 'Actualizar Calificación' : 'Calificar Entrega'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            disabled={isSubmitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Información de la entrega */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Entrega</p>
              <p className="text-sm font-medium text-gray-900">#{submission.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fecha de entrega</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(submission.submittedAt)}
              </p>
            </div>
          </div>

          {submission.content && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Comentario del estudiante</p>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {submission.content}
                </p>
              </div>
            </div>
          )}

          {submission.fileUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Archivo entregado</p>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Documento</p>
                  <p className="text-xs text-gray-500">{submission.fileUrl}</p>
                </div>
                <a
                  href={submission.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  Ver
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Formulario de calificación */}
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-2">
                Calificación (0-100) *
              </label>
              <input
                type="number"
                id="score"
                min="0"
                max="100"
                step="0.1"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Ej: 85"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                Retroalimentación (opcional)
              </label>
              <textarea
                id="feedback"
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
                placeholder="Proporciona comentarios constructivos sobre la entrega del estudiante..."
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting || loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Calificando...
                </>
              ) : (
                submission.isGraded ? 'Actualizar Calificación' : 'Calificar Entrega'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 