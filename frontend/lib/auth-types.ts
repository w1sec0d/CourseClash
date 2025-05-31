export type User = {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  avatar?: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  createdAt: string;
  updatedAt?: string;
  coins?: number;
  notifications?: number;
  level?: number;
  achievements?: number;
  courses?: Array<{
    id: string;
    name: string;
    image?: string;
  }>;
};

export class AuthError extends Error {
  public isServerError: boolean;

  constructor(
    message: string,
    public code: AuthErrorCode = 'UNKNOWN_ERROR',
    isServerError?: boolean
  ) {
    super(message);
    this.name = 'AuthError';
    Object.setPrototypeOf(this, AuthError.prototype);
    this.isServerError = isServerError ?? false;
  }
}

export type AuthErrorCode =
  | 'UNKNOWN_ERROR'
  | 'USER_NOT_FOUND'
  | 'INVALID_CREDENTIALS'
  | 'SERVER_ERROR'
  | 'INVALID_CODE'
  | 'EMAIL_EXISTS'
  | 'INVALID_TOKEN'
  | 'TOKEN_EXPIRED';

export type AuthResponse = {
  code: string;
  user: User;
  token: string;
  refreshToken?: string;
  expiresAt?: string;
  __typename?: string;
};

export type PasswordResetResponse = {
  message: string;
  code: string;
  token: string;
  __typename: 'ForgotPasswordSuccess' | 'ForgotPasswordError';
};

export type UpdatePasswordResponse = {
  message: string;
  __typename: 'UpdatePasswordSuccess' | 'UpdatePasswordError';
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<PasswordResetResponse>;
  updatePassword: (
    newPassword: string,
    code: string
  ) => Promise<PasswordResetResponse>;
};

export type LoginResult = AuthResponse | AuthError;
