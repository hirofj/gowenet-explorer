import { ethers } from 'ethers';
import { NETWORK_CONFIG } from './constants';

let provider: ethers.JsonRpcProvider | null = null;

export function getProvider(): ethers.JsonRpcProvider {
  if (!provider) {
    provider = new ethers.JsonRpcProvider(NETWORK_CONFIG.rpcUrl);
  }
  return provider;
}

export async function checkConnection(): Promise<boolean> {
  try {
    const provider = getProvider();
    await provider.getBlockNumber();
    return true;
  } catch (error) {
    console.error('Connection error:', error);
    return false;
  }
}
