import React, { useState, useMemo } from 'react';
import {
  LifeBuoy,
  AlertTriangle,
  CheckCircle2,
  Flame,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Sliders,
  DollarSign
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { ImpactCascadePanel } from './ImpactCascadePanel';
import { RecoveryPlanCard } from './RecoveryPlanCard';
import { AIRecommendationCard } from './AIRecommendationCard';
import { RecoveryConfirmModal } from './RecoveryConfirmModal';
import { RecoveryComparisonModal } from './RecoveryComparisonModal';
import { PipelineFlowDiagram } from '../common/PipelineFlowDiagram';
import { RecoveryPlan, RecoveryPlanType } from '../../types';
import { parseTimeToMinutes } from '../../utils/connectionEngine';

type FilterType = 'ALL' | RecoveryPlanType;
type SortType = 'RECOMMENDED' | 'CHEAPEST' | 'FASTEST' | 'TRANSFERS';

export const RecoveryCenterView: React.FC = () => {
  const {
    journeyStatus,
    recoveryPlans,
    simulateDisruption,
    resetJourney,
    setCurrentTab,
    confirmedPlan,
    comparisonPlan,
    isComparisonModalOpen,
    closeComparisonModal,
    selectPlanForConfirmation,
    updatePreferences,
    userPreferences
  } = useDemo();

  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [activeSort, setActiveSort] = useState<SortType>('RECOMMENDED');

  const isDisrupted = journeyStatus === 'DISRUPTED';
  const isRecovered = journeyStatus === 'RECOVERED';

  // Apply UI filters and sorting
  const filteredAndSortedPlans = useMemo(() => {
    let list = [...recoveryPlans];

    // Filter by type
    if (activeFilter !== 'ALL') {
      if (activeFilter === 'AIR') {
        list = list.filter((p) => p.type === 'AIR' || p.transportTypes.includes('FLIGHT'));
      } else {
        list = list.filter((p) => p.type === activeFilter);
      }
    }

    // Sort without changing original underlying score
    if (activeSort === 'CHEAPEST') {
      list.sort((a, b) => a.totalCost - b.totalCost);
    } else if (activeSort === 'FASTEST') {
      list.sort((a, b) => {
        let aMins = parseTimeToMinutes(a.newArrival);
        if (aMins < 360) aMins += 1440;
        let bMins = parseTimeToMinutes(b.newArrival);
        if (bMins < 360) bMins += 1440;
        return aMins - bMins;
      });
    } else if (activeSort === 'TRANSFERS') {
      list.sort((a, b) => a.transfersCount - b.transfersCount);
    } else {
      // Default: RECOMMENDED by score
      list.sort((a, b) => b.recoveryScore - a.recoveryScore);
    }

    return list;
  }, [recoveryPlans, activeFilter, activeSort]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Recovery Confirmation Modal */}
      <RecoveryConfirmModal />

      {/* Side-by-Side Comparison Modal */}
      <RecoveryComparisonModal
        plan={comparisonPlan}
        isOpen={isComparisonModalOpen}
        onClose={closeComparisonModal}
        onSelectPlan={selectPlanForConfirmation}
      />

      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-text-primary">
              Recovery Center
            </h1>
          </div>
          <p className="text-xs text-text-muted mt-1 font-mono">
            Deterministic Multimodal Contingency Engine • Alternative Discovery & Re-routing
          </p>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2">
          {!isDisrupted && !isRecovered && (
            <button
              onClick={simulateDisruption}
              className="px-4 py-2 rounded-xl bg-disruption hover:bg-disruption-dark text-white text-xs font-bold font-display shadow-glow-danger flex items-center gap-1.5 transition-all"
            >
              <Flame className="w-4 h-4 animate-bounce" />
              <span>Trigger Disruption Demo</span>
            </button>
          )}

          {isRecovered && (
            <button
              onClick={() => setCurrentTab('journey')}
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold font-display shadow-glow-primary flex items-center gap-1.5 transition-all"
            >
              <span>View Recovered Journey</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Engine Architecture Pipeline Diagram */}
      <PipelineFlowDiagram />

      {/* ================= STATE A: PRE-DISRUPTION (IDLE) ================= */}
      {!isDisrupted && !isRecovered && (
        <div className="p-12 rounded-2xl hud-card text-center space-y-4 border border-border">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-display text-text-primary">
              No Active Recovery Required
            </h2>
            <p className="text-sm text-text-muted max-w-md mx-auto">
              All multi-leg connections on your Mumbai → Pune → Goa route are operating on schedule with a comfortable 3h 30m transfer buffer.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={simulateDisruption}
              className="px-5 py-2.5 rounded-xl bg-disruption hover:bg-disruption-dark text-white text-xs font-bold font-display shadow-glow-danger inline-flex items-center gap-2 transition-all hover:scale-105"
            >
              <Flame className="w-4 h-4 animate-bounce" />
              <span>Simulate Train Delay (+3h 20m)</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= STATE B: POST-RECOVERY ================= */}
      {isRecovered && (
        <div className="p-8 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 shadow-glow-success space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-black font-display text-emerald-200">
                ✓ Journey Successfully Recovered
              </h2>
              <p className="text-xs text-emerald-300 font-mono mt-0.5">
                {confirmedPlan?.title || 'Train + Bus Seamless Connector'} has been locked in and confirmed.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-surface-lowest/80 border border-border/50 font-mono text-xs">
            <div>
              <span className="text-text-muted block text-[10px] uppercase">New Arrival in Goa</span>
              <span className="font-bold text-text-primary">11:40 PM Tonight</span>
            </div>
            <div>
              <span className="text-text-muted block text-[10px] uppercase">Hotel Reservation</span>
              <span className="font-bold text-emerald-400">Preserved (Casa Ocean Retreat)</span>
            </div>
            <div>
              <span className="text-text-muted block text-[10px] uppercase">Next Morning Activity</span>
              <span className="font-bold text-emerald-400">Scuba Excursion Protected</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentTab('journey')}
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold font-display shadow-glow-primary flex items-center gap-1.5"
            >
              <span>Inspect Reconstructed Journey Graph</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={resetJourney}
              className="px-4 py-2 rounded-xl bg-surface-high hover:bg-surface-highest border border-border text-xs text-text-secondary font-mono flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= STATE C: ACTIVE DISRUPTION ================= */}
      {isDisrupted && (
        <div className="space-y-6">
          {/* Prominent Alert Banner */}
          <div className="p-5 rounded-2xl bg-rose-950/50 border border-rose-500/50 shadow-glow-danger flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black font-display text-rose-200 tracking-tight">
                  🚨 RECOVERY REQUIRED — JOURNEY INFEASIBLE
                </h2>
                <p className="text-xs text-rose-300 mt-1">
                  Your original itinerary cannot be completed. Train 12127 delay (+3h 20m) eliminates the 3h 30m Pune transfer window. Pune → Goa bus is missed.
                </p>
              </div>
            </div>
            <div className="font-mono text-xs text-rose-300/80 sm:text-right flex-shrink-0">
              <span className="block font-bold text-rose-200">
                {recoveryPlans.length} RECOVERY {recoveryPlans.length === 1 ? 'PLAN' : 'PLANS'} FOUND
              </span>
              <span className="text-[10px]">Ranked by Multi-Criteria Engine</span>
            </div>
          </div>

          {/* Interactive Disruption Ripple Cascade */}
          <ImpactCascadePanel />

          {/* Prominent AI Recommendation Card */}
          <AIRecommendationCard />

          {/* Evaluated Recovery Plans Header & UI Filters */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
              <div>
                <h3 className="text-lg font-black font-display text-text-primary tracking-tight">
                  Evaluated Recovery Plans ({filteredAndSortedPlans.length})
                </h3>
                <p className="text-xs text-text-muted font-mono">
                  Compare arrival time, price, transfers, and downstream hotel preservation.
                </p>
              </div>

              {/* Filters & Sort Controls */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Filter by Type */}
                <div className="flex items-center gap-1 bg-surface-lowest p-1 rounded-lg border border-border text-xs font-mono">
                  <Filter className="w-3 h-3 text-text-muted ml-1" />
                  {(['ALL', 'GROUND', 'AIR', 'MULTIMODAL'] as FilterType[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                        activeFilter === f
                          ? 'bg-primary text-white font-bold'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {/* Sort by */}
                <div className="flex items-center gap-1 bg-surface-lowest p-1 rounded-lg border border-border text-xs font-mono">
                  <ArrowUpDown className="w-3 h-3 text-text-muted ml-1" />
                  {(['RECOMMENDED', 'CHEAPEST', 'FASTEST', 'TRANSFERS'] as SortType[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveSort(s)}
                      className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                        activeSort === s
                          ? 'bg-surface-highest text-primary-light font-bold border border-primary/30'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      {s.charAt(0) + s.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* If feasible recovery plans exist */}
            {filteredAndSortedPlans.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {filteredAndSortedPlans.map((plan) => (
                  <RecoveryPlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            ) : (
              /* Failure State: NO FEASIBLE RECOVERY FOUND */
              <div className="p-8 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold font-display text-rose-200">
                    🚨 NO FEASIBLE RECOVERY FOUND
                  </h3>
                  <p className="text-xs text-rose-300/80 max-w-md mx-auto font-mono">
                    All alternative combinations violate your active constraints (e.g. max budget of ₹{userPreferences.maxAdditionalBudget}, avoid flights, or avoid overnight travel).
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() =>
                      updatePreferences({
                        avoidFlights: false,
                        avoidOvernight: false,
                        maxAdditionalBudget: 3000
                      })
                    }
                    className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold font-display shadow-glow-primary transition-colors flex items-center gap-1.5"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Relax Preferences & Reset Budget to ₹3,000</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('preferences')}
                    className="px-4 py-2 rounded-xl bg-surface-high hover:bg-surface-highest border border-border text-xs text-text-secondary font-mono transition-colors"
                  >
                    Adjust Filters in Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
