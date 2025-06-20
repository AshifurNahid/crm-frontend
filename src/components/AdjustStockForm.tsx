
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

const adjustStockSchema = z.object({
  quantityAdded: z.number(),
  warehouse: z.string().optional(),
});

type AdjustStockFormData = z.infer<typeof adjustStockSchema>;

interface AdjustStockFormProps {
  item: {
    id: string;
    itemCode: string;
    itemName: string;
    quantityOnHand: number;
    warehouse?: string;
  };
  onClose: () => void;
}

const AdjustStockForm = ({ item, onClose }: AdjustStockFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<AdjustStockFormData>({
    resolver: zodResolver(adjustStockSchema),
    defaultValues: {
      quantityAdded: 0,
      warehouse: item.warehouse || '',
    },
  });

  const newQuantity = item.quantityOnHand + (form.watch('quantityAdded') || 0);

  const onSubmit = async (data: AdjustStockFormData) => {
    try {
      console.log('Adjusting stock for item:', item.itemCode, data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: `Stock adjusted successfully! New quantity: ${newQuantity}`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to adjust stock. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Adjust Stock - {item.itemName}</DialogTitle>
      </DialogHeader>
      
      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Item Code:</span> {item.itemCode}
          </div>
          <div>
            <span className="font-medium">Current Quantity:</span> {item.quantityOnHand}
          </div>
          <div>
            <span className="font-medium">New Quantity:</span> 
            <span className={newQuantity < 0 ? 'text-red-600' : 'text-green-600'}>
              {' '}{newQuantity}
            </span>
          </div>
          <div>
            <span className="font-medium">Adjustment:</span>
            <span className={form.watch('quantityAdded') < 0 ? 'text-red-600' : 'text-green-600'}>
              {' '}{form.watch('quantityAdded') >= 0 ? '+' : ''}{form.watch('quantityAdded')}
            </span>
          </div>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="quantityAdded"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity to Add/Remove</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter positive number to add, negative to remove"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="warehouse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Warehouse (Optional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Main Warehouse">Main Warehouse</SelectItem>
                    <SelectItem value="Secondary Warehouse">Secondary Warehouse</SelectItem>
                    <SelectItem value="Distribution Center">Distribution Center</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Adjusting...' : 'Adjust Stock'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default AdjustStockForm;
