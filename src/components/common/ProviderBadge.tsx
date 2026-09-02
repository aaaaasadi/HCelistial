import React from 'react';

interface ProviderBadgeProps {
  sourceText?: string;
  type?: 'TRAIN' | 'BUS' | 'FLIGHT' | 'HOTEL' | 'ACTIVITY';
}

export const ProviderBadge: React.FC<ProviderBadgeProps> = ({ 
  sourceText,
  type = 'TRAIN' 
}) => {
  const defaultText = `${type} API • DEMO DATA`;
  const displayText = sourceText || defaultText;
  const isLive = displayText.toUpperCase().includes('LIVE') || displayText.toUpperCase().includes('REAL');

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded border ${
      isLive
        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
        : 'bg-surface-lowest/80 border-border-subtle text-text-muted'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
      <span>{displayText}</span>
    </span>
  );
};
