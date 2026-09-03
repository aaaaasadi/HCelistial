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
  CheckCircle2,
  ShieldCheck,
  Building2,
  Bus,
  Train,
  ArrowRight
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
    <div className="rounded-3xl p-6 bg-white/95 backdrop-blur-2xl border-2 border-amber-900/15 shadow-glass-warm space-y-6">
      {/* Header with collapse toggle */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between cursor-pointer select-none group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-700 shadow-sm transition-transform group-hover:scale-105">
            <GitFork className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-black font-display text-stone-900">
                Disruption & Recovery Evaluation Pipeline
              </h3>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                ACTIVE ENGINE ARCHITECTURE
              </span>
            </div>
            <p className="text-xs text-stone-600 font-sans mt-0.5 font-medium">
              Live automated cascade: Planned Journey → Disruption → Connection Engine → Impact → Recovery
            </p>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 group-hover:bg-amber-50 group-hover:text-amber-800 transition-colors">
          {isExpanded ? <ChevronUp className="w-4 h-4 stroke-[2.5]" /> : <ChevronDown className="w-4 h-4 stroke-[2.5]" />}
        </div>
      </div>

      {/* Pipeline Diagram Content */}
      {isExpanded && (
        <div className="pt-4 border-t border-stone-200/80">
          <div className="flex flex-col items-center max-w-xl mx-auto space-y-3 font-sans text-xs">
            
            {/* 1. PLANNED JOURNEY */}
            <div className="w-full p-4 rounded-2xl bg-white border-2 border-stone-200/90 shadow-sm hover:border-amber-400 transition-all flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 flex-shrink-0">
                  <Calendar className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <div className="font-bold text-stone-900 uppercase text-xs tracking-wider flex items-center gap-1.5">
                    <span className="text-blue-700 font-black">1.</span> PLANNED JOURNEY
                  </div>
                  <div className="text-stone-600 text-xs font-semibold mt-0.5">
                    {currentTrip.origin.split(' ')[0]} → Pune → {currentTrip.destination.split(',')[0]}
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-[11px] font-bold border border-stone-300 flex-shrink-0">
                Scheduled
              </span>
            </div>

            {/* Connecting Arrow */}
            <div className="flex items-center justify-center py-0.5">
              <ArrowDown className="w-4 h-4 text-amber-600 stroke-[2.5]" />
            </div>

            {/* 2. LIVE STATE */}
            <div className="w-full p-4 rounded-2xl bg-white border-2 border-stone-200/90 shadow-sm hover:border-amber-400 transition-all flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0">
                  <Activity className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <div className="font-bold text-stone-900 uppercase text-xs tracking-wider flex items-center gap-1.5">
                    <span className="text-emerald-700 font-black">2.</span> LIVE STATE TELEMETRY
                  </div>
                  <div className="text-stone-600 text-xs font-semibold mt-0.5">
                    Active Polling via Simulated Intermodal APIs
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold border border-emerald-300 flex-shrink-0 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Polling Active
              </span>
            </div>

            {/* Connecting Arrow */}
            <div className="flex items-center justify-center py-0.5">
              <ArrowDown className="w-4 h-4 text-amber-600 stroke-[2.5]" />
            </div>

            {/* 3. DISRUPTION */}
            <div className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 shadow-sm ${
              isDisrupted
                ? 'bg-rose-50/90 border-rose-300 text-rose-950 shadow-md'
                : isAtRisk
                ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                : isRecovered
                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                : 'bg-white border-stone-200/90 text-stone-900'
            }`}>
              <div className="flex items-center gap-3.5">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${
                  isDisrupted
                    ? 'bg-rose-100 border-rose-300 text-rose-700'
                    : isAtRisk
                    ? 'bg-amber-100 border-amber-300 text-amber-800'
                    : isRecovered
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                    : 'bg-stone-100 border-stone-200 text-stone-700'
                }`}>
                  <AlertTriangle className={`w-4 h-4 stroke-[2.5] ${isDisrupted ? 'text-rose-600 animate-bounce' : ''}`} />
                </div>
                <div>
                  <div className="font-bold uppercase text-xs tracking-wider flex items-center gap-1.5 text-stone-950">
                    <span className={isDisrupted ? 'text-rose-700 font-black' : isAtRisk ? 'text-amber-700 font-black' : 'text-stone-700 font-black'}>
                      3.
                    </span>{' '}
                    {isDisrupted ? '🚨 DISRUPTION OCCURRED' : isAtRisk ? '⚠️ DELAY DETECTED' : isRecovered ? '✓ INCIDENT MITIGATED' : 'DISRUPTION MONITOR'}
                  </div>
                  <div className="text-stone-700 text-xs font-semibold mt-0.5">
                    {isDisrupted
                      ? 'Feeder delay exceeds safe interchange window'
                      : isAtRisk
                      ? 'Delay of +45m detected on incoming train'
                      : isRecovered
                      ? 'Alternative connector dispatched'
                      : 'All segments operating on schedule'}
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase border flex-shrink-0 ${
                isDisrupted
                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm animate-pulse'
                  : isAtRisk
                  ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                  : isRecovered
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-stone-100 text-stone-800 border-stone-300'
              }`}>
                {isDisrupted ? 'CRITICAL' : isAtRisk ? 'MODERATE' : isRecovered ? 'RESOLVED' : 'NORMAL'}
              </span>
            </div>

            {/* Connecting Arrow */}
            <div className="flex items-center justify-center py-0.5">
              <ArrowDown className="w-4 h-4 text-amber-600 stroke-[2.5]" />
            </div>

            {/* 4. EXPECTED TIME RECALCULATION */}
            <div className="w-full p-4 rounded-2xl bg-white border-2 border-stone-200/90 shadow-sm hover:border-amber-400 transition-all flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 flex-shrink-0">
                  <Clock className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <div className="font-bold text-stone-900 uppercase text-xs tracking-wider flex items-center gap-1.5">
                    <span className="text-purple-700 font-black">4.</span> EXPECTED TIME RECALCULATION
                  </div>
                  <div className="text-stone-600 text-xs font-semibold mt-0.5">
                    Arrival: {primaryConn ? primaryConn.arrivalTime : '1:30 PM'} • Departure: {primaryConn ? primaryConn.departureTime : '5:00 PM'}
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-[11px] font-bold border border-purple-300 flex-shrink-0">
                Computed
              </span>
            </div>

            {/* Connecting Arrow */}
            <div className="flex items-center justify-center py-0.5">
              <ArrowDown className="w-4 h-4 text-amber-600 stroke-[2.5]" />
            </div>

            {/* 5. CONNECTION ENGINE */}
            <div className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 shadow-sm ${
              primaryConn?.status === 'MISSED'
                ? 'bg-rose-50/90 border-rose-300 text-rose-950'
                : primaryConn?.riskLevel === 'HIGH' || primaryConn?.riskLevel === 'MEDIUM'
                ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                : 'bg-white border-stone-200/90 text-stone-900'
            }`}>
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 flex-shrink-0">
                  <Zap className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <div className="font-bold text-stone-900 uppercase text-xs tracking-wider flex items-center gap-1.5">
                    <span className="text-cyan-700 font-black">5.</span> CONNECTION ENGINE
                  </div>
                  <div className="text-stone-700 text-xs font-semibold mt-0.5">
                    Buffer: <strong className="text-stone-950 font-black">{primaryConn ? `${primaryConn.availableBufferMinutes}m` : '210m'}</strong> vs {primaryConn ? `${primaryConn.requiredTransferMinutes}m` : '30m'} required
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase border flex-shrink-0 ${
                primaryConn?.status === 'MISSED'
                  ? 'bg-rose-600 text-white border-rose-600'
                  : primaryConn?.riskLevel === 'HIGH'
                  ? 'bg-rose-100 text-rose-900 border-rose-300'
                  : primaryConn?.riskLevel === 'MEDIUM'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-emerald-100 text-emerald-900 border-emerald-300'
              }`}>
                {primaryConn?.status || 'SAFE'}
              </span>
            </div>

            {/* Connecting Arrow */}
            <div className="flex items-center justify-center py-0.5">
              <ArrowDown className="w-4 h-4 text-amber-600 stroke-[2.5]" />
            </div>

            {/* 6. IMPACT ENGINE (3-WAY BRANCH) */}
            <div className="w-full space-y-2.5">
              <div className="text-center text-xs text-stone-800 uppercase font-black tracking-wider flex items-center justify-center gap-2">
                <span className="h-[1px] w-12 bg-stone-300" />
                <span>6. IMPACT ENGINE CASCADE</span>
                <span className="h-[1px] w-12 bg-stone-300" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Transport branch */}
                <div className={`p-3.5 rounded-2xl border-2 transition-all shadow-sm ${
                  isDisrupted 
                    ? 'bg-rose-50 border-rose-300 text-rose-950' 
                    : 'bg-white border-stone-200 text-stone-900'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Bus className={`w-4 h-4 ${isDisrupted ? 'text-rose-600' : 'text-amber-700'}`} />
                    <span className="font-bold text-xs uppercase text-stone-900">Transport</span>
                  </div>
                  <span className="text-xs font-medium block text-stone-600">
                    {isDisrupted ? 'Downstream bus missed' : 'Feeder on schedule'}
                  </span>
                </div>

                {/* Connection branch */}
                <div className={`p-3.5 rounded-2xl border-2 transition-all shadow-sm ${
                  isDisrupted 
                    ? 'bg-rose-50 border-rose-300 text-rose-950' 
                    : 'bg-white border-stone-200 text-stone-900'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className={`w-4 h-4 ${isDisrupted ? 'text-rose-600' : 'text-cyan-700'}`} />
                    <span className="font-bold text-xs uppercase text-stone-900">Connection</span>
                  </div>
                  <span className="text-xs font-medium block text-stone-600">
                    {isDisrupted ? 'Interchange broken (-20m)' : 'Buffer +3h 30m safe'}
                  </span>
                </div>

                {/* Booking branch */}
                <div className={`p-3.5 rounded-2xl border-2 transition-all shadow-sm ${
                  isDisrupted 
                    ? 'bg-amber-50 border-amber-300 text-amber-950' 
                    : 'bg-white border-stone-200 text-stone-900'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className={`w-4 h-4 ${isDisrupted ? 'text-amber-700' : 'text-emerald-700'}`} />
                    <span className="font-bold text-xs uppercase text-stone-900">Bookings</span>
                  </div>
                  <span className="text-xs font-medium block text-stone-600">
                    {isDisrupted ? 'Hotel late arrival alert' : 'Hotel confirmed'}
                  </span>
                </div>
              </div>
            </div>

            {/* Connecting Arrow */}
            <div className="flex items-center justify-center py-0.5">
              <ArrowDown className="w-4 h-4 text-amber-600 stroke-[2.5]" />
            </div>

            {/* 7. JOURNEY HEALTH */}
            <div className="w-full p-4 rounded-2xl bg-white border-2 border-stone-200/90 shadow-sm hover:border-amber-400 transition-all flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 flex-shrink-0">
                  <HeartPulse className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <div className="font-bold text-stone-900 uppercase text-xs tracking-wider flex items-center gap-1.5">
                    <span className="text-rose-700 font-black">7.</span> JOURNEY HEALTH
                  </div>
                  <div className="text-stone-600 text-xs font-semibold mt-0.5">
                    Derived from Delays, Buffers, & Impacts
                  </div>
                </div>
              </div>
              <span className={`text-base font-black font-display px-3 py-1 rounded-xl border ${
                journeyHealth >= 90 
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                  : journeyHealth >= 70 
                  ? 'bg-amber-100 text-amber-900 border-amber-300' 
                  : 'bg-rose-100 text-rose-900 border-rose-300 font-bold animate-pulse'
              }`}>
                {journeyHealth}%
              </span>
            </div>

            {/* Connecting Arrow */}
            <div className="flex items-center justify-center py-0.5">
              <ArrowDown className="w-4 h-4 text-amber-600 stroke-[2.5]" />
            </div>

            {/* 8. RECOVERY REQUIRED / RESTORED */}
            <div 
              onClick={() => isDisrupted && setCurrentTab('recovery')}
              className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between gap-4 transition-all shadow-md ${
                isDisrupted
                  ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white border-rose-600 font-bold cursor-pointer hover:scale-[1.01] active:scale-[0.99] shadow-glow-danger'
                  : isRecovered
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                  : 'bg-white border-stone-200 text-stone-900'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${
                  isDisrupted 
                    ? 'bg-white/20 border-white/30 text-white' 
                    : isRecovered 
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-700' 
                    : 'bg-stone-100 border-stone-200 text-stone-700'
                }`}>
                  {isRecovered ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 stroke-[2.5]" />
                  ) : (
                    <LifeBuoy className={`w-5 h-5 stroke-[2.5] ${isDisrupted ? 'animate-spin' : ''}`} />
                  )}
                </div>
                <div>
                  <div className="font-bold uppercase text-xs tracking-wider flex items-center gap-1.5">
                    <span className="font-black">8.</span>{' '}
                    {isDisrupted ? 'RECOVERY REQUIRED' : isRecovered ? 'JOURNEY RESTORED' : 'NOMINAL MONITORING'}
                  </div>
                  <div className={`text-xs font-semibold mt-0.5 ${isDisrupted ? 'text-white/90' : 'text-stone-600'}`}>
                    {isDisrupted
                      ? 'Click to open Recovery Center (3 plans ranked)'
                      : isRecovered
                      ? 'Replacement option active & protected'
                      : 'No recovery actions needed'}
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1 flex-shrink-0 ${
                isDisrupted 
                  ? 'bg-white text-rose-700 border-white shadow-sm' 
                  : isRecovered 
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                  : 'bg-stone-100 text-stone-800 border-stone-300'
              }`}>
                <span>{isDisrupted ? 'EXECUTE' : isRecovered ? 'ACTIVE' : 'STANDBY'}</span>
                {isDisrupted && <ArrowRight className="w-3.5 h-3.5" />}
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
