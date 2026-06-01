'use client';

import { create } from 'zustand';
import { NotificationType } from '../NotificationType';
import type { ModalConfig, NotificationConfig } from '../types';
import type { INotificationStrategy } from './INotificationStrategy';

interface ModalStore {
  current: ModalConfig | null;
  open: boolean;
  show: (config: ModalConfig) => void;
  hide: () => void;
  clearAfterClose: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  current: null,
  open: false,
  show: (config) => set({ current: config, open: true }),
  hide: () => set({ open: false }),
  clearAfterClose: () => set({ current: null }),
}));

export class ModalStrategy implements INotificationStrategy {
  show(config: NotificationConfig): void {
    if (config.type !== NotificationType.MODAL) return;
    useModalStore.getState().show(config);
  }

  hide(): void {
    useModalStore.getState().hide();
  }
}
