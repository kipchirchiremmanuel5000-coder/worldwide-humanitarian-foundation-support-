import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, FileText, Search, HeartHandshake, ShieldCheck } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser } = useApp();

  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'apply', label: 'Apply', icon: FileText },
    { id: 'track', label: 'Track', icon: Search },
    { id: 'donate', label: 'Donate', icon: HeartHandshake },
    { id: 'admin', label: 'Admin', icon: ShieldCheck }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-2 shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 min-w-[56px] min-h-[44px] rounded-lg transition-colors cursor-pointer ${
                isActive 
                  ? 'text-[#0a1f38] font-bold' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#059669]' : 'text-slate-400'}`} />
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'text-[#0a1f38] font-bold' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
