import type { Block, TransactionResponse, TransactionReceipt } from 'ethers';

export interface NetworkStats {
  latestBlock: number;
  avgBlockTime: number;
  totalTransactions: number;
}

export interface BlockInfo extends Block {
  transactions: string[];
}

export interface TransactionInfo extends TransactionResponse {
  receipt?: TransactionReceipt | null;
}

export interface AddressInfo {
  address: string;
  balance: string;
  isContract: boolean;
  txCount: number;
}
