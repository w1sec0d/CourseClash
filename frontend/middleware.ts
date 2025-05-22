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

// Obtener la URL de la API basada en el entorno
function getApiUrl(): string {
  // En desarrollo, usamos localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8080';
  }
  // En producción, usamos la URL del API Gateway
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
}

async function validateToken(token: string): Promise<boolean> {
  const apiUrl = getApiUrl();

  // Si no tenemos una URL válida, hacemos una validación básica del token
  if (!apiUrl) {
    return Boolean(token && token.length > 0);
  }

  try {
    const response = await fetch(`${apiUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          query Me {
            me {
              id
              username
              email
            }
          }
        `,
      }),
    });

    const data = await response.json();
    return data.data?.me !== null;
  } catch (error) {
    console.error('Error validating token:', error);
    // En caso de error, permitimos el acceso si el token existe
    return Boolean(token && token.length > 0);
  }
}

export async function middleware(request: NextRequest) {
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

  // Si hay token, validarlo
  if (token) {
    const isValidToken = await validateToken(token);

    // Si el token no es válido, redirigir al login
    if (!isValidToken) {
      const url = new URL('/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }

    // Si es una ruta pública y el token es válido, redirigir al dashboard
    if (isPublicRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
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
