/**
 * 环境配置检查脚本
 * 运行此脚本检查部署环境是否配置正确
 */

require('dotenv').config();

console.log('🔍 检查部署环境配置...\n');

let hasError = false;

// 检查 SEPOLIA_RPC_URL
if (!process.env.SEPOLIA_RPC_URL) {
  console.error('❌ SEPOLIA_RPC_URL 未设置');
  console.log('   请在 .env 文件中设置 SEPOLIA_RPC_URL');
  console.log('   格式: SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID\n');
  hasError = true;
} else {
  if (process.env.SEPOLIA_RPC_URL.includes('YOUR_PROJECT_ID') || 
      process.env.SEPOLIA_RPC_URL.includes('YOUR_KEY')) {
    console.error('❌ SEPOLIA_RPC_URL 包含占位符，请替换为实际值');
    hasError = true;
  } else {
    console.log('✅ SEPOLIA_RPC_URL 已设置');
    console.log(`   值: ${process.env.SEPOLIA_RPC_URL.substring(0, 30)}...\n`);
  }
}

// 检查 PRIVATE_KEY
if (!process.env.PRIVATE_KEY) {
  console.error('❌ PRIVATE_KEY 未设置');
  console.log('   请在 .env 文件中设置 PRIVATE_KEY');
  console.log('   格式: PRIVATE_KEY=0x你的私钥\n');
  hasError = true;
} else {
  if (!process.env.PRIVATE_KEY.startsWith('0x')) {
    console.error('❌ PRIVATE_KEY 格式错误，应该以 0x 开头');
    hasError = true;
  } else if (process.env.PRIVATE_KEY.length !== 66) {
    console.error('❌ PRIVATE_KEY 长度错误，应该是 66 个字符（包括 0x）');
    hasError = true;
  } else {
    console.log('✅ PRIVATE_KEY 已设置');
    console.log(`   格式: ${process.env.PRIVATE_KEY.substring(0, 10)}...${process.env.PRIVATE_KEY.substring(62)}\n`);
  }
}

// 检查 .env 文件是否存在
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env 文件不存在');
  console.log('   请创建 .env 文件并配置以下变量:');
  console.log('   - SEPOLIA_RPC_URL');
  console.log('   - PRIVATE_KEY\n');
  hasError = true;
} else {
  console.log('✅ .env 文件存在\n');
}

if (hasError) {
  console.log('📝 配置步骤:');
  console.log('1. 在 packages/contracts 目录下创建 .env 文件');
  console.log('2. 从 Infura 或 Alchemy 获取 SEPOLIA_RPC_URL');
  console.log('3. 从 MetaMask 导出私钥（仅用于测试）');
  console.log('4. 填入 .env 文件');
  console.log('\n详细步骤请参考: DEPLOY_GUIDE.md\n');
  process.exit(1);
} else {
  console.log('✅ 环境配置检查通过！');
  console.log('   可以开始部署合约了\n');
  console.log('   运行: npm run deploy:sepolia\n');
  process.exit(0);
}



