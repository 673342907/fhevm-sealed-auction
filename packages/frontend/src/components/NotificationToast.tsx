'use client';

import { useState, useEffect } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: number;
}

interface NotificationToastProps {
  notification: Notification | null;
  onClose: (id: string) => void;
}

export default function NotificationToast({ notification, onClose }: NotificationToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => onClose(notification.id), 300);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification || !visible) return null;

  const typeStyles = {
    success: 'bg-green-600 border-green-700',
    error: 'bg-red-600 border-red-700',
    info: 'bg-violet-600 border-violet-700',
    warning: 'bg-amber-600 border-amber-700',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 min-w-[300px] max-w-md p-4 rounded-lg shadow-lg border ${typeStyles[notification.type]} text-white transform transition-all duration-300 ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-lg font-bold">{icons[notification.type]}</span>
          <div className="flex-1">
            <p className="font-medium text-sm">{notification.message}</p>
            <p className="text-xs opacity-75 mt-1">
              {new Date(notification.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(() => onClose(notification.id), 300);
          }}
          className="ml-4 text-white hover:text-gray-200 transition-colors"
        >
          <span className="text-sm">✕</span>
        </button>
      </div>
    </div>
  );
}


