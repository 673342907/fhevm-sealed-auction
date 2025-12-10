'use client';

import { useState } from 'react';
import { BrowserProvider } from 'ethers';
import { useEventDrivenDecrypt } from '@/hooks/useEventDrivenDecrypt';
import { useNotification } from '@/components/NotificationProvider';

interface EventDrivenDecryptDemoProps {
  provider: BrowserProvider | null;
  contractAddress: string;
  account: string;
}

/**
 * 事件驱动的自中继解密演示组件
 * 
 * 这个组件展示了 FHEVM 的事件驱动解密功能：
 * - 自动监听合约事件
 * - 事件触发时自动批量解密
 * - 实时更新 UI
 */
export default function EventDrivenDecryptDemo({
  provider,
  contractAddress,
  account,
}: EventDrivenDecryptDemoProps) {
  const [decryptedResults, setDecryptedResults] = useState<any[]>([]);

  let showNotification: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
  try {
    const notification = useNotification();
    showNotification = notification.showNotification;
  } catch {
    showNotification = () => {};
  }

  const { isListening, decryptedData, error, startListening, stopListening } =
    useEventDrivenDecrypt({
      provider,
      contractAddress,
      account,
      onDecryptComplete: (data) => {
        setDecryptedResults((prev) => [...prev, ...data]);
        showNotification(
          'success',
          `成功批量解密 ${data.length} 个出价！这是 FHEVM 事件驱动解密功能的演示。`
        );
      },
    });

  return (
    <div id="feature-encrypted-compare" className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            🔄 事件驱动解密
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            FHEVM 高级功能：监听合约事件，自动批量解密数据
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isListening ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'
            }`}
            title={isListening ? '正在监听' : '未监听'}
          ></div>
          <button
            onClick={isListening ? stopListening : startListening}
            className="px-3 py-1.5 text-xs bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          >
            {isListening ? '停止监听' : '开始监听'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {decryptedResults.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            解密结果 ({decryptedResults.length} 条)
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {decryptedResults.map((result, index) => (
              <div
                key={index}
                className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    拍卖 #{result.auctionId} - 出价 #{result.bidIndex}
                  </span>
                  <span className="font-semibold text-violet-600 dark:text-violet-400">
                    {result.amount.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                  {new Date(result.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {decryptedResults.length === 0 && !error && (
        <div className="text-center py-8">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {isListening
              ? '等待拍卖结束事件...'
              : '点击"开始监听"以启用事件驱动解密'}
          </p>
        </div>
      )}
    </div>
  );
}


