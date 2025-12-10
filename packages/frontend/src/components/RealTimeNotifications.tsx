'use client';

import { useEffect, useState, useCallback } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import { getContract, AUCTION_ABI } from '@/utils/contract';
import { useNotification } from '@/components/NotificationProvider';

interface RealTimeNotificationsProps {
  provider: BrowserProvider | null;
  contractAddress: string;
  account: string;
  enabled?: boolean;
}

/**
 * 实时通知系统
 * 
 * 监听以下事件：
 * - AuctionCreated: 新拍卖创建
 * - BidSubmitted: 新出价提交
 * - AuctionEnded: 拍卖结束
 * - AuctionFinalized: 拍卖结算
 * - BidWithdrawn: 出价撤回
 * - BidUpdated: 出价修改
 */
export default function RealTimeNotifications({
  provider,
  contractAddress,
  account,
  enabled = true,
}: RealTimeNotificationsProps) {
  const [isListening, setIsListening] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  let showNotification: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
  try {
    const notification = useNotification();
    showNotification = notification.showNotification;
  } catch {
    showNotification = () => {};
  }

  const handleAuctionCreated = useCallback(
    (auctionId: bigint, creator: string, itemName: string, endTime: bigint) => {
      if (creator.toLowerCase() === account.toLowerCase()) {
        showNotification('success', `✅ 您创建的拍卖 "${itemName}" 已成功创建！`);
      } else {
        showNotification('info', `🆕 新拍卖: "${itemName}" (ID: ${auctionId})`);
      }
      setNotificationCount((prev) => prev + 1);
    },
    [account, showNotification]
  );

  const handleBidSubmitted = useCallback(
    (auctionId: bigint, bidder: string, bidIndex: bigint, timestamp: bigint) => {
      if (bidder.toLowerCase() === account.toLowerCase()) {
        showNotification('success', `✅ 您的出价已成功提交！(拍卖 #${auctionId})`);
      } else {
        showNotification('info', `💰 拍卖 #${auctionId} 收到新出价`);
      }
      setNotificationCount((prev) => prev + 1);
    },
    [account, showNotification]
  );

  const handleAuctionEnded = useCallback(
    (auctionId: bigint, bidCount: bigint) => {
      showNotification('warning', `⏰ 拍卖 #${auctionId} 已结束，共收到 ${bidCount} 个出价`);
      setNotificationCount((prev) => prev + 1);
    },
    [showNotification]
  );

  const handleAuctionFinalized = useCallback(
    (auctionId: bigint, winner: string, winningBid: string) => {
      if (winner.toLowerCase() === account.toLowerCase()) {
        showNotification('success', `🎉 恭喜！您在拍卖 #${auctionId} 中获胜！`);
      } else {
        showNotification('info', `🏆 拍卖 #${auctionId} 已结算，获胜者: ${winner.slice(0, 6)}...${winner.slice(-4)}`);
      }
      setNotificationCount((prev) => prev + 1);
    },
    [account, showNotification]
  );

  const handleBidWithdrawn = useCallback(
    (auctionId: bigint, bidder: string, bidIndex: bigint) => {
      if (bidder.toLowerCase() === account.toLowerCase()) {
        showNotification('info', `↩️ 您已撤回拍卖 #${auctionId} 的出价`);
      } else {
        showNotification('info', `↩️ 拍卖 #${auctionId} 有出价被撤回`);
      }
      setNotificationCount((prev) => prev + 1);
    },
    [account, showNotification]
  );

  const handleBidUpdated = useCallback(
    (auctionId: bigint, bidder: string, bidIndex: bigint, timestamp: bigint) => {
      if (bidder.toLowerCase() === account.toLowerCase()) {
        showNotification('success', `✏️ 您已更新拍卖 #${auctionId} 的出价`);
      } else {
        showNotification('info', `✏️ 拍卖 #${auctionId} 有出价被更新`);
      }
      setNotificationCount((prev) => prev + 1);
    },
    [account, showNotification]
  );

  useEffect(() => {
    if (!provider || !contractAddress || !enabled) return;

    try {
      const contract = getContract(contractAddress, provider) as Contract;

      // 监听所有相关事件
      contract.on('AuctionCreated', handleAuctionCreated);
      contract.on('BidSubmitted', handleBidSubmitted);
      contract.on('AuctionEnded', handleAuctionEnded);
      contract.on('AuctionFinalized', handleAuctionFinalized);
      contract.on('BidWithdrawn', handleBidWithdrawn);
      contract.on('BidUpdated', handleBidUpdated);

      setIsListening(true);

      return () => {
        // 清理事件监听器
        contract.off('AuctionCreated', handleAuctionCreated);
        contract.off('BidSubmitted', handleBidSubmitted);
        contract.off('AuctionEnded', handleAuctionEnded);
        contract.off('AuctionFinalized', handleAuctionFinalized);
        contract.off('BidWithdrawn', handleBidWithdrawn);
        contract.off('BidUpdated', handleBidUpdated);
        setIsListening(false);
      };
    } catch (error) {
      console.error('Failed to set up event listeners:', error);
      setIsListening(false);
    }
  }, [
    provider,
    contractAddress,
    enabled,
    handleAuctionCreated,
    handleBidSubmitted,
    handleAuctionEnded,
    handleAuctionFinalized,
    handleBidWithdrawn,
    handleBidUpdated,
  ]);

  // 不渲染任何 UI，只负责通知
  return null;
}

