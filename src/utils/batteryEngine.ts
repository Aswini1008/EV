import { 
  BatteryData, 
  TrendDataPoint, 
  AnomalyEvent, 
  ChargingEvent, 
  SafetyThresholds, 
  SimulationScenario,
  RiskStatus
} from '../types';

export const DEFAULT_THRESHOLDS: SafetyThresholds = {
  maxCellVoltage: 4.20,
  minCellVoltage: 3.00,
  maxVoltageSpread: 0.080, // 0.08 V (80 mV)
  maxPackTemp: 45.0,
  criticalPackTemp: 52.0,
  chargingCutoffTemp: 48.0,
  maxChargingCurrent: 150.0,
};

/**
 * Calculates remaining driving time estimate based on range and average city/highway speed (~40-50 km/h)
 */
export function calculateRemainingDriveTime(rangeKm: number, currentA: number): string {
  if (rangeKm <= 0) return '0 min';
  // If drawing ~24.8A at ~358V -> ~8.8 kW draw. 142 km at 25-30 km/h average city drive ~ 5h 30m
  const hours = Math.floor(rangeKm / 26);
  const minutes = Math.round((rangeKm % 26) * 1.5);
  return `~ ${hours} h ${minutes} min`;
}

/**
 * Generates historical trend data matching reference image axes:
 * SoC: ~82% - 88% (cyan, axis 0-100)
 * Temperature: ~30°C - 33°C (orange, axis 0-60)
 * Voltage: ~355V - 362V (blue, axis 300-450)
 */
export function generateInitialTrends(): TrendDataPoint[] {
  // Points matching the reference image curve at 10-minute intervals
  return [
    { timeLabel: '11:50', timeOffsetMin: -60, soc: 86.4, temperature: 31.0, voltage: 355.2 },
    { timeLabel: '12:00', timeOffsetMin: -50, soc: 85.2, temperature: 31.4, voltage: 356.1 },
    { timeLabel: '12:10', timeOffsetMin: -40, soc: 84.5, temperature: 32.1, voltage: 358.4 },
    { timeLabel: '12:20', timeOffsetMin: -30, soc: 84.1, temperature: 32.8, voltage: 361.0 },
    { timeLabel: '12:30', timeOffsetMin: -20, soc: 83.2, temperature: 32.2, voltage: 357.5 },
    { timeLabel: '12:40', timeOffsetMin: -10, soc: 82.5, temperature: 32.5, voltage: 358.0 },
    { timeLabel: '12:50', timeOffsetMin: 0,   soc: 82.0, temperature: 32.4, voltage: 358.1 },
  ];
}

/**
 * Default events matching the reference image table
 */
export const DEFAULT_ANOMALY_EVENTS: AnomalyEvent[] = [
  {
    id: 'evt-1',
    time: '13:12',
    date: '29 Oct 2026',
    fullTimestamp: '2026-10-29 13:12:00',
    event: 'Cell 18 voltage deviation detected',
    description: 'Battery cell voltage is outside the normal range. System is monitoring the cell.',
    severity: 'Warning',
    iconType: 'warning',
    isMockData: true,
  },
  {
    id: 'evt-2',
    time: '12:48',
    date: '29 Oct 2026',
    fullTimestamp: '2026-10-29 12:48:00',
    event: 'Battery temperature is higher than expected',
    description: 'Battery temperature has crossed the normal threshold. Please monitor the temperature.',
    severity: 'Warning',
    iconType: 'temperature',
    isMockData: true,
  },
  {
    id: 'evt-3',
    time: '12:21',
    date: '29 Oct 2026',
    fullTimestamp: '2026-10-29 12:21:00',
    event: 'Charging started',
    description: 'Vehicle connected to DC fast charger at CCS Combo 2 port.',
    severity: 'Info',
    iconType: 'info',
    isMockData: true,
  },
  {
    id: 'evt-4',
    time: '11:56',
    date: '29 Oct 2026',
    fullTimestamp: '2026-10-29 11:56:00',
    event: 'Normal operating pattern restored',
    description: 'All battery parameters are back within normal limits.',
    severity: 'Resolved',
    iconType: 'check',
    isMockData: true,
  },
  {
    id: 'evt-5',
    time: '10:32',
    date: '29 Oct 2026',
    fullTimestamp: '2026-10-29 10:32:00',
    event: 'Vehicle connected',
    description: 'Vehicle connected to charger.',
    severity: 'Info',
    iconType: 'plug',
    isMockData: true,
  },
];

