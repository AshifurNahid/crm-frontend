
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import LeadManagement from '@/components/LeadManagement';
import OpportunityManagement from '@/components/OpportunityManagement';
import CustomerManagement from '@/components/CustomerManagement';
import ContactDirectory from '@/components/ContactDirectory';
import SalespersonManagement from '@/components/SalespersonManagement';
import TerritoryManagement from '@/components/TerritoryManagement';
import CampaignManagement from '@/components/CampaignManagement';
import SalesManagement from '@/components/SalesManagement';
import InventoryManagement from '@/components/InventoryManagement';
import CustomerProfile from '@/components/CustomerProfile';
import { ThemeProvider } from '@/contexts/ThemeContext';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();

  const handleCreateCustomerGroup = () => {
    navigate('/customer-group/create');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'leads':
        return <LeadManagement />;
      case 'opportunities':
        return <OpportunityManagement />;
      case 'customers':
        return <CustomerManagement />;
      case 'customer-groups':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Groups</h1>
              <button
                onClick={handleCreateCustomerGroup}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Customer Group
              </button>
            </div>
            
            <div className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Enterprise Customers</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Large corporations and enterprise clients</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">24</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Active customers</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Small Business</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Small to medium businesses</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">156</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Active customers</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Government Clients</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Government and public sector</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">8</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Active customers</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Non-Profit Organizations</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Non-profit and charitable organizations</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">12</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Active customers</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Retail Customers</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Individual retail customers</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">89</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Active customers</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">VIP Customers</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">High-value and premium customers</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-red-600 dark:text-red-400">15</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Active customers</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Customer Group Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">New customer added to Enterprise Customers</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">TechCorp Solutions - 2 hours ago</p>
                    </div>
                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">New</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Customer group updated</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Small Business group settings modified - 1 day ago</p>
                    </div>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">Updated</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Credit limit increased</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">VIP Customers group limit raised to $500k - 3 days ago</p>
                    </div>
                    <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full">Modified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'contacts':
        return <ContactDirectory />;
      case 'salesperson':
        return <SalespersonManagement />;
      case 'territory':
        return <TerritoryManagement />;
      case 'campaigns':
        return <CampaignManagement />;
      case 'sales':
        return <SalesManagement />;
      case 'inventory':
        return <InventoryManagement />;
      case 'customer-profile':
        return <CustomerProfile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Index;
