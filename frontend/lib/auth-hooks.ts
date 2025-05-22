'use client';

import { useState, useCallback, useEffect } from 'react';
import { fetchGraphQL, getAuthHeaders } from './graphql-client';

export type User = {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  avatar?: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  createdAt: string;
  updatedAt?: string;
  coins?: number;
  notifications?: number;
  level?: number;
  achievements?: number;
  courses?: Array<{
    id: string;
    name: string;
    image?: string;
  }>;
};

export class AuthError extends Error {
  public isServerError: boolean;

  constructor(
    message: string,
    public code: AuthErrorCode = 'UNKNOWN_ERROR',
    isServerError?: boolean
  ) {
    super(message);
    this.name = 'AuthError';
    Object.setPrototypeOf(this, AuthError.prototype);
    this.isServerError = isServerError ?? false;
  }
}

export type AuthErrorCode =
  | 'UNKNOWN_ERROR'
  | 'USER_NOT_FOUND'
  | 'INVALID_CREDENTIALS'
  | 'SERVER_ERROR'
  | 'INVALID_CODE'
  | 'EMAIL_EXISTS'
  | 'INVALID_TOKEN'
  | 'TOKEN_EXPIRED';

export type AuthResponse = {
  code: string;
  user: User;
  token: string;
  refreshToken?: string;
  expiresAt?: string;
  __typename?: string;
};

export type PasswordResetResponse = {
  message: string;
  code: string;
  token: string;
  __typename: 'ForgotPasswordSuccess' | 'ForgotPasswordError';
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<PasswordResetResponse>;
  updatePassword: (
    newPassword: string,
    code: string
  ) => Promise<PasswordResetResponse>;
};

export type LoginResult = AuthResponse | AuthError;

export type UpdatePasswordResponse = {
  message: string;
  __typename: 'UpdatePasswordSuccess' | 'UpdatePasswordError';
};

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const loginMutation = `
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
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

      console.log('📤 Sending login request to API Gateway');
      const data = await fetchGraphQL({
        query: loginMutation,
        variables: { email, password },
      });
      console.log('🔑 Login response:', data);

      console.log('📥 Received login response:', {
        type: data.login.__typename,
        success: data.login.__typename === 'AuthSuccess',
        timestamp: new Date().toISOString(),
      });

      if (data.login.__typename === 'AuthError') {
        const authError = new AuthError(
          data.login.message || 'Error de autenticación',
          data.login.code as AuthErrorCode,
          true
        );
        setError(authError.message);
        return { error: authError };
      }

      const authResponse = data.login as AuthResponse;
      console.log('🔑 Auth token', data.login);

      // Set the token in an HTTP-only cookie
      document.cookie = `auth_token=${authResponse.token}; path=/; secure; samesite=strict`;

      // If you have a refresh token, set it in a separate cookie
      if (authResponse.refreshToken) {
        document.cookie = `refresh_token=${authResponse.refreshToken}; path=/; secure; samesite=strict`;
      }

      console.log('🔑 Auth token stored in cookies');
      setLoading(false);
      return { data: authResponse };
    } catch (err: unknown) {
      console.error('❌ Login error:', err);
      setLoading(false);

      if (err instanceof AuthError) {
        setError(err.message);
        return { error: err };
      }

      const error = new AuthError(
        err instanceof Error ? err.message : 'Error de autenticación',
        'UNKNOWN_ERROR',
        true
      );
      setError(error.message);
      return { error };
    }
  }, []);

  return { login, loading, error };
}

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(
    async (userData: {
      username: string;
      email: string;
      password: string;
      fullName?: string;
      role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
    }) => {
      setLoading(true);
      setError(null);

      console.log('📝 Register attempt:', {
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role,
        timestamp: new Date().toISOString(),
      });

      try {
        const registerMutation = `
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

        console.log('📤 Sending register request to API Gateway');
        const data = await fetchGraphQL({
          query: registerMutation,
          variables: userData,
        });

        console.log('📥 Received register response:', {
          type: data.register.__typename,
          success: data.register.__typename === 'AuthSuccess',
          timestamp: new Date().toISOString(),
        });

        if (data.register.__typename === 'AuthError') {
          console.log('📥 AuthError received:', {
            message: data.register.message,
            code: data.register.code,
            type: data.register.__typename,
          });

          const errorMessage =
            typeof data.register.message === 'string'
              ? data.register.message
              : JSON.stringify(data.register.message);

          throw new AuthError(
            errorMessage,
            data.register.code as AuthErrorCode,
            true
          );
        }

        const authResponse = data.register as AuthResponse;

        // Store the token in an HTTP-only cookie
        document.cookie = `auth_token=${authResponse.token}; path=/; secure; samesite=strict`;

        // If you have a refresh token, set it in a separate cookie
        if (authResponse.refreshToken) {
          document.cookie = `refresh_token=${authResponse.refreshToken}; path=/; secure; samesite=strict`;
        }

        console.log('🔑 Auth token stored in cookies for new user');

        setLoading(false);
        return authResponse;
      } catch (err: unknown) {
        console.error('Registration error:', err);
        setLoading(false);

        if (err instanceof AuthError) {
          setError(err.message);
          throw err;
        }

        const error = new AuthError(
          err instanceof Error ? err.message : 'Error al registrar el usuario',
          'UNKNOWN_ERROR',
          true
        );
        setError(error.message);
        throw error;
      }
    },
    []
  );

  return { register, loading, error };
}

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    console.log('🚪 Logout attempt:', { timestamp: new Date().toISOString() });

    try {
      const logoutMutation = `
          mutation Logout {
            logout
          }
        `;

      console.log('📤 Sending logout request to API Gateway');
      await fetchGraphQL({
        query: logoutMutation,
        headers: getAuthHeaders(),
      });
      console.log('📥 Received logout response');

      // Clear the cookies
      document.cookie =
        'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict';
      document.cookie =
        'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict';

      console.log('🔓 Auth tokens cleared from cookies');
      setLoading(false);
      return true;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to logout';
      console.error('❌ Logout error:', errorMessage);
      setError(errorMessage);
      setLoading(false);
      // Even if the API call fails, we clear the cookies
      document.cookie =
        'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict';
      document.cookie =
        'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict';
      console.log('🔓 Auth tokens cleared from cookies (after error)');
      return false;
    }
  }, []);

  return { logout, loading, error };
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    console.log('👤 Fetching current user session');
    const headers = getAuthHeaders();
    console.log('🔑 Headers being sent:', headers);

    try {
      const meQuery = `
          query Me {
            me {
              id
              username
              email
              fullName
              avatar
              role
              createdAt
              updatedAt
            }
          }
        `;

      console.log('📤 Sending user session request to API Gateway');
      const data = await fetchGraphQL({
        query: meQuery,
        headers: headers,
      });

      console.log('📥 Raw response:', data);
      console.log('me data', data);
      console.log('Auth headers:', headers);

      if (data.me) {
        console.log('�� User session found:', {
          id: data.me.id,
          username: data.me.username,
          fullName: data.me.fullName,
          role: data.me.role,
          timestamp: new Date().toISOString(),
        });
        setUser(data.me as User);
      } else {
        console.log('📥 No active user session found');
        setUser(null);
      }

      setLoading(false);
      return data.me as User;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch current user';
      console.error('❌ User session error:', errorMessage);
      setError(errorMessage);
      setLoading(false);
      setUser(null);
      return null;
    }
  }, []);

  // Fetch user on mount
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return { user, loading, error, fetchCurrentUser };
}

