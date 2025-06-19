
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Target, DollarSign, Calendar, Phone, Award, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const salesData = [
    { name: 'Jan', value: 45000 },
    { name: 'Feb', value: 52000 },
    { name: 'Mar', value: 48000 },
    { name: 'Apr', value: 61000 },
    { name: 'May', value: 58000 },
    { name: 'Jun', value: 67000 },
  ];

  const leadSourceData = [
    { name: 'Website', value: 45, color: '#3B82F6' },
    { name: 'Referrals', value: 30, color: '#10B981' },
    { name: 'Social Media', value: 15, color: '#F59E0B' },
    { name: 'Email', value: 10, color: '#EF4444' },
  ];

  const pipelineData = [
    { stage: 'New', count: 45, value: 125000 },
    { stage: 'Qualified', count: 32, value: 95000 },
    { stage: 'Proposal', count: 18, value: 78000 },
    { stage: 'Negotiation', count: 12, value: 56000 },
    { stage: 'Closed Won', count: 8, value: 45000 },
  ];

  const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }: any) => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          <p className={`text-sm mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '+' : ''}{change}% from last month
          </p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your sales.</p>
        </div>
        <div className="flex space-x-3">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value="$284,500"
          change={12.5}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Active Leads"
          value="156"
          change={8.2}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Conversion Rate"
          value="24.8%"
          change={-2.1}
          icon={Target}
          color="purple"
        />
        <StatCard
          title="Deals Closed"
          value="47"
          change={15.3}
          icon={Award}
          color="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']} />
              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Sources */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Sources</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={leadSourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {leadSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {leadSourceData.map((source, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }}></div>
                <span className="text-sm text-gray-600">{source.name}: {source.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Pipeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {pipelineData.map((stage, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">{stage.stage}</h4>
              <p className="text-xl font-bold text-blue-600 mt-2">{stage.count}</p>
              <p className="text-sm text-gray-600">${stage.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
            <div className="p-2 bg-green-100 rounded-full">
              <Phone className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Called Acme Corp</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Completed</span>
          </div>
          <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-full">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Meeting with TechStart Inc</p>
              <p className="text-xs text-gray-500">Tomorrow at 10:00 AM</p>
            </div>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Scheduled</span>
          </div>
          <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
            <div className="p-2 bg-yellow-100 rounded-full">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Follow up with GlobalTech</p>
              <p className="text-xs text-gray-500">Overdue by 1 day</p>
            </div>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Overdue</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
