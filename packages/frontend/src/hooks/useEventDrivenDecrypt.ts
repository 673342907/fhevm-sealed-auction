/**
 * 事件驱动的自中继解密 Hook
 * 
 * 这个 Hook 实现了 FHEVM 的事件驱动解密功能：
 * 1. 监听合约事件（如 AuctionEnded）
 * 2. 当事件触发时，自动批量解密相关数据
 * 3. 更新 UI 状态
 * 
 * 这是 FHEVM SDK 的高级功能，展示了事件驱动的自中继解密模式
 */

import { useEffect, useState, useCallback } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import { getContract, AUCTION_ABI } from '@/utils/contract';
import { decryptMultiple } from '@/utils/fhevm';

interface EventDrivenDecryptOptions {
  provider: BrowserProvider | null;
  contractAddress: string;
  account: string;
  onDecryptComplete?: (data: any) => void;
}

export function useEventDrivenDecrypt({
  provider,
  contractAddress,
  account,
  onDecryptComplete,
}: EventDrivenDecryptOptions) {
  const [isListening, setIsListening] = useState(false);
  const [decryptedData, setDecryptedData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  /**
   * 处理 AuctionEnded 事件
   * 当拍卖结束时，自动批量解密所有出价
   */
  const handleAuctionEnded = useCallback(
    async (...args: any[]) => {
      // 兼容不同事件回调签名：可能是 (auctionId, bidCount) 或 (auctionId, bidCount, event)
      const auctionId = args?.[0];
      const bidCount = args?.[1];
      if (!provider || !contractAddress) return;
      if (auctionId === undefined || bidCount === undefined) return;

      try {
        console.log(`🎉 Auction ${auctionId} ended with ${bidCount} bids. Starting batch decryption...`);

        const contract = getContract(contractAddress, provider);
        const count = Number(bidCount);

        // 获取所有加密出价
        const encryptedBids: string[] = [];
        for (let i = 0; i < count; i++) {
          const bid = await contract.getBid(Number(auctionId), i);
          encryptedBids.push(bid.encryptedBid);
        }

        // 批量解密所有出价
        const decryptedBids = await decryptMultiple(contractAddress, encryptedBids);

        // 构建解密后的数据
        const decryptedData = decryptedBids.map((amount, index) => ({
          auctionId: Number(auctionId),
          bidIndex: index,
          amount,
          timestamp: Date.now(),
        }));

        setDecryptedData(decryptedData);
        
        if (onDecryptComplete) {
          onDecryptComplete(decryptedData);
        }

        console.log('✅ Batch decryption completed:', decryptedData);
      } catch (err: any) {
        console.error('❌ Event-driven decrypt error:', err);
        setError(err.message || '批量解密失败');
      }
    },
    [provider, contractAddress, onDecryptComplete]
  );

  /**
   * 开始监听事件
   */
  const startListening = useCallback(() => {
    if (!provider || !contractAddress || isListening) return;

    try {
      const contract = getContract(contractAddress, provider) as Contract;

      // 尝试使用过滤器（ethers v6 对事件监听更严格）
      const filter = (contract as any).filters?.AuctionEnded?.();
      if (filter) {
        contract.on(filter, handleAuctionEnded);
      } else {
        contract.on('AuctionEnded', handleAuctionEnded);
      }

      setIsListening(true);
      console.log('👂 Started listening for AuctionEnded events');
    } catch (err: any) {
      console.error('Failed to start event listening:', err);
      setError(err.message || '启动事件监听失败，已自动关闭监听');
      setIsListening(false);
    }
  }, [provider, contractAddress, isListening, handleAuctionEnded]);

  /**
   * 停止监听事件
   */
  const stopListening = useCallback(() => {
    if (!provider || !contractAddress || !isListening) return;

    try {
      const contract = getContract(contractAddress, provider) as Contract;
      contract.off('AuctionEnded', handleAuctionEnded);

      setIsListening(false);
      console.log('🛑 Stopped listening for events');
    } catch (err: any) {
      console.error('Failed to stop event listening:', err);
    }
  }, [provider, contractAddress, isListening, handleAuctionEnded]);

  useEffect(() => {
    if (provider && contractAddress) {
      startListening();
    }

    return () => {
      stopListening();
    };
  }, [provider, contractAddress]);

  return {
    isListening,
    decryptedData,
    error,
    startListening,
    stopListening,
  };
}

