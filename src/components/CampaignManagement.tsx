import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import CampaignDetailView from './CampaignDetailView';

// --- Backend enums/types ---
export enum CampaignType {
  EMAIL = 'EMAIL',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  TELEMARKETING = 'TELEMARKETING',
  DIRECT_MAIL = 'DIRECT_MAIL',
  EVENT = 'EVENT',
  WEBINAR = 'WEBINAR',
  CONTENT_MARKETING = 'CONTENT_MARKETING',
  PPC_ADVERTISING = 'PPC_ADVERTISING',
  SEO_CAMPAIGN = 'SEO_CAMPAIGN',
  INFLUENCER_MARKETING = 'INFLUENCER_MARKETING',
}

export enum CampaignStatus {
  PLANNED = 'PLANNED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD',
}

const campaignTypes = [
  { id: CampaignType.EMAIL, name: 'Email' },
  { id: CampaignType.SOCIAL_MEDIA, name: 'Social Media' },
  { id: CampaignType.TELEMARKETING, name: 'Telemarketing' },
  { id: CampaignType.DIRECT_MAIL, name: 'Direct Mail' },
  { id: CampaignType.EVENT, name: 'Event' },
  { id: CampaignType.WEBINAR, name: 'Webinar' },
  { id: CampaignType.CONTENT_MARKETING, name: 'Content Marketing' },
  { id: CampaignType.PPC_ADVERTISING, name: 'PPC Advertising' },
  { id: CampaignType.SEO_CAMPAIGN, name: 'SEO Campaign' },
  { id: CampaignType.INFLUENCER_MARKETING, name: 'Influencer Marketing' },
];

const campaignStatuses = [
  { id: CampaignStatus.PLANNED, name: 'Planned' },
  { id: CampaignStatus.ACTIVE, name: 'Active' },
  { id: CampaignStatus.COMPLETED, name: 'Completed' },
  { id: CampaignStatus.CANCELLED, name: 'Cancelled' },
  { id: CampaignStatus.ON_HOLD, name: 'On Hold' },
];

type Territory = {
  id: number;
  territoryName: string;
};

