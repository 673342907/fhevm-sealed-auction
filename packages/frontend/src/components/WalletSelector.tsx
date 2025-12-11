'use client';

import { useState, useEffect } from 'react';
import { getAllSupportedWallets, WalletInfo } from '@/utils/walletUtils';
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
    const allWallets = getAllSupportedWallets();
    setWallets(allWallets);
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-white via-zinc-50 to-white dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-700/50 p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-zama-400 to-zama-600 bg-clip-text text-transparent">
              {t.wallet.selectWallet || 'Select Wallet'}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {t.wallet.selectWalletDesc || 'Choose a wallet to connect:'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-all duration-200 hover:rotate-90"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* 已安装的钱包 */}
        {wallets.filter(w => w.isInstalled).length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-600 to-transparent"></div>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider px-2">
                {t.wallet.installedWallets || 'Installed Wallets'}
              </p>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-600 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {wallets
                .filter(wallet => wallet.isInstalled)
                .map((wallet, index) => (
                  <button
                    key={`installed-${index}`}
                    onClick={() => {
                      onSelect(wallet);
                      onClose();
                    }}
                    className="relative w-full px-5 py-4 bg-gradient-to-r from-zinc-50 via-white to-zinc-50 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800 rounded-xl hover:from-zama-400 hover:via-zama-500 hover:to-zama-400 hover:shadow-lg hover:shadow-zama-500/30 dark:hover:from-zama-500 dark:hover:via-zama-600 dark:hover:to-zama-500 hover:scale-[1.02] transition-all duration-300 flex items-center gap-4 group border border-zinc-200/50 dark:border-zinc-700/50 hover:border-zama-400/50"
                  >
                    <div className="relative">
                      <span className="text-4xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{wallet.icon}</span>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-zinc-800 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-black transition-colors">
                        {wallet.name}
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400 font-medium mt-0.5">
                        {t.wallet.installed || 'Installed'} • Ready to connect
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-700 group-hover:bg-zama-500 group-hover:text-black flex items-center justify-center transition-all duration-300">
                      <svg className="w-5 h-5 text-zinc-400 group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* 未安装的钱包 */}
        {wallets.filter(w => !w.isInstalled).length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-600 to-transparent"></div>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider px-2">
                {t.wallet.availableWallets || 'Available Wallets'}
              </p>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-600 to-transparent"></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {wallets
                .filter(wallet => !wallet.isInstalled)
                .map((wallet, index) => (
                  <a
                    key={`available-${index}`}
                    href={wallet.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative px-4 py-4 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800/50 dark:to-zinc-900/50 rounded-xl hover:from-zinc-100 hover:to-zinc-200 dark:hover:from-zinc-700 dark:hover:to-zinc-800 transition-all duration-300 flex flex-col items-center justify-center gap-2 group border border-zinc-200/50 dark:border-zinc-700/50 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-md"
                  >
                    <span className="text-3xl opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">{wallet.icon}</span>
                    <div className="text-center">
                      <div className="font-semibold text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
                        {wallet.name}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Install
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </a>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

