'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { authService } from '../services/authService';
import type { AuthGatewayResult } from '../services/AuthGatewayPort';
import type {
  AuthSession,
  ConfirmSignUpPayload,
  CredentialsPayload,
  RegisterPayload,
} from '../types/auth';

type AuthState = {
  hydrated: boolean;
  session: AuthSession | null;
  setHydrated: (value: boolean) => void;
  setSession: (session: AuthSession | null) => void;
  registerWithEmail: (payload: RegisterPayload) => Promise<AuthGatewayResult>;
  loginWithEmail: (payload: CredentialsPayload) => Promise<AuthGatewayResult>;
  confirmSignUp: (payload: ConfirmSignUpPayload) => Promise<AuthGatewayResult>;
  resendConfirmationCode: (email: string) => Promise<AuthGatewayResult>;
  loginWithGoogle: () => Promise<AuthGatewayResult>;
  restoreSession: () => Promise<void>;
  logout: () => Promise<void>;
};

const persistToken = (token: string | null) => {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      hydrated: false,
      session: null,
      setHydrated: (value) => set({ hydrated: value }),

      setSession: (session) => {
        set({ session });
        persistToken(session?.token ?? null);
      },

      registerWithEmail: async (payload) => {
        const result = await authService.registerWithEmail(payload);
        if (result.ok && result.session) {
          set({ session: result.session });
          persistToken(result.session.token);
        }
        return result;
      },

      loginWithEmail: async (payload) => {
        const result = await authService.loginWithEmail(payload);
        if (result.ok && result.session) {
          set({ session: result.session });
          persistToken(result.session.token);
        }
        return result;
      },

      confirmSignUp: async (payload) => {
        return authService.confirmSignUp(payload);
      },

      resendConfirmationCode: async (email) => {
        return authService.resendConfirmationCode(email);
      },

      loginWithGoogle: async () => {
        return authService.loginWithGoogle();
      },

      restoreSession: async () => {
        const session = await authService.restoreSession();
        if (session) {
          set({ session });
          persistToken(session.token);
        } else {
          persistToken(null);
        }
      },

      logout: async () => {
        await authService.logout();
        set({ session: null });
        persistToken(null);
      },
    }),
    {
      name: 'skorify-auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        session: state.session,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.setHydrated(true);
        if (state.session?.token) {
          persistToken(state.session.token);
        } else {
          void state.restoreSession();
        }
      },
    },
  ),
);
