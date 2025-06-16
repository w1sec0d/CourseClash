import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthApollo } from '@/lib/auth-context-apollo';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'STUDENT' | 'TEACHER' | 'ADMIN';
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, isInitialized } = useAuthApollo();

  useEffect(() => {
    // Solo verificar cuando se haya inicializado
    if (!isInitialized) {
      console.log('🔒 ProtectedRoute: Not initialized yet, waiting...');
      return;
    }

    const checkAuth = async () => {
      console.log('🔒 ProtectedRoute: Checking authentication with Apollo');
      console.log('🔒 ProtectedRoute: Current path:', window.location.pathname);
      console.log('🔒 ProtectedRoute: isAuthenticated:', isAuthenticated);
      console.log('🔒 ProtectedRoute: user:', user);
      console.log('🔒 ProtectedRoute: requiredRole:', requiredRole);

      if (!isAuthenticated || !user) {
        console.log(
          '❌ ProtectedRoute: User not authenticated, redirecting to login'
        );
        const currentPath = window.location.pathname;
        router.push(`/login?from=${encodeURIComponent(currentPath)}`);
        return;
      }

      if (requiredRole && user.role !== requiredRole) {
        console.log(
          `🚫 ProtectedRoute: User role ${user.role} doesn't match required role ${requiredRole}, redirecting to dashboard`
        );
        router.push('/dashboard');
        return;
      }

      console.log('✅ ProtectedRoute: Authentication check passed');
    };

    checkAuth();
  }, [isInitialized, isAuthenticated, user, router, requiredRole]);

  // Mostrar loading mientras se inicializa o está cargando
  if (!isInitialized || isLoading) {
    console.log('🔒 ProtectedRoute: Showing loading spinner');
    return <LoadingSpinner />;
  }

  // Si no está autenticado, no mostrar nada (se redirigirá)
  if (!isAuthenticated || !user) {
    console.log('🔒 ProtectedRoute: Not authenticated, showing nothing');
    return null;
  }

  // Si requiere un rol específico y no lo tiene, no mostrar nada
  if (requiredRole && user.role !== requiredRole) {
    console.log('🔒 ProtectedRoute: Role mismatch, showing nothing');
    return null;
  }

  console.log('🔒 ProtectedRoute: Rendering children');
  return <>{children}</>;
}
