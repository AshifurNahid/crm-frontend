import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Eye, Package, ArrowUpDown, Truck, Trash2 } from 'lucide-react';
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
import DeleteConfirmationDialog from './DeleteConfirmationDialog'; // You may need to create this if not present
import { useNavigate } from 'react-router-dom';

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch items from API (paginated)
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const baseUrl = import.meta.env.VITE_API_URL || '';
        const endpoint = `${baseUrl}/api/v1/items?pageNumber=${page}&pageSize=${pageSize}&direction=ASC&sortField=itemName`;
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || `Failed to fetch items: ${response.statusText}`);
        }
        // Handle paginated response
        if (result.success && result.data && Array.isArray(result.data.content)) {
          setItems(result.data.content.map((item: any) => ({
            id: item.id?.toString(),
            itemCode: item.itemCode,
            itemName: item.itemName,
            quantityOnHand: Number(item.quantityOnHand),
            price: Number(item.price),
            status: Number(item.quantityOnHand) > 0 ? 'Active' : 'Inactive',
            warehouse: 'Main Warehouse'
          })));
          setTotalPages(result.data.totalPages);
          setTotalElements(result.data.totalElements);
        } else {
          setItems([]);
          setTotalPages(0);
          setTotalElements(0);
          setError('No items found or data format is invalid.');
        }
      } catch (error) {
        setItems([]);
        setTotalPages(0);
        setTotalElements(0);
        setError(error instanceof Error ? error.message : "Failed to fetch items");
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch items",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [page, pageSize, toast, refreshFlag]);

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

  const filteredItems = items.filter(item => {
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

  // Delete item handler
  const handleDeleteClick = (item: InventoryItem) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const endpoint = `${baseUrl}/api/v1/items/${itemToDelete.id}`;
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || `Failed to delete item: ${response.statusText}`);
      }
      setItems(prev => prev.filter(i => i.id !== itemToDelete.id));
      toast({
        title: "Success",
        description: result.message || "Item deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
      triggerRefresh();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  // Call this after any operation to refresh the list
  const triggerRefresh = () => setRefreshFlag(f => f + 1);

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
            <AddItemForm
              onClose={() => setIsAddItemOpen(false)}
              onSuccess={() => {
                setIsAddItemOpen(false);
                triggerRefresh();
              }}
            />
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{items.length}</p>
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
                  {items.filter(item => item.status === 'Active').length}
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
                  {items.filter(item => item.quantityOnHand < 20 && item.quantityOnHand > 0).length}
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
                  {items.filter(item => item.quantityOnHand === 0).length}
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
                  <TableHead>Warehouse</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
                        <span className="text-gray-500 dark:text-gray-400">Loading inventory items...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.itemCode}</TableCell>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>
                        <span className={getStockLevelColor(item.quantityOnHand)}>
                          {item.quantityOnHand}
                        </span>
                      </TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
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
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteClick(item)}
                            title="Delete Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No inventory items found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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
              onSuccess={() => {
                setIsAdjustStockOpen(false);
                triggerRefresh();
              }}
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

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Item"
        description="Are you sure you want to delete this item? This will permanently remove all associated data."
        itemName={itemToDelete?.itemName}
      />
    </div>
  );
};

export default InventoryManagement;

