
import React from 'react';
import { X, Mail, Phone, MapPin, Building, User, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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

interface ContactDetailViewProps {
  contact: Contact;
  onClose: () => void;
  onEdit: (id: string) => void;
}

const ContactDetailView: React.FC<ContactDetailViewProps> = ({ contact, onClose, onEdit }) => {
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
            <Badge className={getStatusBadgeVariant(contact.status)}>
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

              {contact.address && (
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                    <p className="font-medium text-gray-900 dark:text-white">{contact.address}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {contact.designation && (
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Designation</p>
                    <p className="font-medium text-gray-900 dark:text-white">{contact.designation}</p>
                  </div>
                </div>
              )}

              {contact.department && (
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                    <p className="font-medium text-gray-900 dark:text-white">{contact.department}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {contact.associations.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Associations</h3>
                <div className="space-y-2">
                  {contact.associations.map((assoc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <Badge variant="outline" className="text-xs mr-2">
                          {assoc.entityType}
                        </Badge>
                        <span className="text-sm text-gray-600 dark:text-gray-300">ID: {assoc.entityId}</span>
                      </div>
                      {assoc.isPrimary && (
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          Primary
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={() => onEdit(contact.id)}>
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
