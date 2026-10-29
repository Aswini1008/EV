import React from 'react';
import { Zap, Car, Bell, ChevronDown, User, Wifi, WifiOff } from 'lucide-react';
import { RiskStatus } from '../types';

interface TopNavbarProps {
  isOnline: boolean;
  onToggleOnline: () => void;
  activeAlertCount: number;
  highestRisk: RiskStatus;
  onOpenAlerts: () => void;
  onOpenProfile: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  isOnline,
  onToggleOnline,
  activeAlertCount,
  onOpenAlerts,
  onOpenProfile,
}) => {
  return (
    <header className="h-14 md:h-16 bg-white border-b border-[#E2E8F0] px-3 sm:px-4 md:px-7 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-40 select-none shadow-xs">
      {/* System Identifier & Vehicle Selector */}
      <div className="flex items-center gap-3 sm:gap-6 min-w-0">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Clean Enterprise Royal Blue Logo */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#2563EB] flex items-center justify-center shrink-0 shadow-xs">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white" />
          </div>
          <div className="min-w-0 flex flex-col justify-center">
            <div className="text-[11px] sm:text-xs font-mono font-bold tracking-wider text-slate-800 uppercase flex items-center gap-1 sm:gap-1.5 whitespace-nowrap">
              <span className="text-[#2563EB]">BMS</span>
              <span className="text-slate-300 font-light">|</span>
              <span className="truncate text-slate-700">EV BATTERY MONITORING</span>
            </div>
          </div>
        </div>

        {/* Vehicle Selector Dropdown */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 hover:border-slate-300 transition-colors cursor-pointer shrink-0">
          <Car className="w-4 h-4 text-[#2563EB]" />
          <span className="font-semibold text-slate-900 tracking-wide">EV-8849-N3</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
        </div>
      </div>

      {/* Status & User Profile Actions */}
      <div className="flex items-center gap-2 sm:gap-4 md:gap-5 shrink-0">
        {/* Online Connection Status */}
        <button
          onClick={onToggleOnline}
          className="transition-colors hover:opacity-85 p-1.5 sm:px-2.5 sm:py-1 rounded-md sm:bg-slate-50 sm:border sm:border-slate-200 flex items-center"
          title={isOnline ? "Connected to EV telemetry. Click to toggle offline." : "Offline. Click to reconnect."}
          aria-label={isOnline ? "Online status. Click to toggle." : "Offline status. Click to reconnect."}
        >
          {/* Mobile view: Wifi icon */}
          <div className="sm:hidden flex items-center justify-center">
            {isOnline ? (
              <Wifi className="w-5 h-5 text-emerald-600" />
            ) : (
              <WifiOff className="w-5 h-5 text-rose-600" />
            )}
          </div>

          {/* Desktop view: Dot with 'Online' text */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
            <span className={`w-2 h-2 rounded-full ${
              isOnline ? 'bg-emerald-500' : 'bg-rose-500'
            }`} />
            <span className={`font-semibold ${isOnline ? 'text-emerald-700' : 'text-rose-600'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </button>

        {/* Notification Bell with Badge */}
        <button
          onClick={onOpenAlerts}
          className="relative p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title={`${activeAlertCount} active alerts`}
          aria-label="View notifications and alerts"
        >
          <Bell className="w-5 h-5" />
          {activeAlertCount > 0 && (
            <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 bg-rose-600 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
              {activeAlertCount}
            </span>
          )}
        </button>

        {/* User Profile / EV Engineer */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          title="User Profile"
          aria-label="User Profile"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
            <User className="w-4 h-4 text-slate-700" />
          </div>
          <span className="text-xs font-semibold text-slate-800 hidden md:inline">
            EV Engineer
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:inline" />
        </button>
      </div>
    </header>
  );
};
