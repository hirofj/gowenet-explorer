import { getProvider } from './provider';
import { NETWORK_CONFIG } from './constants';
import { ethers } from 'ethers';

export interface NetworkStats {
  peers: number;
  validators: number;
  isBootstrapped: boolean;
  gasUsedPercent: number;
  avgBlockTime: number;
}

/**
 * Get the number of connected peers
 */
export async function getPeersCount(): Promise<number> {
  try {
    const baseUrl = NETWORK_CONFIG.rpcUrl.split('/ext/bc/')[0];
    const response = await fetch(`${baseUrl}/ext/info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'info.peers',
        params: {},
        id: 1,
      }),
    });
    const data = await response.json();
    console.log('Peers response:', data);
    return data.result?.numPeers ? parseInt(data.result.numPeers, 10) : 0;
  } catch (error) {
    console.error('Error fetching peers count:', error);
    return 0;
  }
}

/**
 * Get the number of current validators
 */
export async function getValidatorCount(): Promise<number> {
  try {
    const baseUrl = NETWORK_CONFIG.rpcUrl.split('/ext/bc/')[0];
    const response = await fetch(`${baseUrl}/ext/bc/P`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'platform.getCurrentValidators',
        params: {
          subnetID: NETWORK_CONFIG.subnetId,
        },
        id: 1,
      }),
    });
    const data = await response.json();
    console.log('Validators response:', data);
    return data.result?.validators?.length || 0;
  } catch (error) {
    console.error('Error fetching validator count:', error);
    return 0;
  }
}

/**
 * Check if the node is bootstrapped
 */
export async function isNodeBootstrapped(): Promise<boolean> {
  try {
    const baseUrl = NETWORK_CONFIG.rpcUrl.split('/ext/bc/')[0];
    const response = await fetch(`${baseUrl}/ext/info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'info.isBootstrapped',
        params: {
          chain: NETWORK_CONFIG.blockchainId,
        },
        id: 1,
      }),
    });
    const data = await response.json();
    console.log('Bootstrap response:', data);
    return data.result?.isBootstrapped || false;
  } catch (error) {
    console.error('Error checking bootstrap status:', error);
    return false;
  }
}

/**
 * Get gas usage percentage (gas used / gas limit from latest block)
 */
export async function getGasUsagePercent(): Promise<number> {
  try {
    const provider = getProvider();
    const blockNumber = await provider.getBlockNumber();
    const block = await provider.getBlock(blockNumber);
    
    if (!block) return 0;
    
    const gasUsed = BigInt(block.gasUsed);
    const gasLimit = BigInt(block.gasLimit);
    
    if (gasLimit === 0n) return 0;
    
    const percent = Number((gasUsed * 100n) / gasLimit);
    console.log(`Gas usage: ${gasUsed} / ${gasLimit} = ${percent}%`);
    return percent;
  } catch (error) {
    console.error('Error fetching gas usage:', error);
    return 0;
  }
}

/**
 * Calculate average block time (last 10 blocks)
 */
export async function getAverageBlockTime(): Promise<number> {
  try {
    const provider = getProvider();
    const blockNumber = await provider.getBlockNumber();
    
    if (blockNumber < 10) {
      return 0;
    }
    
    const currentBlock = await provider.getBlock(blockNumber);
    const previousBlock = await provider.getBlock(blockNumber - 10);
    
    if (!currentBlock || !previousBlock) return 0;
    
    const timeDiff = currentBlock.timestamp - previousBlock.timestamp;
    const avgTime = timeDiff / 10;
    console.log(`Average block time: (${currentBlock.timestamp} - ${previousBlock.timestamp}) / 10 = ${avgTime}s`);
    return avgTime;
  } catch (error) {
    console.error('Error calculating average block time:', error);
    return 0;
  }
}

/**
 * Get comprehensive network statistics
 */
export async function getNetworkStats(): Promise<NetworkStats> {
  const [peers, validators, isBootstrapped, gasUsedPercent, avgBlockTime] = await Promise.all([
    getPeersCount(),
    getValidatorCount(),
    isNodeBootstrapped(),
    getGasUsagePercent(),
    getAverageBlockTime(),
  ]);

  return {
    peers,
    validators,
    isBootstrapped,
    gasUsedPercent,
    avgBlockTime,
  };
}
