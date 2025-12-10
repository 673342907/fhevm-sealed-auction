'use client';

import { useLanguage } from '@/contexts/LanguageContext';

interface WalletConnectProps {
  account: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  fhevmReady: boolean;
}

export default function WalletConnect({ account, onConnect, onDisconnect, fhevmReady }: WalletConnectProps) {
  const { t } = useLanguage();
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
            {t.wallet.title}
          </h2>
          {account ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">{t.wallet.address}:</span>
                <span className="font-mono text-sm bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 rounded-lg text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                  {account}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">{t.wallet.fhevmStatus}:</span>
                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  fhevmReady 
                    ? 'bg-zama-500/20 dark:bg-zama-500/30 text-zama-700 dark:text-zama-300 border border-zama-500/40 dark:border-zama-500/50' 
                    : 'bg-zinc-700/30 dark:bg-zinc-700/50 text-zinc-400 dark:text-zinc-500 border border-zinc-600 dark:border-zinc-600'
                }`}>
                  {fhevmReady ? t.wallet.ready : t.wallet.initializing}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {t.wallet.connectDesc}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {account ? (
            <button
              onClick={onDisconnect}
              className="px-5 py-2.5 bg-zinc-700 text-white rounded-lg font-bold hover:bg-zinc-600 transition-all shadow-lg flex items-center gap-2"
            >
              <span>🔌</span>
              <span>{t.common.disconnect}</span>
            </button>
          ) : (
            <button
              onClick={onConnect}
              className="px-5 py-2.5 bg-zama-500 text-black rounded-lg font-bold hover:bg-zama-400 transition-all shadow-lg shadow-zama-500/50"
            >
              {t.wallet.title}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

