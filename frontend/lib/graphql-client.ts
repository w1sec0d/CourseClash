// Utilidad de cliente GraphQL para el frontend de CourseClash
// Este archivo proporciona funciones para comunicarse con la API GraphQL
// y gestionar los tokens de autenticación en el navegador.

// Función para ejecutar consultas/mutaciones GraphQL
export async function fetchGraphQL({
  query,
  variables = {},
  headers = {},
  cache = 'no-store', // Por defecto no-store para operaciones relacionadas con autenticación
}: {
  query: string;
  variables?: Record<string, unknown>;
  headers?: Record<string, string>;
  cache?: RequestCache;
}) {
  try {
    // Endpoint del API Gateway
    const apiGatewayUrl =
      process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080';
    const endpoint = `${apiGatewayUrl}/api/graphql`;
    console.log('Endpoint:', endpoint);

    // Start request timing for performance monitoring
    const requestStartTime = performance.now();

    // Get operation name for better logging
    const operationType = query.includes('mutation') ? 'Mutation' : 'Query';
    const operationNameMatch = query.match(/(?:mutation|query)\s+(\w+)/i);
    const operationName = operationNameMatch
      ? operationNameMatch[1]
      : 'Unknown';

    // Show detailed request info with timestamp
    console.group(
      `🔄 GraphQL ${operationType}: ${operationName} (${new Date().toISOString()})`
    );
    console.log('📡 Request to:', endpoint);
    console.log(
      '📝 Query:',
      query.slice(0, 150) + (query.length > 150 ? '...' : '')
    );
    console.log('📦 Variables:', variables);
    console.log('🔖 Headers:', {
      ...headers,
      'Content-Type': 'application/json',
    });
    console.groupEnd();

    // delay request
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      cache,
      credentials: 'include', // Include credentials for cross-origin requests if needed
    });

    // Handle HTTP errors
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP error ${res.status}: ${errorText}`);
    }

    const json = await res.json();

    // Calculate request duration
    const requestDuration = performance.now() - requestStartTime;

    // Log response information
    console.group(
      `📷 GraphQL Response: ${operationName} (${requestDuration.toFixed(0)}ms)`
    );
    if (json.errors) {
      console.error('❌ GraphQL Errors:', json.errors);
      console.log('⏱ Duration:', `${requestDuration.toFixed(0)}ms`);
      console.groupEnd();

      const error = json.errors[0] || {
        message: 'Error during GraphQL request',
      };
      const errorMessage = error.message || 'Unknown GraphQL error';
      throw new Error(errorMessage);
    } else {
      console.log('✅ Status: Success');
      console.log('📄 Data Keys:', Object.keys(json.data || {}));
      console.log('⏱ Duration:', `${requestDuration.toFixed(0)}ms`);
      console.groupEnd();
    }

    return json.data;
  } catch (error) {
    console.error('Error fetching GraphQL:', error);
    throw error;
  }
}

// Almacena el token de autenticación en cookies (solo en el cliente)
export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    // Guardar en cookies con flags de seguridad
    document.cookie = `auth_token=${token}; path=/; max-age=2592000; secure; samesite=strict`;
  }
};

// Obtiene el token de autenticación desde cookies (solo en el cliente)
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find((cookie) =>
      cookie.trim().startsWith('auth_token=')
    );
    if (authCookie) {
      return authCookie.split('=')[1];
    }
  }
  return null;
};

// Elimina el token de autenticación de cookies (solo en el cliente)
export const clearAuthToken = () => {
  if (typeof window !== 'undefined') {
    document.cookie =
      'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict';
  }
};

// Añade el token de autenticación a las cabeceras si está disponible
export function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
