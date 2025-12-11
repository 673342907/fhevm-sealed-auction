'use client';

import { useState, useEffect } from 'react';
import { detectWallets, WalletInfo } from '@/utils/walletUtils';
import { useLanguage } from '@/contexts/LanguageContext';

interface WalletSelectorProps {
  onSelect: (wallet: WalletInfo) => void;
  onClose: () => void;
}

export default function WalletSelector({ onSelect, onClose }: WalletSelectorProps) {
  const { t } = useLanguage();
  const [wallets, setWallets] = useState<WalletInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detectedWallets = detectWallets();
    setWallets(detectedWallets);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl p-6 max-w-md w-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zama-500 mx-auto mb-4"></div>
            <p className="text-zinc-600 dark:text-zinc-400">
              {t.wallet.detecting || 'Detecting wallets...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (wallets.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl p-6 max-w-md w-full">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              {t.wallet.noWalletTitle || 'No Wallet Found'}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              {t.wallet.noWalletDesc || 'Please install a Web3 wallet extension to continue.'}
            </p>
          </div>
          <div className="space-y-2">
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-4 py-3 bg-zama-500 text-black rounded-lg font-bold hover:bg-zama-400 text-center"
            >
              🦊 Install MetaMask
            </a>
            <a
              href="https://phantom.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-4 py-3 bg-zinc-700 text-white rounded-lg font-bold hover:bg-zinc-600 text-center"
            >
              👻 Install Phantom
            </a>
          </div>
          <button
            onClick={onClose}
            className="mt-4 w-full px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            {t.common.cancel || 'Cancel'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {t.wallet.selectWallet || 'Select Wallet'}
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          {t.wallet.selectWalletDesc || 'Choose a wallet to connect:'}
        </p>
        <div className="space-y-2">
          {wallets.map((wallet, index) => (
            <button
              key={index}
              onClick={() => {
                onSelect(wallet);
                onClose();
              }}
              className="w-full px-4 py-4 bg-gradient-to-r from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 rounded-lg hover:from-zama-400 hover:to-zama-500 hover:text-black dark:hover:from-zama-500 dark:hover:to-zama-600 dark:hover:text-black transition-all duration-200 flex items-center gap-3 group"
            >
              <span className="text-3xl">{wallet.icon}</span>
              <div className="flex-1 text-left">
                <div className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-black">
                  {wallet.name}
                </div>
                {wallet.isInstalled && (
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-black/70 dark:group-hover:text-black/70">
                    {t.wallet.installed || 'Installed'}
                  </div>
                )}
              </div>
              <span className="text-zinc-400 group-hover:text-black dark:group-hover:text-black">
                →
              </span>
            </button>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
            {t.wallet.needInstall || "Don't have a wallet? Install one from the links above."}
          </p>
        </div>
      </div>
    </div>
  );
}

