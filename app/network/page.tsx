'use client';

import { useState, useEffect } from 'react';
import NetworkStatsCard from '@/components/NetworkStatsCard';
import PeerList from '@/components/PeerList';
import ValidatorList from '@/components/ValidatorList';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import { REFRESH_INTERVAL, NETWORK_CONFIG } from '@/lib/constants';

interface NetworkStats {
  peers: number;
  validators: number;
  isBootstrapped: boolean;
  gasUsedPercent: number;
  avgBlockTime: number;
  totalTransactions: number;
  chainId: string;
  blockchainId: string;
  subnetId: string;
  currencySymbol: string;
  networkName: string;
}

interface Peer {
  nodeId: string;
  ip: string;
  version: string;
}

interface Validator {
  nodeId: string;
  weight: number;
  validationId: string;
  status?: string;
}

export default function NetworkPage() {
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [peers, setPeers] = useState<Peer[]>([]);
  const [validators, setValidators] = useState<Validator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      setError(null);
      const [statsRes, peersRes, validatorsRes] = await Promise.all([
        fetch('/api/network/stats', { cache: 'no-store' }),
        fetch('/api/network/peers', { cache: 'no-store' }),
        fetch('/api/network/validators', { cache: 'no-store' }),
      ]);

      if (!statsRes.ok || !peersRes.ok || !validatorsRes.ok) {
        throw new Error('One or more API calls failed');
      }

      const statsData = await statsRes.json();
      const peersData = await peersRes.json();
      const validatorsData = await validatorsRes.json();

      setStats(statsData);
      setPeers(peersData.peers || []);
      setValidators(validatorsData.validators || []);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error('Error fetching network data:', err);
      setError(`Failed to fetch network data: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) return <Loading />;
  if (error && !stats) return <ErrorMessage message={error} />;

  const getBootstrapStatus = (): { text: string; status: 'success' | 'error' } => {
    return stats?.isBootstrapped
      ? { text: 'Bootstrapped', status: 'success' }
      : { text: 'Bootstrapping...', status: 'error' };
  };

  const getGasStatus = (): 'success' | 'warning' | 'error' => {
    if (!stats) return 'success';
    if (stats.gasUsedPercent < 50) return 'success';
    if (stats.gasUsedPercent < 80) return 'warning';
    return 'error';
  };

  const bootstrapStatus = getBootstrapStatus();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{stats?.networkName || NETWORK_CONFIG.networkName} Network Status</h1>
        <p className="text-gray-600">
          Last updated: {lastUpdated.toLocaleTimeString()}
          {error && <span className="text-red-600 ml-4">{error}</span>}
        </p>
      </div>

      {/* Primary Metrics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <NetworkStatsCard
            label="Connected Peers"
            value={stats.peers}
            icon="🌐"
            status={stats.peers > 0 ? 'success' : 'warning'}
          />
          <NetworkStatsCard
            label="Active Validators"
            value={stats.validators}
            icon="✓"
            status={stats.validators > 0 ? 'success' : 'error'}
          />
          <NetworkStatsCard
            label="Node Status"
            value={bootstrapStatus.text}
            icon={bootstrapStatus.status === 'success' ? '✅' : '⏳'}
            status={bootstrapStatus.status}
          />
          <NetworkStatsCard
            label="Gas Usage"
            value={stats.gasUsedPercent.toFixed(1)}
            unit="%"
            icon="⛽"
            status={getGasStatus()}
          />
          <NetworkStatsCard
            label="Avg Block Time"
            value={stats.avgBlockTime.toFixed(2)}
            unit="s"
            icon="⏱️"
          />
        </div>
      )}

      {/* Peer List */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Connected Peers ({peers.length})</h2>
        <PeerList peers={peers} loading={loading} />
      </div>

      {/* Validators List */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Active Validators ({validators.length})</h2>
        <ValidatorList validators={validators} loading={loading} />
      </div>

      {/* Network Configuration */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Network Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-600 text-sm font-medium">Network Name</p>
            <p className="text-lg font-semibold mt-1">{stats?.networkName || NETWORK_CONFIG.networkName}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Chain ID</p>
            <p className="text-lg font-semibold mt-1">{stats?.chainId || NETWORK_CONFIG.chainId}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Currency Symbol</p>
            <p className="text-lg font-semibold mt-1">{stats?.currencySymbol || NETWORK_CONFIG.currencySymbol}</p>
          </div>
        </div>
      </div>

      {/* Blockchain IDs */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Blockchain Identifiers</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Blockchain ID</p>
            <p className="text-sm font-mono bg-gray-100 p-3 rounded break-all">
              {stats?.blockchainId || NETWORK_CONFIG.blockchainId}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Subnet ID</p>
            <p className="text-sm font-mono bg-gray-100 p-3 rounded break-all">
              {stats?.subnetId || NETWORK_CONFIG.subnetId}
            </p>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      {stats && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-gray-600 text-sm">Transactions (Last 100 Blocks)</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalTransactions}</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="text-gray-600 text-sm">Average Block Time</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avgBlockTime.toFixed(2)}s</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <p className="text-gray-600 text-sm">Network Load</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.gasUsedPercent.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      )}

      {/* RPC Endpoint */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">RPC Endpoint</h2>
        <div className="mb-4">
          <p className="text-gray-600 text-sm font-medium mb-2">Current RPC URL</p>
          <p className="text-sm font-mono bg-white p-3 rounded break-all border border-blue-200">
            {NETWORK_CONFIG.rpcUrl}
          </p>
        </div>
        <div>
          <p className="text-gray-600 text-sm font-medium mb-2">WebSocket URL</p>
          <p className="text-sm font-mono bg-white p-3 rounded break-all border border-blue-200">
            {NETWORK_CONFIG.wsUrl}
          </p>
        </div>
      </div>
    </main>
  );
}
