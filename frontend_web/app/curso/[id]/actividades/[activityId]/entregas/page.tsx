'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
// import { toast } from 'react-hot-toast';

// GraphQL Queries
const GET_SUBMISSIONS = gql`
  query GetSubmissions($activityId: String!, $userId: String!, $userRole: String!) {
    submissions(activityId: $activityId, userId: $userId, userRole: $userRole) {
      ... on SubmissionsSuccessList {
        submission {
          id
          activityId
          userId
          submittedAt
          content
          fileUrl
          additionalFiles
          isGraded
          canEdit
          latestGrade
        }
      }
      ... on SubmissionsErrorList {
        message
        code
      }
    }
  }
`;

const GRADE_SUBMISSION = gql`
  mutation GradeSubmission(
    $score: Float!
    $submissionId: Int!
    $feedback: String
  ) {
    gradeSubmission(
      score: $score
      submissionId: $submissionId
      feedback: $feedback
    ) {
      ... on GradeSuccess {
        grades {
          id
          submissionId
          gradedBy
          gradedAt
          score
          feedback
          scorePercentage
        }
      }
      ... on GradeError {
        message
        code
      }
    }
  }
`;

interface Submission {
  id: number;
  activityId: number;
  userId: number;
  submittedAt: string;
  content?: string;
  fileUrl?: string;
  additionalFiles?: string[];
  isGraded: boolean;
  canEdit: boolean;
  latestGrade?: number;
}

interface Grade {
  id: number;
  submissionId: number;
  gradedBy: number;
  gradedAt: string;
  score: number;
  feedback?: string;
  scorePercentage: number;
}

// Mock user data - en producción vendría del contexto de autenticación
const mockUser = {
  id: '4',
  role: 'teacher' as 'student' | 'teacher',
  name: 'Usuario con Permisos Especiales'
};

