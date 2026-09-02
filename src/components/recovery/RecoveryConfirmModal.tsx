import React from 'react';
import { CheckCircle2, X, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';

export const RecoveryConfirmModal: React.FC = () => {
  const {
    isConfirmModalOpen,
    closeConfirmationModal,
    selectedPlan,
    confirmRecovery
  } = useDemo();

  if (!isConfirmModalOpen || !selectedPlan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-surface-container border border-primary/40 rounded-2xl shadow-glass overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border bg-surface-high/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-text-primary">
                CONFIRM RECOVERY PLAN
              </h3>
              <p className="text-xs text-text-muted font-mono">
                {selectedPlan.tag} OPTION
              </p>
            </div>
          </div>
          <button
            onClick={closeConfirmationModal}
            className="p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-highest transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-surface-lowest border border-border space-y-2">
            <div className="text-sm font-bold font-display text-text-primary">
              {selectedPlan.title}
            </div>
            <div className="text-text-muted text-[11px]">
              {selectedPlan.transportTypes.join(' + ')} • Multi-leg Connector
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg bg-surface-lowest/70 border border-border/50">
              <span className="text-text-muted block text-[10px] uppercase">New Arrival</span>
              <span className="font-bold text-text-primary">{selectedPlan.newArrival}</span>
            </div>
            <div className="p-3 rounded-lg bg-surface-lowest/70 border border-border/50">
              <span className="text-text-muted block text-[10px] uppercase">Recovery Cost</span>
              <span className="font-bold text-text-primary">₹{selectedPlan.cost.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-3 rounded-lg bg-surface-lowest/70 border border-border/50">
              <span className="text-text-muted block text-[10px] uppercase">Hotel Booking</span>
              <span className="font-bold text-emerald-400">
                {selectedPlan.hotelStatus === 'PRESERVED' ? '✓ Preserved' : '⚠️ Late Arrival'}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-surface-lowest/70 border border-border/50">
              <span className="text-text-muted block text-[10px] uppercase">Transfers</span>
              <span className="font-bold text-text-primary">{selectedPlan.transfersCount} Transfer</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-text-secondary text-[11px] leading-relaxed">
            By confirming, TravelRescue will update your active journey graph, release the missed bus leg, and dispatch the replacement transit reservation.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-surface-high/40">
          <button
            onClick={closeConfirmationModal}
            className="px-4 py-2 text-xs font-mono font-medium rounded-lg bg-surface-highest hover:bg-border text-text-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmRecovery}
            className="px-5 py-2 text-xs font-display font-bold rounded-lg bg-primary hover:bg-primary-hover text-white shadow-glow-primary flex items-center gap-1.5 transition-all"
          >
            <span>Confirm Recovery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
