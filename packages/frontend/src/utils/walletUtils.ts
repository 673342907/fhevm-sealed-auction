/**
 * 钱包工具函数
 * 用于检测和过滤钱包扩展
 */

/**
 * 检查是否是 MetaMask 钱包
 */
export function isMetaMask(): boolean {
  if (typeof window === 'undefined' || !window.ethereum) {
    return false;
  }
  
  // MetaMask 有特定的标识
  return window.ethereum.isMetaMask === true;
}

/**
 * 检查是否是 Talisman 扩展
 */
export function isTalisman(): boolean {
  if (typeof window === 'undefined' || !window.ethereum) {
    return false;
  }
  
  // Talisman 有特定的标识
  return (
    (window.ethereum as any).isTalisman === true ||
    (window.ethereum as any).__TALISMAN_EXTENSION__ !== undefined
  );
}

/**
 * 获取可用的钱包 Provider
 * 优先使用 MetaMask，忽略未配置的扩展
 */
export async function getWalletProvider(): Promise<any> {
  if (typeof window === 'undefined' || !window.ethereum) {
    return null;
  }

  // 优先使用 MetaMask
  if (isMetaMask()) {
    return window.ethereum;
  }

  // 如果是 Talisman 且未配置，返回 null
  if (isTalisman()) {
    try {
      // 尝试检查是否已配置
      await window.ethereum.request({ method: 'eth_accounts' });
      return window.ethereum;
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
  return window.ethereum;
}

/**
 * 安全地访问 window.ethereum
 * 忽略非关键错误（如 Talisman 未配置）
 */
export function safeGetEthereum(): any {
  if (typeof window === 'undefined') {
    return null;
  }

  // 优先返回 MetaMask
  if (isMetaMask()) {
    return window.ethereum;
  }

  // 如果是 Talisman 且可能未配置，返回 null 避免错误
  if (isTalisman()) {
    return null;
  }

  return window.ethereum;
}

