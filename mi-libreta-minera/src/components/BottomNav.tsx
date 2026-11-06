import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Receipt, 
  Package, 
  Bell,
  CalendarDays
} from 'lucide-react';
import { NavigationTab } from '../types';

interface BottomNavProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  pendingOrdersCount: number;
  pendingRemindersCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  pendingOrdersCount,
  pendingRemindersCount,
}) => {
  const tabs = [
    { id: 'inicio' as NavigationTab, label: 'Inicio', icon: LayoutDashboard, badge: null },
    { id: 'gastos' as NavigationTab, label: 'Gastos', icon: Receipt, badge: null },
    { id: 'pedidos' as NavigationTab, label: 'Pedidos', icon: Package, badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
    { id: 'calendario' as NavigationTab, label: 'Calendario', icon: CalendarDays, badge: null },
    { id: 'recordatorios' as NavigationTab, label: 'Avisos', icon: Bell, badge: pendingRemindersCount > 0 ? pendingRemindersCount : null },
    { id: 'apuntes' as NavigationTab, label: 'Notas', icon: BookOpen, badge: null },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-1 py-1.5 flex items-center justify-around">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl relative transition-colors ${
              isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'scale-110 text-amber-400' : ''}`} />
              {tab.badge !== null && (
                <span className="absolute -top-1 -right-2 min-w-3.5 h-3.5 px-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-slate-950 flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[9px] sm:text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
