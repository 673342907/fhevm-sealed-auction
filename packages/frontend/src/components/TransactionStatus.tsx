'use client';

import { TransactionState } from '@/hooks/useTransaction';

interface TransactionStatusProps {
  state: TransactionState;
  onClose?: () => void;
}

export default function TransactionStatus({ state, onClose }: TransactionStatusProps) {
  if (state.status === 'idle') return null;

  const getStatusInfo = () => {
    switch (state.status) {
      case 'pending':
        return {
          icon: '⏳',
          message: '交易处理中...',
          color: 'blue',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          textColor: 'text-blue-800 dark:text-blue-200',
        };
      case 'success':
        return {
          icon: '✅',
          message: '交易成功！',
          color: 'green',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          textColor: 'text-green-800 dark:text-green-200',
        };
      case 'error':
        return {
          icon: '❌',
          message: '交易失败',
          color: 'red',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          textColor: 'text-red-800 dark:text-red-200',
        };
      default:
        return null;
    }
  };

  const statusInfo = getStatusInfo();
  if (!statusInfo) return null;

  return (
    <div
      className={`${statusInfo.bgColor} ${statusInfo.borderColor} border rounded-lg p-4 mb-4`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-xl">{statusInfo.icon}</span>
          <div className="flex-1">
            <p className={`font-semibold ${statusInfo.textColor}`}>
              {statusInfo.message}
            </p>
            {state.hash && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                交易哈希: <span className="font-mono">{state.hash.slice(0, 10)}...</span>
              </p>
            )}
            {state.error && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {state.error}
              </p>
            )}
            {state.hash && state.status === 'success' && (
              <a
                href={`https://sepolia.etherscan.io/tx/${state.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
              >
                在 Etherscan 查看 →
              </a>
            )}
          </div>
        </div>
        {onClose && state.status !== 'pending' && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}






