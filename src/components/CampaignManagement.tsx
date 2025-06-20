
import React, { useState } from 'react';
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

// Mock data for campaigns
const mockCampaigns = [
  {
    id: 1,
    name: 'Summer Product Launch',
    description: 'Launch campaign for new summer product line',
    type: 'Email',
    status: 'Active',
    startDate: '2024-06-01',
    endDate: '2024-08-31'
  },
  {
    id: 2,
    name: 'Customer Retention Drive',
    description: 'Social media campaign to improve customer retention',
    type: 'Social Media',
    status: 'Planned',
    startDate: '2024-07-15',
    endDate: '2024-09-15'
  },
  {
    id: 3,
    name: 'Trade Show Expo 2024',
    description: 'Annual trade show participation and promotion',
    type: 'Event',
    status: 'Completed',
    startDate: '2024-05-01',
    endDate: '2024-05-03'
  }
];

const campaignTypes = [
  { id: 'Email', name: 'Email' },
  { id: 'Social Media', name: 'Social Media' },
  { id: 'Event', name: 'Event' }
];

const campaignStatuses = [
  { id: 'Active', name: 'Active' },
  { id: 'Completed', name: 'Completed' },
  { id: 'Planned', name: 'Planned' }
];

const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.string().min(1, 'Campaign type is required'),
  status: z.string().min(1, 'Status is required'),
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  endDate: z.date({
    required_error: 'End date is required',
  }),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

const CampaignManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all-types');
  const [filterStatus, setFilterStatus] = useState('all-statuses');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: '',
      description: '',
      type: '',
      status: '',
    },
  });

  const filteredCampaigns = mockCampaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all-types' || campaign.type === filterType;
    const matchesStatus = filterStatus === 'all-statuses' || campaign.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const onSubmit = async (data: CampaignFormData) => {
    setIsSubmitting(true);
    console.log('Campaign form data:', data);
    
    try {
      // Simulate API call to /api/v1/campaigns
      const response = await fetch('/api/v1/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          startDate: data.startDate.toISOString().split('T')[0],
          endDate: data.endDate.toISOString().split('T')[0],
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Campaign created successfully!',
        });
        form.reset();
        setIsFormOpen(false);
      } else {
        throw new Error('Failed to create campaign');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: 'Error',
        description: 'Failed to create campaign. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setIsFormOpen(false);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'Planned':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-2xl font-bold">Campaign List</CardTitle>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Campaign</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
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
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Campaign Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      name="description"
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button type="button" variant="outline" onClick={() => form.reset()}>
                        Reset
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating...' : 'Create Campaign'}
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

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{campaign.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {campaign.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{campaign.type}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(campaign.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(campaign.endDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
                {filteredCampaigns.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No campaigns found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignManagement;
