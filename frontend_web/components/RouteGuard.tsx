'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthApollo } from '@/lib/auth-context-apollo';
import LoadingSpinner from './LoadingSpinner';

// Lista de rutas protegidas que requieren autenticación
const protectedRoutes = [
  '/dashboard',
  '/duelos',
  '/courses',
  '/profile',
  '/configuracion',
];

// Lista de rutas que solo pueden acceder usuarios no autenticados
const authOnlyRoutes = ['/login', '/register', '/registro', '/forgot-password'];

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isInitialized } = useAuthApollo();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Solo ejecutar la protección cuando el contexto de auth esté inicializado
    if (!isInitialized) return;

    // Verificar si la ruta actual es protegida
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // Verificar si la ruta actual es solo para usuarios no autenticados
    const isAuthOnlyRoute = authOnlyRoutes.some((route) =>
      pathname.startsWith(route)
    );

    console.log('🛡️ RouteGuard check:', {
      pathname,
      isAuthenticated,
      isInitialized,
      isProtectedRoute,
      isAuthOnlyRoute,
    });

    // Si el usuario está autenticado y trata de acceder a rutas de auth
    if (isAuthenticated && isAuthOnlyRoute) {
      console.log(
        '🔄 Redirecting authenticated user from auth route to dashboard'
      );
      router.push('/dashboard');
      return;
    }

    // Si el usuario no está autenticado y trata de acceder a rutas protegidas
    if (!isAuthenticated && isProtectedRoute) {
      console.log('🔄 Redirecting unauthenticated user to login');
      const loginUrl = `/login?from=${encodeURIComponent(pathname)}`;
      router.push(loginUrl);
      return;
    }
  }, [isAuthenticated, isInitialized, pathname, router]);

  // Mostrar loading mientras se inicializa la autenticación
  if (!isInitialized) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <LoadingSpinner />
      </div>
    );
  }

  // Verificaciones de protección en tiempo real (mientras navega)
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthOnlyRoute = authOnlyRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Bloquear acceso a rutas protegidas si no está autenticado
  if (!isAuthenticated && isProtectedRoute) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <LoadingSpinner />
          <p className='mt-4 text-gray-600'>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Bloquear acceso a rutas de auth si ya está autenticado
  if (isAuthenticated && isAuthOnlyRoute) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <LoadingSpinner />
          <p className='mt-4 text-gray-600'>Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
