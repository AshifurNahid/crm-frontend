
import React from 'react';
import { X, MapPin, User, Building, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface Territory {
  id: string;
  name: string;
  manager: string;
  region: string;
  status: string;
  customersCount: number;
}

interface TerritoryDetailViewProps {
  territory: Territory;
  onClose: () => void;
  onEdit: (id: string) => void;
}

const TerritoryDetailView: React.FC<TerritoryDetailViewProps> = ({ territory, onClose, onEdit }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    // Navigate to territory edit page - using territory create page as edit placeholder
    navigate(`/territory/create?edit=${territory.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Territory Details</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-gray-900 dark:text-white">{territory.name}</CardTitle>
            <Badge 
              variant={territory.status === 'Active' ? 'default' : 'secondary'}
              className={territory.status === 'Active' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
              }
            >
              {territory.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Region</p>
                  <p className="font-medium text-gray-900 dark:text-white">{territory.region}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Territory Manager</p>
                  <p className="font-medium text-gray-900 dark:text-white">{territory.manager}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Customers</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {territory.customersCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Territory
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TerritoryDetailView;
