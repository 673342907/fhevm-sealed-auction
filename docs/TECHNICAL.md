# 技术文档

## 架构设计

### 系统架构

```
┌─────────────────┐
│   前端应用       │
│  (Next.js)      │
└────────┬────────┘
         │
         │ 加密/解密
         │ 交易调用
         ▼
┌─────────────────┐
│   FHEVM SDK     │
│  (加密引擎)     │
└────────┬────────┘
         │
         │ 加密数据
         │ 智能合约调用
         ▼
┌─────────────────┐
│   智能合约      │
│  (Solidity)     │
└────────┬────────┘
         │
         │ 链上存储
         │ 事件触发
         ▼
┌─────────────────┐
│  区块链网络     │
│  (Sepolia)      │
└─────────────────┘
```

## 核心功能实现

### 1. 加密出价流程

```typescript
// 1. 用户输入出价金额
const bidAmount = 100;

// 2. 使用 FHEVM 加密
const encryptedBid = await encryptValue(contractAddress, userAddress, bidAmount);

// 3. 提交到智能合约
await contract.submitBid(auctionId, encryptedBid);
```

### 2. 加密状态下的价格比较

**注意**: 由于 FHEVM 的限制，实际的加密比较需要在智能合约中实现。当前版本使用链下比较（解密后比较），这是需要改进的地方。

**理想实现**（需要在合约中实现）:
```solidity
// 在智能合约中比较加密出价
function compareEncryptedBids(
    bytes memory encryptedBid1,
    bytes memory encryptedBid2
) public view returns (bool isBid1Higher) {
    // 使用 FHEVM 的加密比较操作
    // 这需要在合约中调用 FHEVM 的预编译合约
}
```

### 3. 拍卖结束流程

1. **时间到期**: 拍卖结束时间到达
2. **结束拍卖**: 调用 `endAuction()` 函数
3. **链下比较**: 获取所有加密出价，在链下解密并比较
4. **设置最高价**: 调用 `setHighestBidder()` 设置最高出价者
5. **结算拍卖**: 调用 `finalizeAuction()` 完成结算

### 4. 解密流程

```typescript
// 使用 EIP-712 签名解密
const decrypted = await decryptValue(contractAddress, encryptedBid);
```

## 智能合约设计

### SealedBidAuction 合约

#### 主要状态变量

- `auctions`: 拍卖信息映射
- `bids`: 出价信息映射
- `bidderBidIndex`: 出价者索引映射
- `hasBid`: 出价状态映射

#### 主要函数

1. **createAuction**: 创建新拍卖
2. **submitBid**: 提交加密出价
3. **endAuction**: 结束拍卖
4. **setHighestBidder**: 设置最高出价者
5. **finalizeAuction**: 结算拍卖

## 前端架构

### 组件结构

```
src/
├── app/
│   ├── layout.tsx      # 根布局
│   ├── page.tsx        # 主页面
│   └── globals.css     # 全局样式
├── components/
│   ├── WalletConnect.tsx    # 钱包连接组件
│   ├── CreateAuction.tsx    # 创建拍卖组件
│   ├── AuctionList.tsx      # 拍卖列表组件
│   └── AuctionCard.tsx      # 拍卖卡片组件
└── utils/
    ├── fhevm.ts        # FHEVM 工具函数
    └── contract.ts     # 合约交互工具
```

## 安全考虑

### 1. 加密数据保护

- 所有出价在提交前加密
- 加密数据存储在链上
- 只有授权用户可以解密自己的出价

### 2. 访问控制

- 只有拍卖创建者可以结束拍卖
- 每个地址只能出价一次
- 时间验证防止过期出价

### 3. 隐私保护

- 出价在拍卖结束前保持加密
- 使用 EIP-712 签名确保解密安全
- 防止出价信息泄露

## 已知限制

1. **加密比较**: 当前版本使用链下比较，理想情况下应在链上实现
2. **Gas 成本**: 加密操作需要较高的 Gas 费用
3. **网络支持**: 目前仅支持 Sepolia 测试网

## 未来改进

1. 实现链上加密比较
2. 支持多轮拍卖
3. 添加拍卖撤销功能
4. 优化 Gas 消耗
5. 添加更多网络支持

