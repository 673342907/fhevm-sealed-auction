const hre = require("hardhat");

async function main() {
  console.log("开始部署隐私保护投票平台合约...");

  const PrivacyVoting = await hre.ethers.getContractFactory("PrivacyVoting");
  const voting = await PrivacyVoting.deploy();

  await voting.waitForDeployment();

  const address = await voting.getAddress();
  console.log("✅ 投票合约部署成功！");
  console.log("合约地址:", address);
  console.log("网络:", hre.network.name);
  
  // 验证合约（如果支持）
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n等待区块确认...");
    await voting.deploymentTransaction().wait(5);
    
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [],
      });
      console.log("✅ 合约验证成功！");
    } catch (error) {
      console.log("⚠️ 合约验证失败:", error.message);
    }
  }

  console.log("\n📋 部署信息:");
  console.log("==========================================");
  console.log("合约名称: PrivacyVoting");
  console.log("合约地址:", address);
  console.log("网络:", hre.network.name);
  console.log("==========================================");
  console.log("\n💡 请将合约地址复制到前端配置中！");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


