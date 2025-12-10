'use client';

import { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { getVotingContract } from '@/utils/votingContract';
import { encryptValue, decryptMultiple } from '@/utils/fhevm';
import { useTransaction } from '@/hooks/useTransaction';
import { useNotification } from '@/components/NotificationProvider';
import { useLanguage } from '@/contexts/LanguageContext';
import LoadingSpinner from './LoadingSpinner';

interface VotingPlatformProps {
  provider: BrowserProvider | null;
  contractAddress: string;
  account: string;
}

interface Proposal {
  id: number;
  creator: string;
  title: string;
  description: string;
  endTime: bigint;
  voteCount: bigint;
  status: number; // 0=Active, 1=Ended, 2=Finalized
  finalized: boolean;
  totalWeight: bigint;
}

interface Vote {
  voter: string;
  encryptedVote: string;
  weight: bigint;
  timestamp: bigint;
  revealed: boolean;
}

/**
 * Voting Platform Main Component
 * 
 * Features:
 * - Create proposals (one-click creation)
 * - Encrypted voting (one-click voting)
 * - Real-time statistics (auto display)
 * - Result revelation (auto decryption)
 * 
 * Simplified operations:
 * - Create proposal: Fill title and description → Click create
 * - Vote: Select option → Click vote
 * - View results: Auto display
 */
export default function VotingPlatform({
  provider,
  contractAddress,
  account,
}: VotingPlatformProps) {
  const { t, language } = useLanguage();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
  const [votingDuration, setVotingDuration] = useState('86400'); // Default 1 day
  const [useWeighted, setUseWeighted] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  
  const createTransaction = useTransaction();
  const endProposalTransaction = useTransaction();

  // Preset proposal templates - dynamically generated based on language
  const proposalTemplates = language === 'zh' ? [
    {
      title: '是否支持项目升级到 v2.0？',
      description: '本次升级将引入新的隐私保护功能，包括增强的加密算法和更快的处理速度。升级后，系统将支持更大规模的投票和更复杂的治理决策。',
      duration: '604800', // 1周
      weighted: false,
    },
    {
      title: '是否增加开发团队预算？',
      description: '为了加速项目开发，提议将开发团队预算增加30%。这将用于招聘更多开发人员、购买开发工具和基础设施升级。',
      duration: '604800', // 1周
      weighted: true,
    },
    {
      title: '是否引入新的治理机制？',
      description: '提议引入基于代币持有量的加权投票机制，让持有更多代币的用户在治理决策中拥有更大的影响力。这将使治理更加公平和高效。',
      duration: '259200', // 3天
      weighted: true,
    },
    {
      title: '是否支持新的合作伙伴？',
      description: '提议与一家领先的区块链技术公司建立合作伙伴关系。这将为项目带来更多资源、技术支持和市场机会。',
      duration: '604800', // 1周
      weighted: false,
    },
    {
      title: '是否调整代币分配方案？',
      description: '提议调整代币分配方案，将更多代币分配给社区贡献者和早期支持者，以激励社区参与和长期发展。',
      duration: '259200', // 3天
      weighted: true,
    },
    {
      title: '是否启动新的功能开发？',
      description: '提议启动新的功能开发项目，包括移动端应用、API接口和数据分析工具。这将提升用户体验和平台竞争力。',
      duration: '172800', // 2天
      weighted: false,
    },
  ] : [
    {
      title: 'Should we support project upgrade to v2.0?',
      description: 'This upgrade will introduce new privacy protection features, including enhanced encryption algorithms and faster processing speeds. After the upgrade, the system will support larger-scale voting and more complex governance decisions.',
      duration: '604800',
      weighted: false,
    },
    {
      title: 'Should we increase development team budget?',
      description: 'To accelerate project development, we propose increasing the development team budget by 30%. This will be used to hire more developers, purchase development tools, and upgrade infrastructure.',
      duration: '604800',
      weighted: true,
    },
    {
      title: 'Should we introduce a new governance mechanism?',
      description: 'We propose introducing a weighted voting mechanism based on token holdings, allowing users with more tokens to have greater influence in governance decisions. This will make governance more fair and efficient.',
      duration: '259200',
      weighted: true,
    },
    {
      title: 'Should we support a new partnership?',
      description: 'We propose establishing a partnership with a leading blockchain technology company. This will bring more resources, technical support, and market opportunities to the project.',
      duration: '604800',
      weighted: false,
    },
    {
      title: 'Should we adjust token distribution plan?',
      description: 'We propose adjusting the token distribution plan to allocate more tokens to community contributors and early supporters to incentivize community participation and long-term development.',
      duration: '259200',
      weighted: true,
    },
    {
      title: 'Should we launch new feature development?',
      description: 'We propose launching a new feature development project, including mobile applications, API interfaces, and data analysis tools. This will improve user experience and platform competitiveness.',
      duration: '172800',
      weighted: false,
    },
  ];

  let showNotification: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
  try {
    const notification = useNotification();
    showNotification = notification.showNotification;
  } catch {
    showNotification = () => {};
  }

  useEffect(() => {
    if (provider && contractAddress) {
      loadProposals();
    } else {
      setLoading(false);
      setProposals([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, contractAddress]);

  const loadProposals = async () => {
    if (!provider || !contractAddress) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    let hasError = false;
    let errorMessage = '';
    let proposalList: Proposal[] = [];
    
    try {
      const contract = getVotingContract(contractAddress, provider);
      
      // Get proposal count, increase timeout to 60 seconds
      let counter: bigint;
      try {
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 60000); // 60 second timeout
        });
        counter = await Promise.race([contract.proposalCounter(), timeoutPromise]) as bigint;
      } catch (error: any) {
        console.error('Error getting proposal counter:', error);
        hasError = true;
        errorMessage = error?.message || 'Failed to get proposal count';
        throw error;
      }
      
      const count = Number(counter);
      console.log(`Found ${count} proposals`);
      
      if (count === 0) {
        setProposals([]);
        setLoading(false);
        return;
      }
      
      // Load proposal list, 15 second timeout per proposal
      proposalList = [];
      const loadPromises: Promise<void>[] = [];
      
      for (let i = 0; i < count; i++) {
        const loadPromise = (async () => {
          try {
            const proposalDataPromise = contract.getProposal(i);
            const timeoutPromise = new Promise<never>((_, reject) => {
              setTimeout(() => reject(new Error('Timeout')), 15000); // 15秒超时
            });
            
            const proposalData = await Promise.race([
              proposalDataPromise,
              timeoutPromise
            ]) as any;
            
            proposalList.push({
              id: i,
              creator: proposalData[0],
              title: proposalData[1],
              description: proposalData[2],
              endTime: proposalData[3],
              voteCount: proposalData[4],
              status: Number(proposalData[5]),
              finalized: proposalData[6],
              totalWeight: proposalData[7],
            });
          } catch (error) {
            console.error(`Error loading proposal ${i}:`, error);
            // Continue loading other proposals, don't interrupt the entire process
          }
        })();
        
        loadPromises.push(loadPromise);
      }
      
      // Wait for all proposals to load, maximum 90 seconds
      try {
        await Promise.race([
          Promise.all(loadPromises),
          new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Overall timeout')), 90000); // 90秒总超时
          })
        ]);
      } catch (error: any) {
        // Even if timeout, use loaded proposals
        console.warn('Some proposals may not have loaded:', error);
        if (proposalList.length === 0) {
          hasError = true;
          errorMessage = error?.message || 'Failed to load proposals';
        }
      }
      
      // Sort by ID to ensure correct order
      proposalList.sort((a, b) => a.id - b.id);
      
      setProposals(proposalList);
      console.log(`Successfully loaded ${proposalList.length} out of ${count} proposals`);
      
      // If partially loaded proposals, show warning instead of error
      if (proposalList.length < count && proposalList.length > 0) {
        showNotification('warning', `Loaded ${proposalList.length} out of ${count} proposals. Some proposals may be missing.`);
      } else if (proposalList.length === 0 && count > 0) {
        // Only show error if completely failed
        hasError = true;
        errorMessage = 'Failed to load any proposals';
      }
      
    } catch (error: any) {
      console.error('Error loading proposals:', error);
      hasError = true;
      errorMessage = error?.message || 'Unknown error';
    } finally {
      setLoading(false);
      
      // Only show error if truly failed and no proposals loaded
      if (hasError && proposalList.length === 0) {
        if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
          showNotification('error', 'Request timeout. Please check your network connection and try again.');
        } else if (errorMessage.includes('network') || errorMessage.includes('Network')) {
          showNotification('error', 'Network error. Please check your connection.');
        } else {
          showNotification('error', t.voting.loadFailed + ': ' + errorMessage);
        }
      }
    }
  };

  const handleCreateProposal = async () => {
    if (!provider || !contractAddress || !proposalTitle || !proposalDescription) {
      showNotification('error', t.voting.fillRequired);
      return;
    }

    try {
      const signer = await provider.getSigner();
      const contract = getVotingContract(contractAddress, signer);
      
      const options = [t.voting.support, t.voting.oppose]; // Default two options
      const duration = parseInt(votingDuration);

      const result = await createTransaction.execute(
        contract.createProposal(
          proposalTitle,
          proposalDescription,
          duration,
          useWeighted,
          options
        )
      );

      if (result.success) {
        showNotification('success', t.voting.createSuccess);
        setProposalTitle('');
        setProposalDescription('');
        setVotingDuration('86400'); // Reset to default value
        setUseWeighted(false);
        setSelectedTemplate(null);
        setShowCreateForm(false);
        await loadProposals();
      } else {
        showNotification('error', result.error || t.voting.createFailed);
      }
    } catch (error: any) {
      console.error('Create proposal failed:', error);
      showNotification('error', error.message || t.voting.createFailed);
    }
  };

  const handleVote = async (proposalId: number, optionIndex: number) => {
    if (!provider || !contractAddress) return;

    try {
      // Encrypted vote options (0=Support, 1=Against)
      const encryptedVote = await encryptValue(contractAddress, account, optionIndex);
      const signer = await provider.getSigner();
      const contract = getVotingContract(contractAddress, signer);
      
      const encryptedBytes = new Uint8Array(encryptedVote.length);
      for (let i = 0; i < encryptedVote.length; i++) {
        encryptedBytes[i] = encryptedVote.charCodeAt(i);
      }

      const result = await voteTransaction.execute(
        contract.submitVote(proposalId, encryptedBytes)
      );

      if (result.success) {
        showNotification('success', t.voting.voteSuccess);
        await loadProposals();
      } else {
        showNotification('error', result.error || t.voting.voteFailed);
      }
    } catch (error: any) {
      console.error('Vote failed:', error);
      showNotification('error', error.message || t.voting.voteFailed);
    }
  };

  const handleEndProposalEarly = async (proposalId: number) => {
    if (!provider || !contractAddress) return;

    // Confirmation dialog
    if (!confirm(t.voting.endEarlyConfirm)) {
      return;
    }

    try {
      const signer = await provider.getSigner();
      const contract = getVotingContract(contractAddress, signer);

      const result = await endProposalTransaction.execute(
        contract.endProposalEarly(proposalId)
      );

      if (result.success) {
        showNotification('success', t.voting.endSuccess);
        await loadProposals();
      } else {
        showNotification('error', result.error || t.voting.endFailed);
      }
    } catch (error: any) {
      console.error('End proposal early failed:', error);
      const errorMessage = error.message || t.voting.endFailed;
      if (errorMessage.includes('Only creator')) {
        showNotification('error', t.voting.endFailed || 'Only proposal creator can end proposal early');
      } else {
        showNotification('error', errorMessage);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text={t.voting.loadingProposals || 'Loading proposals...'} />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Create proposal area */}
      <div className="bg-black/90 dark:bg-black rounded-xl shadow-lg border-2 border-zama-500/50 dark:border-zama-500/60 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            🗳️ {t.voting.createProposal}
          </h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-zama-500 text-black rounded-lg font-bold hover:bg-zama-400 transition-all shadow-lg shadow-zama-500/50"
          >
            {showCreateForm ? t.voting.cancel : `+ ${t.voting.create}`}
          </button>
        </div>

        {showCreateForm && (
          <div className="space-y-4 mt-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
            {/* Preset template selection */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                📋 {t.voting.template}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-black/50 dark:bg-black/70 rounded-lg border border-zama-500/40 dark:border-zama-500/50">
                {proposalTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setProposalTitle(template.title);
                      setProposalDescription(template.description);
                      setVotingDuration(template.duration);
                      setUseWeighted(template.weighted);
                      setSelectedTemplate(index);
                    }}
                    className={`p-3 text-left rounded-lg border-2 transition-all hover:scale-105 ${
                      selectedTemplate === index
                        ? 'border-zama-500 bg-zama-500/20 dark:bg-zama-500/30'
                        : 'border-zinc-700 dark:border-zinc-800 hover:border-zama-500/60 dark:hover:border-zama-500/60'
                    }`}
                  >
                    <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1 line-clamp-1">
                      {template.title}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                      <span>{template.duration === '3600' ? t.voting.hour : template.duration === '86400' ? t.voting.day : template.duration === '172800' ? t.voting.days.replace('{n}', '2') : template.duration === '259200' ? t.voting.days.replace('{n}', '3') : t.voting.week}</span>
                      {template.weighted && <span className="text-zama-500 dark:text-zama-400 font-semibold">⚖️ {t.voting.weighted}</span>}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                💡 {t.voting.templateHint}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                {t.voting.proposalTitle} *
              </label>
              <input
                type="text"
                value={proposalTitle}
                onChange={(e) => {
                  setProposalTitle(e.target.value);
                  setSelectedTemplate(null);
                }}
                placeholder={t.voting.placeholderTitle}
                maxLength={100}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                {t.voting.proposalDesc} *
              </label>
              <textarea
                value={proposalDescription}
                onChange={(e) => {
                  setProposalDescription(e.target.value);
                  setSelectedTemplate(null);
                }}
                placeholder={t.voting.placeholderDesc}
                rows={4}
                maxLength={500}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  {t.voting.votingDuration}
                </label>
                <select
                  value={votingDuration}
                  onChange={(e) => setVotingDuration(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-900"
                >
                  <option value="3600">{t.voting.hour}</option>
                  <option value="86400">{t.voting.day}</option>
                  <option value="604800">{t.voting.week}</option>
                </select>
              </div>
              <div className="flex items-center pt-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useWeighted}
                    onChange={(e) => setUseWeighted(e.target.checked)}
                    className="rounded w-4 h-4 text-zama-500"
                  />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">{t.voting.useWeighted}</span>
                </label>
              </div>
            </div>
            <button
              onClick={handleCreateProposal}
              disabled={createTransaction.isPending || !proposalTitle || !proposalDescription}
              className="w-full px-4 py-3 bg-zama-500 text-black rounded-lg font-bold hover:bg-zama-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-zama-500/50"
            >
              {createTransaction.isPending ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>{t.common.loading || 'Creating...'}</span>
                </>
              ) : (
                `✅ ${t.voting.create}`
              )}
            </button>
          </div>
        )}
      </div>

      {/* Proposal list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            📋 {t.voting.proposalList} ({proposals.length})
          </h2>
          <button
            onClick={loadProposals}
            className="px-3 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            🔄 {t.common.refresh}
          </button>
        </div>

        {proposals.length === 0 ? (
          <div className="bg-gradient-to-br from-zama-950/40 via-zama-900/20 to-zama-950/40 dark:from-zama-950/60 dark:via-zama-900/40 dark:to-zama-950/60 rounded-xl shadow-lg border border-zama-500/20 dark:border-zama-500/30 p-12 text-center backdrop-blur-sm">
            {!contractAddress ? (
              <>
                <p className="text-zinc-600 dark:text-zinc-400 mb-2">{t.contract.setAddressFirst}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-4">
                  {t.contract.setAddressDesc}
                </p>
              </>
            ) : (
              <>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">{t.voting.noProposals}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-4">
                  {t.voting.createFirst}
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-6 py-3 bg-zama-500 text-black rounded-lg font-bold hover:bg-zama-400 shadow-lg shadow-zama-500/50"
                >
                  + {t.voting.createFirst}
                </button>
              </>
            )}
          </div>
        ) : (
          proposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              provider={provider}
              contractAddress={contractAddress}
              account={account}
              onVote={handleVote}
              onEndEarly={handleEndProposalEarly}
              onRefresh={loadProposals}
            />
          ))
        )}
      </div>
    </div>
  );
}

/**
 * 提案卡片组件
 */
function ProposalCard({
  proposal,
  provider,
  contractAddress,
  account,
  onVote,
  onEndEarly,
  onRefresh,
}: {
  proposal: Proposal;
  provider: BrowserProvider | null;
  contractAddress: string;
  account: string;
  onVote: (proposalId: number, optionIndex: number) => void;
  onEndEarly: (proposalId: number) => void;
  onRefresh: () => void;
}) {
  const { t } = useLanguage();
  const [hasVoted, setHasVoted] = useState(false);
  const [voteResult, setVoteResult] = useState<{ option: number; count: number }[] | null>(null);
  const [loading, setLoading] = useState(false);

  let showNotification: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
  try {
    const { useNotification } = require('@/components/NotificationProvider');
    const notification = useNotification();
    showNotification = notification.showNotification;
  } catch {
    showNotification = (type, message) => {
      if (type === 'success') {
        alert(`✅ ${message}`);
      } else {
        alert(message);
      }
    };
  }

  useEffect(() => {
    checkVoteStatus();
    // 不再自动加载投票结果，改为用户主动点击时才加载
    // 这样可以避免页面加载时自动触发签名
  }, [proposal.id, proposal.status]);

  const checkVoteStatus = async () => {
    if (!provider || !contractAddress) return;
    try {
      const contract = getVotingContract(contractAddress, provider);
      const voted = await contract.hasVoted(proposal.id, account);
      setHasVoted(voted);
    } catch (error) {
      console.error('Error checking vote status:', error);
    }
  };

  const loadVoteResults = async () => {
    if (!provider || !contractAddress || loading) return;
    
    setLoading(true);
    try {
      const contract = getVotingContract(contractAddress, provider);
      const voteCount = Number(proposal.voteCount);
      
      if (voteCount === 0) {
        setVoteResult([]);
        setLoading(false);
        return;
      }

      // 批量获取投票
      const [voters, encryptedVotes, weights, timestamps] = await contract.getVotesBatch(
        proposal.id,
        0,
        voteCount
      );

      if (!encryptedVotes || encryptedVotes.length === 0) {
        setVoteResult([]);
        setLoading(false);
        return;
      }

      // 将 bytes 数组转换为字符串数组（decryptMultiple 需要字符串数组）
      const encryptedVoteStrings: string[] = [];
      for (let i = 0; i < encryptedVotes.length; i++) {
        const encryptedBytes = encryptedVotes[i];
        try {
          // 将 bytes 转换为字符串
          if (typeof encryptedBytes === 'string') {
            encryptedVoteStrings.push(encryptedBytes);
          } else if (encryptedBytes instanceof Uint8Array) {
            // 如果是 Uint8Array，转换为字符串
            encryptedVoteStrings.push(String.fromCharCode(...encryptedBytes));
          } else if (Array.isArray(encryptedBytes)) {
            // 如果是数组，转换为字符串
            encryptedVoteStrings.push(String.fromCharCode(...encryptedBytes));
          } else if (encryptedBytes && typeof encryptedBytes === 'object' && 'length' in encryptedBytes) {
            // 如果是类数组对象，尝试转换
            const arr = Array.from(encryptedBytes as any);
            encryptedVoteStrings.push(String.fromCharCode(...arr));
          } else {
            // 尝试使用 ethers 的 hexlify 转换
            try {
              const { ethers } = await import('ethers');
              const hexString = ethers.hexlify(encryptedBytes as any);
              encryptedVoteStrings.push(hexString);
            } catch {
              encryptedVoteStrings.push('');
            }
          }
        } catch (error) {
          console.error(`⚠️ 转换加密数据失败 (index ${i}):`, error);
          encryptedVoteStrings.push('');
        }
      }

      // 批量解密投票
      const decryptedVotes = await decryptMultiple(contractAddress, encryptedVoteStrings);

      // 统计结果
      const results: { [key: number]: number } = {};
      decryptedVotes.forEach((vote) => {
        if (vote !== null && vote !== undefined && !isNaN(vote)) {
          const option = Math.round(vote);
          results[option] = (results[option] || 0) + 1;
        }
      });

      const voteResultArray = Object.entries(results)
        .map(([option, count]) => ({ option: parseInt(option), count }))
        .sort((a, b) => b.count - a.count);

      setVoteResult(voteResultArray.length > 0 ? voteResultArray : null);
    } catch (error: any) {
      console.error('Failed to load vote results:', error);
      showNotification('error', `${t.voting.loadingResults}: ${error.message || t.common.error}`);
      setVoteResult(null);
    } finally {
      setLoading(false);
    }
  };

  const currentTime = Math.floor(Date.now() / 1000);
  const endTimeSeconds = Number(proposal.endTime);
  const isActive = proposal.status === 0 && currentTime < endTimeSeconds;
  const isEnded = proposal.status === 1 || (proposal.status === 0 && currentTime >= endTimeSeconds);
  const isFinalized = proposal.status === 2 || proposal.finalized;
  const isCreator = proposal.creator.toLowerCase() === account.toLowerCase();

  return (
    <div className="bg-gradient-to-br from-zama-950/40 via-zama-900/20 to-zama-950/40 dark:from-zama-950/60 dark:via-zama-900/40 dark:to-zama-950/60 rounded-xl shadow-lg border border-zama-500/20 dark:border-zama-500/30 p-6 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {proposal.title}
            </h3>
            {isCreator && (
              <span className="px-2 py-0.5 text-xs bg-zama-500/30 dark:bg-zama-500/40 text-black dark:text-black rounded font-semibold">
                👤 {t.voting.creator}
              </span>
            )}
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 mb-3">
            {proposal.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-500">
            <span>📊 {proposal.voteCount.toString()} {t.voting.voteCount}</span>
            <span>⏰ {new Date(endTimeSeconds * 1000).toLocaleString()}</span>
            {proposal.totalWeight > proposal.voteCount && <span>⚖️ {t.voting.useWeighted}</span>}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 text-xs rounded font-medium ${
            isActive 
              ? 'bg-zama-500/20 dark:bg-zama-500/30 text-zama-700 dark:text-zama-300' 
              : isEnded && !isFinalized
              ? 'bg-zama-500/20 dark:bg-zama-500/30 text-zama-700 dark:text-zama-300'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
          }`}>
            {isActive ? t.voting.active : isEnded && !isFinalized ? t.voting.ended : t.voting.finalized}
          </span>
          {isActive && isCreator && (
            <button
              onClick={() => onEndEarly(proposal.id)}
              className="px-3 py-1 text-xs bg-amber-500 hover:bg-amber-600 text-white rounded font-medium transition-colors"
              title={t.voting.endEarly}
            >
              ⏹️ {t.voting.endEarly}
            </button>
          )}
        </div>
      </div>

      {/* 投票区域 */}
      {isActive && !hasVoted && (
        <div className="mt-4 p-4 bg-black/90 dark:bg-black rounded-lg border-2 border-zama-500/50 dark:border-zama-500/60 backdrop-blur-sm">
          <p className="text-sm font-medium text-white dark:text-zama-100 mb-3">
            {t.voting.selectVote}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => onVote(proposal.id, 0)}
              className="flex-1 px-4 py-3 bg-zama-500 text-black rounded-lg font-bold hover:bg-zama-400 transition-all shadow-lg shadow-zama-500/50 flex items-center justify-center gap-2"
            >
              ✅ {t.voting.support}
            </button>
            <button
              onClick={() => onVote(proposal.id, 1)}
              className="flex-1 px-4 py-3 bg-zinc-700 text-white rounded-lg font-bold hover:bg-zinc-600 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              ❌ {t.voting.oppose}
            </button>
          </div>
          <p className="text-xs text-zinc-300 dark:text-zinc-400 mt-2 text-center">
            💡 {t.voting.voteDesc}
          </p>
        </div>
      )}

      {/* 已投票提示 */}
      {hasVoted && isActive && (
        <div className="mt-4 p-4 bg-zama-500/20 dark:bg-zama-500/30 rounded-lg border border-zama-500/40 dark:border-zama-500/50">
          <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100 text-center">
            ✅ {t.voting.voted}
          </p>
        </div>
      )}

      {/* 投票结果 */}
      {(isEnded || isFinalized) && (
        <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
              📊 {t.voting.results}
            </h4>
            {!loading && voteResult === null && Number(proposal.voteCount) > 0 && (
              <button
                onClick={loadVoteResults}
                className="text-sm px-4 py-2 bg-zama-500 text-black rounded-lg hover:bg-zama-400 transition-all font-bold shadow-lg shadow-zama-500/50"
              >
                🔓 {t.voting.viewResults}
              </button>
            )}
            {!loading && voteResult !== null && (
              <button
                onClick={loadVoteResults}
                className="text-xs px-3 py-1 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
              >
                🔄 {t.common.refresh}
              </button>
            )}
          </div>
          {loading ? (
            <LoadingSpinner size="sm" text={t.voting.loadingResults} />
          ) : voteResult && voteResult.length > 0 ? (
            <div className="space-y-2">
              {voteResult.map((result) => (
                <div key={result.option} className="flex items-center gap-3">
                  <span className="w-20 text-sm text-zinc-600 dark:text-zinc-400">
                    {result.option === 0 ? `✅ ${t.voting.support}` : `❌ ${t.voting.oppose}`}
                  </span>
                  <div className="flex-1 bg-zinc-200 dark:bg-zinc-700 rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-zama-500 h-full rounded-full transition-all flex items-center justify-end pr-2"
                      style={{
                        width: `${(result.count / Number(proposal.voteCount)) * 100}%`,
                      }}
                    >
                      <span className="text-xs text-white font-medium">{result.count} {t.voting.voteCount} ({((result.count / Number(proposal.voteCount)) * 100).toFixed(1)}%)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : Number(proposal.voteCount) === 0 ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{t.voting.noResults}</p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-zinc-500 dark:text-zinc-500">
                {t.voting.decryptFailed.replace('{count}', proposal.voteCount.toString())}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                💡 {t.voting.decryptHint}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

