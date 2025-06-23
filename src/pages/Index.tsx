
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import LeadManagement from '../components/LeadManagement';
import OpportunityManagement from '../components/OpportunityManagement';
import CustomerManagement from '../components/CustomerManagement';
import CampaignManagement from '../components/CampaignManagement';
import SalespersonManagement from '../components/SalespersonManagement';
import ContactDirectory from '../components/ContactDirectory';
import InventoryManagement from '../components/InventoryManagement';
import TerritoryManagement from '../components/TerritoryManagement';

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
        return <CustomerManagement />;
      case 'campaigns':
        return <CampaignManagement />;
      case 'territories':
        return <TerritoryManagement />;
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
