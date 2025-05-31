'use client';

import { useMutation, useQuery, gql } from '@apollo/client';
import { useState } from 'react';
import { User, AuthError, AuthErrorCode } from './auth-hooks';

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

// Hook de login usando Apollo
export function useLoginApollo() {
  const [loginMutation, { loading, error }] = useMutation(LOGIN_MUTATION);
  const [authError, setAuthError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setAuthError(null);

    try {
      const { data } = await loginMutation({
        variables: { email, password },
      });

      if (data.login.__typename === 'AuthError') {
        const error = new AuthError(
          data.login.message || 'Error de autenticación',
          data.login.code as AuthErrorCode,
          true
        );
        setAuthError(error.message);
        return { error };
      }

      // Almacenar tokens
      localStorage.setItem('auth_token', data.login.token);
      if (data.login.refreshToken) {
        localStorage.setItem('refresh_token', data.login.refreshToken);
      }

      return { data: data.login };
    } catch (err) {
      const error = new AuthError(
        err instanceof Error ? err.message : 'Error de autenticación',
        'UNKNOWN_ERROR',
        true
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
  const { data, loading, error, refetch } = useQuery(ME_QUERY, {
    skip: typeof window === 'undefined' || !localStorage.getItem('auth_token'),
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

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

      // Limpiar tokens
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to logout';
      setError(errorMessage);

      // Limpiar tokens incluso si falla la petición
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');

      return false;
    }
  };

  return { logout, loading, error };
}
