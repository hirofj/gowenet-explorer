'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { getProvider } from '@/lib/provider';
import { formatTimestamp, formatGOWE, formatGas } from '@/lib/utils';
import { NETWORK_CONFIG } from '@/lib/constants';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import type { TransactionResponse, TransactionReceipt } from 'ethers';

export default function TransactionDetailPage({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = use(params);
  const [tx, setTx] = useState<TransactionResponse | null>(null);
  const [receipt, setReceipt] = useState<TransactionReceipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const provider = getProvider();
        const txData = await provider.getTransaction(hash);
        
        if (!txData) {
          setError('Transaction not found');
          setLoading(false);
          return;
        }
        
        setTx(txData);
        
        const receiptData = await provider.getTransactionReceipt(hash);
        setReceipt(receiptData);
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch transaction');
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [hash]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!tx) return <ErrorMessage message="Transaction not found" />;

  const status = receipt?.status === 1 ? 'Success' : receipt?.status === 0 ? 'Failed' : 'Pending';
  const fee = receipt ? (receipt.gasUsed * tx.gasPrice!) : 0n;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Transaction Details</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y">
          <InfoRow 
            label="Transaction Hash" 
            value={tx.hash} 
            mono 
          />
          <InfoRow 
            label="Status" 
            value={
              <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${
                status === 'Success' ? 'bg-green-100 text-green-800' :
                status === 'Failed' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {status}
              </span>
            }
          />
          {tx.blockNumber && (
            <InfoRow 
              label="Block" 
              value={
                <Link href={`/block/${tx.blockNumber}`} className="text-blue-600 hover:underline">
                  {tx.blockNumber}
                </Link>
              }
            />
          )}
          {receipt?.blockNumber && (
            <InfoRow label="Timestamp" value={formatTimestamp(Date.now() / 1000)} />
          )}
          <InfoRow 
            label="From" 
            value={
              <Link href={`/address/${tx.from}`} className="text-blue-600 hover:underline">
                {tx.from}
              </Link>
            } 
            mono 
          />
          {tx.to ? (
            <InfoRow 
              label="To" 
              value={
                <Link href={`/address/${tx.to}`} className="text-blue-600 hover:underline">
                  {tx.to}
                </Link>
              } 
              mono 
            />
          ) : (
            <InfoRow label="To" value="[Contract Creation]" />
          )}
          <InfoRow label="Value" value={`${formatGOWE(tx.value)} ${NETWORK_CONFIG.currencySymbol}`} />
          <InfoRow label="Transaction Fee" value={`${formatGOWE(fee)} ${NETWORK_CONFIG.currencySymbol}`} />
          <InfoRow label="Gas Limit" value={formatGas(tx.gasLimit)} />
          {receipt && <InfoRow label="Gas Used" value={formatGas(receipt.gasUsed)} />}
          {tx.gasPrice && <InfoRow label="Gas Price" value={`${tx.gasPrice.toString()} Wei`} />}
          <InfoRow label="Nonce" value={tx.nonce.toString()} />
          {tx.data && tx.data !== '0x' && (
            <InfoRow label="Input Data" value={tx.data} mono />
          )}
        </div>
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
