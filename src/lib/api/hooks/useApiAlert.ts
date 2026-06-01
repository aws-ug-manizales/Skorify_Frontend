'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import useSnackbar from '@shared/hooks/useSnackbar';
import type { ApiError } from '../types';
import useApiErrorMessage from './useApiErrorMessage';

interface ApiAlertApi {
  showApiError: (error: ApiError | null | undefined, fallback?: string) => void;
  showApiSuccess: (message: string) => void;
}

/**
 * Connects an `ApiError` (from any hook returning the standard ApiResult)
 * to the global snackbar, resolving the localized message automatically.
 */
export const useApiAlert = (): ApiAlertApi => {
  const formatError = useApiErrorMessage();
  const snackbar = useSnackbar();
  const t = useTranslations();

  const showApiError = useCallback(
    (error: ApiError | null | undefined, fallback?: string) => {
      if (!error) return;
      const message = formatError(error);
      snackbar.error(message || fallback || t('errors.generic'));
    },
    [formatError, snackbar, t],
  );

  const showApiSuccess = useCallback(
    (message: string) => {
      if (!message) return;
      snackbar.success(message);
    },
    [snackbar],
  );

  return { showApiError, showApiSuccess };
};

export default useApiAlert;
