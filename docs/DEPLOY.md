# 部署指南

## 前置要求

1. Node.js 18+
2. MetaMask 钱包
3. Sepolia 测试网 ETH
4. Infura 或 Alchemy API Key

## 步骤 1: 安装依赖

```bash
# 安装根目录依赖
npm install

# 安装合约依赖
cd packages/contracts
npm install

# 安装前端依赖
cd ../frontend
npm install
```

## 步骤 2: 配置环境变量

### 合约配置

在 `packages/contracts/.env` 中配置：

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_here
```

### 前端配置

在 `packages/frontend/.env.local` 中配置：

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
```

## 步骤 3: 编译合约

```bash
cd packages/contracts
npm run compile
```

## 步骤 4: 部署合约

```bash
npm run deploy:sepolia
```

部署成功后，会输出合约地址，例如：
```
✅ 合约部署成功！
合约地址: 0x1234567890123456789012345678901234567890
```

## 步骤 5: 更新前端配置

将部署的合约地址添加到 `packages/frontend/.env.local`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
```

## 步骤 6: 启动前端

```bash
cd packages/frontend
npm run dev
```

访问 http://localhost:3000

## 验证部署

1. 连接 MetaMask 钱包
2. 切换到 Sepolia 测试网
3. 创建测试拍卖
4. 提交测试出价
5. 验证功能正常

## 故障排除

### 问题 1: 合约部署失败

- 检查 RPC URL 是否正确
- 确认账户有足够的 ETH
- 检查网络连接

### 问题 2: 前端无法连接

- 确认 MetaMask 已安装
- 检查是否切换到 Sepolia 网络
- 验证合约地址是否正确

### 问题 3: FHEVM 初始化失败

- 确认网络 ID 正确 (11155111 for Sepolia)
- 检查 MetaMask 连接状态
- 查看浏览器控制台错误信息

## 生产环境部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

### 其他平台

类似地，可以在其他平台（如 Netlify、Railway 等）部署前端应用。

