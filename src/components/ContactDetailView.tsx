
import React from 'react';
import { X, Mail, Phone, Building, User, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: 'OPEN_TO_CONTACT' | 'REPLIED' | 'PASSIVE';
  address?: string;
  designation?: string;
  department?: string;
  associations: Array<{
    entityType: 'CUSTOMER' | 'SUPPLIER' | 'LEAD' | 'SALES_PARTNER';
    entityId: string;
    isPrimary: boolean;
  }>;
}

interface ContactDetailViewProps {
  contact: Contact;
  onClose: () => void;
  onEdit: (id: string) => void;
}

const ContactDetailView: React.FC<ContactDetailViewProps> = ({ contact, onClose, onEdit }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/contacts/${contact.id}/edit`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Details</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-gray-900 dark:text-white">
              {contact.firstName} {contact.lastName}
            </CardTitle>
            <Badge 
              variant={contact.status === 'OPEN_TO_CONTACT' ? 'default' : 'secondary'}
              className={contact.status === 'OPEN_TO_CONTACT' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
              }
            >
              {contact.status.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">{contact.email}</p>
                </div>
              </div>

              {contact.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="font-medium text-gray-900 dark:text-white">{contact.phone}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {contact.department && (
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                    <p className="font-medium text-gray-900 dark:text-white">{contact.department}</p>
                  </div>
                </div>
              )}

              {contact.designation && (
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Designation</p>
                    <p className="font-medium text-gray-900 dark:text-white">{contact.designation}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {contact.address && (
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
              <p className="font-medium text-gray-900 dark:text-white">{contact.address}</p>
            </div>
          )}

          {contact.associations.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Associations</p>
              <div className="flex flex-wrap gap-2">
                {contact.associations.map((assoc, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {assoc.entityType} {assoc.isPrimary && '(Primary)'}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Contact
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactDetailView;
