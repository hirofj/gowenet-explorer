import { NextResponse } from 'next/server';
import { NETWORK_CONFIG } from '@/lib/constants';

export interface Peer {
  nodeId: string;
  ip: string;
  publicIP: string;
  version: string;
  observedUptime: string;
  lastSent: string;
  lastReceived: string;
}

export interface PeersResponse {
  totalPeers: number;
  peers: Peer[];
}

function isValidIP(ip: string): boolean {
  // Check if IP is valid (not 0.0.0.0 or similar invalid addresses)
  if (!ip || ip.startsWith('0.0.0.0') || ip === '0.0.0.0:1' || ip.includes('0.0.0.0')) {
    return false;
  }
  return true;
}

async function getPeersDetail(): Promise<PeersResponse> {
  try {
    const baseUrl = NETWORK_CONFIG.rpcUrl.split('/ext/bc/')[0];
    const response = await fetch(`${baseUrl}/ext/info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'info.peers',
        params: {},
        id: 1,
      }),
    });
    const data = await response.json();
    
    const peers: Peer[] = (data.result?.peers || []).map((p: any) => {
      // Use publicIP if valid, otherwise use ip
      const displayIP = isValidIP(p.publicIP) ? p.publicIP : (p.ip || 'Unknown');
      
      return {
        nodeId: p.nodeID || 'Unknown',
        ip: p.ip || 'Unknown',
        publicIP: displayIP,
        version: p.version || 'Unknown',
        observedUptime: p.observedUptime || '0',
        lastSent: p.lastSent || '',
        lastReceived: p.lastReceived || '',
      };
    });

    return {
      totalPeers: data.result?.numPeers || 0,
      peers,
    };
  } catch (error) {
    console.error('Error fetching peers detail:', error);
    return {
      totalPeers: 0,
      peers: [],
    };
  }
}

export async function GET() {
  try {
    const data = await getPeersDetail();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in peers API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch peers information' },
      { status: 500 }
    );
  }
}
