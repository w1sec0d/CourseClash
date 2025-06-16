import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { getAuthToken, clearAuthTokens } from '@/lib/cookie-utils';

// Configuración de desarrollo
const isDevelopment = process.env.NODE_ENV === 'development';

// HTTP Link base
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_GATEWAY_URL
    ? `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/graphql`
    : 'http://localhost:8080/api/graphql',
  credentials: 'include',
});

// Auth Link - Añade automáticamente el token a las peticiones desde cookies
const authLink = setContext((_, { headers }) => {
  // Solo en el cliente
  if (typeof window !== 'undefined') {
    const token = getAuthToken();
    
    // En desarrollo, mostrar información del token
    if (isDevelopment) {
      console.log('🔐 Token de autenticación:', token ? '✅ Presente' : '❌ No encontrado');
    }
    
    // Headers base
    const authHeaders: Record<string, string> = {
      ...headers,
    };
    
    // Añadir token si existe
    if (token) {
      authHeaders.authorization = `Bearer ${token}`;
    }
    
    // En desarrollo, añadir headers especiales para bypass
    if (isDevelopment) {
      authHeaders['x-dev-mode'] = 'true';
      authHeaders['x-dev-user-id'] = '4'; // Usuario con permisos especiales
      console.log('🔧 Modo desarrollo: Headers especiales añadidos');
    }
    
    return {
      headers: authHeaders,
    };
  }
  return { headers };
});

// Error Link - Manejo centralizado de errores
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      
      // Manejo específico de errores de token
      if (message.includes('Token inválido') || 
          message.includes('Token expirado') || 
          message.includes('Token invalido o expirado') ||
          extensions?.code === 'UNAUTHENTICATED') {
        
        console.warn('🚨 Error de autenticación detectado:', message);
        
        if (typeof window !== 'undefined') {
          // En desarrollo, mostrar información adicional
          if (isDevelopment) {
            console.warn('🔧 Modo desarrollo: Error de token detectado');
            console.warn('Intenta crear un token de desarrollo válido o contacta al backend');
            
            // Mostrar modal de desarrollo
            if (window.confirm('Error de autenticación en modo desarrollo. ¿Quieres ir al login?')) {
              const currentPath = window.location.pathname;
              window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
            }
            return; // No limpiar tokens en desarrollo para debug
          }
          
          clearAuthTokens();
          
          // Solo redirigir si no estamos ya en la página de login
          if (!window.location.pathname.includes('/login')) {
            const currentPath = window.location.pathname;
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          }
        }
      }
    });
  }

  if (networkError) {
    console.error(`Network error: ${networkError}`);

    // Manejo específico de errores de autenticación
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      console.warn('🚨 Error HTTP 401: No autorizado');
      
      if (typeof window !== 'undefined') {
        if (isDevelopment) {
          console.warn('🔧 Error 401 en modo desarrollo');
          return;
        }
        
        clearAuthTokens();
        
        if (!window.location.pathname.includes('/login')) {
          const currentPath = window.location.pathname;
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    }
  }
});

// Configuración del cache con transformaciones de nombres
const createApolloCache = () =>
  new InMemoryCache({
    typePolicies: {
      User: {
        fields: {
          fullName: {
            // Transforma automáticamente entre camelCase y snake_case
            read(existing, { readField }) {
              return existing || readField('full_name');
            },
          },
          createdAt: {
            read(existing, { readField }) {
              return existing || readField('created_at');
            },
          },
          updatedAt: {
            read(existing, { readField }) {
              return existing || readField('updated_at');
            },
          },
        },
      },
      // Puedes añadir más tipos aquí
    },
  });

// Cliente Apollo para el cliente (con auth)
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: createApolloCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all', // Importante para capturar errores de mutación
    },
  },
  ssrMode: typeof window === 'undefined',
});

// Cliente Apollo para SSR (sin auth link para evitar errores de localStorage)
export const createSSRApolloClient = () => {
  return new ApolloClient({
    link: from([errorLink, httpLink]), // Sin auth link en el servidor
    cache: createApolloCache(),
    ssrMode: true,
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
      },
      query: {
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });
};

// Función de utilidad para verificar el estado de autenticación
export const checkAuthStatus = () => {
  if (typeof window === 'undefined') return { isAuthenticated: false, token: null };
  
  const token = getAuthToken();
  const isAuthenticated = !!token;
  
  if (isDevelopment) {
    console.log('📊 Estado de autenticación:', { 
      isAuthenticated, 
      hasToken: !!token,
      tokenLength: token?.length || 0 
    });
  }
  
  return { isAuthenticated, token };
};

// Función para crear un contexto de desarrollo válido
export const createDevelopmentAuthContext = () => {
  if (isDevelopment) {
    console.log('🔧 Creando contexto de autenticación para desarrollo');
    return {
      userId: '4',
      role: 'teacher',
      permissions: ['create_activity', 'edit_activity', 'view_submissions'],
      devMode: true
    };
  }
  return null;
};
