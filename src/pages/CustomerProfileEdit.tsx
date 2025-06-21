
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CustomerProfile {
  id: string;
  name: string;
  type: string;
  industry: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  founded: string;
  employees: string;
  revenue: string;
  status: string;
  since: string;
  notes: string;
  // Additional profile fields
  primaryContact: string;
  accountManager: string;
  paymentTerms: string;
  taxId: string;
  companySize: string;
}

const CustomerProfileEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<CustomerProfile>({
    id: '',
    name: '',
    type: '',
    industry: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    founded: '',
    employees: '',
    revenue: '',
    status: 'Active',
    since: '',
    notes: '',
    primaryContact: '',
    accountManager: '',
    paymentTerms: 'Net 30',
    taxId: '',
    companySize: ''
  });

  useEffect(() => {
    if (id) {
      // Simulate API call to fetch customer profile data
      const mockProfile: CustomerProfile = {
        id: id,
        name: 'Acme Corporation',
        type: 'Enterprise',
        industry: 'Technology',
        email: 'contact@acme.com',
        phone: '+1 (555) 123-4567',
        address: '123 Business Ave, Tech City, TC 12345',
        website: 'www.acme.com',
        founded: '2015',
        employees: '500-1000',
        revenue: '$50M - $100M',
        status: 'Active',
        since: '2022-01-15',
        notes: 'Key enterprise client with high growth potential.',
        primaryContact: 'John Smith',
        accountManager: 'Emily Davis',
        paymentTerms: 'Net 30',
        taxId: 'TAX123456789',
        companySize: 'Large Enterprise'
      };
      setProfile(mockProfile);
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Updating customer profile:', profile);
      
      toast({
        title: "Profile Updated",
        description: "Customer profile has been successfully updated.",
      });
      
      navigate('/customer-profile');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update customer profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CustomerProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/customer-profile')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Edit Customer Profile
        </h1>
      </div>

      <Card className="max-w-6xl">
        <CardHeader>
          <CardTitle>Customer Profile Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="business">Business Details</TabsTrigger>
                <TabsTrigger value="account">Account Management</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name *</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Customer Type</Label>
                    <Select value={profile.type} onValueChange={(value) => handleInputChange('type', value)}>
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
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={profile.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={profile.status} onValueChange={(value) => handleInputChange('status', value)}>
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
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={profile.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="since">Customer Since</Label>
                    <Input
                      id="since"
                      type="date"
                      value={profile.since}
                      onChange={(e) => handleInputChange('since', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={profile.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="business" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="founded">Founded Year</Label>
                    <Input
                      id="founded"
                      value={profile.founded}
                      onChange={(e) => handleInputChange('founded', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employees">Number of Employees</Label>
                    <Select value={profile.employees} onValueChange={(value) => handleInputChange('employees', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10</SelectItem>
                        <SelectItem value="11-50">11-50</SelectItem>
                        <SelectItem value="51-200">51-200</SelectItem>
                        <SelectItem value="201-500">201-500</SelectItem>
                        <SelectItem value="501-1000">501-1000</SelectItem>
                        <SelectItem value="1000+">1000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="revenue">Annual Revenue</Label>
                    <Select value={profile.revenue} onValueChange={(value) => handleInputChange('revenue', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<$1M">&lt;$1M</SelectItem>
                        <SelectItem value="$1M - $10M">$1M - $10M</SelectItem>
                        <SelectItem value="$10M - $50M">$10M - $50M</SelectItem>
                        <SelectItem value="$50M - $100M">$50M - $100M</SelectItem>
                        <SelectItem value="$100M+">$100M+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companySize">Company Size</Label>
                    <Select value={profile.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Startup">Startup</SelectItem>
                        <SelectItem value="Small Business">Small Business</SelectItem>
                        <SelectItem value="Medium Enterprise">Medium Enterprise</SelectItem>
                        <SelectItem value="Large Enterprise">Large Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID</Label>
                    <Input
                      id="taxId"
                      value={profile.taxId}
                      onChange={(e) => handleInputChange('taxId', e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="account" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="primaryContact">Primary Contact</Label>
                    <Input
                      id="primaryContact"
                      value={profile.primaryContact}
                      onChange={(e) => handleInputChange('primaryContact', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountManager">Account Manager</Label>
                    <Input
                      id="accountManager"
                      value={profile.accountManager}
                      onChange={(e) => handleInputChange('accountManager', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">Payment Terms</Label>
                    <Select value={profile.paymentTerms} onValueChange={(value) => handleInputChange('paymentTerms', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Net 15">Net 15</SelectItem>
                        <SelectItem value="Net 30">Net 30</SelectItem>
                        <SelectItem value="Net 45">Net 45</SelectItem>
                        <SelectItem value="Net 60">Net 60</SelectItem>
                        <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Account Notes</Label>
                  <Textarea
                    id="notes"
                    value={profile.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={4}
                    placeholder="Enter any important notes about this customer..."
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-3 mt-6">
              <Button type="button" variant="outline" onClick={() => navigate('/customer-profile')}>
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

export default CustomerProfileEdit;
