import { NextResponse } from 'next/server';
import { getProvider } from '@/lib/provider';
import { NETWORK_CONFIG } from '@/lib/constants';

export interface NetworkStats {
  peers: number;
  validators: number;
  isBootstrapped: boolean;
  gasUsedPercent: number;
  avgBlockTime: number;
  totalTransactions: number;
  chainId: string;
  blockchainId: string;
  subnetId: string;
  currencySymbol: string;
  networkName: string;
}

async function getPeersCount(): Promise<number> {
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
    return data.result?.numPeers ? parseInt(data.result.numPeers, 10) : 0;
  } catch (error) {
    console.error('Error fetching peers count:', error);
    return 0;
  }
}

async function getValidatorCount(): Promise<number> {
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
    return data.result?.validators?.length || 0;
  } catch (error) {
    console.error('Error fetching validator count:', error);
    return 0;
  }
}

async function isNodeBootstrapped(): Promise<boolean> {
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
    return data.result?.isBootstrapped || false;
  } catch (error) {
    console.error('Error checking bootstrap status:', error);
    return false;
  }
}

async function getGasUsagePercent(): Promise<number> {
  try {
    const provider = getProvider();
    const blockNumber = await provider.getBlockNumber();
    const block = await provider.getBlock(blockNumber);
    
    if (!block) return 0;
    
    const gasUsed = BigInt(block.gasUsed);
    const gasLimit = BigInt(block.gasLimit);
    
    if (gasLimit === 0n) return 0;
    
    return Number((gasUsed * 100n) / gasLimit);
  } catch (error) {
    console.error('Error fetching gas usage:', error);
    return 0;
  }
}

async function getAverageBlockTime(): Promise<number> {
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
    return timeDiff / 10;
  } catch (error) {
    console.error('Error calculating average block time:', error);
    return 0;
  }
}

async function getTotalTransactions(): Promise<number> {
  try {
    const provider = getProvider();
    const blockNumber = await provider.getBlockNumber();
    
    // Get transaction count from last 100 blocks
    const sampleSize = Math.min(100, blockNumber + 1);
    let totalTxs = 0;
    
    for (let i = 0; i < sampleSize; i++) {
      const block = await provider.getBlock(blockNumber - i);
      if (block) {
        totalTxs += block.transactions.length;
      }
    }
    
    return totalTxs;
  } catch (error) {
    console.error('Error calculating total transactions:', error);
    return 0;
  }
}

export async function GET() {
  try {
    const [peers, validators, isBootstrapped, gasUsedPercent, avgBlockTime, totalTransactions] = await Promise.all([
      getPeersCount(),
      getValidatorCount(),
      isNodeBootstrapped(),
      getGasUsagePercent(),
      getAverageBlockTime(),
      getTotalTransactions(),
    ]);

    const stats: NetworkStats = {
      peers,
      validators,
      isBootstrapped,
      gasUsedPercent,
      avgBlockTime,
      totalTransactions,
      chainId: NETWORK_CONFIG.chainId,
      blockchainId: NETWORK_CONFIG.blockchainId,
      subnetId: NETWORK_CONFIG.subnetId,
      currencySymbol: NETWORK_CONFIG.currencySymbol,
      networkName: NETWORK_CONFIG.networkName,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching network stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch network statistics' },
      { status: 500 }
    );
  }
}
