import { createSchema, createYoga } from 'graphql-yoga';
import { readFileSync } from 'fs';
import { join } from 'path';
import { authResolvers } from '@/app/api/graphql/resolvers/auth';

// Ruta de API GraphQL para CourseClash
// Este archivo configura el servidor GraphQL usando graphql-yoga
// y expone un endpoint para manejar las operaciones de autenticación.

// Lee el esquema GraphQL desde el archivo
const authTypeDefs = readFileSync(
  join(process.cwd(), 'app', 'api', 'graphql', 'schema', 'auth.graphql'),
  'utf8'
);

// Crea el esquema GraphQL combinando las definiciones de tipos y los resolvers
const schema = createSchema({
  typeDefs: authTypeDefs,
  resolvers: authResolvers,
});

// Middleware de contexto de autenticación para verificar tokens
const createContext = (req: Request) => {
  // Obtiene el token de autenticación de las cabeceras de la petición
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  // Autenticación simulada - en una app real, validarías el token JWT
  // Por simplicidad, solo verificamos si el token comienza con nuestro prefijo simulado
  if (token && token.startsWith('mock-jwt-token-')) {
    const userId = token.split('-')[3]; // Extrae el ID de usuario del token

    // Busca el usuario por ID (simulando una consulta a la base de datos)
    const users = [
      {
        id: '1',
        username: 'estudiante',
        email: 'estudiante@gmail.com',
        name: 'Estudiante',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
        role: 'STUDENT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        username: 'profesor',
        email: 'profesor@gmail.com',
        name: 'Profesor',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher1',
        role: 'TEACHER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const user = users.find((u) => u.id === userId);

    if (user) {
      return { user };
    }
  }

  return {};
};

// Crea una instancia de Yoga con CORS habilitado
const yoga = createYoga({
  schema,
  // Pasa la función de contexto a Yoga
  context: ({ request }) => createContext(request),
  // Deshabilita GraphiQL en producción
  graphiql: process.env.NODE_ENV !== 'production',
  // Configuración de CORS
  cors: {
    origin: '*',
    credentials: true,
  },
});

// Exporta los manejadores GET y POST para la ruta de API
export const GET = yoga;
export const POST = yoga;
