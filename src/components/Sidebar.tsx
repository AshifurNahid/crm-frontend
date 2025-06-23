
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  
  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3, path: '/' },
    { id: 'campaigns', name: 'Campaigns', icon: Target, path: null },
    { id: 'territories', name: 'Territories', icon: Map, path: '/territories' },
    { id: 'customer-groups', name: 'Customer Groups', icon: Tag, path: null },
    { id: 'leads', name: 'Lead Management', icon: Search, path: null },
    { id: 'opportunities', name: 'Opportunities', icon: TrendingUp, path: null },
    { id: 'customers', name: 'Customer Profile', icon: Users, path: null },
    { id: 'salespersons', name: 'Salespersons', icon: UserCheck, path: null },
    { id: 'contacts', name: 'Contact Directory', icon: Phone, path: null },
    { id: 'inventory', name: 'Inventory', icon: Package, path: null },
    { id: 'sales', name: 'Sales Management', icon: User, path: null },
  ];

  const handleModuleClick = (module: any) => {
    if (module.path) {
      // Don't call onModuleChange for routes that have dedicated pages
      return;
    }
    onModuleChange(module.id);
  };

  const isModuleActive = (module: any) => {
    if (module.path) {
      return location.pathname === module.path;
    }
    return activeModule === module.id;
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
            const isActive = isModuleActive(module);
            
            const buttonContent = (
              <>
                <Icon size={20} />
                <span className="text-sm font-medium">{module.name}</span>
              </>
            );

            const buttonClasses = `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#272727] hover:text-gray-900 dark:hover:text-white'
            }`;

            return (
              <li key={module.id}>
                {module.path ? (
                  <Link to={module.path} className={buttonClasses}>
                    {buttonContent}
                  </Link>
                ) : (
                  <button
                    onClick={() => handleModuleClick(module)}
                    className={buttonClasses}
                  >
                    {buttonContent}
                  </button>
                )}
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
