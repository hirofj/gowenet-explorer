export const NETWORK_CONFIG = {
  chainId: process.env.NEXT_PUBLIC_CHAIN_ID || '1337',
  blockchainId: process.env.NEXT_PUBLIC_BLOCKCHAIN_ID || '',
  subnetId: process.env.NEXT_PUBLIC_SUBNET_ID || '',
  currencySymbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'GOWE',
  networkName: process.env.NEXT_PUBLIC_NETWORK_NAME || 'GOWENET Local',
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || '',
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || '',
};

export const REFRESH_INTERVAL = 5000; // 5 seconds
export const ITEMS_PER_PAGE = 20;
