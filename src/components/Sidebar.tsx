import { Home, Zap, Bell, Car } from 'lucide-react';

export type NavItem = 'battery_health' | 'battery_charging' | 'alerts_history' | 'vehicle_profile';

interface SidebarProps {
  currentTab: NavItem;
  onSelectTab: (tab: NavItem) => void;
  activeAlertCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
}) => {
  // Exactly four items matching the reference image
  const navItems = [
    {
      id: 'battery_health' as NavItem,
      label: 'Battery Health & Vehicle Status',
      icon: Home,
    },
    {
      id: 'battery_charging' as NavItem,
      label: 'Battery Charging',
      icon: Zap,
    },
    {
      id: 'alerts_history' as NavItem,
      label: 'Alerts & History',
      icon: Bell,
    },
    {
      id: 'vehicle_profile' as NavItem,
      label: 'Vehicle Profile',
      icon: Car,
    },
  ];

  return (
    <aside className="hidden md:flex md:w-64 bg-white border-r border-[#E2E8F0] flex-col shrink-0 select-none py-6 px-3">
      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 text-xs md:text-sm font-medium transition-all text-left group ${
                isActive
                  ? 'bg-blue-50 text-[#2563EB] font-semibold border-l-4 border-[#2563EB] rounded-r-lg'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-[#2563EB]' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span className="leading-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
