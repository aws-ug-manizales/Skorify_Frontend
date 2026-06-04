import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
  type ISignUpResult,
} from 'amazon-cognito-identity-js';

import { env } from '@lib/env';
import { loginSchema, registerSchema } from '../../lib/schemas';
import type { AuthGatewayPort, AuthGatewayResult } from '../AuthGatewayPort';
import type {
<<<<<<< HEAD
  AuthRole,
=======
>>>>>>> origin/develop
  AuthSession,
  AuthUser,
  ConfirmSignUpPayload,
  CredentialsPayload,
  RegisterPayload,
} from '../../types/auth';
<<<<<<< HEAD
import { ADMIN_ROLE, GENERAL_ROLE } from '../../types/auth';

const resolveRoles = (cognitoGroups: string[]): AuthRole[] =>
  cognitoGroups.includes(ADMIN_ROLE) ? [ADMIN_ROLE] : [GENERAL_ROLE];
=======
import { resolveRoles } from '../../lib/resolveRoles';
import { fetchDomainUserId } from '@features/auth/services/fetchDomainUserId';
>>>>>>> origin/develop

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const buildOAuthRedirectUri = () => `${env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')}/auth/callback`;

const buildHostedUiUrl = (identityProvider: string) => {
  if (!env.NEXT_PUBLIC_COGNITO_DOMAIN) {
    throw new Error('cognito.errors.missingDomain');
  }
  const domain = env.NEXT_PUBLIC_COGNITO_DOMAIN.replace(/\/$/, '');
  const params = new URLSearchParams({
    identity_provider: identityProvider,
    response_type: 'code',
    client_id: env.NEXT_PUBLIC_CLIENT_ID,
    redirect_uri: buildOAuthRedirectUri(),
    scope: 'openid profile email',
  });
  return `https://${domain}/oauth2/authorize?${params.toString()}`;
};

type CognitoErrorMapping = { messageKey: string; field?: 'email' | 'password' | 'code' };

const COGNITO_ERROR_MAP: Record<string, CognitoErrorMapping> = {
  NotAuthorizedException: { messageKey: 'auth.errors.invalidCredentials' },
  UserNotFoundException: { messageKey: 'auth.errors.invalidCredentials' },
  UserNotConfirmedException: { messageKey: 'auth.errors.userNotConfirmed' },
  PasswordResetRequiredException: { messageKey: 'auth.errors.passwordResetRequired' },
  UsernameExistsException: { messageKey: 'auth.errors.emailTaken', field: 'email' },
  InvalidPasswordException: { messageKey: 'auth.errors.passwordPolicy', field: 'password' },
  InvalidParameterException: { messageKey: 'auth.errors.formInvalid' },
  CodeMismatchException: { messageKey: 'auth.errors.codeMismatch', field: 'code' },
  ExpiredCodeException: { messageKey: 'auth.errors.codeExpired', field: 'code' },
  LimitExceededException: { messageKey: 'auth.errors.limitExceeded' },
  TooManyRequestsException: { messageKey: 'auth.errors.tooManyRequests' },
};

const DEFAULT_COGNITO_ERROR: CognitoErrorMapping = { messageKey: 'auth.errors.genericError' };

const mapCognitoErrorToKey = (error: unknown): CognitoErrorMapping => {
  const code =
    (error as { code?: string; name?: string })?.code ?? (error as { name?: string })?.name;
<<<<<<< HEAD
=======
  const message = (error as { message?: string })?.message ?? '';

  // The PreSignUp Lambda rejects email sign-ups for addresses already linked
  // to a Google account, surfaced by Cognito as a UserLambdaValidationException
  // whose message carries the Lambda's text. Detect the Google case to point
  // the user to the right flow; other Lambda validations fall back to a
  // "email already taken" hint on the email field.
  if (code === 'UserLambdaValidationException') {
    if (/google/i.test(message)) {
      return { messageKey: 'auth.errors.emailRegisteredWithGoogle', field: 'email' };
    }
    return { messageKey: 'auth.errors.emailTaken', field: 'email' };
  }
>>>>>>> origin/develop

  return (code && COGNITO_ERROR_MAP[code]) || DEFAULT_COGNITO_ERROR;
};

