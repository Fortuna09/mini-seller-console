import { useEffect, useState, useMemo } from "react";
import { getLeads, type Lead } from './services/api';
import { LeadsTable } from './features/leads/LeadsTable';
import { LeadDetailPanel } from './features/leads/LeadDetailPanel';

function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const savedLeads = localStorage.getItem('leads');
        if (savedLeads) {
          setLeads(JSON.parse(savedLeads));
        } else {
          const fetchedLeads = await getLeads();
          setLeads(fetchedLeads);
          localStorage.setItem('leads', JSON.stringify(fetchedLeads));
        }
      } catch (error) {
        console.error("Falha ao buscar os leads:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const filteredAndSortedLeads = useMemo(() => {
    console.log('Recalculando filtros, busca e ordenação...');
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

  if (isLoading) {
    return <div className="text-center p-8">Carregando leads...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">Meus Leads</h1>
      
      <div className="mb-4 max-w-xs">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Buscar por Nome ou Empresa
        </label>
        <input
          type="text"
          id="search"
          className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Digite para buscar..."
        />
      </div>

      <div className="mb-4 max-w-xs">
        <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Filtrar por Status
        </label>
        <select
          id="status-filter"
          className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">Todos</option>
          <option value="New">Novo</option>
          <option value="Contacted">Contatado</option>
          <option value="Qualified">Qualificado</option>
          <option value="Lost">Perdido</option>
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
      />
    </div>
  );
}

export default App;