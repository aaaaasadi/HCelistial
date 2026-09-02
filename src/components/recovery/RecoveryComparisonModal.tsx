import React from 'react';
import {
  X,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Train,
  Bus,
  Plane,
  Building2,
  Ticket
} from 'lucide-react';
import { RecoveryPlan, TransportSegment } from '../../types';
import { useDemo } from '../../context/DemoContext';

interface RecoveryComparisonModalProps {
  plan: RecoveryPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: RecoveryPlan) => void;
}

export const RecoveryComparisonModal: React.FC<RecoveryComparisonModalProps> = ({
  plan,
  isOpen,
  onClose,
  onSelectPlan
}) => {
  const { currentTrip } = useDemo();

  if (!isOpen || !plan) return null;

  const originalSegments = currentTrip.segments;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-surface-container border border-border p-6 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-display text-text-primary">
                Side-by-Side Journey Comparison
              </h2>
              {plan.tag && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/20 text-primary-light border border-primary/40">
                  {plan.tag}
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted font-mono mt-0.5">
              Evaluating: {plan.title} • {plan.recoveryScore}% Recovery Score
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-surface-high hover:bg-surface-highest text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Side-by-Side Grid: ORIGINAL vs RECOVERY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: ORIGINAL PLAN (DISRUPTED) */}
          <div className="p-4 rounded-xl bg-surface-lowest border border-rose-500/30 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span className="font-bold font-display text-sm text-text-primary uppercase tracking-wider">
                  ORIGINAL SCHEDULE
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold border border-rose-500/40">
                DISRUPTED
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {/* Train 12127 */}
              <div className="p-3 rounded-lg bg-surface-container border border-rose-500/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary">🚆 Train 12127 Intercity</span>
                  <span className="text-rose-400 font-bold">+200m Late</span>
                </div>
                <div className="text-[11px] text-text-muted">
                  Mumbai CSMT (10:00 AM) → Pune Jn (Expected: 4:50 PM)
                </div>
                <span className="inline-block px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[9px] font-bold">
                  DELAYED FEADER
                </span>
              </div>

              {/* Connection Violation */}
              <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-[11px] text-rose-300 space-y-0.5">
                <div className="font-bold">❌ Connection Broken at Pune</div>
                <div>Buffer: 10 mins (Requires 30 mins)</div>
              </div>

              {/* Bus PT-8842 */}
              <div className="p-3 rounded-lg bg-surface-container border border-rose-500/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary">🚌 Purple Travels PT-8842</span>
                  <span className="text-rose-400 font-bold">MISSED</span>
                </div>
                <div className="text-[11px] text-text-muted">
                  Pune Swargate (5:00 PM) → Panaji (11:00 PM)
                </div>
                <span className="inline-block px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[9px] font-bold">
                  REPLACED
                </span>
              </div>

              {/* Hotel */}
              <div className="p-3 rounded-lg bg-surface-container border border-amber-500/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary">🏨 Casa Ocean Retreat</span>
                  <span className="text-amber-400 font-bold">At Risk</span>
                </div>
                <div className="text-[11px] text-text-muted">
                  Check-in 11:00 PM • Late arrival cancellation risk
                </div>
              </div>

              {/* Activity */}
              <div className="p-3 rounded-lg bg-surface-container border border-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary">🎟️ Grand Island Scuba</span>
                  <span className="text-text-muted font-bold">Tomorrow 9:00 AM</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border flex justify-between text-xs font-mono">
              <span className="text-text-muted">Original Cost:</span>
              <span className="font-bold text-text-primary">₹900</span>
            </div>
          </div>

          {/* Right Column: PROPOSED RECOVERY PLAN */}
          <div className="p-4 rounded-xl bg-surface-lowest border border-emerald-500/40 space-y-4 shadow-glow-success">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-bold font-display text-sm text-emerald-300 uppercase tracking-wider">
                  RECONSTRUCTED ITINERARY
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/40">
                FEASIBLE
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {plan.segments.map((seg, idx) => (
                <div
                  key={seg.id || idx}
                  className="p-3 rounded-lg bg-surface-container border border-emerald-500/40 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text-primary">
                      {seg.type === 'TRAIN' ? '🚆' : seg.type === 'BUS' ? '🚌' : '✈️'} {seg.serviceNumber}
                    </span>
                    <span className="text-emerald-400 font-bold">✓ CONFIRMED</span>
                  </div>
                  <div className="text-[11px] text-text-muted">
                    {seg.origin} ({seg.departureTime}) → {seg.destination} ({seg.estimatedArrival})
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                      {idx === 0 && seg.id.includes('12127') ? 'PRESERVED FEEDER' : 'NEW RECOVERY SEGMENT'}
                    </span>
                    <span className="text-[10px] text-text-subtle">• Provider: {seg.provider}</span>
                  </div>
                </div>
              ))}

              {/* Hotel status under recovery */}
              <div className="p-3 rounded-lg bg-surface-container border border-emerald-500/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary">🏨 Casa Ocean Retreat</span>
                  <span className="text-emerald-400 font-bold">
                    {plan.hotelStatus === 'PRESERVED' ? '✓ PRESERVED' : 'Late Alert Dispatched'}
                  </span>
                </div>
                <div className="text-[11px] text-text-muted">
                  Arrival: {plan.newArrival} • Reservation Guaranteed
                </div>
                <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                  PRESERVED
                </span>
              </div>

              {/* Activity status */}
              <div className="p-3 rounded-lg bg-surface-container border border-emerald-500/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary">🎟️ Grand Island Scuba</span>
                  <span className="text-emerald-400 font-bold">
                    {plan.activityStatus === 'PRESERVED' ? '✓ 100% PROTECTED' : 'Reschedule Alert'}
                  </span>
                </div>
                <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                  PRESERVED
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-border flex justify-between items-center text-xs font-mono">
              <span className="text-text-muted">Total Fare:</span>
              <div className="text-right">
                <span className="font-bold text-text-primary text-sm">₹{plan.totalCost}</span>
                <span className="text-emerald-400 block text-[10px]">
                  (+₹{plan.additionalCost} additional)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Structured Advantages & Tradeoffs */}
        <div className="p-4 rounded-xl bg-surface-lowest border border-border space-y-2.5">
          <h4 className="text-xs font-bold font-display uppercase tracking-wider text-text-primary">
            Tradeoff Analysis & Rationale
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <span className="text-emerald-400 font-bold block mb-1">Advantages:</span>
              <ul className="space-y-1 text-text-secondary">
                {plan.tradeoffs.advantages.map((adv, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400">✓</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-amber-400 font-bold block mb-1">Disadvantages:</span>
              <ul className="space-y-1 text-text-muted">
                {plan.tradeoffs.disadvantages.map((dis, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400">△</span>
                    <span>{dis}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
          <div className="font-mono text-xs text-text-muted">
            Arrival in Goa: <span className="font-bold text-text-primary">{plan.newArrival}</span> • Transfers: {plan.transfersCount}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-surface-high hover:bg-surface-highest text-text-secondary text-xs font-mono transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSelectPlan(plan);
                onClose();
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold font-display shadow-glow-primary flex items-center justify-center gap-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Select & Reconstruct Journey</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
