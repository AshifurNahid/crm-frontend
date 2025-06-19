
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Building, Calendar, DollarSign, FileText, Activity } from 'lucide-react';

const CustomerProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const customer = {
    id: 1,
    name: 'Acme Corporation',
    type: 'Enterprise',
    industry: 'Technology',
    email: 'contact@acme.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Ave, Tech City, TC 12345',
    website: 'www.acme.com',
    founded: '2015',
    employees: '500-1000',
    revenue: '$50M - $100M',
    status: 'Active',
    since: '2022-01-15'
  };

  const contacts = [
    {
      id: 1,
      name: 'John Smith',
      position: 'CEO',
      email: 'john.smith@acme.com',
      phone: '+1 (555) 123-4567',
      primary: true
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      position: 'CTO',
      email: 'sarah.johnson@acme.com',
      phone: '+1 (555) 123-4568',
      primary: false
    },
    {
      id: 3,
      name: 'Michael Chen',
      position: 'Procurement Manager',
      email: 'michael.chen@acme.com',
      phone: '+1 (555) 123-4569',
      primary: false
    }
  ];

  const purchaseHistory = [
    {
      id: 1,
      date: '2024-01-15',
      product: 'Enterprise CRM License',
      amount: '$25,000',
      status: 'Completed'
    },
    {
      id: 2,
      date: '2023-11-20',
      product: 'Professional Services',
      amount: '$15,000',
      status: 'Completed'
    },
    {
      id: 3,
      date: '2023-08-10',
      product: 'Training Package',
      amount: '$5,000',
      status: 'Completed'
    }
  ];

  const activities = [
    {
      id: 1,
      type: 'call',
      description: 'Called John Smith regarding contract renewal',
      date: '2024-01-10',
      user: 'Emily Davis'
    },
    {
      id: 2,
      type: 'email',
      description: 'Sent proposal for additional services',
      date: '2024-01-08',
      user: 'Mike Johnson'
    },
    {
      id: 3,
      type: 'meeting',
      description: 'Quarterly business review meeting',
      date: '2024-01-05',
      user: 'John Smith'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone size={16} className="text-green-600" />;
      case 'email': return <Mail size={16} className="text-blue-600" />;
      case 'meeting': return <Calendar size={16} className="text-purple-600" />;
      default: return <Activity size={16} className="text-gray-600" />;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'contacts', label: 'Contacts' },
    { id: 'purchases', label: 'Purchase History' },
    { id: 'activities', label: 'Activities' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Profile</h1>
          <p className="text-gray-600 mt-1">Detailed customer information and history</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Edit Customer
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Create Opportunity
          </button>
        </div>
      </div>

      {/* Customer Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
              <Building size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{customer.name}</h2>
              <p className="text-gray-600">{customer.industry} • {customer.type}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="flex items-center text-sm text-gray-600">
                  <Mail size={14} className="mr-1" />
                  {customer.email}
                </span>
                <span className="flex items-center text-sm text-gray-600">
                  <Phone size={14} className="mr-1" />
                  {customer.phone}
                </span>
                <span className="flex items-center text-sm text-gray-600">
                  <MapPin size={14} className="mr-1" />
                  {customer.address}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {customer.status}
            </span>
            <p className="text-sm text-gray-600 mt-1">Customer since {customer.since}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$45,000</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Last Order</p>
              <p className="text-lg font-bold text-gray-900">Jan 15, 2024</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <User className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Contacts</p>
              <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Website:</span>
                    <span className="text-gray-900">{customer.website}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Founded:</span>
                    <span className="text-gray-900">{customer.founded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employees:</span>
                    <span className="text-gray-900">{customer.employees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Revenue:</span>
                    <span className="text-gray-900">{customer.revenue}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Type:</span>
                    <span className="text-gray-900">{customer.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="text-green-600 font-medium">{customer.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer Since:</span>
                    <span className="text-gray-900">{customer.since}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <User size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{contact.name}</h4>
                        {contact.primary && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Primary</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{contact.position}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">{contact.email}</span>
                        <span className="text-sm text-gray-500">{contact.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600">
                      <Mail size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600">
                      <Phone size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'purchases' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-medium text-gray-900">Date</th>
                    <th className="text-left py-3 font-medium text-gray-900">Product/Service</th>
                    <th className="text-left py-3 font-medium text-gray-900">Amount</th>
                    <th className="text-left py-3 font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {purchaseHistory.map((purchase) => (
                    <tr key={purchase.id}>
                      <td className="py-3 text-gray-900">{purchase.date}</td>
                      <td className="py-3 text-gray-900">{purchase.product}</td>
                      <td className="py-3 font-medium text-gray-900">{purchase.amount}</td>
                      <td className="py-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {purchase.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className="p-2 bg-gray-100 rounded-full">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">{activity.description}</p>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span>{activity.date}</span>
                      <span>by {activity.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
