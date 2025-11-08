'use client';

import { useEffect, useState } from 'react';
import { getProvider } from '@/lib/provider';
import TransactionRow from '@/components/TransactionRow';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import type { TransactionResponse, Block } from 'ethers';

interface TransactionWithBlock extends TransactionResponse {
  blockTimestamp?: number;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionWithBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const provider = getProvider();
        const blockNumber = await provider.getBlockNumber();
        
        const txs: TransactionWithBlock[] = [];
        
        for (let i = 0; i < 20 && txs.length < 50; i++) {
          const block = await provider.getBlock(blockNumber - i, true);
          if (!block) continue;
          
          for (const txHash of block.transactions) {
            const tx = await provider.getTransaction(txHash as string);
            if (tx) {
              txs.push({
                ...tx,
                blockTimestamp: block.timestamp
              });
            }
            if (txs.length >= 50) break;
          }
        }
        
        setTransactions(txs);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch transactions');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Transactions</h1>
      {transactions.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Txn Hash
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Block
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gas Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((tx) => (
                  <TransactionRow key={tx.hash} tx={tx} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No transactions found</p>
      )}
    </div>
  );
}
