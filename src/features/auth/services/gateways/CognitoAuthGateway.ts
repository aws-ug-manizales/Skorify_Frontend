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
  AuthSession,
  AuthUser,
  ConfirmSignUpPayload,
  CredentialsPayload,
  RegisterPayload,
} from '../../types/auth';

const ADMIN_GROUP = 'admin';

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

const mapCognitoErrorToKey = (error: unknown): { messageKey: string; field?: string } => {
  const code =
    (error as { code?: string; name?: string })?.code ??
    (error as { name?: string })?.name ??
    'UnknownError';

  switch (code) {
    case 'NotAuthorizedException':
      return { messageKey: 'auth.errors.invalidCredentials' };
    case 'UserNotFoundException':
      return { messageKey: 'auth.errors.invalidCredentials' };
    case 'UserNotConfirmedException':
      return { messageKey: 'auth.errors.userNotConfirmed' };
    case 'PasswordResetRequiredException':
      return { messageKey: 'auth.errors.passwordResetRequired' };
    case 'UsernameExistsException':
      return { messageKey: 'auth.errors.emailTaken', field: 'email' };
    case 'InvalidPasswordException':
      return { messageKey: 'auth.errors.passwordPolicy', field: 'password' };
    case 'InvalidParameterException':
      return { messageKey: 'auth.errors.formInvalid' };
    case 'CodeMismatchException':
      return { messageKey: 'auth.errors.codeMismatch', field: 'code' };
    case 'ExpiredCodeException':
      return { messageKey: 'auth.errors.codeExpired', field: 'code' };
    case 'LimitExceededException':
      return { messageKey: 'auth.errors.limitExceeded' };
    case 'TooManyRequestsException':
      return { messageKey: 'auth.errors.tooManyRequests' };
    default:
      return { messageKey: 'auth.errors.genericError' };
  }
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

  const groups = (idTokenPayload['cognito:groups'] as string[] | undefined) ?? [];
  const role = groups.includes(ADMIN_GROUP) ? 'admin' : 'user';
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
    user: {
      id: sub,
      email,
      displayName: nickname,
      provider,
      emailVerified,
      role,
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
      new CognitoUserAttribute({ Name: 'nickname', Value: parsed.data.nickname }),
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
          resolve({
            ok: true,
            messageKey: 'auth.success.loggedIn',
            session: sessionFromCognito(cognitoSession, { email }),
          });
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

  async restoreSession(): Promise<AuthSession | null> {
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
}
