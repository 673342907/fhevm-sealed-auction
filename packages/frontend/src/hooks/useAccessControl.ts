/**
 * 多级访问控制 Hook
 * 
 * 实现三种权限级别：
 * 1. Creator（创建者）：可以结束拍卖、结算拍卖
 * 2. Bidder（出价者）：可以出价、撤回出价、修改出价、查看自己的出价
 * 3. Viewer（查看者）：只能查看拍卖信息和出价数量
 */

import { useMemo } from 'react';
import { BrowserProvider } from 'ethers';
import { getContract } from '@/utils/contract';

interface AccessControlOptions {
  provider: BrowserProvider | null;
  contractAddress: string;
  auctionId: number;
  account: string;
  auctionCreator?: string;
}

export interface AccessPermissions {
  isCreator: boolean;
  isBidder: boolean;
  isViewer: boolean;
  canEndAuction: boolean;
  canFinalizeAuction: boolean;
  canBid: boolean;
  canWithdrawBid: boolean;
  canUpdateBid: boolean;
  canViewOwnBid: boolean;
  canViewAllBids: boolean;
}

export function useAccessControl({
  provider,
  contractAddress,
  auctionId,
  account,
  auctionCreator,
}: AccessControlOptions): AccessPermissions {
  const permissions = useMemo(() => {
    if (!account || !auctionCreator) {
      return {
        isCreator: false,
        isBidder: false,
        isViewer: true,
        canEndAuction: false,
        canFinalizeAuction: false,
        canBid: false,
        canWithdrawBid: false,
        canUpdateBid: false,
        canViewOwnBid: false,
        canViewAllBids: false,
      };
    }

    const isCreator = auctionCreator.toLowerCase() === account.toLowerCase();
    const isBidder = false; // 需要通过合约查询 hasBid 来确定
    const isViewer = !isCreator && !isBidder;

    return {
      isCreator,
      isBidder,
      isViewer,
      // 创建者权限
      canEndAuction: isCreator,
      canFinalizeAuction: isCreator,
      // 出价者权限（需要从合约查询）
      canBid: !isCreator,
      canWithdrawBid: isBidder,
      canUpdateBid: isBidder,
      canViewOwnBid: isBidder || isCreator,
      // 查看者权限
      canViewAllBids: isCreator, // 只有创建者可以查看所有出价详情
    };
  }, [account, auctionCreator]);

  return permissions;
}

/**
 * 检查用户是否有出价
 */
export async function checkUserHasBid(
  provider: BrowserProvider,
  contractAddress: string,
  auctionId: number,
  account: string
): Promise<boolean> {
  try {
    const contract = getContract(contractAddress, provider);
    const hasBid = await contract.hasBid(auctionId, account);
    return hasBid;
  } catch (error) {
    console.error('Error checking user bid:', error);
    return false;
  }
}





