'use client';

interface Validator {
  nodeId: string;
  weight: number;
  validationId: string;
  status?: string;
}

interface ValidatorListProps {
  validators: Validator[];
  loading?: boolean;
}

export default function ValidatorList({ validators, loading }: ValidatorListProps) {
  if (loading) {
    return <div className="text-center py-4 text-gray-500">Loading validators...</div>;
  }

  if (validators.length === 0) {
    return <div className="text-center py-4 text-gray-500">No validators found</div>;
  }

  const totalWeight = validators.reduce((sum, v) => sum + v.weight, 0);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="text-left px-4 py-2 font-semibold">Node ID</th>
              <th className="text-left px-4 py-2 font-semibold">Weight</th>
              <th className="text-left px-4 py-2 font-semibold">Stake %</th>
              <th className="text-left px-4 py-2 font-semibold">Validation ID</th>
              <th className="text-left px-4 py-2 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {validators.map((validator, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-sm break-all">{validator.nodeId}</td>
                <td className="px-4 py-3 text-sm font-semibold">{validator.weight}</td>
                <td className="px-4 py-3 text-sm">
                  {((validator.weight / totalWeight) * 100).toFixed(1)}%
                </td>
                <td className="px-4 py-3 font-mono text-sm break-all">{validator.validationId}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {validator.status || 'Active'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
        <p className="text-sm text-gray-600">
          Total Validators: <span className="font-semibold">{validators.length}</span> | 
          Total Weight: <span className="font-semibold">{totalWeight}</span>
        </p>
      </div>
    </div>
  );
}
