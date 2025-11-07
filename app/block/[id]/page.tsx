'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { getProvider } from '@/lib/provider';
import { formatTimestamp, formatGas, shortenHash } from '@/lib/utils';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import type { Block } from 'ethers';

export default function BlockDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [block, setBlock] = useState<Block | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlock = async () => {
      try {
        const provider = getProvider();
        const blockData = await provider.getBlock(parseInt(id), true);
        
        if (!blockData) {
          setError('Block not found');
          setLoading(false);
          return;
        }
        
        setBlock(blockData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch block');
        setLoading(false);
      }
    };

    fetchBlock();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!block) return <ErrorMessage message="Block not found" />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Block #{block.number}</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y">
          <InfoRow label="Block Height" value={block.number?.toString() || ''} />
          <InfoRow label="Timestamp" value={formatTimestamp(block.timestamp || 0)} />
          <InfoRow label="Transactions" value={block.transactions.length.toString()} />
          <InfoRow 
            label="Block Hash" 
            value={block.hash || ''} 
            mono 
          />
          <InfoRow 
            label="Parent Hash" 
            value={
              <Link href={`/block/${(block.number || 1) - 1}`} className="text-blue-600 hover:underline">
                {block.parentHash}
              </Link>
            } 
            mono 
          />
          <InfoRow label="Gas Used" value={formatGas(block.gasUsed || 0n)} />
          <InfoRow label="Gas Limit" value={formatGas(block.gasLimit || 0n)} />
          {block.baseFeePerGas && (
            <InfoRow label="Base Fee" value={`${block.baseFeePerGas.toString()} Wei`} />
          )}
        </div>
      </div>

      {block.transactions.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Transactions</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y">
              {block.transactions.map((txHash, index) => (
                <div key={index} className="p-4 hover:bg-gray-50">
                  <Link 
                    href={`/tx/${txHash}`}
                    className="text-blue-600 hover:underline font-mono text-sm"
                  >
                    {shortenHash(txHash as string)}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ 
  label, 
  value, 
  mono = false 
}: { 
  label: string; 
  value: string | React.ReactNode; 
  mono?: boolean;
}) {
  return (
    <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <dt className="font-medium text-gray-600">{label}</dt>
      <dd className={`md:col-span-2 text-gray-900 ${mono ? 'font-mono text-sm break-all' : ''}`}>
        {value}
      </dd>
    </div>
  );
}
