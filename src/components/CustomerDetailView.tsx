import React from 'react';
import { X, Building, Globe, CreditCard, Calendar, Users, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface Customer {
  id: string;
  name: string;
  type: string;
  group: string;
  territory: string;
  currency: string;
  creditLimit: number;
  status: string;
  lastContact: string;
}

interface CustomerDetailViewProps {
  customer: Customer;
  onClose: () => void;
  onEdit: (id: string) => void;
}

const CustomerDetailView: React.FC<CustomerDetailViewProps> = ({ customer, onClose, onEdit }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/customers/${customer.id}/edit`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Details</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-gray-900 dark:text-white">{customer.name}</CardTitle>
            <Badge 
              variant={customer.status === 'Active' ? 'default' : 'secondary'}
              className={customer.status === 'Active' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
              }
            >
              {customer.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Customer Type</p>
                  <p className="font-medium text-gray-900 dark:text-white">{customer.type}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Customer Group</p>
                  <p className="font-medium text-gray-900 dark:text-white">{customer.group}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Territory</p>
                  <p className="font-medium text-gray-900 dark:text-white">{customer.territory}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Credit Limit</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {customer.currency} {customer.creditLimit.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last Contact</p>
                  <p className="font-medium text-gray-900 dark:text-white">{customer.lastContact}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Customer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDetailView;
