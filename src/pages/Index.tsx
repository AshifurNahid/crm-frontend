
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import LeadManagement from '../components/LeadManagement';
import OpportunityManagement from '../components/OpportunityManagement';
import CustomerProfile from '../components/CustomerProfile';

const Index = () => {
  const [activeModule, setActiveModule] = useState('dashboard');

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'leads':
        return <LeadManagement />;
      case 'opportunities':
        return <OpportunityManagement />;
      case 'customers':
        return <CustomerProfile />;
      case 'campaigns':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Campaign Management</h1>
            <div className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <p className="text-gray-600 dark:text-gray-300">Campaign management interface coming soon...</p>
            </div>
          </div>
        );
      case 'territories':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Territory Management</h1>
            <div className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <p className="text-gray-600 dark:text-gray-300">Territory management interface coming soon...</p>
            </div>
          </div>
        );
      case 'customer-groups':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Groups</h1>
            <div className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <p className="text-gray-600 dark:text-gray-300">Customer groups interface coming soon...</p>
            </div>
          </div>
        );
      case 'salespersons':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Salesperson Management</h1>
            <div className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <p className="text-gray-600 dark:text-gray-300">Salesperson management interface coming soon...</p>
            </div>
          </div>
        );
      case 'contacts':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Directory</h1>
            <div className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <p className="text-gray-600 dark:text-gray-300">Contact directory interface coming soon...</p>
            </div>
          </div>
        );
      case 'inventory':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
            <div className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <p className="text-gray-600 dark:text-gray-300">Inventory management interface coming soon...</p>
            </div>
          </div>
        );
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
