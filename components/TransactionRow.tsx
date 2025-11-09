'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { shortenHash, shortenAddress, formatGOWE } from '@/lib/utils';
import { formatUnits } from 'ethers';
import type { TransactionResponse, TransactionReceipt } from 'ethers';

interface TransactionWithBlock extends TransactionResponse {
  blockTimestamp?: number;
  receipt?: TransactionReceipt;
}

function formatAge(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  
  if (diff < 60) return `${diff} secs ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

export default function TransactionRow({ tx }: { tx: TransactionWithBlock }) {
  const [age, setAge] = useState<string>('');
  const [gasFee, setGasFee] = useState<string>('Loading...');

  useEffect(() => {
    if (tx.blockTimestamp) {
      setAge(formatAge(tx.blockTimestamp));
      
      const interval = setInterval(() => {
        setAge(formatAge(tx.blockTimestamp!));
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [tx.blockTimestamp]);

  useEffect(() => {
    const fetchGasFee = async () => {
      try {
        if (tx.receipt) {
          const fee = tx.receipt.gasUsed * (tx.gasPrice || 0n);
          setGasFee(formatUnits(fee, 'ether'));
        }
      } catch (error) {
        setGasFee('-');
      }
    };

    fetchGasFee();
  }, [tx]);

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <Link 
          href={`/tx/${tx.hash}`}
          className="text-blue-600 hover:text-blue-800 font-mono text-sm"
        >
          {shortenHash(tx.hash)}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <Link 
          href={`/block/${tx.blockNumber}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {tx.blockNumber}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {age || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Link 
          href={`/address/${tx.from}`}
          className="text-blue-600 hover:text-blue-800 font-mono text-sm"
        >
          {shortenAddress(tx.from)}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {tx.to ? (
          <Link 
            href={`/address/${tx.to}`}
            className="text-blue-600 hover:text-blue-800 font-mono text-sm"
          >
            {shortenAddress(tx.to)}
          </Link>
        ) : (
          <span className="text-gray-500 text-sm">Contract Creation</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatGOWE(tx.value)} GOWE
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {gasFee !== 'Loading...' && gasFee !== '-' ? `${parseFloat(gasFee).toFixed(6)} GOWE` : gasFee}
      </td>
    </tr>
  );
}
