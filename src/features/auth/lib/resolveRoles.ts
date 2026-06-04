import type { AuthRole } from '../types/auth';
import { ADMIN_ROLE, GENERAL_ROLE, MANAGER_ROLE } from '../types/auth';

// Cognito group names → app roles. Admins can access admin views and create
// groups; managers can only create groups. Anyone else is a general user.
export const ADMIN_GROUP = 'admins';
export const MANAGER_GROUP = 'managers';

export const resolveRoles = (cognitoGroups: string[]): AuthRole[] => {
  const roles: AuthRole[] = [];
  if (cognitoGroups.includes(ADMIN_GROUP)) roles.push(ADMIN_ROLE);
  if (cognitoGroups.includes(MANAGER_GROUP)) roles.push(MANAGER_ROLE);
  return roles.length > 0 ? roles : [GENERAL_ROLE];
};
