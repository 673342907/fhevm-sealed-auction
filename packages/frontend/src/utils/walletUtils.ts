/**
 * 钱包工具函数
 * 用于检测和过滤钱包扩展
 */

export interface WalletInfo {
  name: string;
  icon: string;
  provider: any;
  isInstalled: boolean;
  downloadUrl?: string;
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
 * 检查是否是 OKX Wallet (OK 钱包)
 */
export function isOKXWallet(ethereum?: any): boolean {
  if (!ethereum) {
    ethereum = typeof window !== 'undefined' ? (window as any).ethereum : undefined;
  }
  if (!ethereum) {
    return false;
  }
  return (
    (ethereum as any).isOKExWallet === true ||
    (ethereum as any).isOkxWallet === true ||
    (ethereum as any).okxwallet !== undefined ||
    (ethereum as any).__OKX_WALLET__ !== undefined
  );
}

/**
 * 检测所有可用的钱包扩展
 * 注意：此函数会访问 window.ethereum，可能会触发钱包选择弹窗
 * 因此应该只在用户主动请求连接钱包时调用
 */
export function detectWallets(): WalletInfo[] {
  const wallets: WalletInfo[] = [];
  const seenNames = new Set<string>(); // 用于去重
  
  if (typeof window === 'undefined') {
    return wallets;
  }

  try {
    // 检测 OKX Wallet (可能通过 window.okxwallet 访问)
    if ((window as any).okxwallet) {
      const okxProvider = (window as any).okxwallet;
      if (!seenNames.has('OKX Wallet')) {
        seenNames.add('OKX Wallet');
        wallets.push({
          name: 'OKX Wallet',
          icon: '🟢',
          provider: okxProvider,
          isInstalled: true,
        });
      }
    }

    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      return wallets;
    }

    // 检测多个钱包提供者（EIP-6963 标准）
    // 注意：访问 ethereum.providers 可能会触发钱包选择弹窗
    // 因此我们使用 try-catch 来安全地访问
    let providers: any[] = [];
    try {
      // 先检查是否有 providers 属性，避免触发弹窗
      if (Array.isArray(ethereum.providers) && ethereum.providers.length > 0) {
        providers = ethereum.providers;
      } else {
        // 单个钱包提供者
        providers = [ethereum];
      }
    } catch (error) {
      // 如果访问 providers 失败，回退到单个提供者
      console.warn('Error accessing ethereum.providers:', error);
      providers = [ethereum];
    }
    
    providers.forEach((provider: any) => {
      try {
        let walletName = '';
        let walletIcon = '';
        
        if (isMetaMask(provider)) {
          walletName = 'MetaMask';
          walletIcon = '🦊';
        } else if (isPhantom(provider)) {
          walletName = 'Phantom';
          walletIcon = '👻';
        } else if (isCoinbaseWallet(provider)) {
          walletName = 'Coinbase Wallet';
          walletIcon = '🔷';
        } else if (isTrust(provider)) {
          walletName = 'Trust Wallet';
          walletIcon = '🔒';
        } else if (isBraveWallet(provider)) {
          walletName = 'Brave Wallet';
          walletIcon = '🦁';
        } else if (isOpera(provider)) {
          walletName = 'Opera Wallet';
          walletIcon = '🎭';
        } else if (isTalisman(provider)) {
          walletName = 'Talisman';
          walletIcon = '🔮';
        } else if (isOKXWallet(provider)) {
          walletName = 'OKX Wallet';
          walletIcon = '🟢';
        } else if (provider && typeof provider.request === 'function') {
          // 未知但兼容 EIP-1193 的钱包
          walletName = 'EIP-1193 Wallet';
          walletIcon = '💼';
        }
        
        // 只添加未重复的钱包
        if (walletName && !seenNames.has(walletName)) {
          seenNames.add(walletName);
          wallets.push({
            name: walletName,
            icon: walletIcon,
            provider,
            isInstalled: true,
          });
        }
      } catch (error) {
        // 跳过检测失败的钱包
        console.warn('Error detecting wallet:', error);
      }
    });
  } catch (error) {
    // 如果整个检测过程失败，返回空数组
    console.warn('Error in detectWallets:', error);
  }

  return wallets;
}

/**
 * 获取所有支持的钱包列表（包括未安装的）
 */
export function getAllSupportedWallets(): WalletInfo[] {
  const allWallets: WalletInfo[] = [
    {
      name: 'MetaMask',
      icon: '🦊',
      provider: null,
      isInstalled: false,
      downloadUrl: 'https://metamask.io/download/',
    },
    {
      name: 'Phantom',
      icon: '👻',
      provider: null,
      isInstalled: false,
      downloadUrl: 'https://phantom.app/',
    },
    {
      name: 'Coinbase Wallet',
      icon: '🔷',
      provider: null,
      isInstalled: false,
      downloadUrl: 'https://www.coinbase.com/wallet',
    },
    {
      name: 'Trust Wallet',
      icon: '🔒',
      provider: null,
      isInstalled: false,
      downloadUrl: 'https://trustwallet.com/',
    },
    {
      name: 'Brave Wallet',
      icon: '🦁',
      provider: null,
      isInstalled: false,
      downloadUrl: 'https://brave.com/wallet/',
    },
    {
      name: 'Opera Wallet',
      icon: '🎭',
      provider: null,
      isInstalled: false,
      downloadUrl: 'https://www.opera.com/crypto/next',
    },
    {
      name: 'Talisman',
      icon: '🔮',
      provider: null,
      isInstalled: false,
      downloadUrl: 'https://talisman.xyz/',
    },
    {
      name: 'OKX Wallet',
      icon: '🟢',
      provider: null,
      isInstalled: false,
      downloadUrl: 'https://www.okx.com/web3',
    },
  ];

  // 标记已安装的钱包
  const installedWallets = detectWallets();
  const installedNames = new Set(installedWallets.map(w => w.name));

  // 更新已安装的钱包信息
  allWallets.forEach(wallet => {
    if (installedNames.has(wallet.name)) {
      const installed = installedWallets.find(w => w.name === wallet.name);
      if (installed) {
        wallet.isInstalled = true;
        wallet.provider = installed.provider;
      }
    }
  });

  // 添加已安装但不在列表中的钱包（如未知钱包）
  installedWallets.forEach(installed => {
    if (!allWallets.find(w => w.name === installed.name)) {
      allWallets.push(installed);
    }
  });

  return allWallets;
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

