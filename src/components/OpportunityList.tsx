import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, Filter, Calendar, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import OpportunityDetailView from './OpportunityDetailView';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

// Define types based on backend DTOs
interface OpportunityItemResponse {
  itemId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
}

interface OpportunityResponse {
  id: number;
  opportunityName: string;
  leadId: number | null;
  customerId: number | null;
  opportunityFrom: 'LEAD' | 'CUSTOMER';
  opportunityType: 'SALES' | 'SUPPORT' | 'MAINTENANCE';
  opportunityStage: 'PROSPECTING' | 'QUALIFICATION' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';
  estimatedValue: number;
  currency: string;
  probabilityOfClosing: number;
  nextContactDate: string;
  nextContactBy: number;
  opportunityOwner: number;
  salesCampaign: number | null;
  items: OpportunityItemResponse[];
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  statusCode: number;
  timestamp: string;
}

interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

interface Opportunity {
  id: string;
  opportunityName: string;
  from: 'LEAD' | 'CUSTOMER';
  type: 'SALES' | 'SUPPORT' | 'MAINTENANCE';
  stage: 'PROSPECTING' | 'QUALIFICATION' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';
  estimatedValue: number;
  currency: string;
  probability: number;
  opportunityOwner: string;
  createdAt: string;
  nextContactDate: string;
  customer: string;
}

