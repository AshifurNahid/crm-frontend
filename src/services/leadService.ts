
export interface LeadContactInfo {
  phone: string;
  email: string;
}

export interface Lead {
  id?: number;
  leadName: string;
  leadSource: string;
  contactInfo: LeadContactInfo;
  leadStatus: string;
  leadOwner: string;
  territory: string;
  leadRating: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeadPageResponse {
  content: Lead[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

const BASE_URL = '/api/v1/leads';

export const leadService = {
  async getAllLeads(pageNumber = 0, pageSize = 10, direction = 'ASC', sortField = 'id'): Promise<LeadPageResponse> {
    const response = await fetch(`${BASE_URL}?pageNumber=${pageNumber}&pageSize=${pageSize}&direction=${direction}&sortField=${sortField}`);
    if (!response.ok) throw new Error('Failed to fetch leads');
    return response.json();
  },

  async getLeadById(id: number): Promise<Lead> {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch lead');
    return response.json();
  },

  async createLead(lead: Omit<Lead, 'id'>): Promise<Lead> {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    if (!response.ok) throw new Error('Failed to create lead');
    return response.json();
  },

  async updateLead(id: number, lead: Partial<Lead>): Promise<Lead> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    if (!response.ok) throw new Error('Failed to update lead');
    return response.json();
  },

  async deleteLead(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete lead');
  },
};
