'use client';

import { useEffect, useState } from 'react';
import { getProvider } from '@/lib/provider';
import TransactionCard from '@/components/TransactionCard';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import type { TransactionResponse } from 'ethers';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const provider = getProvider();
        const blockNumber = await provider.getBlockNumber();
        
        const txs: TransactionResponse[] = [];
        
        for (let i = 0; i < 20 && txs.length < 20; i++) {
          const block = await provider.getBlock(blockNumber - i, true);
          if (!block) continue;
          
          for (const txHash of block.transactions) {
            const tx = await provider.getTransaction(txHash as string);
            if (tx) txs.push(tx);
            if (txs.length >= 20) break;
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {transactions.map((tx) => (
            <TransactionCard key={tx.hash} tx={tx} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No transactions found</p>
      )}
    </div>
  );
}
