
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

// Mock data for salespersons
const mockSalespersons = [
  {
    id: 1,
    name: 'John Smith',
    employeeId: 'EMP001',
    groupNode: true,
    manager: 'Sarah Johnson'
  },
  {
    id: 2,
    name: 'Emily Davis',
    employeeId: 'EMP002',
    groupNode: false,
    manager: 'John Smith'
  },
  {
    id: 3,
    name: 'Michael Brown',
    employeeId: 'EMP003',
    groupNode: false,
    manager: 'Sarah Johnson'
  },
  {
    id: 4,
    name: 'Sarah Johnson',
    employeeId: 'EMP004',
    groupNode: true,
    manager: null
  }
];

// Mock employees data
const mockEmployees = [
  { id: 'EMP005', name: 'Robert Wilson' },
  { id: 'EMP006', name: 'Lisa Anderson' },
  { id: 'EMP007', name: 'David Miller' },
  { id: 'EMP008', name: 'Jennifer Taylor' }
];

const salespersonSchema = z.object({
  name: z.string().min(1, 'Salesperson name is required'),
  employeeId: z.string().min(1, 'Employee ID is required'),
  groupNode: z.boolean().default(false),
  manager: z.string().optional(),
});

type SalespersonFormData = z.infer<typeof salespersonSchema>;

const SalespersonManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<SalespersonFormData>({
    resolver: zodResolver(salespersonSchema),
    defaultValues: {
      name: '',
      employeeId: '',
      groupNode: false,
      manager: '',
    },
  });

  const filteredSalespersons = mockSalespersons.filter(salesperson => {
    const matchesSearch = salesperson.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         salesperson.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (salesperson.manager && salesperson.manager.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const onSubmit = async (data: SalespersonFormData) => {
    setIsSubmitting(true);
    console.log('Salesperson form data:', data);
    
    try {
      // Simulate API call to /api/v1/salespersons
      const response = await fetch('/api/v1/salespersons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Salesperson added successfully!',
        });
        form.reset();
        setIsFormOpen(false);
      } else {
        throw new Error('Failed to add salesperson');
      }
    } catch (error) {
      console.error('Error adding salesperson:', error);
      toast({
        title: 'Error',
        description: 'Failed to add salesperson. Please try again.',
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

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-2xl font-bold">Salesperson Directory</CardTitle>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Salesperson
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New Salesperson</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salesperson Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter salesperson name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="employeeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employee ID *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select employee" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white dark:bg-gray-800">
                              {mockEmployees.map((employee) => (
                                <SelectItem key={employee.id} value={employee.id}>
                                  {employee.id} - {employee.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="groupNode"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Group Node</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Check if this salesperson manages a group
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="manager"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Manager (Optional)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select manager" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white dark:bg-gray-800">
                              <SelectItem value="">No Manager</SelectItem>
                              {mockSalespersons
                                .filter(sp => sp.groupNode)
                                .map((manager) => (
                                  <SelectItem key={manager.id} value={manager.name}>
                                    {manager.name}
                                  </SelectItem>
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
                        {isSubmitting ? 'Adding...' : 'Add Salesperson'}
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
                placeholder="Search by name or manager..."
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
                  <TableHead>Salesperson Name</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Group Node</TableHead>
                  <TableHead>Manager</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSalespersons.map((salesperson) => (
                  <TableRow key={salesperson.id}>
                    <TableCell className="font-medium">{salesperson.name}</TableCell>
                    <TableCell>{salesperson.employeeId}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        salesperson.groupNode 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {salesperson.groupNode ? 'Yes' : 'No'}
                      </span>
                    </TableCell>
                    <TableCell>{salesperson.manager || '—'}</TableCell>
                  </TableRow>
                ))}
                {filteredSalespersons.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No salespersons found matching your criteria.
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

export default SalespersonManagement;
