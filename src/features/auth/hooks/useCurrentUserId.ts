'use client';

import { useAuthStore } from '../store/useAuthStore';
import { useAuthSession } from './useAuthSession';

export const useCurrentUserId = (): string | undefined => {
  const { session } = useAuthSession();
  return session?.user.id;
};

export const getCurrentUserId = (): string | undefined => {
  return useAuthStore.getState().session?.user.id;
};
