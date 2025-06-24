
import React, { useState } from 'react';
import { FileText, Package, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import SalesOrdersTab from './sales/SalesOrdersTab';
import SalesInvoicesTab from './sales/SalesInvoicesTab';
import DeliveryNotesTab from './sales/DeliveryNotesTab';
import PaymentEntriesTab from './sales/PaymentEntriesTab';
import ViewDialog from './sales/ViewDialog';
import EditDialog from './sales/EditDialog';

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
          <SalesOrdersTab
            mockOrders={mockOrders}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAction={handleAction}
          />
        );
      case 'invoices':
        return (
          <SalesInvoicesTab
            mockInvoices={mockInvoices}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAction={handleAction}
          />
        );
      case 'delivery':
        return (
          <DeliveryNotesTab
            mockDeliveryNotes={mockDeliveryNotes}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAction={handleAction}
          />
        );
      case 'payments':
        return (
          <PaymentEntriesTab
            mockPayments={mockPayments}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAction={handleAction}
          />
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

      {/* Dialogs */}
      <ViewDialog
        isOpen={isViewDialogOpen}
        onClose={() => {
          setIsViewDialogOpen(false);
          setSelectedItem(null);
        }}
        selectedItem={selectedItem}
        activeTab={activeTab}
      />

      <EditDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedItem(null);
        }}
        selectedItem={selectedItem}
        activeTab={activeTab}
        onSave={handleSaveEdit}
      />

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
