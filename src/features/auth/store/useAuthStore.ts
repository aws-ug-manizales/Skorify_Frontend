'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mockUsers } from '../data/mockUsers';
import { authService } from '../services/authService';
import type {
  AuthActionResult,
  AuthSession,
  CredentialsPayload,
  RegisterPayload,
  StoredUser,
} from '../types/auth';

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
      users: mockUsers,
      setHydrated: (value) => set({ hydrated: value }),

      registerWithEmail: (payload) => {
        const result = authService.registerWithEmail(payload, { users: get().users });
        if (result.ok && result.session) {
          set((state) => ({
            users: result.users ?? state.users,
            session: result.session,
          }));
          persistToken(result.session.token);
        }
        return result;
      },

      loginWithEmail: (payload) => {
        const result = authService.loginWithEmail(payload, { users: get().users });
        if (result.ok && result.session) {
          set((state) => ({
            users: result.users ?? state.users,
            session: result.session,
          }));
          persistToken(result.session.token);
        }
        return result;
      },

      loginWithGoogle: () => {
        const result = authService.loginWithGoogle({ users: get().users });
        if (result.ok && result.session) {
          set((state) => ({
            users: result.users ?? state.users,
            session: result.session,
          }));
          persistToken(result.session.token);
        }
        return result;
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
