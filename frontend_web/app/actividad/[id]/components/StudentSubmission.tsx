'use client';

import React, { useState, useId, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useSubmissionsApollo } from '@/lib/activities-hooks-apollo';

const SUBMIT_ASSIGNMENT_MUTATION = gql`
  mutation SubmitAssignment(
    $activityId: String!
    $studentId: String!
    $fileUrl: String!
    $comments: String
  ) {
    submitAssignment(
      activityId: $activityId
      studentId: $studentId
      fileUrl: $fileUrl
      comments: $comments
    ) {
      __typename
      ... on SubmissionsSuccess {
        submission {
          id
          activityId
          submittedAt
          content
          fileUrl
          additionalFiles
          isGraded
          canEdit
        }
      }
      ... on SubmissionsError {
        message
        code
      }
    }
  }
`;

interface StudentSubmissionProps {
  activityId: string;
  userId: string;
  dueDate?: string;
  onSubmissionSuccess?: () => void;
}

const StudentSubmission: React.FC<StudentSubmissionProps> = ({
  activityId,
  userId,
  dueDate,
  onSubmissionSuccess
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [comments, setComments] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const fileInputId = useId();
  const [submitAssignment, { loading, error }] = useMutation(SUBMIT_ASSIGNMENT_MUTATION);
  
  // Obtener las entregas del estudiante para verificar si ya entregó y mostrar la calificación
  const { 
    submissions, 
    loading: submissionsLoading, 
    refetch: refetchSubmissions 
  } = useSubmissionsApollo(activityId, userId, 'STUDENT');
  
  // Refetch automático cada 30 segundos para obtener calificaciones actualizadas
  useEffect(() => {
    const interval = setInterval(() => {
      refetchSubmissions();
    }, 30000); // 30 segundos
    
    return () => clearInterval(interval);
  }, [refetchSubmissions]);
  
  // Encontrar la entrega del estudiante (debería ser solo una)
  const mySubmission = submissions.find(s => s.activityId === parseInt(activityId));

  // Verificar si está dentro de la fecha límite
  const isBeforeDeadline = () => {
    if (!dueDate) return true; // Si no hay fecha límite, siempre se puede entregar
    return new Date() < new Date(dueDate);
  };

  // Formatear fecha para mostrar
  const formatDeadline = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null); // Limpiar errores previos
    
    const file = event.target.files?.[0];
    if (file) {
      // Validar tamaño del archivo (máximo 10MB)
      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSizeInBytes) {
        setValidationError('El archivo es demasiado grande. El tamaño máximo es 10MB.');
        event.target.value = ''; // Limpiar el input
        return;
      }
      
      // Validar tipo de archivo
      const allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.zip', '.rar'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        setValidationError('Tipo de archivo no permitido. Solo se permiten: PDF, DOC, DOCX, TXT, ZIP, RAR');
        event.target.value = ''; // Limpiar el input
        return;
      }
      
      setSelectedFile(file);
      // Simular subida de archivo (en producción sería un upload real)
      const mockUrl = `https://storage.courseclash.com/submissions/${activityId}/${userId}/${file.name}`;
      setFileUrl(mockUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null); // Limpiar errores previos
    
    if (!isBeforeDeadline()) {
      setValidationError('La fecha límite para entregar esta tarea ha pasado.');
      return;
    }

    if (!fileUrl && !selectedFile) {
      setValidationError('Por favor selecciona un archivo o proporciona una URL.');
      return;
    }

    try {
      setIsUploading(true);
      
      const finalFileUrl = fileUrl || (selectedFile ? `uploaded_${selectedFile.name}` : '');
      
      const { data } = await submitAssignment({
        variables: {
          activityId,
          studentId: userId,
          fileUrl: finalFileUrl,
          comments: comments || null
        }
      });

      const result = data?.submitAssignment;
      if (result?.__typename === 'SubmissionsError') {
        throw new Error(result.message);
      }
      
      if (result?.__typename === 'SubmissionsSuccess') {
        // Limpiar formulario
        setSelectedFile(null);
        setFileUrl('');
        setComments('');
        setValidationError(null);
        
        // Mostrar mensaje de éxito
        alert('¡Tarea entregada exitosamente!');
        refetchSubmissions(); // Refrescar entregas para mostrar la nueva entrega
        onSubmissionSuccess?.();
      }
    } catch (err) {
      console.error('Error al entregar tarea:', err);
      setValidationError('Error al entregar la tarea. Por favor intenta de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  // Si está vencida, mostrar mensaje
  if (!isBeforeDeadline()) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Entrega de Tarea</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="font-medium text-red-800">Tarea Vencida</h4>
          </div>
          <p className="text-red-700 mt-2">
            La fecha límite para entregar esta tarea era el {dueDate && formatDeadline(dueDate)}. 
            Ya no se pueden realizar entregas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Entrega de Tarea</h3>
      
      {/* Información de fecha límite */}
      {dueDate && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-yellow-800">Fecha límite:</span>
          </div>
          <p className="text-yellow-700 mt-1">{formatDeadline(dueDate)}</p>
        </div>
      )}

      {/* Mostrar entrega existente y calificación */}
      {submissionsLoading ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
            <span className="text-gray-600">Verificando entregas...</span>
          </div>
        </div>
      ) : mySubmission ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="font-medium text-blue-800">Tarea Entregada</h4>
                {mySubmission.isGraded && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Calificada
                  </span>
                )}
              </div>
              
              <div className="space-y-2">
                <p className="text-blue-700 text-sm">
                  <strong>Entregada el:</strong> {formatDeadline(mySubmission.submittedAt || '')}
                </p>
                
                {mySubmission.content && (
                  <p className="text-blue-700 text-sm">
                    <strong>Comentario:</strong> {mySubmission.content}
                  </p>
                )}
                
                {mySubmission.fileUrl && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <a 
                      href={mySubmission.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Ver archivo entregado
                    </a>
                  </div>
                )}
              </div>
              
              {/* Mostrar calificación si existe */}
              {mySubmission.isGraded && mySubmission.latestGrade && (
                <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.95-.69l1.519-4.674z" />
                    </svg>
                    <h5 className="font-medium text-green-800">Tu Calificación</h5>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-700">
                        {mySubmission.latestGrade.score}
                      </span>
                      <span className="text-green-600">/100</span>
                    </div>
                    
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${mySubmission.latestGrade.score}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {mySubmission.latestGrade.feedback && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Retroalimentación del profesor:</p>
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
                        {mySubmission.latestGrade.feedback}
                      </p>
                    </div>
                  )}
                  
                  <p className="text-xs text-green-600 mt-2">
                    Calificada el: {formatDeadline(mySubmission.latestGrade.gradedAt || '')}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {mySubmission.canEdit && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-blue-700 text-sm">
                💡 Puedes actualizar tu entrega usando el formulario a continuación.
              </p>
            </div>
          )}
        </div>
      ) : null}

      {/* Solo mostrar el formulario si no hay entrega o si se puede editar */}
      {(!mySubmission || mySubmission.canEdit) && (
        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Opciones de entrega */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Método de entrega
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                setShowUrlInput(false);
                setValidationError(null);
              }}
              className={`px-4 py-2 rounded-lg border transition ${
                !showUrlInput 
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700' 
                  : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              📎 Subir archivo
            </button>
            <button
              type="button"
              onClick={() => {
                setShowUrlInput(true);
                setValidationError(null);
              }}
              className={`px-4 py-2 rounded-lg border transition ${
                showUrlInput 
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700' 
                  : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              🔗 URL externa
            </button>
          </div>
        </div>

        {/* Subida de archivo */}
        {!showUrlInput && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar archivo
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition">
              <input
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                id={fileInputId}
                accept=".pdf,.doc,.docx,.txt,.zip,.rar"
              />
              <label htmlFor={fileInputId} className="cursor-pointer">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  {selectedFile ? selectedFile.name : 'Haz clic para seleccionar un archivo'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, DOC, DOCX, TXT, ZIP, RAR (max. 10MB)
                </p>
              </label>
            </div>
          </div>
        )}

        {/* URL externa */}
        {showUrlInput && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL del archivo
            </label>
            <input
              type="url"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://drive.google.com/file/..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enlace a Google Drive, Dropbox, etc.
            </p>
          </div>
        )}

        {/* Comentarios */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comentarios (opcional)
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={3}
            placeholder="Agrega cualquier comentario sobre tu entrega..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Errores */}
        {(error || validationError) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">
              {validationError || `Error al entregar: ${error?.message}`}
            </p>
          </div>
        )}

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={(!selectedFile && !fileUrl) || isUploading || loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {isUploading || loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Entregando...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Entregar Tarea
            </>
          )}
        </button>
      </form>
      )}
    </div>
  );
};

export default StudentSubmission; 