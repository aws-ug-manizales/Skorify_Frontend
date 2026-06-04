export type AuthProvider = 'email' | 'google';
<<<<<<< HEAD
export type AuthRole = 'admin' | 'general';

export const ADMIN_ROLE: AuthRole = 'admin';
=======
export type AuthRole = 'admin' | 'manager' | 'general';

export const ADMIN_ROLE: AuthRole = 'admin';
export const MANAGER_ROLE: AuthRole = 'manager';
>>>>>>> origin/develop
export const GENERAL_ROLE: AuthRole = 'general';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  provider: AuthProvider;
  emailVerified: boolean;
  roles: AuthRole[];
}

export interface AuthSession {
  token: string;
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
  user: AuthUser;
<<<<<<< HEAD
=======
  sub: string;
  domainUserId?: string;
>>>>>>> origin/develop
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
