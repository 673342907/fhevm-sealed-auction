'use client';

import { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { initFhevm } from '@/utils/fhevm';
import { safeGetEthereum, isMetaMask } from '@/utils/walletUtils';
import { useLanguage } from '@/contexts/LanguageContext';
import WalletConnect from '@/components/WalletConnect';
import ContractAddressSelector from '@/components/ContractAddressSelector';
import VotingPlatform from '@/components/VotingPlatform';
import RealTimeNotifications from '@/components/RealTimeNotifications';
import OnboardingGuide from '@/components/OnboardingGuide';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useNotification } from '@/components/NotificationProvider';

export default function Home() {
  const { t } = useLanguage();
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  // 默认合约地址（如果已部署，请替换为实际地址）
  // 默认使用已部署的投票合约地址
  const [contractAddress, setContractAddress] = useState<string>('0x532d2B3325BA52e7F9FE7De61830A2F120d1082b');
  const [fhevmReady, setFhevmReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTips, setShowTips] = useState(false);
  
  // 尝试使用通知系统
  let showNotification: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
  try {
    const notification = useNotification();
    showNotification = notification.showNotification;
  } catch {
    // 如果不在 Provider 中，使用 alert 作为后备
      showNotification = (type, message) => {
      if (type === 'error') {
        alert(`❌ ${t.common.error}: ${message}`);
      } else if (type === 'success') {
        alert(`✅ ${message}`);
      } else {
        alert(message);
      }
    };
  }

  useEffect(() => {
    checkWalletConnection();
    // 检查是否需要显示引导
    const seen = localStorage.getItem('voting-platform-onboarding-seen');
    if (!seen) {
      setShowOnboarding(true);
    }
  }, []);

  const checkWalletConnection = async () => {
    // 只检查 MetaMask，忽略其他扩展（如 Talisman）
    const ethereum = safeGetEthereum();
    if (!ethereum) {
      return;
    }

    try {
      const provider = new BrowserProvider(ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0].address);
        setProvider(provider);
        await initializeFhevm();
      }
    } catch (error: any) {
      // 忽略 Talisman 相关的错误
      if (error.message?.includes('Talisman') || error.message?.includes('onboarding')) {
        console.warn('Talisman 扩展未配置，跳过');
        return;
      }
      console.error('Error checking wallet:', error);
    }
  };

  const initializeFhevm = async () => {
    try {
      // 添加超时机制（5秒）
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('FHEVM 初始化超时')), 5000);
      });

      await Promise.race([
        initFhevm(),
        timeoutPromise
      ]);
      
      setFhevmReady(true);
      console.log('✅ FHEVM 初始化成功');
    } catch (error: any) {
      console.error('Error initializing FHEVM:', error);
      // 即使初始化失败，也允许继续使用（因为这是占位符实现）
      // 在实际环境中，应该处理这个错误
      console.warn('⚠️ FHEVM 初始化失败，但允许继续使用（占位符模式）');
      setFhevmReady(true); // 设置为 true 以允许继续使用界面
    }
  };

  const connectWallet = async () => {
    // 只使用 MetaMask
    const ethereum = safeGetEthereum();
    if (!ethereum || !isMetaMask()) {
      alert('请安装 MetaMask 钱包');
      return;
    }

    try {
      const provider = new BrowserProvider(ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      setAccount(address);
      setProvider(provider);
      await initializeFhevm();
      } catch (error: any) {
      // 忽略 Talisman 相关的错误
      if (error.message?.includes('Talisman') || error.message?.includes('onboarding')) {
        console.warn('Talisman extension not configured, please use MetaMask');
        alert(t.wallet.connectDesc);
        return;
      }
      console.error('Error connecting wallet:', error);
      alert(t.notification.error);
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 text-center md:text-left">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-zama-400 via-zama-500 to-zama-600 bg-clip-text text-transparent">
                🗳️ {t.home.title}
              </h1>
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                {t.home.subtitle}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <button
                onClick={() => setShowTips(!showTips)}
                className="px-4 py-2 text-sm bg-zama-500/10 dark:bg-zama-500/20 text-zama-600 dark:text-zama-400 rounded-lg border border-zama-500/30 dark:border-zama-500/40 hover:bg-zama-500/20 dark:hover:bg-zama-500/30 transition-colors font-medium"
              >
                {showTips ? `📋 ${t.home.hideTips}` : `💡 ${t.home.tips}`}
              </button>
            </div>
          </div>

          {/* 功能提示（可折叠） - Zama 黄色+黑色风格 */}
          {showTips && (
            <div className="mb-6 bg-black/80 dark:bg-black/90 rounded-lg p-4 border-2 border-zama-500/50 dark:border-zama-500/60 backdrop-blur-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center p-3 rounded-lg bg-zama-500/10 dark:bg-zama-500/15 border border-zama-500/30 dark:border-zama-500/40">
                  <div className="text-2xl mb-1">🔐</div>
                  <div className="font-medium text-zama-400 dark:text-zama-300 text-xs">{t.features.encryptedVote}</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-zama-500/10 dark:bg-zama-500/15 border border-zama-500/30 dark:border-zama-500/40">
                  <div className="text-2xl mb-1">⚖️</div>
                  <div className="font-medium text-zama-400 dark:text-zama-300 text-xs">{t.features.weightedVote}</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-zama-500/10 dark:bg-zama-500/15 border border-zama-500/30 dark:border-zama-500/40">
                  <div className="text-2xl mb-1">📊</div>
                  <div className="font-medium text-zama-400 dark:text-zama-300 text-xs">{t.features.realtimeStats}</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-zama-500/10 dark:bg-zama-500/15 border border-zama-500/30 dark:border-zama-500/40">
                  <div className="text-2xl mb-1">🎯</div>
                  <div className="font-medium text-zama-400 dark:text-zama-300 text-xs">{t.features.autoReveal}</div>
                </div>
              </div>
            </div>
          )}
        </header>

        <WalletConnect
          account={account}
          onConnect={connectWallet}
          fhevmReady={fhevmReady}
        />

        {/* 引导模式 */}
        {showOnboarding && (
          <OnboardingGuide
            onComplete={() => setShowOnboarding(false)}
            onSkip={() => setShowOnboarding(false)}
          />
        )}

        {account && fhevmReady && (
          <div className="mt-6 space-y-4">
            {/* 合约地址配置 - 简化显示 */}
            <ContractAddressSelector
              value={contractAddress}
              onChange={(addr) => {
                setContractAddress(addr);
                if (addr) {
                  showNotification('success', '合约地址已设置');
                }
              }}
              onSet={() => {
                if (contractAddress) {
                  showNotification('success', '合约地址已设置');
                }
              }}
            />

            {/* 统一视图 - 包含所有功能 */}
            {contractAddress && (
              <div id="main-content">
                {/* 实时通知系统（后台运行） */}
                <div id="feature-realtime-notify" className="scroll-mt-20">
                  <RealTimeNotifications
                    provider={provider}
                    contractAddress={contractAddress}
                    account={account}
                    enabled={true}
                  />
                </div>

                {/* 投票平台 */}
                <div id="feature-encrypted-vote" className="scroll-mt-20">
                  <VotingPlatform
                    provider={provider}
                    contractAddress={contractAddress}
                    account={account}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {!account && (
          <div className="mt-8 bg-black/90 dark:bg-black border-2 border-zama-500/50 dark:border-zama-500/60 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔐</span>
              <div>
                <h3 className="font-semibold text-white dark:text-zama-100 mb-2">
                  {t.home.startUsing}
                </h3>
                <p className="text-sm text-zinc-300 dark:text-zinc-400 mb-3">
                  {t.home.connectWalletDesc}
                </p>
                <button
                  onClick={connectWallet}
                  className="px-4 py-2 bg-zama-500 text-black rounded-lg font-bold hover:bg-zama-400 transition-all shadow-lg shadow-zama-500/50"
                >
                  {t.home.connectWallet}
                </button>
              </div>
            </div>
          </div>
        )}

        {account && !fhevmReady && (
          <div className="mt-8 bg-black/90 dark:bg-black border-2 border-zama-500/50 dark:border-zama-500/60 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-zama-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white dark:text-zinc-200">
                  {t.home.initializing}
                </p>
              </div>
              <button
                onClick={() => {
                  console.warn('User chose to skip FHEVM initialization');
                  setFhevmReady(true);
                }}
                className="px-4 py-2 bg-zama-500 text-black rounded-lg hover:bg-zama-400 text-sm font-bold shadow-lg shadow-zama-500/50"
              >
                {t.home.skipDemo}
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

