const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PrivacyVoting", function () {
  let voting;
  let owner;
  let voter1;
  let voter2;

  beforeEach(async function () {
    [owner, voter1, voter2] = await ethers.getSigners();

    const PrivacyVoting = await ethers.getContractFactory("PrivacyVoting");
    voting = await PrivacyVoting.deploy();
    await voting.waitForDeployment();
  });

  describe("创建提案", function () {
    it("应该能够创建提案", async function () {
      const title = "测试提案";
      const description = "这是一个测试提案";
      const duration = 86400; // 1天
      const options = ["支持", "反对"];

      const tx = await voting.createProposal(
        title,
        description,
        duration,
        false,
        options
      );
      const receipt = await tx.wait();

      // 检查事件
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "ProposalCreated"
      );
      expect(event).to.not.be.undefined;

      // 检查提案信息
      const proposal = await voting.getProposal(0);
      expect(proposal.title).to.equal(title);
      expect(proposal.description).to.equal(description);
      expect(proposal.creator).to.equal(owner.address);
      expect(proposal.status).to.equal(0); // Active
    });

    it("应该能够创建加权投票提案", async function () {
      const title = "加权投票提案";
      const description = "这是一个加权投票提案";
      const duration = 86400;
      const options = ["支持", "反对"];

      const tx = await voting.createProposal(
        title,
        description,
        duration,
        true, // 使用加权投票
        options
      );
      await tx.wait();

      const useWeighted = await voting.useWeightedVoting(0);
      expect(useWeighted).to.be.true;
    });
  });

  describe("投票", function () {
    beforeEach(async function () {
      const title = "测试提案";
      const description = "这是一个测试提案";
      const duration = 86400;
      const options = ["支持", "反对"];

      await voting.createProposal(
        title,
        description,
        duration,
        false,
        options
      );
    });

    it("应该能够提交投票", async function () {
      // 模拟加密投票（实际应该使用 FHEVM）
      const encryptedVote = ethers.toUtf8Bytes("0"); // 支持

      const tx = await voting.connect(voter1).submitVote(0, encryptedVote);
      const receipt = await tx.wait();

      // 检查事件
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "VoteSubmitted"
      );
      expect(event).to.not.be.undefined;

      // 检查投票信息
      const hasVoted = await voting.hasVoted(0, voter1.address);
      expect(hasVoted).to.be.true;

      const proposal = await voting.getProposal(0);
      expect(proposal.voteCount).to.equal(1n);
    });

    it("不应该允许重复投票", async function () {
      const encryptedVote = ethers.toUtf8Bytes("0");

      await voting.connect(voter1).submitVote(0, encryptedVote);

      // 尝试再次投票应该失败
      await expect(
        voting.connect(voter1).submitVote(0, encryptedVote)
      ).to.be.revertedWith("Already voted");
    });
  });

  describe("结束提案", function () {
    beforeEach(async function () {
      const title = "测试提案";
      const description = "这是一个测试提案";
      const duration = 86400;
      const options = ["支持", "反对"];

      await voting.createProposal(
        title,
        description,
        duration,
        false,
        options
      );
    });

    it("创建者应该能够提前结束提案", async function () {
      await voting.endProposalEarly(0);

      const proposal = await voting.getProposal(0);
      expect(proposal.status).to.equal(1); // Ended
    });

    it("非创建者不应该能够提前结束提案", async function () {
      await expect(
        voting.connect(voter1).endProposalEarly(0)
      ).to.be.revertedWith("Only creator can end proposal early");
    });
  });
});




