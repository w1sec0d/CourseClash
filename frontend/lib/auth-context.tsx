'use client';

// Contexto de autenticación para CourseClash
// Este archivo proporciona un contexto global para gestionar el estado de autenticación
// en toda la aplicación, permitiendo a los componentes acceder fácilmente al usuario actual
// y a las funciones de autenticación.

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthResponse, useCurrentUser, useLogin, useLogout, useRegister } from './auth-hooks';
import { getAuthToken } from './graphql-client';

// Tipo que define la estructura del contexto de autenticación
type AuthContextType = {
  user: User | null;                // Usuario actual o null si no está autenticado
  isLoading: boolean;              // Indica si hay operaciones de autenticación en curso
  isAuthenticated: boolean;        // Indica si el usuario está autenticado
  login: (email: string, password: string) => Promise<AuthResponse>; // Función para iniciar sesión
  register: (userData: {          // Función para registrar un nuevo usuario
    username: string;
    email: string;
    password: string;
    name?: string;
    role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
  }) => Promise<AuthResponse>;
  logout: () => Promise<boolean>;  // Función para cerrar sesión
};

// Creación del contexto de autenticación con valor inicial undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto de autenticación que envuelve la aplicación
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { user, loading: userLoading, fetchCurrentUser } = useCurrentUser();
  const { login, loading: loginLoading } = useLogin();
  const { register, loading: registerLoading } = useRegister();
  const { logout } = useLogout();
  
  const isLoading = userLoading || loginLoading || registerLoading;

  useEffect(() => {
    // Check if there's a token in localStorage
    const token = getAuthToken();
    
    if (token) {
      // If token exists, fetch the current user
      fetchCurrentUser().then((userData) => {
        setIsAuthenticated(!!userData);
      });
    } else {
      setIsAuthenticated(false);
    }
  }, [fetchCurrentUser]);

  // Actualiza el estado de autenticación cuando cambia el usuario
  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  // Envuelve la función de login para obtener automáticamente el usuario después del inicio de sesión
  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    await fetchCurrentUser();
    return result;
  };

  // Envuelve la función de registro para obtener automáticamente el usuario después del registro
  const handleRegister = async (userData: {
    username: string;
    email: string;
    password: string;
    name?: string;
    role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
  }) => {
    const result = await register(userData);
    await fetchCurrentUser();
    return result;
  };

  // Envuelve la función de cierre de sesión para limpiar el estado del usuario
  const handleLogout = async () => {
    const result = await logout();
    setIsAuthenticated(false);
    return result;
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
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
