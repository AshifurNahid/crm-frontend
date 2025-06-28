import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

// API base URL
const API_BASE_URL = 'https://crm-production-747d.up.railway.app/api/v1/sales-person';

// Types matching backend DTOs
interface SalesPersonRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface SalesPersonResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
  timestamp: string;
}

interface Pageable {
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
}

interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

interface Page<T> {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
const salespersonSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
});

type SalespersonFormData = z.infer<typeof salespersonSchema>;

// Sales Target Types
interface SalespersonInfoDto {
  id: number;
  firstName: string;
  email: string;
}

interface SalesTargetRequestDto {
  salespersonId: number;
  targetAmount: string;
  startDate: string;
  endDate: string;
}

interface SalesTargetResponseDto {
  id: number;
  salesperson: SalespersonInfoDto;
  targetAmount: string;
  startDate: string;
  endDate: string;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
}

const salesTargetSchema = z.object({
  salespersonId: z.number().min(1, 'Salesperson is required'),
  targetAmount: z.string().min(1, 'Target amount is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
});

type SalesTargetFormData = z.infer<typeof salesTargetSchema>;

const SalespersonManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [salespersons, setSalespersons] = useState<SalesPersonResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Sales Target states
  const [salesTargets, setSalesTargets] = useState<SalesTargetResponseDto[]>([]);
  const [targetsLoading, setTargetsLoading] = useState(true);
  const [isTargetFormOpen, setIsTargetFormOpen] = useState(false);
  const [isTargetSubmitting, setIsTargetSubmitting] = useState(false);
  const [editingTargetId, setEditingTargetId] = useState<number | null>(null);
  const [targetSearchTerm, setTargetSearchTerm] = useState('');
  
  const { toast } = useToast();

  const form = useForm<SalespersonFormData>({
    resolver: zodResolver(salespersonSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
    },
  });

  const targetForm = useForm<SalesTargetFormData>({
    resolver: zodResolver(salesTargetSchema),
    defaultValues: {
      salespersonId: 0,
      targetAmount: '',
      startDate: '',
      endDate: '',
    },
  });

  // Fetch all salespersons
  const fetchSalespersons = async () => {
    try {
      setLoading(true);
      
      // Try simple GET first
      console.log('Fetching salespersons from:', API_BASE_URL);
      let response = await fetch(API_BASE_URL);
      console.log('Response status:', response.status);
      
      // If simple GET fails, try with default parameters
      if (!response.ok) {
        console.log('Simple GET failed, trying with default parameters...');
        response = await fetch(`${API_BASE_URL}?pageNumber=0&pageSize=10`);
        console.log('Parameterized response status:', response.status);
      }
      
      console.log('Response headers:', response.headers);
      
      if (response.ok) {
        const result: ApiResponse<Page<SalesPersonResponseDto>> = await response.json();
        console.log('API Response:', result);
        setSalespersons(result.data.content);
      } else {
        const errorText = await response.text();
        console.error('Response not ok. Status:', response.status, 'Text:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to fetch salespersons'}`);
      }
    } catch (error) {
      console.error('Error fetching salespersons:', error);
      
      // More specific error messages
      let errorMessage = 'Failed to fetch salespersons. Please try again.';
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Network error: Unable to connect to the server. Please check if the backend is running on localhost:8080.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch all sales targets
  const fetchSalesTargets = async () => {
    try {
      setTargetsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/sales-targets?pageNumber=0&pageSize=100`);
      console.log('Sales targets response status:', response.status);
      
      if (response.ok) {
        const result: ApiResponse<Page<SalesTargetResponseDto>> = await response.json();
        console.log('Sales targets API Response:', result);
        setSalesTargets(result.data.content);
      } else {
        const errorText = await response.text();
        console.error('Sales targets response not ok. Status:', response.status, 'Text:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to fetch sales targets'}`);
      }
    } catch (error) {
      console.error('Error fetching sales targets:', error);
      
      let errorMessage = 'Failed to fetch sales targets. Please try again.';
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Network error: Unable to connect to the server.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setTargetsLoading(false);
    }
  };

  useEffect(() => {
    fetchSalespersons();
  }, []);

  useEffect(() => {
    fetchSalesTargets();
  }, []);

  const filteredSalespersons = salespersons.filter(salesperson => {
    const fullName = `${salesperson.firstName} ${salesperson.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         salesperson.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         salesperson.phoneNumber.includes(searchTerm);
    return matchesSearch;
  });

  const filteredSalesTargets = salesTargets.filter(target => {
    const searchTermLower = targetSearchTerm.toLowerCase();
    const targetAmountStr = String(target.targetAmount);
    
    const matchesSearch = target.salesperson.firstName.toLowerCase().includes(searchTermLower) ||
                         target.salesperson.email.toLowerCase().includes(searchTermLower) ||
                         targetAmountStr.toLowerCase().includes(searchTermLower) ||
                         targetAmountStr.replace(/[^0-9.]/g, '').includes(searchTermLower);
    
    return matchesSearch;
  });

  const onSubmit = async (data: SalespersonFormData) => {
    setIsSubmitting(true);
    
    try {
      const url = editingId ? `${API_BASE_URL}/${editingId}` : API_BASE_URL;
      const method = editingId ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result: ApiResponse<SalesPersonResponseDto> = await response.json();
        toast({
          title: 'Success',
          description: result.message,
        });
        form.reset();
        setIsFormOpen(false);
        setEditingId(null);
        fetchSalespersons(); // Refresh the list
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save salesperson');
      }
    } catch (error) {
      console.error('Error saving salesperson:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save salesperson. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onTargetSubmit = async (data: SalesTargetFormData) => {
    setIsTargetSubmitting(true);
    
    try {
      const url = editingTargetId ? `${API_BASE_URL}/${editingTargetId}/sales-target` : `${API_BASE_URL}/sales-target`;
      const method = editingTargetId ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result: ApiResponse<SalesTargetResponseDto> = await response.json();
        toast({
          title: 'Success',
          description: result.message,
        });
        targetForm.reset();
        setIsTargetFormOpen(false);
        setEditingTargetId(null);
        fetchSalesTargets(); // Refresh the list
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save sales target');
      }
    } catch (error) {
      console.error('Error saving sales target:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save sales target. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsTargetSubmitting(false);
    }
  };

  const handleEdit = (salesperson: SalesPersonResponseDto) => {
    setEditingId(salesperson.id);
    form.reset({
      firstName: salesperson.firstName,
      lastName: salesperson.lastName,
      email: salesperson.email,
      phoneNumber: salesperson.phoneNumber,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this salesperson?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Salesperson deleted successfully!',
        });
        fetchSalespersons(); // Refresh the list
      } else {
        throw new Error('Failed to delete salesperson');
      }
    } catch (error) {
      console.error('Error deleting salesperson:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete salesperson. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleTargetEdit = (target: SalesTargetResponseDto) => {
    setEditingTargetId(target.id);
    targetForm.reset({
      salespersonId: target.salesperson.id,
      targetAmount: target.targetAmount,
      startDate: target.startDate,
      endDate: target.endDate,
    });
    setIsTargetFormOpen(true);
  };

  const handleTargetDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this sales target?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${id}/sales-target`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Sales target deleted successfully!',
        });
        fetchSalesTargets(); // Refresh the list
      } else {
        throw new Error('Failed to delete sales target');
      }
    } catch (error) {
      console.error('Error deleting sales target:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete sales target. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    form.reset();
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleTargetCancel = () => {
    targetForm.reset();
    setIsTargetFormOpen(false);
    setEditingTargetId(null);
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sales Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="salespersons" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="salespersons">Salespersons</TabsTrigger>
              <TabsTrigger value="targets">Sales Targets</TabsTrigger>
            </TabsList>
            
            {/* Salespersons Tab */}
            <TabsContent value="salespersons" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-lg font-semibold">Salesperson Directory</h3>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Salesperson
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>
                        {editingId ? 'Edit Salesperson' : 'Add New Salesperson'}
                      </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter first name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter last name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Enter email address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter phone number" {...field} />
                              </FormControl>
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
                            {isSubmitting ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? 'Update Salesperson' : 'Add Salesperson')}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400">
                          Loading salespersons...
                        </TableCell>
                      </TableRow>
                    ) : filteredSalespersons.length > 0 ? (
                      filteredSalespersons.map((salesperson) => (
                        <TableRow key={salesperson.id}>
                          <TableCell className="font-medium">
                            {salesperson.firstName} {salesperson.lastName}
                          </TableCell>
                          <TableCell>{salesperson.email}</TableCell>
                          <TableCell>{salesperson.phoneNumber}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(salesperson)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(salesperson.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400">
                          {searchTerm ? 'No salespersons found matching your criteria.' : 'No salespersons found.'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Sales Targets Tab */}
            <TabsContent value="targets" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-lg font-semibold">Sales Targets</h3>
                <Dialog open={isTargetFormOpen} onOpenChange={setIsTargetFormOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Sales Target
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>
                        {editingTargetId ? 'Edit Sales Target' : 'Add New Sales Target'}
                      </DialogTitle>
                    </DialogHeader>
                    <Form {...targetForm}>
                      <form onSubmit={targetForm.handleSubmit(onTargetSubmit)} className="space-y-6">
                        <FormField
                          control={targetForm.control}
                          name="salespersonId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Salesperson *</FormLabel>
                              <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value.toString()}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select salesperson" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {salespersons.map((salesperson) => (
                                    <SelectItem key={salesperson.id} value={salesperson.id.toString()}>
                                      {salesperson.firstName} {salesperson.lastName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={targetForm.control}
                          name="targetAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Target Amount *</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" placeholder="Enter target amount" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={targetForm.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date *</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={targetForm.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date *</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end space-x-2 pt-4">
                          <Button type="button" variant="outline" onClick={handleTargetCancel}>
                            Cancel
                          </Button>
                          <Button type="button" variant="outline" onClick={() => targetForm.reset()}>
                            Reset
                          </Button>
                          <Button type="submit" disabled={isTargetSubmitting}>
                            {isTargetSubmitting ? (editingTargetId ? 'Updating...' : 'Adding...') : (editingTargetId ? 'Update Target' : 'Add Target')}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by salesperson name, email, or amount..."
                    value={targetSearchTerm}
                    onChange={(e) => setTargetSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Salesperson</TableHead>
                      <TableHead>Target Amount</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {targetsLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                          Loading sales targets...
                        </TableCell>
                      </TableRow>
                    ) : filteredSalesTargets.length > 0 ? (
                      filteredSalesTargets.map((target) => (
                        <TableRow key={target.id}>
                          <TableCell className="font-medium">
                            {target.salesperson.firstName}
                          </TableCell>
                          <TableCell>${target.targetAmount}</TableCell>
                          <TableCell>{new Date(target.startDate).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(target.endDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleTargetEdit(target)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleTargetDelete(target.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                          {targetSearchTerm ? 'No sales targets found matching your criteria.' : 'No sales targets found.'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalespersonManagement;
