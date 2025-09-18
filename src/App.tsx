import { useEffect, useState, useMemo } from "react";
import { getLeads, type Lead, type Opportunity } from './services/api';
import { LeadsTable } from './features/leads/LeadsTable';
import { LeadDetailPanel } from './features/leads/LeadDetailPanel';
import { OpportunitiesTable } from './features/opportunities/OpportunitiesTable';
import { Pagination } from './components/Pagination';

function App() {
  const ITEMS_PER_PAGE = 5;
  const statuses: Array<Lead['status'] | 'All'> = ['All', 'New', 'Contacted', 'Qualified', 'Lost'];

  const [leads, setLeads] = useState<Lead[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [leadsCurrentPage, setLeadsCurrentPage] = useState(1);
  const [opportunitiesCurrentPage, setOpportunitiesCurrentPage] = useState(1);

  const handleClearFilters = () => {
    setStatusFilter('All');
    setSearchTerm('');
  };

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

  const paginatedLeads = useMemo(() => {
    const indexOfLastItem = leadsCurrentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    return filteredAndSortedLeads.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredAndSortedLeads, leadsCurrentPage]);

  const paginatedOpportunities = useMemo(() => {
    const indexOfLastItem = opportunitiesCurrentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    return opportunities.slice(indexOfFirstItem, indexOfLastItem);
  }, [opportunities, opportunitiesCurrentPage]);

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
      amount: lead.score * 10000
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
      <div className="flex items-center justify-center min-h-screen bg-background">
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
    return <div className="flex items-center justify-center min-h-screen bg-background text-neutral-600">Loading leads...</div>;
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">F1 Sponsors Panel</h1>
          <p className="text-neutral-500 mt-1">Manage potential sponsors for Scuderia.</p>
        </div>

        <div className="bg-white p-6 shadow-sm">
          <div className="border-b border-neutral-200 pb-5 sm:flex sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold leading-6 text-neutral-800">Initial Contacts (Leads)</h2>
            <div className="mt-3 sm:ml-4 sm:mt-0">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  className="block w-full max-w-xs rounded-md border-neutral-300 py-2 pl-10 text-neutral-900 placeholder:text-neutral-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search name or company"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4">
            <span className="text-sm font-medium text-neutral-600">Filter by status:</span>
            <div className="flex flex-wrap items-center gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-md px-3 py-1 text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${statusFilter === status
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-300'
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {(statusFilter !== 'All' || searchTerm) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="ml-auto text-sm font-medium text-primary hover:text-primary-hover"
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="overflow-hidden border border-neutral-200 rounded-lg">
            <LeadsTable
              leads={paginatedLeads}
              onSelectLead={setSelectedLeadId}
              selectedLeadId={selectedLeadId}
            />
            <Pagination
              currentPage={leadsCurrentPage}
              totalItems={filteredAndSortedLeads.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setLeadsCurrentPage}
            />
          </div>
        </div>

        <LeadDetailPanel
          isOpen={selectedLeadId !== null}
          onClose={() => setSelectedLeadId(null)}
          lead={selectedLead}
          onUpdate={handleUpdateLead}
          onConvert={handleConvertLead}
        />

        {opportunities.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200/80">
            <h2 className="text-xl font-semibold text-neutral-800 mb-6">Active Negotiations (Opportunities)</h2>

            <div className="overflow-hidden border border-neutral-200 rounded-lg">
              <OpportunitiesTable opportunities={paginatedOpportunities} />
              <Pagination
                currentPage={opportunitiesCurrentPage}
                totalItems={opportunities.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setOpportunitiesCurrentPage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;