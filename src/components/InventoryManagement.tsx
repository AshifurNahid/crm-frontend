
import React, { useState } from 'react';
import { Plus, Search, Edit, Eye, Package, ArrowUpDown, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import AddItemForm from './AddItemForm';
import AdjustStockForm from './AdjustStockForm';
import CheckAvailabilityModal from './CheckAvailabilityModal';
import StockTransferForm from './StockTransferForm';

type ItemStatus = 'Active' | 'Inactive';

interface InventoryItem {
  id: string;
  itemCode: string;
  itemName: string;
  quantityOnHand: number;
  price: number;
  status: ItemStatus;
  warehouse?: string;
}

const InventoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isAdjustStockOpen, setIsAdjustStockOpen] = useState(false);
  const [isCheckAvailabilityOpen, setIsCheckAvailabilityOpen] = useState(false);
  const [isStockTransferOpen, setIsStockTransferOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const { toast } = useToast();

  // Dummy inventory data
  const mockInventoryItems: InventoryItem[] = [
    {
      id: '1',
      itemCode: 'ITM001',
      itemName: 'Wireless Bluetooth Headphones',
      quantityOnHand: 150,
      price: 99.99,
      status: 'Active',
      warehouse: 'Main Warehouse'
    },
    {
      id: '2',
      itemCode: 'ITM002',
      itemName: 'USB-C Cable 6ft',
      quantityOnHand: 500,
      price: 12.99,
      status: 'Active',
      warehouse: 'Main Warehouse'
    },
    {
      id: '3',
      itemCode: 'ITM003',
      itemName: 'Laptop Stand Adjustable',
      quantityOnHand: 75,
      price: 45.50,
      status: 'Active',
      warehouse: 'Secondary Warehouse'
    },
    {
      id: '4',
      itemCode: 'ITM004',
      itemName: 'Wireless Mouse',
      quantityOnHand: 200,
      price: 29.99,
      status: 'Active',
      warehouse: 'Main Warehouse'
    },
    {
      id: '5',
      itemCode: 'ITM005',
      itemName: 'Mechanical Keyboard',
      quantityOnHand: 50,
      price: 129.99,
      status: 'Active',
      warehouse: 'Main Warehouse'
    },
    {
      id: '6',
      itemCode: 'ITM006',
      itemName: 'Desk Lamp LED',
      quantityOnHand: 0,
      price: 34.99,
      status: 'Inactive',
      warehouse: 'Main Warehouse'
    },
    {
      id: '7',
      itemCode: 'ITM007',
      itemName: 'Phone Charger Wireless',
      quantityOnHand: 120,
      price: 24.99,
      status: 'Active',
      warehouse: 'Secondary Warehouse'
    },
    {
      id: '8',
      itemCode: 'ITM008',
      itemName: 'Monitor 24 inch 4K',
      quantityOnHand: 25,
      price: 299.99,
      status: 'Active',
      warehouse: 'Main Warehouse'
    },
    {
      id: '9',
      itemCode: 'ITM009',
      itemName: 'External Hard Drive 1TB',
      quantityOnHand: 80,
      price: 89.99,
      status: 'Active',
      warehouse: 'Secondary Warehouse'
    },
    {
      id: '10',
      itemCode: 'ITM010',
      itemName: 'Gaming Chair Ergonomic',
      quantityOnHand: 15,
      price: 249.99,
      status: 'Inactive',
      warehouse: 'Main Warehouse'
    }
  ];

  const getStatusBadgeVariant = (status: ItemStatus) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };

  const getStockLevelColor = (quantity: number) => {
    if (quantity === 0) return 'text-red-600 dark:text-red-400';
    if (quantity < 20) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const filteredItems = mockInventoryItems.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCheckAvailability = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsCheckAvailabilityOpen(true);
  };

  const handleAdjustStock = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsAdjustStockOpen(true);
  };

  const handleStockTransfer = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsStockTransferOpen(true);
  };

  const handleEditItem = (itemId: string) => {
    console.log('Editing item:', itemId);
    toast({
      title: "Edit Item",
      description: "Edit functionality will be implemented soon.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Dashboard</h1>
        <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <AddItemForm onClose={() => setIsAddItemOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Search and Filter Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by item code or name..."
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
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Items</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockInventoryItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Items</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockInventoryItems.filter(item => item.status === 'Active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockInventoryItems.filter(item => item.quantityOnHand < 20 && item.quantityOnHand > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockInventoryItems.filter(item => item.quantityOnHand === 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory List Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items ({filteredItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Quantity On Hand</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.itemCode}</TableCell>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell>
                      <span className={getStockLevelColor(item.quantityOnHand)}>
                        {item.quantityOnHand}
                      </span>
                    </TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeVariant(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {item.warehouse}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleCheckAvailability(item)}
                          title="Check Availability"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditItem(item.id)}
                          title="Edit Item"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleAdjustStock(item)}
                          title="Adjust Stock"
                        >
                          <ArrowUpDown className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleStockTransfer(item)}
                          title="Transfer Stock"
                        >
                          <Truck className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredItems.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No inventory items found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <Dialog open={isAdjustStockOpen} onOpenChange={setIsAdjustStockOpen}>
        <DialogContent>
          {selectedItem && (
            <AdjustStockForm 
              item={selectedItem}
              onClose={() => setIsAdjustStockOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isCheckAvailabilityOpen} onOpenChange={setIsCheckAvailabilityOpen}>
        <DialogContent>
          {selectedItem && (
            <CheckAvailabilityModal 
              item={selectedItem}
              onClose={() => setIsCheckAvailabilityOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isStockTransferOpen} onOpenChange={setIsStockTransferOpen}>
        <DialogContent>
          {selectedItem && (
            <StockTransferForm 
              item={selectedItem}
              onClose={() => setIsStockTransferOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryManagement;
