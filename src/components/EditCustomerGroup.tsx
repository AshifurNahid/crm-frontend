import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Select } from '../components/ui/Select';
import { Checkbox } from '../components/ui/Checkbox';

const EditCustomerGroup = () => {
  const { id } = useParams();
  
  // Mock data for a specific customer group
  const customerGroup = {
    id: id,
    name: 'Enterprise Clients',
    parentGroup: '',
    isGroupNode: true,
    creditLimit: 1000000
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Customer Group</h1>
        <Link to="/customer-groups">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>
      
      <div className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Group Name</label>
              <Input placeholder="Enter group name" defaultValue={customerGroup.name} />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Parent Group</label>
              <Select defaultValue={customerGroup.parentGroup}>
                <option value="">None</option>
                <option value="1">Enterprise Clients</option>
                <option value="2">Small Business</option>
                <option value="3">Healthcare</option>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Credit Limit</label>
              <Input type="number" placeholder="Enter credit limit" defaultValue={customerGroup.creditLimit} />
            </div>
            
            <div className="space-y-2 flex items-end">
              <div className="flex items-center space-x-2">
                <Checkbox id="isGroupNode" defaultChecked={customerGroup.isGroupNode} />
                <label htmlFor="isGroupNode" className="text-sm font-medium text-gray-900 dark:text-white">
                  Is Group Node
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button variant="destructive">Delete</Button>
            <div className="flex-1"></div>
            <Link to="/customer-groups">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomerGroup;
