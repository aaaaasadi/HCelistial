import React from 'react';
import {
  Flame,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Layers,
  ChevronDown,
  Database
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { DemoScenarioId } from '../../types';

export const DemoStateBar: React.FC = () => {
  const {
    activeScenario,
    applyScenario,
    simulateDisruption,
    resetJourney,
    journeyHealth,
    journeyStatus,
    connectionRisk,
    setCurrentTab,
    isDatabaseMode
  } = useDemo();

  const isDisrupted = journeyStatus === 'DISRUPTED';
  const isRecovered = journeyStatus === 'RECOVERED';

  const scenarios: { id: DemoScenarioId; label: string; num: string }[] = [
    { id: 'SCENARIO_1_NORMAL', label: '1. Normal On-Track', num: '1' },
    { id: 'SCENARIO_2_TRAIN_DELAY', label: '2. Train Delayed (+45m)', num: '2' },
    { id: 'SCENARIO_3_SEVERE_DELAY', label: '3. Severe Delay (+3h 20m)', num: '3' },
    { id: 'SCENARIO_4_BUS_CANCELLED', label: '4. Bus Cancelled', num: '4' },
    { id: 'SCENARIO_5_MISSED_CONNECTION', label: '5. Missed Connection', num: '5' },
    { id: 'SCENARIO_6_RECOVERED', label: '6. Recovered', num: '6' },
  ];

  return (
    <aside aria-label="Demo Controller" className="w-full bg-surface-container/95 border-b border-border-strong px-4 py-2 text-xs backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Disruption / Recovery quick CTAs */}
        <div className="flex items-center gap-2">
          {!isDisrupted && !isRecovered ? (
            <button
              onClick={simulateDisruption}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-disruption hover:bg-disruption-dark text-white font-bold tracking-wide shadow-glow-danger transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Flame className="w-4 h-4 animate-bounce" />
              <span>SIMULATE TRAIN DELAY (+3h 20m)</span>
            </button>
          ) : (
            <button
              onClick={resetJourney}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-high hover:bg-surface-highest text-text-primary border border-border transition-colors font-mono font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Journey</span>
            </button>
          )}

          {isDisrupted && (
            <button
              onClick={() => setCurrentTab('recovery')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary-light border border-primary/40 font-medium transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Recovery Center</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Center: Interactive Demo Scenario Switcher */}
        <div className="flex items-center gap-1 bg-surface-lowest px-2 py-1 rounded-lg border border-border overflow-x-auto">
          <div className="flex items-center gap-1 text-[10px] text-text-muted font-mono uppercase px-1">
            <Layers className="w-3 h-3 text-primary" />
            <span className="hidden sm:inline">Scenario:</span>
          </div>

          <div className="flex items-center gap-1">
            {scenarios.map((sc) => {
              const isActive = activeScenario === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => {
                    applyScenario(sc.id);
                    if (sc.id === 'SCENARIO_3_SEVERE_DELAY' || sc.id === 'SCENARIO_4_BUS_CANCELLED' || sc.id === 'SCENARIO_5_MISSED_CONNECTION') {
                      setCurrentTab('recovery');
                    } else if (sc.id === 'SCENARIO_6_RECOVERED' || sc.id === 'SCENARIO_1_NORMAL') {
                      setCurrentTab('journey');
                    }
                  }}
                  className={`px-2 py-1 rounded text-[11px] font-mono transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-primary text-white font-bold shadow-sm'
                      : 'text-text-muted hover:text-text-primary hover:bg-surface-high'
                  }`}
                  title={sc.label}
                >
                  <span className="sm:hidden">{sc.num}</span>
                  <span className="hidden sm:inline">{sc.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Real-time Journey Health & Risk from Central State */}
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted">Health:</span>
            <span className={`font-bold ${
              journeyHealth >= 90 ? 'text-emerald-400' : journeyHealth >= 70 ? 'text-amber-400' : 'text-rose-400 animate-pulse'
            }`}>
              {journeyHealth}%
            </span>
          </div>

          <div className="w-px h-3 bg-border" />

          <div className="flex items-center gap-1.5">
            <span className="text-text-muted">Status:</span>
            <span className={`font-bold ${
              journeyStatus === 'ON_TRACK'
                ? 'text-emerald-400'
                : journeyStatus === 'RECOVERED'
                ? 'text-emerald-300'
                : journeyStatus === 'AT_RISK'
                ? 'text-amber-400'
                : 'text-rose-400'
            }`}>
              {journeyStatus}
            </span>
          </div>

          <div className="w-px h-3 bg-border hidden sm:block" />

          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-text-muted">Conn Risk:</span>
            <span className={`font-bold ${
              connectionRisk === 'LOW' ? 'text-emerald-400' : connectionRisk === 'MEDIUM' ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {connectionRisk}
            </span>
          </div>

          <div className="w-px h-3 bg-border" />

          {/* Database Mode Status Badge */}
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${
              isDatabaseMode
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}
            title={isDatabaseMode ? 'Connected to PostgreSQL 18 Database' : 'Running in Local Mock Mode'}
          >
            <Database className="w-3 h-3" />
            <span>{isDatabaseMode ? 'POSTGRESQL 18' : 'LOCAL DEMO'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
