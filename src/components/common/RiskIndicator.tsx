import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';
import { RiskLevel } from '../../types';

interface RiskIndicatorProps {
  level: RiskLevel;
  showLabel?: boolean;
  className?: string;
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({ 
  level, 
  showLabel = true,
  className = ''
}) => {
  const getRiskConfig = () => {
    switch (level) {
      case 'CRITICAL':
        return {
          icon: AlertOctagon,
          textColor: 'text-rose-400',
          bgColor: 'bg-rose-500/10 border-rose-500/30',
          label: 'CRITICAL',
          subtext: 'Connection Break Imminent'
        };
      case 'HIGH':
        return {
          icon: AlertTriangle,
          textColor: 'text-amber-400',
          bgColor: 'bg-amber-500/10 border-amber-500/30',
          label: 'HIGH RISK',
          subtext: 'Severe buffer deficit'
        };
      case 'MEDIUM':
        return {
          icon: AlertTriangle,
          textColor: 'text-amber-300',
          bgColor: 'bg-amber-500/10 border-amber-500/20',
          label: 'MODERATE',
          subtext: 'Buffer tightening'
        };
      case 'LOW':
      default:
        return {
          icon: ShieldCheck,
          textColor: 'text-emerald-400',
          bgColor: 'bg-emerald-500/10 border-emerald-500/30',
          label: 'LOW / SAFE',
          subtext: 'Optimal buffer'
        };
    }
  };

  const config = getRiskConfig();
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${config.bgColor} ${className}`}>
      <Icon className={`w-4 h-4 ${config.textColor}`} />
      {showLabel && (
        <div className="flex flex-col">
          <span className={`text-xs font-mono font-bold tracking-wider ${config.textColor}`}>
            {config.label}
          </span>
          <span className="text-[10px] text-text-muted leading-tight">
            {config.subtext}
          </span>
        </div>
      )}
    </div>
  );
};
