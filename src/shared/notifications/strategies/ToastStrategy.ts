'use client';

import { create } from 'zustand';
import { NotificationType } from '../NotificationType';
import type { ToastConfig, NotificationConfig } from '../types';
import type { INotificationStrategy } from './INotificationStrategy';

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export type ToastItem = ToastConfig & { id: string };

interface ToastStore {
  queue: ToastItem[];
  enqueue: (config: ToastConfig) => string;
  dismiss: (id?: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  queue: [],
  enqueue: (config) => {
    const id = createId();
    set((state) => ({ queue: [...state.queue, { id, ...config }] }));
    return id;
  },
  dismiss: (id) =>
    set((state) => ({
      queue: id ? state.queue.filter((item) => item.id !== id) : state.queue.slice(1),
    })),
}));

export class ToastStrategy implements INotificationStrategy {
  show(config: NotificationConfig): void {
    if (config.type !== NotificationType.TOAST) return;
    useToastStore.getState().enqueue(config);
  }

  hide(id?: string): void {
    useToastStore.getState().dismiss(id);
  }
}
