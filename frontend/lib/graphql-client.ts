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
    const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080';
    const endpoint = `${apiGatewayUrl}/graphql`;

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
    });

    const json = await res.json();

    // Manejo de errores GraphQL
    if (json.errors) {
      const { message } = json.errors[0] || 'Error during GraphQL request';
      throw new Error(message);
    }

    return json.data;
  } catch (error) {
    console.error('Error fetching GraphQL:', error);
    throw error;
  }
}

// Almacena el token de autenticación en localStorage (solo en el cliente)
export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

// Obtiene el token de autenticación desde localStorage (solo en el cliente)
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Elimina el token de autenticación de localStorage (solo en el cliente)
export const clearAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
};

// Añade el token de autenticación a las cabeceras si está disponible
export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};
