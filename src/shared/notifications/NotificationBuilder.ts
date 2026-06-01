import { NotificationType } from './NotificationType';
import { ToastSeverity, NotificationVertical, NotificationHorizontal } from './types';
import type { NotificationAction, NotificationConfig, ToastConfig, ModalConfig } from './types';

type BuilderState = {
  type?: NotificationType;
  messageKey?: string;
  message?: string;
  i18nValues?: Record<string, string | number>;
  titleKey?: string;
  title?: string;
  actions?: NotificationAction[];
  severity?: ToastSeverity;
  position?: { vertical: NotificationVertical; horizontal: NotificationHorizontal };
  duration?: number;
  hasTwoButtons?: boolean;
};

export class NotificationBuilder {
  private config: BuilderState = {};

  ofType(type: NotificationType): this {
    this.config.type = type;
    return this;
  }

  withMessage(key: string, values?: Record<string, string | number>): this {
    this.config.messageKey = key;
    if (values) this.config.i18nValues = values;
    return this;
  }

  withTitle(key: string): this {
    this.config.titleKey = key;
    return this;
  }

  withSeverity(severity: ToastSeverity): this {
    this.config.severity = severity;
    return this;
  }

  atPosition(vertical: NotificationVertical, horizontal: NotificationHorizontal): this {
    this.config.position = { vertical, horizontal };
    return this;
  }

  withActions(actions: NotificationAction[]): this {
    this.config.actions = actions;
    return this;
  }

  withTwoButtons(confirm: NotificationAction, cancel: NotificationAction): this {
    this.config.hasTwoButtons = true;
    this.config.actions = [confirm, cancel];
    return this;
  }

  autoDismissAfter(ms: number): this {
    this.config.duration = ms;
    return this;
  }

  build(): NotificationConfig {
    const { type } = this.config;
    if (!type) throw new Error('NotificationBuilder: type is required');
    if (!this.config.messageKey && !this.config.message) {
      throw new Error('NotificationBuilder: messageKey or message is required');
    }

    const base = {
      messageKey: this.config.messageKey,
      message: this.config.message,
      i18nValues: this.config.i18nValues,
      titleKey: this.config.titleKey,
      title: this.config.title,
      actions: this.config.actions,
    };

    if (type === NotificationType.TOAST) {
      const config: ToastConfig = {
        ...base,
        type,
        severity: this.config.severity,
        position: this.config.position,
        duration: this.config.duration,
      };
      return config;
    }

    const config: ModalConfig = {
      ...base,
      type,
      hasTwoButtons: this.config.hasTwoButtons,
    };
    return config;
  }
}
