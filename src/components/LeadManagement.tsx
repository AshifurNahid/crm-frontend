
import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Mail, Phone, Calendar, User, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLeads, useDeleteLead } from '@/hooks/useLeads';
import { Lead } from '@/services/leadService';
import { Button } from '@/components/ui/button';

const LeadManagement = () => {
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(0);
  const [sortField, setSortField] = useState('id');
  const [direction, setDirection] = useState<'ASC' | 'DESC'>('ASC');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');

  const { data: leadsData, isLoading, error } = useLeads(pageNumber, 10, sortField, direction);
  const deleteMutation = useDeleteLead();

  const getStatusColor = (status: string) => {
    const colors = {
      'New': 'bg-blue-100 text-blue-800',
      'Contacted': 'bg-yellow-100 text-yellow-800',
      'Qualified': 'bg-green-100 text-green-800',
      'Converted': 'bg-purple-100 text-purple-800',
      'Dropped': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleEdit = (leadId: number) => {
    navigate(`/leads/${leadId}/edit`);
  };

  const handleDelete = async (leadId: number) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteMutation.mutate(leadId);
    }
  };

  const filteredLeads = leadsData?.content?.filter((lead: Lead) => {
    const matchesSearch = lead.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.contactInfo.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || lead.leadStatus === statusFilter;
    const matchesSource = !sourceFilter || lead.leadSource === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading leads...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading leads. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-600 mt-1">Track and manage your sales leads</p>
        </div>
        <Button onClick={() => navigate('/lead/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Lead
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-1 space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Converted">Converted</option>
              <option value="Dropped">Dropped</option>
            </select>
            <select 
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Sources</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Social Media">Social Media</option>
              <option value="Email">Email</option>
            </select>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter size={16} />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Lead Info</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Source</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Rating</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Owner</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Territory</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLeads.map((lead: Lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{lead.leadName}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500 flex items-center">
                          <Mail size={14} className="mr-1" />
                          {lead.contactInfo.email}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Phone size={14} className="mr-1" />
                          {lead.contactInfo.phone}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{lead.leadSource}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.leadStatus)}`}>
                      {lead.leadStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-900">{lead.leadRating}%</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <User size={12} className="text-white" />
                      </div>
                      <span className="text-sm text-gray-900">{lead.leadOwner}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{lead.territory}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEdit(lead.id!)}
                        className="p-1 text-gray-400 hover:text-blue-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(lead.id!)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 size={16} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600">
                        <Phone size={16} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-purple-600">
                        <Calendar size={16} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {leadsData && leadsData.totalPages > 1 && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-700">
            Showing {leadsData.number * leadsData.size + 1} to {Math.min((leadsData.number + 1) * leadsData.size, leadsData.totalElements)} of {leadsData.totalElements} results
          </p>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageNumber(pageNumber - 1)}
              disabled={pageNumber === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageNumber(pageNumber + 1)}
              disabled={pageNumber >= leadsData.totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadManagement;
