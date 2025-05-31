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
      const token = localStorage.getItem('auth_token');

      if (!token) {
        const currentPath = window.location.pathname;
        router.push(`/login?from=${encodeURIComponent(currentPath)}`);
        return;
      }

      try {
        const currentUser = await fetchCurrentUser();

        if (!currentUser) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          const currentPath = window.location.pathname;
          router.push(`/login?from=${encodeURIComponent(currentPath)}`);
          return;
        }

        if (requiredRole && currentUser.role !== requiredRole) {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        const currentPath = window.location.pathname;
        router.push(`/login?from=${encodeURIComponent(currentPath)}`);
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
    return null;
  }

  if (requiredRole && user.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
