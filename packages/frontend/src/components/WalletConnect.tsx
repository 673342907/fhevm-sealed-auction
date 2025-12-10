'use client';

import { useLanguage } from '@/contexts/LanguageContext';

interface WalletConnectProps {
  account: string | null;
  onConnect: () => void;
  fhevmReady: boolean;
}

export default function WalletConnect({ account, onConnect, fhevmReady }: WalletConnectProps) {
  const { t } = useLanguage();
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
      <div className="flex items-center justify-between">
        <div>
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
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                    : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
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
        {!account && (
          <button
            onClick={onConnect}
            className="px-5 py-2.5 bg-zama-500 text-black rounded-lg font-bold hover:bg-zama-400 transition-all shadow-lg shadow-zama-500/50"
          >
            {t.wallet.title}
          </button>
        )}
      </div>
    </div>
  );
}

