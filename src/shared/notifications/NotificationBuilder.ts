import { NotificationType } from './NotificationType';
import { NotificationVertical, NotificationHorizontal } from './types';
import type { NotificationAction, NotificationConfig } from './types';

export class NotificationBuilder {
  private config: Partial<NotificationConfig> = {};

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

  withSeverity(severity: NotificationConfig['severity']): this {
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
    if (!this.config.type) throw new Error('NotificationBuilder: type is required');
    if (!this.config.messageKey && !this.config.message) {
      throw new Error('NotificationBuilder: messageKey or message is required');
    }
    return this.config as NotificationConfig;
  }
}
