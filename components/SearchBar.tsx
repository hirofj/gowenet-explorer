'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isValidAddress, isValidHash, isValidBlockNumber } from '@/lib/utils';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    
    if (!trimmed) return;

    if (isValidBlockNumber(trimmed)) {
      router.push(`/block/${trimmed}`);
    } else if (isValidHash(trimmed)) {
      router.push(`/tx/${trimmed}`);
    } else if (isValidAddress(trimmed)) {
      router.push(`/address/${trimmed}`);
    } else {
      alert('Invalid search query. Please enter a block number, transaction hash, or address.');
    }
    
    setQuery('');
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by Block / Tx Hash / Address"
          className="flex-1 px-4 py-2 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-lg font-medium"
        >
          Search
        </button>
      </div>
    </form>
  );
}
