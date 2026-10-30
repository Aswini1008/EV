/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  BatteryData, 
  TrendDataPoint, 
  AnomalyEvent, 
  ChargingEvent, 
  SafetyThresholds, 
  SimulationScenario,
  VehicleProfile 
} from './types';
import { 
  DEFAULT_THRESHOLDS, 
  createScenarioData, 
  simulateSensorTick, 
  generateInitialTrends
} from './utils/batteryEngine';
import { TopNavbar } from './components/TopNavbar';
import { Sidebar, NavItem } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { BatteryHealthPage } from './pages/BatteryHealthPage';
import { BatteryChargingPage } from './pages/BatteryChargingPage';
import { CellLevelPage } from './pages/CellLevelPage';
import { AlertsHistoryPage } from './pages/AlertsHistoryPage';
import { VehicleProfilePage } from './pages/VehicleProfilePage';
import { ProfileModal } from './components/ProfileModal';

export default function App() {
  // Navigation State (Default to Page 1: Battery Health & Vehicle Status)
  const [currentTab, setCurrentTab] = useState<NavItem>('battery_health');

  // Connection State (Online / Offline)
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Profile Modal State
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // Stored Vehicle & Authenticated User Profile
  const vehicleProfile: VehicleProfile = {
    vehicleNumber: 'EV-8849-N3',
    vehicleModel: 'Electric Sedan',
    yearOfPurchase: '2024',
    status: isOnline ? 'Connected' : 'Disconnected',
    userName: 'EV Engineer',
    userRole: 'Vehicle Owner',
  };

  // Internal Battery Safety Thresholds & Scenario (managed automatically by AI/BMS backend)
  const thresholds: SafetyThresholds = DEFAULT_THRESHOLDS;
  const currentScenario: SimulationScenario = 'nominal_drive';

  // Initialize data matching baseline telemetry
  const initialScenario = createScenarioData(currentScenario, thresholds);
  const [batteryData, setBatteryData] = useState<BatteryData>(initialScenario.data);
  const [anomalies, setAnomalies] = useState<AnomalyEvent[]>(initialScenario.anomalies);
  const [chargingEvents, setChargingEvents] = useState<ChargingEvent[]>(initialScenario.chargingEvents);

  // Time Series Trends for the Single Graph
  const [trends] = useState<TrendDataPoint[]>(generateInitialTrends);

  // Manual refresh button handler
  const handleRefresh = () => {
    setBatteryData(prev => simulateSensorTick(prev, thresholds));
  };

  // Quick Charge Connect on Battery Charging page
  const handleStartCharging = () => {
    const scenarioResult = createScenarioData('fast_charging', thresholds);
    setBatteryData(scenarioResult.data);
    setChargingEvents(scenarioResult.chargingEvents);
  };

  // Quick Charge Disconnect on Battery Charging page
  const handleStopCharging = () => {
    const scenarioResult = createScenarioData('nominal_drive', thresholds);
    setBatteryData(scenarioResult.data);
  };

  // Clear Alerts handler
  const handleClearAlerts = () => {
    setAnomalies([]);
    setChargingEvents([]);
    setBatteryData(b => ({
      ...b,
      riskStatus: 'NORMAL',
      riskReason: 'No immediate risk detected. All cells nominal.',
    }));
  };

  // Resolve Single Alert
  const handleResolveAlert = (id: string) => {
    setAnomalies(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, severity: 'Resolved' as const } : a);
      const remainingUnresolved = updated.filter(a => a.severity !== 'Resolved').length;
      if (remainingUnresolved === 0) {
        setBatteryData(b => ({
          ...b,
          riskStatus: 'NORMAL',
          riskReason: 'No immediate risk detected. All cells nominal.',
        }));
      }
      return updated;
    });
    setChargingEvents(prev => prev.filter(c => c.id !== id));
  };

  // Dynamic live telemetry polling effect (AI continuous monitoring)
  useEffect(() => {
    if (!isOnline) return;

    const interval = setInterval(() => {
      setBatteryData(prev => simulateSensorTick(prev, thresholds));
    }, 2000);

    return () => clearInterval(interval);
  }, [isOnline, thresholds]);

  // Compute active alert count for bell badge (in reference image, 3 unread events)
  const activeAlertCount = anomalies.filter(a => a.severity !== 'Resolved').length;

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#172033] flex flex-col font-sans">
      {/* 1. Top Navigation Bar */}
      <TopNavbar
        isOnline={isOnline}
        onToggleOnline={() => setIsOnline(!isOnline)}
        activeAlertCount={activeAlertCount}
        highestRisk={batteryData.riskStatus}
        onOpenAlerts={() => setCurrentTab('alerts_history')}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content Area: Sidebar + Dashboard Stage */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* 2. Sidebar Navigation — Exactly Four Items */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          activeAlertCount={activeAlertCount}
        />

        {/* Dynamic Page Container with bottom spacing for mobile navigation */}
        <main className="flex-1 p-3.5 sm:p-5 md:p-6 lg:p-7 max-w-[1500px] w-full mx-auto overflow-y-auto pb-24 md:pb-6">
          {currentTab === 'battery_health' && (
            <BatteryHealthPage
              isOnline={isOnline}
              batteryData={batteryData}
              trends={trends}
              anomalies={anomalies}
              thresholds={thresholds}
              onRefresh={handleRefresh}
            />
          )}

          {currentTab === 'battery_charging' && (
            <BatteryChargingPage
              isOnline={isOnline}
              batteryData={batteryData}
              chargingEvents={chargingEvents}
              thresholds={thresholds}
              onSimulateStartCharge={handleStartCharging}
              onSimulateStopCharge={handleStopCharging}
            />
          )}

          {currentTab === 'cell_level' && (
            <CellLevelPage isOnline={isOnline} />
          )}

          {currentTab === 'alerts_history' && (
            <AlertsHistoryPage
              anomalies={anomalies}
              chargingEvents={chargingEvents}
              onClearAlerts={handleClearAlerts}
              onResolveAlert={handleResolveAlert}
            />
          )}

          {currentTab === 'vehicle_profile' && (
            <VehicleProfilePage
              isOnline={isOnline}
              profile={vehicleProfile}
            />
          )}
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        activeAlertCount={activeAlertCount}
      />

      {/* User Profile / Vehicle Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={vehicleProfile}
        isOnline={isOnline}
      />
    </div>
  );
}
