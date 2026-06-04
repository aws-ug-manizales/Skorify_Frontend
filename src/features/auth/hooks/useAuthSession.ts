'use client';

import { useAuthStore } from '../store/useAuthStore';
<<<<<<< HEAD
import { isAdminSession } from '../lib/adminAccess';
=======
import { canCreateGroups as canCreateGroupsCheck, isAdminSession } from '../lib/adminAccess';
>>>>>>> origin/develop

export const useAuthSession = () => {
  const session = useAuthStore((state) => state.session);
  const hydrated = useAuthStore((state) => state.hydrated);
  const isAdmin = isAdminSession(session);
<<<<<<< HEAD
=======
  const canCreateGroups = canCreateGroupsCheck(session);
>>>>>>> origin/develop

  return {
    session,
    hydrated,
    isAdmin,
<<<<<<< HEAD
=======
    canCreateGroups,
>>>>>>> origin/develop
    isAuthenticated: hydrated && !!session,
  };
};
