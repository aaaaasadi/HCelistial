import React from 'react';
import { TransportStatus, ConnectionStatus } from '../../types';

interface StatusBadgeProps {
  status: TransportStatus | ConnectionStatus | string;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', pulse = false }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'ON_TIME':
      case 'SAFE':
      case 'CONFIRMED':
        return {
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-800',
          dot: 'bg-emerald-600',
          label: status === 'ON_TIME' ? 'ON TIME' : status === 'SAFE' ? 'SAFE' : 'CONFIRMED'
        };
      case 'RECOVERED':
        return {
          bg: 'bg-emerald-100 border-emerald-400 text-emerald-900 shadow-sm font-semibold',
          dot: 'bg-emerald-600 animate-pulse',
          label: '✓ RECOVERED'
        };
      case 'DELAYED':
        return {
          bg: 'bg-rose-100 border-rose-300 text-rose-800 shadow-sm font-semibold',
          dot: 'bg-rose-600 animate-ping-slow',
          label: 'DELAYED (+3h 20m)'
        };
      case 'MISSED':
        return {
          bg: 'bg-rose-100 border-rose-400 text-rose-900 shadow-sm font-semibold',
          dot: 'bg-rose-600',
          label: 'MISSED'
        };
      case 'AT_RISK':
      case 'TIGHT':
      case 'LATE_CHECKIN_ALERT':
        return {
          bg: 'bg-amber-100 border-amber-300 text-amber-900 shadow-sm font-semibold',
          dot: 'bg-amber-600 animate-pulse',
          label: status === 'LATE_CHECKIN_ALERT' ? 'LATE CHECK-IN' : 'AT RISK'
        };
      case 'CANCELLED':
        return {
          bg: 'bg-red-100 border-red-300 text-red-900 font-semibold',
          dot: 'bg-red-600',
          label: 'CANCELLED'
        };
      default:
        return {
          bg: 'bg-surface-lowest border-border text-text-secondary',
          dot: 'bg-text-muted',
          label: status
        };
    }
  };

  const style = getBadgeStyle();
  const sizeClass = size === 'sm' ? 'text-[11px] px-2.5 py-0.5' : size === 'lg' ? 'text-xs px-3.5 py-1' : 'text-xs px-3 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-full border transition-all ${style.bg} ${sizeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot} ${pulse ? 'animate-pulse' : ''}`} />
      <span>{style.label}</span>
    </span>
  );
};
