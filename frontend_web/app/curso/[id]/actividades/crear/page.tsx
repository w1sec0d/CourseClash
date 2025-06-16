'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CreateActivityForm from '@/components/activities/CreateActivityForm';
import { isAuthenticated, getAuthToken, simulateDevLogin, debugAuth, clearAuthTokens, useRealBackendToken } from '@/lib/cookie-utils';

export default function CrearActividadPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Verificar autenticación al cargar la página
  useEffect(() => {
    const checkAuthentication = () => {
      try {
        const authenticated = isAuthenticated();
        const token = getAuthToken();
        
        console.log('🔍 Verificando autenticación:', { authenticated, hasToken: !!token });
        
        if (!authenticated || !token) {
          setAuthError('Debes iniciar sesión para crear actividades');
          // Redirigir al login después de un breve delay
          setTimeout(() => {
            router.push(`/login?redirect=/curso/${courseId}/actividades/crear`);
          }, 2000);
        } else {
          setAuthError(null);
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        setAuthError('Error verificando la autenticación');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, [router, courseId]);

  const handleSuccess = (activity: { id: string }) => {
    // Redirigir a la vista de la actividad creada
    router.push(`/curso/${courseId}/actividades/${activity.id}`);
  };

  const handleCancel = () => {
    // Regresar a la página del curso
    router.push(`/curso/${courseId}`);
  };

  const handleRetryAuth = () => {
    router.push(`/login?redirect=/curso/${courseId}/actividades/crear`);
  };

  const handleDevLogin = async () => {
    const success = await simulateDevLogin();
    if (success) {
      setAuthError(null);
      setIsCheckingAuth(false);
      console.log('✅ Login de desarrollo exitoso');
    } else {
      setAuthError('Error creando token de desarrollo');
    }
  };

  const handleDebugAuth = () => {
    debugAuth();
  };

  const handleClearAuth = () => {
    clearAuthTokens();
    setAuthError('Tokens limpiados - recarga la página');
  };

  const handleUseRealToken = () => {
    const token = useRealBackendToken();
    if (token) {
      setAuthError(null);
      setIsCheckingAuth(false);
      console.log('✅ Token real del backend aplicado');
    } else {
      setAuthError('Error aplicando token real');
    }
  };

  // Mostrar loading mientras se verifica la autenticación
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Verificando permisos...</span>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error de autenticación
  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Autenticación Requerida
            </h2>
            <p className="text-gray-600 mb-6">
              {authError}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRetryAuth}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Iniciar Sesión
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Volver al Curso
              </button>
            </div>
            
            {/* Herramientas de desarrollo */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-sm font-medium text-yellow-800 mb-3">
                  🔧 Herramientas de Desarrollo
                </h3>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={handleUseRealToken}
                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                  >
                    🔑 Usar Token Real
                  </button>
                  <button
                    onClick={handleDevLogin}
                    className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700"
                  >
                    Simular Login Dev
                  </button>
                  <button
                    onClick={handleDebugAuth}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                  >
                    Debug Auth
                  </button>
                  <button
                    onClick={handleClearAuth}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  >
                    Limpiar Tokens
                  </button>
                </div>
                <p className="text-xs text-yellow-700 mt-2">
                  Estas herramientas solo están disponibles en modo desarrollo
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

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