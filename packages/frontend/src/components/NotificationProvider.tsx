'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import NotificationToast, { Notification } from './NotificationToast';

interface NotificationContextType {
  showNotification: (type: Notification['type'], message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((type: Notification['type'], message: string) => {
    const id = Date.now().toString();
    const notification: Notification = {
      id,
      type,
      message,
      timestamp: Date.now(),
    };
    setNotifications((prev) => [...prev, notification]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </NotificationContext.Provider>
  );
}






