// 此文件保留用于向后兼容，但已不再使用
// 投票平台使用 votingContract.ts

export const AUCTION_ABI: string[] = [];

/**
 * @deprecated 此函数已废弃，请使用 getVotingContract
 */
export function getContract(
  address: string,
  provider: any
): any {
  console.warn('getContract 已废弃，请使用 getVotingContract');
  return null;
}
