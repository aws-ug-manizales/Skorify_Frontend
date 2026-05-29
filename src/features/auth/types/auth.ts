export type AuthProvider = 'email' | 'google';
export type AuthRole = 'user' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  provider: AuthProvider;
  emailVerified: boolean;
  role?: AuthRole;
}

export interface AuthSession {
  token: string;
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
  user: AuthUser;
  createdAt: string;
  expiresAt?: string;
}

export interface AuthFieldErrors {
  email?: string;
  password?: string;
  nickname?: string;
  code?: string;
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

export interface ConfirmSignUpPayload {
  email: string;
  code: string;
}
