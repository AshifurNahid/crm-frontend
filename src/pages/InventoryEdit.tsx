
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unitPrice: number;
  lowStockThreshold: number;
  supplier: string;
  location: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';
}

const InventoryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState<InventoryItem>({
    id: '',
    name: '',
    sku: '',
    category: '',
    quantity: 0,
    unitPrice: 0,
    lowStockThreshold: 0,
    supplier: '',
    location: '',
    status: 'ACTIVE'
  });

  useEffect(() => {
    if (id) {
      // Simulate API call to fetch item data
      const mockItem: InventoryItem = {
        id: id,
        name: 'Sample Product',
        sku: 'SKU001',
        category: 'Electronics',
        quantity: 100,
        unitPrice: 25.99,
        lowStockThreshold: 10,
        supplier: 'Tech Supplier Inc.',
        location: 'Warehouse A',
        status: 'ACTIVE'
      };
      setItem(mockItem);
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Updating inventory item:', item);
      
      toast({
        title: "Item Updated",
        description: "Inventory item has been successfully updated.",
      });
      
      navigate('/inventory');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update inventory item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof InventoryItem, value: any) => {
    setItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/inventory')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Inventory
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Edit Inventory Item
        </h1>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  value={item.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={item.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={item.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit Price *</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => handleInputChange('unitPrice', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  value={item.lowStockThreshold}
                  onChange={(e) => handleInputChange('lowStockThreshold', parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  value={item.supplier}
                  onChange={(e) => handleInputChange('supplier', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={item.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={item.status} onValueChange={(value) => handleInputChange('status', value as 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="DISCONTINUED">Discontinued</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => navigate('/inventory')}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryEdit;
