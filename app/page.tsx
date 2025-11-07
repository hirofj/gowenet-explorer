'use client';

import { useEffect, useState } from 'react';
import { getProvider } from '@/lib/provider';
import { REFRESH_INTERVAL, NETWORK_CONFIG } from '@/lib/constants';
import BlockCard from '@/components/BlockCard';
import TransactionCard from '@/components/TransactionCard';
import Loading, { SkeletonCard } from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import type { Block, TransactionResponse } from 'ethers';

export default function Home() {
  const [latestBlocks, setLatestBlocks] = useState<Block[]>([]);
  const [latestTxs, setLatestTxs] = useState<TransactionResponse[]>([]);
  const [stats, setStats] = useState({ blockNumber: 0, avgBlockTime: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const provider = getProvider();
        const blockNumber = await provider.getBlockNumber();
        
        // Fetch latest 10 blocks
        const blockPromises = Array.from({ length: 10 }, (_, i) =>
          provider.getBlock(blockNumber - i, true)
        );
        const blocks = (await Promise.all(blockPromises)).filter(Boolean) as Block[];
        
        // Calculate average block time
        if (blocks.length > 1) {
          const timeDiffs = blocks.slice(0, -1).map((b, i) => 
            (b.timestamp || 0) - (blocks[i + 1].timestamp || 0)
          );
          const avgTime = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
          setStats({ blockNumber, avgBlockTime: avgTime });
        } else {
          setStats({ blockNumber, avgBlockTime: 0 });
        }
        
        setLatestBlocks(blocks);
        
        // Fetch latest transactions
        const allTxs: TransactionResponse[] = [];
        for (const block of blocks) {
          if (allTxs.length >= 10) break;
          const txHashes = block.transactions.slice(0, 10 - allTxs.length);
          for (const hash of txHashes) {
            const tx = await provider.getTransaction(hash as string);
            if (tx) allTxs.push(tx);
            if (allTxs.length >= 10) break;
          }
        }
        setLatestTxs(allTxs);
        
        setLoading(false);
        setError('');
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

  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-8">
      {/* Network Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-medium">Latest Block</h3>
          <p className="text-3xl font-bold text-blue-900">
            {loading ? '...' : stats.blockNumber.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-medium">Avg Block Time</h3>
          <p className="text-3xl font-bold text-blue-900">
            {loading ? '...' : `${stats.avgBlockTime.toFixed(1)}s`}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-medium">Network</h3>
          <p className="text-2xl font-bold text-blue-900">{NETWORK_CONFIG.networkName}</p>
        </div>
      </div>

      {/* Latest Blocks */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Latest Blocks</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestBlocks.slice(0, 6).map((block) => (
              <BlockCard key={block.number} block={block} />
            ))}
          </div>
        )}
      </div>

      {/* Latest Transactions */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Latest Transactions</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : latestTxs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestTxs.slice(0, 6).map((tx) => (
              <TransactionCard key={tx.hash} tx={tx} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No transactions found</p>
        )}
      </div>
    </div>
  );
}
