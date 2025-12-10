# 🚀 Vercel 部署指南

## 问题：显示"未部署"状态

如果 Vercel 显示"未部署"状态，有以下几种解决方法：

## 方法 1: 推送到 master 分支（推荐）

### 步骤：

1. **确保所有更改已提交**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin master
   ```

2. **在 Vercel 中触发部署**
   - 登录 Vercel 控制台
   - 进入项目设置
   - 点击 "Deployments" 标签
   - 点击 "Redeploy" 按钮
   - 或等待自动检测（通常几秒钟）

## 方法 2: 使用 Vercel CLI

### 安装 Vercel CLI

```bash
npm install -g vercel
```

### 登录 Vercel

```bash
vercel login
```

### 部署到生产环境

```bash
# 在项目根目录运行
vercel --prod
```

## 方法 3: 在 Vercel 控制台手动触发

1. 访问 [vercel.com/dashboard](https://vercel.com/dashboard)
2. 选择您的项目
3. 点击 "Deployments" 标签
4. 点击 "Redeploy" 按钮
5. 选择要部署的分支（master）
6. 点击 "Redeploy"

## 检查部署配置

### 1. 确认 vercel.json 配置

确保项目根目录有 `vercel.json` 文件：

```json
{
  "buildCommand": "npm install && cd packages/frontend && npm install && npm run build",
  "outputDirectory": "packages/frontend/.next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "rootDirectory": "packages/frontend"
}
```

### 2. 确认项目设置

在 Vercel 项目设置中检查：
- **Root Directory**: `packages/frontend`
- **Build Command**: `npm install && npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 3. 检查 GitHub 连接

- 确保 Vercel 已连接到 GitHub 仓库
- 确保仓库是公开的或已授权访问
- 检查 Webhook 是否正常工作

## 常见问题

### 问题 1: 构建失败

**错误**: `next: command not found`

**解决**: 
- 确保 `packages/frontend/package.json` 中包含所有依赖
- 检查 `vercel.json` 中的构建命令是否正确

### 问题 2: 找不到模块

**错误**: `Cannot find module '@fhenixprotocol/fhevmjs'`

**解决**: 
- 确保 `packages/frontend/package.json` 中包含该依赖
- 运行 `cd packages/frontend && npm install` 确保依赖已安装

### 问题 3: 部署后无法访问

**解决**:
- 检查构建日志是否有错误
- 确认输出目录正确（`.next`）
- 检查环境变量配置

## 验证部署

部署成功后：

1. **访问部署的网站**
   - URL: `https://fhevm-sealed-auction-nine.vercel.app`
   - 或您的自定义域名

2. **测试功能**
   - 连接 MetaMask 钱包
   - 切换到 Sepolia 测试网
   - 测试创建提案、投票等功能

3. **检查控制台**
   - 打开浏览器开发者工具
   - 检查是否有错误
   - 确认所有资源加载正常

## 自动部署设置

Vercel 默认会在推送到 master 分支时自动部署。如果未自动部署：

1. 检查项目设置中的 "Git" 配置
2. 确认 "Production Branch" 设置为 `master`
3. 检查 Webhook 是否正常

## 下一步

部署成功后，您可以：
- 设置自定义域名
- 配置环境变量
- 设置自动部署规则
- 查看部署日志和性能指标

