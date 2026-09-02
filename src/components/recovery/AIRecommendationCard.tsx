import React from 'react';
import { Bot, Sparkles, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';

export const AIRecommendationCard: React.FC = () => {
  const { recommendedPlan, selectPlanForConfirmation, setCurrentTab } = useDemo();

  if (!recommendedPlan) return null;

  return (
    <div className="rounded-2xl p-6 bg-gradient-to-r from-primary/15 via-surface-container to-primary/10 border border-primary/40 shadow-glow-primary space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/50 flex items-center justify-center text-primary-light shadow-sm">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black font-display tracking-tight text-text-primary">
                AI RECOVERY RECOMMENDATION
              </h3>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-primary/30 border border-primary/60 text-primary-light font-bold">
                SCORE: {recommendedPlan.recoveryScore}%
              </span>
            </div>
            <p className="text-xs text-text-muted font-mono">
              Deterministic Multi-Criteria Routing Engine + Explainable AI
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentTab('ai')}
          className="text-xs font-mono text-primary-light hover:text-white underline hidden sm:inline"
        >
          Chat with AI Guide →
        </button>
      </div>

      <div className="p-4 rounded-xl bg-surface-lowest/80 border border-border/70 space-y-3 font-mono text-xs">
        <p className="text-text-primary font-sans text-sm font-medium leading-relaxed">
          "I recommend <span className="text-primary font-bold">{recommendedPlan.title}</span>. It scores{' '}
          <span className="text-emerald-400 font-bold">{recommendedPlan.recoveryScore}%</span> and recovers your journey with arrival at{' '}
          <span className="text-text-primary font-bold">{recommendedPlan.newArrival}</span>,{' '}
          {recommendedPlan.hotelStatus === 'PRESERVED' ? 'preserving your hotel reservation' : 'with late check-in notification'},{' '}
          and requires {recommendedPlan.transfersCount === 0 ? 'zero transfers' : `${recommendedPlan.transfersCount} transfer`}. Contingency fare:{' '}
          <span className="text-emerald-400 font-bold">
            {recommendedPlan.additionalCost > 0 ? `+₹${recommendedPlan.additionalCost}` : '₹0 (No extra cost)'}
          </span>."
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-border/50 text-[11px]">
          <div className="space-y-1">
            {recommendedPlan.tradeoffs.advantages.slice(0, 2).map((adv, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>{adv}</span>
              </div>
            ))}
          </div>
          <div className="space-y-1">
            {recommendedPlan.tradeoffs.disadvantages.slice(0, 1).map((dis, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-amber-300/90">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>{dis}</span>
              </div>
            ))}
            {recommendedPlan.tradeoffs.disadvantages.length === 0 && (
              <div className="flex items-center gap-1.5 text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Zero negative tradeoffs identified</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-4 text-xs font-mono text-text-muted">
          <span>
            Arrival: <span className="font-bold text-text-primary">{recommendedPlan.newArrival}</span>
          </span>
          <span>•</span>
          <span>
            Cost: <span className="font-bold text-text-primary">₹{recommendedPlan.totalCost}</span>
          </span>
          <span>•</span>
          <span>
            Preservation: <span className="font-bold text-emerald-400">{recommendedPlan.itineraryPreservation}%</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentTab('ai')}
            className="px-3 py-2 rounded-xl bg-surface-high hover:bg-surface-highest border border-border text-xs text-text-secondary font-mono flex items-center gap-1.5 transition-colors"
          >
            <Bot className="w-3.5 h-3.5 text-primary" />
            <span>Ask AI Why</span>
          </button>

          <button
            onClick={() => selectPlanForConfirmation(recommendedPlan)}
            className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold font-display shadow-glow-primary flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Select Recommended Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
