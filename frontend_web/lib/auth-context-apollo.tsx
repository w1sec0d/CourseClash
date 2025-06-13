'use client';

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
  PasswordResetResponse,
  UpdatePasswordResponse,
  AuthError,
} from '@/lib/auth-types';
import {
  useLoginApollo,
  useCurrentUserApollo,
  useLogoutApollo,
} from './auth-hooks-apollo';
import { useMutation, gql } from '@apollo/client';
import {
  setAuthToken,
  setRefreshToken,
  getAuthToken,
} from '@/lib/cookie-utils';

// Mutations adicionales que necesitamos
const REGISTER_MUTATION = gql`
  mutation Register(
    $username: String!
    $email: String!
    $password: String!
    $fullName: String
    $role: UserRole
  ) {
    register(
      username: $username
      email: $email
      password: $password
      fullName: $fullName
      role: $role
    ) {
      __typename
      ... on AuthSuccess {
        user {
          id
          username
          email
          fullName
          avatar
          role
          createdAt
          updatedAt
        }
        token
        refreshToken
        expiresAt
      }
      ... on AuthError {
        message
        code
      }
    }
  }
`;

const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      __typename
      ... on ForgotPasswordSuccess {
        message
        code
        token
      }
      ... on ForgotPasswordError {
        message
        code
      }
    }
  }
`;

const UPDATE_PASSWORD_MUTATION = gql`
  mutation UpdatePassword(
    $newPassword: String!
    $code: String!
    $email: String!
  ) {
    updatePassword(newPassword: $newPassword, code: $code, email: $email) {
      __typename
      ... on UpdatePasswordSuccess {
        message
      }
      ... on UpdatePasswordError {
        message
        code
      }
    }
  }
