import leadsData from '../data/leads.json';

export type Opportunity = {
  id: string;
  name: string;
  stage: 'Prospecting' | 'Proposal' | 'Closed-Won' | 'Closed-Lost';
  amount?: number;
  accountName: string;
};

export type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  source: string;
  score: number;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
};

export const getLeads = async (): Promise<Lead[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return leadsData as Lead[];
};