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
          textColor: 'text-rose-700',
          bgColor: 'bg-rose-50 border-rose-300',
          label: 'CRITICAL',
          subtext: 'Connection Break Imminent'
        };
      case 'HIGH':
        return {
          icon: AlertTriangle,
          textColor: 'text-amber-700',
          bgColor: 'bg-amber-50 border-amber-300',
          label: 'HIGH RISK',
          subtext: 'Severe buffer deficit'
        };
      case 'MEDIUM':
        return {
          icon: AlertTriangle,
          textColor: 'text-amber-700',
          bgColor: 'bg-amber-50 border-amber-200',
          label: 'MODERATE',
          subtext: 'Buffer tightening'
        };
      case 'LOW':
      default:
        return {
          icon: ShieldCheck,
          textColor: 'text-emerald-700',
          bgColor: 'bg-emerald-50 border-emerald-300',
          label: 'LOW / SAFE',
          subtext: 'Optimal buffer'
        };
    }
  };

  const config = getRiskConfig();
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border ${config.bgColor} ${className}`}>
      <Icon className={`w-4 h-4 ${config.textColor}`} />
      {showLabel && (
        <div>
          <span className={`text-xs font-mono font-bold ${config.textColor}`}>
            {config.label}
          </span>
          <span className="text-[10px] text-text-muted hidden sm:inline ml-1.5 font-mono">
            ({config.subtext})
          </span>
        </div>
      )}
    </div>
  );
};
