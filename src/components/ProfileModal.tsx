import React from 'react';
import { X, User, Car, Calendar, Radio, CreditCard } from 'lucide-react';
import { VehicleProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: VehicleProfile;
  isOnline: boolean;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ 
  isOpen, 
  onClose,
  profile = {
    vehicleNumber: 'EV-8849-N3',
    vehicleModel: 'Electric Sedan',
    yearOfPurchase: '2024',
    status: 'Connected',
    userName: 'EV Engineer',
    userRole: 'Vehicle Owner'
  },
  isOnline
}) => {
  if (!isOpen) return null;

  const connectionStatus = isOnline ? 'Connected' : 'Disconnected';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-[460px] bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon Button on Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Information Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
            <User className="w-6 h-6 text-[#2563EB]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {profile.userName}
            </h2>
            <div className="text-xs text-slate-500 mt-0.5">
              {profile.userRole}
            </div>
          </div>
        </div>

        {/* Vehicle Profile Card */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3.5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <Car className="w-4 h-4 text-[#2563EB]" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Vehicle Profile
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {/* Vehicle Number */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-slate-500">
                <CreditCard className="w-4 h-4 text-[#2563EB]" />
                <span>Vehicle Number</span>
              </div>
              <span className="font-mono font-bold text-slate-900">
                {profile.vehicleNumber || 'Not provided'}
              </span>
            </div>

            {/* Vehicle Model */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-slate-500">
                <Car className="w-4 h-4 text-[#2563EB]" />
                <span>Vehicle Model</span>
              </div>
              <span className="font-medium text-slate-900">
                {profile.vehicleModel || 'Not provided'}
              </span>
            </div>

            {/* Year of Purchase */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-slate-500">
                <Calendar className="w-4 h-4 text-[#2563EB]" />
                <span>Year of Purchase</span>
              </div>
              <span className="font-mono text-slate-900 font-medium">
                {profile.yearOfPurchase || 'Not provided'}
              </span>
            </div>

            {/* Vehicle Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-slate-500">
                <Radio className="w-4 h-4 text-[#2563EB]" />
                <span>Vehicle Status</span>
              </div>
              <div className="flex items-center gap-2 font-semibold">
                <span className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-emerald-500' : 'bg-rose-500'
                }`} />
                <span className={isOnline ? 'text-emerald-700' : 'text-rose-600'}>
                  {connectionStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-xs font-mono font-bold text-white shadow-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
