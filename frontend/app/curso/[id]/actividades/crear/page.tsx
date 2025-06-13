'use client';

import { useParams, useRouter } from 'next/navigation';
import CreateActivityForm from '@/components/activities/CreateActivityForm';

export default function CrearActividadPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const handleSuccess = (activity: { id: string }) => {
    // Redirigir a la vista de la actividad creada
    router.push(`/curso/${courseId}/actividades/${activity.id}`);
  };

  const handleCancel = () => {
    // Regresar a la página del curso
    router.push(`/curso/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
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
              <span className="text-gray-900 font-medium">Crear Actividad</span>
            </li>
          </ol>
        </nav>

        {/* Contenido principal */}
        <CreateActivityForm
          courseId={parseInt(courseId)}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
} 