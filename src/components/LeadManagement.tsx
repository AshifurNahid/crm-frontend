import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Mail, Phone, Calendar, User, ArrowLeft, Save, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const LeadManagement = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [salespersons, setSalespersons] = useState([]);
  const [territories, setTerritories] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    leadName: '',
    leadSource: 'WEBSITE',
    contactInfo: {
      phone: '',
      email: ''
    },
    leadStatus: 'NEW',
    leadOwner: '',
    territory: '',
    leadRating: 50
  });

  // Add proper typing for formErrors
  interface LeadFormErrors {
    leadName?: string;
    email?: string;
    phone?: string;
    leadOwner?: string;
    territory?: string;
    [key: string]: string | undefined; // Allow for other possible error fields
  }

  // Update the state declaration with proper typing
  const [formErrors, setFormErrors] = useState<LeadFormErrors>({});

  // Mock data for dropdowns (replace with actual API calls)
  const mockSalespersons = [
    { id: 1, name: 'John Smith' },
    { id: 2, name: 'Emily Davis' },
    { id: 3, name: 'Mike Johnson' },
    { id: 4, name: 'Sarah Wilson' }
  ];

  const mockTerritories = [
    { id: 1, name: 'North Region' },
    { id: 2, name: 'South Region' },
    { id: 3, name: 'East Coast' },
    { id: 4, name: 'West Coast' }
  ];

  const leadSources = [
    { value: 'WEBSITE', label: 'Website' },
    { value: 'REFERRAL', label: 'Referral' },
    { value: 'SOCIAL_MEDIA', label: 'Social Media' },
    { value: 'EMAIL_CAMPAIGN', label: 'Email Campaign' },  // Changed from EMAIL to EMAIL_CAMPAIGN
    { value: 'COLD_CALL', label: 'Cold Call' },
    { value: 'TRADE_SHOW', label: 'Trade Show' },
    { value: 'ADVERTISEMENT', label: 'Advertisement' }     // Added missing ADVERTISEMENT option
  ];

  const leadStatuses = [
    { value: 'OPEN', label: 'Open' },
    { value: 'CLOSED', label: 'Closed' },
    { value: 'LOST', label: 'Lost' },
    { value: 'QUALIFIED', label: 'Qualified' },
    { value: 'UNQUALIFIED', label: 'Unqualified' },
    { value: 'CONVERTED', label: 'Converted' },
    { value: 'REJECTED', label: 'Rejected' }
  ];

  // Fetch salespersons and territories from backend (adjusted for backend API)
  useEffect(() => {
    const fetchDropdowns = async () => {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      try {
        // Fetch salespersons
        const salesRes = await fetch(`${baseUrl}/api/v1/sales-person?pageNumber=0&pageSize=100`);
        const salesData = await salesRes.json();
        if (salesData.success && salesData.data && Array.isArray(salesData.data.content)) {
          setSalespersons(salesData.data.content);
        } else {
          setSalespersons([]);
        }
        // Fetch territories
        const terrRes = await fetch(`${baseUrl}/api/v1/territories?pageNumber=0&pageSize=100`);
        const terrData = await terrRes.json();
        if (terrData.success && terrData.data && Array.isArray(terrData.data.content)) {
          setTerritories(terrData.data.content);
        } else {
          setTerritories([]);
        }
      } catch (e) {
        setSalespersons([]);
        setTerritories([]);
      }
    };
    fetchDropdowns();
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [currentPage, searchTerm, statusFilter, sourceFilter]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        pageNumber: currentPage.toString(),
        pageSize: '10',
        direction: 'ASC',
        sortField: 'id'
      });

      const response = await fetch(`/api/v1/leads?${params}`);
      if (response.ok) {
        const apiResponse = await response.json();
        setLeads(apiResponse.data.content || []);
        setTotalPages(apiResponse.data.totalPages || 0);
      } else {
        console.error('Failed to fetch leads');
        // Fallback to mock data for demo
        setLeads([
          {
            id: 1,
            leadName: 'Sarah Johnson',
            contactInfo: { email: 'sarah@techstart.com', phone: '+1-555-0123' },
            leadStatus: 'NEW',
            leadSource: 'WEBSITE',
            leadRating: 85,
            leadOwner: { id: 1, name: 'John Smith' },
            territory: { id: 1, name: 'North Region' },
            createdAt: '2024-01-15'
          },
          {
            id: 2,
            leadName: 'Michael Chen',
            contactInfo: { email: 'mchen@globalsol.com', phone: '+1-555-0124' },
            leadStatus: 'QUALIFIED',
            leadSource: 'REFERRAL',
            leadRating: 92,
            leadOwner: { id: 2, name: 'Emily Davis' },
            territory: { id: 2, name: 'South Region' },
            createdAt: '2024-01-14'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  // Replace the current handleInputChange function with this improved version
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const errors: LeadFormErrors = {};
    if (!formData.leadName.trim()) errors.leadName = 'Lead name is required';
    if (!formData.contactInfo.email.trim()) errors.email = 'Email is required';
    if (!formData.contactInfo.phone.trim()) errors.phone = 'Phone is required';
    if (!formData.leadOwner) errors.leadOwner = 'Lead owner is required';
    if (!formData.territory) errors.territory = 'Territory is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Show "Saving..." toast
    toast({
      title: "Saving lead...",
      description: "Please wait while we save your lead information.",
    });

    try {
      const url = editingLead 
        ? `/api/v1/leads/${editingLead.id}`
        : '/api/v1/leads';
      
      const method = editingLead ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          leadOwner: parseInt(formData.leadOwner),
          territory: parseInt(formData.territory)
        }),
      });

      if (response.ok) {
        const apiResponse = await response.json();
        console.log('Success:', apiResponse.message);
        
        // Show success toast with default variant instead of success
        toast({
          title: "Success!",
          description: editingLead ? "Lead updated successfully" : "New lead created successfully",
          // Changed from "success" to "default" to match available variants
          variant: "default", 
        });
        
        setShowAddModal(false);
        setShowEditModal(false);
        setEditingLead(null);
        resetForm();
        fetchLeads();
      } else {
        const errorResponse = await response.json();
        console.error('Error:', errorResponse);
        
        // Show error toast
        toast({
          title: "Error",
          description: errorResponse.message || "Failed to save lead. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Show error toast for exceptions
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setFormData({
      leadName: lead.leadName,
      leadSource: lead.leadSource,
      contactInfo: {
        phone: lead.contactInfo?.phone || '',
        email: lead.contactInfo?.email || ''
      },
      leadStatus: lead.leadStatus,
      leadOwner: lead.leadOwner?.id?.toString() || '',
      territory: lead.territory?.id?.toString() || '',
      leadRating: lead.leadRating || 50
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (lead) => {
    setLeadToDelete(lead);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!leadToDelete) return;

    try {
      const response = await fetch(`/api/v1/leads/${leadToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Lead deleted successfully.",
          variant: "default",
        });
        fetchLeads();
      } else {
        console.error('Failed to delete lead');
        toast({
          title: "Error",
          description: "Failed to delete lead. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteModal(false);
      setLeadToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      leadName: '',
      leadSource: 'WEBSITE',
      contactInfo: {
        phone: '',
        email: ''
      },
      leadStatus: 'NEW',
      leadOwner: '',
      territory: '',
      leadRating: 50
    });
    setFormErrors({});
  };

  const getStatusColor = (status) => {
    const colors = {
      'NEW': 'bg-blue-100 text-blue-800',
      'CONTACTED': 'bg-yellow-100 text-yellow-800',
      'QUALIFIED': 'bg-green-100 text-green-800',
      'CONVERTED': 'bg-purple-100 text-purple-800',
      'DROPPED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatLeadSource = (source) => {
    return leadSources.find(s => s.value === source)?.label || source;
  };

  const formatLeadStatus = (status) => {
    return leadStatuses.find(s => s.value === status)?.label || status;
  };

  // Update the LeadModal component with dark mode support
  const LeadModal = ({ isEdit = false }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
            {isEdit ? 'Edit Lead' : 'Add New Lead'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Lead Name *
                </label>
                <input 
                  type="text" 
                  name="leadName"
                  defaultValue={formData.leadName}
                  onBlur={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                  placeholder="Enter lead name"
                />
                {formErrors.leadName && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.leadName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Lead Source
                </label>
                <select 
                  name="leadSource"
                  value={formData.leadSource}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {leadSources.map(source => (
                    <option key={source.value} value={source.value}>
                      {source.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email *
                </label>
                <input 
                  type="email" 
                  name="contactInfo.email"
                  defaultValue={formData.contactInfo.email}
                  onBlur={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                  placeholder="Enter email address"
                />
                {formErrors.email && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone *
                </label>
                <input 
                  type="tel" 
                  name="contactInfo.phone"
                  defaultValue={formData.contactInfo.phone}
                  onBlur={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                  placeholder="Enter phone number"
                />
                {formErrors.phone && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Lead Status
                </label>
                <select 
                  name="leadStatus"
                  value={formData.leadStatus}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {leadStatuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Lead Owner *
                </label>
                <select
                  name="leadOwner"
                  value={formData.leadOwner}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                  disabled={salespersons.length === 0}
                >
                  <option value="">
                    {salespersons.length === 0 ? 'Loading salespersons...' : 'Select lead owner'}
                  </option>
                  {salespersons.map(person => (
                    <option key={person.id} value={person.id}>
                      {person.firstName} {person.lastName}
                    </option>
                  ))}
                </select>
                {formErrors.leadOwner && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.leadOwner}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Territory *
                </label>
                <select
                  name="territory"
                  value={formData.territory}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                  disabled={territories.length === 0}
                >
                  <option value="">
                    {territories.length === 0 ? 'Loading territories...' : 'Select territory'}
                  </option>
                  {territories.map(territory => (
                    <option key={territory.id} value={territory.id}>
                      {territory.territoryName}
                    </option>
                  ))}
                </select>
                {formErrors.territory && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.territory}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Lead Rating: {formData.leadRating}%
                </label>
                <input
                  type="range"
                  name="leadRating"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.leadRating}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
              <button
                type="button"
                onClick={() => {
                  if (isEdit) {
                    setShowEditModal(false);
                    setEditingLead(null);
                  } else {
                    setShowAddModal(false);
                  }
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Save size={16} />
                <span>{isEdit ? 'Update Lead' : 'Create Lead'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  const getSalespersonName = (id) => {
    const sp = salespersons.find((s) => String(s.id) === String(id));
    return sp ? [sp.firstName, sp.lastName].filter(Boolean).join(' ') : '';
  };

  const getTerritoryName = (id) => {
    const t = territories.find((tt) => String(tt.id) === String(id));
    return t ? t.territoryName : '';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-600 mt-1">Track and manage your sales leads</p>
        </div>
        <button 
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add New Lead</span>
        </button>
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
              {leadStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <select 
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Sources</option>
              {leadSources.map(source => (
                <option key={source.value} value={source.value}>
                  {source.label}
                </option>
              ))}
            </select>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter size={16} />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading leads...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-900 dark:text-gray-200">Lead Info</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900 dark:text-gray-200">Status</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900 dark:text-gray-200">Source</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900 dark:text-gray-200">Rating</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900 dark:text-gray-200">Assigned To</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900 dark:text-gray-200">Territory</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900 dark:text-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{lead.leadName}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <Mail size={14} className="mr-1" />
                            {lead.contactInfo?.email}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <Phone size={14} className="mr-1" />
                            {lead.contactInfo?.phone}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.leadStatus)}`}>
                        {formatLeadStatus(lead.leadStatus)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-900">{formatLeadSource(lead.leadSource)}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${lead.leadRating || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{lead.leadRating || 0}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <User size={12} className="text-white" />
                        </div>
                        <span className="text-sm text-gray-900">{getSalespersonName(lead.leadOwner?.id || lead.leadOwner)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-900">{getTerritoryName(lead.territory?.id || lead.territory)}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEdit(lead)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(lead)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-600" title="Call">
                          <Phone size={16} />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-purple-600" title="Schedule">
                          <Calendar size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage + 1} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage >= totalPages - 1}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && <LeadModal />}
      {showEditModal && <LeadModal isEdit={true} />}

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete the lead <strong>{leadToDelete?.leadName}</strong>? This action cannot be undone.</p>
          <DialogFooter>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadManagement;