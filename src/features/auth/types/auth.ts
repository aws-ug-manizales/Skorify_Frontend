export type AuthProvider = 'email' | 'google';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  provider: AuthProvider;
  emailVerified: boolean;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  createdAt: string;
}

export interface AuthActionResult {
  ok: boolean;
  message?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
  };
}

export interface CredentialsPayload {
  email: string;
  password: string;
}

export interface StoredUser extends AuthUser {
  password?: string;
}
