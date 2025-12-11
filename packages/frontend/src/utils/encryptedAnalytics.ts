/**
 * 加密状态下的统计分析工具
 * 
 * 这个模块提供了在加密状态下进行统计分析的功能
 * 展示了 FHE 技术的核心能力：在不解密的情况下进行计算
 * 
 * 技术说明：
 * - 虽然当前实现需要解密后进行统计，但展示了统计分析的思路
 * - 理想的实现应该在链上使用 FHEVM 进行加密状态下的计算
 * - 这个模块为未来的链上加密统计提供了接口设计
 */

import { decryptMultiple, compareEncryptedBids } from './fhevm';

/**
 * 加密出价的统计信息
 */
export interface EncryptedBidStats {
  totalBids: number;
  averageBid: number;
  highestBid: number;
  lowestBid: number;
  medianBid: number;
  standardDeviation: number;
  bidRange: {
    min: number;
    max: number;
  };
}

/**
 * 在加密状态下计算出价统计信息
 * 
 * @param contractAddress 合约地址
 * @param encryptedBids 加密出价数组
 * @returns 统计信息
 * 
 * 技术说明：
 * - 当前实现需要批量解密后计算
 * - 未来可以升级为链上加密计算
 */
export async function calculateBidStatistics(
  contractAddress: string,
  encryptedBids: string[]
): Promise<EncryptedBidStats> {
  if (encryptedBids.length === 0) {
    return {
      totalBids: 0,
      averageBid: 0,
      highestBid: 0,
      lowestBid: 0,
      medianBid: 0,
      standardDeviation: 0,
      bidRange: { min: 0, max: 0 },
    };
  }

  // 批量解密（使用优化的 decryptMultiple）
  const decryptedBids = await decryptMultiple(contractAddress, encryptedBids);
  
  // 计算统计信息
  const sortedBids = [...decryptedBids].sort((a, b) => a - b);
  const totalBids = decryptedBids.length;
  const sum = decryptedBids.reduce((acc, bid) => acc + bid, 0);
  const averageBid = sum / totalBids;
  const highestBid = sortedBids[sortedBids.length - 1];
  const lowestBid = sortedBids[0];
  const medianBid = sortedBids.length % 2 === 0
    ? (sortedBids[sortedBids.length / 2 - 1] + sortedBids[sortedBids.length / 2]) / 2
    : sortedBids[Math.floor(sortedBids.length / 2)];

  // 计算标准差
  const variance = decryptedBids.reduce((acc, bid) => acc + Math.pow(bid - averageBid, 2), 0) / totalBids;
  const standardDeviation = Math.sqrt(variance);

  return {
    totalBids,
    averageBid: Math.round(averageBid * 100) / 100,
    highestBid: Math.round(highestBid * 100) / 100,
    lowestBid: Math.round(lowestBid * 100) / 100,
    medianBid: Math.round(medianBid * 100) / 100,
    standardDeviation: Math.round(standardDeviation * 100) / 100,
    bidRange: {
      min: lowestBid,
      max: highestBid,
    },
  };
}

/**
 * 在加密状态下对出价进行排序
 * 
 * @param contractAddress 合约地址
 * @param encryptedBids 加密出价数组
 * @returns 排序后的索引数组（从高到低）
 * 
 * 技术说明：
 * - 使用 compareEncryptedBids 进行加密比较
 * - 返回排序后的索引，而不是解密后的值
 * - 这展示了如何在加密状态下进行排序操作
 */
export async function sortEncryptedBids(
  contractAddress: string,
  encryptedBids: string[]
): Promise<number[]> {
  if (encryptedBids.length === 0) {
    return [];
  }

  // 创建索引数组
  const indices = encryptedBids.map((_, index) => index);

  // 使用加密比较进行排序（冒泡排序算法）
  // 注意：这是一个简化的实现，实际应该使用更高效的排序算法
  for (let i = 0; i < indices.length - 1; i++) {
    for (let j = 0; j < indices.length - i - 1; j++) {
      const idx1 = indices[j];
      const idx2 = indices[j + 1];
      
      // 使用加密比较
      const comparison = await compareEncryptedBids(
        contractAddress,
        encryptedBids[idx1],
        encryptedBids[idx2]
      );

      // 如果第一个出价小于第二个，交换位置
      if (comparison < 0) {
        [indices[j], indices[j + 1]] = [indices[j + 1], indices[j]];
      }
    }
  }

  return indices;
}

/**
 * 在加密状态下计算出价分布
 * 
 * @param contractAddress 合约地址
 * @param encryptedBids 加密出价数组
 * @param ranges 价格范围数组
 * @returns 每个范围内的出价数量
 */
export async function calculateBidDistribution(
  contractAddress: string,
  encryptedBids: string[],
  ranges: { min: number; max: number }[]
): Promise<number[]> {
  // 批量解密
  const decryptedBids = await decryptMultiple(contractAddress, encryptedBids);

  // 计算每个范围内的数量
  return ranges.map((range) => {
    return decryptedBids.filter((bid) => bid >= range.min && bid < range.max).length;
  });
}

/**
 * 在加密状态下找出前 N 个最高出价
 * 
 * @param contractAddress 合约地址
 * @param encryptedBids 加密出价数组
 * @param topN 前 N 个
 * @returns 前 N 个最高出价的索引数组
 */
export async function findTopNBids(
  contractAddress: string,
  encryptedBids: string[],
  topN: number
): Promise<number[]> {
  if (encryptedBids.length === 0) {
    return [];
  }

  // 使用排序函数找出前 N 个
  const sortedIndices = await sortEncryptedBids(contractAddress, encryptedBids);
  return sortedIndices.slice(0, Math.min(topN, sortedIndices.length));
}




