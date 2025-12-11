# 📝 合约地址使用指南

## 合约地址格式

合约地址是一个以太坊地址，格式如下：
- **长度**：42 个字符
- **格式**：以 `0x` 开头，后跟 40 个十六进制字符（0-9, a-f）
- **示例**：`0x1234567890123456789012345678901234567890`

## 如何获取合约地址

有两种方式获取合约地址：

### 方式一：部署新合约（推荐用于开发测试）

#### 步骤 1: 准备环境

1. **安装依赖**
```bash
cd packages/contracts
npm install
```

2. **配置环境变量**

在 `packages/contracts` 目录下创建 `.env` 文件：

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_here
```

**如何获取这些值：**
- **SEPOLIA_RPC_URL**: 
  - 访问 [Infura](https://infura.io/) 或 [Alchemy](https://www.alchemy.com/) 注册账号
  - 创建新项目，选择 Sepolia 网络
  - 复制 RPC URL

- **PRIVATE_KEY**: 
  - 在 MetaMask 中：设置 → 安全与隐私 → 显示私钥
  - ⚠️ **警告**：不要分享您的私钥！仅用于测试

#### 步骤 2: 获取测试网 ETH

部署合约需要支付 Gas 费，需要 Sepolia 测试网 ETH：

1. 访问测试网水龙头：
   - [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
   - [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
   - [PoW Faucet](https://sepolia-faucet.pk910.de/)

2. 输入您的钱包地址
3. 等待 ETH 到账（通常几分钟）

#### 步骤 3: 编译合约

```bash
cd packages/contracts
npm run compile
```

#### 步骤 4: 部署合约

```bash
npm run deploy:sepolia
```

部署成功后会显示：
```
✅ 合约部署成功！
合约地址: 0x1234567890123456789012345678901234567890
网络: sepolia
```

**复制这个地址！** 这就是您需要的合约地址。

---

### 方式二：使用已部署的合约（如果有）

如果您或其他人已经部署了合约，直接使用该地址即可。

---

## 如何在前端使用合约地址

### 方法 1: 在界面中输入（当前方式）

1. 连接钱包后
2. 在"合约地址配置"卡片中
3. 粘贴合约地址
4. 点击"设置"按钮

### 方法 2: 通过环境变量（推荐用于生产）

1. 在 `packages/frontend` 目录下创建 `.env.local` 文件：

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
```

2. 重启开发服务器：
```bash
npm run dev
```

3. 地址会自动加载到界面中

---

## 快速测试（无需部署）

如果您只是想测试界面功能，可以：

1. **使用示例地址格式**（不会真正工作，但可以测试 UI）：
   ```
   0x0000000000000000000000000000000000000000
   ```

2. **或者直接跳过合约地址设置**，查看其他功能

---

## 验证合约地址是否正确

### 检查方法：

1. **格式检查**
   - ✅ 以 `0x` 开头
   - ✅ 总共 42 个字符
   - ✅ 只包含 0-9 和 a-f

2. **在区块浏览器查看**
   - 访问 [Sepolia Etherscan](https://sepolia.etherscan.io/)
   - 输入合约地址
   - 如果地址存在，会显示合约信息

3. **在前端测试**
   - 输入地址后，尝试创建拍卖
   - 如果地址错误，交易会失败

---

## 常见问题

### Q: 我没有测试网 ETH，怎么办？
A: 使用测试网水龙头获取免费的测试 ETH（见上方步骤 2）

### Q: 部署合约需要多少钱？
A: 在测试网上通常是免费的（使用测试 ETH），主网需要真实 ETH

### Q: 可以重复使用同一个合约地址吗？
A: 可以！一个合约地址可以创建多个拍卖

### Q: 合约地址会改变吗？
A: 不会。一旦部署，地址就固定了

### Q: 如何知道合约是否部署成功？
A: 
- 部署脚本会显示成功消息
- 在 Etherscan 上搜索地址
- 在前端尝试创建拍卖

---

## 完整部署示例

```bash
# 1. 进入合约目录
cd packages/contracts

# 2. 安装依赖
npm install

# 3. 创建 .env 文件（手动创建并填入配置）

# 4. 编译
npm run compile

# 5. 部署
npm run deploy:sepolia

# 6. 复制输出的合约地址

# 7. 在前端界面中粘贴地址并点击"设置"
```

---

## 下一步

获取合约地址后：
1. ✅ 在前端界面中输入地址
2. ✅ 点击"设置"
3. ✅ 开始创建拍卖和参与竞标！






