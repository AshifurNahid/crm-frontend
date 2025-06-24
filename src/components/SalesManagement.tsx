import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Search, Filter, Plus, Eye, Edit, Trash2, Download, FileText, Package, CreditCard } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

const SalesManagement = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mock data for demonstration
  const [mockOrders, setMockOrders] = useState([
    {
      id: 'SO-001',
      customerId: 'CUST-001',
      customerName: 'Acme Corp',
      orderDate: '2024-01-15',
      status: 'Confirmed',
      totalAmount: 15250.00,
      deliveryDate: '2024-01-25'
    },
    {
      id: 'SO-002',
      customerId: 'CUST-002',
      customerName: 'TechStart Inc',
      orderDate: '2024-01-16',
      status: 'Pending',
      totalAmount: 8750.00,
      deliveryDate: '2024-01-30'
    },
    {
      id: 'SO-003',
      customerId: 'CUST-003',
      customerName: 'Global Solutions',
      orderDate: '2024-01-17',
      status: 'Shipped',
      totalAmount: 22100.00,
      deliveryDate: '2024-01-27'
    }
  ]);

  const [mockInvoices, setMockInvoices] = useState([
    {
      id: 'INV-001',
      orderId: 'SO-001',
      invoiceDate: '2024-01-18',
      dueDate: '2024-02-17',
      totalAmount: 15250.00,
      status: 'Sent',
      paymentStatus: 'Unpaid'
    },
    {
      id: 'INV-002',
      orderId: 'SO-003',
      invoiceDate: '2024-01-19',
      dueDate: '2024-02-18',
      totalAmount: 22100.00,
      status: 'Sent',
      paymentStatus: 'Partial'
    }
  ]);

  const [mockDeliveryNotes, setMockDeliveryNotes] = useState([
    {
      id: 'DN-001',
      orderId: 'SO-001',
      deliveryDate: '2024-01-25',
      itemsCount: 5,
      status: 'Delivered'
    },
    {
      id: 'DN-002',
      orderId: 'SO-003',
      deliveryDate: '2024-01-27',
      itemsCount: 8,
      status: 'Shipped'
    }
  ]);

  const [mockPayments, setMockPayments] = useState([
    {
      id: 'PAY-001',
      invoiceId: 'INV-002',
      paymentDate: '2024-01-20',
      method: 'Bank Transfer',
      amount: 11050.00,
      status: 'Completed'
    },
    {
      id: 'PAY-002',
      invoiceId: 'INV-001',
      paymentDate: '2024-01-21',
      method: 'Credit Card',
      amount: 15250.00,
      status: 'Pending'
    }
  ]);

  const getStatusBadge = (status: string, type: 'order' | 'invoice' | 'delivery' | 'payment') => {
    const colorMap: { [key: string]: string } = {
      // Orders
      'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Confirmed': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Shipped': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      // Invoices
      'Draft': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      'Sent': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Paid': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Unpaid': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Partial': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      // Delivery
      'Prepared': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    };
    
    return colorMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleView = (item: any) => {
    setSelectedItem(item);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (item: any) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;
    
    setIsDeleting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Remove item from appropriate array
    switch (activeTab) {
      case 'orders':
        setMockOrders(prev => prev.filter(order => order.id !== selectedItem.id));
        break;
      case 'invoices':
        setMockInvoices(prev => prev.filter(invoice => invoice.id !== selectedItem.id));
        break;
      case 'delivery':
        setMockDeliveryNotes(prev => prev.filter(note => note.id !== selectedItem.id));
        break;
      case 'payments':
        setMockPayments(prev => prev.filter(payment => payment.id !== selectedItem.id));
        break;
    }
    
    toast.success(`${selectedItem.id} deleted successfully`);
    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  const handleSaveEdit = () => {
    if (!selectedItem) return;
    
    toast.success(`${selectedItem.id} updated successfully`);
    setIsEditDialogOpen(false);
    setSelectedItem(null);
  };

  const handleAction = (action: string, item: any) => {
    toast.success(`${action} action performed on ${item.id || item}`);
  };

  const renderViewDialog = () => {
    if (!selectedItem) return null;

    return (
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>View {selectedItem.id}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {activeTab === 'orders' && (
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
            )}
            {activeTab === 'invoices' && (
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
            )}
            {activeTab === 'delivery' && (
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
            )}
            {activeTab === 'payments' && (
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
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const renderEditDialog = () => {
    if (!selectedItem) return null;

    return (
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {selectedItem.id}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {activeTab === 'orders' && (
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
            )}
            {activeTab === 'invoices' && (
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
            )}
            {activeTab === 'delivery' && (
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
            )}
            {activeTab === 'payments' && (
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
            )}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const tabs = [
    { id: 'orders', label: 'Sales Orders', icon: FileText },
    { id: 'invoices', label: 'Sales Invoices', icon: FileText },
    { id: 'delivery', label: 'Delivery Notes', icon: Package },
    { id: 'payments', label: 'Payment Entries', icon: CreditCard }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Orders</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus size={16} />
                    New Order
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Sales Order</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customer">Customer</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select customer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CUST-001">Acme Corp</SelectItem>
                            <SelectItem value="CUST-002">TechStart Inc</SelectItem>
                            <SelectItem value="CUST-003">Global Solutions</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="orderDate">Order Date</Label>
                        <Input type="date" id="orderDate" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="deliveryDate">Delivery Date</Label>
                        <Input type="date" id="deliveryDate" />
                      </div>
                      <div>
                        <Label htmlFor="paymentTerms">Payment Terms</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select terms" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="net30">Net 30</SelectItem>
                            <SelectItem value="net60">Net 60</SelectItem>
                            <SelectItem value="immediate">Immediate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Order Items</Label>
                      <div className="space-y-2 mt-2">
                        <div className="grid grid-cols-4 gap-2 text-sm font-medium">
                          <span>Item</span>
                          <span>Quantity</span>
                          <span>Price</span>
                          <span>Total</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select item" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ITEM-001">Product A</SelectItem>
                              <SelectItem value="ITEM-002">Product B</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input type="number" placeholder="Qty" />
                          <Input type="number" placeholder="Price" />
                          <Input readOnly placeholder="$0.00" />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="font-semibold">Total Order Amount:</span>
                      <span className="text-lg font-bold">$0.00</span>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button onClick={() => handleAction('Create Order', 'New Order')}>Create Order</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download size={16} className="mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{order.orderDate}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(order.status, 'order')}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleView(order)}>
                              <Eye size={16} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(order)}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(order)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        );

      case 'invoices':
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Invoices</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus size={16} />
                    New Invoice
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create New Invoice</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="salesOrder">Sales Order</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select order" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SO-001">SO-001 - Acme Corp</SelectItem>
                          <SelectItem value="SO-002">SO-002 - TechStart Inc</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="invoiceDate">Invoice Date</Label>
                        <Input type="date" id="invoiceDate" />
                      </div>
                      <div>
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input type="date" id="dueDate" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="totalAmount">Total Amount</Label>
                      <Input type="number" id="totalAmount" placeholder="0.00" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="sent">Sent</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="paymentStatus">Payment Status</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Payment status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unpaid">Unpaid</SelectItem>
                            <SelectItem value="partial">Partial</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button onClick={() => handleAction('Create Invoice', 'New Invoice')}>Create Invoice</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Invoice Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.orderId}</TableCell>
                        <TableCell>{invoice.invoiceDate}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>{formatCurrency(invoice.totalAmount)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(invoice.status, 'invoice')}>
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(invoice.paymentStatus, 'invoice')}>
                            {invoice.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleView(invoice)}>
                              <Eye size={16} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(invoice)}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(invoice)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        );

      case 'delivery':
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Delivery Notes</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus size={16} />
                    New Delivery Note
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Delivery Note</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="salesOrder">Sales Order</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select order" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SO-001">SO-001 - Acme Corp</SelectItem>
                          <SelectItem value="SO-002">SO-002 - TechStart Inc</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="deliveryDate">Delivery Date</Label>
                      <Input type="date" id="deliveryDate" />
                    </div>
                    <div>
                      <Label>Items Delivered</Label>
                      <div className="space-y-2 mt-2">
                        <div className="grid grid-cols-3 gap-2 text-sm font-medium">
                          <span>Item Code</span>
                          <span>Quantity</span>
                          <span>Status</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select item" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ITEM-001">ITEM-001</SelectItem>
                              <SelectItem value="ITEM-002">ITEM-002</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input type="number" placeholder="Qty" />
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="prepared">Prepared</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button onClick={() => handleAction('Create Delivery Note', 'New Delivery Note')}>Create Note</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Delivery Note ID</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead>Items Count</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockDeliveryNotes.map((note) => (
                      <TableRow key={note.id}>
                        <TableCell className="font-medium">{note.id}</TableCell>
                        <TableCell>{note.orderId}</TableCell>
                        <TableCell>{note.deliveryDate}</TableCell>
                        <TableCell>{note.itemsCount} items</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(note.status, 'delivery')}>
                            {note.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleView(note)}>
                              <Eye size={16} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(note)}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(note)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Entries</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus size={16} />
                    New Payment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Payment Entry</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="invoiceRef">Invoice/Order Reference</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INV-001">INV-001</SelectItem>
                          <SelectItem value="INV-002">INV-002</SelectItem>
                          <SelectItem value="SO-001">SO-001</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="paymentAmount">Payment Amount</Label>
                        <Input type="number" id="paymentAmount" placeholder="0.00" />
                      </div>
                      <div>
                        <Label htmlFor="paymentDate">Payment Date</Label>
                        <Input type="date" id="paymentDate" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="paymentMethod">Payment Method</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="bank">Bank Transfer</SelectItem>
                            <SelectItem value="credit">Credit Card</SelectItem>
                            <SelectItem value="check">Check</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="paymentStatus">Status</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button onClick={() => handleAction('Create Payment', 'New Payment')}>Create Payment</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Invoice/Order ID</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>{payment.invoiceId}</TableCell>
                        <TableCell>{payment.paymentDate}</TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell>{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(payment.status, 'payment')}>
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleView(payment)}>
                              <Eye size={16} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(payment)}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(payment)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Management</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage sales orders, invoices, deliveries, and payments</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* View Dialog */}
      {renderViewDialog()}

      {/* Edit Dialog */}
      {renderEditDialog()}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedItem(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Item"
        description={`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`}
        itemName={selectedItem?.id}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default SalesManagement;
