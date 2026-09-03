import React, { useState } from 'react';
import {
  Star,
  Zap,
  Tag,
  Clock,
  ArrowRight,
  Building2,
  Ticket,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Scale,
  Train,
  Bus,
  Plane
} from 'lucide-react';
import { RecoveryPlan } from '../../types';
import { useDemo } from '../../context/DemoContext';

interface RecoveryPlanCardProps {
  plan: RecoveryPlan;
}

export const RecoveryPlanCard: React.FC<RecoveryPlanCardProps> = ({ plan }) => {
  const { selectPlanForConfirmation, openComparisonModal } = useDemo();
  const [isWhyOpen, setIsWhyOpen] = useState(plan.tag === 'RECOMMENDED');

  const getTagStyle = () => {
    switch (plan.tag) {
      case 'RECOMMENDED':
        return {
          badge: 'bg-amber-100 text-amber-900 border-amber-400 font-bold',
          icon: Star,
          border: 'border-amber-500 shadow-glow-cream ring-2 ring-amber-500/20'
        };
      case 'CHEAPEST':
        return {
          badge: 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold',
          icon: Tag,
          border: 'border-emerald-500/60 hover:border-emerald-600'
        };
      case 'FASTEST':
        return {
          badge: 'bg-blue-100 text-blue-900 border-blue-400 font-bold',
          icon: Zap,
          border: 'border-blue-500/60 hover:border-blue-600'
        };
      default:
        return {
          badge: 'bg-stone-100 text-stone-800 border-stone-300 font-bold',
          icon: Tag,
          border: 'border-stone-300 hover:border-stone-400'
        };
    }
  };

  const tagStyle = getTagStyle();
  const TagIcon = tagStyle.icon;

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'AIR':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      case 'MULTIMODAL':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'GROUND':
      default:
        return 'bg-surface-highest text-text-secondary border-border';
    }
  };

  return (
    <div
      className={`rounded-2xl p-5 bg-surface-container/90 border transition-all flex flex-col justify-between ${
        plan.tag === 'RECOMMENDED'
          ? 'hud-card border-primary/50 shadow-glow-primary'
          : 'hud-card-interactive'
      }`}
    >
      <div>
        {/* Card Header: Tag, Type & Score */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            {plan.tag && (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-xs font-bold border ${tagStyle.badge}`}
              >
                <TagIcon className="w-3.5 h-3.5 fill-current" />
                <span>{plan.tag}</span>
              </span>
            )}
            <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase border ${getTypeBadge(plan.type)}`}>
              {plan.type}
            </span>
            <span className="font-mono text-xs text-text-muted">
              {plan.transportTypes.join(' + ')}
            </span>
          </div>

          <div className="text-right">
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-2xl font-black font-display text-primary">
                {plan.recoveryScore}%
              </span>
            </div>
            <span className="text-[10px] font-mono text-text-muted uppercase block">
              Recovery Score
            </span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="mb-4">
          <h3 className="text-base font-bold font-display text-text-primary">
            {plan.title}
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            {plan.subtitle}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-surface-lowest/80 border border-border/50 font-mono text-xs mb-4">
          <div>
            <span className="text-text-muted block text-[10px] uppercase">New Arrival</span>
            <span className="font-bold text-text-primary">{plan.newArrival.split(' ')[0]} {plan.newArrival.split(' ')[1]}</span>
          </div>
          <div>
            <span className="text-text-muted block text-[10px] uppercase">Total Cost</span>
            <span className="font-bold text-text-primary">
              ₹{plan.totalCost.toLocaleString('en-IN')}{' '}
              {plan.additionalCost > 0 ? (
                <span className="text-[10px] font-normal text-emerald-400">
                  (+₹{plan.additionalCost})
                </span>
              ) : (
                <span className="text-[10px] font-normal text-text-muted">(+₹0)</span>
              )}
            </span>
          </div>
          <div>
            <span className="text-text-muted block text-[10px] uppercase">Preserved</span>
            <span className="font-bold text-emerald-400">
              {plan.itineraryPreservation}%
            </span>
          </div>
          <div>
            <span className="text-text-muted block text-[10px] uppercase">Transfers</span>
            <span className="font-bold text-text-primary">
              {plan.transfersCount} {plan.transfersCount === 1 ? 'transfer' : 'transfers'}
            </span>
          </div>
        </div>

        {/* Recovery Score Breakdown */}
        <div className="space-y-2 mb-4 p-3 rounded-xl bg-surface-high/40 border border-border/40 text-[11px] font-mono">
          <div className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-1">
            Score Breakdown
          </div>
          
          <div>
            <div className="flex justify-between text-text-secondary text-[10px] mb-0.5">
              <span>Arrival Timing (30%)</span>
              <span>{plan.scoreBreakdown.arrivalTime}%</span>
            </div>
            <div className="w-full bg-surface-lowest rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full"
                style={{ width: `${plan.scoreBreakdown.arrivalTime}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-text-secondary text-[10px] mb-0.5">
              <span>Contingency Cost (25%)</span>
              <span>{plan.scoreBreakdown.cost}%</span>
            </div>
            <div className="w-full bg-surface-lowest rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full"
                style={{ width: `${plan.scoreBreakdown.cost}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-text-secondary text-[10px] mb-0.5">
              <span>Itinerary Preservation (20%)</span>
              <span>{plan.scoreBreakdown.itineraryPreservation}%</span>
            </div>
            <div className="w-full bg-surface-lowest rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-purple-400 h-full rounded-full"
                style={{ width: `${plan.scoreBreakdown.itineraryPreservation}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-text-secondary text-[10px] mb-0.5">
              <span>Transfer Efficiency (15%)</span>
              <span>{plan.scoreBreakdown.transfers}%</span>
            </div>
            <div className="w-full bg-surface-lowest rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full"
                style={{ width: `${plan.scoreBreakdown.transfers}%` }}
              />
            </div>
          </div>
        </div>

        {/* Why this plan? Accordion */}
        <div className="mb-4">
          <button
            onClick={() => setIsWhyOpen(!isWhyOpen)}
            className="w-full flex items-center justify-between text-xs font-mono font-medium text-text-secondary hover:text-text-primary py-1"
          >
            <span className="flex items-center gap-1.5">
              <span className="text-primary font-bold">Why this plan?</span>
              <span className="text-[10px] text-text-muted">
                ({plan.tradeoffs.advantages.length} pros)
              </span>
            </span>
            {isWhyOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-text-muted" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
            )}
          </button>

          {isWhyOpen && (
            <div className="mt-2 p-3 rounded-xl bg-surface-lowest/90 border border-border/50 space-y-2 font-mono text-xs animate-in fade-in duration-150">
              <div className="space-y-1">
                {plan.tradeoffs.advantages.map((pro, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-emerald-300 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </div>
                ))}
              </div>
              {plan.tradeoffs.disadvantages.length > 0 && (
                <div className="space-y-1 pt-1.5 border-t border-border/40">
                  {plan.tradeoffs.disadvantages.map((con, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-amber-300/90 text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>{con}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-border/60 flex items-center gap-2">
        <button
          onClick={() => openComparisonModal(plan)}
          className="flex-1 px-3 py-2 text-xs font-mono font-medium rounded-lg bg-surface-high hover:bg-surface-highest text-text-secondary hover:text-text-primary border border-border transition-colors flex items-center justify-center gap-1.5"
        >
          <Scale className="w-3.5 h-3.5 text-primary" />
          <span>Compare vs Original</span>
        </button>

        <button
          onClick={() => selectPlanForConfirmation(plan)}
          className={`flex-1 px-3 py-2 text-xs font-display font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            plan.tag === 'RECOMMENDED'
              ? 'bg-primary hover:bg-primary-hover text-white shadow-glow-primary hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-surface-highest hover:bg-border text-text-primary'
          }`}
        >
          <span>Select Plan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
