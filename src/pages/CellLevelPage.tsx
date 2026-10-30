import React, { useState } from 'react';
import { CellDiagnostic } from '../types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Thermometer, 
  Zap, 
  Activity, 
  Info,
  Flame,
  TrendingDown,
  Layers,
  ChevronRight,
  X
} from 'lucide-react';

// Initial 12-cell dataset arranged strictly in 3 rows and 4 columns
export const INITIAL_12_CELLS: CellDiagnostic[] = [
  // ROW 1 (Cells 1 to 4)
  {
    id: 1,
    label: 'Cell 01',
    row: 1,
    col: 1,
    voltage: 4.12,
    nominalVoltage: 4.12,
    voltageDelta: 0.00,
    temperature: 28.4,
    tempDelta: -0.1,
    resistance: 0.84,
    soc: 82,
    status: 'Normal',
    hasError: false,
  },
  {
    id: 2,
    label: 'Cell 02',
    row: 1,
    col: 2,
    voltage: 4.13,
    nominalVoltage: 4.12,
    voltageDelta: +0.01,
    temperature: 28.8,
    tempDelta: +0.3,
    resistance: 0.85,
    soc: 83,
    status: 'Normal',
    hasError: false,
  },
  {
    id: 3,
    label: 'Cell 03',
    row: 1,
    col: 3,
    voltage: 4.11,
    nominalVoltage: 4.12,
    voltageDelta: -0.01,
    temperature: 28.5,
    tempDelta: 0.0,
    resistance: 0.86,
    soc: 82,
    status: 'Normal',
    hasError: false,
  },
  {
    id: 4,
    label: 'Cell 04',
    row: 1,
    col: 4,
    voltage: 4.12,
    nominalVoltage: 4.12,
    voltageDelta: 0.00,
    temperature: 28.9,
    tempDelta: +0.4,
    resistance: 0.83,
    soc: 82,
    status: 'Normal',
    hasError: false,
  },

  // ROW 2 (Cells 5 to 8) - Contains Error in Cell 07
  {
    id: 5,
    label: 'Cell 05',
    row: 2,
    col: 1,
    voltage: 4.12,
    nominalVoltage: 4.12,
    voltageDelta: 0.00,
    temperature: 29.1,
    tempDelta: +0.6,
    resistance: 0.85,
    soc: 82,
    status: 'Normal',
    hasError: false,
  },
  {
    id: 6,
    label: 'Cell 06',
    row: 2,
    col: 2,
    voltage: 4.11,
    nominalVoltage: 4.12,
    voltageDelta: -0.01,
    temperature: 29.4,
    tempDelta: +0.9,
    resistance: 0.87,
    soc: 81,
    status: 'Normal',
    hasError: false,
  },
  {
    id: 7,
    label: 'Cell 07',
    row: 2,
    col: 3,
    voltage: 3.82,
    nominalVoltage: 4.12,
    voltageDelta: -0.30, // 300 mV drop
    temperature: 31.2,
    tempDelta: +2.7,
    resistance: 1.84, // elevated internal resistance
    soc: 64,
    status: 'Warning',
    hasError: true,
    errorName: 'Voltage Deviation / Under-Voltage Anomaly',
    errorCode: 'ERR-CELL-07-UNDERVOLT',
    errorDescription: 'Cell voltage has sagged to 3.82 V (-300 mV below nominal median 4.12 V). Internal resistance is 1.84 mΩ (+116% above pack baseline). Unusual discharge pattern indicates high internal impedance.',
    recommendedAction: 'Engage BMS cell balancing shunts. Monitor voltage delta during discharge. Schedule module impedance diagnostic if voltage deviation persists.',
  },
  {
    id: 8,
    label: 'Cell 08',
    row: 2,
    col: 4,
    voltage: 4.12,
    nominalVoltage: 4.12,
    voltageDelta: 0.00,
    temperature: 29.0,
    tempDelta: +0.5,
    resistance: 0.84,
    soc: 82,
    status: 'Normal',
    hasError: false,
  },

  // ROW 3 (Cells 9 to 12) - Contains Error in Cell 11
  {
    id: 9,
    label: 'Cell 09',
    row: 3,
    col: 1,
    voltage: 4.13,
    nominalVoltage: 4.12,
    voltageDelta: +0.01,
    temperature: 28.7,
    tempDelta: +0.2,
    resistance: 0.83,
    soc: 83,
    status: 'Normal',
    hasError: false,
  },
  {
    id: 10,
    label: 'Cell 10',
    row: 3,
    col: 2,
    voltage: 4.12,
    nominalVoltage: 4.12,
    voltageDelta: 0.00,
    temperature: 29.2,
    tempDelta: +0.7,
    resistance: 0.85,
    soc: 82,
    status: 'Normal',
    hasError: false,
  },
  {
    id: 11,
    label: 'Cell 11',
    row: 3,
    col: 3,
    voltage: 4.09,
    nominalVoltage: 4.12,
    voltageDelta: -0.03,
    temperature: 42.4, // thermal spike
    tempDelta: +13.9, // 13.9°C higher than nominal
    resistance: 0.98,
    soc: 80,
    status: 'Warning',
    hasError: true,
    errorName: 'Thermal Gradient Anomaly / Elevated Temperature',
    errorCode: 'ERR-CELL-11-OVERTEMP',
    errorDescription: 'Cell temperature reached 42.4 °C (+13.9 °C above pack mean 28.5 °C). This thermal hotspot violates the maximum allowable cell temperature gradient (threshold: 5.0 °C).',
    recommendedAction: 'Active battery liquid cooling ramped to 85% duty cycle. Inspect thermal interface pad and cooling channels around Module 3 / Cell 11.',
  },
  {
    id: 12,
    label: 'Cell 12',
    row: 3,
    col: 4,
    voltage: 4.12,
    nominalVoltage: 4.12,
    voltageDelta: 0.00,
    temperature: 28.6,
    tempDelta: +0.1,
    resistance: 0.84,
    soc: 82,
    status: 'Normal',
    hasError: false,
  },
];

