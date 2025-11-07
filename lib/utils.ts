import { ethers } from 'ethers';
import { NETWORK_CONFIG } from './constants';

export function shortenAddress(address: string, chars = 4): string {
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
}

export function shortenHash(hash: string, chars = 6): string {
  return `${hash.substring(0, chars + 2)}...${hash.substring(66 - chars)}`;
}

export function formatGOWE(wei: bigint | string): string {
  try {
    return ethers.formatEther(wei);
  } catch {
    return '0';
  }
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString();
}

export function timeAgo(timestamp: number): string {
  const seconds = Math.floor(Date.now() / 1000 - timestamp);
  
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function formatGas(gas: bigint | number): string {
  return gas.toLocaleString();
}

export function isValidAddress(address: string): boolean {
  return ethers.isAddress(address);
}

export function isValidHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

export function isValidBlockNumber(num: string): boolean {
  return /^\d+$/.test(num);
}