/**
 * Creates battery telemetry state for a chosen scenario
 */
export function createScenarioData(scenario: SimulationScenario, thresholds: SafetyThresholds): {
  data: BatteryData;
  anomalies: AnomalyEvent[];
  chargingEvents: ChargingEvent[];
} {
  if (scenario === 'fast_charging') {
    const soc = 56;
    const temp = 34.2;
    const current = 125.4; // A
    const voltage = 402.6; // V
    const spread = 0.05;

    return {
      data: {
        soc,
        rangeKm: 98,
        remainingTimeFormatted: 'Charging in progress',
        packTemperature: temp,
        temperatureStatus: 'Normal',
        packVoltage: voltage,
        voltageStatus: 'Normal',
        packCurrent: current,
        currentStatus: 'Normal',
        vehicleStatus: 'Charging',
        vehicleStatusText: 'Grid power connected',
        riskStatus: 'NORMAL',
        riskReason: 'No immediate risk detected. High-rate DC charging nominal.',
        avgCellVoltage: 3.72,
        avgCellStatus: 'Normal',
        maxCellVoltage: 3.75,
        maxCellIndex: 42,
        maxCellStatus: 'Normal',
        minCellVoltage: 3.70,
        minCellIndex: 88,
        minCellStatus: 'Normal',
        cellVoltageSpread: spread,
        spreadStatus: 'Normal',
        chargingProgress: soc,
        targetCharge: 100,
        remainingCharge: 100 - soc,
        estimatedTimeToFullMin: 38,
        chargingStatus: 'Charging',
        chargingTemp: temp,
        chargingTempStatus: 'Normal',
        chargingCurrent: current,
        chargingVoltage: voltage,
        chargingSafetyStatus: 'Green',
        chargingSafetyExplanation: 'No safety issues detected. Charging within nominal parameters.',
      },
      anomalies: DEFAULT_ANOMALY_EVENTS,
      chargingEvents: [
        {
          id: 'c-1',
          timestamp: '13:00',
          date: 'Nov 10, 2026',
          event: 'Charging Started',
          details: 'DC Fast Charger connected to CCS Combo 2 port.',
          severity: 'Normal',
        },
        {
          id: 'c-2',
          timestamp: '13:15',
          date: 'Nov 10, 2026',
          event: 'Charging Progress Update',
          details: 'Pack reached 50% SoC. Active liquid cooling engaged.',
          severity: 'Normal',
        },
      ],
    };
  }

  if (scenario === 'cell_drift_anomaly') {
    const soc = 80;
    const temp = 35.8;
    const current = 28.4;
    const voltage = 354.2;
    const spread = 0.12; // 120 mV > 80mV

    return {
      data: {
        soc,
        rangeKm: 138,
        remainingTimeFormatted: '~ 5 h 15 min',
        packTemperature: temp,
        temperatureStatus: 'Normal',
        packVoltage: voltage,
        voltageStatus: 'Normal',
        packCurrent: current,
        currentStatus: 'Normal',
        vehicleStatus: 'Discharging',
        vehicleStatusText: 'Using battery power',
        riskStatus: 'WARNING',
        riskReason: 'Cell 18 voltage deviation (0.12 V spread) exceeds safety threshold.',
        avgCellVoltage: 3.62,
        avgCellStatus: 'Normal',
        maxCellVoltage: 3.71,
        maxCellIndex: 18,
        maxCellStatus: 'Warning',
        minCellVoltage: 3.59,
        minCellIndex: 72,
        minCellStatus: 'Normal',
        cellVoltageSpread: spread,
        spreadStatus: 'Warning',
        chargingProgress: soc,
        targetCharge: 100,
        remainingCharge: 20,
        estimatedTimeToFullMin: 0,
        chargingStatus: 'Not Charging',
        chargingTemp: temp,
        chargingTempStatus: 'Normal',
        chargingCurrent: 0,
        chargingVoltage: 0,
        chargingSafetyStatus: 'Amber',
        chargingSafetyExplanation: 'Warning: Cell voltage delta outside calibrated tolerance bounds.',
      },
      anomalies: [
        {
          id: 'evt-drift',
          time: '13:25',
          fullTimestamp: '2026-11-10 13:25:00',
          event: 'Cell 18 voltage deviation exceeds safety tolerance (0.12 V)',
          severity: 'Warning',
          iconType: 'voltage',
          isMockData: true,
        },
        ...DEFAULT_ANOMALY_EVENTS,
      ],
      chargingEvents: [],
    };
  }

  if (scenario === 'thermal_warning') {
    const soc = 78;
    const temp = 53.6; // Critical
    const current = 42.1;
    const voltage = 352.0;

    return {
      data: {
        soc,
        rangeKm: 130,
        remainingTimeFormatted: '~ 4 h 50 min',
        packTemperature: temp,
        temperatureStatus: 'Critical',
        packVoltage: voltage,
        voltageStatus: 'Normal',
        packCurrent: current,
        currentStatus: 'Warning',
        vehicleStatus: 'Discharging',
        vehicleStatusText: 'Using battery power',
        riskStatus: 'CRITICAL',
        riskReason: 'Critical thermal alert: Pack temperature 53.6 °C exceeds safe cutoff limit.',
        avgCellVoltage: 3.61,
        avgCellStatus: 'Normal',
        maxCellVoltage: 3.69,
        maxCellIndex: 72,
        maxCellStatus: 'Warning',
        minCellVoltage: 3.58,
        minCellIndex: 18,
        minCellStatus: 'Normal',
        cellVoltageSpread: 0.11,
        spreadStatus: 'Warning',
        chargingProgress: soc,
        targetCharge: 100,
        remainingCharge: 22,
        estimatedTimeToFullMin: 0,
        chargingStatus: 'Not Charging',
        chargingTemp: temp,
        chargingTempStatus: 'Critical',
        chargingCurrent: 0,
        chargingVoltage: 0,
        chargingSafetyStatus: 'Red',
        chargingSafetyExplanation: 'Critical fault detected: Emergency thermal derating activated.',
      },
      anomalies: [
        {
          id: 'evt-therm',
          time: '13:30',
          fullTimestamp: '2026-11-10 13:30:00',
          event: 'Critical cell temperature rise detected (53.6 °C)',
          severity: 'Critical',
          iconType: 'temperature',
          isMockData: true,
        },
        ...DEFAULT_ANOMALY_EVENTS,
      ],
      chargingEvents: [],
    };
  }

  // DEFAULT MATCHING REFERENCE IMAGE EXACTLY:
  // SoC: 82%
  // Driving Range: 142 km (~ 5 h 30 min)
  // Temperature: 32.4 °C (Normal)
  // Voltage: 358.1 V (Normal)
  // Current: 24.8 A (Normal)
  // Vehicle Status: Discharging / Running ("Using battery power")
  // Risk Status: NORMAL ("No immediate risk detected.")
  // Average Cell Voltage: 3.64 V (Normal)
  // Max Cell Voltage: 3.68 V (Normal)
  // Min Cell Voltage: 3.60 V (Normal)
  // Cell Voltage Spread: 0.08 V (Normal)
  return {
    data: {
      soc: 82,
      rangeKm: 142,
      remainingTimeFormatted: '~ 5 h 30 min',
      packTemperature: 32.4,
      temperatureStatus: 'Normal',
      packVoltage: 358.1,
      voltageStatus: 'Normal',
      packCurrent: 24.8,
      currentStatus: 'Normal',
      vehicleStatus: 'Discharging',
      vehicleStatusText: 'Using battery power',
      riskStatus: 'NORMAL',
      riskReason: 'No immediate risk detected.',
      avgCellVoltage: 3.64,
      avgCellStatus: 'Normal',
      maxCellVoltage: 3.68,
      maxCellIndex: 18,
      maxCellStatus: 'Normal',
      minCellVoltage: 3.60,
      minCellIndex: 72,
      minCellStatus: 'Normal',
      cellVoltageSpread: 0.08,
      spreadStatus: 'Normal',
      chargingProgress: 82,
      targetCharge: 100,
      remainingCharge: 18,
      estimatedTimeToFullMin: 0,
      chargingStatus: 'Not Charging',
      chargingTemp: 32.4,
      chargingTempStatus: 'Normal',
      chargingCurrent: 0,
      chargingVoltage: 0,
      chargingSafetyStatus: 'Green',
      chargingSafetyExplanation: 'No safety issues detected. Battery is operating within normal boundaries.',
    },
    anomalies: DEFAULT_ANOMALY_EVENTS,
    chargingEvents: [],
  };
}

