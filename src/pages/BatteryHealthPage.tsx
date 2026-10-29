import React, { useState } from 'react';
import { 
  BatteryData, 
  TrendDataPoint, 
  AnomalyEvent, 
  SafetyThresholds 
} from '../types';
import { CircularSoCGauge } from '../components/CircularSoCGauge';
import { BatteryTrendsGraph } from '../components/BatteryTrendsGraph';
import { 
  Activity,
  Zap, 
  Car, 
  Thermometer, 
  ShieldCheck, 
  RotateCw, 
  Cpu, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDown, 
  GitFork, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface BatteryHealthPageProps {
  isOnline: boolean;
  batteryData: BatteryData | null;
  trends: TrendDataPoint[];
  anomalies: AnomalyEvent[];
  thresholds: SafetyThresholds;
  onRefresh?: () => void;
}

export const BatteryHealthPage: React.FC<BatteryHealthPageProps> = ({
  isOnline,
  batteryData,
  trends,
  anomalies,
  onRefresh,
}) => {
  const [isRotating, setIsRotating] = useState(false);

  const handleRefreshClick = () => {
    setIsRotating(true);
    if (onRefresh) onRefresh();
    setTimeout(() => setIsRotating(false), 800);
  };

  if (!isOnline || !batteryData) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
        <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 mb-4">
          <AlertCircle className="w-8 h-8 text-rose-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Data Unavailable</h2>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          The telemetry connection to the ESP32 sensor unit on vehicle EV-8849-N3 is currently offline or unreachable.
        </p>
        <div className="px-4 py-2 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700 font-semibold">
          STATUS: OFFLINE // SENSOR LINK DOWN
        </div>
      </div>
    );
  }

  // Active Anomaly count for badge (excluding resolved)
  const activeEventsCount = anomalies.filter(a => a.severity !== 'Resolved').length;

  return (
    <div className="space-y-6">
      {/* Page Title & Status Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              <span className="sm:hidden">Battery Health</span>
              <span className="hidden sm:inline">Battery Health & Vehicle Status</span>
            </h1>
            <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono text-slate-600 bg-slate-100 border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              Live Telemetry Feed (ESP32 BMS)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
            <span className="sm:hidden">Vehicle status and battery safety</span>
            <span className="hidden sm:inline">Real-time battery condition and vehicle performance</span>
          </p>
        </div>

        {/* Mobile: Online badge */}
        <div className="flex items-center gap-2">
          <div className="sm:hidden">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Desktop Last Updated & Refresh */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">BMS Sensor Tick</div>
              <div className="text-xs font-mono text-slate-800 font-semibold">2s Stream Active</div>
            </div>
            <button
              onClick={handleRefreshClick}
              className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
              title="Refresh sensor telemetry"
              aria-label="Refresh telemetry"
            >
              <RotateCw className={`w-4 h-4 text-slate-600 ${isRotating ? 'animate-spin text-[#2563EB]' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE TOP SECTION (< lg) */}
      <div className="lg:hidden space-y-3.5">
        {/* 1. BATTERY LEVEL CARD */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="text-[11px] font-mono tracking-wider text-slate-500 uppercase font-semibold mb-3">
            BATTERY LEVEL
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* Circular Gauge */}
            <div className="shrink-0">
              <CircularSoCGauge
                value={batteryData.soc}
                size={120}
                strokeWidth={8}
                subtitle="CHARGED"
                showIcon={false}
              />
            </div>

            {/* Estimated Range & Temperature */}
            <div className="flex-1 space-y-3 min-w-0">
              {/* Estimated Range */}
              <div>
                <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-0.5">
                  <Car className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                  <span className="truncate">Estimated range</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tracking-tight">
                  {batteryData.rangeKm} km
                </div>
              </div>

              {/* Temperature */}
              <div>
                <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-0.5">
                  <Thermometer className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                  <span className="truncate">Temperature</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tracking-tight">
                    {batteryData.packTemperature.toFixed(1)}°C
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {batteryData.temperatureStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. TWO-COLUMN GRID: Vehicle Status & Battery Risk */}
        <div className="grid grid-cols-2 gap-3">
          {/* Vehicle Status Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 sm:p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-2 text-[#2563EB] mb-2">
              <Activity className="w-4 h-4 shrink-0" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Vehicle status</div>
              <div className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-0.5">
                {batteryData.vehicleStatus === 'Discharging' ? 'Discharging' : batteryData.vehicleStatus}
              </div>
            </div>
          </div>

          {/* Battery Risk Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 sm:p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-2 text-emerald-600 mb-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Battery risk</div>
              <div className="text-base sm:text-lg font-bold text-emerald-700 tracking-tight mt-0.5">
                {batteryData.riskStatus === 'NORMAL' ? 'Normal' : batteryData.riskStatus}
              </div>
            </div>
          </div>
        </div>

        {/* 3. SAFETY MESSAGE CARD — Dynamically matches active conditions */}
        {batteryData.riskStatus === 'CRITICAL' ? (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-rose-950 tracking-tight">
                Critical Safety Alert
              </div>
              <div className="text-xs text-rose-800 mt-0.5">
                {batteryData.riskReason}
              </div>
            </div>
          </div>
        ) : activeEventsCount > 0 || batteryData.riskStatus === 'WARNING' ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-amber-950 tracking-tight">
                Active Attention Required ({activeEventsCount} {activeEventsCount === 1 ? 'Alert' : 'Alerts'})
              </div>
              <div className="text-xs text-amber-800 mt-0.5">
                {batteryData.riskReason || 'Cell voltage deviation or abnormal thermal gradient detected.'}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 sm:p-4 shadow-2xs flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-emerald-950 tracking-tight">
                Battery operating normally
              </div>
              <div className="text-xs text-emerald-800 mt-0.5">
                No active safety concerns detected. All 96 cells nominal.
              </div>
            </div>
          </div>
        )}

        {/* 4. ELECTRICAL PARAMETERS: Voltage & Current compact 2-column grid on mobile */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Zap className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Voltage</span>
            </div>
            <div className="flex items-baseline justify-between gap-1">
              <span className="text-lg font-bold font-mono text-slate-900">
                {batteryData.packVoltage.toFixed(1)} V
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                {batteryData.voltageStatus}
              </span>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <div className="w-3.5 h-3.5 rounded-full border border-blue-600 flex items-center justify-center text-[8px] font-bold text-[#2563EB]">A</div>
              <span>Current</span>
            </div>
            <div className="flex items-baseline justify-between gap-1">
              <span className="text-lg font-bold font-mono text-slate-900">
                {batteryData.packCurrent.toFixed(1)} A
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                {batteryData.currentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP TOP ROW (>= lg): Exactly Four Cards */}
      <div className="hidden lg:grid grid-cols-12 gap-5 items-stretch">
        {/* CARD 1: State of Charge (SoC) */}
        <div className="lg:col-span-4 bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs flex flex-col justify-between h-full">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-[#2563EB]" />
            <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
              State of Charge (SoC)
            </h2>
          </div>

          <div className="flex items-center justify-between gap-4 py-1">
            {/* Circular Gauge */}
            <div className="shrink-0">
              <CircularSoCGauge value={batteryData.soc} size={135} strokeWidth={9} />
            </div>

            {/* Estimated Range & Temp Column */}
            <div className="flex-1 space-y-4">
              {/* Estimated Driving Range */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <Car className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">Estimated Driving Range</div>
                  <div className="text-xl font-bold text-slate-900 tracking-tight font-mono">
                    {batteryData.rangeKm} km
                  </div>
                  <div className="text-[10px] text-slate-400">
                    ({batteryData.remainingTimeFormatted})
                  </div>
                </div>
              </div>

              {/* Battery Temperature */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <Thermometer className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">Battery Temperature</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-slate-900 tracking-tight font-mono">
                      {batteryData.packTemperature.toFixed(1)} °C
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {batteryData.temperatureStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full pt-3 mt-1 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Cell Architecture</span>
            <span className="font-mono text-slate-700 font-semibold">96S Li-Ion High-Voltage Pack</span>
          </div>
        </div>

        {/* CARD 2: Battery Electrical Parameters (Voltage & Current) */}
        <div className="lg:col-span-3 bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs flex flex-col justify-between h-full">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-[#2563EB]" />
            <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
              Electrical Parameters
            </h2>
          </div>

          <div className="space-y-3.5 my-auto py-1">
            {/* Battery Voltage */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Pack Potential</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {batteryData.voltageStatus}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                {batteryData.packVoltage.toFixed(1)} <span className="text-sm font-sans font-medium text-slate-500">V</span>
              </div>
            </div>

            <div className="h-[1px] bg-slate-100" />

            {/* Battery Current */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Current Draw</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {batteryData.currentStatus}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                {batteryData.packCurrent.toFixed(1)} <span className="text-sm font-sans font-medium text-slate-500">A</span>
              </div>
            </div>
          </div>

          <div className="w-full pt-3 mt-1 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Active Bus Power</span>
            <span className="font-mono font-semibold text-slate-700">
              {((batteryData.packVoltage * Math.abs(batteryData.packCurrent)) / 1000).toFixed(2)} kW
            </span>
          </div>
        </div>

        {/* CARD 3: Vehicle Status */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs flex flex-col justify-between items-center text-center h-full">
          <div className="flex items-center gap-2 self-start mb-2">
            <Car className="w-4 h-4 text-[#2563EB]" />
            <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
              Vehicle Status
            </h2>
          </div>

          <div className="my-auto py-2 flex flex-col items-center">
            <div className="px-3.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-[#2563EB] text-xs font-bold tracking-wide">
              {batteryData.vehicleStatus === 'Discharging' ? 'Discharging / Running' : batteryData.vehicleStatus}
            </div>
            <div className="text-xs text-slate-500 mt-2.5 font-normal">
              {batteryData.vehicleStatusText}
            </div>
          </div>

          <div className="w-full pt-3 mt-1 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Powertrain Link</span>
            <span className="font-mono text-emerald-600 font-semibold">CAN-Bus Active</span>
          </div>
        </div>

        {/* CARD 4: Risk Status */}
        <div className="lg:col-span-3 bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs flex flex-col justify-between items-center text-center h-full">
          <div className="flex items-center gap-2 self-start mb-2">
            <ShieldCheck className={`w-4 h-4 ${
              batteryData.riskStatus === 'CRITICAL' ? 'text-rose-600' :
              batteryData.riskStatus === 'WARNING' ? 'text-amber-600' : 'text-emerald-600'
            }`} />
            <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
              Risk Status
            </h2>
          </div>

          <div className="my-auto py-2 flex flex-col items-center">
            <div className={`px-6 py-1.5 rounded-lg text-xs md:text-sm font-bold tracking-wider border ${
              batteryData.riskStatus === 'CRITICAL'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : batteryData.riskStatus === 'WARNING'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {batteryData.riskStatus}
            </div>
            <div className="text-xs text-slate-600 mt-2.5 font-normal max-w-[220px] leading-relaxed">
              {batteryData.riskReason}
            </div>
          </div>

          <div className="w-full pt-3 mt-1 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Safety Interlock</span>
            <span className="font-semibold text-emerald-600">ENGAGED</span>
          </div>
        </div>
      </div>

      {/* ONE GRAPH ONLY: Battery Trends — Last 60 Minutes */}
      <div>
        <BatteryTrendsGraph trends={trends} />
      </div>

      {/* CELL-LEVEL KEY METRICS: 4 Cards */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Cpu className="w-4 h-4 text-[#2563EB]" />
          <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
            Cell-Level Key Metrics
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {/* 1. Average Cell Voltage */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 sm:p-5 shadow-xs flex flex-col justify-between sm:flex-row sm:items-center gap-2">
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-[#2563EB]" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">Avg Cell Voltage</div>
                <div className="text-lg sm:text-2xl font-bold text-slate-900 font-mono tracking-tight mt-0.5">
                  {batteryData.avgCellVoltage.toFixed(2)} V
                </div>
              </div>
            </div>
            <span className="self-start sm:self-auto px-2 sm:px-2.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {batteryData.avgCellStatus}
            </span>
          </div>

          {/* 2. Maximum Cell Voltage */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 sm:p-5 shadow-xs flex flex-col justify-between sm:flex-row sm:items-center gap-2">
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#2563EB]" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">Max Cell Voltage</div>
                <div className="text-lg sm:text-2xl font-bold text-slate-900 font-mono tracking-tight mt-0.5">
                  {batteryData.maxCellVoltage.toFixed(2)} V
                </div>
              </div>
            </div>
            <span className="self-start sm:self-auto px-2 sm:px-2.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {batteryData.maxCellStatus}
            </span>
          </div>

          {/* 3. Minimum Cell Voltage */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 sm:p-5 shadow-xs flex flex-col justify-between sm:flex-row sm:items-center gap-2">
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#2563EB]" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">Min Cell Voltage</div>
                <div className="text-lg sm:text-2xl font-bold text-slate-900 font-mono tracking-tight mt-0.5">
                  {batteryData.minCellVoltage.toFixed(2)} V
                </div>
              </div>
            </div>
            <span className="self-start sm:self-auto px-2 sm:px-2.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {batteryData.minCellStatus}
            </span>
          </div>

          {/* 4. Cell Voltage Spread */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 sm:p-5 shadow-xs flex flex-col justify-between sm:flex-row sm:items-center gap-2">
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <GitFork className="w-4 h-4 sm:w-5 sm:h-5 text-[#2563EB]" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">Cell Spread</div>
                <div className="text-lg sm:text-2xl font-bold text-slate-900 font-mono tracking-tight mt-0.5">
                  {batteryData.cellVoltageSpread.toFixed(2)} V
                </div>
              </div>
            </div>
            <span className={`self-start sm:self-auto px-2 sm:px-2.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-semibold border ${
              batteryData.spreadStatus === 'Warning'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {batteryData.spreadStatus}
            </span>
          </div>
        </div>
      </div>

      {/* ANOMALIES / FAULTS — Bottom Section */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5 md:p-6 shadow-xs">
        {/* Table Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-start gap-3">
            <div className="p-1 rounded-md text-amber-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Anomalies / Faults
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                AI pattern recognition detects abnormal battery behaviour
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-slate-100 text-slate-700">
              {activeEventsCount} {activeEventsCount === 1 ? 'event' : 'events'}
            </span>
          </div>
        </div>

        {/* Anomalies Content */}
        {anomalies.length === 0 ? (
          <div className="py-8 sm:py-10 px-4 text-center rounded-xl bg-slate-50 border border-slate-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-90" />
            <div className="text-sm font-semibold text-slate-800">
              No anomalies, defects or faults detected.
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              All 96 battery cells operating within nominal electrochemical thresholds.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Cards View (< sm) */}
            <div className="sm:hidden space-y-2.5">
              {anomalies.map((anom) => {
                const isWarning = anom.severity === 'Warning';
                const isCritical = anom.severity === 'Critical';
                const isResolved = anom.severity === 'Resolved';

                return (
                  <div
                    key={anom.id}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="shrink-0">
                        {anom.iconType === 'voltage' && <Car className="w-4 h-4 text-amber-500" />}
                        {anom.iconType === 'temperature' && <Thermometer className="w-4 h-4 text-rose-500" />}
                        {anom.iconType === 'current' && <Activity className="w-4 h-4 text-blue-500" />}
                        {anom.iconType === 'check' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        {anom.iconType === 'alert' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-slate-900 truncate">
                          {anom.event}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                          <span className="font-mono">{anom.time}</span>
                          <span>•</span>
                          <span className={
                            isCritical ? 'text-rose-600 font-semibold' :
                            isWarning ? 'text-amber-600 font-semibold' :
                            isResolved ? 'text-emerald-600 font-semibold' : 'text-blue-600 font-semibold'
                          }>
                            {anom.severity}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                );
              })}
            </div>

            {/* Desktop & Tablet Table (>= sm) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-200 text-[11px] font-mono">
                    <th className="py-2.5 px-3 w-28">Time</th>
                    <th className="py-2.5 px-3">Event</th>
                    <th className="py-2.5 px-3 w-36 text-left">Severity</th>
                    <th className="py-2.5 px-2 w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {anomalies.map((anom) => {
                    const isWarning = anom.severity === 'Warning';
                    const isCritical = anom.severity === 'Critical';
                    const isResolved = anom.severity === 'Resolved';

                    return (
                      <tr 
                        key={anom.id}
                        className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      >
                        <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">
                          {anom.time}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            {anom.iconType === 'voltage' && <Car className="w-4 h-4 text-amber-500 shrink-0" />}
                            {anom.iconType === 'temperature' && <Thermometer className="w-4 h-4 text-rose-500 shrink-0" />}
                            {anom.iconType === 'current' && <Activity className="w-4 h-4 text-blue-500 shrink-0" />}
                            {anom.iconType === 'check' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                            {anom.iconType === 'alert' && <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />}
                            <span className="text-slate-900 font-medium leading-normal">
                              {anom.event}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap text-left">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${
                              isCritical
                                ? 'bg-rose-500'
                                : isWarning
                                ? 'bg-amber-500'
                                : isResolved
                                ? 'bg-emerald-500'
                                : 'bg-blue-500'
                            }`} />
                            <span className={`font-semibold ${
                              isCritical
                                ? 'text-rose-600'
                                : isWarning
                                ? 'text-amber-600'
                                : isResolved
                                ? 'text-emerald-600'
                                : 'text-blue-600'
                            }`}>
                              {anom.severity}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors inline-block" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
