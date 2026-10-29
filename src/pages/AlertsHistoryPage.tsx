import React, { useState } from 'react';
import { AnomalyEvent, ChargingEvent } from '../types';
import { 
  Bell, 
  Calendar, 
  ChevronDown, 
  ChevronRight, 
  ShieldCheck, 
  History, 
  AlertTriangle, 
  Thermometer, 
  Info, 
  CheckCircle2, 
  Plug,
  X,
  Check,
  Filter
} from 'lucide-react';

interface AlertsHistoryPageProps {
  anomalies: AnomalyEvent[];
  chargingEvents: ChargingEvent[];
  onClearAlerts?: () => void;
  onResolveAlert?: (id: string) => void;
}

export const AlertsHistoryPage: React.FC<AlertsHistoryPageProps> = ({
  anomalies,
  onResolveAlert,
}) => {
  const [dateRange, setDateRange] = useState<string>('Last 7 Days');
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'warning' | 'info' | 'resolved'>('all');

  // Baseline events list if anomalies array is not initialized
  const baselineEvents: AnomalyEvent[] = [
    {
      id: 'evt-1',
      title: 'Cell 18 voltage deviation detected',
      event: 'Cell 18 voltage deviation detected',
      description: 'Battery cell voltage is 3.52V, outside the ±0.05V string deviation limit. Continuous balancing active.',
      date: '29 Oct 2026',
      time: '13:12',
      fullTimestamp: '2026-10-29 13:12:00',
      severity: 'Warning',
      iconType: 'warning',
      isMockData: true,
    },
    {
      id: 'evt-2',
      title: 'Battery temperature is higher than expected',
      event: 'Battery temperature is higher than expected',
      description: 'Battery pack module 2 reached 36.8°C during sustained acceleration. Liquid cooling flow rate increased.',
      date: '29 Oct 2026',
      time: '12:48',
      fullTimestamp: '2026-10-29 12:48:00',
      severity: 'Warning',
      iconType: 'temperature',
      isMockData: true,
    },
    {
      id: 'evt-3',
      title: 'Charging started',
      event: 'Charging started',
      description: 'Vehicle connected to DC fast charger at CCS Combo 2 port.',
      date: '29 Oct 2026',
      time: '12:21',
      fullTimestamp: '2026-10-29 12:21:00',
      severity: 'Info',
      iconType: 'info',
      isMockData: true,
    },
    {
      id: 'evt-4',
      title: 'Normal operating pattern restored',
      event: 'Normal operating pattern restored',
      description: 'All battery cell voltages and string currents returned to nominal baseline.',
      date: '29 Oct 2026',
      time: '11:56',
      fullTimestamp: '2026-10-29 11:56:00',
      severity: 'Resolved',
      iconType: 'check',
      isMockData: true,
    },
    {
      id: 'evt-5',
      title: 'Vehicle connected to charger',
      event: 'Vehicle connected to charger',
      description: 'Pilot signal verified on control line. Contactor ready for pre-charge.',
      date: '29 Oct 2026',
      time: '10:32',
      fullTimestamp: '2026-10-29 10:32:00',
      severity: 'Info',
      iconType: 'plug',
      isMockData: true,
    },
  ];

  // Combined source: use active anomalies state from App
  const allEvents = anomalies && anomalies.length > 0 ? anomalies : baselineEvents;

  // Active counts reflecting true telemetry state
  const criticalEvents = allEvents.filter(e => e.severity === 'Critical');
  const warningEvents = allEvents.filter(e => e.severity === 'Warning');
  const infoEvents = allEvents.filter(e => e.severity === 'Info');
  const resolvedEvents = allEvents.filter(e => e.severity === 'Resolved');

  const hasCritical = criticalEvents.length > 0;
  const hasWarnings = warningEvents.length > 0;

  // Filtered list based on active tab
  const displayedList = allEvents.filter(evt => {
    if (activeTab === 'warning') return evt.severity === 'Warning' || evt.severity === 'Critical';
    if (activeTab === 'info') return evt.severity === 'Info';
    if (activeTab === 'resolved') return evt.severity === 'Resolved';
    return true;
  });

  // Helper to render icon
  const renderEventIcon = (iconType: string) => {
    switch (iconType) {
      case 'warning':
      case 'voltage':
      case 'alert':
        return (
          <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        );
      case 'temperature':
        return (
          <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
            <Thermometer className="w-5 h-5" />
          </div>
        );
      case 'info':
      case 'current':
        return (
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 text-[#2563EB] flex items-center justify-center shrink-0">
            <Info className="w-5 h-5" />
          </div>
        );
      case 'plug':
        return (
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 text-[#2563EB] flex items-center justify-center shrink-0">
            <Plug className="w-5 h-5" />
          </div>
        );
      case 'check':
      case 'resolved':
      default:
        return (
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        );
    }
  };

  // Helper to render severity badge
  const renderBadge = (severity: string) => {
    switch (severity) {
      case 'Warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Warning
          </span>
        );
      case 'Info':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Info
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Resolved
          </span>
        );
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Critical
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {severity}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Main Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-1 rounded-lg text-[#2563EB] mt-0.5">
            <Bell className="w-6 h-6 fill-[#2563EB] text-[#2563EB]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Alerts & History
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Active battery anomaly detection log and historical system events
            </p>
          </div>
        </div>

        {/* Compact Date-Range Dropdown */}
        <div className="relative self-start sm:self-auto">
          <button
            onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:border-slate-300 transition-colors shadow-2xs"
          >
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{dateRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {isDateDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-30 overflow-hidden py-1">
              {['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'All Time'].map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setDateRange(range);
                    setIsDateDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-mono transition-colors ${
                    dateRange === range 
                      ? 'text-[#2563EB] font-bold bg-blue-50' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Battery Safety Status Card — DYNAMICALLY AGREES WITH ACTUAL ACTIVE ALERTS */}
      {hasCritical ? (
        <div className="rounded-xl p-5 border bg-rose-50 border-rose-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-rose-950 tracking-tight">
                Critical Battery Anomaly Detected
              </h2>
              <p className="text-xs text-rose-800 mt-0.5">
                {criticalEvents.length} critical condition requires immediate inspection or power limitation.
              </p>
            </div>
          </div>

          <div className="shrink-0 self-start sm:self-center">
            <span className="px-5 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
              CRITICAL
            </span>
          </div>
        </div>
      ) : hasWarnings ? (
        <div className="rounded-xl p-5 border bg-amber-50 border-amber-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-amber-950 tracking-tight">
                Active Cell Warnings Detected
              </h2>
              <p className="text-xs text-amber-800 mt-0.5">
                {warningEvents.length} unresolved warning event{warningEvents.length > 1 ? 's' : ''} currently under observation by AI supervisory system.
              </p>
            </div>
          </div>

          <div className="shrink-0 self-start sm:self-center">
            <span className="px-5 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
              WARNING ({warningEvents.length})
            </span>
          </div>
        </div>
      ) : (
        <div className="rounded-xl p-5 border bg-emerald-50 border-emerald-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-emerald-950 tracking-tight">
                Battery Operating Normally
              </h2>
              <p className="text-xs text-emerald-800 mt-0.5">
                All 96 cells within nominal safety thresholds. Zero active anomalies.
              </p>
            </div>
          </div>

          <div className="shrink-0 self-start sm:self-center">
            <span className="px-5 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
              NORMAL
            </span>
          </div>
        </div>
      )}

      {/* 3. Event History Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-6 shadow-xs">
        {/* Card Header with History Icon & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-[#2563EB]" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Event Log
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              ({displayedList.length} shown)
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({allEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('warning')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'warning'
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60'
              }`}
            >
              Warnings ({warningEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'info'
                  ? 'bg-[#2563EB] text-white font-semibold'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60'
              }`}
            >
              Info ({infoEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'resolved'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
              }`}
            >
              Resolved ({resolvedEvents.length})
            </button>
          </div>
        </div>

        {/* Event Rows */}
        {displayedList.length === 0 ? (
          <div className="py-10 text-center text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No events found in this category.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {displayedList.map((evt) => {
              const isWarning = evt.severity === 'Warning' || evt.severity === 'Critical';
              return (
                <div 
                  key={evt.id} 
                  className="py-3.5 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 hover:bg-slate-50/70 px-1 sm:px-2 rounded-lg transition-colors"
                >
                  {/* Left: Icon + Title & Description */}
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                    <div className="shrink-0 mt-0.5 sm:mt-0">
                      {renderEventIcon(evt.iconType)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs sm:text-sm font-semibold text-slate-900 tracking-tight leading-snug">
                          {evt.event || evt.title}
                        </h3>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                        {evt.description || 'System monitored parameter within operating limits.'}
                      </p>
                    </div>
                  </div>

                  {/* Right: Date, Time, Action, Severity */}
                  <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-5 shrink-0 pt-1.5 md:pt-0 border-t border-slate-100 md:border-t-0 w-full md:w-auto">
                    {/* Date & Time */}
                    <div className="text-left md:text-right flex md:block items-center gap-2 md:gap-0">
                      <div className="text-[11px] sm:text-xs font-mono text-slate-400">
                        {evt.date || '29 Oct 2026'}
                      </div>
                      <div className="text-[11px] sm:text-xs font-mono text-slate-700 font-semibold">
                        {evt.time || '12:00'}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      {renderBadge(evt.severity)}
                    </div>

                    {/* Quick Resolve Button for active warnings */}
                    {isWarning && onResolveAlert && (
                      <button
                        onClick={() => onResolveAlert(evt.id)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors flex items-center gap-1 shadow-2xs"
                        title="Mark this alert as resolved"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Resolve</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
