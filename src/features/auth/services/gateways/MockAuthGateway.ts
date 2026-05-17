import { loginSchema as credentialsSchema, registerSchema } from '../../lib/schemas';
import type { AuthGatewayPort, AuthGatewayResult, AuthGatewayState } from '../AuthGatewayPort';
import type {
  AuthSession,
  CredentialsPayload,
  RegisterPayload,
  StoredUser,
} from '../../types/auth';
import { mockAdminEmail, mockAdminPassword, mockAdminUser } from '../../data/mockUsers';

const EMAIL_CONFIRMATION_REQUIRED = false;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const isAdminCredentials = (email: string, password: string) =>
  normalizeEmail(email) === mockAdminEmail && password === mockAdminPassword;

const createToken = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const buildUser = (
  email: string,
  provider: StoredUser['provider'],
  password?: string,
  role: StoredUser['role'] = 'user',
): StoredUser => ({
  id: createToken(),
  email,
  displayName: email.split('@')[0],
  provider,
  emailVerified: !EMAIL_CONFIRMATION_REQUIRED,
  role,
  password,
});

const buildSession = (user: StoredUser): AuthSession => ({
  token: createToken(),
  user,
  createdAt: new Date().toISOString(),
});

const buildAdminUser = (): StoredUser => ({
  ...mockAdminUser,
  role: 'admin',
});

const ok = (result: AuthGatewayResult): AuthGatewayResult => result;

export class MockAuthGateway implements AuthGatewayPort {
  registerWithEmail(payload: RegisterPayload, state: AuthGatewayState): AuthGatewayResult {
    const parsed = registerSchema.safeParse(payload);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      return ok({
        ok: false,
        messageKey: 'auth.errors.formInvalid',
        fieldErrors: {
          email: fieldErrors.email?.[0],
          password: fieldErrors.password?.[0],
          nickname: fieldErrors.nickname?.[0],
        },
      });
    }

    const normalizedEmail = normalizeEmail(parsed.data.email);
    const duplicatedEmail = state.users.some(
      (user) => normalizeEmail(user.email) === normalizedEmail,
    );
    if (duplicatedEmail) {
      return ok({
        ok: false,
        messageKey: 'auth.errors.emailTaken',
        fieldErrors: { email: 'auth.errors.emailMustBeUnique' },
      });
    }

    if (isAdminCredentials(parsed.data.email, parsed.data.password)) {
      return ok({
        ok: false,
        messageKey: 'auth.errors.emailTaken',
        fieldErrors: { email: 'auth.errors.emailMustBeUnique' },
      });
    }

    const duplicatedNickname = state.users.some(
      (user) => user.displayName.toLowerCase() === parsed.data.nickname.toLowerCase(),
    );
    if (duplicatedNickname) {
      return ok({
        ok: false,
        messageKey: 'auth.errors.nicknameTaken',
        fieldErrors: { nickname: 'auth.errors.nicknameMustBeUnique' },
      });
    }

    const user = buildUser(normalizedEmail, 'email', parsed.data.password);
    user.displayName = parsed.data.nickname;
    const session = buildSession(user);

    return ok({
      ok: true,
      messageKey: EMAIL_CONFIRMATION_REQUIRED
        ? 'auth.success.checkEmail'
        : 'auth.success.registered',
      session,
      users: [...state.users, user],
    });
  }

  loginWithEmail(payload: CredentialsPayload, state: AuthGatewayState): AuthGatewayResult {
    const parsed = credentialsSchema.safeParse(payload);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      return ok({
        ok: false,
        messageKey: 'auth.errors.invalidCredentials',
        fieldErrors: {
          email: fieldErrors.email?.[0],
          password: fieldErrors.password?.[0],
        },
      });
    }

    const normalizedEmail = normalizeEmail(parsed.data.email);
    if (isAdminCredentials(parsed.data.email, parsed.data.password)) {
      const existingAdminUser = state.users.find(
        (candidate) =>
          candidate.id === mockAdminUser.id || normalizeEmail(candidate.email) === mockAdminEmail,
      );
      const adminUser: StoredUser = existingAdminUser
        ? { ...existingAdminUser, role: 'admin' }
        : buildAdminUser();

      const session = buildSession(adminUser);

      return ok({
        ok: true,
        messageKey: 'auth.success.loggedIn',
        session,
        users: existingAdminUser
          ? state.users.map((candidate) =>
              candidate.id === existingAdminUser.id ||
              normalizeEmail(candidate.email) === mockAdminEmail
                ? { ...candidate, role: 'admin' }
                : candidate,
            )
          : [...state.users, adminUser],
      });
    }

    const existing = state.users.find(
      (candidate) =>
        normalizeEmail(candidate.email) === normalizedEmail && candidate.provider === 'email',
    );

    if (existing) {
      if (existing.password !== parsed.data.password) {
        return ok({ ok: false, messageKey: 'auth.errors.invalidCredentials' });
      }

      const session = buildSession(existing);
      return ok({ ok: true, messageKey: 'auth.success.loggedIn', session });
    }

    const user = buildUser(normalizedEmail, 'email', parsed.data.password);
    const session = buildSession(user);

    return ok({
      ok: true,
      messageKey: 'auth.success.loggedIn',
      session,
      users: [...state.users, user],
    });
  }

  loginWithGoogle(state: AuthGatewayState): AuthGatewayResult {
    const existingGoogleUser = state.users.find((user) => user.provider === 'google');

    const googleUser: StoredUser =
      existingGoogleUser ?? buildUser('google.player@skorify.app', 'google');

    const session = buildSession(googleUser);

    return ok({
      ok: true,
      messageKey: 'auth.success.googleLoggedIn',
      session,
      users: existingGoogleUser ? state.users : [...state.users, googleUser],
    });
  }
}
