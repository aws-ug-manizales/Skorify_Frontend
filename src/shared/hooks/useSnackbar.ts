'use client';

import { useMemo } from 'react';
import {
  useSnackbarStore,
  type SnackbarInput,
  type SnackbarSeverity,
} from '@store/useSnackbarStore';

export interface SnackbarApi {
  enqueue: (input: SnackbarInput) => string;
  dismiss: (id?: string) => void;
  clear: () => void;
  show: (severity: SnackbarSeverity, message: string, options?: Partial<SnackbarInput>) => string;
  success: (message: string, options?: Partial<SnackbarInput>) => string;
  error: (message: string, options?: Partial<SnackbarInput>) => string;
  warning: (message: string, options?: Partial<SnackbarInput>) => string;
  info: (message: string, options?: Partial<SnackbarInput>) => string;
}

export const useSnackbar = (): SnackbarApi => {
  const enqueue = useSnackbarStore((state) => state.enqueue);
  const dismiss = useSnackbarStore((state) => state.dismiss);
  const clear = useSnackbarStore((state) => state.clear);

  return useMemo<SnackbarApi>(() => {
    const show = (severity: SnackbarSeverity, message: string, options?: Partial<SnackbarInput>) =>
      enqueue({ ...options, severity, message });

    return {
      enqueue,
      dismiss,
      clear,
      show,
      success: (message, options) => show('success', message, options),
      error: (message, options) => show('error', message, options),
      warning: (message, options) => show('warning', message, options),
      info: (message, options) => show('info', message, options),
    };
  }, [enqueue, dismiss, clear]);
};

export default useSnackbar;
