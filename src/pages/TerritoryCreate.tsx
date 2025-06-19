
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const territorySchema = z.object({
  territoryName: z.string().min(1, 'Territory name is required'),
  territoryManager: z.string().min(1, 'Territory manager is required'),
  region: z.string().min(1, 'Region is required'),
  territoryStatus: z.enum(['Active', 'Inactive']),
});

type TerritoryFormData = z.infer<typeof territorySchema>;

const TerritoryCreate = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<TerritoryFormData>({
    resolver: zodResolver(territorySchema),
  });

  const mockSalespersons = [
    { id: '1', name: 'John Smith' },
    { id: '2', name: 'Sarah Johnson' },
    { id: '3', name: 'Michael Chen' },
    { id: '4', name: 'Lisa Rodriguez' },
  ];

  const onSubmit = async (data: TerritoryFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/v1/territories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Territory created successfully",
        });
      } else {
        throw new Error('Failed to create territory');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create territory. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Territory</h1>
        </div>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Territory Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="territoryName" className="text-gray-700 dark:text-gray-300">Territory Name</Label>
                  <Input
                    id="territoryName"
                    {...register('territoryName')}
                    placeholder="Enter territory name"
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                  {errors.territoryName && (
                    <p className="text-sm text-red-500">{errors.territoryName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">Territory Manager</Label>
                  <Select onValueChange={(value) => setValue('territoryManager', value)}>
                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Select territory manager" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                      {mockSalespersons.map((person) => (
                        <SelectItem key={person.id} value={person.id} className="text-gray-900 dark:text-white">
                          {person.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.territoryManager && (
                    <p className="text-sm text-red-500">{errors.territoryManager.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region" className="text-gray-700 dark:text-gray-300">Region</Label>
                  <Input
                    id="region"
                    {...register('region')}
                    placeholder="Enter region"
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                  {errors.region && (
                    <p className="text-sm text-red-500">{errors.region.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">Territory Status</Label>
                  <Select onValueChange={(value) => setValue('territoryStatus', value as 'Active' | 'Inactive')}>
                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                      <SelectItem value="Active" className="text-gray-900 dark:text-white">Active</SelectItem>
                      <SelectItem value="Inactive" className="text-gray-900 dark:text-white">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.territoryStatus && (
                    <p className="text-sm text-red-500">{errors.territoryStatus.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Link to="/">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Creating...' : 'Create Territory'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TerritoryCreate;