/**
 * Micro-jitter for live sensor updates
 */
export function simulateSensorTick(prev: BatteryData, thresholds: SafetyThresholds): BatteryData {
  // Minor realistic sensor ADC noise (±0.1V, ±0.05°C, ±0.1A)
  const vJitter = (Math.random() - 0.5) * 0.2;
  const tJitter = (Math.random() - 0.5) * 0.1;
  const iJitter = (Math.random() - 0.5) * 0.2;

  const packVoltage = Number((prev.packVoltage + vJitter).toFixed(1));
  const packTemperature = Number((prev.packTemperature + tJitter).toFixed(1));
  const packCurrent = Number((prev.packCurrent + iJitter).toFixed(1));

  let soc = prev.soc;
  if (prev.vehicleStatus === 'Discharging') {
    soc = Math.max(0, Number((prev.soc - 0.005).toFixed(2)));
  } else if (prev.vehicleStatus === 'Charging') {
    soc = Math.min(100, Number((prev.soc + 0.01).toFixed(2)));
  }

  const rangeKm = Math.round(142 * (soc / 82));
  const remainingTimeFormatted = calculateRemainingDriveTime(rangeKm, packCurrent);

  const avgCellVoltage = Number((packVoltage / 98.4).toFixed(2));
  const spread = prev.cellVoltageSpread;
  const maxCellVoltage = Number((avgCellVoltage + spread / 2).toFixed(2));
  const minCellVoltage = Number((avgCellVoltage - spread / 2).toFixed(2));

  let riskStatus: RiskStatus = prev.riskStatus;
  let riskReason = prev.riskReason;

  if (packTemperature >= thresholds.criticalPackTemp || spread >= 0.12) {
    riskStatus = 'CRITICAL';
    riskReason = 'Critical fault: Thermal cutoff reached or cell safety breached.';
  } else if (packTemperature >= thresholds.maxPackTemp || spread >= thresholds.maxVoltageSpread) {
    riskStatus = 'WARNING';
    riskReason = 'Warning: Elevated thermal reading or cell voltage delta observed.';
  } else {
    riskStatus = 'NORMAL';
    riskReason = 'No immediate risk detected.';
  }

  return {
    ...prev,
    soc: Math.round(soc),
    rangeKm,
    remainingTimeFormatted,
    packTemperature,
    packVoltage,
    packCurrent,
    avgCellVoltage,
    maxCellVoltage,
    minCellVoltage,
    riskStatus,
    riskReason,
  };
}
