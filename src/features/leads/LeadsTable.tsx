import type { Lead } from '../../services/api';

interface LeadsTableProps {
  leads: Lead[];
  onSelectLead: (leadId: string) => void;
}

export function LeadsTable({ leads, onSelectLead }: LeadsTableProps) {

  const statusStyles = {
    New: 'bg-green-100 text-green-800',
    Contacted: 'bg-blue-100 text-blue-800',
    Qualified: 'bg-purple-100 text-purple-800',
    Lost: 'bg-red-100 text-red-800',
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
              Empresa
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Score
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {leads.map((lead) => (
            <tr 
              key={lead.id} 
              className="hover:bg-gray-50 cursor-pointer" 
              onClick={() => onSelectLead(lead.id)}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {lead.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {lead.company}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[lead.status]}`}>
                  {lead.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {lead.score}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
