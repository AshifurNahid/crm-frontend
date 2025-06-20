
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const stockTransferSchema = z.object({
  sourceWarehouse: z.string().min(1, 'Source warehouse is required'),
  destinationWarehouse: z.string().min(1, 'Destination warehouse is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
}).refine((data) => data.sourceWarehouse !== data.destinationWarehouse, {
  message: "Source and destination warehouses must be different",
  path: ["destinationWarehouse"],
});

type StockTransferFormData = z.infer<typeof stockTransferSchema>;

interface StockTransferFormProps {
  item: {
    id: string;
    itemCode: string;
    itemName: string;
    quantityOnHand: number;
    warehouse?: string;
  };
  onClose: () => void;
}

const StockTransferForm = ({ item, onClose }: StockTransferFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<StockTransferFormData>({
    resolver: zodResolver(stockTransferSchema),
    defaultValues: {
      sourceWarehouse: item.warehouse || '',
      destinationWarehouse: '',
      quantity: 1,
    },
  });

  const warehouses = [
    'Main Warehouse',
    'Secondary Warehouse',
    'Distribution Center',
    'Regional Hub A',
    'Regional Hub B'
  ];

  const onSubmit = async (data: StockTransferFormData) => {
    try {
      if (data.quantity > item.quantityOnHand) {
        toast({
          title: "Error",
          description: `Cannot transfer ${data.quantity} items. Only ${item.quantityOnHand} available.`,
          variant: "destructive",
        });
        return;
      }

      console.log('Transferring stock:', {
        item: item.itemCode,
        ...data
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: `Successfully transferred ${data.quantity} units from ${data.sourceWarehouse} to ${data.destinationWarehouse}`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to transfer stock. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Stock Transfer - {item.itemName}</DialogTitle>
      </DialogHeader>
      
      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Item Code:</span> {item.itemCode}
          </div>
          <div>
            <span className="font-medium">Available Quantity:</span> {item.quantityOnHand}
          </div>
          <div className="col-span-2">
            <span className="font-medium">Current Location:</span> {item.warehouse || 'Unknown'}
          </div>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="sourceWarehouse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source Warehouse</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source warehouse" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {warehouses.map((warehouse) => (
                      <SelectItem key={warehouse} value={warehouse}>
                        {warehouse}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="destinationWarehouse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination Warehouse</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination warehouse" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {warehouses.map((warehouse) => (
                      <SelectItem key={warehouse} value={warehouse}>
                        {warehouse}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity to Transfer</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1"
                    max={item.quantityOnHand}
                    placeholder="Enter quantity"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
                {form.watch('quantity') > item.quantityOnHand && (
                  <p className="text-sm text-red-600">
                    Quantity exceeds available stock ({item.quantityOnHand})
                  </p>
                )}
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Transferring...' : 'Transfer Stock'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default StockTransferForm;
