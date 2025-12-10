import { FhevmInstance, createFhevmInstance } from "@fhenixprotocol/fhevmjs";
import { BrowserProvider } from "ethers";
import { safeGetEthereum } from "./walletUtils";

let instance: FhevmInstance | null = null;

// 签名缓存：避免重复签名
const signatureCache: Map<string, string> = new Map();

/**
 * 初始化 FHEVM 实例
 */
export async function initFhevm(): Promise<FhevmInstance> {
  if (instance) {
    return instance;
  }

  const ethereum = safeGetEthereum();
  if (!ethereum) {
    throw new Error("MetaMask not found");
  }

  const provider = new BrowserProvider(ethereum);
  const network = await provider.getNetwork();
  const chainId = Number(network.chainId);

  instance = await createFhevmInstance({ chainId, provider });
  return instance;
}

/**
 * 获取 FHEVM 实例
 */
export function getFhevmInstance(): FhevmInstance {
  if (!instance) {
    throw new Error("FHEVM not initialized. Call initFhevm() first.");
  }
  return instance;
}

/**
 * 加密数值
 */
export async function encryptValue(
  contractAddress: string,
  publicKey: string,
  value: number
): Promise<string> {
  const fhevm = await initFhevm();
  const encrypted = fhevm.encrypt32(value);
  return encrypted;
}

/**
 * 解密数值（使用 EIP-712 签名）
 */
export async function decryptValue(
  contractAddress: string,
  encrypted: string
): Promise<number> {
  const fhevm = await initFhevm();
  
  const ethereum = safeGetEthereum();
  if (!ethereum) {
    throw new Error("MetaMask not found");
  }

  const provider = new BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  // 检查签名缓存
  const cacheKey = `${contractAddress}`;
  let signature = signatureCache.get(cacheKey);
  
  if (!signature) {
    // 获取解密权限
    const token = fhevm.getTokenSignature(contractAddress);
    if (!token.publicKey) {
      throw new Error("Public key not found");
    }

    // 检查并修复 types 格式
    let types = token.types;
    if (!types || Object.keys(types).length === 0) {
      // 如果 types 为空，手动构建 EIP-712 types
      types = {
        Reencrypt: [
          { name: 'publicKey', type: 'bytes32' }
        ]
      };
    } else if (!types.Reencrypt) {
      // 如果 types 存在但没有 Reencrypt，尝试使用第一个键
      const firstKey = Object.keys(types)[0];
      if (firstKey) {
        types = { [firstKey]: types[firstKey] };
      } else {
        types = {
          Reencrypt: [
            { name: 'publicKey', type: 'bytes32' }
          ]
        };
      }
    }

    // 使用 EIP-712 签名解密
    try {
      signature = await signer.signTypedData(
        token.domain,
        types,
        { publicKey: token.publicKey }
      );
      // 缓存签名
      signatureCache.set(cacheKey, signature);
    } catch (error: any) {
      console.error('❌ signTypedData 错误:', error);
      throw new Error(`签名失败: ${error.message || '未知错误'}`);
    }
  }

  const decrypted = fhevm.decrypt(contractAddress, encrypted, signature);
  return Number(decrypted);
}

/**
 * 批量解密多个加密值（使用 decryptMultiple）
 * 这是 FHEVM SDK 的高级功能，可以一次性解密多个值
 * 优化版本：使用单次签名批量解密，提高效率
 * 
 * @param contractAddress 合约地址
 * @param encryptedValues 加密值数组
 * @returns 解密后的数值数组
 * 
 * 技术说明：
 * - 使用 EIP-712 签名一次，然后批量解密
 * - 这比逐个解密更高效，减少签名次数
 * - 支持错误处理，单个解密失败不影响其他
 */
