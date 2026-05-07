import type { NotificationType } from './NotificationType';

export enum ToastSeverity {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export enum NotificationVertical {
  TOP = 'top',
  BOTTOM = 'bottom',
}

export enum NotificationHorizontal {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

export type NotificationAction = {
  labelKey: string;
  onClick: () => void;
};

export type NotificationConfig = {
  type: NotificationType;
  /** i18n key resolved via useTranslations. Takes priority over `message`. */
  messageKey?: string;
  /** Raw resolved string — used by legacy callers that pre-resolve messages. */
  message?: string;
  i18nValues?: Record<string, string | number>;
  titleKey?: string;
  title?: string;
  severity?: ToastSeverity;
  position?: {
    vertical: NotificationVertical;
    horizontal: NotificationHorizontal;
  };
  actions?: NotificationAction[];
  /** Modal only: renders confirm + cancel from actions[0] and actions[1]. */
  hasTwoButtons?: boolean;
  /** Toast auto-hide ms. Defaults to SEVERITY_DURATION map in ToastHost. */
  duration?: number;
};
