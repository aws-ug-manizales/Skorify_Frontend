import { env } from '@lib/env';
import type { AuthSession, AuthUser } from '../types/auth';
import { resolveRoles } from './resolveRoles';
import { fetchDomainUserId } from '@features/auth/services/fetchDomainUserId';

interface CognitoTokenResponse {
  id_token: string;
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

interface CognitoIdTokenPayload {
  sub: string;
  email?: string;
  email_verified?: boolean;
  nickname?: string;
  preferred_username?: string;
  name?: string;
  'cognito:groups'?: string[];
  identities?: Array<{ providerName?: string }>;
}

const decodeBase64Url = (input: string): string => {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  if (typeof window === 'undefined') {
    return Buffer.from(padded, 'base64').toString('utf-8');
  }
  return decodeURIComponent(
    atob(padded)
      .split('')
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
      .join(''),
  );
};

const decodeJwt = <T>(token: string): T => {
  const payload = token.split('.')[1];
  if (!payload) throw new Error('Invalid JWT');
  return JSON.parse(decodeBase64Url(payload)) as T;
};

const requireCognitoDomain = () => {
  if (!env.NEXT_PUBLIC_COGNITO_DOMAIN) {
    throw new Error('cognito.errors.missingDomain');
  }
  return env.NEXT_PUBLIC_COGNITO_DOMAIN.replace(/\/$/, '');
};

export const buildOAuthRedirectUri = () =>
  `${env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')}/auth/callback`;

export const exchangeAuthorizationCode = async (code: string): Promise<AuthSession> => {
  const domain = requireCognitoDomain();
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: env.NEXT_PUBLIC_CLIENT_ID,
    code,
    redirect_uri: buildOAuthRedirectUri(),
  });

  const response = await fetch(`https://${domain}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error('auth.errors.oauthExchangeFailed');
  }

  const tokens = (await response.json()) as CognitoTokenResponse;
  const payload = decodeJwt<CognitoIdTokenPayload>(tokens.id_token);

  const roles = resolveRoles(payload['cognito:groups'] ?? []);
  const provider =
    (payload.identities?.[0]?.providerName?.toLowerCase() as AuthUser['provider'] | undefined) ??
    'google';
  const email = payload.email ?? '';
  const displayName =
    payload.nickname ?? payload.preferred_username ?? payload.name ?? email.split('@')[0];

  const session: AuthSession = {
    token: tokens.id_token,
    idToken: tokens.id_token,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    sub: payload.sub,
    user: {
      id: payload.sub,
      email,
      displayName,
      provider,
      emailVerified: Boolean(payload.email_verified ?? true),
      roles,
    },
  };

  const domainUserId = await fetchDomainUserId(payload.sub, tokens.id_token);
  return { ...session, domainUserId };
};
