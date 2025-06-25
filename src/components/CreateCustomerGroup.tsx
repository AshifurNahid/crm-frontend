import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const CreateCustomerGroup = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Customer Group</h1>
        <Link to="/customer-groups">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>
      
      <div className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Group Name</label>
              <Input placeholder="Enter group name" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Parent Group</label>
              <Select>
                <option value="">None</option>
                <option value="1">Enterprise Clients</option>
                <option value="2">Small Business</option>
                <option value="3">Healthcare</option>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Credit Limit</label>
              <Input type="number" placeholder="Enter credit limit" />
            </div>
            
            <div className="space-y-2 flex items-end">
              <div className="flex items-center space-x-2">
                <Checkbox id="isGroupNode" />
                <label htmlFor="isGroupNode" className="text-sm font-medium text-gray-900 dark:text-white">
                  Is Group Node
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Link to="/customer-groups">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit">Create Customer Group</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCustomerGroup;
