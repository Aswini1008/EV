import React from 'react';
import { VehicleProfile } from '../types';
import { Car, Calendar, Radio, CreditCard, ShieldCheck, CheckCircle2, Battery, Zap } from 'lucide-react';
import sedanImage from '../assets/images/electric_sedan_vehicle_1793264565439.jpg';

interface VehicleProfilePageProps {
  isOnline: boolean;
  profile?: VehicleProfile;
}

export const VehicleProfilePage: React.FC<VehicleProfilePageProps> = ({
  isOnline,
  profile = {
    vehicleNumber: 'EV-8849-N3',
    vehicleModel: 'Electric Sedan',
    yearOfPurchase: '2024',
    status: 'Connected',
    userName: 'EV Engineer',
    userRole: 'Vehicle Owner'
  }
}) => {
  const connectionStatus = isOnline ? 'Connected' : 'Disconnected';

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Vehicle Profile
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          View your vehicle details and system information
        </p>
      </div>

      {/* 2. Main Vehicle Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Card: Vehicle Visual Showcase */}
        <div className="lg:col-span-6 bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-6 shadow-xs flex flex-col justify-between items-center text-center">
          {/* Vehicle Photograph */}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
            <img 
              src={sedanImage}
              alt="Electric Sedan EV-8849-N3"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Vehicle Identifier & Model */}
          <div className="my-4 sm:my-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
              {profile.vehicleNumber}
            </h2>
            <div className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              {profile.vehicleModel} <span className="text-slate-300 mx-1.5">|</span> {profile.yearOfPurchase}
            </div>

            {/* Connection Status Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mt-4 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span>{connectionStatus}</span>
            </div>
          </div>

          {/* Quick Specifications */}
          <div className="w-full grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-700 font-medium">
              <Battery className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>75 kWh Pack</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-700 font-medium">
              <Zap className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>96S Li-Ion Bus</span>
            </div>
          </div>
        </div>

        {/* Right Card: Vehicle Profile Details */}
        <div className="lg:col-span-6 bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-6">
              <Car className="w-5 h-5 text-[#2563EB]" />
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Vehicle Profile
              </h2>
            </div>

            {/* Structured Specifications List */}
            <div className="space-y-4 text-xs">
              {/* Vehicle Number */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div className="flex items-center gap-3 text-slate-500">
                  <CreditCard className="w-4 h-4 text-[#2563EB]" />
                  <span className="font-medium text-sm text-slate-600">Vehicle Number</span>
                </div>
                <span className="font-mono font-bold text-sm text-slate-900">
                  {profile.vehicleNumber}
                </span>
              </div>

              {/* Vehicle Model */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div className="flex items-center gap-3 text-slate-500">
                  <Car className="w-4 h-4 text-[#2563EB]" />
                  <span className="font-medium text-sm text-slate-600">Vehicle Model</span>
                </div>
                <span className="font-medium text-sm text-slate-900">
                  {profile.vehicleModel}
                </span>
              </div>

              {/* Year of Purchase */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div className="flex items-center gap-3 text-slate-500">
                  <Calendar className="w-4 h-4 text-[#2563EB]" />
                  <span className="font-medium text-sm text-slate-600">Year of Purchase</span>
                </div>
                <span className="font-mono font-medium text-sm text-slate-900">
                  {profile.yearOfPurchase}
                </span>
              </div>

              {/* Vehicle Status */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div className="flex items-center gap-3 text-slate-500">
                  <Radio className="w-4 h-4 text-[#2563EB]" />
                  <span className="font-medium text-sm text-slate-600">Vehicle Status</span>
                </div>
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <span className={`w-2 h-2 rounded-full ${
                    isOnline ? 'bg-emerald-500' : 'bg-rose-500'
                  }`} />
                  <span className={isOnline ? 'text-emerald-700' : 'text-rose-600'}>
                    {connectionStatus}
                  </span>
                </div>
              </div>

              {/* Registered Owner */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3 text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                  <span className="font-medium text-sm text-slate-600">Registered Owner</span>
                </div>
                <span className="font-medium text-sm text-slate-900">
                  {profile.userName} ({profile.userRole})
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500">
            Telemetry link is encrypted and authenticated via Secure Gateway.
          </div>
        </div>
      </div>

      {/* 3. Bottom Banner: Automated Safety & AI Supervisory Management */}
      <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-5 shadow-2xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Battery monitoring and safety thresholds are managed automatically.
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
            The system continuously monitors your battery in real-time and applies safety rules using AI.
          </p>
        </div>
      </div>
    </div>
  );
};
