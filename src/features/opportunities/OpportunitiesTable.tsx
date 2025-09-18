import type { Opportunity } from '../../services/api';

interface OpportunitiesTableProps {
  opportunities: Opportunity[];
}

export function OpportunitiesTable({ opportunities }: OpportunitiesTableProps) {
  const stageStyles: { [key in Opportunity['stage']]: string } = {
    'Prospecting': 'bg-cyan-100 text-cyan-800',
    'Proposal': 'bg-amber-100 text-amber-800',
    'Closed-Won': 'bg-teal-100 text-teal-800',
    'Closed-Lost': 'bg-neutral-200 text-neutral-800',
  };

  return (
    <div className="overflow-x-auto border border-neutral-200 rounded-lg">
      <table className="min-w-full divide-y divide-neutral-200">
        <thead className="bg-neutral-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Account
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Stage
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-neutral-200">
          {opportunities.length > 0 ? (
            opportunities.map((opportunity) => (
              <tr key={opportunity.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                  {opportunity.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                  {opportunity.accountName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${stageStyles[opportunity.stage]}`}>
                    {opportunity.stage}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 font-medium">
                  {opportunity.amount ? `$${opportunity.amount.toLocaleString('en-US')}` : '-'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-8 text-neutral-500">
                No opportunities yet. Convert a lead to get started!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}