export function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestPasswordReset = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);

    console.log('🔑 Password reset request:', {
      email,
      timestamp: new Date().toISOString(),
    });

    try {
      const forgotPasswordMutation = `
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

      console.log('📤 Sending password reset request to API Gateway');
      const data = await fetchGraphQL({
        query: forgotPasswordMutation,
        variables: { email },
      });

      console.log('📥 Received password reset response:', {
        type: data.forgotPassword.__typename,
        success: data.forgotPassword.__typename === 'ForgotPasswordSuccess',
        timestamp: new Date().toISOString(),
      });

      if (data.forgotPassword.__typename === 'ForgotPasswordError') {
        console.log('Error details:', {
          code: data.forgotPassword.code,
          message: data.forgotPassword.message,
        });

        // Map error codes to specific error types
        switch (data.forgotPassword.code) {
          case 'USER_NOT_FOUND':
            throw new AuthError('Email not registered', 'USER_NOT_FOUND');
          case 'SERVER_ERROR':
            throw new AuthError(
              data.forgotPassword.message || 'Error del servidor',
              'SERVER_ERROR',
              true
            );
          default:
            throw new AuthError(
              data.forgotPassword.message || 'Error al procesar la solicitud',
              data.forgotPassword.code,
              true
            );
        }
      }

      console.log('data recieved', data.forgotPassword);
      setLoading(false);
      return data.forgotPassword as PasswordResetResponse;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to request password reset';
      console.error('❌ Password reset request error:', errorMessage);
      setError(errorMessage);
      setLoading(false);

      // Re-throw the error with proper typing
      if (err instanceof AuthError) {
        throw err;
      }
      throw new AuthError(errorMessage, 'SERVER_ERROR', true);
    }
  }, []);

  const updatePassword = useCallback(
    async (newPassword: string, code: string, email: string, token: string) => {
      setLoading(true);
      setError(null);

      console.log('🔑 Updating password:', {
        email,
        code,
        token: token.substring(0, 10) + '...', // Log only part of token for security
        timestamp: new Date().toISOString(),
      });

      try {
        const updatePasswordMutation = `
          mutation UpdatePassword($newPassword: String!, $code: String!, $email: String!) {
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

        console.log('📤 Sending password update request to API Gateway');
        const data = await fetchGraphQL({
          query: updatePasswordMutation,
          variables: { newPassword, code, email },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('📥 Received password update response:', {
          type: data.updatePassword.__typename,
          success: data.updatePassword.__typename === 'UpdatePasswordSuccess',
          message: data.updatePassword.message,
          code: data.updatePassword.code,
          timestamp: new Date().toISOString(),
        });

        if (data.updatePassword.__typename === 'UpdatePasswordError') {
          console.log('Error details:', {
            code: data.updatePassword.code,
            message: data.updatePassword.message,
          });

          throw new AuthError(
            data.updatePassword.message || 'Error al actualizar la contraseña',
            data.updatePassword.code,
            true
          );
        }

        setLoading(false);
        return data.updatePassword as UpdatePasswordResponse;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update password';
        console.error('❌ Password update error:', {
          message: errorMessage,
          error: err,
          timestamp: new Date().toISOString(),
        });
        setError(errorMessage);
        setLoading(false);

        // Re-throw the error with proper typing
        if (err instanceof AuthError) {
          throw err;
        }
        throw new AuthError(errorMessage, 'SERVER_ERROR', true);
      }
    },
    []
  );

  return { requestPasswordReset, updatePassword, loading, error };
}
