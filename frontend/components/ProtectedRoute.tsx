import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/lib/auth-hooks';
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
  const { user, loading, error, fetchCurrentUser } = useCurrentUser();

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await fetchCurrentUser();

      if (!currentUser) {
        // Guardar la URL actual para redirigir después del login
        const currentPath = window.location.pathname;
        router.push(`/login?from=${encodeURIComponent(currentPath)}`);
        return;
      }

      if (requiredRole && currentUser.role !== requiredRole) {
        router.push('/dashboard');
      }
    };

    checkAuth();
  }, [fetchCurrentUser, router, requiredRole]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-red-500'>Error: {error}</div>
      </div>
    );
  }

  if (!user) {
    return null; // No renderizar nada mientras se redirige
  }

  if (requiredRole && user.role !== requiredRole) {
    return null; // No renderizar nada mientras se redirige
  }

  return <>{children}</>;
}
