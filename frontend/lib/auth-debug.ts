/**
 * Utilidades de debug para autenticación
 * Ayuda a diagnosticar problemas de token en desarrollo
 */

import { getAuthToken } from './cookie-utils';

const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:8000';
const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080';

/**
 * Verifica el token directamente con el servicio de autenticación
 */
export const verifyTokenWithAuthService = async (token?: string): Promise<{
  valid: boolean;
  user?: any;
  error?: string;
}> => {
  const authToken = token || getAuthToken() || '';
  
  if (!authToken) {
    return { valid: false, error: 'No token provided' };
  }

  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const userData = await response.json();
      return { valid: true, user: userData };
    } else {
      const errorData = await response.text();
      return { 
        valid: false, 
        error: `HTTP ${response.status}: ${errorData}` 
      };
    }
  } catch (error) {
    return { 
      valid: false, 
      error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};

/**
 * Prueba la creación de actividad directamente con el API Gateway
 */
export const testCreateActivityDirectly = async (courseId: number): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> => {
  const token = getAuthToken();
  
  if (!token) {
    return { success: false, error: 'No auth token available' };
  }

  const query = `
    mutation TestCreateActivity($courseId: Int!, $title: String!, $activityType: TypeActivity!) {
      createActivity(
        courseId: $courseId
        title: $title
        activityType: $activityType
        description: "Test activity created for debugging"
      ) {
        ... on ActivitySuccess {
          activity {
            id
            title
          }
        }
        ... on ActivityError {
          message
          code
        }
      }
    }
  `;

  const variables = {
    courseId: courseId,
    title: `Test Activity ${Date.now()}`,
    activityType: 'TASK'
  };

  try {
    const response = await fetch(`${API_GATEWAY_URL}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(process.env.NODE_ENV === 'development' ? {
          'x-dev-mode': 'true',
          'x-dev-user-id': '4'
        } : {})
      },
      body: JSON.stringify({
        query,
        variables
      }),
    });

    const result = await response.json();
    
    if (result.errors) {
      return { 
        success: false, 
        error: `GraphQL Errors: ${JSON.stringify(result.errors, null, 2)}` 
      };
    }

    return { success: true, data: result.data };
  } catch (error) {
    return { 
      success: false, 
      error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};

/**
 * Ejecuta un diagnóstico completo de autenticación
 */
export const runAuthDiagnostic = async (courseId?: number): Promise<void> => {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('⚠️ runAuthDiagnostic solo funciona en modo desarrollo');
    return;
  }

  console.group('🔍 Diagnóstico Completo de Autenticación');
  
  // 1. Verificar token local
  const token = getAuthToken();
  console.log('1. Token local:', token ? '✅ Presente' : '❌ No encontrado');
  if (token) {
    console.log('   Longitud:', token.length);
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        console.log('   Payload:', payload);
      }
    } catch (e) {
      console.log('   ❌ Error decodificando token');
    }
  }

  // 2. Verificar con servicio de auth
  console.log('\n2. Verificación con servicio de autenticación...');
  const authResult = await verifyTokenWithAuthService(token);
  if (authResult.valid) {
    console.log('   ✅ Token válido con auth service');
    console.log('   Usuario:', authResult.user);
  } else {
    console.log('   ❌ Token inválido con auth service:', authResult.error);
  }

  // 3. Probar creación de actividad
  if (courseId) {
    console.log('\n3. Probando creación de actividad...');
    const activityResult = await testCreateActivityDirectly(courseId);
    if (activityResult.success) {
      console.log('   ✅ Actividad creada exitosamente');
      console.log('   Datos:', activityResult.data);
    } else {
      console.log('   ❌ Error creando actividad:', activityResult.error);
    }
  }

  console.groupEnd();
};

/**
 * Comando rápido para ejecutar desde la consola del navegador
 */
declare global {
  interface Window {
    debugAuth?: () => void;
    runAuthDiagnostic?: (courseId?: number) => Promise<void>;
  }
}

// Hacer funciones disponibles globalmente en desarrollo
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.debugAuth = () => {
    const { debugAuth } = require('./cookie-utils');
    debugAuth();
  };
  
  window.runAuthDiagnostic = runAuthDiagnostic;
  
  console.log('🔧 Funciones de debug disponibles:');
  console.log('   - window.debugAuth()');
  console.log('   - window.runAuthDiagnostic(courseId)');
} 