const campaignSchema = z.object({
  campaignName: z.string().min(1, 'Campaign name is required'),
  campaignDescription: z.string().min(1, 'Description is required'),
  campaignType: z.nativeEnum(CampaignType),
  status: z.nativeEnum(CampaignStatus),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date({ required_error: 'End date is required' }),
  territoryId: z.coerce.number().min(1, 'Territory is required'),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

type Campaign = {
  id: number;
  campaignName: string;
  campaignDescription: string;
  campaignType: CampaignType;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  territory: {
    id: number;
    territoryName: string;
  };
};

type ApiResponse<T> = {
  data: T;
  message: string;
};

type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

const CampaignManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all-types');
  const [filterStatus, setFilterStatus] = useState('all-statuses');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [territoriesLoading, setTerritoriesLoading] = useState(false);
  const [territoriesError, setTerritoriesError] = useState<string | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deleteCampaignId, setDeleteCampaignId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      campaignName: '',
      campaignDescription: '',
      campaignType: undefined,
      status: undefined,
      startDate: undefined,
      endDate: undefined,
      territoryId: undefined,
    },
  });

  // When editing, pre-fill the form
  useEffect(() => {
    if (editingCampaign) {
      form.reset({
        campaignName: editingCampaign.campaignName,
        campaignDescription: editingCampaign.campaignDescription,
        campaignType: editingCampaign.campaignType,
        status: editingCampaign.status,
        startDate: new Date(editingCampaign.startDate),
        endDate: new Date(editingCampaign.endDate),
        territoryId: editingCampaign.territory?.id,
      });
      setIsFormOpen(true);
    }
  }, [editingCampaign]);

  // When closing the form, clear editingCampaign
  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCampaign(null);
    form.reset();
  };

  // Fetch campaigns from backend
  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        pageNumber: page.toString(),
        pageSize: pageSize.toString(),
        direction: 'DESC',
        sortField: 'id',
      });
      const res = await fetch(`http://localhost:8080/api/v1/campaigns?${params}`);
      if (!res.ok) throw new Error('Failed to fetch campaigns');
      const json: ApiResponse<Page<Campaign>> = await res.json();
      setCampaigns(json.data.content);
      setTotalPages(json.data.totalPages);
    } catch (e: any) {
      setError(e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch territories from backend
  const fetchTerritories = async () => {
    setTerritoriesLoading(true);
    setTerritoriesError(null);
    try {
      const res = await fetch('http://localhost:8080/api/v1/territories');
      if (!res.ok) throw new Error('Failed to fetch territories');
      const json = await res.json();
      setTerritories(json.data.content);
    } catch (e: any) {
      setTerritoriesError(e.message || 'Unknown error');
    } finally {
      setTerritoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchTerritories();
    // eslint-disable-next-line
  }, [page, pageSize]);

  // Filter campaigns client-side for search/type/status
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.campaignDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all-types' || campaign.campaignType === filterType;
    const matchesStatus = filterStatus === 'all-statuses' || campaign.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Campaign status counts
  const activeCount = filteredCampaigns.filter(c => c.status === CampaignStatus.ACTIVE).length;
  const completedCount = filteredCampaigns.filter(c => c.status === CampaignStatus.COMPLETED).length;
  const cancelledCount = filteredCampaigns.filter(c => c.status === CampaignStatus.CANCELLED).length;

  const onSubmit = async (data: CampaignFormData) => {
    setIsSubmitting(true);
    try {
      let response;
      if (editingCampaign) {
        // Update (PATCH)
        response = await fetch(`http://localhost:8080/api/v1/campaigns/${editingCampaign.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            startDate: data.startDate.toISOString().split('T')[0],
            endDate: data.endDate.toISOString().split('T')[0],
          }),
        });
      } else {
        // Create (POST)
        response = await fetch('http://localhost:8080/api/v1/campaigns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            startDate: data.startDate.toISOString().split('T')[0],
            endDate: data.endDate.toISOString().split('T')[0],
          }),
        });
      }
      if (response.ok) {
        toast({ title: editingCampaign ? 'Campaign updated successfully!' : 'Campaign created successfully!' });
        form.reset();
        setIsFormOpen(false);
        setEditingCampaign(null);
        fetchCampaigns();
      } else {
        throw new Error(editingCampaign ? 'Failed to update campaign' : 'Failed to create campaign');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: editingCampaign ? 'Failed to update campaign. Please try again.' : 'Failed to create campaign. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setIsFormOpen(false);
    setEditingCampaign(null);
  };

  // Delete campaign
  const handleDelete = async () => {
    if (!deleteCampaignId) return;
    try {
      const response = await fetch(`http://localhost:8080/api/v1/campaigns/${deleteCampaignId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast({ title: 'Campaign deleted successfully!' });
        fetchCampaigns();
      } else {
        throw new Error('Failed to delete campaign');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete campaign. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeleteCampaignId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case CampaignStatus.ACTIVE:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case CampaignStatus.COMPLETED:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case CampaignStatus.PLANNED:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case CampaignStatus.CANCELLED:
        return 'bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      case CampaignStatus.ON_HOLD:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case CampaignType.EMAIL:
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      case CampaignType.SOCIAL_MEDIA:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case CampaignType.TELEMARKETING:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case CampaignType.DIRECT_MAIL:
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      case CampaignType.EVENT:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case CampaignType.WEBINAR:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case CampaignType.CONTENT_MARKETING:
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
      case CampaignType.PPC_ADVERTISING:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case CampaignType.SEO_CAMPAIGN:
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
      case CampaignType.INFLUENCER_MARKETING:
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Campaign Status Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusBadgeColor(CampaignStatus.ACTIVE).replace('bg-', 'text-').replace('dark:bg-', 'dark:text-')}`}>{activeCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusBadgeColor(CampaignStatus.COMPLETED).replace('bg-', 'text-').replace('dark:bg-', 'dark:text-')}`}>{completedCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Cancelled Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusBadgeColor(CampaignStatus.CANCELLED).replace('bg-', 'text-').replace('dark:bg-', 'dark:text-')}`}>{cancelledCount}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-2xl font-bold">Campaign List</CardTitle>
            <Dialog open={isFormOpen} onOpenChange={(open) => { setIsFormOpen(open); if (!open) handleFormClose(); }}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {editingCampaign ? 'Edit Campaign' : 'Create Campaign'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="campaignName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Campaign Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter campaign name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="campaignType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Campaign Type *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select campaign type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white dark:bg-gray-800">
                                {campaignTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="campaignDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter campaign description"
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Start Date *</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date("1900-01-01")}
                                  initialFocus
                                  className="pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>End Date *</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date("1900-01-01")}
                                  initialFocus
                                  className="pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white dark:bg-gray-800">
                              {campaignStatuses.map((status) => (
                                <SelectItem key={status.id} value={status.id}>{status.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="territoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Territory *</FormLabel>
                          {territoriesLoading ? (
                            <div className="text-sm text-gray-500">Loading territories...</div>
                          ) : territoriesError ? (
                            <div className="text-sm text-red-500">{territoriesError}</div>
                          ) : (
                            <Select onValueChange={val => field.onChange(Number(val))} value={field.value ? String(field.value) : ''}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select territory" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white dark:bg-gray-800">
                                {territories.map((territory) => (
                                  <SelectItem key={territory.id} value={String(territory.id)}>{territory.territoryName}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (editingCampaign ? 'Updating...' : 'Creating...') : (editingCampaign ? 'Update Campaign' : 'Create Campaign')}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800">
                <SelectItem value="all-types">All Types</SelectItem>
                {campaignTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800">
                <SelectItem value="all-statuses">All Statuses</SelectItem>
                {campaignStatuses.map((status) => (
                  <SelectItem key={status.id} value={status.id}>{status.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {loading ? (
            <div className="text-center py-8">Loading campaigns...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Territory</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{campaign.campaignName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {campaign.campaignDescription}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeColor(campaign.campaignType)}`}>
                          {campaignTypes.find(t => t.id === campaign.campaignType)?.name || campaign.campaignType}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(campaign.status)}`}>
                          {campaignStatuses.find(s => s.id === campaign.status)?.name || campaign.status}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(campaign.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(campaign.endDate).toLocaleDateString()}</TableCell>
                      <TableCell>{campaign.territory?.territoryName || campaign.territory?.id}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => { setSelectedCampaign(campaign); setIsDetailViewOpen(true); }}>
                            View
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingCampaign(campaign)}>
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => { setDeleteCampaignId(campaign.id); setIsDeleteDialogOpen(true); }}>
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredCampaigns.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No campaigns found matching your criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {/* Pagination controls */}
              <div className="flex justify-end items-center gap-2 mt-4">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
                  Previous
                </Button>
                <span>Page {page + 1} of {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => { setIsDeleteDialogOpen(false); setDeleteCampaignId(null); }}
        onConfirm={handleDelete}
        isDeleting={false}
        title="Delete Campaign"
        description="Are you sure you want to delete this campaign? This action cannot be undone."
      />
      {/* Campaign Detail View Dialog */}
      {selectedCampaign && isDetailViewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
            <CampaignDetailView campaign={selectedCampaign} onClose={() => setIsDetailViewOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignManagement;
