'use client';

import { useAuthStore } from '../store/useAuthStore';
import { mockAdminEmail } from '../data/mockUsers';

export const useAuthSession = () => {
  const session = useAuthStore((state) => state.session);
  const hydrated = useAuthStore((state) => state.hydrated);
  const isAdmin =
    session?.user.role === 'admin' || session?.user.email.trim().toLowerCase() === mockAdminEmail;

  return {
    session,
    hydrated,
    isAdmin,
    isAuthenticated: hydrated && !!session,
  };
};
