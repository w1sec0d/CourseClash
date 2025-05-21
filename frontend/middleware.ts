import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que requieren autenticación
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/courses',
  '/duelos',
  // Añade aquí más rutas protegidas
];

// Rutas públicas que no requieren autenticación
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Verificar si la ruta actual es protegida
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Verificar si la ruta actual es pública
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Si es una ruta protegida y no hay token, redirigir al login
  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Si es una ruta pública y hay token, redirigir al dashboard
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configurar en qué rutas se ejecutará el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
