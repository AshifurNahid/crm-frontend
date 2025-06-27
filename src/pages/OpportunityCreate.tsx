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
import { Slider } from '@/components/ui/slider';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const itemSchema = z.object({
  itemId: z.string().optional(),
  itemName: z.string().min(1, 'Item name is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price must be positive'),
  quantityOnHand: z.number().optional(),
});

const opportunitySchema = z.object({
  opportunityName: z.string().min(1, 'Opportunity name is required'),
  lead: z.string().min(1, 'Lead selection is required'),
  opportunityFrom: z.enum(['LEAD', 'CUSTOMER']),
  opportunityType: z.enum(['SALES', 'SUPPORT', 'MAINTENANCE']),
  opportunityStage: z.string().min(1, 'Opportunity stage is required'),
  estimatedValue: z.number().min(0, 'Estimated value must be positive'),
  currency: z.string().min(1, 'Currency is required'),
  probability: z.number().min(0).max(100),
  nextContactDate: z.date(),
  nextContactBy: z.string().min(1, 'Next contact by is required'),
  opportunityOwner: z.string().min(1, 'Opportunity owner is required'),
  salesCampaign: z.string().optional(),
  source: z.string().optional(),
  items: z.array(itemSchema).min(1, 'At least one item is required'),
});

type OpportunityFormData = z.infer<typeof opportunitySchema>;

