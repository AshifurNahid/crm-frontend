
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Plus, Trash2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const itemSchema = z.object({
  itemName: z.string().min(1, 'Item name is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price must be positive'),
});

const opportunitySchema = z.object({
  opportunityName: z.string().min(1, 'Opportunity name is required'),
  leadId: z.string().min(1, 'Lead is required'),
  opportunityFrom: z.enum(['LEAD', 'CUSTOMER']),
  opportunityType: z.enum(['SALES', 'SUPPORT', 'RENEWAL']),
  opportunityStage: z.enum(['PROSPECTING', 'QUALIFICATION', 'NEGOTIATION', 'CLOSING', 'WON', 'LOST']),
  estimatedValue: z.number().min(0, 'Estimated value must be positive'),
  currency: z.enum(['USD', 'EUR', 'GBP', 'CAD']),
  probability: z.number().min(0).max(100),
  nextContactDate: z.date(),
  nextContactBy: z.string().min(1, 'Next contact by is required'),
  opportunityOwner: z.string().min(1, 'Opportunity owner is required'),
  salesCampaign: z.string().optional(),
  items: z.array(itemSchema).min(1, 'At least one item is required'),
});

type OpportunityFormData = z.infer<typeof opportunitySchema>;

const OpportunityCreate = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [probability, setProbability] = useState([50]);
  const [nextContactDate, setNextContactDate] = useState<Date | undefined>();
  
  const { register, handleSubmit, setValue, control, watch, formState: { errors } } = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      probability: 50,
      items: [{ itemName: '', quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');
  const totalValue = watchedItems?.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) || 0;

  const mockLeads = [
    { id: '1', name: 'Acme Corp Lead' },
    { id: '2', name: 'TechStart Inquiry' },
    { id: '3', name: 'Global Solutions Contact' },
  ];

  const mockSalespersons = [
    { id: '1', name: 'John Smith' },
    { id: '2', name: 'Sarah Johnson' },
    { id: '3', name: 'Michael Chen' },
    { id: '4', name: 'Lisa Rodriguez' },
  ];

  const mockCampaigns = [
    { id: '1', name: 'Q1 Sales Drive' },
    { id: '2', name: 'Enterprise Outreach' },
    { id: '3', name: 'Holiday Special' },
  ];

  const onSubmit = async (data: OpportunityFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/v1/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          probability: probability[0],
          nextContactDate: nextContactDate,
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Success",
          description: `Opportunity created successfully with ID: ${result.id || 'Generated'}`,
        });
      } else {
        throw new Error('Failed to create opportunity');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create opportunity. Please check all required fields.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Sales Opportunity</h1>
        </div>

        <Card className="bg-white dark:bg-[#1f1f1f] border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Opportunity Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Tabs defaultValue="basic" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="details">Details & Scheduling</TabsTrigger>
                  <TabsTrigger value="items">Items & Pricing</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="opportunityName" className="text-gray-700 dark:text-gray-300">Opportunity Name</Label>
                      <Input
                        id="opportunityName"
                        {...register('opportunityName')}
                        placeholder="Enter opportunity name"
                        className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                      {errors.opportunityName && (
                        <p className="text-sm text-red-500">{errors.opportunityName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Lead</Label>
                      <Select onValueChange={(value) => setValue('leadId', value)}>
                        <SelectTrigger className="dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                          <SelectValue placeholder="Select lead" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                          {mockLeads.map((lead) => (
                            <SelectItem key={lead.id} value={lead.id} className="dark:text-white">
                              {lead.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.leadId && (
                        <p className="text-sm text-red-500">{errors.leadId.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Opportunity From</Label>
                      <Select onValueChange={(value) => setValue('opportunityFrom', value as 'LEAD' | 'CUSTOMER')}>
                        <SelectTrigger className="dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                          <SelectItem value="LEAD" className="dark:text-white">Lead</SelectItem>
                          <SelectItem value="CUSTOMER" className="dark:text-white">Customer</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.opportunityFrom && (
                        <p className="text-sm text-red-500">{errors.opportunityFrom.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Opportunity Type</Label>
                      <Select onValueChange={(value) => setValue('opportunityType', value as 'SALES' | 'SUPPORT' | 'RENEWAL')}>
                        <SelectTrigger className="dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                          <SelectItem value="SALES" className="dark:text-white">Sales</SelectItem>
                          <SelectItem value="SUPPORT" className="dark:text-white">Support</SelectItem>
                          <SelectItem value="RENEWAL" className="dark:text-white">Renewal</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.opportunityType && (
                        <p className="text-sm text-red-500">{errors.opportunityType.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Opportunity Stage</Label>
                      <Select onValueChange={(value) => setValue('opportunityStage', value as any)}>
                        <SelectTrigger className="dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                          <SelectItem value="PROSPECTING" className="dark:text-white">Prospecting</SelectItem>
                          <SelectItem value="QUALIFICATION" className="dark:text-white">Qualification</SelectItem>
                          <SelectItem value="NEGOTIATION" className="dark:text-white">Negotiation</SelectItem>
                          <SelectItem value="CLOSING" className="dark:text-white">Closing</SelectItem>
                          <SelectItem value="WON" className="dark:text-white">Won</SelectItem>
                          <SelectItem value="LOST" className="dark:text-white">Lost</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.opportunityStage && (
                        <p className="text-sm text-red-500">{errors.opportunityStage.message}</p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="estimatedValue" className="text-gray-700 dark:text-gray-300">Estimated Value</Label>
                      <Input
                        id="estimatedValue"
                        type="number"
                        {...register('estimatedValue', { valueAsNumber: true })}
                        placeholder="Enter estimated value"
                        className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                      {errors.estimatedValue && (
                        <p className="text-sm text-red-500">{errors.estimatedValue.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Currency</Label>
                      <Select onValueChange={(value) => setValue('currency', value as 'USD' | 'EUR' | 'GBP' | 'CAD')}>
                        <SelectTrigger className="dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                          <SelectItem value="USD" className="dark:text-white">USD</SelectItem>
                          <SelectItem value="EUR" className="dark:text-white">EUR</SelectItem>
                          <SelectItem value="GBP" className="dark:text-white">GBP</SelectItem>
                          <SelectItem value="CAD" className="dark:text-white">CAD</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.currency && (
                        <p className="text-sm text-red-500">{errors.currency.message}</p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Label className="text-gray-700 dark:text-gray-300">Probability of Closing: {probability[0]}%</Label>
                      <Slider
                        value={probability}
                        onValueChange={(value) => {
                          setProbability(value);
                          setValue('probability', value[0]);
                        }}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Next Contact Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {nextContactDate ? format(nextContactDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 dark:bg-gray-800 dark:border-gray-600">
                          <CalendarComponent
                            mode="single"
                            selected={nextContactDate}
                            onSelect={(date) => {
                              setNextContactDate(date);
                              if (date) setValue('nextContactDate', date);
                            }}
                            initialFocus
                            className="pointer-events-auto dark:text-white"
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.nextContactDate && (
                        <p className="text-sm text-red-500">{errors.nextContactDate.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Next Contact By</Label>
                      <Select onValueChange={(value) => setValue('nextContactBy', value)}>
                        <SelectTrigger className="dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                          <SelectValue placeholder="Select person" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                          {mockSalespersons.map((person) => (
                            <SelectItem key={person.id} value={person.id} className="dark:text-white">
                              {person.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.nextContactBy && (
                        <p className="text-sm text-red-500">{errors.nextContactBy.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Opportunity Owner</Label>
                      <Select onValueChange={(value) => setValue('opportunityOwner', value)}>
                        <SelectTrigger className="dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                          <SelectValue placeholder="Select owner" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                          {mockSalespersons.map((person) => (
                            <SelectItem key={person.id} value={person.id} className="dark:text-white">
                              {person.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.opportunityOwner && (
                        <p className="text-sm text-red-500">{errors.opportunityOwner.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Sales Campaign (Optional)</Label>
                      <Select onValueChange={(value) => setValue('salesCampaign', value)}>
                        <SelectTrigger className="dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                          <SelectValue placeholder="Select campaign" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                          {mockCampaigns.map((campaign) => (
                            <SelectItem key={campaign.id} value={campaign.id} className="dark:text-white">
                              {campaign.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="items" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Items List</h3>
                      <Button
                        type="button"
                        onClick={() => append({ itemName: '', quantity: 1, unitPrice: 0 })}
                        variant="outline"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                      </Button>
                    </div>

                    {fields.map((field, index) => (
                      <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="space-y-2">
                          <Label className="text-gray-700 dark:text-gray-300">Item Name</Label>
                          <Input
                            {...register(`items.${index}.itemName`)}
                            placeholder="Enter item name"
                            className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                          />
                          {errors.items?.[index]?.itemName && (
                            <p className="text-sm text-red-500">{errors.items[index]?.itemName?.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-700 dark:text-gray-300">Quantity</Label>
                          <Input
                            type="number"
                            {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                            min="1"
                            className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                          />
                          {errors.items?.[index]?.quantity && (
                            <p className="text-sm text-red-500">{errors.items[index]?.quantity?.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-700 dark:text-gray-300">Unit Price</Label>
                          <Input
                            type="number"
                            step="0.01"
                            {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                            min="0"
                            className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                          />
                          {errors.items?.[index]?.unitPrice && (
                            <p className="text-sm text-red-500">{errors.items[index]?.unitPrice?.message}</p>
                          )}
                        </div>

                        <div className="flex items-end">
                          <Button
                            type="button"
                            onClick={() => remove(index)}
                            variant="outline"
                            size="sm"
                            disabled={fields.length === 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        Total Value: ${totalValue.toFixed(2)}
                      </p>
                    </div>

                    {errors.items && (
                      <p className="text-sm text-red-500">At least one item is required</p>
                    )}
                  </div>
                </TabsContent>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Link to="/">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Creating...' : 'Create Opportunity'}
                  </Button>
                </div>
              </Tabs>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OpportunityCreate;
