// 模拟数据生成器 - 用于开发和演示

export interface MockAuction {
  id: number;
  creator: string;
  itemName: string;
  itemDescription: string;
  endTime: bigint;
  bidCount: bigint;
  status: number;
  highestBidder: string;
  finalized: boolean;
}

const MOCK_ITEMS = [
  {
    name: '限量版数字艺术品 NFT',
    description: '由知名艺术家创作的独特数字艺术品，具有收藏价值。包含完整的版权和使用权。',
  },
  {
    name: 'Vintage 机械手表',
    description: '1960年代瑞士制造的精工机械手表，保存完好，附带原装表盒和证书。',
  },
  {
    name: '加密收藏卡 - 传奇系列',
    description: '区块链上的稀有收藏卡，限量发行1000张，这是第42号。具有独特的数字签名。',
  },
  {
    name: '古董相机 Leica M3',
    description: '1954年生产的徕卡M3相机，经典款型，功能完好，适合收藏和实际使用。',
  },
  {
    name: '签名版书籍套装',
    description: '知名作家的签名版书籍全集，共10册，每本都有作者亲笔签名和编号。',
  },
  {
    name: '稀有域名 crypto.eth',
    description: 'ENS域名 crypto.eth，简短易记，适合加密项目使用。包含完整的域名所有权。',
  },
  {
    name: '限量版运动鞋',
    description: '2023年限量发售的联名款运动鞋，全新未拆封，附带收藏证书和特殊包装。',
  },
  {
    name: '数字音乐版权包',
    description: '包含10首热门单曲的完整版权，可用于商业用途。包含所有授权文件。',
  },
];

const MOCK_ADDRESSES = [
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
  '0x8ba1f109551bD432803012645Hac136c22C929',
  '0x1234567890123456789012345678901234567890',
  '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
  '0x9876543210987654321098765432109876543210',
];

export function generateMockAuctions(count: number = 8): MockAuction[] {
  const now = Math.floor(Date.now() / 1000);
  const auctions: MockAuction[] = [];

  for (let i = 0; i < count; i++) {
    const item = MOCK_ITEMS[i % MOCK_ITEMS.length];
    const creator = MOCK_ADDRESSES[i % MOCK_ADDRESSES.length];
    const bidCount = BigInt(Math.floor(Math.random() * 15) + 1);
    
    // 随机状态：0=进行中, 1=已结束, 2=已结算
    const status = Math.random() > 0.7 ? (Math.random() > 0.5 ? 2 : 1) : 0;
    
    // 结束时间：1小时到7天后
    const hoursFromNow = Math.random() * 168 + 1; // 1小时到7天
    const endTime = BigInt(now + Math.floor(hoursFromNow * 3600));
    
    // 如果有出价，随机选择最高出价者
    const highestBidder = bidCount > 0 && status > 0
      ? MOCK_ADDRESSES[Math.floor(Math.random() * MOCK_ADDRESSES.length)]
      : '0x0000000000000000000000000000000000000000';

    auctions.push({
      id: i,
      creator,
      itemName: item.name,
      itemDescription: item.description,
      endTime,
      bidCount,
      status,
      highestBidder,
      finalized: status === 2,
    });
  }

  return auctions;
}

export function getMockStats(auctions: MockAuction[], userAddress: string) {
  return {
    total: auctions.length,
    active: auctions.filter(a => a.status === 0).length,
    ended: auctions.filter(a => a.status === 1).length,
    finalized: auctions.filter(a => a.status === 2).length,
    myAuctions: auctions.filter(a => 
      a.creator.toLowerCase() === userAddress.toLowerCase()
    ).length,
    myBids: auctions.filter(a => a.bidCount > 0).length,
    totalBids: auctions.reduce((sum, a) => sum + Number(a.bidCount), 0),
  };
}



