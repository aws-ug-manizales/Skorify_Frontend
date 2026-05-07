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
  hide: () => void;
  builder: () => NotificationBuilder;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

const toastStrategy = new ToastStrategy();
const modalStrategy = new ModalStrategy();

const strategies: Record<NotificationType, INotificationStrategy> = {
  [NotificationType.TOAST]: toastStrategy,
  [NotificationType.MODAL]: modalStrategy,
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const value = useMemo<NotificationContextValue>(
    () => ({
      show: (config) => strategies[config.type].show(config),
      hide: () => {
        toastStrategy.hide();
        modalStrategy.hide();
      },
      builder: () => new NotificationBuilder(),
    }),
    [],
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
