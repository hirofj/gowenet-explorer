import Link from 'next/link';
import { shortenHash, shortenAddress, formatGOWE } from '@/lib/utils';
import type { TransactionResponse } from 'ethers';

export default function TransactionCard({ tx }: { tx: TransactionResponse }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <Link 
          href={`/tx/${tx.hash}`}
          className="text-blue-600 hover:text-blue-800 font-mono text-sm"
        >
          {shortenHash(tx.hash)}
        </Link>
      </div>
      <div className="text-sm text-gray-600 space-y-1">
        <p>
          From: <Link href={`/address/${tx.from}`} className="text-blue-600 hover:underline font-mono">
            {shortenAddress(tx.from)}
          </Link>
        </p>
        {tx.to && (
          <p>
            To: <Link href={`/address/${tx.to}`} className="text-blue-600 hover:underline font-mono">
              {shortenAddress(tx.to)}
            </Link>
          </p>
        )}
        <p>Value: {formatGOWE(tx.value)} GOWE</p>
      </div>
    </div>
  );
}
