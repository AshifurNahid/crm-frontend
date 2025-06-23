
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import LeadManagement from '../components/LeadManagement';
import OpportunityManagement from '../components/OpportunityManagement';
import CustomerManagement from '../components/CustomerManagement';
import CampaignManagement from '../components/CampaignManagement';
import SalespersonManagement from '../components/SalespersonManagement';
import ContactDirectory from '../components/ContactDirectory';
import InventoryManagement from '../components/InventoryManagement';

const Index = () => {
  const [activeModule, setActiveModule] = useState('dashboard');

  // Dummy data for customer groups
  const mockCustomerGroups = [
    { id: '1', name: 'Enterprise Customers', parentGroup: 'Root', isGroupNode: true, creditLimit: 100000 },
    { id: '2', name: 'Small Business', parentGroup: 'Root', isGroupNode: true, creditLimit: 25000 },
    { id: '3', name: 'Government Clients', parentGroup: 'Enterprise Customers', isGroupNode: false, creditLimit: 500000 },
    { id: '4', name: 'Non-Profit Organizations', parentGroup: 'Root', isGroupNode: true, creditLimit: 15000 },
    { id: '5', name: 'Technology Startups', parentGroup: 'Small Business', isGroupNode: false, creditLimit: 50000 },
  ];

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'leads':
        return <LeadManagement />;
      case 'opportunities':
        return <OpportunityManagement />;
      case 'customers':
        return <CustomerManagement />;
      case 'campaigns':
        return <CampaignManagement />;
      case 'customer-groups':
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
                      <TableCell className="text-gray-900 dark:text-white font-medium">{group.name}</TableCell>
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
      case 'salespersons':
        return <SalespersonManagement />;
      case 'contacts':
        return <ContactDirectory />;
      case 'inventory':
        return <InventoryManagement />;
      case 'sales':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Management</h1>
            <div className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <p className="text-gray-600 dark:text-gray-300">Sales management interface coming soon...</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderActiveModule()}
        </div>
      </main>
    </div>
  );
};

export default Index;
