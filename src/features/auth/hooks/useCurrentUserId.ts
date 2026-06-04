'use client';

import { useAuthStore } from '../store/useAuthStore';
import { useAuthSession } from './useAuthSession';

export const useCurrentUserId = (): string | undefined => {
  const { session } = useAuthSession();
<<<<<<< HEAD
  return session?.user.id;
};

export const getCurrentUserId = (): string | undefined => {
  return useAuthStore.getState().session?.user.id;
=======
  return session?.domainUserId ?? session?.user.id;
};

export const getCurrentUserId = (): string | undefined => {
  const session = useAuthStore.getState().session;
  return session?.domainUserId ?? session?.user.id;
>>>>>>> origin/develop
};