`;

// Tipo del contexto
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    fullName?: string;
    role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
  }) => Promise<AuthResponse>;
  resetPassword: (email: string) => Promise<PasswordResetResponse>;
  updatePassword: (
    newPassword: string,
    code: string,
    email: string,
    token: string
  ) => Promise<UpdatePasswordResponse>;
  logout: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para usar register con Apollo
function useRegisterApollo() {
  const [registerMutation, { loading }] = useMutation(REGISTER_MUTATION);

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    fullName?: string;
    role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
  }) => {
    try {
      const { data } = await registerMutation({
        variables: userData,
      });

      if (data.register.__typename === 'AuthError') {
        throw new AuthError(
          data.register.message || 'Error al registrar usuario',
          data.register.code,
          true
        );
      }

      // Almacenar tokens en cookies
      setAuthToken(data.register.token);
      if (data.register.refreshToken) {
        setRefreshToken(data.register.refreshToken);
      }

      return data.register;
    } catch (err) {
      if (err instanceof AuthError) {
        throw err;
      }
      throw new AuthError(
        err instanceof Error ? err.message : 'Error al registrar usuario',
        'UNKNOWN_ERROR',
        true
      );
    }
  };

  return { register, loading };
}

// Hook para forgot password con Apollo
function useForgotPasswordApollo() {
  const [forgotPasswordMutation, { loading }] = useMutation(
    FORGOT_PASSWORD_MUTATION
  );
  const [updatePasswordMutation] = useMutation(UPDATE_PASSWORD_MUTATION);

  const requestPasswordReset = async (
    email: string
  ): Promise<PasswordResetResponse> => {
    try {
      const { data } = await forgotPasswordMutation({
        variables: { email },
      });

      if (data.forgotPassword.__typename === 'ForgotPasswordError') {
        throw new AuthError(
          data.forgotPassword.message || 'Error al solicitar recuperación',
          data.forgotPassword.code,
          true
        );
      }

      return data.forgotPassword;
    } catch (err) {
      if (err instanceof AuthError) {
        throw err;
      }
      throw new AuthError(
        err instanceof Error ? err.message : 'Error al solicitar recuperación',
        'SERVER_ERROR',
        true
      );
    }
  };

  const updatePassword = async (
    newPassword: string,
    code: string,
    email: string,
    token: string
  ): Promise<UpdatePasswordResponse> => {
    try {
      const { data } = await updatePasswordMutation({
        variables: { newPassword, code, email },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      if (data.updatePassword.__typename === 'UpdatePasswordError') {
        throw new AuthError(
          data.updatePassword.message || 'Error al actualizar contraseña',
          data.updatePassword.code,
          true
        );
      }

      return data.updatePassword;
    } catch (err) {
      if (err instanceof AuthError) {
        throw err;
      }
      throw new AuthError(
        err instanceof Error ? err.message : 'Error al actualizar contraseña',
        'SERVER_ERROR',
        true
      );
    }
  };

  return { requestPasswordReset, updatePassword, loading };
}

// Provider del contexto
export function AuthProviderApollo({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Hooks de Apollo
  const { login, loading: loginLoading } = useLoginApollo();
  const {
    user,
    loading: userLoading,
    fetchCurrentUser,
  } = useCurrentUserApollo();
  const { logout } = useLogoutApollo();
  const { register, loading: registerLoading } = useRegisterApollo();
  const { requestPasswordReset, updatePassword } = useForgotPasswordApollo();

  const isLoading = userLoading || loginLoading || registerLoading;

  // Handler de login
  const handleLogin = useCallback(
    async (email: string, password: string) => {
      const result = await login(email, password);
      if ('error' in result) {
        throw result.error;
      }
      // Refetch user después del login
      await fetchCurrentUser();
      return result.data;
    },
    [login, fetchCurrentUser]
  );

  // Handler de registro
  const handleRegister = useCallback(
    async (userData: {
      username: string;
      email: string;
      password: string;
      fullName?: string;
      role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
    }) => {
      try {
        const result = await register(userData);
        // Refetch user después del registro
        await fetchCurrentUser();
        return result;
      } catch (error) {
        console.error('Auth context register error:', error);
        throw error;
      }
    },
    [register, fetchCurrentUser]
  );

  // Handler de logout
  const handleLogout = useCallback(async () => {
    const result = await logout();
    setIsAuthenticated(false);
    return result;
  }, [logout]);

  // Handler de reset password
  const handleResetPassword = useCallback(
    async (email: string) => {
      return await requestPasswordReset(email);
    },
    [requestPasswordReset]
  );

  // Handler de update password
  const handleUpdatePassword = useCallback(
    async (newPassword: string, code: string, email: string, token: string) => {
      return await updatePassword(newPassword, code, email, token);
    },
    [updatePassword]
  );

  // Inicialización
  useEffect(() => {
    const token = getAuthToken();

    if (token) {
      // Si hay token, intentar obtener el usuario
      fetchCurrentUser()
        .then((result) => {
          const userData = result?.data?.me;
          setIsAuthenticated(!!userData);
          setIsInitialized(true);
        })
        .catch(() => {
          setIsAuthenticated(false);
          setIsInitialized(true);
        });
    } else {
      setIsAuthenticated(false);
      setIsInitialized(true);
    }
  }, [fetchCurrentUser]);

  // Actualizar estado de autenticación cuando cambia el usuario
  useEffect(() => {
    if (isInitialized) {
      setIsAuthenticated(!!user);
    }
  }, [user, isInitialized]);

  // Token refresh (opcional)
  useEffect(() => {
    if (!isAuthenticated) return;

    const tokenRefreshInterval = setInterval(async () => {
      try {
        await fetchCurrentUser();
      } catch (error) {
        console.error('Error refreshing token:', error);
        handleLogout();
      }
    }, 25 * 60 * 1000); // Cada 25 minutos

    return () => clearInterval(tokenRefreshInterval);
  }, [isAuthenticated, fetchCurrentUser, handleLogout]);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    isInitialized,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    resetPassword: handleResetPassword,
    updatePassword: handleUpdatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook para usar el contexto
export function useAuthApollo() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      'useAuthApollo debe ser utilizado dentro de un AuthProviderApollo'
    );
  }

  return context;
}
