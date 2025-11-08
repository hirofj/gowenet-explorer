'use client';

interface NetworkStatsCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: string;
  status?: 'success' | 'warning' | 'error';
}

export default function NetworkStatsCard({
  label,
  value,
  unit,
  icon,
  status,
}: NetworkStatsCardProps) {
  const statusColors = {
    success: 'border-green-500 bg-green-50',
    warning: 'border-yellow-500 bg-yellow-50',
    error: 'border-red-500 bg-red-50',
  };

  const statusBg = status ? statusColors[status] : 'border-blue-200 bg-blue-50';

  return (
    <div className={`border-2 rounded-lg p-6 ${statusBg}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {value}
            {unit && <span className="text-lg text-gray-500 ml-1">{unit}</span>}
          </p>
        </div>
        {icon && <div className="text-3xl">{icon}</div>}
      </div>
    </div>
  );
}
