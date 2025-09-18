import type { Lead } from '../../services/api';

interface LeadsTableProps {
    leads: Lead[];
    onSelectLead: (leadId: string) => void;
    selectedLeadId: string | null;
}

export function LeadsTable({ leads, onSelectLead, selectedLeadId }: LeadsTableProps) {
    const statusStyles: { [key in Lead['status']]: string } = {
        New: 'bg-emerald-100 text-emerald-800',
        Contacted: 'bg-yellow-100 text-yellow-800',
        Qualified: 'bg-blue-100 text-blue-800',
        Lost: 'bg-red-100 text-red-800',
    };

    return (
        <div className="overflow-x-auto border border-neutral-200 rounded-lg">
            <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                            Company
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                            Score
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                    {leads.length > 0 ? (
                        leads.map((lead) => (
                            <tr
                                key={lead.id}
                                className={`transition-colors duration-150 ease-in-out cursor-pointer ${selectedLeadId === lead.id
                                        ? 'bg-sky-50'
                                        : 'hover:bg-neutral-50'
                                    }`}
                                onClick={() => onSelectLead(lead.id)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-neutral-900">{lead.name}</div>
                                    <div className="text-sm text-neutral-500">{lead.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                    {lead.company}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[lead.status]}`}>
                                        {lead.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 font-medium">
                                    {lead.score}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="text-center py-12">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mx-auto h-12 w-12 text-neutral-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-neutral-800">
                                    No leads found
                                </h3>
                                <p className="mt-1 text-sm text-neutral-500">
                                    Try adjusting your search or filters.
                                </p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}