import { useEffect, useState } from "react";
import { getLeads, type Lead } from './services/api';
import { LeadsTable } from './features/leads/LeadsTable';

function App() {

  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  const fetchLeads = async () => {
    try {
      const fetchedLeads = await getLeads();
      setLeads(fetchedLeads);
    } catch (error) {
      console.error("Falha ao buscar os leads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchLeads();
}, []);

  if (isLoading) {
    return <div className="text-center p-8">Carregando leads...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">Meus Leads</h1>
      <LeadsTable leads={leads} />
    </div>
  );
}

export default App;