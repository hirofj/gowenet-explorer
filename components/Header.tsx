'use client';

import Link from 'next/link';
import { useState } from 'react';
import SearchBar from './SearchBar';
import NetworkStatus from './NetworkStatus';
import { NETWORK_CONFIG } from '@/lib/constants';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="text-2xl font-bold">
            {NETWORK_CONFIG.networkName} Explorer
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-blue-300">Home</Link>
            <Link href="/blocks" className="hover:text-blue-300">Blocks</Link>
            <Link href="/transactions" className="hover:text-blue-300">Transactions</Link>
            <Link href="/network" className="hover:text-blue-300">Network</Link>
          </nav>

          <NetworkStatus />
          
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="pb-4">
          <SearchBar />
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block hover:text-blue-300">Home</Link>
            <Link href="/blocks" className="block hover:text-blue-300">Blocks</Link>
            <Link href="/transactions" className="block hover:text-blue-300">Transactions</Link>
            <Link href="/network" className="block hover:text-blue-300">Network</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
