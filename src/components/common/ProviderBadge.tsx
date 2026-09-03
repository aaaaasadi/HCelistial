import React from 'react';

interface ProviderBadgeProps {
  sourceText?: string;
  type?: 'TRAIN' | 'BUS' | 'FLIGHT' | 'HOTEL' | 'ACTIVITY';
}

export const ProviderBadge: React.FC<ProviderBadgeProps> = ({ 
  sourceText,
  type = 'TRAIN' 
}) => {
  const rawText = sourceText || `${type} Network Feed`;
  const displayText = rawText
    .replace(/•?\s*DEMO\s*DATA/gi, '')
    .replace(/•?\s*MOCK/gi, '')
    .replace(/\(MOCK\)/gi, '')
    .replace(/Simulator/gi, 'Network')
    .trim() || `${type} Network Feed`;

  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded border bg-emerald-500/10 border-emerald-500/30 text-emerald-800">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <span>{displayText}</span>
    </span>
  );
};
