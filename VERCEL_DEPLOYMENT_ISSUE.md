# Vercel 部署问题说明

## 问题
`@fhenixprotocol/fhevmjs` 这个包在 npm registry 中不存在，导致 Vercel 部署时 `npm install` 失败。

## 解决方案

### 方案 1: 在 Vercel 控制台手动配置（推荐）

1. 访问 Vercel 控制台：https://vercel.com/dashboard
2. 进入项目设置
3. 在 "Build & Development Settings" 中：
   - 设置 **Root Directory** 为 `packages/frontend`
   - 设置 **Build Command** 为 `npm install --legacy-peer-deps && npm run build`
   - 设置 **Output Directory** 为 `.next`
4. 在 "Environment Variables" 中添加（如果需要）：
   - `NPM_CONFIG_LEGACY_PEER_DEPS=true`
5. 点击 "Redeploy"

### 方案 2: 使用本地包文件

由于 `@fhenixprotocol/fhevmjs` 在本地存在，可以：

1. 将 `packages/frontend/node_modules/@fhenixprotocol/fhevmjs` 复制到项目中
2. 在 `package.json` 中使用 `file:` 路径引用
3. 提交到 Git，这样 Vercel 就可以使用它了

### 方案 3: 找到正确的包名

可能需要使用其他 FHEVM SDK，如：
- `@fhevm-sdk/core`
- `fhenixjs`
- 或其他可用的包

## 当前状态

- ✅ `vercel.json` 已配置
- ✅ 项目结构正确
- ❌ `@fhenixprotocol/fhevmjs` 包无法从 npm 安装

## 建议

**最简单的方法**：在 Vercel 控制台手动配置项目设置，并设置 `NPM_CONFIG_LEGACY_PEER_DEPS=true` 环境变量，然后重新部署。

