'use client';

import { useAuthStore } from '../store/useAuthStore';
import { canCreateGroups as canCreateGroupsCheck, isAdminSession } from '../lib/adminAccess';

export const useAuthSession = () => {
  const session = useAuthStore((state) => state.session);
  const hydrated = useAuthStore((state) => state.hydrated);
  const isAdmin = isAdminSession(session);
  const canCreateGroups = canCreateGroupsCheck(session);

  return {
    session,
    hydrated,
    isAdmin,
    canCreateGroups,
    isAuthenticated: hydrated && !!session,
  };
};