// Mock students data - en producción vendría de la API de usuarios
const mockStudents: Record<number, { name: string; email: string; avatar?: string }> = {
  1: { name: 'Ana García', email: 'ana.garcia@university.edu', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
  2: { name: 'Carlos Mendoza', email: 'carlos.mendoza@university.edu', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
  3: { name: 'María López', email: 'maria.lopez@university.edu', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
  4: { name: 'Juan Pérez', email: 'juan.perez@university.edu', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
  5: { name: 'Laura Rodríguez', email: 'laura.rodriguez@university.edu', avatar: 'https://randomuser.me/api/portraits/women/5.jpg' },
  6: { name: 'Pedro Sánchez', email: 'pedro.sanchez@university.edu', avatar: 'https://randomuser.me/api/portraits/men/6.jpg' },
  7: { name: 'Sofia Castro', email: 'sofia.castro@university.edu', avatar: 'https://randomuser.me/api/portraits/women/7.jpg' },
  8: { name: 'Diego Ramírez', email: 'diego.ramirez@university.edu', avatar: 'https://randomuser.me/api/portraits/men/8.jpg' },
};

export default function EntregasPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const activityId = params.activityId as string;
  
  const [user] = useState(mockUser);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
  const [gradeForm, setGradeForm] = useState({
    score: '',
    feedback: ''
  });

  // Fetch submissions
  const { data, loading, error, refetch } = useQuery(GET_SUBMISSIONS, {
    variables: {
      activityId: activityId,
      userId: user.id,
      userRole: user.role.toUpperCase()
    },
    skip: !activityId
  });

  const [gradeSubmission] = useMutation(GRADE_SUBMISSION, {
    onCompleted: (data) => {
      if (data.gradeSubmission.__typename === 'GradeSuccess') {
        alert('¡Entrega calificada exitosamente!');
        setIsGradingModalOpen(false);
        setSelectedSubmission(null);
        setGradeForm({ score: '', feedback: '' });
        refetch();
      } else {
        alert(data.gradeSubmission.message || 'Error al calificar la entrega');
      }
    },
    onError: (error) => {
      alert('Error al calificar la entrega');
      console.error('Error:', error);
    }
  });

  // Handle grade submission
  const handleGradeSubmission = async () => {
    if (!selectedSubmission || !gradeForm.score) {
      alert('Por favor, ingresa una calificación');
      return;
    }

    const score = parseFloat(gradeForm.score);
    if (isNaN(score) || score < 0 || score > 100) {
      alert('La calificación debe ser un número entre 0 y 100');
      return;
    }

    try {
      await gradeSubmission({
        variables: {
          submissionId: selectedSubmission.id,
          score: score,
          feedback: gradeForm.feedback || undefined
        }
      });
    } catch (error) {
      console.error('Error grading submission:', error);
    }
  };

  const openGradingModal = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGradeForm({
      score: submission.latestGrade?.toString() || '',
      feedback: ''
    });
    setIsGradingModalOpen(true);
  };

  const closeGradingModal = () => {
    setIsGradingModalOpen(false);
    setSelectedSubmission(null);
    setGradeForm({ score: '', feedback: '' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStudentInfo = (userId: number) => {
    return mockStudents[userId] || {
      name: `Estudiante ${userId}`,
      email: `estudiante${userId}@university.edu`
    };
  };

  // Extract submissions from GraphQL response
  const submissions: Submission[] = data?.submissions?.__typename === 'SubmissionsSuccessList' 
    ? data.submissions.submission || []
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span>Cargando entregas...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-2">Error al cargar las entregas</div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto container p-4 md:p-6">
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <button
                onClick={() => router.push('/dashboard')}
                className="hover:text-blue-600"
              >
                Dashboard
              </button>
            </li>
            <li className="flex items-center">
              <svg className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <button
                onClick={() => router.push(`/curso/${courseId}`)}
                className="hover:text-blue-600"
              >
                Curso {courseId}
              </button>
            </li>
            <li className="flex items-center">
              <svg className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <button
                onClick={() => router.push(`/curso/${courseId}/actividades`)}
                className="hover:text-blue-600"
              >
                Actividades
              </button>
            </li>
            <li className="flex items-center">
              <svg className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <button
                onClick={() => router.push(`/curso/${courseId}/actividades/${activityId}`)}
                className="hover:text-blue-600"
              >
                Actividad {activityId}
              </button>
            </li>
            <li className="flex items-center">
              <svg className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-900 font-medium">Entregas</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Entregas de Estudiantes</h1>
              <p className="text-gray-600 mt-1">
                Actividad {activityId} • {submissions.length} entrega{submissions.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                👨‍🏫 Modo Docente
              </span>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Lista de Entregas</h2>
          </div>

          {submissions.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay entregas aún</h3>
              <p className="text-gray-600">Los estudiantes aún no han enviado sus trabajos para esta actividad.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {submissions.map((submission) => {
                const student = getStudentInfo(submission.userId); // Using correct user_id
                return (
                  <div key={submission.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-medium text-gray-900">{student.name}</h3>
                            <span className="text-xs text-gray-500">{student.email}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Enviado el {formatDate(submission.submittedAt)}
                          </p>
                          
                          {/* Content Preview */}
                          {submission.content && (
                            <div className="mt-2 p-3 bg-gray-50 rounded-md">
                              <p className="text-sm text-gray-700 line-clamp-3">
                                {submission.content}
                              </p>
                            </div>
                          )}
                          
                          {/* Files */}
                          {submission.fileUrl && (
                            <div className="mt-2 flex items-center space-x-2">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                              <a 
                                href={submission.fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800"
                              >
                                Ver archivo adjunto
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Grade Status and Actions */}
                      <div className="flex items-center space-x-3">
                        {submission.isGraded ? (
                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                ✓ Calificada
                              </span>
                              <span className="text-lg font-bold text-green-600">
                                {submission.latestGrade}/100
                              </span>
                            </div>
                            <button
                              onClick={() => openGradingModal(submission)}
                              className="mt-1 text-sm text-blue-600 hover:text-blue-800"
                            >
                              Editar calificación
                            </button>
                          </div>
                        ) : (
                          <div className="text-right">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mb-2">
                              ⏳ Pendiente
                            </span>
                            <br />
                            <button
                              onClick={() => openGradingModal(submission)}
                              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center space-x-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              <span>Calificar</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Grading Modal */}
        {isGradingModalOpen && selectedSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Calificar Entrega</h3>
                  <button
                    onClick={closeGradingModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Estudiante: {getStudentInfo(selectedSubmission.userId).name}
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-1">
                    Calificación (0-100)
                  </label>
                  <input
                    type="number"
                    id="score"
                    min="0"
                    max="100"
                    step="0.1"
                    value={gradeForm.score}
                    onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: 85.5"
                  />
                </div>

                <div>
                  <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                    Retroalimentación (opcional)
                  </label>
                  <textarea
                    id="feedback"
                    rows={4}
                    value={gradeForm.feedback}
                    onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Comentarios para el estudiante..."
                  />
                </div>

                {/* Submission Preview */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Vista previa de la entrega:</h4>
                  {selectedSubmission.content && (
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-700">{selectedSubmission.content}</p>
                    </div>
                  )}
                  {selectedSubmission.fileUrl && (
                    <div className="mt-2">
                      <a 
                        href={selectedSubmission.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span>Abrir archivo adjunto</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={closeGradingModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGradeSubmission}
                  disabled={!gradeForm.score}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedSubmission.isGraded ? 'Actualizar Calificación' : 'Calificar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}