interface CellLevelPageProps {
  isOnline?: boolean;
}

export const CellLevelPage: React.FC<CellLevelPageProps> = () => {
  const [cells] = useState<CellDiagnostic[]>(INITIAL_12_CELLS);
  const [selectedCell, setSelectedCell] = useState<CellDiagnostic | null>(cells.find(c => c.id === 7) || null);
  const [filterMode, setFilterMode] = useState<'all' | 'errors' | 'normal'>('all');

  const errorCells = cells.filter(c => c.hasError);
  const normalCells = cells.filter(c => !c.hasError);

  const displayedCells = filterMode === 'errors' 
    ? errorCells 
    : filterMode === 'normal' 
    ? normalCells 
    : cells;

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Cell Level Monitoring
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              {errorCells.length} Anomalies Detected
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            12-Cell series pack arrangement (3 Rows × 4 Columns) with real-time BMS voltage, temperature, and impedance tracking
          </p>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600 self-start sm:self-auto">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              filterMode === 'all'
                ? 'bg-white text-[#2563EB] font-semibold shadow-xs'
                : 'hover:text-slate-900'
            }`}
          >
            All 12 Cells
          </button>
          <button
            onClick={() => setFilterMode('errors')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              filterMode === 'errors'
                ? 'bg-amber-500 text-white font-semibold shadow-xs'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Error Cells ({errorCells.length})
          </button>
          <button
            onClick={() => setFilterMode('normal')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              filterMode === 'normal'
                ? 'bg-white text-emerald-600 font-semibold shadow-xs'
                : 'hover:text-slate-900'
            }`}
          >
            Nominal ({normalCells.length})
          </button>
        </div>
      </div>

      {/* 2. Detected Cell Errors & Unusual Patterns Banner (Explicitly identifies anomalous cells) */}
      <div className="bg-white border border-amber-200 rounded-xl p-5 shadow-xs bg-gradient-to-r from-amber-50/50 via-white to-white">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-amber-100 text-amber-700 rounded-lg shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Unusual Patterns Detected in Pack
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                  Attention Required
                </span>
              </h2>
              <span className="text-xs text-slate-500">
                Pack Tolerance: ±80 mV spread | Max Temp Delta: 5.0 °C
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 mb-4">
              The BMS sensor unit has flagged <strong className="text-slate-900">2 specific cells</strong> out of 12 exhibiting abnormal operation parameters that deviate from the pack nominal median:
            </p>

            {/* Error Cells Detailed Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Error 1: Cell 07 */}
              <div 
                onClick={() => setSelectedCell(cells[6])}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedCell?.id === 7 
                    ? 'border-amber-400 bg-amber-50/80 ring-2 ring-amber-300' 
                    : 'border-amber-200 bg-amber-50/40 hover:bg-amber-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-amber-600 text-white text-xs font-bold rounded-md">
                      Cell 07
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Row 2, Column 3</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    <TrendingDown className="w-3.5 h-3.5" /> Under-Voltage Error
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="text-sm font-bold text-slate-900">Voltage Deviation Anomaly</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Cell voltage has dropped to <strong className="text-amber-800 font-semibold">3.82 V</strong> (nominal is 4.12 V, deviation: <strong className="text-rose-600 font-semibold">-300 mV</strong>). Internal resistance has elevated to <strong className="text-amber-800 font-semibold">1.84 mΩ</strong> (+116% above pack median).
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-amber-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Root Cause: High internal impedance / Cell voltage sag</span>
                  <span className="text-[#2563EB] font-medium flex items-center gap-0.5 hover:underline">
                    Inspect Cell 07 <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Error 2: Cell 11 */}
              <div 
                onClick={() => setSelectedCell(cells[10])}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedCell?.id === 11 
                    ? 'border-rose-400 bg-rose-50/80 ring-2 ring-rose-300' 
                    : 'border-rose-200 bg-rose-50/40 hover:bg-rose-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-rose-600 text-white text-xs font-bold rounded-md">
                      Cell 11
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Row 3, Column 3</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
                    <Flame className="w-3.5 h-3.5" /> Thermal Alert
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="text-sm font-bold text-slate-900">Thermal Gradient Anomaly</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Cell temperature reached <strong className="text-rose-700 font-semibold">42.4 °C</strong> (+13.9 °C above pack mean of 28.5 °C). This thermal hotspot exceeds the safety gradient limit of 5.0 °C and requires active liquid cooling.
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-rose-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Root Cause: Restricted cooling channel / Localized heat build-up</span>
                  <span className="text-[#2563EB] font-medium flex items-center gap-0.5 hover:underline">
                    Inspect Cell 11 <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 12-Cell Grid (Arranged 3 Rows × 4 Columns) */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-[#E2E8F0] mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#2563EB]" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                12-Cell Pack Matrix (3 Rows × 4 Columns)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Click on any cell card to inspect its real-time telemetry, voltage balance, and diagnostic report.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Nominal ({normalCells.length})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Voltage Error (Cell 07)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              Thermal Alert (Cell 11)
            </span>
          </div>
        </div>

        {/* The 12 cells arranged in 3 rows and 4 columns */}
        <div className="space-y-5">
          {[1, 2, 3].map((rowNum) => {
            const rowCells = displayedCells.filter(c => c.row === rowNum);
            if (rowCells.length === 0) return null;

            return (
              <div key={rowNum} className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Row {rowNum}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      (Cells {String((rowNum - 1) * 4 + 1).padStart(2, '0')} - {String(rowNum * 4).padStart(2, '0')})
                    </span>
                  </div>
                  {rowNum === 2 && (
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Row 2 Alert: Cell 07 Voltage Error
                    </span>
                  )}
                  {rowNum === 3 && (
                    <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Row 3 Alert: Cell 11 Thermal Error
                    </span>
                  )}
                </div>

                {/* 4 Columns Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {rowCells.map((cell) => {
                    const isSelected = selectedCell?.id === cell.id;
                    const isError = cell.hasError;

                    return (
                      <div
                        key={cell.id}
                        onClick={() => setSelectedCell(cell)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer relative text-left select-none ${
                          isSelected
                            ? 'ring-2 ring-[#2563EB] shadow-md border-blue-400 bg-blue-50/20'
                            : isError && cell.id === 7
                            ? 'border-amber-300 bg-amber-50/30 hover:border-amber-400 hover:shadow-xs'
                            : isError && cell.id === 11
                            ? 'border-rose-300 bg-rose-50/30 hover:border-rose-400 hover:shadow-xs'
                            : 'border-[#E2E8F0] bg-white hover:border-slate-300 hover:shadow-xs'
                        }`}
                      >
                        {/* Cell Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-slate-900">
                              {cell.label}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              R{cell.row}C{cell.col}
                            </span>
                          </div>

                          {cell.hasError ? (
                            cell.id === 7 ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-amber-600" />
                                V-ERROR
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                                <Flame className="w-3 h-3 text-rose-600" />
                                T-ALERT
                              </span>
                            )
                          ) : (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              NORMAL
                            </span>
                          )}
                        </div>

                        {/* Voltage Metric */}
                        <div className="space-y-1 mb-2.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 flex items-center gap-1">
                              <Zap className="w-3.5 h-3.5 text-blue-500" />
                              Voltage
                            </span>
                            <span className={`font-mono font-bold ${
                              cell.id === 7 ? 'text-amber-700' : 'text-slate-900'
                            }`}>
                              {cell.voltage.toFixed(2)} V
                            </span>
                          </div>
                          {/* Mini voltage gauge bar */}
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                cell.id === 7 ? 'bg-amber-500' : 'bg-[#2563EB]'
                              }`}
                              style={{ width: `${Math.min(100, Math.max(10, ((cell.voltage - 3.0) / 1.25) * 100))}%` }}
                            />
                          </div>
                        </div>

                        {/* Secondary Metrics: Temp & Resistance */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                          <div>
                            <span className="text-[11px] text-slate-400 block">Temp</span>
                            <span className={`font-semibold flex items-center gap-1 mt-0.5 ${
                              cell.id === 11 ? 'text-rose-600 font-bold' : 'text-slate-700'
                            }`}>
                              <Thermometer className="w-3 h-3 text-slate-400" />
                              {cell.temperature.toFixed(1)} °C
                            </span>
                          </div>
                          <div>
                            <span className="text-[11px] text-slate-400 block">Resistance</span>
                            <span className={`font-semibold mt-0.5 block ${
                              cell.id === 7 ? 'text-amber-700 font-bold' : 'text-slate-700'
                            }`}>
                              {cell.resistance.toFixed(2)} mΩ
                            </span>
                          </div>
                        </div>

                        {/* Error Highlight Callout inside Card */}
                        {cell.hasError && (
                          <div className={`mt-3 pt-2 text-[11px] border-t leading-tight font-medium ${
                            cell.id === 7 
                              ? 'border-amber-200 text-amber-800' 
                              : 'border-rose-200 text-rose-800'
                          }`}>
                            {cell.id === 7 ? (
                              <span>⚠️ Voltage Sag: -300 mV below pack median</span>
                            ) : (
                              <span>🔥 Thermal spike: +13.9 °C above pack mean</span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Cell Detail Inspector (Shows deep telemetry of the selected cell) */}
      {selectedCell && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-start justify-between pb-4 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                selectedCell.hasError 
                  ? selectedCell.id === 7 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  : 'bg-blue-50 text-[#2563EB]'
              }`}>
                {selectedCell.label.replace('Cell ', '#')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedCell.label} Diagnostics & Telemetry
                  </h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    selectedCell.hasError 
                      ? selectedCell.id === 7 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {selectedCell.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pack Position: Row {selectedCell.row}, Column {selectedCell.col} | Chemistry: Lithium Nickel Manganese Cobalt (NMC)
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedCell(null)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              title="Close Inspector"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-5">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Measured Voltage</span>
              <span className={`text-lg font-bold font-mono mt-0.5 block ${
                selectedCell.id === 7 ? 'text-amber-700' : 'text-slate-900'
              }`}>
                {selectedCell.voltage.toFixed(3)} V
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Nominal: 4.120 V ({selectedCell.voltageDelta >= 0 ? '+' : ''}{selectedCell.voltageDelta.toFixed(3)} V)
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Cell Temperature</span>
              <span className={`text-lg font-bold font-mono mt-0.5 block ${
                selectedCell.id === 11 ? 'text-rose-600' : 'text-slate-900'
              }`}>
                {selectedCell.temperature.toFixed(1)} °C
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Mean Pack Temp: 28.5 °C ({selectedCell.tempDelta >= 0 ? '+' : ''}{selectedCell.tempDelta.toFixed(1)} °C)
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Internal Resistance</span>
              <span className={`text-lg font-bold font-mono mt-0.5 block ${
                selectedCell.id === 7 ? 'text-amber-700' : 'text-slate-900'
              }`}>
                {selectedCell.resistance.toFixed(2)} mΩ
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Pack Median: 0.85 mΩ
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Estimated Cell SoC</span>
              <span className="text-lg font-bold font-mono text-slate-900 mt-0.5 block">
                {selectedCell.soc}%
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                State of Charge balance
              </span>
            </div>
          </div>

          {selectedCell.hasError ? (
            <div className={`p-4 rounded-xl border ${
              selectedCell.id === 7 
                ? 'bg-amber-50/70 border-amber-300 text-amber-950' 
                : 'bg-rose-50/70 border-rose-300 text-rose-950'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                Active Anomaly: {selectedCell.errorName} ({selectedCell.errorCode})
              </div>
              <p className="text-xs sm:text-sm mt-2 leading-relaxed">
                {selectedCell.errorDescription}
              </p>
              <div className="mt-3 pt-3 border-t border-black/10 text-xs">
                <strong>Recommended Mitigation:</strong> {selectedCell.recommendedAction}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-950">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Cell Operating Normally
              </div>
              <p className="text-xs sm:text-sm text-emerald-900 mt-1 leading-relaxed">
                This cell is functioning within normal voltage spread (&lt;80 mV) and thermal gradients (&lt;5 °C). Impedance is synchronized with adjacent cells in Series Module {selectedCell.row}.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
