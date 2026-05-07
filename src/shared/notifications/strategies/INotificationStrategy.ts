import type { NotificationConfig } from '../types';

export interface INotificationStrategy {
  show(config: NotificationConfig): void;
  hide(id?: string): void;
}
