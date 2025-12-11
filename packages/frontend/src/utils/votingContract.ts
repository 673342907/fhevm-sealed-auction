import { ethers } from "ethers";

// 投票合约 ABI
export const VOTING_ABI = [
  "function createProposal(string memory _title, string memory _description, uint256 _duration, bool _useWeighted, string[] memory _options) public returns (uint256)",
  "function submitVote(uint256 _proposalId, bytes memory _encryptedVote) public",
  "function endProposal(uint256 _proposalId) public",
  "function endProposalEarly(uint256 _proposalId) public",
  "function finalizeProposal(uint256 _proposalId, uint256 _winningOption) public",
  "function setTokenAddress(address _tokenAddress) public",
  "function getProposal(uint256 _proposalId) public view returns (address creator, string memory title, string memory description, uint256 endTime, uint256 voteCount, uint8 status, bool finalized, uint256 totalWeight)",
  "function getVote(uint256 _proposalId, uint256 _voteIndex) public view returns (address voter, bytes memory encryptedVote, uint256 weight, uint256 timestamp, bool revealed)",
  "function getVotesBatch(uint256 _proposalId, uint256 _startIndex, uint256 _count) public view returns (address[] memory voters, bytes[] memory encryptedVotes, uint256[] memory weights, uint256[] memory timestamps)",
  "function getVoteOption(uint256 _proposalId, uint256 _optionIndex) public view returns (string memory name, uint256 voteCount, uint256 totalWeight)",
  "function hasVoted(uint256 _proposalId, address _voter) public view returns (bool)",
  "function proposalCounter() public view returns (uint256)",
  "function pauseProposal(uint256 _proposalId) public",
  "function unpauseProposal(uint256 _proposalId) public",
  "function emergencyPauseAll() public",
  "function emergencyUnpauseAll() public",
  "event ProposalCreated(uint256 indexed proposalId, address indexed creator, string title, uint256 endTime)",
  "event VoteSubmitted(uint256 indexed proposalId, address indexed voter, uint256 voteIndex, uint256 weight, uint256 timestamp)",
  "event ProposalEnded(uint256 indexed proposalId, uint256 voteCount)",
  "event ProposalFinalized(uint256 indexed proposalId, uint256 winningOption, uint256 totalVotes)",
  "event ProposalPaused(uint256 indexed proposalId, address indexed pauser)",
  "event ProposalUnpaused(uint256 indexed proposalId, address indexed unpauser)",
  "event EmergencyPause(address indexed pauser)",
  "event EmergencyUnpause(address indexed unpauser)",
];

/**
 * 获取投票合约实例
 */
export function getVotingContract(
  address: string,
  provider: ethers.Provider | ethers.Signer
): ethers.Contract {
  return new ethers.Contract(address, VOTING_ABI, provider);
}






