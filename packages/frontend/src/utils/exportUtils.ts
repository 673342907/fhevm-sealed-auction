/**
 * 导出工具函数
 * 支持导出拍卖数据、出价历史等为 CSV/JSON 格式
 */

export interface ExportableAuction {
  id: number;
  creator: string;
  itemName: string;
  itemDescription: string;
  endTime: number;
  bidCount: number;
  status: string;
  highestBidder?: string;
  finalized: boolean;
}

export interface ExportableBid {
  auctionId: number;
  bidIndex: number;
  bidder: string;
  amount?: number;
  timestamp: number;
  revealed: boolean;
}

/**
 * 导出拍卖数据为 CSV
 */
export function exportAuctionsToCSV(auctions: ExportableAuction[]): void {
  if (auctions.length === 0) {
    throw new Error('没有数据可导出');
  }

  const headers = [
    'ID',
    '创建者',
    '物品名称',
    '物品描述',
    '结束时间',
    '出价数量',
    '状态',
    '最高出价者',
    '是否已结算',
  ];

  const rows = auctions.map((auction) => [
    auction.id.toString(),
    auction.creator,
    auction.itemName,
    auction.itemDescription,
    new Date(auction.endTime * 1000).toLocaleString(),
    auction.bidCount.toString(),
    auction.status,
    auction.highestBidder || 'N/A',
    auction.finalized ? '是' : '否',
  ]);

  const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  downloadFile(csv, `auctions-${Date.now()}.csv`, 'text/csv');
}

/**
 * 导出出价历史为 CSV
 */
export function exportBidsToCSV(bids: ExportableBid[]): void {
  if (bids.length === 0) {
    throw new Error('没有数据可导出');
  }

  const headers = ['拍卖ID', '出价索引', '出价者', '金额', '时间', '状态'];

  const rows = bids.map((bid) => [
    bid.auctionId.toString(),
    bid.bidIndex.toString(),
    bid.bidder,
    bid.amount?.toFixed(2) || 'N/A',
    new Date(bid.timestamp * 1000).toLocaleString(),
    bid.revealed ? '已揭示' : '加密中',
  ]);

  const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  downloadFile(csv, `bids-${Date.now()}.csv`, 'text/csv');
}

/**
 * 导出数据为 JSON
 */
export function exportToJSON(data: any, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, `${filename}-${Date.now()}.json`, 'application/json');
}

/**
 * 下载文件
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}





