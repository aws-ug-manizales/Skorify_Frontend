import type { ApiError } from '@lib/api/types';
import type { AuthRole, AuthSession } from '../types/auth';
import { ADMIN_ROLE, MANAGER_ROLE } from '../types/auth';

export const hasRole = (session: AuthSession | null | undefined, role: AuthRole): boolean =>
  session?.user.roles?.includes(role) ?? false;

export const hasAnyRole = (session: AuthSession | null | undefined, roles: AuthRole[]): boolean => {
  const userRoles = session?.user.roles;
  if (!userRoles?.length) return false;
  return roles.some((role) => userRoles.includes(role));
};

export const isAdminSession = (session: AuthSession | null | undefined): boolean =>
  hasRole(session, ADMIN_ROLE);

export const isManagerSession = (session: AuthSession | null | undefined): boolean =>
  hasRole(session, MANAGER_ROLE);

// Group creation is allowed for admins and managers only.
export const canCreateGroups = (session: AuthSession | null | undefined): boolean =>
  hasAnyRole(session, [ADMIN_ROLE, MANAGER_ROLE]);

export const createForbiddenError = (message = 'No tienes permiso para esta acción'): ApiError => ({
  message,
  code: 403,
});
