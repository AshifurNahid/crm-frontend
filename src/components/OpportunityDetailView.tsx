
import React from 'react';
import { X, DollarSign, Calendar, User, Building, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

interface Opportunity {
  id: string;
  opportunityName: string;
  from: 'LEAD' | 'CUSTOMER';
  type: 'SALES' | 'SUPPORT' | 'MAINTENANCE';
  stage: 'PROSPECTING' | 'QUALIFICATION' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';
  estimatedValue: number;
  currency: string;
  probability: number;
  opportunityOwner: string;
  createdAt: string;
  nextContactDate: string;
  customer: string;
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

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'PROSPECTING': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'QUALIFICATION': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'PROPOSAL': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'NEGOTIATION': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'CLOSED_WON': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'CLOSED_LOST': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
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
            <CardTitle className="text-xl text-gray-900 dark:text-white">{opportunity.opportunityName}</CardTitle>
            <Badge className={getStageColor(opportunity.stage)}>
              {opportunity.stage.replace('_', ' ')}
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
                  <p className="font-medium text-gray-900 dark:text-white">{opportunity.opportunityOwner}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Type & Source</p>
                <div className="flex gap-2">
                  <Badge variant="outline">{opportunity.type}</Badge>
                  <Badge variant="outline">{opportunity.from}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Value</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {opportunity.estimatedValue.toLocaleString()} {opportunity.currency}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Next Contact Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {format(new Date(opportunity.nextContactDate), 'MMM dd, yyyy')}
                  </p>
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
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {format(new Date(opportunity.createdAt), 'MMM dd, yyyy')}
            </p>
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
