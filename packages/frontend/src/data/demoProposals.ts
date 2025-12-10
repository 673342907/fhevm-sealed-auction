/**
 * 预设的演示提案数据
 * 用户打开页面就能看到这些数据，无需创建
 */

export interface DemoProposal {
  id: number;
  creator: string;
  title: string;
  description: string;
  endTime: number; // Unix timestamp
  voteCount: number;
  status: number; // 0=进行中, 1=已结束, 2=已结算
  finalized: boolean;
  totalWeight: number;
  votes: DemoVote[];
  options: string[];
}

export interface DemoVote {
  voter: string;
  option: number; // 0=支持, 1=反对
  weight: number;
  timestamp: number;
}

export const DEMO_PROPOSALS: DemoProposal[] = [
  {
    id: 0,
    creator: '0x1234567890123456789012345678901234567890',
    title: '是否支持项目升级到 v2.0？',
    description: '本次升级将引入新的隐私保护功能，包括增强的加密算法和更快的处理速度。升级后，系统将支持更大规模的投票和更复杂的治理决策。',
    endTime: Math.floor(Date.now() / 1000) + 86400 * 2, // 2天后结束
    voteCount: 156,
    status: 0, // 进行中
    finalized: false,
    totalWeight: 125000,
    options: ['支持', '反对'],
    votes: [
      { voter: '0x1111111111111111111111111111111111111111', option: 0, weight: 5000, timestamp: Math.floor(Date.now() / 1000) - 3600 * 2 },
      { voter: '0x2222222222222222222222222222222222222222', option: 0, weight: 8000, timestamp: Math.floor(Date.now() / 1000) - 3600 * 1.5 },
      { voter: '0x3333333333333333333333333333333333333333', option: 1, weight: 3000, timestamp: Math.floor(Date.now() / 1000) - 3600 * 1 },
      { voter: '0x4444444444444444444444444444444444444444', option: 0, weight: 12000, timestamp: Math.floor(Date.now() / 1000) - 1800 },
      { voter: '0x5555555555555555555555555555555555555555', option: 0, weight: 6000, timestamp: Math.floor(Date.now() / 1000) - 900 },
    ],
  },
  {
    id: 1,
    creator: '0x9876543210987654321098765432109876543210',
    title: '是否增加开发团队预算？',
    description: '为了加速项目开发，提议将开发团队预算增加30%。这将用于招聘更多开发人员、购买开发工具和基础设施升级。',
    endTime: Math.floor(Date.now() / 1000) + 86400 * 5, // 5天后结束
    voteCount: 89,
    status: 0, // 进行中
    finalized: false,
    totalWeight: 78000,
    options: ['支持', '反对'],
    votes: [
      { voter: '0x6666666666666666666666666666666666666666', option: 0, weight: 15000, timestamp: Math.floor(Date.now() / 1000) - 7200 },
      { voter: '0x7777777777777777777777777777777777777777', option: 1, weight: 8000, timestamp: Math.floor(Date.now() / 1000) - 5400 },
      { voter: '0x8888888888888888888888888888888888888888', option: 0, weight: 12000, timestamp: Math.floor(Date.now() / 1000) - 3600 },
      { voter: '0x9999999999999999999999999999999999999999', option: 0, weight: 10000, timestamp: Math.floor(Date.now() / 1000) - 1800 },
    ],
  },
  {
    id: 2,
    creator: '0xABCDEFABCDEFABCDEFABCDEFABCDEFABCDEFABCD',
    title: '是否引入新的治理机制？',
    description: '提议引入基于代币持有量的加权投票机制，让持有更多代币的用户在治理决策中拥有更大的影响力。这将使治理更加公平和高效。',
    endTime: Math.floor(Date.now() / 1000) - 3600, // 1小时前已结束
    voteCount: 234,
    status: 1, // 已结束
    finalized: false,
    totalWeight: 198000,
    options: ['支持', '反对'],
    votes: [
      { voter: '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', option: 0, weight: 25000, timestamp: Math.floor(Date.now() / 1000) - 86400 * 2 },
      { voter: '0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB', option: 0, weight: 18000, timestamp: Math.floor(Date.now() / 1000) - 86400 * 1.5 },
      { voter: '0xCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC', option: 1, weight: 12000, timestamp: Math.floor(Date.now() / 1000) - 86400 * 1 },
      { voter: '0xDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD', option: 0, weight: 22000, timestamp: Math.floor(Date.now() / 1000) - 86400 * 0.5 },
      { voter: '0xEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', option: 0, weight: 15000, timestamp: Math.floor(Date.now() / 1000) - 7200 },
    ],
  },
  {
    id: 3,
    creator: '0xFEDCBAFEDCBAFEDCBAFEDCBAFEDCBAFEDCBAFEDC',
    title: '是否支持新的合作伙伴？',
    description: '提议与一家领先的区块链技术公司建立合作伙伴关系。这将为项目带来更多资源、技术支持和市场机会。',
    endTime: Math.floor(Date.now() / 1000) - 86400 * 3, // 3天前已结束
    voteCount: 312,
    status: 2, // 已结算
    finalized: true,
    totalWeight: 256000,
    options: ['支持', '反对'],
    votes: [
      { voter: '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', option: 0, weight: 35000, timestamp: Math.floor(Date.now() / 1000) - 86400 * 5 },
      { voter: '0x1010101010101010101010101010101010101010', option: 0, weight: 28000, timestamp: Math.floor(Date.now() / 1000) - 86400 * 4 },
      { voter: '0x2020202020202020202020202020202020202020', option: 1, weight: 15000, timestamp: Math.floor(Date.now() / 1000) - 86400 * 3.5 },
      { voter: '0x3030303030303030303030303030303030303030', option: 0, weight: 32000, timestamp: Math.floor(Date.now() / 1000) - 86400 * 3 },
      { voter: '0x4040404040404040404040404040404040404040', option: 0, weight: 25000, timestamp: Math.floor(Date.now() / 1000) - 86400 * 2.5 },
    ],
  },
];

/**
 * 计算投票结果统计
 */
export function calculateVoteResults(proposal: DemoProposal): { option: number; count: number; percentage: number }[] {
  const results: { [key: number]: number } = {};
  proposal.votes.forEach(vote => {
    results[vote.option] = (results[vote.option] || 0) + 1;
  });

  return Object.entries(results)
    .map(([option, count]) => ({
      option: parseInt(option),
      count,
      percentage: (count / proposal.voteCount) * 100,
    }))
    .sort((a, b) => b.count - a.count);
}


