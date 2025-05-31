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
 * Establece el token de autenticación
 */
export const setAuthToken = (token: string) => {
  setCookie(AUTH_TOKEN_NAME, token);
};

/**
 * Obtiene el token de autenticación
 */
export const getAuthToken = (): string | null => {
  return getCookie(AUTH_TOKEN_NAME);
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
