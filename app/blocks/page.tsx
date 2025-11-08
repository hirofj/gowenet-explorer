'use client';

import { useEffect, useState } from 'react';
import { getProvider } from '@/lib/provider';
import BlockRow from '@/components/BlockRow';
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
        
        const blockPromises = Array.from({ length: 50 }, (_, i) =>
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
      {blocks.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Block
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Txn
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fee Recipient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gas Used
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gas Limit
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Base Fee
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blocks.map((block) => (
                  <BlockRow key={block.number} block={block} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No blocks found</p>
      )}
    </div>
  );
}
