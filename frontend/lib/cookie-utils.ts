/**
 * Utilidades para manejo seguro de cookies
 * Reemplaza el uso de localStorage para tokens de autenticación
 */

// Configuración de cookies seguras
const COOKIE_OPTIONS = {
  path: '/',
  maxAge: 30 * 24 * 60 * 60, // 30 días en segundos
  secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
  sameSite: 'strict' as const,
};

/**
 * Establece una cookie con opciones de seguridad
 */
export const setCookie = (
  name: string,
  value: string,
  options?: Partial<typeof COOKIE_OPTIONS>
) => {
  if (typeof window === 'undefined') return;

  const cookieOptions = { ...COOKIE_OPTIONS, ...options };

  let cookieString = `${name}=${encodeURIComponent(value)}`;
  cookieString += `; path=${cookieOptions.path}`;
  cookieString += `; max-age=${cookieOptions.maxAge}`;
  cookieString += `; samesite=${cookieOptions.sameSite}`;

  if (cookieOptions.secure) {
    cookieString += '; secure';
  }

  document.cookie = cookieString;
};

/**
 * Obtiene el valor de una cookie
 */
export const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;

  const cookies = document.cookie.split(';');

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }

  return null;
};

/**
 * Elimina una cookie
 */
export const deleteCookie = (name: string) => {
  if (typeof window === 'undefined') return;

  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict`;
};

/**
 * Obtiene todas las cookies como un objeto
 */
export const getAllCookies = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};

  const cookies: Record<string, string> = {};

  document.cookie.split(';').forEach((cookie) => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });

  return cookies;
};

// Funciones específicas para tokens de autenticación
export const AUTH_TOKEN_NAME = 'auth_token';
export const REFRESH_TOKEN_NAME = 'refresh_token';

/**
 * Genera un token mock para desarrollo
 * IMPORTANTE: Este token es solo para desarrollo y NO debe usarse en producción
 */
const generateMockToken = (): string => {
  const mockPayload = {
    userId: '4', // Usuario con permisos especiales
    role: 'teacher',
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // Expira en 24 horas
    iat: Math.floor(Date.now() / 1000),
    iss: 'courseclash-dev',
    permissions: ['create_activity', 'edit_activity', 'view_submissions', 'manage_course']
  };
  
  // Simular un JWT (NO usar en producción)
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify(mockPayload));
  const signature = 'mock-signature-for-development-only';
  
  return `${header}.${payload}.${signature}`;
};

/**
 * Simula una autenticación exitosa para desarrollo
 * Esto debería ser suficiente para bypass la validación del backend en modo dev
 */
export const simulateDevLogin = async (): Promise<boolean> => {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('⚠️ simulateDevLogin solo funciona en modo desarrollo');
    return false;
  }

  try {
    console.log('🔧 Simulando login de desarrollo...');
    
    // Crear token mock
    const mockToken = generateMockToken();
    setAuthToken(mockToken);
    
    console.log('✅ Token de desarrollo creado exitosamente');
    console.log('🔧 Usuario simulado: ID 4 (teacher con permisos especiales)');
    
    return true;
  } catch (error) {
    console.error('❌ Error simulando login:', error);
    return false;
  }
};

/**
 * Establece el token de autenticación
 */
export const setAuthToken = (token: string) => {
  setCookie(AUTH_TOKEN_NAME, token);
};

/**
 * Obtiene el token de autenticación
 */
export const getAuthToken = (): string | null => {
  const token = getCookie(AUTH_TOKEN_NAME);
  
  // En desarrollo, crear un token mock si no existe
  if (!token && process.env.NODE_ENV === 'development') {
    console.warn('🔧 Modo desarrollo: No hay token, creando uno automáticamente');
    const mockToken = generateMockToken();
    setAuthToken(mockToken);
    return mockToken;
  }
  
  return token;
};

/**
 * Establece el token de refresh
 */
export const setRefreshToken = (token: string) => {
  setCookie(REFRESH_TOKEN_NAME, token, {
    maxAge: 30 * 24 * 60 * 60, // 30 días para refresh token
  });
};

/**
 * Obtiene el token de refresh
 */
export const getRefreshToken = (): string | null => {
  return getCookie(REFRESH_TOKEN_NAME);
};

/**
 * Limpia todos los tokens de autenticación
 */
export const clearAuthTokens = () => {
  deleteCookie(AUTH_TOKEN_NAME);
  deleteCookie(REFRESH_TOKEN_NAME);
};

/**
 * Verifica si el usuario está autenticado (tiene token)
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Fuerza la creación de un token mock para desarrollo
 */
export const createMockAuthForDevelopment = () => {
  if (process.env.NODE_ENV === 'development') {
    const mockToken = generateMockToken();
    setAuthToken(mockToken);
    console.log('🔧 Token mock creado para desarrollo');
    return mockToken;
  }
  return null;
};

/**
 * Función de desarrollo para debug de autenticación
 */
export const debugAuth = () => {
  if (process.env.NODE_ENV === 'development') {
    const token = getAuthToken();
    const allCookies = getAllCookies();
    
    console.group('🔍 Debug de Autenticación');
    console.log('Token presente:', !!token);
    console.log('Longitud del token:', token?.length || 0);
    console.log('Todas las cookies:', allCookies);
    console.log('Es autenticado:', isAuthenticated());
    console.groupEnd();
    
    if (token) {
      try {
        // Intentar decodificar el payload del JWT mock
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          console.log('📋 Payload del token:', payload);
        }
      } catch (e) {
        console.log('❌ No se pudo decodificar el token');
      }
    }
  }
};

/**
 * Limpia completamente todas las cookies de la aplicación
 * Útil para logout completo o limpieza de datos
 */
export const clearAllAppCookies = () => {
  // Limpiar tokens de autenticación
  clearAuthTokens();

  // Limpiar otras cookies de la aplicación si existen
  deleteCookie('courseclash_migration_completed');

  console.log('🧹 Todas las cookies de la aplicación han sido limpiadas');
};

/**
 * Establece un token real obtenido del backend
 */
export const setRealAuthToken = (token: string) => {
  setAuthToken(token);
  console.log('✅ Token real establecido desde el backend');
};

/**
 * Usar el token real obtenido del registro del backend
 * Este token fue generado por el servicio de autenticación real
 */
export const useRealBackendToken = () => {
  if (process.env.NODE_ENV === 'development') {
    // Token real obtenido del backend de autenticación
    const realToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJ0ZWFjaGVyQHRlc3QuY29tIiwiaXNfc3VwZXJ1c2VyIjp0cnVlLCJleHAiOjE3NDk4ODQ4Mzd9.I2TWYGyMvhf21pvCo4_hFB5AvfIbBsKmo92P7Kxkdwo";
    
    setRealAuthToken(realToken);
    console.log('🔧 Usando token real del backend (usuario: teacher1, ID: 5)');
    return realToken;
  }
  return null;
};
