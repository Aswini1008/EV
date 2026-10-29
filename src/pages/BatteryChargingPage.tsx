import React, { useState } from 'react';
import { 
  BatteryData, 
  ChargingEvent, 
  SafetyThresholds 
} from '../types';
import { 
  Zap, 
  Clock, 
  Target, 
  PieChart, 
  Thermometer, 
  ShieldCheck, 
  Power, 
  CheckCircle2, 
  AlertTriangle,
  AlertCircle,
  Battery,
  Plug,
  FileText,
  X,
  Loader2
} from 'lucide-react';

interface BatteryChargingPageProps {
  isOnline: boolean;
  batteryData: BatteryData | null;
  chargingEvents: ChargingEvent[];
  thresholds: SafetyThresholds;
  onSimulateStartCharge?: () => void;
  onSimulateStopCharge?: () => void;
}

export const BatteryChargingPage: React.FC<BatteryChargingPageProps> = ({
  isOnline,
  batteryData,
  chargingEvents,
  thresholds,
  onSimulateStartCharge,
  onSimulateStopCharge
}) => {
  const [isConfirmDisconnectOpen, setIsConfirmDisconnectOpen] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [safetyToast, setSafetyToast] = useState<string | null>(null);

  if (!isOnline || !batteryData) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
        <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 mb-4">
          <AlertCircle className="w-8 h-8 text-rose-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Data Unavailable</h2>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          Charging subsystem and telemetry link from vehicle EV-8849-N3 are currently offline.
        </p>
        <div className="px-4 py-2 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700 font-semibold">
          STATUS: OFFLINE // CHARGING BUS TELEMETRY DOWN
        </div>
      </div>
    );
  }

  const isCurrentlyCharging = batteryData.chargingStatus === 'Charging';
  const currentPercentage = Math.min(100, Math.max(0, Math.round(batteryData.chargingProgress)));
  const remainingPercentage = Math.max(0, 100 - currentPercentage);

  // Format estimated time in hours and minutes
  const formatEstimatedTime = (minutes: number, isCharging: boolean, pct: number): string => {
    if (!isCharging) {
      return pct >= 100 ? 'Full' : 'Paused';
    }
    if (minutes <= 0) return '0 min';
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h} h ${m} min` : `${h} h`;
  };

  // Safe disconnection sequence
  const handleConfirmDisconnect = () => {
    setIsDisconnecting(true);
    // Simulate real-world safe contactor de-energization sequence (ramp current to 0A, open contactor)
    setTimeout(() => {
      setIsDisconnecting(false);
      setIsConfirmDisconnectOpen(false);
      if (onSimulateStopCharge) {
        onSimulateStopCharge();
      }
      setSafetyToast('High-voltage contactor opened safely. Bus current verified at 0.0 A.');
      setTimeout(() => setSafetyToast(null), 4500);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Safety Toast Banner if triggered */}
      {safetyToast && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between shadow-2xs text-emerald-900 text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{safetyToast}</span>
          </div>
          <button onClick={() => setSafetyToast(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Page Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Battery Charging
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time charging progress, power flow, and safety monitoring
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          {isCurrentlyCharging ? (
            <button
              onClick={() => setIsConfirmDisconnectOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-mono font-semibold transition-colors shadow-2xs"
              title="Initiate safe charger disconnection"
            >
              <Power className="w-4 h-4" />
              <span>Disconnect Charger</span>
            </button>
          ) : (
            <button
              onClick={onSimulateStartCharge}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white border border-blue-600 text-xs font-mono font-semibold transition-colors shadow-2xs"
              title="Connect 150kW DC Fast Charger simulation"
            >
              <Zap className="w-4 h-4 text-white fill-white" />
              <span>Connect Charger</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN CHARGING SECTION — VISUAL FOCUS */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5 md:p-6 shadow-xs">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-4 sm:mb-5">
          <Zap className="w-5 h-5 text-[#2563EB] fill-[#2563EB]" />
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Charging Progress
          </h2>
        </div>

        {/* Visual Focus: Clean Automotive Battery Illustration + 4 Metrics Cards Row */}
        <div className="flex flex-col xl:flex-row items-center gap-5 sm:gap-6">
          {/* Automotive Battery Illustration (Left Column) */}
          <div className="flex flex-col items-center justify-center shrink-0 w-full xl:w-auto">
            <div className="relative flex items-center justify-center max-w-full">
              {/* Charging Cable plugged into the left */}
              <div className="relative flex items-center shrink-0 -mr-1 z-10">
                {/* Flexible Cable Wire */}
                <div className={`w-5 sm:w-8 md:w-10 h-2.5 sm:h-3 rounded-l-full transition-colors duration-500 ${
                  isCurrentlyCharging 
                    ? 'bg-blue-600' 
                    : 'bg-slate-300'
                }`} />

                {/* Plug Connector Head */}
                <div className={`w-3.5 sm:w-4 h-7 sm:h-8 rounded-l-md border transition-colors duration-500 flex items-center justify-center ${
                  isCurrentlyCharging
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-slate-200 border-slate-300 text-slate-400'
                }`}>
                  <div className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full ${isCurrentlyCharging ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                </div>
              </div>

              {/* Main Battery Cylinder Body */}
              <div className={`relative w-[200px] xs:w-[220px] sm:w-[260px] h-[85px] sm:h-[95px] rounded-xl bg-slate-100 border-2 p-1.5 transition-all duration-500 overflow-hidden ${
                isCurrentlyCharging 
                  ? 'border-blue-600 shadow-xs' 
                  : 'border-slate-300'
              }`}>
                {/* Interior cell segments */}
                <div className="absolute inset-0 flex divide-x divide-slate-200/80 pointer-events-none z-10">
                  <div className="flex-1" />
                  <div className="flex-1" />
                  <div className="flex-1" />
                  <div className="flex-1" />
                  <div className="flex-1" />
                </div>

                {/* Dynamic Blue Charged Portion Fill */}
                <div
                  className="h-full rounded-lg bg-[#2563EB] transition-all duration-700 ease-out relative"
                  style={{ width: `${currentPercentage}%` }}
                >
                  {/* Subtle clean highlight at the leading edge only when actively charging */}
                  {isCurrentlyCharging && (
                    <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-white/40 rounded-r-md animate-pulse" />
                  )}
                </div>

                {/* Center Content: Lightning Symbol + Percentage Display Directly Inside Battery */}
                <div className="absolute inset-0 flex items-center justify-center gap-1.5 sm:gap-2 pointer-events-none z-20">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white drop-shadow-xs" />
                  <span className="text-2xl sm:text-4xl font-extrabold font-mono text-white tracking-tight drop-shadow-xs">
                    {currentPercentage}%
                  </span>
                </div>
              </div>

              {/* Battery Terminal Cap on the right */}
              <div className="w-3 sm:w-3.5 h-9 sm:h-11 rounded-r-md bg-slate-300 border-y border-r border-slate-400 shrink-0 -ml-0.5" />
            </div>

            {/* "Charging in progress" subtitle below battery */}
            <div className="text-xs font-mono text-slate-600 mt-2 flex items-center gap-1.5 font-medium">
              {isCurrentlyCharging ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  <span className="text-[#2563EB] font-semibold">Active Power Flow ({batteryData.chargingCurrent.toFixed(1)} A)</span>
                </>
              ) : (
                <span className="text-slate-500">Standby / Not Charging</span>
              )}
            </div>
          </div>

          {/* 3. ESSENTIAL CHARGING METRICS (Beside Battery in a 4-Card Row) */}
          <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
            {/* Card 1: Current Charge */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 sm:p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-1.5">
                <Battery className="w-4 h-4 text-[#2563EB]" />
                <span className="text-xs font-medium text-slate-600">Current Charge</span>
              </div>
              <div className="my-1">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
                  {currentPercentage}
                </span>
                <span className="text-sm font-bold text-slate-600 ml-1">%</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Active Pack SoC
              </div>
            </div>

            {/* Card 2: Target Charge */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 sm:p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-1.5">
                <Target className="w-4 h-4 text-[#2563EB]" />
                <span className="text-xs font-medium text-slate-600">Target Charge</span>
              </div>
              <div className="my-1">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
                  100
                </span>
                <span className="text-sm font-bold text-slate-600 ml-1">%</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Full Pack Capacity
              </div>
            </div>

            {/* Card 3: Remaining Charge */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 sm:p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-amber-600 mb-1.5">
                <PieChart className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-medium text-amber-700">Remaining</span>
              </div>
              <div className="my-1">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-600 tracking-tight">
                  {remainingPercentage}
                </span>
                <span className="text-sm font-bold text-amber-600 ml-1">%</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                To reach 100%
              </div>
            </div>

            {/* Card 4: Est. Time to Full */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 sm:p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-1.5">
                <Clock className="w-4 h-4 text-[#2563EB]" />
                <span className="text-xs font-medium text-slate-600">Est. Time to Full</span>
              </div>
              <div className="my-1">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
                  {formatEstimatedTime(batteryData.estimatedTimeToFullMin, isCurrentlyCharging, currentPercentage)}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Dynamic C-CC CV
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. CHARGING STATUS CARDS (Four Balanced Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        {/* Card 1: Charging Status */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5 shadow-xs flex items-center gap-3.5 sm:gap-4">
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-lg bg-blue-50 border border-blue-100 text-[#2563EB] flex items-center justify-center shrink-0">
            <Plug className="w-5 h-5 sm:w-6 sm:h-6 text-[#2563EB]" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Charging Status</div>
            <div className="mt-1">
              <span className={`inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md text-xs font-mono font-bold border ${
                isCurrentlyCharging
                  ? 'bg-blue-50 text-[#2563EB] border-blue-200'
                  : currentPercentage >= 100
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {batteryData.chargingStatus}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 sm:mt-1">
              {isCurrentlyCharging ? 'Power transfer active' : 'Contactor open'}
            </div>
          </div>
        </div>

        {/* Card 2: Battery Temperature */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5 shadow-xs flex items-center gap-3.5 sm:gap-4">
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-lg bg-blue-50 border border-blue-100 text-[#2563EB] flex items-center justify-center shrink-0">
            <Thermometer className="w-5 h-5 sm:w-6 sm:h-6 text-[#2563EB]" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Battery Temperature</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tracking-tight mt-0.5">
              {batteryData.chargingTemp.toFixed(1)} °C
            </div>
            <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
              <span className="text-[11px] text-slate-500 font-mono">Limit: {thresholds.chargingCutoffTemp} °C</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                {batteryData.chargingTempStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Charging Current */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5 shadow-xs flex items-center gap-3.5 sm:gap-4">
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] font-mono font-bold text-base sm:text-lg shrink-0">
            A
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-slate-500 font-medium">Charging Current</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tracking-tight mt-0.5">
              {batteryData.chargingCurrent.toFixed(1)} A
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              Max limit: {thresholds.maxChargingCurrent} A
            </div>
            {/* Clean Progress bar */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden border border-slate-200">
              <div 
                className="h-full bg-[#2563EB] rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (batteryData.chargingCurrent / thresholds.maxChargingCurrent) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 4: Charging Voltage */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5 shadow-xs flex items-center gap-3.5 sm:gap-4">
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-lg bg-blue-50 border border-blue-100 text-[#2563EB] flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[#2563EB]" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Charging Voltage</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tracking-tight mt-0.5">
              {batteryData.chargingVoltage.toFixed(1)} V
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5 sm:mt-1">
              DC Bus potential
            </div>
          </div>
        </div>
      </div>

      {/* 5. CHARGING SAFETY STATUS PANEL */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-emerald-950 tracking-tight">
              Charging Safety Status
            </h2>
            <p className="text-xs text-emerald-800 mt-0.5">
              {batteryData.chargingSafetyExplanation}
            </p>
          </div>
        </div>

        <div className="shrink-0 self-start sm:self-center">
          <span className="px-5 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
            NORMAL
          </span>
        </div>
      </div>

      {/* 6. CHARGING EVENTS / ALERTS TIMELINE */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 md:p-6 shadow-xs">
        {/* Timeline Header */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[#2563EB]" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Charging Events / Alerts
            </h2>
          </div>
          <span className="px-3 py-0.5 rounded-full text-xs font-mono font-semibold bg-slate-100 text-slate-700">
            {chargingEvents.length} Events
          </span>
        </div>

        {/* Timeline Items with Connecting Line */}
        {chargingEvents.length === 0 ? (
          <div className="py-8 px-4 text-center rounded-xl bg-slate-50 border border-slate-200">
            <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <div className="text-sm font-semibold text-slate-700">
              No charging events or alerts logged.
            </div>
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-[2px] before:bg-slate-200">
            {chargingEvents.map((evt, idx) => {
              const isFirst = idx === 0;
              return (
                <div key={evt.id} className="relative flex items-start justify-between gap-4">
                  {/* Timeline Dot Node */}
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-[#2563EB] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#2563EB]" />
                  </div>

                  {/* Event Content */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0 mt-0.5">
                      {isFirst ? (
                        <Zap className="w-4 h-4 fill-[#2563EB] text-[#2563EB]" />
                      ) : (
                        <FileText className="w-4 h-4 text-[#2563EB]" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {evt.event}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        {evt.details}
                      </div>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-semibold text-slate-800">
                      {evt.timestamp}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {evt.date || 'Nov 10, 2026'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Safe Disconnect Confirmation Modal */}
      {isConfirmDisconnectOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          onClick={() => !isDisconnecting && setIsConfirmDisconnectOpen(false)}
        >
          <div 
            className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Confirm Safe Disconnection
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  The vehicle is currently drawing <strong className="text-slate-800 font-mono">{batteryData.chargingCurrent.toFixed(1)} A</strong> at <strong className="text-slate-800 font-mono">{batteryData.chargingVoltage.toFixed(1)} V</strong>.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5 mb-5 font-mono">
              <div className="flex justify-between">
                <span>DC Contactor Interlock:</span>
                <span className="font-semibold text-slate-800">Engaged</span>
              </div>
              <div className="flex justify-between">
                <span>Current De-energization:</span>
                <span className="font-semibold text-blue-600">Automated Ramp to 0.0 A</span>
              </div>
              <p className="text-[11px] text-slate-500 font-sans pt-1 border-t border-slate-200">
                Opening contactors under high load causes dangerous arcing. The BMS will command 0A current before opening contactors.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isDisconnecting}
                onClick={() => setIsConfirmDisconnectOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDisconnecting}
                onClick={handleConfirmDisconnect}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white transition-colors flex items-center gap-1.5 disabled:opacity-60 shadow-2xs"
              >
                {isDisconnecting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Opening Contactors...</span>
                  </>
                ) : (
                  <>
                    <Power className="w-3.5 h-3.5" />
                    <span>Confirm Safe Disconnect</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
