import { NextResponse } from 'next/server';
import { NETWORK_CONFIG } from '@/lib/constants';

export interface Validator {
  nodeId: string;
  weight: number;
  validationId: string;
  status?: string;
}

export interface ValidatorsResponse {
  totalValidators: number;
  activeValidators: number;
  validators: Validator[];
}

async function getConnectedNodeIds(): Promise<Set<string>> {
  try {
    const baseUrl = NETWORK_CONFIG.rpcUrl.split('/ext/bc/')[0];
    
    // Get the node we're connected to
    const nodeIdResponse = await fetch(`${baseUrl}/ext/info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'info.getNodeID',
        params: {},
        id: 1,
      }),
    });
    const nodeIdData = await nodeIdResponse.json();
    
    // Get peers of the connected node
    const peersResponse = await fetch(`${baseUrl}/ext/info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'info.peers',
        params: {},
        id: 1,
      }),
    });
    const peersData = await peersResponse.json();
    
    const nodeIds = new Set<string>();
    
    // Add the node we're connected to
    if (nodeIdData.result?.nodeID) {
      nodeIds.add(nodeIdData.result.nodeID);
    }
    
    // Add all peers
    (peersData.result?.peers || []).forEach((p: any) => {
      if (p.nodeID) {
        nodeIds.add(p.nodeID);
      }
    });
    
    return nodeIds;
  } catch (error) {
    console.error('Error fetching connected peers:', error);
    return new Set();
  }
}

async function getValidatorsDetail(): Promise<ValidatorsResponse> {
  try {
    const baseUrl = NETWORK_CONFIG.rpcUrl.split('/ext/bc/')[0];
    const response = await fetch(`${baseUrl}/ext/bc/P`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'platform.getCurrentValidators',
        params: {
          subnetID: NETWORK_CONFIG.subnetId,
        },
        id: 1,
      }),
    });
    const data = await response.json();
    
    // Get list of connected node IDs (including the node we're connected to)
    const connectedNodeIds = await getConnectedNodeIds();
    
    const validators: Validator[] = (data.result?.validators || []).map((v: any) => {
      const nodeId = v.nodeID || 'Unknown';
      const isConnected = connectedNodeIds.has(nodeId);
      
      return {
        nodeId,
        weight: parseInt(v.weight || '0', 10),
        validationId: v.validationID || 'Unknown',
        status: isConnected ? 'Active' : 'Offline',
      };
    });

    const activeValidators = validators.filter(v => v.status === 'Active').length;

    return {
      totalValidators: validators.length,
      activeValidators,
      validators,
    };
  } catch (error) {
    console.error('Error fetching validators detail:', error);
    return {
      totalValidators: 0,
      activeValidators: 0,
      validators: [],
    };
  }
}

export async function GET() {
  try {
    const data = await getValidatorsDetail();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in validators API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch validators information' },
      { status: 500 }
    );
  }
}
