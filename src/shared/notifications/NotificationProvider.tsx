'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { NotificationBuilder } from './NotificationBuilder';
import { NotificationType } from './NotificationType';
import type { INotificationStrategy } from './strategies/INotificationStrategy';
import { ModalStrategy } from './strategies/ModalStrategy';
import { ToastStrategy } from './strategies/ToastStrategy';
import type { NotificationConfig } from './types';
import ModalHost from '@shared/components/organisms/ModalHost';
import ToastHost from '@shared/components/organisms/ToastHost';

interface NotificationContextValue {
  show: (config: NotificationConfig) => void;
  hide: (type?: NotificationType, id?: string) => void;
  builder: () => NotificationBuilder;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const strategies = useMemo<Record<NotificationType, INotificationStrategy>>(
    () => ({
      [NotificationType.TOAST]: new ToastStrategy(),
      [NotificationType.MODAL]: new ModalStrategy(),
    }),
    [],
  );

  const value = useMemo<NotificationContextValue>(
    () => ({
      show: (config) => strategies[config.type].show(config),
      hide: (type, id) => {
        if (type !== undefined) {
          strategies[type].hide(id);
        } else {
          Object.values(strategies).forEach((s) => s.hide());
        }
      },
      builder: () => new NotificationBuilder(),
    }),
    [strategies],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastHost />
      <ModalHost />
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextValue => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used inside <NotificationProvider>');
  return ctx;
};
