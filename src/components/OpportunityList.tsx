
import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, Filter, Calendar, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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

  // Mock data
  const [opportunities] = useState<Opportunity[]>([
    {
      id: '1',
      opportunityName: 'Enterprise CRM Solution',
      from: 'LEAD',
      type: 'SALES',
      stage: 'PROSPECTING',
      estimatedValue: 75000,
      currency: 'USD',
      probability: 25,
      opportunityOwner: 'John Smith',
      createdAt: '2024-01-15',
      nextContactDate: '2024-02-01',
      customer: 'Acme Corp'
    },
    {
      id: '2',
      opportunityName: 'Cloud Migration Project',
      from: 'CUSTOMER',
      type: 'SALES',
      stage: 'NEGOTIATION',
      estimatedValue: 120000,
      currency: 'USD',
      probability: 80,
      opportunityOwner: 'Sarah Johnson',
      createdAt: '2024-01-10',
      nextContactDate: '2024-01-25',
      customer: 'TechStart Inc'
    },
    {
      id: '3',
      opportunityName: 'System Maintenance Contract',
      from: 'CUSTOMER',
      type: 'MAINTENANCE',
      stage: 'PROPOSAL',
      estimatedValue: 45000,
      currency: 'USD',
      probability: 60,
      opportunityOwner: 'Michael Chen',
      createdAt: '2024-01-12',
      nextContactDate: '2024-01-30',
      customer: 'Global Solutions'
    },
    {
      id: '4',
      opportunityName: 'Technical Support Package',
      from: 'LEAD',
      type: 'SUPPORT',
      stage: 'QUALIFICATION',
      estimatedValue: 25000,
      currency: 'EUR',
      probability: 40,
      opportunityOwner: 'Lisa Rodriguez',
      createdAt: '2024-01-08',
      nextContactDate: '2024-02-05',
      customer: 'InnovaCorp'
    },
    {
      id: '5',
      opportunityName: 'Digital Transformation',
      from: 'LEAD',
      type: 'SALES',
      stage: 'CLOSED_WON',
      estimatedValue: 200000,
      currency: 'USD',
      probability: 100,
      opportunityOwner: 'David Kim',
      createdAt: '2024-01-05',
      nextContactDate: '2024-01-20',
      customer: 'MegaCorp'
    }
  ]);

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

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.opportunityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'all' || opp.stage === stageFilter;
    const matchesOwner = ownerFilter === 'all' || opp.opportunityOwner === ownerFilter;
    const matchesCustomer = customerFilter === 'all' || opp.customer === customerFilter;
    
    return matchesSearch && matchesStage && matchesOwner && matchesCustomer;
  });

  const handleDelete = (id: string) => {
    toast({
      title: "Opportunity Deleted",
      description: "The opportunity has been successfully deleted.",
    });
  };

  const uniqueOwners = [...new Set(opportunities.map(opp => opp.opportunityOwner))];
  const uniqueCustomers = [...new Set(opportunities.map(opp => opp.customer))];

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
                  {uniqueOwners.map(owner => (
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
                  {uniqueCustomers.map(customer => (
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
              {filteredOpportunities.map((opportunity) => (
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
                      <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(opportunity.id)}
                        className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredOpportunities.length === 0 && (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No opportunities found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OpportunityList;