const OpportunityList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [opportunityToDelete, setOpportunityToDelete] = useState<Opportunity | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Real data from API
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [owners, setOwners] = useState<string[]>([]);
  const [customers, setCustomers] = useState<string[]>([]);

  const navigate = useNavigate(); // Add this for navigation to edit page

  // Fetch opportunities from API
  const fetchOpportunities = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      // Fix: Use uppercase "DESC" for the direction parameter as Spring's Sort.Direction enum requires
      const response = await fetch(`${apiUrl}/api/v1/opportunities?page=${page}&size=${pageSize}&direction=DESC&sort=createdAt`);
      const result: ApiResponse<PageResponse<OpportunityResponse>> = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch opportunities');
      }
      
      if (result.success && result.data && result.data.content) {
        // Transform API response to match our component's data structure
        const transformedOpportunities = result.data.content.map(opp => ({
          id: opp.id.toString(),
          opportunityName: opp.opportunityName,
          from: opp.opportunityFrom,
          type: opp.opportunityType,
          stage: opp.opportunityStage,
          estimatedValue: Number(opp.estimatedValue),
          currency: opp.currency.toString(),
          probability: opp.probabilityOfClosing,
          opportunityOwner: opp.opportunityOwner.toString(), // We'll need to fetch names separately
          createdAt: opp.created_at,
          nextContactDate: opp.nextContactDate,
          customer: opp.customerId ? opp.customerId.toString() : (opp.leadId ? opp.leadId.toString() : 'Unknown')
        }));
        
        setOpportunities(transformedOpportunities);
        setTotalPages(result.data.totalPages);
        setTotalElements(result.data.totalElements);
        
        // Extract unique owners and customers for filters
        const uniqueOwners = [...new Set(transformedOpportunities.map(opp => opp.opportunityOwner))];
        const uniqueCustomers = [...new Set(transformedOpportunities.map(opp => opp.customer))];
        setOwners(uniqueOwners);
        setCustomers(uniqueCustomers);
      }
    } catch (err) {
      console.error('Error fetching opportunities:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast({
        title: "Error",
        description: "Failed to load opportunities. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchOpportunities();
  }, [page, pageSize]);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'PROSPECTING': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'QUALIFICATION': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'PROPOSAL': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'NEGOTIATION': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'CLOSED_WON': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'CLOSED_LOST': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  // Apply filters to opportunities
  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.opportunityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'all' || opp.stage === stageFilter;
    const matchesOwner = ownerFilter === 'all' || opp.opportunityOwner === ownerFilter;
    const matchesCustomer = customerFilter === 'all' || opp.customer === customerFilter;
    
    // Date filtering could be added here
    
    return matchesSearch && matchesStage && matchesOwner && matchesCustomer;
  });

  const handleView = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (id: string) => {
    console.log('Editing opportunity:', id);
    toast({
      title: "Edit Opportunity",
      description: "Redirecting to edit form...",
    });
    // Navigate to edit page with the opportunity ID
    navigate(`/opportunity/edit/${id}`);
  };

  const handleDeleteClick = (opportunity: Opportunity) => {
    setOpportunityToDelete(opportunity);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!opportunityToDelete) return;
    
    setIsDeleting(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/v1/opportunities/${opportunityToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `Failed to delete opportunity: ${response.statusText}`);
      }
      
      // Remove the deleted opportunity from state
      setOpportunities(prev => prev.filter(opp => opp.id !== opportunityToDelete.id));
      
      toast({
        title: "Success",
        description: result.message || "Opportunity successfully deleted",
      });
      
      setIsDeleteDialogOpen(false);
      setOpportunityToDelete(null);
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete opportunity",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Opportunity Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and track your sales opportunities</p>
        </div>
        <Link to="/opportunity/create">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Opportunity
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Stage</label>
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="All Stages" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="PROSPECTING">Prospecting</SelectItem>
                  <SelectItem value="QUALIFICATION">Qualification</SelectItem>
                  <SelectItem value="PROPOSAL">Proposal</SelectItem>
                  <SelectItem value="NEGOTIATION">Negotiation</SelectItem>
                  <SelectItem value="CLOSED_WON">Closed Won</SelectItem>
                  <SelectItem value="CLOSED_LOST">Closed Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Owner</label>
              <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="All Owners" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectItem value="all">All Owners</SelectItem>
                  {owners.map(owner => (
                    <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Customer</label>
              <Select value={customerFilter} onValueChange={setCustomerFilter}>
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="All Customers" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectItem value="all">All Customers</SelectItem>
                  {customers.map(customer => (
                    <SelectItem key={customer} value={customer}>{customer}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600",
                      !dateFrom && !dateTo && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateFrom && dateTo 
                      ? `${format(dateFrom, "MMM dd")} - ${format(dateTo, "MMM dd")}`
                      : "Select dates"
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="range"
                    selected={{ from: dateFrom, to: dateTo }}
                    onSelect={(range) => {
                      setDateFrom(range?.from);
                      setDateTo(range?.to);
                    }}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opportunities Table */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">Loading opportunities...</p>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-red-500">{error}</p>
              <Button 
                onClick={fetchOpportunities} 
                variant="outline" 
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700">
                  <TableHead className="text-gray-700 dark:text-gray-300">Opportunity Name</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">From</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Type</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Stage</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Value</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Probability</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Owner</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Created</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOpportunities.length > 0 ? (
                  filteredOpportunities.map((opportunity) => (
                    <TableRow 
                      key={opportunity.id} 
                      className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <TableCell className="font-medium text-gray-900 dark:text-white">
                        <div>
                          <div>{opportunity.opportunityName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{opportunity.customer}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-gray-700 dark:text-gray-300">
                          {opportunity.from}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-gray-700 dark:text-gray-300">
                          {opportunity.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStageColor(opportunity.stage)}>
                          {opportunity.stage.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-white">
                        {opportunity.estimatedValue.toLocaleString()} {opportunity.currency}
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-white">
                        {opportunity.probability}%
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-white">
                        {opportunity.opportunityOwner}
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-white">
                        {format(new Date(opportunity.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleView(opportunity)}
                            className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEdit(opportunity.id)}
                            className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteClick(opportunity)}
                            className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">No opportunities found matching your criteria.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
        
        {/* Pagination Controls */}
        {!isLoading && !error && totalPages > 0 && (
          <CardFooter className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, totalElements)} of {totalElements} opportunities
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(prev => Math.max(0, prev - 1))}
                disabled={page === 0}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(prev => prev + 1)}
                disabled={page >= totalPages - 1}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      {/* View Dialog - Add DialogTitle for accessibility */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="text-xl font-semibold">
            Opportunity Details
          </DialogTitle>
          {selectedOpportunity && (
            <OpportunityDetailView
              opportunity={selectedOpportunity}
              onClose={() => setIsViewDialogOpen(false)}
              onEdit={handleEdit}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog - already has DialogTitle via DeleteConfirmationDialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Opportunity"
        description="Are you sure you want to delete this opportunity? This will permanently remove all associated data."
        itemName={opportunityToDelete?.opportunityName}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default OpportunityList;
