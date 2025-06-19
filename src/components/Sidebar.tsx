
import React from 'react';
import { 
  BarChart3, 
  Users, 
  Target, 
  User, 
  Phone, 
  Package, 
  TrendingUp,
  Map,
  Tag,
  Search,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const Sidebar = ({ activeModule, onModuleChange }: SidebarProps) => {
  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'campaigns', name: 'Campaigns', icon: Target },
    { id: 'territories', name: 'Territories', icon: Map },
    { id: 'customer-groups', name: 'Customer Groups', icon: Tag },
    { id: 'leads', name: 'Lead Management', icon: Search },
    { id: 'opportunities', name: 'Opportunities', icon: TrendingUp },
    { id: 'customers', name: 'Customer Profile', icon: Users },
    { id: 'salespersons', name: 'Salespersons', icon: UserCheck },
    { id: 'contacts', name: 'Contact Directory', icon: Phone },
    { id: 'inventory', name: 'Inventory', icon: Package },
    { id: 'sales', name: 'Sales Management', icon: User },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-blue-400">CRM Pro</h1>
        <p className="text-sm text-slate-400 mt-1">Sales & Marketing Hub</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <li key={module.id}>
                <button
                  onClick={() => onModuleChange(module.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeModule === module.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{module.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <User size={16} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-slate-400">Sales Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
