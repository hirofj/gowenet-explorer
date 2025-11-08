'use client';

import { useEffect, useState } from 'react';
import { getProvider } from '@/lib/provider';
import { formatUnits } from 'ethers';
import BlockCard from '@/components/BlockCard';
import TransactionCard from '@/components/TransactionCard';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import type { Block, TransactionResponse } from 'ethers';
import { NETWORK_CONFIG } from '@/lib/constants';

const REFRESH_INTERVAL = 5000;

interface Stats {
  blockNumber: number;
  avgBlockTime: number;
  medianGasPrice: string;
  tps: string;
  totalTransactions: number;
  lastSafeBlock: number;
}

export default function Home() {
  const [latestBlocks, setLatestBlocks] = useState<Block[]>([]);
  const [latestTxs, setLatestTxs] = useState<TransactionResponse[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const provider = getProvider();
        const blockNumber = await provider.getBlockNumber();
        
        const blockPromises = Array.from({ length: 10 }, (_, i) =>
          provider.getBlock(blockNumber - i, true)
        );
        const blocks = (await Promise.all(blockPromises)).filter(Boolean) as Block[];
        
        const timestamps = blocks.map(b => b.timestamp);
        const avgBlockTime = timestamps.length > 1
          ? (timestamps[0] - timestamps[timestamps.length - 1]) / (timestamps.length - 1)
          : 0;
        
        let totalTxs = 0;
        let gasPrices: bigint[] = [];
        
        for (const block of blocks) {
          totalTxs += block.transactions.length;
          
          for (const txHash of block.transactions.slice(0, 5)) {
            const tx = await provider.getTransaction(txHash as string);
            if (tx && tx.gasPrice) {
              gasPrices.push(tx.gasPrice);
            }
          }
        }
        
        const medianGasPrice = gasPrices.length > 0
          ? formatUnits(gasPrices.sort((a, b) => Number(a - b))[Math.floor(gasPrices.length / 2)], 'gwei')
          : '0';
        
        const timespan = timestamps[0] - timestamps[timestamps.length - 1];
        const tps = timespan > 0 ? (totalTxs / timespan).toFixed(1) : '0';
        
        setStats({
          blockNumber,
          avgBlockTime,
          medianGasPrice,
          tps,
          totalTransactions: totalTxs,
          lastSafeBlock: blockNumber - 32
        });
        
        setLatestBlocks(blocks.slice(0, 6));
        
        const txs: TransactionResponse[] = [];
        for (const block of blocks) {
          if (txs.length >= 10) break;
          for (const txHash of block.transactions) {
            const tx = await provider.getTransaction(txHash as string);
            if (tx) txs.push(tx);
            if (txs.length >= 10) break;
          }
        }
        setLatestTxs(txs.slice(0, 6));
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">{NETWORK_CONFIG.networkName} Explorer</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">Latest Block</p>
            <p className="text-2xl font-bold">{stats?.blockNumber.toLocaleString()}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">Avg Block Time</p>
            <p className="text-2xl font-bold">{stats?.avgBlockTime.toFixed(1)}s</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">Transactions</p>
            <p className="text-2xl font-bold">{stats?.totalTransactions}</p>
            <p className="text-sm text-gray-500">({stats?.tps} TPS)</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">Med Gas Price</p>
            <p className="text-2xl font-bold">{parseFloat(stats?.medianGasPrice || '0').toFixed(3)}</p>
            <p className="text-sm text-gray-500">Gwei</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Latest Blocks</h2>
          <div className="space-y-3">
            {latestBlocks.map((block) => (
              <BlockCard key={block.number} block={block} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Latest Transactions</h2>
          <div className="space-y-3">
            {latestTxs.length > 0 ? (
              latestTxs.map((tx) => (
                <TransactionCard key={tx.hash} tx={tx} />
              ))
            ) : (
              <p className="text-gray-500">No transactions found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
