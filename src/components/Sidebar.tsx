
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  UserCheck,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const Sidebar = ({ activeModule, onModuleChange }: SidebarProps) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3, route: null },
    { id: 'campaigns', name: 'Campaigns', icon: Target, route: null },
    { id: 'territories', name: 'Territories', icon: Map, route: null },
    { id: 'customer-groups', name: 'Customer Groups', icon: Tag, route: null },
    { id: 'leads', name: 'Lead Management', icon: Search, route: null },
    { id: 'opportunities', name: 'Opportunities', icon: TrendingUp, route: null },
    { id: 'customers', name: 'Customer Profile', icon: Users, route: null },
    { id: 'salespersons', name: 'Salespersons', icon: UserCheck, route: null },
    { id: 'contacts', name: 'Contact Directory', icon: Phone, route: null },
    { id: 'inventory', name: 'Inventory', icon: Package, route: null },
    { id: 'sales', name: 'Sales Management', icon: User, route: null },
  ];

  const handleModuleClick = (module: any) => {
    if (module.route) {
      navigate(module.route);
    } else {
      onModuleChange(module.id);
    }
  };

  return (
    <div className="w-64 bg-white dark:bg-[#121212] text-gray-900 dark:text-white h-screen flex flex-col border-r border-gray-200 dark:border-gray-800">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">CRM Pro</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sales & Marketing Hub</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <li key={module.id}>
                <button
                  onClick={() => handleModuleClick(module)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeModule === module.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#272727] hover:text-gray-900 dark:hover:text-white'
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
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sales Manager</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
