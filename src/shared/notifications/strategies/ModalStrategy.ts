'use client';

import { create } from 'zustand';
import type { NotificationConfig } from '../types';
import type { INotificationStrategy } from './INotificationStrategy';

interface ModalStore {
  current: NotificationConfig | null;
  open: boolean;
  show: (config: NotificationConfig) => void;
  hide: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  current: null,
  open: false,
  show: (config) => set({ current: config, open: true }),
  hide: () => set({ open: false }),
}));

export class ModalStrategy implements INotificationStrategy {
  show(config: NotificationConfig): void {
    useModalStore.getState().show(config);
  }

  hide(): void {
    useModalStore.getState().hide();
  }
}
