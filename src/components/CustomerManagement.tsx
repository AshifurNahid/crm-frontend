
import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Eye, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Customer form schema
const customerSchema = z.object({
  customerName: z.string().min(1, 'Customer Name is required'),
  customerType: z.string().min(1, 'Customer Type is required'),
  customerGroup: z.string().min(1, 'Customer Group is required'),
  territory: z.string().min(1, 'Territory is required'),
  billingCurrency: z.string().min(1, 'Billing Currency is required'),
  priceList: z.string().min(1, 'Price List is required'),
  creditLimit: z.number().min(0, 'Credit limit must be positive'),
  paymentTerms: z.string().min(1, 'Payment Terms is required'),
  salesTeam: z.array(z.string()).min(1, 'At least one sales team member is required'),
  salesPartner: z.string().optional(),
  loyaltyProgram: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

// Mock data for existing customers
const mockCustomers = [
  {
    id: '1',
    name: 'ABC Corporation',
    type: 'Company',
    group: 'Commercial',
    territory: 'North America',
    currency: 'USD',
    creditLimit: 50000,
    status: 'Active',
    lastContact: '2024-01-15',
  },
  {
    id: '2',
    name: 'John Smith',
    type: 'Individual',
    group: 'Retail',
    territory: 'Europe',
    currency: 'EUR',
    creditLimit: 5000,
    status: 'Active',
    lastContact: '2024-01-12',
  },
  {
    id: '3',
    name: 'Tech Solutions Ltd',
    type: 'Company',
    group: 'Enterprise',
    territory: 'Asia Pacific',
    currency: 'USD',
    creditLimit: 100000,
    status: 'Inactive',
    lastContact: '2024-01-08',
  },
  {
    id: '4',
    name: 'Government Agency',
    type: 'Government',
    group: 'Public Sector',
    territory: 'North America',
    currency: 'USD',
    creditLimit: 200000,
    status: 'Active',
    lastContact: '2024-01-18',
  },
];

// Mock dropdown data
const customerTypes = [
  { id: 'Individual', name: 'Individual' },
  { id: 'Company', name: 'Company' },
  { id: 'Government', name: 'Government' },
];

const customerGroups = [
  { id: 'Commercial', name: 'Commercial' },
  { id: 'Enterprise', name: 'Enterprise' },
  { id: 'Government', name: 'Government' },
  { id: 'Retail', name: 'Retail' },
  { id: 'Public Sector', name: 'Public Sector' },
];

const territories = [
  { id: 'North America', name: 'North America' },
  { id: 'Europe', name: 'Europe' },
  { id: 'Asia Pacific', name: 'Asia Pacific' },
  { id: 'Latin America', name: 'Latin America' },
];

const currencies = [
  { id: 'USD', name: 'USD - US Dollar' },
  { id: 'EUR', name: 'EUR - Euro' },
  { id: 'GBP', name: 'GBP - British Pound' },
  { id: 'JPY', name: 'JPY - Japanese Yen' },
];

const priceLists = [
  { id: 'standard', name: 'Standard Price List' },
  { id: 'premium', name: 'Premium Price List' },
  { id: 'wholesale', name: 'Wholesale Price List' },
];

const paymentTermsOptions = [
  { id: '30 Days', name: '30 Days' },
  { id: '60 Days', name: '60 Days' },
  { id: '90 Days', name: '90 Days' },
  { id: 'Cash on Delivery', name: 'Cash on Delivery' },
];

const salesTeamMembers = [
  { id: 'salesperson_id_123', name: 'John Smith' },
  { id: 'salesperson_id_456', name: 'Sarah Johnson' },
  { id: 'salesperson_id_789', name: 'Michael Chen' },
  { id: 'salesperson_id_101', name: 'Lisa Rodriguez' },
];

const salesPartners = [
  { id: 'partner_1', name: 'TechCorp Solutions' },
  { id: 'partner_2', name: 'Global Sales Partners' },
  { id: 'partner_3', name: 'Strategic Alliance Co.' },
];

const loyaltyPrograms = [
  { id: 'gold', name: 'Gold Membership' },
  { id: 'silver', name: 'Silver Membership' },
  { id: 'platinum', name: 'Platinum Elite' },
];

const CustomerManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedSalesTeam, setSelectedSalesTeam] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      creditLimit: 0,
      salesTeam: [],
    }
  });

  // Filter customers based on search and filter criteria
  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.group.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || customer.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleSalesTeamChange = (personId: string, isSelected: boolean) => {
    let newTeam: string[];
    if (isSelected) {
      newTeam = [...selectedSalesTeam, personId];
    } else {
      newTeam = selectedSalesTeam.filter(id => id !== personId);
    }
    setSelectedSalesTeam(newTeam);
    setValue('salesTeam', newTeam);
  };

  const onSubmit = async (data: CustomerFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/v1/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Customer created successfully",
        });
        reset();
        setSelectedSalesTeam([]);
        setIsFormOpen(false);
      } else {
        throw new Error('Failed to create customer');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create customer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    reset();
    setSelectedSalesTeam([]);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Management</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white">Add New Customer</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="customerName" className="text-gray-700 dark:text-gray-300">Customer Name *</Label>
                  <Input
                    id="customerName"
                    {...register('customerName')}
                    placeholder="Enter customer name"
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                  {errors.customerName && (
                    <p className="text-sm text-red-500">{errors.customerName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">Customer Type *</Label>
                  <Select onValueChange={(value) => setValue('customerType', value)}>
                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Select customer type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800">
                      {customerTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.customerType && (
                    <p className="text-sm text-red-500">{errors.customerType.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">Customer Group *</Label>
                  <Select onValueChange={(value) => setValue('customerGroup', value)}>
                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Select customer group" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800">
                      {customerGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.customerGroup && (
                    <p className="text-sm text-red-500">{errors.customerGroup.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">Territory *</Label>
                  <Select onValueChange={(value) => setValue('territory', value)}>
                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Select territory" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800">
                      {territories.map((territory) => (
                        <SelectItem key={territory.id} value={territory.id}>{territory.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.territory && (
                    <p className="text-sm text-red-500">{errors.territory.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">Billing Currency *</Label>
                  <Select onValueChange={(value) => setValue('billingCurrency', value)}>
                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800">
                      {currencies.map((currency) => (
                        <SelectItem key={currency.id} value={currency.id}>{currency.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.billingCurrency && (
                    <p className="text-sm text-red-500">{errors.billingCurrency.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">Price List *</Label>
                  <Select onValueChange={(value) => setValue('priceList', value)}>
                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Select price list" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800">
                      {priceLists.map((priceList) => (
                        <SelectItem key={priceList.id} value={priceList.id}>{priceList.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.priceList && (
                    <p className="text-sm text-red-500">{errors.priceList.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creditLimit" className="text-gray-700 dark:text-gray-300">Credit Limit</Label>
                  <Input
                    id="creditLimit"
                    type="number"
                    min="0"
                    step="0.01"
                    {...register('creditLimit', { valueAsNumber: true })}
                    placeholder="0.00"
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                  {errors.creditLimit && (
                    <p className="text-sm text-red-500">{errors.creditLimit.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">Payment Terms *</Label>
                  <Select onValueChange={(value) => setValue('paymentTerms', value)}>
                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800">
                      {paymentTermsOptions.map((term) => (
                        <SelectItem key={term.id} value={term.id}>{term.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.paymentTerms && (
                    <p className="text-sm text-red-500">{errors.paymentTerms.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">Sales Partner</Label>
                  <Select onValueChange={(value) => setValue('salesPartner', value)}>
                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Select sales partner (optional)" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800">
                      {salesPartners.map((partner) => (
                        <SelectItem key={partner.id} value={partner.id}>{partner.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">Loyalty Program</Label>
                  <Select onValueChange={(value) => setValue('loyaltyProgram', value)}>
                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Select loyalty program (optional)" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800">
                      {loyaltyPrograms.map((program) => (
                        <SelectItem key={program.id} value={program.id}>{program.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-gray-700 dark:text-gray-300">Sales Team * (Select multiple)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {salesTeamMembers.map((person) => (
                    <div key={person.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`sales-${person.id}`}
                        checked={selectedSalesTeam.includes(person.id)}
                        onChange={(e) => handleSalesTeamChange(person.id, e.target.checked)}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <Label htmlFor={`sales-${person.id}`} className="text-sm text-gray-700 dark:text-gray-300">
                        {person.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.salesTeam && (
                  <p className="text-sm text-red-500">{errors.salesTeam.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Customer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search customers by name or group..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800">
              <SelectItem value="all">All Types</SelectItem>
              {customerTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Customer List */}
      <Card className="bg-white dark:bg-[#1f1f1f] border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-900 dark:text-white">Customer Name</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">Type</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">Group</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">Territory</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">Credit Limit</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">Status</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">Last Contact</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="text-gray-900 dark:text-white font-medium">
                      {customer.name}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      <Badge variant="outline" className="dark:border-gray-600">
                        {customer.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {customer.group}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {customer.territory}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {customer.currency} {customer.creditLimit.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={customer.status === 'Active' ? 'default' : 'secondary'}
                        className={customer.status === 'Active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                        }
                      >
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {customer.lastContact}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerManagement;
