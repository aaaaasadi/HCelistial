import React from 'react';
import {
  Train,
  Clock,
  AlertTriangle,
  Bus,
  Building2,
  Ticket,
  ChevronDown,
  ArrowDown
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';

export const ImpactCascadePanel: React.FC = () => {
  const { impactCascade } = useDemo();

  const getStageIcon = (type: string) => {
    switch (type) {
      case 'TRAIN':
        return <Train className="w-4 h-4 text-rose-400" />;
      case 'CONNECTION':
        return <Clock className="w-4 h-4 text-rose-400" />;
      case 'BUS':
        return <Bus className="w-4 h-4 text-rose-400" />;
      case 'HOTEL':
        return <Building2 className="w-4 h-4 text-amber-400" />;
      case 'ACTIVITY':
        return <Ticket className="w-4 h-4 text-blue-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'LOW':
      default:
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="rounded-2xl p-5 bg-surface-container/90 border border-rose-500/30 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-rose-300">
            Disruption Ripple Impact Analysis
          </h3>
        </div>
        <span className="text-xs font-mono text-text-muted">
          Chain Reaction: 1 Disruption → 5 Downstream Effects
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {impactCascade.map((step: any, idx: number) => {
          return (
            <div
              key={step.id}
              className="p-3.5 rounded-xl bg-surface-lowest/80 border border-border/60 hover:border-rose-500/40 transition-colors flex flex-col justify-between relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-surface-high flex items-center justify-center border border-border/50">
                    {getStageIcon(step.segmentType)}
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-bold">
                    {idx + 1}. {step.stageName}
                  </span>
                </div>
                <span
                  className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSeverityBadge(
                    step.severity
                  )}`}
                >
                  {step.severity}
                </span>
              </div>

              <div className="space-y-1 mb-2">
                <h4 className="text-xs font-bold font-display text-text-primary">
                  {step.title}
                </h4>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10px] font-mono">
                <span className="text-text-subtle truncate max-w-[120px]">
                  {step.originalTime}
                </span>
                <span className="text-rose-400 font-bold truncate max-w-[140px]">
                  {step.projectedTime}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
