import { create } from 'zustand';

interface AppState {
  locale: string;
  setLocale: (locale: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  locale: 'es',
  setLocale: (locale) => set({ locale }),
}));
