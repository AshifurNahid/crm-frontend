
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/hooks/use-toast';

const leadSchema = z.object({
  leadName: z.string().min(1, 'Lead name is required'),
  leadSource: z.string().min(1, 'Lead source is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email is required'),
  leadStatus: z.enum(['New', 'Contacted', 'Qualified', 'Converted']),
  leadOwner: z.string().min(1, 'Lead owner is required'),
  territory: z.string().min(1, 'Territory is required'),
  leadRating: z.number().min(0).max(100),
});

type LeadFormData = z.infer<typeof leadSchema>;

const LeadCreate = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadRating, setLeadRating] = useState([50]);
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      leadRating: 50,
    },
  });

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
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/v1/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, leadRating: leadRating[0] }),
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Lead created successfully",
        });
      } else {
        throw new Error('Failed to create lead');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create lead. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Lead</h1>
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
                  <Select onValueChange={(value) => setValue('leadStatus', value as 'New' | 'Contacted' | 'Qualified' | 'Converted')}>
                    <SelectTrigger className="dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                      <SelectItem value="New" className="dark:text-white">New</SelectItem>
                      <SelectItem value="Contacted" className="dark:text-white">Contacted</SelectItem>
                      <SelectItem value="Qualified" className="dark:text-white">Qualified</SelectItem>
                      <SelectItem value="Converted" className="dark:text-white">Converted</SelectItem>
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
                        <SelectItem key={person.id} value={person.id} className="dark:text-white">
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
                        <SelectItem key={territory.id} value={territory.id} className="dark:text-white">
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
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Creating...' : 'Create Lead'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadCreate;
