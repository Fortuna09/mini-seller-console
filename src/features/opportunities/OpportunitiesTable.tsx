import type { Opportunity } from '../../services/api';

interface OpportunitiesTableProps {
  opportunities: Opportunity[];
}

export function OpportunitiesTable({ opportunities }: OpportunitiesTableProps) {
  const stageStyles = {
    'Prospecting': 'bg-blue-100 text-blue-800',
    'Proposal': 'bg-yellow-100 text-yellow-800',
    'Closed-Won': 'bg-green-100 text-green-800',
    'Closed-Lost': 'bg-red-100 text-red-800',
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Conta
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estágio
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valor
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {opportunities.map((opportunity) => (
            <tr key={opportunity.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {opportunity.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {opportunity.accountName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stageStyles[opportunity.stage]}`}>
                  {opportunity.stage}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {opportunity.amount ? `R$ ${opportunity.amount.toLocaleString('pt-BR')}` : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}