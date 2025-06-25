import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';

// Mock data for customer groups
const mockCustomerGroups = [
  {
    id: '1',
    name: 'Enterprise Clients',
    parentGroup: '-',
    isGroupNode: true,
    creditLimit: 1000000
  },
  {
    id: '2',
    name: 'Small Business',
    parentGroup: '-',
    isGroupNode: true,
    creditLimit: 250000
  },
  {
    id: '3',
    name: 'Healthcare',
    parentGroup: 'Enterprise Clients',
    isGroupNode: true,
    creditLimit: 500000
  },
  {
    id: '4',
    name: 'Retail',
    parentGroup: 'Small Business',
    isGroupNode: false,
    creditLimit: 100000
  },
  {
    id: '5',
    name: 'Technology',
    parentGroup: 'Enterprise Clients',
    isGroupNode: false,
    creditLimit: 750000
  }
];

const CustomerGroupManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Groups</h1>
        <Link to="/customer-group/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Customer Group
          </Button>
        </Link>
      </div>
      <div className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-900 dark:text-white">Group Name</TableHead>
              <TableHead className="text-gray-900 dark:text-white">Parent Group</TableHead>
              <TableHead className="text-gray-900 dark:text-white">Type</TableHead>
              <TableHead className="text-gray-900 dark:text-white">Credit Limit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCustomerGroups.map((group) => (
              <TableRow key={group.id}>
                <TableCell className="text-gray-900 dark:text-white font-medium">
                  <Link to={`/customer-group/edit/${group.id}`} className="hover:underline">
                    {group.name}
                  </Link>
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-300">{group.parentGroup}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    group.isGroupNode 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                  }`}>
                    {group.isGroupNode ? 'Group Node' : 'Leaf Node'}
                  </span>
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-300">
                  ${group.creditLimit.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CustomerGroupManagement;
export default CustomerGroupManagement;
