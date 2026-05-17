'use client';

import { useAuthStore } from '../store/useAuthStore';
import { isAdminSession } from '../lib/adminAccess';

export const useAuthSession = () => {
  const session = useAuthStore((state) => state.session);
  const hydrated = useAuthStore((state) => state.hydrated);
  const isAdmin = isAdminSession(session);

  return {
    session,
    hydrated,
    isAdmin,
    isAuthenticated: hydrated && !!session,
  };
};
