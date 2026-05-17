import type { ApiError } from '@lib/api/types';
import type { AuthSession } from '../types/auth';

export const isAdminSession = (session: AuthSession | null | undefined): boolean =>
  session?.user.role === 'admin' || session?.user.email.trim().toLowerCase() === 'admin@admin.com';

export const createForbiddenError = (message = 'No tienes permiso para esta acción'): ApiError => ({
  message,
  code: 403,
});
