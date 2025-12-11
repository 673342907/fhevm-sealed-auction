# 🚀 使用真实数据 - 完整部署指南

本指南将帮助您部署合约到测试网，从而使用真实的链上数据。

## 📋 前置要求

1. ✅ Node.js 已安装
2. ✅ MetaMask 钱包已安装
3. ✅ 钱包中有一些测试网 ETH（用于支付 Gas 费）

---

## 步骤 1: 安装合约依赖

```bash
cd packages/contracts
npm install
```

---

## 步骤 2: 获取 RPC URL 和私钥

### 2.1 获取 Sepolia RPC URL

选择以下任一服务：

#### 选项 A: Infura（推荐）

1. 访问 [Infura](https://infura.io/)
2. 注册/登录账号
3. 创建新项目
4. 选择 "Sepolia" 网络
5. 复制 HTTPS URL（格式：`https://sepolia.infura.io/v3/YOUR_PROJECT_ID`）

#### 选项 B: Alchemy

1. 访问 [Alchemy](https://www.alchemy.com/)
2. 注册/登录账号
3. 创建新应用
4. 选择 "Sepolia" 网络
5. 复制 HTTPS URL（格式：`https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`）

### 2.2 获取私钥（仅用于测试）

⚠️ **安全警告**：私钥非常敏感，仅用于测试网部署！

1. 打开 MetaMask
2. 点击右上角账户图标
3. 选择 "账户详情"
4. 点击 "导出私钥"
5. 输入密码确认
6. 复制私钥（格式：`0x...`）

---

## 步骤 3: 配置环境变量

在 `packages/contracts` 目录下创建 `.env` 文件：

```bash
cd packages/contracts
# Windows PowerShell
New-Item -ItemType File -Name .env

# 或使用文本编辑器创建
```

在 `.env` 文件中填入：

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=0x你的私钥（不要包含引号）
```

**示例：**
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/abc123def456...
PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

---

## 步骤 4: 获取测试网 ETH

部署合约需要支付 Gas 费，需要 Sepolia 测试网 ETH：

### 方法 1: Alchemy Sepolia Faucet（推荐）

1. 访问 [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
2. 输入您的钱包地址
3. 完成验证（可能需要 Twitter/Google 登录）
4. 等待 ETH 到账（通常 1-5 分钟）

### 方法 2: Infura Faucet

1. 访问 [Infura Faucet](https://www.infura.io/faucet/sepolia)
2. 输入您的钱包地址
3. 完成验证
4. 等待 ETH 到账

### 方法 3: PoW Faucet

1. 访问 [PoW Faucet](https://sepolia-faucet.pk910.de/)
2. 输入您的钱包地址
3. 完成挖矿任务（可选）
4. 等待 ETH 到账

**检查余额：**
- 在 MetaMask 中切换到 Sepolia 测试网
- 查看钱包余额（应该 > 0 ETH）

---

## 步骤 5: 编译合约

```bash
cd packages/contracts
npm run compile
```

如果编译成功，您会看到：
```
Compiled 1 Solidity file successfully
```

---

## 步骤 6: 部署合约

```bash
npm run deploy:sepolia
```

部署过程可能需要 30 秒到 2 分钟，取决于网络状况。

**成功输出示例：**
```
开始部署密封投标拍卖合约...
✅ 合约部署成功！
合约地址: 0x1234567890123456789012345678901234567890
网络: sepolia

等待区块确认...
✅ 合约验证成功！
```

**重要：复制合约地址！** 这是您需要在前端使用的地址。

---

## 步骤 7: 在前端配置合约地址

### 方法 1: 在界面中设置（推荐）

1. 打开前端应用（`http://localhost:3000`）
2. 确保 MetaMask 已连接，并切换到 **Sepolia 测试网**
3. 在"合约地址配置"区域
4. 选择"自定义地址"
5. 粘贴您刚才复制的合约地址
6. 点击"设置"

### 方法 2: 通过环境变量（可选）

在 `packages/frontend` 目录下创建 `.env.local` 文件：

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x你的合约地址
NEXT_PUBLIC_CHAIN_ID=11155111
```

然后重启前端服务器：
```bash
cd packages/frontend
npm run dev
```

---

## 步骤 8: 验证连接

1. 确保前端页面上的"演示数据"选项**未勾选**
2. 刷新页面
3. 应该能看到：
   - ✅ 没有错误提示
   - ✅ 可以创建拍卖
   - ✅ 可以查看真实数据

---

## 🎉 完成！

现在您已经可以使用真实数据了！

### 测试步骤：

1. **创建拍卖**
   - 点击"创建拍卖"
   - 填写物品信息
   - 确认交易（在 MetaMask 中）
   - 等待交易确认

2. **查看拍卖**
   - 在列表中应该能看到您刚创建的拍卖
   - 点击查看详情

3. **参与竞标**
   - 打开拍卖详情
   - 输入出价金额
   - 提交加密出价
   - 确认交易

---

## ❓ 常见问题

### Q: 部署失败，提示 "insufficient funds"
**A:** 您的钱包中没有足够的 Sepolia ETH。请从水龙头获取更多测试 ETH。

### Q: 部署失败，提示 "network error"
**A:** 检查 `.env` 文件中的 `SEPOLIA_RPC_URL` 是否正确。

### Q: 部署失败，提示 "invalid private key"
**A:** 检查 `.env` 文件中的 `PRIVATE_KEY` 格式是否正确（应该以 `0x` 开头，64 个字符）。

### Q: 前端显示 "合约地址可能不正确"
**A:** 
1. 确保 MetaMask 连接到 Sepolia 测试网
2. 检查合约地址是否正确
3. 确认合约已成功部署（可以在 [Sepolia Etherscan](https://sepolia.etherscan.io/) 上搜索地址）

### Q: 如何查看合约是否部署成功？
**A:** 
1. 访问 [Sepolia Etherscan](https://sepolia.etherscan.io/)
2. 在搜索框输入您的合约地址
3. 如果能看到合约信息，说明部署成功

### Q: 可以重复部署吗？
**A:** 可以！每次部署都会生成新的合约地址。旧的地址仍然可以使用。

---

## 📝 注意事项

1. **测试网 ETH 是免费的**，但需要从水龙头获取
2. **私钥安全**：`.env` 文件包含私钥，不要提交到 Git
3. **网络选择**：确保 MetaMask 和部署脚本使用相同的网络（Sepolia）
4. **Gas 费**：每次操作（创建拍卖、出价等）都需要支付少量 Gas 费

---

## 🔗 有用链接

- [Sepolia Etherscan](https://sepolia.etherscan.io/) - 查看交易和合约
- [Infura](https://infura.io/) - RPC 服务
- [Alchemy](https://www.alchemy.com/) - RPC 服务
- [Sepolia Faucet](https://sepoliafaucet.com/) - 获取测试 ETH

---

祝您使用愉快！🎉







