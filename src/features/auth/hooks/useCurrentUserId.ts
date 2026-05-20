'use client';

import { env } from '@lib/env';
import { useAuthSession } from './useAuthSession';

export const useCurrentUserId = (): string | undefined => {
  const { session } = useAuthSession();
  return env.NEXT_PUBLIC_USER_ID ?? session?.user.id;
};

export const getCurrentUserId = (): string | undefined => {
  return env.NEXT_PUBLIC_USER_ID;
};
