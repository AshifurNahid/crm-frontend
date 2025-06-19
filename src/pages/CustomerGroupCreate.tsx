
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

const customerGroupSchema = z.object({
  customerGroupName: z.string().min(1, 'Customer Group Name is required'),
  parentGroup: z.string().optional(),
  isGroupNode: z.boolean(),
  creditLimit: z.number().min(0, 'Credit limit must be positive'),
  priceList: z.string().min(1, 'Price List is required'),
  paymentTerms: z.string().min(1, 'Payment Terms is required'),
  receivableAccount: z.string().min(1, 'Receivable Account is required'),
  advanceAccount: z.string().min(1, 'Advance Account is required'),
});

type CustomerGroupFormData = z.infer<typeof customerGroupSchema>;

const CustomerGroupCreate = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<CustomerGroupFormData>({
    resolver: zodResolver(customerGroupSchema),
    defaultValues: {
      isGroupNode: false,
      creditLimit: 0,
    }
  });

  const isGroupNode = watch('isGroupNode');

  const mockCustomerGroups = [
    { id: '1', name: 'Enterprise Customers' },
    { id: '2', name: 'Small Business' },
    { id: '3', name: 'Government Clients' },
    { id: '4', name: 'Non-Profit Organizations' },
  ];

  const mockPriceLists = [
    { id: '1', name: 'Standard Price List' },
    { id: '2', name: 'Premium Price List' },
    { id: '3', name: 'Wholesale Price List' },
    { id: '4', name: 'Retail Price List' },
  ];

  const mockPaymentTerms = [
    { id: '1', name: 'Net 30 Days' },
    { id: '2', name: 'Net 60 Days' },
    { id: '3', name: 'Net 90 Days' },
    { id: '4', name: 'Cash on Delivery' },
    { id: '5', name: '2/10 Net 30' },
  ];

  const mockAccounts = [
    { id: '1', name: 'Accounts Receivable - Trade' },
    { id: '2', name: 'Accounts Receivable - Government' },
    { id: '3', name: 'Advances from Customers' },
    { id: '4', name: 'Customer Deposits' },
    { id: '5', name: 'Deferred Revenue' },
  ];

  const onSubmit = async (data: CustomerGroupFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/v1/customer_groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "✅ Customer Group created successfully",
        });
        reset();
      } else {
        throw new Error('Failed to create customer group');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create customer group. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Customer Group</h1>
        </div>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Customer Group Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="customerGroupName" className="text-gray-700 dark:text-gray-300">Customer Group Name *</Label>
                  <Input
                    id="customerGroupName"
                    {...register('customerGroupName')}
                    placeholder="Enter customer group name"
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                  {errors.customerGroupName && (
                    <p className="text-sm text-red-500">{errors.customerGroupName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">Parent Group</Label>
                  <Select onValueChange={(value) => setValue('parentGroup', value)}>
                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Select parent group (optional)" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                      {mockCustomerGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id} className="text-gray-900 dark:text-white">
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isGroupNode"
                      checked={isGroupNode}
                      onCheckedChange={(checked) => setValue('isGroupNode', checked)}
                    />
                    <Label htmlFor="isGroupNode" className="text-gray-700 dark:text-gray-300">Is Group Node</Label>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enable if this group can contain other groups
                  </p>
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
                  <Label className="text-gray-700 dark:text-gray-300">Price List *</Label>
                  <Select onValueChange={(value) => setValue('priceList', value)}>
                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Select price list" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                      {mockPriceLists.map((priceList) => (
                        <SelectItem key={priceList.id} value={priceList.id} className="text-gray-900 dark:text-white">
                          {priceList.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.priceList && (
                    <p className="text-sm text-red-500">{errors.priceList.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">Payment Terms *</Label>
                  <Select onValueChange={(value) => setValue('paymentTerms', value)}>
                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                      {mockPaymentTerms.map((term) => (
                        <SelectItem key={term.id} value={term.id} className="text-gray-900 dark:text-white">
                          {term.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.paymentTerms && (
                    <p className="text-sm text-red-500">{errors.paymentTerms.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">Receivable Account *</Label>
                  <Select onValueChange={(value) => setValue('receivableAccount', value)}>
                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Select receivable account" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                      {mockAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id} className="text-gray-900 dark:text-white">
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.receivableAccount && (
                    <p className="text-sm text-red-500">{errors.receivableAccount.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">Advance Account *</Label>
                  <Select onValueChange={(value) => setValue('advanceAccount', value)}>
                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Select advance account" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                      {mockAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id} className="text-gray-900 dark:text-white">
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.advanceAccount && (
                    <p className="text-sm text-red-500">{errors.advanceAccount.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Link to="/">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Creating...' : 'Create Customer Group'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerGroupCreate;
