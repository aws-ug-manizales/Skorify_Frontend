'use client';

import { create } from 'zustand';

export type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';

export interface SnackbarItem {
  id: string;
  severity: SnackbarSeverity;
  message: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

export type SnackbarInput = Omit<SnackbarItem, 'id'>;

interface SnackbarState {
  queue: SnackbarItem[];
  enqueue: (item: SnackbarInput) => string;
  dismiss: (id?: string) => void;
  clear: () => void;
}

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const useSnackbarStore = create<SnackbarState>((set) => ({
  queue: [],
  enqueue: (item) => {
    const id = createId();
    set((state) => ({ queue: [...state.queue, { id, ...item }] }));
    return id;
  },
  dismiss: (id) =>
    set((state) => ({
      queue: id ? state.queue.filter((entry) => entry.id !== id) : state.queue.slice(1),
    })),
  clear: () => set({ queue: [] }),
}));
