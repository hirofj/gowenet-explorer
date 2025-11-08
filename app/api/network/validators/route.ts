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
  validators: Validator[];
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
    
    const validators: Validator[] = (data.result?.validators || []).map((v: any) => ({
      nodeId: v.nodeID || 'Unknown',
      weight: parseInt(v.weight || '0', 10),
      validationId: v.validationID || 'Unknown',
      status: 'Active',
    }));

    return {
      totalValidators: validators.length,
      validators,
    };
  } catch (error) {
    console.error('Error fetching validators detail:', error);
    return {
      totalValidators: 0,
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