const sessionFromCognito = (
  cognitoSession: CognitoUserSession,
  fallback?: Partial<AuthUser>,
): AuthSession => {
  const idTokenPayload = cognitoSession.getIdToken().payload as Record<string, unknown>;
  const accessToken = cognitoSession.getAccessToken().getJwtToken();
  const idToken = cognitoSession.getIdToken().getJwtToken();
  const refreshToken = cognitoSession.getRefreshToken().getToken();
  const expiresAt = new Date(cognitoSession.getAccessToken().getExpiration() * 1000).toISOString();

  const cognitoGroups = (idTokenPayload['cognito:groups'] as string[] | undefined) ?? [];
  const roles = resolveRoles(cognitoGroups);
  const email = (idTokenPayload.email as string) ?? fallback?.email ?? '';
  const sub = (idTokenPayload.sub as string) ?? fallback?.id ?? '';
  const nickname =
    (idTokenPayload.nickname as string) ??
    (idTokenPayload.preferred_username as string) ??
    (idTokenPayload.name as string) ??
    fallback?.displayName ??
    email.split('@')[0];
  const emailVerified = Boolean(idTokenPayload.email_verified ?? true);
  const provider =
    ((
      idTokenPayload.identities as Array<{ providerName?: string }> | undefined
    )?.[0]?.providerName?.toLowerCase() as AuthUser['provider'] | undefined) ?? 'email';

  return {
    token: idToken,
    idToken,
    accessToken,
    refreshToken,
    expiresAt,
    createdAt: new Date().toISOString(),
<<<<<<< HEAD
=======
    sub,
>>>>>>> origin/develop
    user: {
      id: sub,
      email,
      displayName: nickname,
      provider,
      emailVerified,
      roles,
    },
  };
};

