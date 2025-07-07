import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { getAuthToken, clearAuthTokens } from '@/lib/cookie-utils';

// HTTP Link for client-side requests
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_GATEWAY_URL
    ? `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/graphql`
    : 'https://localhost/api/graphql',
  credentials: 'include',
});

// HTTP Link for server-side requests (uses internal Docker service name)
const ssrHttpLink = createHttpLink({
  uri: 'http://cc_ag:8080/api/graphql',
  credentials: 'include',
});

// Auth Link - Añade automáticamente el token a las peticiones desde cookies
const authLink = setContext((_, { headers }) => {
  // Solo en el cliente
  if (typeof window !== 'undefined') {
    const token = getAuthToken();
    return {
      headers: {
        ...headers,
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    };
  }
  return { headers };
});

// Error Link - Manejo centralizado de errores
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`Network error: ${networkError}`);

    // Manejo específico de errores de autenticación
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      // Token expirado o inválido
      if (typeof window !== 'undefined') {
        clearAuthTokens(); // Usar utilidad de cookies
        window.location.href = '/login';
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
  },
  connectToDevTools: true,
  ssrMode: typeof window === 'undefined',
});

// Cliente Apollo para SSR (sin auth link para evitar errores de localStorage)
export const createSSRApolloClient = () => {
  return new ApolloClient({
    link: from([errorLink, ssrHttpLink]), // Use SSR-specific HTTP link
    cache: createApolloCache(),
    ssrMode: true,
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
      },
      query: {
        errorPolicy: 'all',
      },
    },
  });
};
