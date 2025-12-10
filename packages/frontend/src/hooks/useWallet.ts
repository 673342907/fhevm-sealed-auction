'use client';

import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider } from 'ethers';

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = useCallback(async () => {
    const ethereum = typeof window === 'undefined' ? undefined : (window as any).ethereum;
    if (!ethereum) {
      return;
    }

    try {
      const provider = new BrowserProvider(ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0].address);
        setProvider(provider);
        setError(null);
      }
    } catch (err: any) {
      console.error('Error checking wallet:', err);
      setError(err.message || '检查钱包连接失败');
    }
  }, []);

  const connect = useCallback(async () => {
    const ethereum = typeof window === 'undefined' ? undefined : (window as any).ethereum;
    if (!ethereum) {
      setError('请安装 MetaMask 钱包');
      return false;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const provider = new BrowserProvider(ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      setAccount(address);
      setProvider(provider);
      setError(null);
      return true;
    } catch (err: any) {
      const errorMessage = err.code === 4001 
        ? '用户拒绝了连接请求'
        : err.message || '连接钱包失败';
      setError(errorMessage);
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  useEffect(() => {
    checkConnection();

    // 监听账户变化
    const ethereum = (window as any)?.ethereum;
    if (ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setAccount(null);
          setProvider(null);
        } else {
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = () => {
        // 链变化时重新连接
        window.location.reload();
      };

      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);

      return () => {
        ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        ethereum?.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [checkConnection]);

  return {
    account,
    provider,
    isConnecting,
    error,
    connect,
    checkConnection,
  };
}




