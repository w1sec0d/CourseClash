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
        }
      `;
      
      const data = await fetchGraphQL({
        query: loginMutation,
        variables: { email, password },
      });
      
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
        mutation Register($input: RegisterInput!) {
          register(input: $input) {
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
        }
      `;
      
      const data = await fetchGraphQL({
        query: registerMutation,
        variables: { input: userData },
      });
      
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
