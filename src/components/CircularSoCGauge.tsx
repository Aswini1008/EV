import React from 'react';
import { Battery } from 'lucide-react';

interface CircularSoCGaugeProps {
  value: number; // 0 to 100
  size?: number; // diameter in px
  strokeWidth?: number;
  subtitle?: string;
  showIcon?: boolean;
}

export const CircularSoCGauge: React.FC<CircularSoCGaugeProps> = ({
  value,
  size = 145,
  strokeWidth = 10,
  subtitle = 'Battery Level',
  showIcon = true,
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * clampedValue) / 100;
  const center = size / 2;

  return (
    <div className="relative flex flex-col items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
        />

        {/* Active Progress Arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#2563EB"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {/* Center Content Matching Clean Automotive Dashboard */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-1">
        <div className="flex items-baseline justify-center">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
            {Math.round(clampedValue)}
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-600 ml-0.5">%</span>
        </div>
        <span className="text-[9px] sm:text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
          {subtitle}
        </span>
        {showIcon && <Battery className="w-3.5 h-3.5 text-[#2563EB] mt-1" />}
      </div>
    </div>
  );
};
