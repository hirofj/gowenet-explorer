'use client';

import { useEffect, useState } from 'react';
import { checkConnection } from '@/lib/provider';
import { REFRESH_INTERVAL } from '@/lib/constants';

export default function NetworkStatus() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const check = async () => {
      const connected = await checkConnection();
      setIsConnected(connected);
    };

    check();
    const interval = setInterval(check, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
      <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
    </div>
  );
}
