'use client';

import { useMemo } from 'react';
import { NotificationType, ToastSeverity, useNotification } from '@shared/notifications';

export type SnackbarSeverity = ToastSeverity;

export interface SnackbarInput {
  severity: SnackbarSeverity;
  message: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

export interface SnackbarApi {
  enqueue: (input: SnackbarInput) => void;
  dismiss: () => void;
  show: (severity: SnackbarSeverity, message: string, options?: Partial<SnackbarInput>) => void;
  success: (message: string, options?: Partial<SnackbarInput>) => void;
  error: (message: string, options?: Partial<SnackbarInput>) => void;
  warning: (message: string, options?: Partial<SnackbarInput>) => void;
  info: (message: string, options?: Partial<SnackbarInput>) => void;
}

export const useSnackbar = (): SnackbarApi => {
  const { show: notify } = useNotification();

  return useMemo<SnackbarApi>(() => {
    const show = (severity: SnackbarSeverity, message: string, options?: Partial<SnackbarInput>) =>
      notify({
        type: NotificationType.TOAST,
        message,
        severity,
        duration: options?.duration,
      });

    return {
      enqueue: (input) => show(input.severity, input.message, input),
      dismiss: () => {},
      show,
      success: (message, options) => show(ToastSeverity.SUCCESS, message, options),
      error: (message, options) => show(ToastSeverity.ERROR, message, options),
      warning: (message, options) => show(ToastSeverity.WARNING, message, options),
      info: (message, options) => show(ToastSeverity.INFO, message, options),
    };
  }, [notify]);
};

export default useSnackbar;
