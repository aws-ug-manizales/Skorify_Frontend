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

/**
 * Builds an {@link AuthSession} from a Cognito token response. The OAuth
 * `refresh_token` grant does not return a new refresh token, so callers pass the
 * previous one via `fallbackRefreshToken` to keep the session refreshable.
 */
const buildSessionFromTokens = (
  tokens: CognitoTokenResponse,
  fallbackRefreshToken?: string,
): AuthSession => {
  const payload = decodeJwt<CognitoIdTokenPayload>(tokens.id_token);

  const roles = resolveRoles(payload['cognito:groups'] ?? []);
  const provider =
    (payload.identities?.[0]?.providerName?.toLowerCase() as AuthUser['provider'] | undefined) ??
    'google';
  const email = payload.email ?? '';
  const displayName =
    payload.nickname ?? payload.preferred_username ?? payload.name ?? email.split('@')[0];

  return {
    token: tokens.access_token,
    idToken: tokens.id_token,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token ?? fallbackRefreshToken,
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
};

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
  const session = buildSessionFromTokens(tokens);

  const domainUserId = await fetchDomainUserId(session.sub, tokens.access_token);
  return { ...session, domainUserId };
};

/**
 * Refreshes a Hosted-UI / social (e.g. Google) session through the OAuth token
 * endpoint. These sessions don't live in the amazon-cognito-identity-js user
 * pool, so they can't be refreshed via `getSession()`; we exchange the stored
 * refresh token instead. Returns `null` when the refresh token is no longer
 * valid (i.e. the session is truly expired).
 */
export const refreshOAuthSession = async (refreshToken: string): Promise<AuthSession | null> => {
  const domain = requireCognitoDomain();
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: env.NEXT_PUBLIC_CLIENT_ID,
    refresh_token: refreshToken,
  });

  let response: Response;
  try {
    response = await fetch(`https://${domain}/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
  } catch {
    return null;
  }

  if (!response.ok) {
    return null;
  }

  const tokens = (await response.json()) as CognitoTokenResponse;
  // The refresh grant doesn't return a new refresh token — carry the old one over.
  return buildSessionFromTokens(tokens, refreshToken);
};
