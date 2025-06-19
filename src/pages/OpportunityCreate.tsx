
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Save, Plus, Trash2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const itemSchema = z.object({
  itemName: z.string().min(1, 'Item name is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price must be positive'),
});

const opportunitySchema = z.object({
  opportunityName: z.string().min(1, 'Opportunity name is required'),
  lead: z.string().min(1, 'Lead selection is required'),
  opportunityFrom: z.enum(['LEAD', 'CUSTOMER']),
  opportunityType: z.string().min(1, 'Opportunity type is required'),
  opportunityStage: z.string().min(1, 'Opportunity stage is required'),
  estimatedValue: z.number().min(0, 'Estimated value must be positive'),
  currency: z.string().min(1, 'Currency is required'),
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
  const [items, setItems] = useState([{ itemName: '', quantity: 1, unitPrice: 0 }]);
  const [date, setDate] = useState<Date>();
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      opportunityFrom: 'LEAD',
      probability: 50,
      currency: 'USD',
      items: items,
    }
  });

  const watchedItems = watch('items', items);
  const totalValue = watchedItems?.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) || 0;

  const mockLeads = [
    { id: '1', name: 'Acme Corp Lead' },
    { id: '2', name: 'Tech Solutions Lead' },
    { id: '3', name: 'Global Industries Lead' },
  ];

  const mockSalespersons = [
    { id: '1', name: 'John Smith' },
    { id: '2', name: 'Sarah Johnson' },
    { id: '3', name: 'Michael Chen' },
  ];

  const mockCampaigns = [
    { id: '1', name: 'Q4 Sales Push' },
    { id: '2', name: 'New Product Launch' },
    { id: '3', name: 'Holiday Campaign' },
  ];

  const addItem = () => {
    const newItems = [...items, { itemName: '', quantity: 1, unitPrice: 0 }];
    setItems(newItems);
    setValue('items', newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    setValue('items', newItems);
  };

  const updateItem = (index: number, field: keyof typeof items[0], value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
    setValue('items', newItems);
  };

  const onSubmit = async (data: OpportunityFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/v1/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, totalValue }),
      });
      
      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Success",
          description: `Sales Opportunity created successfully! ID: ${result.id || 'OP-' + Date.now()}`,
        });
      } else {
        throw new Error('Failed to create opportunity');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create opportunity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Sales Opportunity</h1>
        </div>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Opportunity Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
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
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                      {errors.opportunityName && (
                        <p className="text-sm text-red-500">{errors.opportunityName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Lead</Label>
                      <Select onValueChange={(value) => setValue('lead', value)}>
                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                          <SelectValue placeholder="Select lead" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          {mockLeads.map((lead) => (
                            <SelectItem key={lead.id} value={lead.id} className="text-gray-900 dark:text-white">
                              {lead.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.lead && (
                        <p className="text-sm text-red-500">{errors.lead.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Opportunity From</Label>
                      <RadioGroup
                        defaultValue="LEAD"
                        onValueChange={(value) => setValue('opportunityFrom', value as 'LEAD' | 'CUSTOMER')}
                        className="flex space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="LEAD" id="lead" />
                          <Label htmlFor="lead" className="text-gray-700 dark:text-gray-300">Lead</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="CUSTOMER" id="customer" />
                          <Label htmlFor="customer" className="text-gray-700 dark:text-gray-300">Customer</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Opportunity Type</Label>
                      <Select onValueChange={(value) => setValue('opportunityType', value)}>
                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectItem value="SALES" className="text-gray-900 dark:text-white">Sales</SelectItem>
                          <SelectItem value="SUPPORT" className="text-gray-900 dark:text-white">Support</SelectItem>
                          <SelectItem value="UPSELL" className="text-gray-900 dark:text-white">Upsell</SelectItem>
                          <SelectItem value="RENEWAL" className="text-gray-900 dark:text-white">Renewal</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.opportunityType && (
                        <p className="text-sm text-red-500">{errors.opportunityType.message}</p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Opportunity Stage</Label>
                      <Select onValueChange={(value) => setValue('opportunityStage', value)}>
                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectItem value="PROSPECTING" className="text-gray-900 dark:text-white">Prospecting</SelectItem>
                          <SelectItem value="QUALIFICATION" className="text-gray-900 dark:text-white">Qualification</SelectItem>
                          <SelectItem value="PROPOSAL" className="text-gray-900 dark:text-white">Proposal</SelectItem>
                          <SelectItem value="NEGOTIATION" className="text-gray-900 dark:text-white">Negotiation</SelectItem>
                          <SelectItem value="CLOSED_WON" className="text-gray-900 dark:text-white">Closed Won</SelectItem>
                          <SelectItem value="CLOSED_LOST" className="text-gray-900 dark:text-white">Closed Lost</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.opportunityStage && (
                        <p className="text-sm text-red-500">{errors.opportunityStage.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="probability" className="text-gray-700 dark:text-gray-300">Probability of Closing (%)</Label>
                      <Input
                        id="probability"
                        type="number"
                        min="0"
                        max="100"
                        {...register('probability', { valueAsNumber: true })}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                      {errors.probability && (
                        <p className="text-sm text-red-500">{errors.probability.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Next Contact Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={date}
                            onSelect={(date) => {
                              setDate(date);
                              if (date) setValue('nextContactDate', date);
                            }}
                            initialFocus
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
                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                          <SelectValue placeholder="Select salesperson" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          {mockSalespersons.map((person) => (
                            <SelectItem key={person.id} value={person.id} className="text-gray-900 dark:text-white">
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
                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                          <SelectValue placeholder="Select owner" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          {mockSalespersons.map((person) => (
                            <SelectItem key={person.id} value={person.id} className="text-gray-900 dark:text-white">
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
                      <Label className="text-gray-700 dark:text-gray-300">Sales Campaign</Label>
                      <Select onValueChange={(value) => setValue('salesCampaign', value)}>
                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                          <SelectValue placeholder="Select campaign (optional)" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          {mockCampaigns.map((campaign) => (
                            <SelectItem key={campaign.id} value={campaign.id} className="text-gray-900 dark:text-white">
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
                      <Button type="button" onClick={addItem} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                      </Button>
                    </div>

                    {items.map((item, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="space-y-2">
                          <Label className="text-gray-700 dark:text-gray-300">Item Name</Label>
                          <Input
                            value={item.itemName}
                            onChange={(e) => updateItem(index, 'itemName', e.target.value)}
                            placeholder="Enter item name"
                            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-700 dark:text-gray-300">Quantity</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-700 dark:text-gray-300">Unit Price</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            type="button"
                            onClick={() => removeItem(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="estimatedValue" className="text-gray-700 dark:text-gray-300">Estimated Value</Label>
                        <Input
                          id="estimatedValue"
                          type="number"
                          min="0"
                          step="0.01"
                          {...register('estimatedValue', { valueAsNumber: true })}
                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                        />
                        {errors.estimatedValue && (
                          <p className="text-sm text-red-500">{errors.estimatedValue.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-700 dark:text-gray-300">Currency</Label>
                        <Select onValueChange={(value) => setValue('currency', value)} defaultValue="USD">
                          <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                            <SelectItem value="USD" className="text-gray-900 dark:text-white">USD</SelectItem>
                            <SelectItem value="EUR" className="text-gray-900 dark:text-white">EUR</SelectItem>
                            <SelectItem value="GBP" className="text-gray-900 dark:text-white">GBP</SelectItem>
                            <SelectItem value="JPY" className="text-gray-900 dark:text-white">JPY</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.currency && (
                          <p className="text-sm text-red-500">{errors.currency.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-lg font-medium text-gray-900 dark:text-white">
                        Total Value: ${totalValue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-4 pt-6">
                <Link to="/">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Creating...' : 'Create Opportunity'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OpportunityCreate;
