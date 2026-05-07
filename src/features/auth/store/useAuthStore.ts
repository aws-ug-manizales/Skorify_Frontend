'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { env } from '@lib/env';
import { loginSchema as credentialsSchema, registerSchema } from '../lib/schemas';
import type {
  AuthActionResult,
  AuthSession,
  CredentialsPayload,
  RegisterPayload,
  StoredUser,
} from '../types/auth';

const EMAIL_CONFIRMATION_REQUIRED = false;
const isMockMode = env.NEXT_PUBLIC_AUTH_MODE === 'mock';

type AuthState = {
  hydrated: boolean;
  session: AuthSession | null;
  users: StoredUser[];
  setHydrated: (value: boolean) => void;
  registerWithEmail: (payload: RegisterPayload) => AuthActionResult;
  loginWithEmail: (payload: CredentialsPayload) => AuthActionResult;
  loginWithGoogle: () => AuthActionResult;
  logout: () => void;
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const createToken = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const persistToken = (token: string | null) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

const buildUser = (
  email: string,
  provider: StoredUser['provider'],
  password?: string,
): StoredUser => ({
  id: createToken(),
  email,
  displayName: email.split('@')[0],
  provider,
  emailVerified: !EMAIL_CONFIRMATION_REQUIRED,
  password,
});

const buildSession = (user: StoredUser): AuthSession => ({
  token: createToken(),
  user,
  createdAt: new Date().toISOString(),
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      session: null,
      users: [],
      setHydrated: (value) => set({ hydrated: value }),

      registerWithEmail: (payload) => {
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

        const normalizedEmail = normalizeEmail(parsed.data.email);
        const users = get().users;

        const duplicatedEmail = users.some(
          (user) => normalizeEmail(user.email) === normalizedEmail,
        );
        if (duplicatedEmail) {
          return {
            ok: false,
            messageKey: 'auth.errors.emailTaken',
            fieldErrors: { email: 'auth.errors.emailMustBeUnique' },
          };
        }

        const duplicatedNickname = users.some(
          (user) => user.displayName.toLowerCase() === parsed.data.nickname.toLowerCase(),
        );
        if (duplicatedNickname) {
          return {
            ok: false,
            messageKey: 'auth.errors.nicknameTaken',
            fieldErrors: { nickname: 'auth.errors.nicknameMustBeUnique' },
          };
        }

        const user = buildUser(normalizedEmail, 'email', parsed.data.password);
        user.displayName = parsed.data.nickname;
        const session = buildSession(user);

        set((state) => ({ users: [...state.users, user], session }));
        persistToken(session.token);

        return {
          ok: true,
          messageKey: EMAIL_CONFIRMATION_REQUIRED
            ? 'auth.success.checkEmail'
            : 'auth.success.registered',
        };
      },

      loginWithEmail: (payload) => {
        const parsed = credentialsSchema.safeParse(payload);

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

        const normalizedEmail = normalizeEmail(parsed.data.email);
        const existing = get().users.find(
          (candidate) =>
            normalizeEmail(candidate.email) === normalizedEmail && candidate.provider === 'email',
        );

        if (existing) {
          if (!isMockMode && existing.password !== parsed.data.password) {
            return { ok: false, messageKey: 'auth.errors.invalidCredentials' };
          }

          const session = buildSession(existing);
          set({ session });
          persistToken(session.token);
          return { ok: true, messageKey: 'auth.success.loggedIn' };
        }

        if (!isMockMode) {
          return { ok: false, messageKey: 'auth.errors.invalidCredentials' };
        }

        const user = buildUser(normalizedEmail, 'email', parsed.data.password);
        const session = buildSession(user);

        set((state) => ({ users: [...state.users, user], session }));
        persistToken(session.token);

        return { ok: true, messageKey: 'auth.success.loggedIn' };
      },

      loginWithGoogle: () => {
        const users = get().users;
        const existingGoogleUser = users.find((user) => user.provider === 'google');

        const googleUser: StoredUser =
          existingGoogleUser ?? buildUser('google.player@skorify.app', 'google');
        if (!existingGoogleUser) {
          set((state) => ({ users: [...state.users, googleUser] }));
        }

        const session = buildSession(googleUser);
        set({ session });
        persistToken(session.token);

        return { ok: true, messageKey: 'auth.success.googleLoggedIn' };
      },

      logout: () => {
        set({ session: null });
        persistToken(null);
      },
    }),
    {
      name: 'skorify-auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        session: state.session,
        users: state.users,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
