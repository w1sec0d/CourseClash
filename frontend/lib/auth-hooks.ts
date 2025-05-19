'use client';

import { useState, useCallback } from 'react';
import { fetchGraphQL, setAuthToken, clearAuthToken, getAuthHeaders } from './graphql-client';

export type User = {
  id: string;
  username: string;
  email: string;
  name?: string;
  avatar?: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  createdAt: string;
  updatedAt?: string;
};

export type AuthResponse = {
  user: User;
  token: string;
  refreshToken?: string;
  expiresAt?: string;
  __typename?: string; // Para manejar la unión de tipos
};

export type AuthError = {
  message: string;
  code: string;
  __typename: 'AuthError';
};

export type LoginResult = AuthResponse | AuthError;

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
                name
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
      
      const data = await fetchGraphQL({
        query: loginMutation,
        variables: { email, password },
      });
      
      if (data.login.__typename === 'AuthError') {
        throw new Error(data.login.message || 'Error de autenticación');
      }
      
      const authResponse = data.login as AuthResponse;
      
      // Store the token
      setAuthToken(authResponse.token);
      
      setLoading(false);
      return authResponse;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to login';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  return { login, loading, error };
}

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(async (userData: {
    username: string;
    email: string;
    password: string;
    name?: string;
    role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const registerMutation = `
        mutation Register(
          $username: String!
          $email: String!
          $password: String!
          $name: String
          $role: UserRole
        ) {
          register(
            username: $username
            email: $email
            password: $password
            name: $name
            role: $role
          ) {
            __typename
            ... on AuthSuccess {
              user {
                id
                username
                email
                name
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
      
      const data = await fetchGraphQL({
        query: registerMutation,
        variables: userData,
      });
      
      if (data.register.__typename === 'AuthError') {
        throw new Error(data.register.message || 'Error al registrar el usuario');
      }
      
      const authResponse = data.register as AuthResponse;
      
      // Store the token
      setAuthToken(authResponse.token);
      
      setLoading(false);
      return authResponse;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  return { register, loading, error };
}

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const logoutMutation = `
        mutation Logout {
          logout
        }
      `;
      
      // Call the API with authentication headers
      await fetchGraphQL({
        query: logoutMutation,
        headers: getAuthHeaders(),
      });
      
      // Clear the token
      clearAuthToken();
      
      setLoading(false);
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to logout';
      setError(errorMessage);
      setLoading(false);
      // Even if the API call fails, we clear the token
      clearAuthToken();
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
    
    try {
      const meQuery = `
        query Me {
          me {
            id
            username
            email
            name
            avatar
            role
            createdAt
            updatedAt
          }
        }
      `;
      
      // Call the API with authentication headers
      const data = await fetchGraphQL({
        query: meQuery,
        headers: getAuthHeaders(),
      });
      
      setUser(data.me as User);
      setLoading(false);
      return data.me as User;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch current user';
      setError(errorMessage);
      setLoading(false);
      setUser(null);
      return null;
    }
  }, []);

  return { user, loading, error, fetchCurrentUser };
}
