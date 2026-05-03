'use client';

import { useAuthStore } from '../store/useAuthStore';

export const useAuthSession = () => {
  const session = useAuthStore((state) => state.session);
  const hydrated = useAuthStore((state) => state.hydrated);

  return {
    session,
    hydrated,
    isAuthenticated: hydrated && !!session,
  };
};
