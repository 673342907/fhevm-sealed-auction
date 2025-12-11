'use client';

import { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { initFhevm } from '@/utils/fhevm';
import { safeGetEthereum, isMetaMask } from '@/utils/walletUtils';
import { useLanguage } from '@/contexts/LanguageContext';
import WalletConnect from '@/components/WalletConnect';
import WalletSelector from '@/components/WalletSelector';
import ContractAddressSelector from '@/components/ContractAddressSelector';
import VotingPlatform from '@/components/VotingPlatform';
import RealTimeNotifications from '@/components/RealTimeNotifications';
import OnboardingGuide from '@/components/OnboardingGuide';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import FlowAnimationDemo from '@/components/FlowAnimationDemo';
import { useNotification } from '@/components/NotificationProvider';
import { WalletInfo } from '@/utils/walletUtils';

export default function Home() {
  const { t } = useLanguage();
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
      // Default contract address (replace with actual address if deployed)
      // Default to deployed voting contract address
  const [contractAddress, setContractAddress] = useState<string>('0x532d2B3325BA52e7F9FE7De61830A2F120d1082b');
  const [fhevmReady, setFhevmReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  
  // Try to use notification system
  let showNotification: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
  try {
    const notification = useNotification();
    showNotification = notification.showNotification;
  } catch {
    // If not in Provider, use alert as fallback
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
    // Only check onboarding, completely disable automatic wallet checking
    // This prevents wallet selection popup from appearing automatically on page load
    // User must manually click "Connect Wallet" button to connect
    const seen = localStorage.getItem('voting-platform-onboarding-seen');
    if (!seen) {
      setShowOnboarding(true);
    }
    
    // NOTE: We intentionally do NOT check for existing wallet connections on page load
    // because:
    // 1. Accessing window.ethereum with multiple wallets installed triggers browser popup
    // 2. Even eth_accounts can trigger popup in some wallet implementations
    // 3. User experience is better when they explicitly choose to connect
    // 
    // If you want to restore previous connections, you can implement a more sophisticated
    // solution that uses wallet-specific APIs or waits for user interaction first
  }, []);

  const initializeFhevm = async () => {
    try {
      // Add timeout mechanism (5 seconds)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('FHEVM initialization timeout')), 5000);
      });

      await Promise.race([
        initFhevm(),
        timeoutPromise
      ]);
      
      setFhevmReady(true);
      console.log('✅ FHEVM initialized successfully');
    } catch (error: any) {
      console.error('Error initializing FHEVM:', error);
      // Even if initialization fails, allow continued use (placeholder implementation)
      // In production, this error should be handled
      console.warn('⚠️ FHEVM initialization failed, but allowing continued use (placeholder mode)');
      setFhevmReady(true); // Set to true to allow continued use of the interface
    }
  };

  const connectWallet = async () => {
    // Show wallet selector if multiple wallets are available
    setShowWalletSelector(true);
  };

  const handleWalletSelect = async (wallet: WalletInfo) => {
    try {
      // First, request account connection
      await wallet.provider.request({ method: 'eth_requestAccounts' });
      
      // Check network before creating provider
      const { getCurrentNetwork, checkAndSwitchNetwork } = await import('@/utils/networkUtils');
      let initialProvider = new BrowserProvider(wallet.provider);
      const currentNetwork = await getCurrentNetwork(initialProvider);
      
      // If network is wrong, switch it first
      if (currentNetwork && Number(currentNetwork.chainId) !== 11155111) {
        const networkResult = await checkAndSwitchNetwork(initialProvider, wallet.provider);
        if (!networkResult.isCorrect) {
          showNotification('warning', t.wallet.wrongNetwork || `Please switch to Sepolia testnet (Chain ID: 11155111). Current network: ${currentNetwork.name} (${currentNetwork.chainId})`);
          // Still allow connection even if network switch failed
        } else {
          showNotification('info', t.wallet.networkSwitched || 'Switched to Sepolia testnet');
          // Wait for network change to propagate
          await new Promise(resolve => setTimeout(resolve, 1500));
          // Recreate provider after network switch
          initialProvider = new BrowserProvider(wallet.provider);
        }
      }
      
      // Now get the account and set up provider
      const signer = await initialProvider.getSigner();
      const address = await signer.getAddress();
      
      setAccount(address);
      setProvider(initialProvider);
      
      // Initialize FHEVM after everything is set up
      try {
        await initializeFhevm();
        // Store connection info for future auto-connect
        localStorage.setItem('last-connected-wallet', wallet.name);
        showNotification('success', t.wallet.walletConnected || 'Wallet connected');
      } catch (fhevmError) {
        // FHEVM initialization failure is not critical
        console.warn('FHEVM initialization failed, but wallet is connected:', fhevmError);
        // Store connection info even if FHEVM fails
        localStorage.setItem('last-connected-wallet', wallet.name);
        showNotification('success', t.wallet.walletConnected || 'Wallet connected');
      }
    } catch (error: any) {
      if (error.code === 4001) {
        showNotification('error', t.wallet.userRejected || 'User rejected connection');
      } else {
        console.error('Error connecting wallet:', error);
        showNotification('error', error.message || t.wallet.connectFailed || 'Failed to connect wallet');
      }
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setFhevmReady(false);
    // Clear stored connection info
    localStorage.removeItem('last-connected-wallet');
    showNotification('success', t.wallet.walletDisconnected || 'Wallet disconnected');
  };

  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 text-center md:text-left">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-zama-400 via-zama-500 to-zama-400 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                🗳️ {t.home.title}
              </h1>
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                {t.home.subtitle}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        {/* Full flow animation demo */}
        <div className="mb-6">
          <FlowAnimationDemo />
        </div>

        <WalletConnect
          account={account}
          onConnect={connectWallet}
          onDisconnect={disconnectWallet}
          fhevmReady={fhevmReady}
        />

        {/* Onboarding guide */}
        {showOnboarding && (
          <OnboardingGuide
            onComplete={() => setShowOnboarding(false)}
            onSkip={() => setShowOnboarding(false)}
          />
        )}

        {account && fhevmReady && (
          <div className="mt-6 space-y-4">
            {/* Contract address configuration - simplified display */}
            <ContractAddressSelector
                  value={contractAddress}
              onChange={(addr) => {
                setContractAddress(addr);
                if (addr) {
                  showNotification('success', t.contract.set || 'Contract address set');
                }
              }}
              onSet={() => {
                    if (contractAddress) {
                  showNotification('success', t.contract.set || 'Contract address set');
                    }
                  }}
            />

            {/* Unified view - includes all features */}
            {contractAddress && (
              <div id="main-content">
                {/* Real-time notification system (background) */}
                <div id="feature-realtime-notify" className="scroll-mt-20">
                  <RealTimeNotifications
              provider={provider}
              contractAddress={contractAddress}
                    account={account}
                    enabled={true}
            />
                </div>

                {/* Voting platform */}
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
      
      {/* Wallet Selector Modal */}
      {showWalletSelector && (
        <WalletSelector
          onSelect={handleWalletSelect}
          onClose={() => setShowWalletSelector(false)}
        />
      )}
    </main>
  );
}

