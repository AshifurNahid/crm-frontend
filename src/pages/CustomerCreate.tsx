
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
import { toast } from '@/hooks/use-toast';

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

const CustomerCreate = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSalesTeam, setSelectedSalesTeam] = useState<string[]>([]);
  
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      creditLimit: 0,
      salesTeam: [],
    }
  });

  const mockCustomerTypes = [
    { id: 'company', name: 'Company' },
    { id: 'individual', name: 'Individual' },
    { id: 'government', name: 'Government' },
    { id: 'non-profit', name: 'Non-Profit' },
  ];

  const mockCustomerGroups = [
    { id: '1', name: 'Enterprise Customers' },
    { id: '2', name: 'Small Business' },
    { id: '3', name: 'Government Clients' },
    { id: '4', name: 'Non-Profit Organizations' },
  ];

  const mockTerritories = [
    { id: '1', name: 'North America' },
    { id: '2', name: 'Europe' },
    { id: '3', name: 'Asia Pacific' },
    { id: '4', name: 'Latin America' },
  ];

  const mockCurrencies = [
    { id: 'USD', name: 'USD - US Dollar' },
    { id: 'EUR', name: 'EUR - Euro' },
    { id: 'GBP', name: 'GBP - British Pound' },
    { id: 'JPY', name: 'JPY - Japanese Yen' },
    { id: 'CAD', name: 'CAD - Canadian Dollar' },
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

  const mockSalespersons = [
    { id: '1', name: 'John Smith' },
    { id: '2', name: 'Sarah Johnson' },
    { id: '3', name: 'Michael Chen' },
    { id: '4', name: 'Lisa Rodriguez' },
    { id: '5', name: 'David Wilson' },
  ];

  const mockPartners = [
    { id: '1', name: 'TechCorp Solutions' },
    { id: '2', name: 'Global Sales Partners' },
    { id: '3', name: 'Regional Distributors Inc.' },
    { id: '4', name: 'Strategic Alliance Co.' },
  ];

  const mockLoyaltyPrograms = [
    { id: '1', name: 'Gold Membership' },
    { id: '2', name: 'Silver Membership' },
    { id: '3', name: 'Platinum Elite' },
    { id: '4', name: 'Corporate Rewards' },
  ];

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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Customer</h1>
        </div>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
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
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                      {mockCustomerTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id} className="text-gray-900 dark:text-white">
                          {type.name}
                        </SelectItem>
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
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                      {mockCustomerGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id} className="text-gray-900 dark:text-white">
                          {group.name}
                        </SelectItem>
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
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                      {mockTerritories.map((territory) => (
                        <SelectItem key={territory.id} value={territory.id} className="text-gray-900 dark:text-white">
                          {territory.name}
                        </SelectItem>
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
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                      {mockCurrencies.map((currency) => (
                        <SelectItem key={currency.id} value={currency.id} className="text-gray-900 dark:text-white">
                          {currency.name}
                        </SelectItem>
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
                  <Label className="text-gray-700 dark:text-gray-300">Sales Partner</Label>
                  <Select onValueChange={(value) => setValue('salesPartner', value)}>
                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Select sales partner (optional)" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                      {mockPartners.map((partner) => (
                        <SelectItem key={partner.id} value={partner.id} className="text-gray-900 dark:text-white">
                          {partner.name}
                        </SelectItem>
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
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                      {mockLoyaltyPrograms.map((program) => (
                        <SelectItem key={program.id} value={program.id} className="text-gray-900 dark:text-white">
                          {program.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-gray-700 dark:text-gray-300">Sales Team * (Select multiple)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {mockSalespersons.map((person) => (
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
                <Link to="/">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Creating...' : 'Create Customer'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerCreate;
