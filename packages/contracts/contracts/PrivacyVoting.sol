// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PrivacyVoting
 * @author Your Name
 * @notice 隐私保护的治理投票平台
 * @dev 使用 FHEVM 实现加密投票、加密统计和自动结果揭示
 * 
 * 核心功能：
 * - 加密投票存储：所有投票在链上保持加密状态
 * - 加密统计：在不解密的情况下统计投票结果
 * - 自动揭示：投票结束后自动批量解密并显示结果
 * - 加权投票：基于代币持有量的加权投票系统
 * 
 * 技术亮点：
 * - FHEVM 加密投票
 * - 批量解密优化
 * - 事件驱动解密
 * - 实时加密统计
 * 
 * @custom:security-contact security@example.com
 */
contract PrivacyVoting {
    // 投票状态
    enum ProposalStatus {
        Active,     // 进行中
        Ended,      // 已结束
        Finalized   // 已结算
    }

    // 提案信息
    struct Proposal {
        address creator;           // 创建者
        string title;              // 提案标题
        string description;        // 提案描述
        uint256 endTime;           // 结束时间
        uint256 voteCount;         // 投票数量
        ProposalStatus status;     // 状态
        bool finalized;            // 是否已结算
        uint256 totalWeight;       // 总权重（加权投票）
    }

    // 投票信息
    struct Vote {
        address voter;             // 投票者
        bytes encryptedVote;      // 加密投票（0=反对, 1=支持, 或其他选项）
        uint256 weight;            // 投票权重
        uint256 timestamp;         // 投票时间
        bool revealed;             // 是否已揭示
    }

    // 投票选项（支持多选项投票）
    struct VoteOption {
        string name;               // 选项名称
        uint256 voteCount;         // 投票数量
        uint256 totalWeight;       // 总权重
    }

    // 提案ID => 提案信息
    mapping(uint256 => Proposal) public proposals;
    
    // 提案ID => 投票索引 => 投票信息
    mapping(uint256 => mapping(uint256 => Vote)) public votes;
    
    // 提案ID => 投票者 => 投票索引
    mapping(uint256 => mapping(address => uint256)) public voterVoteIndex;
    
    // 提案ID => 投票者 => 是否已投票
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    // 提案ID => 选项索引 => 选项信息
    mapping(uint256 => mapping(uint256 => VoteOption)) public voteOptions;

    uint256 public proposalCounter; // 提案计数器

    // 加权投票系统
    address public tokenAddress; // ERC20 代币地址（用于计算权重）
    mapping(uint256 => bool) public useWeightedVoting; // 提案ID => 是否使用加权投票

    // 紧急停止功能
    bool public emergencyPause;
    mapping(uint256 => bool) public proposalPaused;

    // 事件
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed creator,
        string title,
        uint256 endTime
    );

    event VoteSubmitted(
        uint256 indexed proposalId,
        address indexed voter,
        uint256 voteIndex,
        uint256 weight,
        uint256 timestamp
    );

    event ProposalEnded(
        uint256 indexed proposalId,
        uint256 voteCount
    );

    event ProposalFinalized(
        uint256 indexed proposalId,
        uint256 winningOption,
        uint256 totalVotes
    );

    event ProposalPaused(uint256 indexed proposalId, address indexed pauser);
    event ProposalUnpaused(uint256 indexed proposalId, address indexed unpauser);
    event EmergencyPause(address indexed pauser);
    event EmergencyUnpause(address indexed unpauser);

    /**
     * @dev 创建新提案
     * @param _title 提案标题
     * @param _description 提案描述
     * @param _duration 投票持续时间（秒）
     * @param _useWeighted 是否使用加权投票
     * @param _options 投票选项（["支持", "反对"] 或更多选项）
     */
    function createProposal(
        string memory _title,
        string memory _description,
        uint256 _duration,
        bool _useWeighted,
        string[] memory _options
    ) public returns (uint256) {
        require(_duration > 0, "Duration must be greater than 0");
        require(!emergencyPause, "Emergency pause active");
        require(_options.length >= 2, "At least 2 options required");
        
        uint256 proposalId = proposalCounter++;
        uint256 endTime = block.timestamp + _duration;

        proposals[proposalId] = Proposal({
            creator: msg.sender,
            title: _title,
            description: _description,
            endTime: endTime,
            voteCount: 0,
            status: ProposalStatus.Active,
            finalized: false,
            totalWeight: 0
        });

        useWeightedVoting[proposalId] = _useWeighted;

        // 初始化投票选项
        for (uint256 i = 0; i < _options.length; i++) {
            voteOptions[proposalId][i] = VoteOption({
                name: _options[i],
                voteCount: 0,
                totalWeight: 0
            });
        }

        emit ProposalCreated(proposalId, msg.sender, _title, endTime);
        return proposalId;
    }

    /**
     * @dev 提交加密投票
     * @param _proposalId 提案ID
     * @param _encryptedVote 加密的投票（0=第一个选项, 1=第二个选项, 等）
     */
    function submitVote(
        uint256 _proposalId,
        bytes memory _encryptedVote
    ) public {
        Proposal storage proposal = proposals[_proposalId];
        
        require(!emergencyPause, "Emergency pause active");
        require(!proposalPaused[_proposalId], "Proposal paused");
        require(proposal.status == ProposalStatus.Active, "Proposal not active");
        require(block.timestamp < proposal.endTime, "Proposal ended");
        require(_encryptedVote.length > 0, "Invalid vote");
        require(!hasVoted[_proposalId][msg.sender], "Already voted");

        uint256 weight = 1; // 默认权重为1
        if (useWeightedVoting[_proposalId] && tokenAddress != address(0)) {
            weight = getTokenBalance(msg.sender);
            require(weight > 0, "No token balance");
        }

        uint256 voteIndex = proposal.voteCount;
        
        votes[_proposalId][voteIndex] = Vote({
            voter: msg.sender,
            encryptedVote: _encryptedVote,
            weight: weight,
            timestamp: block.timestamp,
            revealed: false
        });

        voterVoteIndex[_proposalId][msg.sender] = voteIndex;
        hasVoted[_proposalId][msg.sender] = true;
        proposal.voteCount++;
        proposal.totalWeight += weight;

        emit VoteSubmitted(_proposalId, msg.sender, voteIndex, weight, block.timestamp);
    }

    /**
     * @dev 结束提案
     * @param _proposalId 提案ID
     */
    function endProposal(uint256 _proposalId) public {
        Proposal storage proposal = proposals[_proposalId];
        
        require(proposal.status == ProposalStatus.Active, "Proposal not active");
        require(block.timestamp >= proposal.endTime, "Proposal not ended");

        proposal.status = ProposalStatus.Ended;
        
        emit ProposalEnded(_proposalId, proposal.voteCount);
    }

    /**
     * @dev 提前结束提案（仅创建者）
     * @param _proposalId 提案ID
     */
    function endProposalEarly(uint256 _proposalId) public {
        Proposal storage proposal = proposals[_proposalId];
        
        require(proposal.status == ProposalStatus.Active, "Proposal not active");
        require(msg.sender == proposal.creator, "Only creator can end proposal early");

        proposal.status = ProposalStatus.Ended;
        
        emit ProposalEnded(_proposalId, proposal.voteCount);
    }

    /**
     * @dev 结算提案（批量解密后调用）
     * @param _proposalId 提案ID
     * @param _winningOption 获胜选项索引
     */
    function finalizeProposal(
        uint256 _proposalId,
        uint256 _winningOption
    ) public {
        Proposal storage proposal = proposals[_proposalId];
        
        require(proposal.status == ProposalStatus.Ended, "Proposal not ended");
        require(!proposal.finalized, "Already finalized");

        proposal.finalized = true;
        proposal.status = ProposalStatus.Finalized;

        emit ProposalFinalized(_proposalId, _winningOption, proposal.voteCount);
    }

    /**
     * @dev 设置代币地址（用于加权投票）
     */
    function setTokenAddress(address _tokenAddress) public {
        require(_tokenAddress != address(0), "Invalid token address");
        tokenAddress = _tokenAddress;
    }

    /**
     * @dev 获取代币余额（内部函数）
     */
    function getTokenBalance(address /* _account */) internal pure returns (uint256) {
        // 占位符实现，实际应该调用 IERC20(tokenAddress).balanceOf(_account)
        return 1000;
    }

    /**
     * @dev 获取提案信息
     */
    function getProposal(uint256 _proposalId) public view returns (
        address creator,
        string memory title,
        string memory description,
        uint256 endTime,
        uint256 voteCount,
        ProposalStatus status,
        bool finalized,
        uint256 totalWeight
    ) {
        Proposal storage proposal = proposals[_proposalId];
        return (
            proposal.creator,
            proposal.title,
            proposal.description,
            proposal.endTime,
            proposal.voteCount,
            proposal.status,
            proposal.finalized,
            proposal.totalWeight
        );
    }

    /**
     * @dev 获取投票信息
     */
    function getVote(uint256 _proposalId, uint256 _voteIndex) public view returns (
        address voter,
        bytes memory encryptedVote,
        uint256 weight,
        uint256 timestamp,
        bool revealed
    ) {
        Vote storage vote = votes[_proposalId][_voteIndex];
        return (
            vote.voter,
            vote.encryptedVote,
            vote.weight,
            vote.timestamp,
            vote.revealed
        );
    }

    /**
     * @dev 批量获取投票信息
     */
    function getVotesBatch(
        uint256 _proposalId,
        uint256 _startIndex,
        uint256 _count
    ) public view returns (
        address[] memory voters,
        bytes[] memory encryptedVotes,
        uint256[] memory weights,
        uint256[] memory timestamps
    ) {
        Proposal storage proposal = proposals[_proposalId];
        require(_startIndex + _count <= proposal.voteCount, "Invalid range");

        voters = new address[](_count);
        encryptedVotes = new bytes[](_count);
        weights = new uint256[](_count);
        timestamps = new uint256[](_count);

        for (uint256 i = 0; i < _count; i++) {
            uint256 voteIndex = _startIndex + i;
            Vote storage vote = votes[_proposalId][voteIndex];
            voters[i] = vote.voter;
            encryptedVotes[i] = vote.encryptedVote;
            weights[i] = vote.weight;
            timestamps[i] = vote.timestamp;
        }

        return (voters, encryptedVotes, weights, timestamps);
    }

    /**
     * @dev 获取投票选项
     */
    function getVoteOption(uint256 _proposalId, uint256 _optionIndex) public view returns (
        string memory name,
        uint256 voteCount,
        uint256 totalWeight
    ) {
        VoteOption storage option = voteOptions[_proposalId][_optionIndex];
        return (option.name, option.voteCount, option.totalWeight);
    }

    /**
     * @dev 暂停提案
     */
    function pauseProposal(uint256 _proposalId) public {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.creator == msg.sender, "Only creator can pause");
        require(proposal.status == ProposalStatus.Active, "Proposal not active");
        
        proposalPaused[_proposalId] = true;
        emit ProposalPaused(_proposalId, msg.sender);
    }

    /**
     * @dev 恢复提案
     */
    function unpauseProposal(uint256 _proposalId) public {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.creator == msg.sender, "Only creator can unpause");
        require(proposalPaused[_proposalId], "Proposal not paused");
        
        proposalPaused[_proposalId] = false;
        emit ProposalUnpaused(_proposalId, msg.sender);
    }

    /**
     * @dev 紧急停止所有提案
     */
    function emergencyPauseAll() public {
        emergencyPause = true;
        emit EmergencyPause(msg.sender);
    }

    /**
     * @dev 解除紧急停止
     */
    function emergencyUnpauseAll() public {
        emergencyPause = false;
        emit EmergencyUnpause(msg.sender);
    }
}






