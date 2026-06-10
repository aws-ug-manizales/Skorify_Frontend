'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { setSessionRefresher } from '@lib/api/sessionEvents';
import { authService } from '../services/authService';
import { refreshOAuthSession } from '../lib/oauth';
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
  validateSession: () => Promise<boolean>;
  logout: () => Promise<void>;
};

// Treat an OAuth session that expires within this window as already expired so
// it gets proactively refreshed rather than failing mid-request.
const EXPIRY_SKEW_MS = 30_000;

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
    (set, get) => ({
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

      // Re-validates against Cognito (getSession refreshes silently when only the
      // id/access token expired). Returns false and clears the session when the
      // refresh token is gone — i.e. the session is truly expired.
      //
      // Avoids hitting `get-user-by-sub` on every call: it only resolves the
      // domain user ID (the expensive backend call) when we don't already have
      // it. Once resolved it is carried over, so repeated validations from the
      // session-expiry watcher stay purely local to Cognito.
      validateSession: async () => {
        const current = get().session;
        if (!current) {
          return false;
        }

        // Social / Hosted-UI sessions (e.g. Google) are NOT stored in the
        // amazon-cognito-identity-js user pool, so `getCurrentUser()` can't see
        // them and `getValidSession()` would always return null — wrongly
        // logging the user out right after login. Validate these locally by the
        // token's expiry and refresh through the OAuth token endpoint instead.
        if (current.user.provider !== 'email') {
          const expiresAtMs = current.expiresAt ? new Date(current.expiresAt).getTime() : 0;
          if (expiresAtMs - Date.now() > EXPIRY_SKEW_MS) {
            return true;
          }

          const refreshed = current.refreshToken
            ? await refreshOAuthSession(current.refreshToken)
            : null;
          if (refreshed) {
            const next = {
              ...refreshed,
              domainUserId: current.domainUserId ?? refreshed.domainUserId,
            };
            set({ session: next });
            persistToken(next.token);
            return true;
          }

          set({ session: null });
          persistToken(null);
          return false;
        }

        const previousDomainUserId = current.domainUserId;
        const session = previousDomainUserId
          ? await authService.getValidSession()
          : await authService.restoreSession();

        if (session) {
          const next = previousDomainUserId
            ? { ...session, domainUserId: previousDomainUserId }
            : session;
          set({ session: next });
          persistToken(next.token);
          return true;
        }
        set({ session: null });
        persistToken(null);
        return false;
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

// Let the axios layer silently refresh the session on a 401 (stale token) and
// replay the failed request, instead of immediately logging the user out.
// Registered at module load so it's available before any request is made,
// avoiding a race with the first home fetches on app start.
if (typeof window !== 'undefined') {
  setSessionRefresher(() => useAuthStore.getState().validateSession());
}
