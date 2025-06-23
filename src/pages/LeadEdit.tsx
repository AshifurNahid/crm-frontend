
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useLead, useUpdateLead } from '@/hooks/useLeads';

const leadSchema = z.object({
  leadName: z.string().min(1, 'Lead name is required'),
  leadSource: z.string().min(1, 'Lead source is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email is required'),
  leadStatus: z.enum(['New', 'Contacted', 'Qualified', 'Converted', 'Dropped']),
  leadOwner: z.string().min(1, 'Lead owner is required'),
  territory: z.string().min(1, 'Territory is required'),
  leadRating: z.number().min(0).max(100),
});

type LeadFormData = z.infer<typeof leadSchema>;

const LeadEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const leadId = parseInt(id || '0');
  
  const { data: lead, isLoading } = useLead(leadId);
  const updateMutation = useUpdateLead();
  
  const [leadRating, setLeadRating] = useState([50]);
  
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  });

  React.useEffect(() => {
    if (lead) {
      reset({
        leadName: lead.leadName,
        leadSource: lead.leadSource,
        phone: lead.contactInfo.phone,
        email: lead.contactInfo.email,
        leadStatus: lead.leadStatus as any,
        leadOwner: lead.leadOwner,
        territory: lead.territory,
        leadRating: lead.leadRating,
      });
      setLeadRating([lead.leadRating]);
    }
  }, [lead, reset]);

  const leadSources = ['Website', 'Referral', 'Ad Campaign', 'Cold Call', 'Social Media', 'Trade Show'];
  const mockSalespersons = [
    { id: '1', name: 'John Smith' },
    { id: '2', name: 'Sarah Johnson' },
    { id: '3', name: 'Michael Chen' },
    { id: '4', name: 'Lisa Rodriguez' },
  ];
  const mockTerritories = [
    { id: '1', name: 'North Region' },
    { id: '2', name: 'South Region' },
    { id: '3', name: 'East Coast' },
    { id: '4', name: 'West Coast' },
  ];

  const onSubmit = async (data: LeadFormData) => {
    const updatedLead = {
      leadName: data.leadName,
      leadSource: data.leadSource,
      contactInfo: {
        phone: data.phone,
        email: data.email,
      },
      leadStatus: data.leadStatus,
      leadOwner: data.leadOwner,
      territory: data.territory,
      leadRating: leadRating[0],
    };

    updateMutation.mutate({ id: leadId, lead: updatedLead }, {
      onSuccess: () => {
        navigate('/');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading lead...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Lead</h1>
        </div>

        <Card className="bg-white dark:bg-[#1f1f1f] border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Lead Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="leadName" className="text-gray-700 dark:text-gray-300">Lead Name</Label>
                  <Input
                    id="leadName"
                    {...register('leadName')}
                    placeholder="Enter lead name"
                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                  {errors.leadName && (
                    <p className="text-sm text-red-500">{errors.leadName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">Lead Source</Label>
                  <Select onValueChange={(value) => setValue('leadSource', value)}>
                    <SelectTrigger className="dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Select lead source" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                      {leadSources.map((source) => (
                        <SelectItem key={source} value={source} className="dark:text-white">
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.leadSource && (
                    <p className="text-sm text-red-500">{errors.leadSource.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Phone</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="Enter phone number"
                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="Enter email address"
                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">Lead Status</Label>
                  <Select onValueChange={(value) => setValue('leadStatus', value as any)}>
                    <SelectTrigger className="dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                      <SelectItem value="New" className="dark:text-white">New</SelectItem>
                      <SelectItem value="Contacted" className="dark:text-white">Contacted</SelectItem>
                      <SelectItem value="Qualified" className="dark:text-white">Qualified</SelectItem>
                      <SelectItem value="Converted" className="dark:text-white">Converted</SelectItem>
                      <SelectItem value="Dropped" className="dark:text-white">Dropped</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.leadStatus && (
                    <p className="text-sm text-red-500">{errors.leadStatus.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">Lead Owner</Label>
                  <Select onValueChange={(value) => setValue('leadOwner', value)}>
                    <SelectTrigger className="dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Select lead owner" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                      {mockSalespersons.map((person) => (
                        <SelectItem key={person.id} value={person.name} className="dark:text-white">
                          {person.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.leadOwner && (
                    <p className="text-sm text-red-500">{errors.leadOwner.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">Territory</Label>
                  <Select onValueChange={(value) => setValue('territory', value)}>
                    <SelectTrigger className="dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Select territory" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                      {mockTerritories.map((territory) => (
                        <SelectItem key={territory.id} value={territory.name} className="dark:text-white">
                          {territory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.territory && (
                    <p className="text-sm text-red-500">{errors.territory.message}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <Label className="text-gray-700 dark:text-gray-300">Lead Rating: {leadRating[0]}%</Label>
                  <Slider
                    value={leadRating}
                    onValueChange={(value) => {
                      setLeadRating(value);
                      setValue('leadRating', value[0]);
                    }}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Link to="/">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" disabled={updateMutation.isPending}>
                  <Save className="w-4 h-4 mr-2" />
                  {updateMutation.isPending ? 'Updating...' : 'Update Lead'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadEdit;
