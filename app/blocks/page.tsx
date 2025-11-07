'use client';

import { useEffect, useState } from 'react';
import { getProvider } from '@/lib/provider';
import BlockCard from '@/components/BlockCard';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import type { Block } from 'ethers';

export default function BlocksPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const provider = getProvider();
        const blockNumber = await provider.getBlockNumber();
        
        const blockPromises = Array.from({ length: 20 }, (_, i) =>
          provider.getBlock(blockNumber - i, true)
        );
        const fetchedBlocks = (await Promise.all(blockPromises)).filter(Boolean) as Block[];
        
        setBlocks(fetchedBlocks);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch blocks');
        setLoading(false);
      }
    };

    fetchBlocks();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Blocks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blocks.map((block) => (
          <BlockCard key={block.number} block={block} />
        ))}
      </div>
    </div>
  );
}
