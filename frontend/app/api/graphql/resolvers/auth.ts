import { GraphQLError } from 'graphql';

// Resolvers de autenticación para CourseClash
// Este archivo implementa la lógica de negocio para las operaciones de autenticación
// definidas en el esquema GraphQL, utilizando datos simulados para desarrollo.

// Definición de tipos de usuario
type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

// Interfaz que define la estructura de un usuario
interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// Interfaz para los datos de registro de usuario
interface RegisterInput {
  username: string;
  email: string;
  password: string;
  name?: string;
  role?: UserRole;
}

// Interfaz para los datos almacenados con cada token
interface TokenData {
  userId: string;
  expiresAt: Date;
}

// Interfaz para el contexto de autenticación
interface Context {
  user?: User;
}

// Base de datos simulada de usuarios
const users: User[] = [
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

// Tokens simulados
const tokens: Map<string, TokenData> = new Map();

export const authResolvers = {
  Query: {
    me: (_: unknown, __: unknown, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }
      return context.user;
    },
    getUserById: (_: unknown, { id }: { id: string }) => {
      const user = users.find((user) => user.id === id);
      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      return user;
    },
  },
  Mutation: {
    login: (
      _: unknown,
      { email, password }: { email: string; password: string }
    ) => {
      const user = users.find((user) => user.email === email);
      console.log('user', user);
      console.log('email', email);
      console.log('password', password);
      // Autenticación simulada (en una app real, verificarías la contraseña con hash)
      if (!user || password !== 'password123') {
        throw new GraphQLError('Invalid email or password', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const token = `mock-jwt-token-${user.id}-${Date.now()}`;
      const refreshToken = `mock-refresh-token-${user.id}-${Date.now()}`;

      // Almacena el token (en una app real, usarías JWT o similar)
      tokens.set(token, {
        userId: user.id,
        expiresAt: new Date(Date.now() + 3600000),
      });

      return {
        user,
        token,
        refreshToken,
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      };
    },
    register: (_: unknown, { input }: { input: RegisterInput }) => {
      // Verifica si el usuario ya existe
      if (
        users.some(
          (user) =>
            user.email === input.email || user.username === input.username
        )
      ) {
        throw new GraphQLError('User already exists', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      // Crea un nuevo usuario
      const newUser = {
        id: String(users.length + 1),
        username: input.username,
        email: input.email,
        name: input.name || input.username,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${input.username}`,
        role: input.role || 'STUDENT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      users.push(newUser);

      const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;
      const refreshToken = `mock-refresh-token-${newUser.id}-${Date.now()}`;

      // Store token
      tokens.set(token, {
        userId: newUser.id,
        expiresAt: new Date(Date.now() + 3600000),
      });

      return {
        user: newUser,
        token,
        refreshToken,
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      };
    },
    refreshToken: (_: unknown, { refreshToken }: { refreshToken: string }) => {
      // En una implementación real, validarías el token de actualización
      // Para esta simulación, solo verificamos si comienza con 'mock-refresh-token'
      if (!refreshToken.startsWith('mock-refresh-token-')) {
        throw new GraphQLError('Invalid refresh token', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      // Extrae el ID de usuario del token de actualización (solo para la implementación simulada)
      const userId = refreshToken.split('-')[3];
      const user = users.find((u) => u.id === userId);

      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const newToken = `mock-jwt-token-${user.id}-${Date.now()}`;
      const newRefreshToken = `mock-refresh-token-${user.id}-${Date.now()}`;

      return {
        user,
        token: newToken,
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      };
    },
    logout: () => {
      // En una implementación real, invalidarías el token
      return true;
    },
    resetPassword: (_: unknown, { email }: { email: string }) => {
      // Verifica si el usuario existe
      const user = users.find((u) => u.email === email);
      if (!user) {
        // Por razones de seguridad, no revelamos que el email no existe
        return true;
      }

      // En una implementación real, enviarías un email con un enlace de restablecimiento
      console.log(`Password reset requested for ${email}`);
      return true;
    },
    confirmResetPassword: (
      _: unknown,
      { token, newPassword }: { token: string; newPassword: string }
    ) => {
      // Usando la variable newPassword para evitar advertencia de variable no utilizada
      console.log(`New password length: ${newPassword.length}`);
      // En una implementación real, validarías el token y actualizarías la contraseña
      if (!token.startsWith('reset-token-')) {
        throw new GraphQLError('Invalid token', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      console.log(`Password reset confirmed with token: ${token}`);
      return true;
    },
  },
};
