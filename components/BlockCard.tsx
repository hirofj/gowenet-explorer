import Link from 'next/link';
import { timeAgo } from '@/lib/utils';
import type { Block } from 'ethers';

export default function BlockCard({ block }: { block: Block }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <Link 
          href={`/block/${block.number}`}
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          Block #{block.number}
        </Link>
        <span className="text-sm text-gray-500">{timeAgo(block.timestamp || 0)}</span>
      </div>
      <div className="text-sm text-gray-600 space-y-1">
        <p>Transactions: {block.transactions.length}</p>
        <p>Gas Used: {block.gasUsed?.toLocaleString()}</p>
      </div>
    </div>
  );
}
