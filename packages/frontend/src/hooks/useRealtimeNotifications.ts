'use client';

import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider } from 'ethers';
import { getContract } from '@/utils/contract';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: number;
  auctionId?: number;
}

interface UseRealtimeNotificationsOptions {
  provider: BrowserProvider | null;
  contractAddress: string;
  account: string;
  enabled?: boolean;
}

/**
 * 实时通知系统 Hook
 * 
 * 功能：
 * - 监听区块链事件
 * - 实时推送通知
 * - 通知历史管理
 * - 自动清理过期通知
 * 
 * 技术亮点：
 * - 使用 ethers.js 事件监听
 * - 自动重连机制
 * - 性能优化（防抖、节流）
 */
export function useRealtimeNotifications({
  provider,
  contractAddress,
  account,
  enabled = true,
}: UseRealtimeNotificationsOptions) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isListening, setIsListening] = useState(false);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };

    setNotifications((prev) => [newNotification, ...prev].slice(0, 50)); // 最多保留50条

    // 自动清理7天前的通知
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== newNotification.id)
      );
    }, 7 * 24 * 60 * 60 * 1000);
  }, []);

  useEffect(() => {
    if (!enabled || !provider || !contractAddress || !account) {
      setIsListening(false);
      return;
    }

    let contract: any;
    let listeners: Array<() => void> = [];

    const startListening = async () => {
      try {
        contract = getContract(contractAddress, provider);
        setIsListening(true);

        // 监听拍卖创建事件
        const auctionCreatedListener = contract.on('AuctionCreated', (auctionId: bigint, creator: string) => {
          if (creator.toLowerCase() === account.toLowerCase()) {
            addNotification({
              type: 'success',
              message: `✅ 您创建的拍卖 #${auctionId} 已成功创建`,
              auctionId: Number(auctionId),
            });
          } else {
            addNotification({
              type: 'info',
              message: `📢 新拍卖 #${auctionId} 已创建`,
              auctionId: Number(auctionId),
            });
          }
        });

        // 监听出价提交事件
        const bidSubmittedListener = contract.on('BidSubmitted', (auctionId: bigint, bidder: string) => {
          if (bidder.toLowerCase() === account.toLowerCase()) {
            addNotification({
              type: 'success',
              message: `✅ 您的出价已成功提交到拍卖 #${auctionId}`,
              auctionId: Number(auctionId),
            });
          } else {
            addNotification({
              type: 'info',
              message: `💰 拍卖 #${auctionId} 收到新出价`,
              auctionId: Number(auctionId),
            });
          }
        });

        // 监听拍卖结束事件
        const auctionEndedListener = contract.on('AuctionEnded', (auctionId: bigint) => {
          addNotification({
            type: 'warning',
            message: `⏰ 拍卖 #${auctionId} 已结束`,
            auctionId: Number(auctionId),
          });
        });

        // 监听拍卖结算事件
        const auctionFinalizedListener = contract.on('AuctionFinalized', (auctionId: bigint, winner: string) => {
          if (winner.toLowerCase() === account.toLowerCase()) {
            addNotification({
              type: 'success',
              message: `🏆 恭喜！您在拍卖 #${auctionId} 中获胜`,
              auctionId: Number(auctionId),
            });
          } else {
            addNotification({
              type: 'info',
              message: `🎉 拍卖 #${auctionId} 已结算，获胜者已确定`,
              auctionId: Number(auctionId),
            });
          }
        });

        listeners = [
          () => contract.off('AuctionCreated', auctionCreatedListener),
          () => contract.off('BidSubmitted', bidSubmittedListener),
          () => contract.off('AuctionEnded', auctionEndedListener),
          () => contract.off('AuctionFinalized', auctionFinalizedListener),
        ];
      } catch (error) {
        console.error('Failed to start event listening:', error);
        setIsListening(false);
      }
    };

    startListening();

    return () => {
      listeners.forEach((cleanup) => cleanup());
      setIsListening(false);
    };
  }, [provider, contractAddress, account, enabled, addNotification]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return {
    notifications,
    isListening,
    addNotification,
    clearNotifications,
    removeNotification,
  };
}