export class CognitoAuthGateway implements AuthGatewayPort {
  private readonly userPool: CognitoUserPool;

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: env.NEXT_PUBLIC_USER_POOL_ID,
      ClientId: env.NEXT_PUBLIC_CLIENT_ID,
    });
  }

  private buildCognitoUser(email: string): CognitoUser {
    return new CognitoUser({
      Username: normalizeEmail(email),
      Pool: this.userPool,
    });
  }

  async registerWithEmail(payload: RegisterPayload): Promise<AuthGatewayResult> {
    const parsed = registerSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      return {
        ok: false,
        messageKey: 'auth.errors.formInvalid',
        fieldErrors: {
          email: fieldErrors.email?.[0],
          password: fieldErrors.password?.[0],
          nickname: fieldErrors.nickname?.[0],
        },
      };
    }

    const email = normalizeEmail(parsed.data.email);
    const attributes = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'name', Value: parsed.data.nickname }),
    ];

    return new Promise<AuthGatewayResult>((resolve) => {
      this.userPool.signUp(
        email,
        parsed.data.password,
        attributes,
        [],
        (err, result: ISignUpResult | undefined) => {
          if (err) {
            const mapped = mapCognitoErrorToKey(err);
            resolve({
              ok: false,
              messageKey: mapped.messageKey,
              fieldErrors: mapped.field ? { [mapped.field]: mapped.messageKey } : undefined,
            });
            return;
          }

          const needsConfirmation = result?.userConfirmed === false;
          resolve({
            ok: true,
            messageKey: needsConfirmation ? 'auth.success.checkEmail' : 'auth.success.registered',
            needsConfirmation,
            pendingEmail: email,
          });
        },
      );
    });
  }

  async loginWithEmail(payload: CredentialsPayload): Promise<AuthGatewayResult> {
    const parsed = loginSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      return {
        ok: false,
        messageKey: 'auth.errors.invalidCredentials',
        fieldErrors: {
          email: fieldErrors.email?.[0],
          password: fieldErrors.password?.[0],
        },
      };
    }

    const email = normalizeEmail(parsed.data.email);
    const cognitoUser = this.buildCognitoUser(email);
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: parsed.data.password,
    });

    return new Promise<AuthGatewayResult>((resolve) => {
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (cognitoSession) => {
<<<<<<< HEAD
          resolve({
            ok: true,
            messageKey: 'auth.success.loggedIn',
            session: sessionFromCognito(cognitoSession, { email }),
          });
=======
          const session = sessionFromCognito(cognitoSession, { email });
          // Resolve the domain user ID up front so consumers (groups,
          // enrollments, predictions) query the backend with the correct
          // id immediately after login — not just after a session restore.
          // Mirrors `restoreSession` and the Google OAuth exchange.
          void fetchDomainUserId(session.user.id, session.idToken ?? session.token).then(
            (domainUserId) => {
              resolve({
                ok: true,
                messageKey: 'auth.success.loggedIn',
                session: { ...session, domainUserId },
              });
            },
          );
>>>>>>> origin/develop
        },
        onFailure: (err) => {
          const mapped = mapCognitoErrorToKey(err);
          if (mapped.messageKey === 'auth.errors.userNotConfirmed') {
            resolve({
              ok: false,
              messageKey: mapped.messageKey,
              needsConfirmation: true,
              pendingEmail: email,
            });
            return;
          }
          resolve({ ok: false, messageKey: mapped.messageKey });
        },
        newPasswordRequired: () => {
          resolve({ ok: false, messageKey: 'auth.errors.passwordResetRequired' });
        },
      });
    });
  }

  async confirmSignUp(payload: ConfirmSignUpPayload): Promise<AuthGatewayResult> {
    const email = normalizeEmail(payload.email);
    const cognitoUser = this.buildCognitoUser(email);

    return new Promise<AuthGatewayResult>((resolve) => {
      cognitoUser.confirmRegistration(payload.code, true, (err) => {
        if (err) {
          const mapped = mapCognitoErrorToKey(err);
          resolve({
            ok: false,
            messageKey: mapped.messageKey,
            fieldErrors: mapped.field ? { [mapped.field]: mapped.messageKey } : undefined,
          });
          return;
        }
        resolve({ ok: true, messageKey: 'auth.success.confirmed' });
      });
    });
  }

  async resendConfirmationCode(email: string): Promise<AuthGatewayResult> {
    const cognitoUser = this.buildCognitoUser(email);
    return new Promise<AuthGatewayResult>((resolve) => {
      cognitoUser.resendConfirmationCode((err) => {
        if (err) {
          resolve({ ok: false, messageKey: mapCognitoErrorToKey(err).messageKey });
          return;
        }
        resolve({ ok: true, messageKey: 'auth.success.codeResent' });
      });
    });
  }

  async loginWithGoogle(): Promise<AuthGatewayResult> {
    if (typeof window === 'undefined') {
      return { ok: false, messageKey: 'auth.errors.genericError' };
    }
    try {
      const url = buildHostedUiUrl('Google');
      window.location.assign(url);
      return { ok: true };
    } catch {
      return { ok: false, messageKey: 'cognito.errors.missingDomain' };
    }
  }

  async logout(): Promise<void> {
    const currentUser = this.userPool.getCurrentUser();
    if (currentUser) {
      currentUser.signOut();
    }
  }

<<<<<<< HEAD
  async restoreSession(): Promise<AuthSession | null> {
=======
  /**
   * Validates the Cognito session locally (getSession silently refreshes the
   * id/access token when only those expired). Returns the session WITHOUT the
   * domain user ID — it does not hit `get-user-by-sub`, so it is safe to call
   * repeatedly (e.g. from the session-expiry watcher).
   */
  async getValidSession(): Promise<AuthSession | null> {
>>>>>>> origin/develop
    const currentUser = this.userPool.getCurrentUser();
    if (!currentUser) {
      return null;
    }
    return new Promise<AuthSession | null>((resolve) => {
      currentUser.getSession((err: Error | null, cognitoSession: CognitoUserSession | null) => {
        if (err || !cognitoSession || !cognitoSession.isValid()) {
          resolve(null);
          return;
        }
        resolve(sessionFromCognito(cognitoSession));
      });
    });
  }
<<<<<<< HEAD
=======

  async restoreSession(): Promise<AuthSession | null> {
    const session = await this.getValidSession();
    if (!session) {
      return null;
    }
    const domainUserId = await fetchDomainUserId(session.user.id, session.idToken ?? session.token);
    return { ...session, domainUserId };
  }
>>>>>>> origin/develop
}
