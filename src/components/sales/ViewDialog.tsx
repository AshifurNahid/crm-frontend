
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { getStatusBadge, formatCurrency } from './utils';

interface ViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: any;
  activeTab: string;
}

const ViewDialog = ({ isOpen, onClose, selectedItem, activeTab }: ViewDialogProps) => {
  if (!selectedItem) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Order ID</Label>
                <p className="font-medium">{selectedItem.id}</p>
              </div>
              <div>
                <Label>Customer</Label>
                <p className="font-medium">{selectedItem.customerName}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Order Date</Label>
                <p className="font-medium">{selectedItem.orderDate}</p>
              </div>
              <div>
                <Label>Delivery Date</Label>
                <p className="font-medium">{selectedItem.deliveryDate}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Badge className={getStatusBadge(selectedItem.status, 'order')}>
                  {selectedItem.status}
                </Badge>
              </div>
              <div>
                <Label>Total Amount</Label>
                <p className="font-medium text-lg">{formatCurrency(selectedItem.totalAmount)}</p>
              </div>
            </div>
          </>
        );
      case 'invoices':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Invoice ID</Label>
                <p className="font-medium">{selectedItem.id}</p>
              </div>
              <div>
                <Label>Order ID</Label>
                <p className="font-medium">{selectedItem.orderId}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Invoice Date</Label>
                <p className="font-medium">{selectedItem.invoiceDate}</p>
              </div>
              <div>
                <Label>Due Date</Label>
                <p className="font-medium">{selectedItem.dueDate}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Badge className={getStatusBadge(selectedItem.status, 'invoice')}>
                  {selectedItem.status}
                </Badge>
              </div>
              <div>
                <Label>Payment Status</Label>
                <Badge className={getStatusBadge(selectedItem.paymentStatus, 'invoice')}>
                  {selectedItem.paymentStatus}
                </Badge>
              </div>
            </div>
            <div>
              <Label>Total Amount</Label>
              <p className="font-medium text-lg">{formatCurrency(selectedItem.totalAmount)}</p>
            </div>
          </>
        );
      case 'delivery':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Delivery Note ID</Label>
                <p className="font-medium">{selectedItem.id}</p>
              </div>
              <div>
                <Label>Order ID</Label>
                <p className="font-medium">{selectedItem.orderId}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Delivery Date</Label>
                <p className="font-medium">{selectedItem.deliveryDate}</p>
              </div>
              <div>
                <Label>Items Count</Label>
                <p className="font-medium">{selectedItem.itemsCount} items</p>
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Badge className={getStatusBadge(selectedItem.status, 'delivery')}>
                {selectedItem.status}
              </Badge>
            </div>
          </>
        );
      case 'payments':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Payment ID</Label>
                <p className="font-medium">{selectedItem.id}</p>
              </div>
              <div>
                <Label>Invoice ID</Label>
                <p className="font-medium">{selectedItem.invoiceId}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Payment Date</Label>
                <p className="font-medium">{selectedItem.paymentDate}</p>
              </div>
              <div>
                <Label>Method</Label>
                <p className="font-medium">{selectedItem.method}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Amount</Label>
                <p className="font-medium text-lg">{formatCurrency(selectedItem.amount)}</p>
              </div>
              <div>
                <Label>Status</Label>
                <Badge className={getStatusBadge(selectedItem.status, 'payment')}>
                  {selectedItem.status}
                </Badge>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>View {selectedItem.id}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDialog;
