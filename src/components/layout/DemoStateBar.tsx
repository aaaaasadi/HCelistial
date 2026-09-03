import React from 'react';
import {
  Flame,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Layers,
  Database,
  ShieldAlert
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { DemoScenarioId } from '../../types';

export const DemoStateBar: React.FC = () => {
  const {
    activeScenario,
    applyScenario,
    simulateDisruption,
    resetJourney,
    journeyStatus,
    setCurrentTab,
    isDatabaseMode
  } = useDemo();

  const isDisrupted = journeyStatus === 'DISRUPTED';
  const isRecovered = journeyStatus === 'RECOVERED';

  const scenarios: { id: DemoScenarioId; label: string; tag: string }[] = [
    { id: 'SCENARIO_1_NORMAL', label: 'On-Track', tag: 'Normal' },
    { id: 'SCENARIO_2_TRAIN_DELAY', label: 'Train +45m', tag: 'Minor Delay' },
    { id: 'SCENARIO_3_SEVERE_DELAY', label: 'Severe +3h 20m', tag: 'Critical' },
    { id: 'SCENARIO_4_BUS_CANCELLED', label: 'Bus Cancelled', tag: 'Connection Lost' },
    { id: 'SCENARIO_5_MISSED_CONNECTION', label: 'Missed Conn.', tag: 'Flight Risk' },
    { id: 'SCENARIO_6_RECOVERED', label: 'Recovered', tag: 'Multi-Modal' },
  ];

  return (
    <aside aria-label="Demo Controller" className="w-full px-3 sm:px-6 lg:px-8 pt-2.5 pb-1">
      <div className="max-w-7xl mx-auto">
        <div className="bg-surface-low/75 backdrop-blur-xl border border-border/70 rounded-2xl sm:rounded-3xl px-4 sm:px-5 py-2.5 shadow-sm flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Action Triggers (Simulate / Reset / Recovery) */}
          <div className="flex items-center gap-2.5">
            {!isDisrupted && !isRecovered ? (
              <button
                onClick={simulateDisruption}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-disruption via-disruption-bright to-rose-600 hover:opacity-95 text-white text-xs font-bold tracking-wide shadow-glow-danger transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] select-none"
              >
                <Flame className="w-4 h-4 animate-bounce" />
                <span>Simulate Disruption (+3h 20m Delay)</span>
              </button>
            ) : (
              <button
                onClick={resetJourney}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-high/80 hover:bg-surface-highest text-cream-light hover:text-white border border-border/80 transition-all font-mono text-xs font-medium rounded-full shadow-sm hover:scale-[1.01] active:scale-[0.98]"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cream-gold" />
                <span>Reset Journey</span>
              </button>
            )}

            {isDisrupted && (
              <button
                onClick={() => setCurrentTab('recovery')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream-gold/20 hover:bg-cream-gold/30 text-cream-light border border-cream-gold/50 text-xs font-semibold shadow-glow-cream transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-3.5 h-3.5 text-cream-gold animate-spin-slow" />
                <span>Open Recovery Center</span>
                <ArrowRight className="w-3.5 h-3.5 text-cream-gold" />
              </button>
            )}
          </div>

          {/* Center/Right: Uncongested Segmented Scenario Selector */}
          <div className="flex items-center gap-2 bg-surface-lowest/70 px-3 py-1.5 rounded-full border border-border/60 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 text-[10px] text-cream-gold/80 font-mono uppercase px-1 select-none">
              <Layers className="w-3.5 h-3.5 text-cream-gold" />
              <span className="hidden md:inline font-bold">Scenario:</span>
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
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap select-none ${
                      isActive
                        ? 'bg-cream-DEFAULT text-surface-lowest font-bold shadow-md shadow-cream-gold/15'
                        : 'text-text-muted hover:text-cream-light hover:bg-surface-high/60'
                    }`}
                    title={sc.tag}
                  >
                    <span>{sc.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Indicator: Database Status */}
          <div className="hidden xl:flex items-center gap-2 text-[11px] font-mono text-text-muted px-2">
            <Database className="w-3.5 h-3.5 text-cream-gold/70" />
            <span>{isDatabaseMode ? 'PostgreSQL Live' : 'Mock Memory Engine'}</span>
          </div>

        </div>
      </div>
    </aside>
  );
};
