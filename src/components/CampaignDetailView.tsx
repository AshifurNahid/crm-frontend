import React from 'react';
import { X, Calendar, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { CampaignType, CampaignStatus } from './CampaignManagement';

interface CampaignDetailViewProps {
  campaign: {
    id: number;
    campaignName: string;
    campaignDescription: string;
    campaignType: CampaignType;
    status: CampaignStatus;
    startDate: string;
    endDate: string;
    territory: {
      id: number;
      territoryName: string;
    };
  };
  onClose: () => void;
}

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case CampaignStatus.ACTIVE:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case CampaignStatus.COMPLETED:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case CampaignStatus.PLANNED:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case CampaignStatus.CANCELLED:
      return 'bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    case CampaignStatus.ON_HOLD:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case CampaignType.EMAIL:
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
    case CampaignType.SOCIAL_MEDIA:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case CampaignType.TELEMARKETING:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case CampaignType.DIRECT_MAIL:
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
    case CampaignType.EVENT:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case CampaignType.WEBINAR:
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case CampaignType.CONTENT_MARKETING:
      return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
    case CampaignType.PPC_ADVERTISING:
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    case CampaignType.SEO_CAMPAIGN:
      return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
    case CampaignType.INFLUENCER_MARKETING:
      return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const CampaignDetailView: React.FC<CampaignDetailViewProps> = ({ campaign, onClose }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Campaign Details</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-gray-900 dark:text-white">{campaign.campaignName}</CardTitle>
            <div className="flex gap-2">
              <Badge className={getTypeBadgeColor(campaign.campaignType)}>
                {campaign.campaignType.replace('_', ' ')}
              </Badge>
              <Badge className={getStatusBadgeColor(campaign.status)}>
                {campaign.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-gray-700 dark:text-gray-200 text-base">
            {campaign.campaignDescription}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Territory</p>
                  <p className="font-medium text-gray-900 dark:text-white">{campaign.territory?.territoryName}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Start Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">{format(new Date(campaign.startDate), 'MMM dd, yyyy')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">End Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">{format(new Date(campaign.endDate), 'MMM dd, yyyy')}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignDetailView; 