const OpportunityCreate = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState([{ itemId: '', itemName: '', quantity: 1, unitPrice: 0 }]);
  const [date, setDate] = useState<Date>();
  const [probability, setProbability] = useState([50]);
  const [leads, setLeads] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [salesPersons, setSalesPersons] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [availableItems, setAvailableItems] = useState<any[]>([]);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      opportunityFrom: 'LEAD',
      opportunityType: 'SALES',
      probability: 50,
      currency: 'USD',
      items: items,
    }
  });

  const watchedItems = watch('items', items);
  const watchedEstimatedValue = watch('estimatedValue', 0);
  const totalValue = watchedItems?.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) || 0;

  // Auto-update estimated value when items change
  React.useEffect(() => {
    if (totalValue !== watchedEstimatedValue) {
      setValue('estimatedValue', totalValue);
    }
  }, [totalValue, watchedEstimatedValue, setValue]);

  React.useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    // Fetch leads
    fetch(`${apiUrl}/api/v1/leads`)
      .then(res => res.json())
      .then(data => {
        if (data?.data?.content) {
          setLeads(data.data.content);
        }
      })
      .catch(err => console.error('Error fetching leads:', err));

    // Fetch customers
    fetch(`${apiUrl}/api/v1/customers`)
      .then(res => res.json())
      .then(data => {
        if (data?.data?.content) {
          setCustomers(data.data.content);
        }
      })
      .catch(err => console.error('Error fetching customers:', err));

    // Fetch sales persons
    fetch(`${apiUrl}/api/v1/sales-person`)
      .then(res => res.json())
      .then(data => {
        if (data?.data?.content) {
          setSalesPersons(data.data.content);
        }
      })
      .catch(err => console.error('Error fetching sales persons:', err));

    // Fetch campaigns
    fetch(`${apiUrl}/api/v1/campaigns`)
      .then(res => res.json())
      .then(data => {
        if (data?.data?.content) {
          setCampaigns(data.data.content);
        }
      })
      .catch(err => console.error('Error fetching campaigns:', err));

    // Fetch items for dropdown
    fetch(`${apiUrl}/api/v1/items`)
      .then(res => res.json())
      .then(data => {
        if (data?.data?.content) {
          setAvailableItems(data.data.content);
        }
      })
      .catch(err => console.error('Error fetching items:', err));
  }, []);

  const addItem = () => {
    const newItems = [...items, { itemId: '', itemName: '', quantity: 1, unitPrice: 0 }];
    setItems(newItems);
    setValue('items', newItems);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      setValue('items', newItems);
    }
  };

  const updateItem = (index: number, field: keyof typeof items[0], value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
    setValue('items', newItems);
  };

  // Update the handleItemSelect function to be more robust
  const handleItemSelect = (index: number, selectedItemId: string) => {
    const foundItem = availableItems.find(it => it.id.toString() === selectedItemId);
    if (!foundItem) return;
    
    // Log for debugging
    console.log('Selected item:', foundItem);
    
    // Update all relevant fields at once to ensure consistency
    const newItems = [...items];
    newItems[index] = { 
      ...newItems[index],
      itemId: foundItem.id.toString(),
      itemName: foundItem.itemName,
      unitPrice: Number(foundItem.price) || 0
    };
    setItems(newItems);
    setValue('items', newItems);
  };

  // Modify the form selection for leads/customers to ensure it matches the DTO
  const handleOpportunityFromChange = (value: 'LEAD' | 'CUSTOMER') => {
    setValue('opportunityFrom', value);
    // Reset the lead selection when changing type
    setValue('lead', '');
  };

  const onSubmit = async (data: OpportunityFormData) => {
    setIsSubmitting(true);
    
    // Add validation to ensure date is selected
    if (!date) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a next contact date",
      });
      setIsSubmitting(false);
      return;
    }
    
    // Extract the ID from the lead/customer selection (e.g., "lead-123" -> 123)
    let leadId = null;
    let customerId = null;
    
    if (data.opportunityFrom === 'LEAD' && data.lead) {
      const leadMatch = data.lead.match(/lead-(\d+)/);
      if (leadMatch && leadMatch[1]) {
        leadId = Number(leadMatch[1]);
      }
    } else if (data.opportunityFrom === 'CUSTOMER' && data.lead) {
      const customerMatch = data.lead.match(/customer-(\d+)/);
      if (customerMatch && customerMatch[1]) {
        customerId = Number(customerMatch[1]);
      }
    }
    
    // Format data to match OpportunityRequestDto structure exactly as expected by Spring Boot
    const opportunityRequestDto = {
      opportunityName: data.opportunityName,
      leadId: leadId,
      customerId: customerId,
      opportunityFrom: data.opportunityFrom,
      opportunityType: data.opportunityType,
      opportunityStage: data.opportunityStage,
      estimatedValue: data.estimatedValue,
      currency: data.currency,
      probabilityOfClosing: data.probability, 
      nextContactDate: format(date, 'yyyy-MM-dd'),
      nextContactBy: Number(data.nextContactBy.replace(/^nextContact-/, '')),
      opportunityOwner: Number(data.opportunityOwner.replace(/^owner-/, '')),
      salesCampaign: data.salesCampaign ? Number(data.salesCampaign) : null,
      source: data.source || null,
      items: data.items.map(item => ({
        itemId: Number(item.itemId), // Send itemId instead of itemName
        quantity: item.quantity
        // unitPrice is not needed in the DTO
      }))
    };
    
    // Log for debugging
    console.log('Extracted IDs:', { leadId, customerId });
    console.log('Submitting opportunity:', opportunityRequestDto);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/v1/opportunities`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(opportunityRequestDto),
        credentials: 'include'
      });
      
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      let result;
      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error('Error parsing response:', e);
        throw new Error('Invalid response from server');
      }
      
      if (!response.ok) {
        throw new Error(result.message || `Server error: ${response.status}`);
      }
      
      toast({
        title: "Success",
        description: result.message || "Opportunity created successfully!",
      });
      
      // Clear form after successful submission
      setItems([{ itemId: '', itemName: '', quantity: 1, unitPrice: 0 }]);
      setDate(undefined);
      setProbability([50]);
      
    } catch (error) {
      console.error('Error creating opportunity:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create opportunity. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Opportunities
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Sales Opportunity</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="details">Details & Timeline</TabsTrigger>
              <TabsTrigger value="items">Items & Pricing</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-6">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="opportunityName" className="text-gray-700 dark:text-gray-300">Opportunity Name *</Label>
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
                      <Label className="text-gray-700 dark:text-gray-300">Opportunity From *</Label>
                      <RadioGroup
                        defaultValue="LEAD"
                        onValueChange={(value) => handleOpportunityFromChange(value as 'LEAD' | 'CUSTOMER')}
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
                      <Label className="text-gray-700 dark:text-gray-300">Lead/Customer *</Label>
                      <Select onValueChange={(value) => setValue('lead', value)}>
                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                          <SelectValue placeholder="Select lead or customer" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          {
                            leads.map((lead) => (
                              <SelectItem
                                key={`lead-${lead.id}`}
                                value={`lead-${lead.id}`}
                                className="text-gray-900 dark:text-white"
                              >
                                {lead.leadName} ({lead.leadSource})
                              </SelectItem>
                            ))
                          }
                          {
                            customers.map((customer) => (
                              <SelectItem
                                key={`customer-${customer.id}`}
                                value={`customer-${customer.id}`}
                                className="text-gray-900 dark:text-white"
                              >
                                {customer.name} ({customer.customerType})
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      {errors.lead && (
                        <p className="text-sm text-red-500">{errors.lead.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Opportunity Type *</Label>
                      <Select onValueChange={(value) => setValue('opportunityType', value as 'SALES' | 'SUPPORT' | 'MAINTENANCE')}>
                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectItem value="SALES" className="text-gray-900 dark:text-white">Sales</SelectItem>
                          <SelectItem value="SUPPORT" className="text-gray-900 dark:text-white">Support</SelectItem>
                          <SelectItem value="MAINTENANCE" className="text-gray-900 dark:text-white">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.opportunityType && (
                        <p className="text-sm text-red-500">{errors.opportunityType.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Details & Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Opportunity Stage *</Label>
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
                      <Label className="text-gray-700 dark:text-gray-300">Probability of Closing (%)</Label>
                      <div className="space-y-3">
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
                        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                          {probability[0]}%
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Next Contact Date *</Label>
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
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.nextContactDate && (
                        <p className="text-sm text-red-500">{errors.nextContactDate.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Next Contact By *</Label>
                      <Select onValueChange={(value) => setValue('nextContactBy', value)}>
                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                          <SelectValue placeholder="Select salesperson" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          {salesPersons.map((person) => (
                            <SelectItem
                              key={`nextContact-${person.id}`}
                              value={`nextContact-${person.id}`}
                              className="text-gray-900 dark:text-white"
                            >
                              {person.firstName} {person.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.nextContactBy && (
                        <p className="text-sm text-red-500">{errors.nextContactBy.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Opportunity Owner *</Label>
                      <Select onValueChange={(value) => setValue('opportunityOwner', value)}>
                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                          <SelectValue placeholder="Select owner" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          {salesPersons.map((person) => (
                            <SelectItem
                              key={`owner-${person.id}`}
                              value={`owner-${person.id}`}
                              className="text-gray-900 dark:text-white"
                            >
                              {person.firstName} {person.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.opportunityOwner && (
                        <p className="text-sm text-red-500">{errors.opportunityOwner.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Currency *</Label>
                      <Select onValueChange={(value) => setValue('currency', value)} defaultValue="USD">
                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectItem key="currency-USD" value="USD" className="text-gray-900 dark:text-white">USD - US Dollar</SelectItem>
                          <SelectItem key="currency-EUR" value="EUR" className="text-gray-900 dark:text-white">EUR - Euro</SelectItem>
                          <SelectItem key="currency-GBP" value="GBP" className="text-gray-900 dark:text-white">GBP - British Pound</SelectItem>
                          <SelectItem key="currency-JPY" value="JPY" className="text-gray-900 dark:text-white">JPY - Japanese Yen</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.currency && (
                        <p className="text-sm text-red-500">{errors.currency.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="items" className="space-y-6">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-gray-900 dark:text-white">Items & Pricing</CardTitle>
                    <Button type="button" onClick={addItem} variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-gray-700 dark:text-gray-300">Item Name *</Label>
                        <Select
                          value={item.itemId}
                          onValueChange={(value) => handleItemSelect(index, value)}
                        >
                          <SelectTrigger
                            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                          >
                            <SelectValue placeholder="Select or type item">
                              {item.itemName || "Select item"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                            {availableItems.map((available) => (
                              <SelectItem
                                key={available.id}
                                value={available.id.toString()}
                                className="text-gray-900 dark:text-white"
                              >
                                {available.itemName} (${available.price})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                     
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 dark:text-gray-300">Quantity *</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 dark:text-gray-300">Unit Price *</Label>
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
                          disabled={items.length === 1}
                          className="text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Display the selected item's available stock */}
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Available: {availableItems.find(a => a.id.toString() === item.itemId)?.quantityOnHand ?? '--'}
                      </div>
                    </div>
                  ))}

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-gray-900 dark:text-white">
                        Total Estimated Value:
                      </span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ${totalValue.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedValue" className="text-gray-700 dark:text-gray-300">Manual Estimated Value Override</Label>
                    <Input
                      id="estimatedValue"
                      type="number"
                      min="0"
                      step="0.01"
                      {...register('estimatedValue', { valueAsNumber: true })}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      placeholder="Leave blank to use calculated total"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      This will override the calculated total from items above
                    </p>
                    {errors.estimatedValue && (
                      <p className="text-sm text-red-500">{errors.estimatedValue.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Advanced Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Sales Campaign</Label>
                      <Select onValueChange={(value) => setValue('salesCampaign', value)}>
                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                          <SelectValue placeholder="Select campaign (optional)" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          {campaigns.map((campaign) => (
                            <SelectItem
                              key={`campaign-${campaign.id}`}
                              value={campaign.id.toString()}
                              className="text-gray-900 dark:text-white"
                            >
                              {campaign.campaignName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="source" className="text-gray-700 dark:text-gray-300">Source</Label>
                      <Select onValueChange={(value) => setValue('source', value)}>
                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                          <SelectValue placeholder="Select source (optional)" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectItem key="source-referral" value="referral" className="text-gray-900 dark:text-white">Referral</SelectItem>
                          <SelectItem key="source-website" value="website" className="text-gray-900 dark:text-white">Website</SelectItem>
                          <SelectItem key="source-event" value="event" className="text-gray-900 dark:text-white">Event</SelectItem>
                          <SelectItem key="source-cold_call" value="cold_call" className="text-gray-900 dark:text-white">Cold Call</SelectItem>
                          <SelectItem key="source-marketing" value="marketing" className="text-gray-900 dark:text-white">Marketing Campaign</SelectItem>
                          <SelectItem key="source-social_media" value="social_media" className="text-gray-900 dark:text-white">Social Media</SelectItem>
                          <SelectItem key="source-partner" value="partner" className="text-gray-900 dark:text-white">Partner</SelectItem>
                          <SelectItem key="source-other" value="other" className="text-gray-900 dark:text-white">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Fixed Bottom Actions */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 -mx-8 mt-8">
            <div className="max-w-5xl mx-auto flex justify-end space-x-4">
              <Link to="/">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Creating...' : 'Create Opportunity'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OpportunityCreate;
