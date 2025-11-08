'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { shortenAddress } from '@/lib/utils';
import { formatUnits } from 'ethers';
import type { Block } from 'ethers';

function formatAge(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  
  if (diff < 60) return `${diff} secs ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

function formatGasUsage(gasUsed: bigint, gasLimit: bigint): string {
  const percentage = (Number(gasUsed) / Number(gasLimit) * 100).toFixed(2);
  return `${percentage}%`;
}

export default function BlockRow({ block }: { block: Block }) {
  const [age, setAge] = useState<string>('');
  
  const baseFeePerGas = block.baseFeePerGas 
    ? parseFloat(formatUnits(block.baseFeePerGas, 'gwei')).toFixed(2)
    : '0';

  useEffect(() => {
    if (block.timestamp) {
      setAge(formatAge(block.timestamp));
      
      const interval = setInterval(() => {
        setAge(formatAge(block.timestamp));
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [block.timestamp]);

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <Link 
          href={`/block/${block.number}`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {block.number}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {age || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {block.transactions.length}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Link 
          href={`/address/${block.miner}`}
          className="text-blue-600 hover:text-blue-800 font-mono text-sm"
        >
          {shortenAddress(block.miner)}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="flex items-center space-x-2">
          <span>{block.gasUsed.toLocaleString()}</span>
          <span className="text-xs text-gray-500">
            ({formatGasUsage(block.gasUsed, block.gasLimit)})
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {block.gasLimit.toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {baseFeePerGas} Gwei
      </td>
    </tr>
  );
}
