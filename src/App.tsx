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
      amount: undefined
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
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-400 mb-6">My Leads</h1>
      
      <div className="mb-4 w-full sm:max-w-xs">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Search by Name or Company
        </label>
        <input
          type="text"
          id="search"
          className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type to search..."
        />
      </div>

      <div className="mb-4 w-full sm:max-w-xs">
        <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Filtrar por Status
        </label>
        <select
          id="status-filter"
          className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Lost">Lost</option>
        </select>
      </div>

      <LeadsTable 
        leads={filteredAndSortedLeads} 
        onSelectLead={setSelectedLeadId}
      />

      <LeadDetailPanel 
        isOpen={selectedLeadId !== null}
        onClose={() => setSelectedLeadId(null)}
        lead={selectedLead}
        onUpdate={handleUpdateLead}
        onConvert={handleConvertLead}
      />

      {opportunities.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-green-600 mb-6">My Opportunities</h2>
          <OpportunitiesTable opportunities={opportunities} />
        </div>
      )}
    </div>
  );
}

export default App;