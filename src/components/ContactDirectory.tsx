
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import AddContactForm from './AddContactForm';

type ContactStatus = 'OPEN_TO_CONTACT' | 'REPLIED' | 'PASSIVE';

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
  associations: Array<{
    entityType: 'CUSTOMER' | 'SUPPLIER' | 'LEAD' | 'SALES_PARTNER';
    entityId: string;
    isPrimary: boolean;
  }>;
}

const ContactDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);

  // Dummy data
  const mockContacts: Contact[] = [
    {
      id: '1',
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
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@techcorp.com',
      phone: '+1-555-0456',
      status: 'REPLIED',
      address: '456 Tech Avenue, San Francisco, CA 94105',
      designation: 'Technical Director',
      department: 'Engineering',
      associations: [
        { entityType: 'SUPPLIER', entityId: 'SUPP789', isPrimary: true }
      ]
    },
    {
      id: '3',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@innovate.com',
      phone: '+1-555-0789',
      status: 'PASSIVE',
      address: '789 Innovation Blvd, Austin, TX 73301',
      designation: 'Product Manager',
      department: 'Product',
      associations: [
        { entityType: 'CUSTOMER', entityId: 'CUST002', isPrimary: false },
        { entityType: 'SALES_PARTNER', entityId: 'PART456', isPrimary: true }
      ]
    },
    {
      id: '4',
      firstName: 'Emily',
      lastName: 'Rodriguez',
      email: 'emily.rodriguez@global.com',
      phone: '+1-555-0321',
      status: 'OPEN_TO_CONTACT',
      address: '321 Global Street, Miami, FL 33101',
      designation: 'Marketing Specialist',
      department: 'Marketing',
      associations: [
        { entityType: 'LEAD', entityId: 'LEAD456', isPrimary: true }
      ]
    },
    {
      id: '5',
      firstName: 'David',
      lastName: 'Wilson',
      email: 'david.wilson@enterprise.com',
      status: 'REPLIED',
      designation: 'VP Operations',
      department: 'Operations',
      associations: [
        { entityType: 'CUSTOMER', entityId: 'CUST003', isPrimary: true },
        { entityType: 'SUPPLIER', entityId: 'SUPP321', isPrimary: false }
      ]
    }
  ];

  const getStatusBadgeVariant = (status: ContactStatus) => {
    switch (status) {
      case 'OPEN_TO_CONTACT':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'REPLIED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'PASSIVE':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const filteredContacts = mockContacts.filter(contact => {
    const matchesSearch = searchTerm === '' || 
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.department?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || contact.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const uniqueDepartments = Array.from(new Set(mockContacts.map(c => c.department).filter(Boolean)));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Directory</h1>
        <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <AddContactForm onClose={() => setIsAddContactOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Search and Filter Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name, email, designation, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="OPEN_TO_CONTACT">Open to Contact</SelectItem>
                <SelectItem value="REPLIED">Replied</SelectItem>
                <SelectItem value="PASSIVE">Passive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {uniqueDepartments.map(dept => (
                  <SelectItem key={dept} value={dept!}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contact List Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contacts ({filteredContacts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Department & Designation</TableHead>
                  <TableHead>Associations</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">
                      {contact.firstName} {contact.lastName}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{contact.email}</div>
                        {contact.phone && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">{contact.phone}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeVariant(contact.status)}>
                        {contact.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {contact.department && (
                          <div className="text-sm font-medium">{contact.department}</div>
                        )}
                        {contact.designation && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">{contact.designation}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {contact.associations.map((assoc, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline"
                            className="text-xs mr-1"
                          >
                            {assoc.entityType} {assoc.isPrimary && '(Primary)'}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredContacts.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No contacts found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactDirectory;
