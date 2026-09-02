import React from 'react';
import { X, Info, ExternalLink } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';

export const DetailModal: React.FC = () => {
  const { detailModal, closeDetailModal } = useDemo();

  if (!detailModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-surface-container border border-border-strong rounded-xl shadow-glass overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-high/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-text-primary">
                {detailModal.title}
              </h3>
              {detailModal.subtitle && (
                <p className="text-xs text-text-muted font-mono">
                  {detailModal.subtitle}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={closeDetailModal}
            className="p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-highest transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(detailModal.data).map(([key, value]) => {
              if (value === undefined || value === null) return null;
              return (
                <div 
                  key={key} 
                  className="flex items-start justify-between p-3 rounded-lg bg-surface-lowest/70 border border-border/50 text-xs"
                >
                  <span className="text-text-muted uppercase tracking-wider font-mono text-[11px]">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="font-medium text-text-primary text-right max-w-[60%] font-mono">
                    {String(value)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-lg bg-primary/5 border border-primary/20 text-xs text-primary-light flex items-center gap-2">
            <ExternalLink className="w-4 h-4 flex-shrink-0 text-primary" />
            <span>
              External Provider Telemetry verified via mock adapter layer. Live updates simulate real-time GPS & IRCTC status.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-3 border-t border-border bg-surface-high/30">
          <button
            onClick={closeDetailModal}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-surface-highest hover:bg-border text-text-primary transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
