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
    
    console.log('🔐 Login attempt:', { email, timestamp: new Date().toISOString() });
    
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
      
      console.log('📤 Sending login request to API Gateway');
      const data = await fetchGraphQL({
        query: loginMutation,
        variables: { email, password },
      });
      
      console.log('📥 Received login response:', { 
        type: data.login.__typename,
        success: data.login.__typename === 'AuthSuccess',
        timestamp: new Date().toISOString() 
      });
      
      if (data.login.__typename === 'AuthError') {
        throw new Error(data.login.message || 'Error de autenticación');
      }
      
      const authResponse = data.login as AuthResponse;
      
      // Store the token
      setAuthToken(authResponse.token);
      console.log('🔑 Auth token stored successfully');
      
      setLoading(false);
      return authResponse;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to login';
      console.error('❌ Login error:', errorMessage);
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
    
    console.log('📝 Register attempt:', { 
      username: userData.username, 
      email: userData.email,
      role: userData.role,
      timestamp: new Date().toISOString() 
    });
    
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
      
      console.log('📤 Sending register request to API Gateway');
      const data = await fetchGraphQL({
        query: registerMutation,
        variables: userData,
      });
      
      console.log('📥 Received register response:', { 
        type: data.register.__typename,
        success: data.register.__typename === 'AuthSuccess',
        timestamp: new Date().toISOString() 
      });
      
      if (data.register.__typename === 'AuthError') {
        throw new Error(data.register.message || 'Error al registrar el usuario');
      }
      
      const authResponse = data.register as AuthResponse;
      
      // Store the token
      setAuthToken(authResponse.token);
      console.log('🔑 Auth token stored for new user');
      
      setLoading(false);
      return authResponse;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register';
      console.error('❌ Registration error:', errorMessage);
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
    
    console.log('🚪 Logout attempt:', { timestamp: new Date().toISOString() });
    
    try {
      const logoutMutation = `
        mutation Logout {
          logout
        }
      `;
      
      console.log('📤 Sending logout request to API Gateway');
      // Call the API with authentication headers
      await fetchGraphQL({
        query: logoutMutation,
        headers: getAuthHeaders(),
      });
      console.log('📥 Received logout response');
      
      // Clear the token
      clearAuthToken();
      console.log('🔓 Auth token cleared');
      
      setLoading(false);
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to logout';
      console.error('❌ Logout error:', errorMessage);
      setError(errorMessage);
      setLoading(false);
      // Even if the API call fails, we clear the token
      clearAuthToken();
      console.log('🔓 Auth token cleared (after error)');
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
      
      console.log('📤 Sending user session request to API Gateway');
      // Call the API with authentication headers
      const data = await fetchGraphQL({
        query: meQuery,
        headers: getAuthHeaders(),
      });
      
      if (data.me) {
        console.log('📥 User session found:', {
          id: data.me.id,
          username: data.me.username,
          role: data.me.role,
          timestamp: new Date().toISOString()
        });
        setUser(data.me as User);
      } else {
        console.log('📥 No active user session found');
        setUser(null);
      }
      
      setLoading(false);
      return data.me as User;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch current user';
      console.error('❌ User session error:', errorMessage);
      setError(errorMessage);
      setLoading(false);
      setUser(null);
      return null;
    }
  }, []);

  return { user, loading, error, fetchCurrentUser };
}
