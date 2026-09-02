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
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-400',
          label: status === 'ON_TIME' ? 'ON TIME' : status === 'SAFE' ? 'SAFE' : 'CONFIRMED'
        };
      case 'RECOVERED':
        return {
          bg: 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300 shadow-glow-success',
          dot: 'bg-emerald-400 animate-pulse',
          label: '✓ RECOVERED'
        };
      case 'DELAYED':
        return {
          bg: 'bg-rose-500/15 border-rose-500/40 text-rose-400 shadow-glow-danger',
          dot: 'bg-rose-500 animate-ping-slow',
          label: 'DELAYED (+3h 20m)'
        };
      case 'MISSED':
        return {
          bg: 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-glow-danger',
          dot: 'bg-rose-400',
          label: 'MISSED'
        };
      case 'AT_RISK':
      case 'TIGHT':
      case 'LATE_CHECKIN_ALERT':
        return {
          bg: 'bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-glow-warning',
          dot: 'bg-amber-400 animate-pulse',
          label: status === 'LATE_CHECKIN_ALERT' ? 'LATE CHECK-IN' : 'AT RISK'
        };
      case 'CANCELLED':
        return {
          bg: 'bg-red-900/30 border-red-700/50 text-red-400',
          dot: 'bg-red-500',
          label: 'CANCELLED'
        };
      default:
        return {
          bg: 'bg-surface-high border-border text-text-secondary',
          dot: 'bg-text-muted',
          label: status
        };
    }
  };

  const style = getBadgeStyle();
  const sizeClass = size === 'sm' ? 'text-[11px] px-2 py-0.5' : size === 'lg' ? 'text-sm px-3.5 py-1' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-full border transition-all ${style.bg} ${sizeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot} ${pulse ? 'animate-pulse' : ''}`} />
      <span>{style.label}</span>
    </span>
  );
};
