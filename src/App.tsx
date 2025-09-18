import { useEffect, useState, useMemo } from "react";
import { getLeads, type Lead, type Opportunity } from './services/api';
import { LeadsTable } from './features/leads/LeadsTable';
import { LeadDetailPanel } from './features/leads/LeadDetailPanel';
import { OpportunitiesTable } from './features/opportunities/OpportunitiesTable';

function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedLeads = localStorage.getItem('leads');
        if (savedLeads) {
          setLeads(JSON.parse(savedLeads));
        } else {
          const fetchedLeads = await getLeads();
          setLeads(fetchedLeads);
          localStorage.setItem('leads', JSON.stringify(fetchedLeads));
        }

        const savedOpportunities = localStorage.getItem('opportunities');
        if (savedOpportunities) {
          setOpportunities(JSON.parse(savedOpportunities));
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error
          ? error.message
          : "Failed to load data. Please try refreshing the page.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredAndSortedLeads = useMemo(() => {
    let processedLeads = leads;

    if (statusFilter !== 'All') {
      processedLeads = processedLeads.filter(lead => lead.status === statusFilter);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      processedLeads = processedLeads.filter(lead =>
        lead.name.toLowerCase().includes(searchLower) ||
        lead.company.toLowerCase().includes(searchLower)
      );
    }

    return [...processedLeads].sort((a, b) => b.score - a.score);
  }, [leads, statusFilter, searchTerm]);

  const selectedLead = useMemo(() => {
    if (!selectedLeadId) return null;
    return leads.find(lead => lead.id === selectedLeadId) || null;
  }, [leads, selectedLeadId]);

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(currentLeads => {
      const newLeads = currentLeads.map(lead =>
        lead.id === updatedLead.id ? updatedLead : lead
      );
      localStorage.setItem('leads', JSON.stringify(newLeads));
      return newLeads;
    });
  };

  const handleConvertLead = (lead: Lead) => {
    setLeads(currentLeads => {
      const newLeads = currentLeads.filter(l => l.id !== lead.id);
      localStorage.setItem('leads', JSON.stringify(newLeads));
      return newLeads;
    });

    const newOpportunity: Opportunity = {
      id: lead.id,
      name: lead.name,
      accountName: lead.company,
      stage: 'Prospecting',
      amount: lead.score * 100000
    };

    setOpportunities(currentOpportunities => {
      const newOpportunities = [...currentOpportunities, newOpportunity];
      localStorage.setItem('opportunities', JSON.stringify(newOpportunities));
      return newOpportunities;
    });

    setSelectedLeadId(null);
  };

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="inline-flex items-center px-4 py-2 rounded-md text-sm text-red-700 bg-red-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center p-8">Loading leads...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Leads Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your leads and opportunities in one place.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">My Leads</h2>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <label htmlFor="search" className="sr-only">Search</label>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  className="block w-full rounded-md border-gray-300 bg-white pl-10 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or company"
                />
              </div>

              <select
                id="status-filter"
                className="block w-full sm:w-auto rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
          </div>

          <LeadsTable
            leads={filteredAndSortedLeads}
            onSelectLead={setSelectedLeadId}
            selectedLeadId={selectedLeadId}
          />
        </div>

        <LeadDetailPanel
          isOpen={selectedLeadId !== null}
          onClose={() => setSelectedLeadId(null)}
          lead={selectedLead}
          onUpdate={handleUpdateLead}
          onConvert={handleConvertLead}
        />

        {opportunities.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">My Opportunities</h2>
            <OpportunitiesTable opportunities={opportunities} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;