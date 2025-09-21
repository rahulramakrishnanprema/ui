import React from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  BarChart3, 
  FileText, 
  Settings,
  Github,
  Zap
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agents', label: 'Agents', icon: Bot },
    { id: 'metrics', label: 'Metrics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <img 
          src="/src/assets/Aristotlei-logo.png" 
          alt="AristotleI Logo" 
          className="w-12 h-12 object-contain"
        />
        <div>
          <h1 className="text-xl font-bold">Aristotle-I</h1>
          <p className="text-slate-400 text-sm">Agentic Orchestration Platform</p>
        </div>
      </div>
      
      <nav className="flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-slate-800">

      </div>
    </div>
  );
};