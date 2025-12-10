'use client';

import { useEffect } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { NotificationProvider } from '@/components/NotificationProvider';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { setupGlobalErrorHandler } from '@/utils/errorHandler';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // 设置全局错误处理器，过滤 Talisman 错误
    setupGlobalErrorHandler();
  }, []);

  return (
    <html lang="zh">
      <body className={inter.className}>
        <LanguageProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}

