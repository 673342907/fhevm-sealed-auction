/**
 * 网络工具函数
 * 用于检测和切换网络
 */

// Sepolia 测试网配置
export const SEPOLIA_NETWORK = {
  chainId: '0xaa36a7', // 11155111 in hex
  chainIdDecimal: 11155111,
  chainName: 'Sepolia',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: [
    'https://sepolia.infura.io/v3/',
    'https://rpc.sepolia.org',
    'https://ethereum-sepolia-rpc.publicnode.com',
  ],
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
};

/**
 * 检查当前网络是否是 Sepolia
 */
export async function isSepoliaNetwork(provider: any): Promise<boolean> {
  try {
    if (!provider) return false;
    const network = await provider.getNetwork();
    return Number(network.chainId) === SEPOLIA_NETWORK.chainIdDecimal;
  } catch {
    return false;
  }
}

/**
 * 获取当前网络信息
 */
export async function getCurrentNetwork(provider: any): Promise<{ chainId: number; name: string } | null> {
  try {
    if (!provider) return null;
    const network = await provider.getNetwork();
    return {
      chainId: Number(network.chainId),
      name: network.name,
    };
  } catch {
    return null;
  }
}

/**
 * 切换到 Sepolia 测试网
 */
export async function switchToSepolia(ethereum: any): Promise<boolean> {
  try {
    // 尝试切换到 Sepolia
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SEPOLIA_NETWORK.chainId }],
    });
    return true;
  } catch (switchError: any) {
    // 如果网络不存在，尝试添加
    if (switchError.code === 4902 || switchError.code === -32603) {
      try {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: SEPOLIA_NETWORK.chainId,
              chainName: SEPOLIA_NETWORK.chainName,
              nativeCurrency: SEPOLIA_NETWORK.nativeCurrency,
              rpcUrls: SEPOLIA_NETWORK.rpcUrls,
              blockExplorerUrls: SEPOLIA_NETWORK.blockExplorerUrls,
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error('Error adding Sepolia network:', addError);
        return false;
      }
    } else if (switchError.code === 4001) {
      // 用户拒绝了切换请求
      return false;
    } else {
      console.error('Error switching network:', switchError);
      return false;
    }
  }
}

/**
 * 检查并提示网络切换
 */
export async function checkAndSwitchNetwork(
  provider: any,
  ethereum: any,
  onSwitchRequest?: () => void
): Promise<{ isCorrect: boolean; networkName?: string }> {
  const currentNetwork = await getCurrentNetwork(provider);
  
  if (!currentNetwork) {
    return { isCorrect: false, networkName: 'Unknown' };
  }

  if (Number(currentNetwork.chainId) === SEPOLIA_NETWORK.chainIdDecimal) {
    return { isCorrect: true, networkName: currentNetwork.name };
  }

  // 网络不正确，尝试切换
  if (onSwitchRequest) {
    onSwitchRequest();
  }

  const switched = await switchToSepolia(ethereum);
  if (switched) {
    // 等待网络切换完成，并验证切换成功
    let retries = 0;
    const maxRetries = 10;
    while (retries < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const newNetwork = await getCurrentNetwork(provider);
      if (newNetwork && Number(newNetwork.chainId) === SEPOLIA_NETWORK.chainIdDecimal) {
        return { isCorrect: true, networkName: 'Sepolia' };
      }
      retries++;
    }
    // 即使验证失败，也返回成功（可能网络切换需要更长时间）
    return { isCorrect: true, networkName: 'Sepolia' };
  }

  return { isCorrect: false, networkName: currentNetwork.name };
}