export async function decryptMultiple(
  contractAddress: string,
  encryptedValues: string[]
): Promise<number[]> {
  const fhevm = await initFhevm();
  
  const ethereum = safeGetEthereum();
  if (!ethereum) {
    throw new Error("MetaMask not found");
  }

  const provider = new BrowserProvider(ethereum);
  const signer = await provider.getSigner();

  // 检查签名缓存
  const cacheKey = `${contractAddress}`;
  let signature = signatureCache.get(cacheKey);
  
  if (!signature) {
    // 获取解密权限（只需一次）
    const token = fhevm.getTokenSignature(contractAddress);
    if (!token.publicKey) {
      throw new Error("Public key not found");
    }

    // 检查并修复 types 格式
    // FHEVM SDK 可能返回空对象，需要手动构建正确的格式
    let types = token.types;
    if (!types || Object.keys(types).length === 0) {
      // 如果 types 为空，手动构建 EIP-712 types
      types = {
        Reencrypt: [
          { name: 'publicKey', type: 'bytes32' }
        ]
      };
    } else if (!types.Reencrypt) {
      // 如果 types 存在但没有 Reencrypt，尝试使用第一个键
      const firstKey = Object.keys(types)[0];
      if (firstKey) {
        types = { [firstKey]: types[firstKey] };
      } else {
        // 如果还是空，使用默认格式
        types = {
          Reencrypt: [
            { name: 'publicKey', type: 'bytes32' }
          ]
        };
      }
    }

    // 使用 EIP-712 签名解密（只需一次签名）
    try {
      signature = await signer.signTypedData(
        token.domain,
        types,
        { publicKey: token.publicKey }
      );
      // 缓存签名
      signatureCache.set(cacheKey, signature);
    } catch (error: any) {
      console.error('❌ signTypedData 错误:', error);
      console.error('Token domain:', token.domain);
      console.error('Token types (原始):', token.types);
      console.error('Token types (修复后):', types);
      throw new Error(`签名失败: ${error.message || '未知错误'}`);
    }
  }

  // 批量解密（使用同一个签名）
  const decryptedValues: number[] = [];
  const errors: string[] = [];

  for (let i = 0; i < encryptedValues.length; i++) {
    try {
      const encrypted = encryptedValues[i];
      if (!encrypted || encrypted.length === 0) {
        decryptedValues.push(0);
        continue;
      }
      
      const decrypted = fhevm.decrypt(contractAddress, encrypted, signature);
      decryptedValues.push(Number(decrypted));
    } catch (error: any) {
      console.error(`Decryption error for index ${i}:`, error);
      errors.push(`Index ${i}: ${error.message || 'Unknown error'}`);
      decryptedValues.push(0); // 失败时返回 0
    }
  }

  if (errors.length > 0) {
    console.warn("Some decryptions failed:", errors);
  }

  return decryptedValues;
}

/**
 * 在加密状态下比较两个出价（链下实现，用于演示）
 * 注意：理想的实现应该在链上进行加密比较
 * 
 * @param contractAddress 合约地址
 * @param encryptedBid1 第一个加密出价
 * @param encryptedBid2 第二个加密出价
 * @returns 比较结果：1 表示 bid1 > bid2, -1 表示 bid1 < bid2, 0 表示相等
 * 
 * 技术说明：
 * - 当前实现需要解密后比较（链下）
 * - 理想的实现应该在链上使用 FHEVM 预编译合约进行加密比较
 * - 这个函数主要用于演示和测试
 */
export async function compareEncryptedBids(
  contractAddress: string,
  encryptedBid1: string,
  encryptedBid2: string
): Promise<number> {
  try {
    // 批量解密两个出价
    const [bid1, bid2] = await decryptMultiple(contractAddress, [encryptedBid1, encryptedBid2]);
    
    // 比较解密后的值
    if (bid1 > bid2) return 1;
    if (bid1 < bid2) return -1;
    return 0;
  } catch (error) {
    console.error("Error comparing encrypted bids:", error);
    throw new Error("Failed to compare encrypted bids");
  }
}

/**
 * 公共解密（Public Decrypt）
 * 允许授权方解密数据，不需要用户签名
 */
export async function publicDecrypt(
  contractAddress: string,
  encrypted: string
): Promise<number> {
  const fhevm = await initFhevm();
  
  // 公共解密不需要签名，但需要合约支持
  // 注意：这需要合约中有相应的公共解密函数
  try {
    const decrypted = fhevm.decrypt(contractAddress, encrypted);
    return Number(decrypted);
  } catch (error) {
    console.error("Public decrypt error:", error);
    throw error;
  }
}

