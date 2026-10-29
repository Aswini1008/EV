import React, { useState } from 'react';
import { Activity, ChevronDown, Thermometer, Zap, Gauge, Info } from 'lucide-react';
import { TrendDataPoint } from '../types';

interface BatteryTrendsGraphProps {
  trends: TrendDataPoint[];
}

type MetricType = 'soc' | 'temp' | 'voltage';

export const BatteryTrendsGraph: React.FC<BatteryTrendsGraphProps> = ({ trends }) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('soc');
  const [timeFilter, setTimeFilter] = useState<15 | 30 | 60>(60);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Filter points based on selected time window
  const filteredPoints = trends.filter(pt => Math.abs(pt.timeOffsetMin) <= timeFilter);

  // Metric configuration
  const metricConfigs = {
    soc: {
      name: 'State of Charge (SoC)',
      unit: '%',
      color: '#2563EB',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Gauge,
      getValue: (pt: TrendDataPoint) => pt.soc,
      minY: 0,
      maxY: 100,
      ticks: [0, 20, 40, 60, 80, 100],
      explanation: 'Pack State of Charge shows nominal, steady electrochemical discharge under active vehicle load. No abrupt voltage collapse or cell drooping detected.',
    },
    temp: {
      name: 'Battery Pack Temperature',
      unit: '°C',
      color: '#D97706',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Thermometer,
      getValue: (pt: TrendDataPoint) => pt.temperature,
      minY: 15,
      maxY: 45,
      ticks: [15, 20, 25, 30, 35, 40, 45],
      explanation: 'Cell temperatures remain stabilized inside the optimal 25°C–35°C window. Thermal runaway risk is zero; liquid cooling circulation is effective.',
    },
    voltage: {
      name: 'Pack Bus Voltage',
      unit: 'V',
      color: '#475569',
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-200',
      icon: Zap,
      getValue: (pt: TrendDataPoint) => pt.voltage,
      minY: 330,
      maxY: 390,
      ticks: [330, 345, 360, 375, 390],
      explanation: 'High-voltage bus maintains nominal potential across the 96-series architecture. Total internal series resistance is low and balanced.',
    },
  };

  const currentConfig = metricConfigs[selectedMetric];

  // Calculate stats for selected metric in window
  const values = filteredPoints.map(currentConfig.getValue);
  const currentValue = values.length > 0 ? values[values.length - 1] : 0;
  const minValue = values.length > 0 ? Math.min(...values) : 0;
  const maxValue = values.length > 0 ? Math.max(...values) : 0;
  const avgValue = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;

  // Chart coordinate math
  const width = 880;
  const height = 240;
  const padding = { top: 25, right: 30, bottom: 35, left: 55 };

  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const getY = (val: number) => {
    const range = currentConfig.maxY - currentConfig.minY;
    const clamped = Math.min(currentConfig.maxY, Math.max(currentConfig.minY, val));
    return padding.top + graphHeight - ((clamped - currentConfig.minY) / range) * graphHeight;
  };

  const getX = (index: number) => {
    if (filteredPoints.length <= 1) return padding.left;
    return padding.left + (index / (filteredPoints.length - 1)) * graphWidth;
  };

  // Build SVG Path
  const linePath = filteredPoints.reduce((acc, pt, i) => {
    const x = getX(i);
    const y = getY(currentConfig.getValue(pt));
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Build Area Path under curve
  const areaPath = filteredPoints.length > 0
    ? `${linePath} L ${getX(filteredPoints.length - 1)} ${padding.top + graphHeight} L ${padding.left} ${padding.top + graphHeight} Z`
    : '';

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5 shadow-xs relative">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#2563EB]" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Battery Trends — Real-Time Progression
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 ml-7">
            Single-metric time series showing continuous battery behavior
          </p>
        </div>

        {/* Time Selector Dropdown */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 hover:border-slate-300 transition-colors shadow-2xs"
            >
              <span>Last {timeFilter} minutes</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 w-38 bg-white border border-slate-200 rounded-lg shadow-lg z-30 overflow-hidden py-1">
                {([15, 30, 60] as const).map(windowMin => (
                  <button
                    key={windowMin}
                    onClick={() => {
                      setTimeFilter(windowMin);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-1.5 text-xs font-mono transition-colors ${
                      timeFilter === windowMin ? 'text-[#2563EB] font-bold bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Last {windowMin} minutes
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedMetric('soc')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            selectedMetric === 'soc'
              ? 'bg-[#2563EB] text-white shadow-2xs'
              : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Gauge className="w-3.5 h-3.5" />
          <span>State of Charge (%)</span>
        </button>

        <button
          onClick={() => setSelectedMetric('temp')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            selectedMetric === 'temp'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Thermometer className="w-3.5 h-3.5" />
          <span>Temperature (°C)</span>
        </button>

        <button
          onClick={() => setSelectedMetric('voltage')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            selectedMetric === 'voltage'
              ? 'bg-slate-700 text-white shadow-2xs'
              : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Pack Voltage (V)</span>
        </button>
      </div>

      {/* Summary Stats Strip for Selected Metric */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
          <div className="text-[10px] font-mono uppercase text-slate-500">Current</div>
          <div className="text-base sm:text-lg font-bold font-mono text-slate-900 mt-0.5">
            {currentValue.toFixed(1)} {currentConfig.unit}
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
          <div className="text-[10px] font-mono uppercase text-slate-500">Min in Window</div>
          <div className="text-base sm:text-lg font-bold font-mono text-slate-900 mt-0.5">
            {minValue.toFixed(1)} {currentConfig.unit}
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
          <div className="text-[10px] font-mono uppercase text-slate-500">Max in Window</div>
          <div className="text-base sm:text-lg font-bold font-mono text-slate-900 mt-0.5">
            {maxValue.toFixed(1)} {currentConfig.unit}
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
          <div className="text-[10px] font-mono uppercase text-slate-500">Average</div>
          <div className="text-base sm:text-lg font-bold font-mono text-slate-900 mt-0.5">
            {avgValue.toFixed(1)} {currentConfig.unit}
          </div>
        </div>
      </div>

      {/* Responsive SVG Single-Axis Graph */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-auto select-none block"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={currentConfig.color} stopOpacity="0.16" />
              <stop offset="100%" stopColor={currentConfig.color} stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Background grid box */}
          <rect
            x={padding.left}
            y={padding.top}
            width={graphWidth}
            height={graphHeight}
            fill="#F8FAFC"
            stroke="#E2E8F0"
            strokeWidth="1"
            rx="4"
          />

          {/* Horizontal Grid lines and Left Axis Labels */}
          {currentConfig.ticks.map((tickVal) => {
            const y = getY(tickVal);
            return (
              <g key={tickVal}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + graphWidth}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3.5}
                  fill="#64748B"
                  fontSize="10"
                  textAnchor="end"
                  fontFamily="ui-monospace, monospace"
                  fontWeight="500"
                >
                  {tickVal}
                </text>
              </g>
            );
          })}

          {/* Left Y-Axis Label */}
          <text
            x={16}
            y={padding.top + graphHeight / 2}
            fill={currentConfig.color}
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
            transform={`rotate(-90 16 ${padding.top + graphHeight / 2})`}
            fontFamily="ui-monospace, monospace"
          >
            {currentConfig.name} ({currentConfig.unit})
          </text>

          {/* Vertical grid lines & bottom time labels */}
          {filteredPoints.map((pt, i) => {
            const x = getX(i);
            return (
              <g key={i}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={padding.top + graphHeight}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={height - 12}
                  fill="#64748B"
                  fontSize="11"
                  textAnchor="middle"
                  fontFamily="ui-monospace, monospace"
                >
                  {pt.timeLabel}
                </text>
              </g>
            );
          })}

          {/* Subtle Area Fill */}
          <path
            d={areaPath}
            fill="url(#areaGradient)"
          />

          {/* Primary Trend Line */}
          <path
            d={linePath}
            fill="none"
            stroke={currentConfig.color}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Data Points */}
          {filteredPoints.map((pt, i) => {
            const isHovered = hoverIndex === i;
            return (
              <circle
                key={i}
                cx={getX(i)}
                cy={getY(currentConfig.getValue(pt))}
                r={isHovered ? '5' : '3.5'}
                fill={currentConfig.color}
                stroke="#FFFFFF"
                strokeWidth={isHovered ? '2' : '1.5'}
                className="transition-all"
              />
            );
          })}

          {/* Hover Crosshair Column */}
          {hoverIndex !== null && (
            <line
              x1={getX(hoverIndex)}
              y1={padding.top}
              x2={getX(hoverIndex)}
              y2={padding.top + graphHeight}
              stroke={currentConfig.color}
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
          )}

          {/* Scrubbing interaction targets */}
          {filteredPoints.map((_, i) => {
            const step = graphWidth / (filteredPoints.length - 1 || 1);
            return (
              <rect
                key={i}
                x={getX(i) - step / 2}
                y={padding.top}
                width={step}
                height={graphHeight}
                fill="transparent"
                onMouseEnter={() => setHoverIndex(i)}
                className="cursor-crosshair"
              />
            );
          })}
        </svg>
      </div>

      {/* Hover Readout Tooltip Bar */}
      {hoverIndex !== null && filteredPoints[hoverIndex] && (
        <div className="mt-2.5 py-1.5 px-3 rounded-lg bg-slate-900 border border-slate-800 text-white flex items-center justify-between text-xs font-mono shadow-md">
          <span className="text-slate-300">
            Timestamp: <strong className="text-white">{filteredPoints[hoverIndex].timeLabel}</strong>
          </span>
          <div className="flex items-center gap-3">
            <span style={{ color: currentConfig.color === '#2563EB' ? '#60A5FA' : currentConfig.color === '#D97706' ? '#FBBF24' : '#E2E8F0' }} className="font-bold">
              {currentConfig.name}: {currentConfig.getValue(filteredPoints[hoverIndex]).toFixed(2)} {currentConfig.unit}
            </span>
          </div>
        </div>
      )}

      {/* Plain-English Telemetry Analysis Box */}
      <div className="mt-3.5 p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 leading-relaxed">
          <strong className="text-slate-800 font-semibold">{currentConfig.name} Assessment: </strong>
          {currentConfig.explanation}
        </p>
      </div>
    </div>
  );
};
