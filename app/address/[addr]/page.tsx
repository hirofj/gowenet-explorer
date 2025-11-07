'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { getProvider } from '@/lib/provider';
import { formatGOWE, shortenHash, timeAgo } from '@/lib/utils';
import { NETWORK_CONFIG } from '@/lib/constants';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import type { TransactionResponse } from 'ethers';

export default function AddressDetailPage({ params }: { params: Promise<{ addr: string }> }) {
  const { addr } = use(params);
  const [balance, setBalance] = useState('0');
  const [isContract, setIsContract] = useState(false);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAddressData = async () => {
      try {
        const provider = getProvider();
        
        // Get balance
        const balanceData = await provider.getBalance(addr);
        setBalance(formatGOWE(balanceData));
        
        // Check if contract
        const code = await provider.getCode(addr);
        setIsContract(code !== '0x');
        
        // Fetch transactions (simplified - last 10 blocks)
        const blockNumber = await provider.getBlockNumber();
        const txs: TransactionResponse[] = [];
        
        for (let i = 0; i < 50 && txs.length < 20; i++) {
          const block = await provider.getBlock(blockNumber - i, true);
          if (!block) continue;
          
          for (const txHash of block.transactions) {
            const tx = await provider.getTransaction(txHash as string);
            if (tx && (tx.from.toLowerCase() === addr.toLowerCase() || 
                       tx.to?.toLowerCase() === addr.toLowerCase())) {
              txs.push(tx);
              if (txs.length >= 20) break;
            }
          }
        }
        
        setTransactions(txs);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch address data');
        setLoading(false);
      }
    };

    fetchAddressData();
  }, [addr]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Address Details</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y">
          <InfoRow label="Address" value={addr} mono />
          <InfoRow label="Balance" value={`${balance} ${NETWORK_CONFIG.currencySymbol}`} />
          <InfoRow 
            label="Type" 
            value={
              <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${
                isContract ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {isContract ? 'Contract' : 'EOA (Externally Owned Account)'}
              </span>
            }
          />
          <InfoRow label="Transaction Count" value={transactions.length.toString()} />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Transactions</h2>
        {transactions.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tx Hash</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Block</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((tx) => (
                    <tr key={tx.hash} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                        <Link href={`/tx/${tx.hash}`} className="text-blue-600 hover:underline">
                          {shortenHash(tx.hash)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {tx.blockNumber && (
                          <Link href={`/block/${tx.blockNumber}`} className="text-blue-600 hover:underline">
                            {tx.blockNumber}
                          </Link>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                        {tx.from.toLowerCase() === addr.toLowerCase() ? (
                          <span className="text-gray-900">{shortenHash(tx.from)}</span>
                        ) : (
                          <Link href={`/address/${tx.from}`} className="text-blue-600 hover:underline">
                            {shortenHash(tx.from)}
                          </Link>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                        {tx.to ? (
                          tx.to.toLowerCase() === addr.toLowerCase() ? (
                            <span className="text-gray-900">{shortenHash(tx.to)}</span>
                          ) : (
                            <Link href={`/address/${tx.to}`} className="text-blue-600 hover:underline">
                              {shortenHash(tx.to)}
                            </Link>
                          )
                        ) : (
                          '[Contract Creation]'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {formatGOWE(tx.value)} GOWE
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No transactions found</p>
        )}
      </div>
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
