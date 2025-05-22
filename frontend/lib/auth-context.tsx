'use client';

// Contexto de autenticación para CourseClash
// Este archivo proporciona un contexto global para gestionar el estado de autenticación
// en toda la aplicación, permitiendo a los componentes acceder fácilmente al usuario actual
// y a las funciones de autenticación.

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import {
  User,
  AuthResponse,
  useCurrentUser,
  useLogin,
  useLogout,
  useRegister,
  useForgotPassword,
  PasswordResetResponse,
  UpdatePasswordResponse,
  AuthError,
} from './auth-hooks';
import { getAuthToken } from './graphql-client';

// Tipo que define la estructura del contexto de autenticación
type AuthContextType = {
  user: User | null; // Usuario actual o null si no está autenticado
  isLoading: boolean; // Indica si hay operaciones de autenticación en curso
  isAuthenticated: boolean; // Indica si el usuario está autenticado
  isInitialized: boolean; // Añadimos este nuevo estado
  login: (email: string, password: string) => Promise<AuthResponse>; // Función para iniciar sesión
  register: (userData: {
    // Función para registrar un nuevo usuario
    username: string;
    email: string;
    password: string;
    name?: string;
    role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
  }) => Promise<AuthResponse>;
  resetPassword: (email: string) => Promise<PasswordResetResponse>;
  updatePassword: (
    newPassword: string,
    code: string,
    email: string,
    token: string
  ) => Promise<UpdatePasswordResponse>;
  logout: () => Promise<boolean>; // Función para cerrar sesión
};

// Creación del contexto de autenticación con valor inicial undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto de autenticación que envuelve la aplicación
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false); // Nuevo estado
  const { user, loading: userLoading, fetchCurrentUser } = useCurrentUser();
  const { login, loading: loginLoading } = useLogin();
  const { requestPasswordReset, updatePassword } = useForgotPassword();
  const { register, loading: registerLoading } = useRegister();
  const { logout } = useLogout();

  const isLoading = userLoading || loginLoading || registerLoading;

  // Define all handler functions with useCallback before useEffect hooks
  // Envuelve la función de login para obtener automáticamente el usuario después del inicio de sesión
  const handleLogin = useCallback(
    async (email: string, password: string) => {
      const result = await login(email, password);
      await fetchCurrentUser();
      return result;
    },
    [login, fetchCurrentUser]
  );

  // Envuelve la función de registro para obtener automáticamente el usuario después del registro
  const handleRegister = useCallback(
    async (userData: {
      username: string;
      email: string;
      password: string;
      name?: string;
      role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
    }) => {
      try {
        const result = await register(userData);
        await fetchCurrentUser();
        return result;
      } catch (error) {
        console.error('Auth context register error:', {
          error,
          isAuthError: error instanceof AuthError,
          errorType: error?.constructor?.name,
          errorMessage:
            error instanceof Error ? error.message : 'Unknown error',
        });

        // Si ya es un AuthError, lo re-lanzamos
        if (error instanceof AuthError) {
          throw error;
        }

        // Si no es un AuthError, lo transformamos
        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === 'string'
            ? error
            : JSON.stringify(error);

        throw new AuthError(errorMessage, 'UNKNOWN_ERROR', true);
      }
    },
    [register, fetchCurrentUser]
  );

  // Envuelve la función de cierre de sesión para limpiar el estado del usuario
  const handleLogout = useCallback(async () => {
    const result = await logout();
    setIsAuthenticated(false);
    return result;
  }, [logout, setIsAuthenticated]);

  useEffect(() => {
    // Check if there's a token in localStorage
    const token = getAuthToken();

    if (token) {
      // If token exists, fetch the current user
      fetchCurrentUser().then((userData) => {
        setIsAuthenticated(!!userData);
        setIsInitialized(true); // Marcamos como inicializado después de verificar
      });
    } else {
      setIsAuthenticated(false);
      setIsInitialized(true); // Marcamos como inicializado si no hay token
    }
  }, [fetchCurrentUser]);

  const handleResetPassword = useCallback(
    async (email: string) => {
      try {
        const result = await requestPasswordReset(email);
        return result;
      } catch (error) {
        console.error('Error requesting password reset:', error);
        throw error;
      }
    },
    [requestPasswordReset]
  );

  const handleUpdatePassword = useCallback(
    async (newPassword: string, code: string, email: string, token: string) => {
      try {
        const result = await updatePassword(newPassword, code, email, token);
        return result;
      } catch (error) {
        console.error('Error updating password:', error);
        throw error;
      }
    },
    [updatePassword]
  );

  // Actualiza el estado de autenticación cuando cambia el usuario
  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  // Set up a timer to refresh the token before it expires
  useEffect(() => {
    if (!isAuthenticated) return;

    // Set a timer to refresh the token 5 minutes before it expires
    const tokenRefreshInterval = setInterval(async () => {
      try {
        // This would call your refresh token mutation
        // For now, we'll just re-fetch the current user to verify the session
        await fetchCurrentUser();
      } catch (error) {
        console.error('Error refreshing token:', error);
        // If refreshing fails, log the user out
        handleLogout();
      }
    }, 25 * 60 * 1000); // Every 25 minutes (assuming tokens expire after 30 minutes)

    return () => clearInterval(tokenRefreshInterval);
  }, [isAuthenticated, fetchCurrentUser, handleLogout]);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    isInitialized, // Exponemos el nuevo estado
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    resetPassword: handleResetPassword,
    updatePassword: handleUpdatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personalizado para acceder al contexto de autenticación desde cualquier componente
export function useAuth() {
  const context = useContext(AuthContext);

  // Verifica que el hook se esté utilizando dentro de un AuthProvider
  if (context === undefined) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }

  return context;
}
