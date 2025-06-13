'use client';

import { useMutation, useQuery, gql } from '@apollo/client';
import { useState } from 'react';
import { User, AuthError, AuthErrorCode } from '@/lib/auth-types';
import {
  setAuthToken,
  setRefreshToken,
  getAuthToken,
  clearAuthTokens,
} from '@/lib/cookie-utils';

// Definir las queries y mutations con gql
const LOGIN_MUTATION = gql`
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

const ME_QUERY = gql`
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

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

// Hook de login usando Apollo con manejo mejorado de errores
export function useLoginApollo() {
  const [loginMutation, { loading, error }] = useMutation(LOGIN_MUTATION);
  const [authError, setAuthError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setAuthError(null);

    try {
      const { data } = await loginMutation({
        variables: { email, password },
      });

      // ✅ Caso 1: Respuesta exitosa del servidor, pero error de autenticación
      // (credenciales incorrectas, usuario no encontrado, etc.)
      if (data.login.__typename === 'AuthError') {
        console.log(
          '🔐 Authentication error:',
          data.login.code,
          data.login.message
        );

        const error = new AuthError(
          data.login.message || 'Error de autenticación',
          data.login.code as AuthErrorCode,
          false // ❌ NO es error de servidor, es error de autenticación
        );
        setAuthError(error.message);
        return { error };
      }

      // ✅ Login exitoso - Usar cookies en lugar de localStorage
      console.log('✅ Login successful');
      setAuthToken(data.login.token);
      if (data.login.refreshToken) {
        setRefreshToken(data.login.refreshToken);
      }

      return { data: data.login };
    } catch (err: unknown) {
      // ✅ Caso 2: Error del servidor (network, 500, timeout, etc.)
      console.error('🚨 Server/Network error:', err);

      let errorCode: AuthErrorCode = 'SERVER_ERROR';
      let errorMessage = 'Error del servidor. Intenta de nuevo más tarde.';

      // Clasificar el tipo de error de servidor
      if (err && typeof err === 'object' && 'networkError' in err) {
        const apolloError = err as {
          networkError?: { statusCode?: number; code?: string };
        };
        const networkError = apolloError.networkError;

        if (networkError?.statusCode) {
          switch (networkError.statusCode) {
            case 500:
              errorCode = 'SERVER_ERROR';
              errorMessage =
                'Error interno del servidor. Contacta al soporte técnico.';
              break;
            case 503:
              errorCode = 'SERVER_ERROR';
              errorMessage =
                'Servicio temporalmente no disponible. Intenta más tarde.';
              break;
            case 404:
              errorCode = 'SERVER_ERROR';
              errorMessage = 'Servicio de autenticación no encontrado.';
              break;
            case 401:
              // Este caso raro donde 401 viene como network error
              errorCode = 'INVALID_CREDENTIALS';
              errorMessage = 'Credenciales inválidas.';
              break;
            default:
              errorCode = 'SERVER_ERROR';
              errorMessage = `Error de servidor (${networkError.statusCode}). Intenta más tarde.`;
          }
        } else if (networkError?.code === 'NETWORK_ERROR') {
          errorMessage = 'Error de conexión. Verifica tu internet.';
        } else if (networkError?.code === 'TIMEOUT') {
          errorMessage = 'Tiempo de espera agotado. Intenta de nuevo.';
        }
      } else if (err && typeof err === 'object' && 'graphQLErrors' in err) {
        const apolloError = err as { graphQLErrors?: Array<unknown> };
        if (apolloError.graphQLErrors && apolloError.graphQLErrors.length > 0) {
          // Error GraphQL que no se manejó en el campo union
          errorMessage = 'Error en la consulta GraphQL.';
        }
      }

      const error = new AuthError(
        errorMessage,
        errorCode,
        true // ✅ SÍ es error de servidor
      );
      setAuthError(error.message);
      return { error };
    }
  };

  return {
    login,
    loading,
    error: authError || error?.message || null,
  };
}

// Hook para obtener usuario actual
export function useCurrentUserApollo() {
  console.log('🔑 useCurrentUserApollo');
  console.log('🔑 getAuthToken():', getAuthToken());
  const { data, loading, error, refetch } = useQuery(ME_QUERY, {
    skip: typeof window === 'undefined' || !getAuthToken(),
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  // Si tenemos token pero me es null (token expirado/inválido)
  if (!loading && getAuthToken() && data && data.me === null) {
    console.log(
      '🚨 Token presente pero usuario null - token expirado, limpiando cookies'
    );
    clearAuthTokens();
    window.location.reload();
  }

  return {
    user: data?.me as User | null,
    loading,
    error: error?.message || null,
    fetchCurrentUser: refetch,
  };
}

// Hook de logout
export function useLogoutApollo() {
  const [logoutMutation, { loading }] = useMutation(LOGOUT_MUTATION);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    setError(null);

    try {
      await logoutMutation();

      // Limpiar tokens de cookies
      clearAuthTokens();

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to logout';
      setError(errorMessage);

      // Limpiar tokens incluso si falla la petición
      clearAuthTokens();

      return false;
    }
  };

  return { logout, loading, error };
}
