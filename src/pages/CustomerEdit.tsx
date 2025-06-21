
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  type: string;
  group: string;
  territory: string;
  currency: string;
  creditLimit: number;
  status: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  notes: string;
}

const CustomerEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState<Customer>({
    id: '',
    name: '',
    type: '',
    group: '',
    territory: '',
    currency: 'USD',
    creditLimit: 0,
    status: 'Active',
    email: '',
    phone: '',
    address: '',
    website: '',
    notes: ''
  });

  useEffect(() => {
    if (id) {
      // Simulate API call to fetch customer data
      const mockCustomer: Customer = {
        id: id,
        name: 'Acme Corporation',
        type: 'Enterprise',
        group: 'VIP',
        territory: 'North America',
        currency: 'USD',
        creditLimit: 50000,
        status: 'Active',
        email: 'contact@acme.com',
        phone: '+1 (555) 123-4567',
        address: '123 Business Ave, Tech City, TC 12345',
        website: 'www.acme.com',
        notes: 'Important enterprise client with high-value contracts.'
      };
      setCustomer(mockCustomer);
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Updating customer:', customer);
      
      toast({
        title: "Customer Updated",
        description: "Customer information has been successfully updated.",
      });
      
      navigate('/customers');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update customer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Customer, value: any) => {
    setCustomer(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/customers')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Customers
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Edit Customer
        </h1>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Customer Name *</Label>
                <Input
                  id="name"
                  value={customer.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Customer Type</Label>
                <Select value={customer.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                    <SelectItem value="SMB">Small & Medium Business</SelectItem>
                    <SelectItem value="Individual">Individual</SelectItem>
                    <SelectItem value="Non-Profit">Non-Profit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="group">Customer Group</Label>
                <Select value={customer.group} onValueChange={(value) => handleInputChange('group', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIP">VIP</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Basic">Basic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="territory">Territory</Label>
                <Input
                  id="territory"
                  value={customer.territory}
                  onChange={(e) => handleInputChange('territory', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={customer.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={customer.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={customer.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="creditLimit">Credit Limit</Label>
                <Input
                  id="creditLimit"
                  type="number"
                  value={customer.creditLimit}
                  onChange={(e) => handleInputChange('creditLimit', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={customer.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={customer.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={customer.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={customer.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => navigate('/customers')}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerEdit;
