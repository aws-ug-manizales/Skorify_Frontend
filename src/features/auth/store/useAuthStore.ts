'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { z } from 'zod';
import type { AuthActionResult, AuthSession, CredentialsPayload, StoredUser } from '../types/auth';

const EMAIL_CONFIRMATION_REQUIRED = false;

const credentialsSchema = z.object({
  email: z.string().trim().email('Correo electrónico inválido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(72, 'La contraseña es demasiado larga'),
});

type AuthState = {
  hydrated: boolean;
  session: AuthSession | null;
  users: StoredUser[];
  setHydrated: (value: boolean) => void;
  registerWithEmail: (payload: CredentialsPayload) => AuthActionResult;
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      session: null,
      users: [],
      setHydrated: (value) => set({ hydrated: value }),
      registerWithEmail: (payload) => {
        const parsed = credentialsSchema.safeParse(payload);

        if (!parsed.success) {
          const fieldErrors = parsed.error.flatten().fieldErrors;
          return {
            ok: false,
            message: 'Corrige los errores del formulario',
            fieldErrors: {
              email: fieldErrors.email?.[0],
              password: fieldErrors.password?.[0],
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
            message: 'Este correo ya está registrado',
            fieldErrors: { email: 'El correo debe ser único' },
          };
        }

        const user: StoredUser = {
          id: createToken(),
          email: normalizedEmail,
          displayName: normalizedEmail.split('@')[0],
          provider: 'email',
          emailVerified: !EMAIL_CONFIRMATION_REQUIRED,
          password: parsed.data.password,
        };

        const session: AuthSession = {
          token: createToken(),
          user,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          users: [...state.users, user],
          session,
        }));

        persistToken(session.token);

        return {
          ok: true,
          message: EMAIL_CONFIRMATION_REQUIRED
            ? 'Cuenta creada. Revisa tu correo para confirmar el registro.'
            : 'Cuenta creada con éxito',
        };
      },
      loginWithEmail: (payload) => {
        const parsed = credentialsSchema.safeParse(payload);

        if (!parsed.success) {
          const fieldErrors = parsed.error.flatten().fieldErrors;
          return {
            ok: false,
            message: 'Credenciales inválidas',
            fieldErrors: {
              email: fieldErrors.email?.[0],
              password: fieldErrors.password?.[0],
            },
          };
        }

        const normalizedEmail = normalizeEmail(parsed.data.email);
        const user = get().users.find(
          (candidate) =>
            normalizeEmail(candidate.email) === normalizedEmail &&
            candidate.provider === 'email' &&
            candidate.password === parsed.data.password,
        );

        if (!user) {
          return {
            ok: false,
            message: 'Correo o contraseña incorrectos',
          };
        }

        const session: AuthSession = {
          token: createToken(),
          user,
          createdAt: new Date().toISOString(),
        };

        set({ session });
        persistToken(session.token);

        return {
          ok: true,
          message: 'Inicio de sesión exitoso',
        };
      },
      loginWithGoogle: () => {
        const users = get().users;
        const existingGoogleUser = users.find((user) => user.provider === 'google');

        const googleUser: StoredUser = existingGoogleUser ?? {
          id: createToken(),
          email: 'google.player@skorify.app',
          displayName: 'Google Player',
          provider: 'google',
          emailVerified: true,
        };

        if (!existingGoogleUser) {
          set((state) => ({ users: [...state.users, googleUser] }));
        }

        const session: AuthSession = {
          token: createToken(),
          user: googleUser,
          createdAt: new Date().toISOString(),
        };

        set({ session });
        persistToken(session.token);

        return {
          ok: true,
          message: 'Sesión iniciada con Google',
        };
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
