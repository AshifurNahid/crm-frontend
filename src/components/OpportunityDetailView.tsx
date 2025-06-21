import React from 'react';
import { X, DollarSign, Calendar, User, Building, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface Opportunity {
  id: string;
  name: string;
  customer: string;
  value: number;
  stage: string;
  probability: number;
  closeDate: string;
  owner: string;
}

interface OpportunityDetailViewProps {
  opportunity: Opportunity;
  onClose: () => void;
  onEdit: (id: string) => void;
}

const OpportunityDetailView: React.FC<OpportunityDetailViewProps> = ({ opportunity, onClose, onEdit }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/opportunities/${opportunity.id}/edit`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Opportunity Details</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-gray-900 dark:text-white">{opportunity.name}</CardTitle>
            <Badge 
              variant={opportunity.stage === 'Closed Won' ? 'default' : 'secondary'}
              className={opportunity.stage === 'Closed Won' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
              }
            >
              {opportunity.stage}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Customer</p>
                  <p className="font-medium text-gray-900 dark:text-white">{opportunity.customer}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Owner</p>
                  <p className="font-medium text-gray-900 dark:text-white">{opportunity.owner}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Value</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${opportunity.value.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Close Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">{opportunity.closeDate}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Probability of Closing</span>
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {opportunity.probability}%
              </span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Opportunity
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OpportunityDetailView;
