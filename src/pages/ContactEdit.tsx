
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type ContactStatus = 'OPEN_TO_CONTACT' | 'REPLIED' | 'PASSIVE';

interface Association {
  entityType: 'CUSTOMER' | 'SUPPLIER' | 'LEAD' | 'SALES_PARTNER';
  entityId: string;
  isPrimary: boolean;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: ContactStatus;
  address?: string;
  designation?: string;
  department?: string;
  associations: Association[];
}

const ContactEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState<Contact>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    status: 'OPEN_TO_CONTACT',
    address: '',
    designation: '',
    department: '',
    associations: []
  });

  useEffect(() => {
    if (id) {
      // Simulate API call to fetch contact data
      const mockContact: Contact = {
        id: id,
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        phone: '+1-555-0123',
        status: 'OPEN_TO_CONTACT',
        address: '123 Main St, New York, NY 10001',
        designation: 'Senior Manager',
        department: 'Sales',
        associations: [
          { entityType: 'CUSTOMER', entityId: 'CUST001', isPrimary: true },
          { entityType: 'LEAD', entityId: 'LEAD123', isPrimary: false }
        ]
      };
      setContact(mockContact);
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Updating contact:', contact);
      
      toast({
        title: "Contact Updated",
        description: "Contact information has been successfully updated.",
      });
      
      navigate('/contacts');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update contact. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Contact, value: any) => {
    setContact(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addAssociation = () => {
    setContact(prev => ({
      ...prev,
      associations: [
        ...prev.associations,
        { entityType: 'CUSTOMER', entityId: '', isPrimary: false }
      ]
    }));
  };

  const removeAssociation = (index: number) => {
    setContact(prev => ({
      ...prev,
      associations: prev.associations.filter((_, i) => i !== index)
    }));
  };

  const updateAssociation = (index: number, field: keyof Association, value: any) => {
    setContact(prev => ({
      ...prev,
      associations: prev.associations.map((assoc, i) => 
        i === index ? { ...assoc, [field]: value } : assoc
      )
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/contacts')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Contacts
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Edit Contact
        </h1>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={contact.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={contact.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={contact.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={contact.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={contact.designation}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={contact.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="status">Status</Label>
                <Select value={contact.status} onValueChange={(value) => handleInputChange('status', value as ContactStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN_TO_CONTACT">Open to Contact</SelectItem>
                    <SelectItem value="REPLIED">Replied</SelectItem>
                    <SelectItem value="PASSIVE">Passive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={contact.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Associations</Label>
                <Button type="button" variant="outline" size="sm" onClick={addAssociation}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Association
                </Button>
              </div>
              
              {contact.associations.map((assoc, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-2">
                      <Label>Entity Type</Label>
                      <Select 
                        value={assoc.entityType} 
                        onValueChange={(value) => updateAssociation(index, 'entityType', value as Association['entityType'])}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CUSTOMER">Customer</SelectItem>
                          <SelectItem value="SUPPLIER">Supplier</SelectItem>
                          <SelectItem value="LEAD">Lead</SelectItem>
                          <SelectItem value="SALES_PARTNER">Sales Partner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Entity ID</Label>
                      <Input
                        value={assoc.entityId}
                        onChange={(e) => updateAssociation(index, 'entityId', e.target.value)}
                        placeholder="Enter ID"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant={assoc.isPrimary ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateAssociation(index, 'isPrimary', !assoc.isPrimary)}
                      >
                        {assoc.isPrimary ? 'Primary' : 'Set Primary'}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAssociation(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => navigate('/contacts')}>
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

export default ContactEdit;
