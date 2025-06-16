'use client';

import { useState, useId } from 'react';
import { useMutation, gql } from '@apollo/client';

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
    </div>
  );
};

export default StudentSubmission; 