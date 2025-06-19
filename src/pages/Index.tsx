
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
            <h1 className="text-2xl font-bold text-gray-900">Campaign Management</h1>
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <p className="text-gray-600">Campaign management interface coming soon...</p>
            </div>
          </div>
        );
      case 'territories':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Territory Management</h1>
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <p className="text-gray-600">Territory management interface coming soon...</p>
            </div>
          </div>
        );
      case 'customer-groups':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Customer Groups</h1>
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <p className="text-gray-600">Customer groups interface coming soon...</p>
            </div>
          </div>
        );
      case 'salespersons':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Salesperson Management</h1>
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <p className="text-gray-600">Salesperson management interface coming soon...</p>
            </div>
          </div>
        );
      case 'contacts':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Contact Directory</h1>
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <p className="text-gray-600">Contact directory interface coming soon...</p>
            </div>
          </div>
        );
      case 'inventory':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <p className="text-gray-600">Inventory management interface coming soon...</p>
            </div>
          </div>
        );
      case 'sales':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Sales Management</h1>
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <p className="text-gray-600">Sales management interface coming soon...</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
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
