'use client';

interface Peer {
  nodeId: string;
  ip: string;
  publicIP: string;
  version: string;
  observedUptime?: string;
  lastSent?: string;
  lastReceived?: string;
}

interface PeerListProps {
  peers: Peer[];
  loading?: boolean;
}

export default function PeerList({ peers, loading }: PeerListProps) {
  if (loading) {
    return <div className="text-center py-4 text-gray-500">Loading peers...</div>;
  }

  if (peers.length === 0) {
    return <div className="text-center py-4 text-gray-500">No peers connected</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="text-left px-4 py-2 font-semibold">Node ID</th>
            <th className="text-left px-4 py-2 font-semibold">Public IP</th>
            <th className="text-left px-4 py-2 font-semibold">Version</th>
            <th className="text-left px-4 py-2 font-semibold text-sm">Last Seen</th>
          </tr>
        </thead>
        <tbody>
          {peers.map((peer, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 font-mono text-sm break-all">{peer.nodeId}</td>
              <td className="px-4 py-3 font-mono text-sm">{peer.publicIP}</td>
              <td className="px-4 py-3 text-sm">{peer.version}</td>
              <td className="px-4 py-3 text-xs text-gray-500">
                {peer.lastReceived ? new Date(peer.lastReceived).toLocaleTimeString() : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
