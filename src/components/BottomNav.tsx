import React from 'react';
import { Home, Zap, Bell, Car, Layers } from 'lucide-react';
import { NavItem } from './Sidebar';

interface BottomNavProps {
  currentTab: NavItem;
  onSelectTab: (tab: NavItem) => void;
  activeAlertCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  activeAlertCount,
}) => {
  const items = [
    {
      id: 'battery_health' as NavItem,
      label: 'Health',
      fullLabel: 'Battery Health & Vehicle Status',
      icon: Home,
    },
    {
      id: 'battery_charging' as NavItem,
      label: 'Charging',
      fullLabel: 'Battery Charging',
      icon: Zap,
    },
    {
      id: 'cell_level' as NavItem,
      label: 'Cells',
      fullLabel: 'Cell Level',
      icon: Layers,
    },
    {
      id: 'alerts_history' as NavItem,
      label: 'Alerts',
      fullLabel: 'Alerts & History',
      icon: Bell,
      badge: activeAlertCount > 0 ? activeAlertCount : undefined,
    },
    {
      id: 'vehicle_profile' as NavItem,
      label: 'Vehicle',
      fullLabel: 'Vehicle Profile',
      icon: Car,
    },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] px-2 py-1.5 pb-safe flex items-center justify-around shadow-xs select-none"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-lg transition-colors relative min-h-[48px] active:scale-95 ${
              isActive 
                ? 'text-[#2563EB] font-semibold' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title={item.fullLabel}
            aria-label={item.fullLabel}
            aria-current={isActive ? 'page' : undefined}
          >
            {/* Icon with alert badge if present */}
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'text-[#2563EB] scale-105' : 'text-slate-400'}`} />
              {item.badge && (
                <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-1 bg-rose-600 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>

            {/* Label */}
            <span className={`text-[11px] tracking-tight mt-1 ${isActive ? 'text-[#2563EB] font-semibold' : 'text-slate-500'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
