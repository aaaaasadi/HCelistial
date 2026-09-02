import React, { useState } from 'react';
import {
  Calendar,
  Activity,
  AlertTriangle,
  Clock,
  Zap,
  GitFork,
  HeartPulse,
  LifeBuoy,
  ChevronDown,
  ChevronUp,
  ArrowDown,
  CheckCircle2
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';

export const PipelineFlowDiagram: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const {
    currentTrip,
    journeyStatus,
    journeyHealth,
    connections,
    impacts,
    setCurrentTab
  } = useDemo();

  const isDisrupted = journeyStatus === 'DISRUPTED';
  const isRecovered = journeyStatus === 'RECOVERED';
  const isAtRisk = journeyStatus === 'AT_RISK';

  const primaryConn = connections[0];

  return (
    <div className="rounded-2xl p-5 bg-surface-container border border-border space-y-4 shadow-hud">
      {/* Header with collapse toggle */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
            <GitFork className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-display text-text-primary flex items-center gap-2">
              <span>Disruption & Recovery Evaluation Pipeline</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary-light border border-primary/20">
                ACTIVE ENGINE ARCHITECTURE
              </span>
            </h3>
            <p className="text-xs text-text-muted font-mono">
              Live automated cascade: Planned Journey → Disruption → Connection Engine → Impact → Recovery
            </p>
          </div>
        </div>

        <button className="p-1 rounded-lg hover:bg-surface-high text-text-muted hover:text-text-primary transition-colors">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Pipeline Diagram Content */}
      {isExpanded && (
        <div className="pt-2 border-t border-border/60">
          <div className="flex flex-col items-center max-w-2xl mx-auto space-y-3 font-mono text-xs">
            
            {/* 1. PLANNED JOURNEY */}
            <div className="w-full sm:w-96 p-3 rounded-xl bg-surface-lowest border border-border flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-primary" />
                <div>
                  <span className="font-bold text-text-primary uppercase text-[11px] block">
                    1. PLANNED JOURNEY
                  </span>
                  <span className="text-text-muted text-[10px]">
                    {currentTrip.origin.split(' ')[0]} → Pune → {currentTrip.destination.split(',')[0]}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-high text-[10px] text-text-secondary border border-border">
                Scheduled
              </span>
            </div>

            <ArrowDown className="w-3.5 h-3.5 text-text-muted" />

            {/* 2. LIVE STATE */}
            <div className="w-full sm:w-96 p-3 rounded-xl bg-surface-lowest border border-border flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-primary" />
                <div>
                  <span className="font-bold text-text-primary uppercase text-[11px] block">
                    2. LIVE STATE TELEMETRY
                  </span>
                  <span className="text-text-muted text-[10px]">
                    Active Polling via Simulated Intermodal APIs
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/30">
                Polling Active
              </span>
            </div>

            <ArrowDown className="w-3.5 h-3.5 text-text-muted" />

            {/* 3. DISRUPTION */}
            <div className={`w-full sm:w-96 p-3 rounded-xl border flex items-center justify-between transition-all ${
              isDisrupted
                ? 'bg-rose-950/40 border-rose-500/50 text-rose-200 shadow-glow-danger'
                : isAtRisk
                ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                : isRecovered
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                : 'bg-surface-lowest border-border text-text-primary'
            }`}>
              <div className="flex items-center gap-2.5">
                <AlertTriangle className={`w-4 h-4 ${isDisrupted ? 'text-rose-400 animate-pulse' : isAtRisk ? 'text-amber-400' : 'text-text-muted'}`} />
                <div>
                  <span className="font-bold uppercase text-[11px] block">
                    3. {isDisrupted ? '🚨 DISRUPTION OCCURRED' : isAtRisk ? '⚠️ DELAY DETECTED' : isRecovered ? '✓ INCIDENT MITIGATED' : 'DISRUPTION MONITOR'}
                  </span>
                  <span className="text-[10px] opacity-80">
                    {isDisrupted
                      ? 'Feeder delay exceeds safe interchange window'
                      : isAtRisk
                      ? 'Delay of +45m detected'
                      : isRecovered
                      ? 'Alternative connector dispatched'
                      : 'All segments operating on schedule'}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold">
                {isDisrupted ? 'CRITICAL' : isAtRisk ? 'MODERATE' : 'NORMAL'}
              </span>
            </div>

            <ArrowDown className="w-3.5 h-3.5 text-text-muted" />

            {/* 4. EXPECTED TIME RECALCULATION */}
            <div className="w-full sm:w-96 p-3 rounded-xl bg-surface-lowest border border-border flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-primary-light" />
                <div>
                  <span className="font-bold text-text-primary uppercase text-[11px] block">
                    4. EXPECTED TIME RECALCULATION
                  </span>
                  <span className="text-text-muted text-[10px]">
                    Arr: {primaryConn ? primaryConn.arrivalTime : '1:30 PM'} • Dep: {primaryConn ? primaryConn.departureTime : '5:00 PM'}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-high text-[10px] text-text-secondary border border-border">
                Computed
              </span>
            </div>

            <ArrowDown className="w-3.5 h-3.5 text-text-muted" />

            {/* 5. CONNECTION ENGINE */}
            <div className={`w-full sm:w-96 p-3 rounded-xl border flex items-center justify-between transition-all ${
              primaryConn?.status === 'MISSED'
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                : primaryConn?.riskLevel === 'HIGH' || primaryConn?.riskLevel === 'MEDIUM'
                ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                : 'bg-surface-lowest border-border text-text-primary'
            }`}>
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-primary" />
                <div>
                  <span className="font-bold uppercase text-[11px] block">
                    5. CONNECTION ENGINE
                  </span>
                  <span className="text-[10px] opacity-80">
                    Buffer: {primaryConn ? `${primaryConn.availableBufferMinutes}m` : '210m'} vs {primaryConn ? `${primaryConn.requiredTransferMinutes}m` : '30m'} req
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-lowest/80 text-[10px] font-bold uppercase border border-border">
                {primaryConn?.status || 'SAFE'}
              </span>
            </div>

            <ArrowDown className="w-3.5 h-3.5 text-text-muted" />

            {/* 6. IMPACT ENGINE (3-WAY BRANCH) */}
            <div className="w-full space-y-2">
              <div className="text-center text-[10px] text-text-muted uppercase font-bold tracking-wider">
                6. IMPACT ENGINE CASCADE
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Transport branch */}
                <div className={`p-2.5 rounded-xl border ${
                  isDisrupted ? 'bg-rose-950/30 border-rose-500/40 text-rose-200' : 'bg-surface-lowest border-border text-text-muted'
                }`}>
                  <span className="font-bold block text-[10px] uppercase">🚌 Transport</span>
                  <span className="text-[9px] block opacity-80 mt-0.5">
                    {isDisrupted ? 'Downstream bus missed' : 'Feeder on schedule'}
                  </span>
                </div>

                {/* Connection branch */}
                <div className={`p-2.5 rounded-xl border ${
                  isDisrupted ? 'bg-rose-950/30 border-rose-500/40 text-rose-200' : 'bg-surface-lowest border-border text-text-muted'
                }`}>
                  <span className="font-bold block text-[10px] uppercase">🔄 Connection</span>
                  <span className="text-[9px] block opacity-80 mt-0.5">
                    {isDisrupted ? 'Interchange broken (-20m)' : 'Buffer +3h 30m safe'}
                  </span>
                </div>

                {/* Booking branch */}
                <div className={`p-2.5 rounded-xl border ${
                  isDisrupted ? 'bg-amber-950/30 border-amber-500/40 text-amber-200' : 'bg-surface-lowest border-border text-text-muted'
                }`}>
                  <span className="font-bold block text-[10px] uppercase">🏨 Bookings</span>
                  <span className="text-[9px] block opacity-80 mt-0.5">
                    {isDisrupted ? 'Hotel late arrival alert' : 'Hotel confirmed'}
                  </span>
                </div>
              </div>
            </div>

            <ArrowDown className="w-3.5 h-3.5 text-text-muted" />

            {/* 7. JOURNEY HEALTH */}
            <div className="w-full sm:w-96 p-3 rounded-xl bg-surface-lowest border border-border flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <HeartPulse className="w-4 h-4 text-primary" />
                <div>
                  <span className="font-bold text-text-primary uppercase text-[11px] block">
                    7. JOURNEY HEALTH
                  </span>
                  <span className="text-text-muted text-[10px]">
                    Derived from Delays, Buffers, & Impacts
                  </span>
                </div>
              </div>
              <span className={`text-sm font-black font-display ${
                journeyHealth >= 90 ? 'text-emerald-400' : journeyHealth >= 70 ? 'text-amber-400' : 'text-rose-400 font-bold animate-pulse'
              }`}>
                {journeyHealth}%
              </span>
            </div>

            <ArrowDown className="w-3.5 h-3.5 text-text-muted" />

            {/* 8. RECOVERY REQUIRED / RESTORED */}
            <div className={`w-full sm:w-96 p-3.5 rounded-xl border flex items-center justify-between transition-all ${
              isDisrupted
                ? 'bg-rose-500 text-white shadow-glow-danger font-bold cursor-pointer hover:bg-rose-600'
                : isRecovered
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                : 'bg-surface-lowest border-border text-text-muted'
            }`}
            onClick={() => isDisrupted && setCurrentTab('recovery')}
            >
              <div className="flex items-center gap-2.5">
                {isRecovered ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <LifeBuoy className={`w-5 h-5 ${isDisrupted ? 'animate-spin' : ''}`} />
                )}
                <div>
                  <span className="font-bold uppercase text-[11px] block">
                    {isDisrupted ? '8. "RECOVERY REQUIRED"' : isRecovered ? '8. "JOURNEY RESTORED"' : '8. "NOMINAL MONITORING"'}
                  </span>
                  <span className="text-[10px] opacity-90">
                    {isDisrupted
                      ? 'Click to open Recovery Center (3 plans ranked)'
                      : isRecovered
                      ? 'Replacement option active & protected'
                      : 'No recovery actions needed'}
                  </span>
                </div>
              </div>
              <span className="text-xs uppercase tracking-wider font-display">
                {isDisrupted ? 'EXECUTE →' : isRecovered ? 'ACTIVE' : 'STANDBY'}
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
