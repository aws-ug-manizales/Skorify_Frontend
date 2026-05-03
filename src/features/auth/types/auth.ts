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

export interface AuthFieldErrors {
  email?: string;
  password?: string;
  nickname?: string;
}

export interface AuthActionResult {
  ok: boolean;
  messageKey?: string;
  fieldErrors?: AuthFieldErrors;
}

export interface CredentialsPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends CredentialsPayload {
  nickname: string;
}

export interface StoredUser extends AuthUser {
  password?: string;
}
