const hre = require("hardhat");

// 已部署的合约地址
const CONTRACT_ADDRESS = "0x532d2B3325BA52e7F9FE7De61830A2F120d1082b";

async function main() {
  console.log("开始创建演示提案...");
  console.log("合约地址:", CONTRACT_ADDRESS);

  // 获取合约实例
  const PrivacyVoting = await hre.ethers.getContractFactory("PrivacyVoting");
  const voting = PrivacyVoting.attach(CONTRACT_ADDRESS);

  // 提案列表
  const proposals = [
    {
      title: "是否支持项目升级到 v2.0？",
      description: "本次升级将引入新的隐私保护功能，包括增强的加密算法和更快的处理速度。升级后，系统将支持更大规模的投票和更复杂的治理决策。",
      duration: 86400 * 2, // 2天
      useWeighted: false,
      options: ["支持", "反对"],
    },
    {
      title: "是否增加开发团队预算？",
      description: "为了加速项目开发，提议将开发团队预算增加30%。这将用于招聘更多开发人员、购买开发工具和基础设施升级。",
      duration: 86400 * 5, // 5天
      useWeighted: false,
      options: ["支持", "反对"],
    },
    {
      title: "是否引入新的治理机制？",
      description: "提议引入基于代币持有量的加权投票机制，让持有更多代币的用户在治理决策中拥有更大的影响力。这将使治理更加公平和高效。",
      duration: 86400 * 3, // 3天
      useWeighted: true,
      options: ["支持", "反对"],
    },
    {
      title: "是否支持新的合作伙伴？",
      description: "提议与一家领先的区块链技术公司建立合作伙伴关系。这将为项目带来更多资源、技术支持和市场机会。",
      duration: 86400 * 7, // 7天
      useWeighted: false,
      options: ["支持", "反对"],
    },
  ];

  console.log(`\n准备创建 ${proposals.length} 个提案...\n`);

  for (let i = 0; i < proposals.length; i++) {
    const proposal = proposals[i];
    try {
      console.log(`创建提案 ${i + 1}/${proposals.length}: ${proposal.title}`);
      
      const tx = await voting.createProposal(
        proposal.title,
        proposal.description,
        proposal.duration,
        proposal.useWeighted,
        proposal.options
      );

      console.log(`  交易哈希: ${tx.hash}`);
      
      const receipt = await tx.wait();
      console.log(`  ✅ 提案创建成功！区块: ${receipt.blockNumber}`);
      
      // 获取提案ID（从事件中获取）
      const event = receipt.logs.find(
        (log) => {
          try {
            const parsed = voting.interface.parseLog(log);
            return parsed && parsed.name === "ProposalCreated";
          } catch {
            return false;
          }
        }
      );

      if (event) {
        const parsed = voting.interface.parseLog(event);
        console.log(`  提案ID: ${parsed.args.proposalId.toString()}`);
      }

      console.log("");
      
      // 等待一下再创建下一个，避免nonce问题
      if (i < proposals.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`  ❌ 创建提案失败:`, error.message);
      if (error.data) {
        console.error(`  错误数据:`, error.data);
      }
    }
  }

  // 获取总提案数
  const counter = await voting.proposalCounter();
  console.log("\n📊 创建完成！");
  console.log("==========================================");
  console.log(`总提案数: ${counter.toString()}`);
  console.log("==========================================");
  console.log("\n💡 现在可以在前端查看这些提案了！");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


