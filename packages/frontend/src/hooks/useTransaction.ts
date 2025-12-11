'use client';

import { useState, useCallback } from 'react';

export interface TransactionState {
  hash: string | null;
  status: 'idle' | 'pending' | 'success' | 'error';
  error: string | null;
}

export function useTransaction() {
  const [state, setState] = useState<TransactionState>({
    hash: null,
    status: 'idle',
    error: null,
  });

  const execute = useCallback(async (
    transactionPromise: Promise<{ hash: string; wait: () => Promise<any> }>
  ) => {
    setState({ hash: null, status: 'pending', error: null });

    try {
      const tx = await transactionPromise;
      setState({ hash: tx.hash, status: 'pending', error: null });

      await tx.wait();
      setState({ hash: tx.hash, status: 'success', error: null });
      return { success: true, hash: tx.hash };
    } catch (error: any) {
      const errorMessage = error.reason || error.message || '交易失败';
      setState({ 
        hash: state.hash, 
        status: 'error', 
        error: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  }, [state.hash]);

  const reset = useCallback(() => {
    setState({ hash: null, status: 'idle', error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
    isPending: state.status === 'pending',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
  };
}






