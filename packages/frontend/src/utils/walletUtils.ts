/**
 * 钱包工具函数
 * 用于检测和过滤钱包扩展
 */

export interface WalletInfo {
  name: string;
  icon: string;
  provider: any;
  isInstalled: boolean;
}

/**
 * 检查是否是 MetaMask 钱包
 */
export function isMetaMask(ethereum?: any): boolean {
  if (!ethereum) {
    ethereum = typeof window !== 'undefined' ? (window as any).ethereum : undefined;
  }
  if (!ethereum) {
    return false;
  }
  return ethereum.isMetaMask === true;
}

/**
 * 检查是否是 Phantom 钱包
 */
export function isPhantom(ethereum?: any): boolean {
  if (!ethereum) {
    ethereum = typeof window !== 'undefined' ? (window as any).ethereum : undefined;
  }
  if (!ethereum) {
    return false;
  }
  return (ethereum as any).isPhantom === true;
}

/**
 * 检查是否是 Coinbase Wallet
 */
export function isCoinbaseWallet(ethereum?: any): boolean {
  if (!ethereum) {
    ethereum = typeof window !== 'undefined' ? (window as any).ethereum : undefined;
  }
  if (!ethereum) {
    return false;
  }
  return (ethereum as any).isCoinbaseWallet === true;
}

/**
 * 检查是否是 Trust Wallet
 */
export function isTrust(ethereum?: any): boolean {
  if (!ethereum) {
    ethereum = typeof window !== 'undefined' ? (window as any).ethereum : undefined;
  }
  if (!ethereum) {
    return false;
  }
  return (ethereum as any).isTrust === true;
}

/**
 * 检查是否是 Brave Wallet
 */
export function isBraveWallet(ethereum?: any): boolean {
  if (!ethereum) {
    ethereum = typeof window !== 'undefined' ? (window as any).ethereum : undefined;
  }
  if (!ethereum) {
    return false;
  }
  return (ethereum as any).isBraveWallet === true;
}

/**
 * 检查是否是 Opera Wallet
 */
export function isOpera(ethereum?: any): boolean {
  if (!ethereum) {
    ethereum = typeof window !== 'undefined' ? (window as any).ethereum : undefined;
  }
  if (!ethereum) {
    return false;
  }
  return (ethereum as any).isOpera === true;
}

/**
 * 检查是否是 Talisman 扩展
 */
export function isTalisman(ethereum?: any): boolean {
  if (!ethereum) {
    ethereum = typeof window !== 'undefined' ? (window as any).ethereum : undefined;
  }
  if (!ethereum) {
    return false;
  }
  return (
    (ethereum as any).isTalisman === true ||
    (ethereum as any).__TALISMAN_EXTENSION__ !== undefined
  );
}

/**
 * 检测所有可用的钱包扩展
 */
export function detectWallets(): WalletInfo[] {
  const wallets: WalletInfo[] = [];
  
  if (typeof window === 'undefined') {
    return wallets;
  }

  const ethereum = (window as any).ethereum;
  if (!ethereum) {
    return wallets;
  }

  // 检测多个钱包提供者（EIP-6963 标准）
  if (Array.isArray(ethereum.providers)) {
    // 多个钱包扩展
    ethereum.providers.forEach((provider: any) => {
      if (isMetaMask(provider)) {
        wallets.push({
          name: 'MetaMask',
          icon: '🦊',
          provider,
          isInstalled: true,
        });
      } else if (isPhantom(provider)) {
        wallets.push({
          name: 'Phantom',
          icon: '👻',
          provider,
          isInstalled: true,
        });
      } else if (isCoinbaseWallet(provider)) {
        wallets.push({
          name: 'Coinbase Wallet',
          icon: '🔷',
          provider,
          isInstalled: true,
        });
      } else if (isTrust(provider)) {
        wallets.push({
          name: 'Trust Wallet',
          icon: '🔒',
          provider,
          isInstalled: true,
        });
      } else if (isBraveWallet(provider)) {
        wallets.push({
          name: 'Brave Wallet',
          icon: '🦁',
          provider,
          isInstalled: true,
        });
      } else if (isOpera(provider)) {
        wallets.push({
          name: 'Opera Wallet',
          icon: '🎭',
          provider,
          isInstalled: true,
        });
      } else if (isTalisman(provider)) {
        wallets.push({
          name: 'Talisman',
          icon: '🔮',
          provider,
          isInstalled: true,
        });
      } else {
        // 未知钱包，但兼容 EIP-1193
        wallets.push({
          name: 'Unknown Wallet',
          icon: '💼',
          provider,
          isInstalled: true,
        });
      }
    });
  } else {
    // 单个钱包扩展
    if (isMetaMask(ethereum)) {
      wallets.push({
        name: 'MetaMask',
        icon: '🦊',
        provider: ethereum,
        isInstalled: true,
      });
    } else if (isPhantom(ethereum)) {
      wallets.push({
        name: 'Phantom',
        icon: '👻',
        provider: ethereum,
        isInstalled: true,
      });
    } else if (isCoinbaseWallet(ethereum)) {
      wallets.push({
        name: 'Coinbase Wallet',
        icon: '🔷',
        provider: ethereum,
        isInstalled: true,
      });
    } else if (isTrust(ethereum)) {
      wallets.push({
        name: 'Trust Wallet',
        icon: '🔒',
        provider: ethereum,
        isInstalled: true,
      });
    } else if (isBraveWallet(ethereum)) {
      wallets.push({
        name: 'Brave Wallet',
        icon: '🦁',
        provider: ethereum,
        isInstalled: true,
      });
    } else if (isOpera(ethereum)) {
      wallets.push({
        name: 'Opera Wallet',
        icon: '🎭',
        provider: ethereum,
        isInstalled: true,
      });
    } else if (isTalisman(ethereum)) {
      wallets.push({
        name: 'Talisman',
        icon: '🔮',
        provider: ethereum,
        isInstalled: true,
      });
    } else {
      // 未知但兼容的钱包
      wallets.push({
        name: 'EIP-1193 Wallet',
        icon: '💼',
        provider: ethereum,
        isInstalled: true,
      });
    }
  }

  return wallets;
}

/**
 * 获取可用的钱包 Provider
 * 优先使用 MetaMask，忽略未配置的扩展
 */
export async function getWalletProvider(): Promise<any> {
  const ethereum = typeof window === 'undefined' ? undefined : (window as any).ethereum;
  if (!ethereum) {
    return null;
  }

  // 优先使用 MetaMask
  if (isMetaMask()) {
    return ethereum;
  }

  // 如果是 Talisman 且未配置，返回 null
  if (isTalisman()) {
    try {
      // 尝试检查是否已配置
      await ethereum.request({ method: 'eth_accounts' });
      return ethereum;
    } catch (error: any) {
      // Talisman 未配置，忽略错误
      if (error.message?.includes('Talisman') || error.message?.includes('onboarding')) {
        console.warn('Talisman 扩展未配置，跳过');
        return null;
      }
      throw error;
    }
  }

  // 其他钱包，尝试使用
  return ethereum;
}

/**
 * 安全地访问 window.ethereum
 * 忽略非关键错误（如 Talisman 未配置）
 */
export function safeGetEthereum(): any {
  if (typeof window === 'undefined') {
    return null;
  }

  const ethereum = (window as any).ethereum;

  // 优先返回 MetaMask
  if (isMetaMask(ethereum)) {
    return ethereum;
  }

  // 如果是 Talisman 且可能未配置，返回 null 避免错误
  if (isTalisman(ethereum)) {
    return null;
  }

  return ethereum;
}

