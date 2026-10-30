export type VehicleStatus = 'Discharging' | 'Charging' | 'Idle';

export type RiskStatus = 'NORMAL' | 'WARNING' | 'CRITICAL';

export type ChargingStatus = 'Charging' | 'Fully Charged' | 'Not Charging';

export type SeverityType = 'Critical' | 'Warning' | 'Info' | 'Resolved';

export interface BatteryData {
  // Main status
  soc: number; // 0 - 100%
  rangeKm: number; // km
  remainingTimeFormatted: string; // e.g. "~ 5 h 30 min"
  packTemperature: number; // °C
  temperatureStatus: 'Normal' | 'Warning' | 'Critical';
  packVoltage: number; // V
  voltageStatus: 'Normal' | 'Warning' | 'Critical';
  packCurrent: number; // A
  currentStatus: 'Normal' | 'Warning' | 'Critical';
  vehicleStatus: VehicleStatus;
  vehicleStatusText: string; // e.g. "Using battery power"
  
  // Risk & Anomaly Assessment
  riskStatus: RiskStatus;
  riskReason: string;

  // Cell-Level Key Metrics (4 cards)
  avgCellVoltage: number; // V
  avgCellStatus: 'Normal' | 'Warning' | 'Critical';
  maxCellVoltage: number; // V
  maxCellIndex: number;
  maxCellStatus: 'Normal' | 'Warning' | 'Critical';
  minCellVoltage: number; // V
  minCellIndex: number;
  minCellStatus: 'Normal' | 'Warning' | 'Critical';
  cellVoltageSpread: number; // V (e.g. 0.08 V)
  spreadStatus: 'Normal' | 'Warning' | 'Critical';

  // Charging Specifics (Page 2)
  chargingProgress: number; // %
  targetCharge: number; // 100%
  remainingCharge: number; // %
  estimatedTimeToFullMin: number; // minutes
  chargingStatus: ChargingStatus;
  chargingTemp: number; // °C
  chargingTempStatus: 'Normal' | 'Warning' | 'Critical';
  chargingCurrent: number; // A
  chargingVoltage: number; // V
  chargingSafetyStatus: 'Green' | 'Amber' | 'Red';
  chargingSafetyExplanation: string;
}

export interface TrendDataPoint {
  timeLabel: string; // e.g. "11:50"
  timeOffsetMin: number; // -60 to 0
  soc: number; // %
  temperature: number; // °C
  voltage: number; // V
}

export interface AnomalyEvent {
  id: string;
  time: string; // e.g. "13:12"
  date?: string; // e.g. "29 Oct 2026"
  fullTimestamp: string; // e.g. "2026-10-29 13:12:00"
  event: string; // e.g. "Cell 18 voltage deviation detected"
  title?: string;
  description?: string; // Detailed description
  severity: SeverityType;
  iconType: 'voltage' | 'temperature' | 'current' | 'check' | 'alert' | 'plug' | 'info' | 'warning';
  isMockData?: boolean;
}

export interface ChargingEvent {
  id: string;
  timestamp: string;
  date?: string;
  event: string;
  details: string;
  severity: 'Normal' | 'Warning' | 'Critical';
}

export interface SafetyThresholds {
  maxCellVoltage: number; // e.g. 4.20 V
  minCellVoltage: number; // e.g. 3.00 V
  maxVoltageSpread: number; // e.g. 0.080 V (80mV)
  maxPackTemp: number; // e.g. 45.0 °C
  criticalPackTemp: number; // e.g. 52.0 °C
  chargingCutoffTemp: number; // e.g. 48.0 °C
  maxChargingCurrent: number; // e.g. 150 A
}

export type SimulationScenario = 
  | 'nominal_drive' 
  | 'high_load' 
  | 'fast_charging' 
  | 'cell_drift_anomaly' 
  | 'thermal_warning' 
  | 'idle_parked';

export interface VehicleProfile {
  vehicleNumber: string;
  vehicleModel: string;
  yearOfPurchase: string;
  status: 'Connected' | 'Disconnected';
  userName: string;
  userRole: string;
}

export interface CellDiagnostic {
  id: number;
  label: string; // e.g. "Cell 01"
  row: number; // 1, 2, or 3
  col: number; // 1, 2, 3, or 4
  voltage: number; // in Volts, e.g. 4.12
  nominalVoltage: number; // 4.12
  voltageDelta: number; // e.g. -0.30 V
  temperature: number; // in °C, e.g. 28.5
  tempDelta: number; // e.g. +13.9 °C
  resistance: number; // in mΩ, e.g. 0.85
  soc: number; // in %, e.g. 82
  status: 'Normal' | 'Warning' | 'Critical';
  hasError: boolean;
  errorName?: string;
  errorCode?: string;
  errorDescription?: string;
  recommendedAction?: string;
}

