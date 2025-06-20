
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CheckAvailabilityModalProps {
  item: {
    id: string;
    itemCode: string;
    itemName: string;
    quantityOnHand: number;
    status: 'Active' | 'Inactive';
    warehouse?: string;
    price: number;
  };
  onClose: () => void;
}

const CheckAvailabilityModal = ({ item, onClose }: CheckAvailabilityModalProps) => {
  const getStatusBadgeVariant = (status: 'Active' | 'Inactive') => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };

  const getStockLevelColor = (quantity: number) => {
    if (quantity === 0) return 'text-red-600 dark:text-red-400';
    if (quantity < 20) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getAvailabilityStatus = (quantity: number, status: string) => {
    if (status === 'Inactive') return 'Inactive Item';
    if (quantity === 0) return 'Out of Stock';
    if (quantity < 20) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Item Availability</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-lg mb-4">{item.itemName}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Item Code:</span>
                <p className="font-mono">{item.itemCode}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status:</span>
                <div className="mt-1">
                  <Badge className={getStatusBadgeVariant(item.status)}>
                    {item.status}
                  </Badge>
                </div>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Quantity On Hand:</span>
                <p className={`text-2xl font-bold ${getStockLevelColor(item.quantityOnHand)}`}>
                  {item.quantityOnHand}
                </p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Price:</span>
                <p className="text-xl font-semibold">${item.price.toFixed(2)}</p>
              </div>
              
              {item.warehouse && (
                <div className="col-span-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Warehouse:</span>
                  <p>{item.warehouse}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">Availability Status:</span>
              <Badge 
                className={
                  item.status === 'Inactive' || item.quantityOnHand === 0
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    : item.quantityOnHand < 20
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                }
              >
                {getAvailabilityStatus(item.quantityOnHand, item.status)}
              </Badge>
            </div>
            
            {item.quantityOnHand < 20 && item.quantityOnHand > 0 && (
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                ⚠️ Low stock warning: Consider reordering soon
              </p>
            )}
            
            {item.quantityOnHand === 0 && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                ❌ Item is out of stock and unavailable for sale
              </p>
            )}
            
            {item.status === 'Inactive' && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                ❌ Item is marked as inactive
              </p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </>
  );
};

export default CheckAvailabilityModal;
