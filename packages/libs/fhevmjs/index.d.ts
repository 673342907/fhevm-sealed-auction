export interface FhevmInstance {
  encrypt32(value: number): string;
  decrypt(contractAddress: string, encrypted: string, signature: string): number;
  getTokenSignature(contractAddress: string): {
    publicKey: string;
    domain: any;
    types: any;
  };
}

export function createFhevmInstance(config: {
  chainId: number;
  provider: any;
}): Promise<FhevmInstance>;

