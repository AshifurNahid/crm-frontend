
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: any;
  activeTab: string;
  onSave: () => void;
}

const EditDialog = ({ isOpen, onClose, selectedItem, activeTab, onSave }: EditDialogProps) => {
  if (!selectedItem) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Customer</Label>
                <Input id="customerName" defaultValue={selectedItem.customerName} />
              </div>
              <div>
                <Label htmlFor="orderDate">Order Date</Label>
                <Input type="date" id="orderDate" defaultValue={selectedItem.orderDate} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deliveryDate">Delivery Date</Label>
                <Input type="date" id="deliveryDate" defaultValue={selectedItem.deliveryDate} />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={selectedItem.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="totalAmount">Total Amount</Label>
              <Input type="number" id="totalAmount" defaultValue={selectedItem.totalAmount} />
            </div>
          </>
        );
      case 'invoices':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="orderId">Order ID</Label>
                <Input id="orderId" defaultValue={selectedItem.orderId} readOnly />
              </div>
              <div>
                <Label htmlFor="invoiceDate">Invoice Date</Label>
                <Input type="date" id="invoiceDate" defaultValue={selectedItem.invoiceDate} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input type="date" id="dueDate" defaultValue={selectedItem.dueDate} />
              </div>
              <div>
                <Label htmlFor="totalAmount">Total Amount</Label>
                <Input type="number" id="totalAmount" defaultValue={selectedItem.totalAmount} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={selectedItem.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Sent">Sent</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <Select defaultValue={selectedItem.paymentStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );
      case 'delivery':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="orderId">Order ID</Label>
                <Input id="orderId" defaultValue={selectedItem.orderId} readOnly />
              </div>
              <div>
                <Label htmlFor="deliveryDate">Delivery Date</Label>
                <Input type="date" id="deliveryDate" defaultValue={selectedItem.deliveryDate} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="itemsCount">Items Count</Label>
                <Input type="number" id="itemsCount" defaultValue={selectedItem.itemsCount} />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={selectedItem.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Prepared">Prepared</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );
      case 'payments':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoiceId">Invoice ID</Label>
                <Input id="invoiceId" defaultValue={selectedItem.invoiceId} readOnly />
              </div>
              <div>
                <Label htmlFor="paymentDate">Payment Date</Label>
                <Input type="date" id="paymentDate" defaultValue={selectedItem.paymentDate} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="method">Method</Label>
                <Select defaultValue={selectedItem.method}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input type="number" id="amount" defaultValue={selectedItem.amount} />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select defaultValue={selectedItem.status}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {selectedItem.id}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {renderContent()}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={onSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
