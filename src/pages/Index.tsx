
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
import SalesManagement from '../components/SalesManagement';

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
        return <SalesManagement />;
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
