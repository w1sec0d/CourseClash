'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSubmissionsApollo, useActivityApollo, Submission } from '@/lib/activities-hooks-apollo';
import { useAuthApollo } from '@/lib/auth-context-apollo';
import Link from 'next/link';
// import GradeSubmissionModal from '../components/GradeSubmissionModal';

export default function ActivitySubmissions() {
  const params = useParams();
  const router = useRouter(); 
  const activityId = params.id as string;
  
  const { user } = useAuthApollo();
  const { activity, loading: activityLoading } = useActivityApollo(activityId);
  const { 
    submissions, 
    loading: submissionsLoading, 
    error: submissionsError
    // refetch 
  } = useSubmissionsApollo(
    activityId, 
    user?.id?.toString() || '', 
    user?.role || 'STUDENT'
  );
  
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  
  // Verificar si el usuario es profesor o admin
  const isTeacherOrAdmin = user?.role === 'TEACHER' || user?.role === 'ADMIN';
  
  // Redirigir si no es profesor o admin
  if (!isTeacherOrAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Acceso denegado</h2>
          <p className="text-gray-600 mb-4">Solo profesores y administradores pueden ver las entregas</p>
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (activityLoading || submissionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (submissionsError || !activity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error al cargar las entregas</h2>
          <p className="text-gray-600 mb-4">{submissionsError || 'Actividad no encontrada'}</p>
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

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

  const getSubmissionStatus = (submission: Submission) => {
    if (submission.isGraded) {
      return {
        label: 'Calificada',
        color: 'bg-green-100 text-green-800 border-green-200'
      };
    }
    return {
      label: 'Pendiente',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
  };

  const handleGradeSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsGradeModalOpen(true);
  };

  // const handleGradeSuccess = () => {
  //   setIsGradeModalOpen(false);
  //   setSelectedSubmission(null);
  //   refetch(); // Refrescar las entregas
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header con navegación */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href={`/curso?id=${activity.courseId}`} className="hover:text-indigo-600 transition">
              Curso
            </Link>
            <span>{'>'}</span>
            <Link href={`/actividad/${activityId}`} className="hover:text-indigo-600 transition">
              {activity.title}
            </Link>
            <span>{'>'}</span>
            <span className="text-gray-900 font-medium">Entregas</span>
          </nav>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Entregas: {activity.title}
              </h1>
              <p className="text-gray-600">
                Gestiona y califica las entregas de los estudiantes
              </p>
            </div>
            
            {/* Botones de acción */}
            <div className="flex gap-3">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Volver
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de entregas</p>
                <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Calificadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.filter(s => s.isGraded).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.filter(s => !s.isGraded).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de entregas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Entregas de estudiantes</h2>
          </div>
          
          {submissions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay entregas</h3>
              <p className="text-gray-500">Aún no se han recibido entregas para esta actividad.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {submissions.map((submission) => {
                const status = getSubmissionStatus(submission);
                
                return (
                  <div key={submission.id} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            Entrega #{submission.id}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>
                            {status.label}
                          </span>
                          {submission.latestGrade && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                              Nota: {submission.latestGrade.score}
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Fecha de entrega</p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatDate(submission.submittedAt)}
                            </p>
                          </div>
                          {submission.latestGrade && (
                            <div>
                              <p className="text-sm text-gray-600">Fecha de calificación</p>
                              <p className="text-sm font-medium text-gray-900">
                                {formatDate(submission.latestGrade.gradedAt)}
                              </p>
                            </div>
                          )}
                        </div>

                        {submission.content && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-1">Comentario del estudiante</p>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {submission.content}
                              </p>
                            </div>
                          </div>
                        )}

                        {submission.fileUrl && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">Archivo entregado</p>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">Documento entregado</p>
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

                        {submission.latestGrade?.feedback && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-1">Retroalimentación del profesor</p>
                            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                              <p className="text-sm text-blue-700 whitespace-pre-wrap">
                                {submission.latestGrade.feedback}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="ml-6 flex flex-col gap-2">
                        <button
                          onClick={() => handleGradeSubmission(submission)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                            submission.isGraded
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          {submission.isGraded ? 'Actualizar nota' : 'Calificar'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal de calificación */}
      {isGradeModalOpen && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Calificar Entrega #{selectedSubmission.id}
              </h2>
              <button
                onClick={() => {
                  setIsGradeModalOpen(false);
                  setSelectedSubmission(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Funcionalidad de calificación en desarrollo. 
                Por ahora, puedes ver los detalles de la entrega en la lista.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsGradeModalOpen(false);
                    setSelectedSubmission(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}