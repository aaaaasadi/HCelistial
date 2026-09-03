'use client';

import React, { useState } from 'react';
import { EclipseButton } from '@/components/ui/eclipse-button';
import { 
  Trash2, 
  Sparkles, 
  ArrowRight, 
  Send, 
  RefreshCw, 
  ShieldCheck, 
  CheckCircle2, 
  Copy,
  Layers
} from 'lucide-react';

export default function EclipseButtonVariants() {
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedSize, setSelectedSize] = useState<'default' | 'sm' | 'lg'>('default');

  const toggleLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white/90 backdrop-blur-xl border border-amber-900/10 rounded-3xl p-6 sm:p-8 shadow-glass-warm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                shadcn/ui Interactive Primitive
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-text-primary">
              Eclipse Magnetic Button
            </h1>
            <p className="text-sm text-text-secondary mt-1 max-w-2xl font-sans leading-relaxed">
              A highly interactive button featuring physical spring-damped magnetic pull, smooth cursor tracking, and a dynamic inverted eclipse spotlight effect with fractal noise texture.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLoading}
              className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold font-mono transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Simulate Loading State</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Variant Showcase Grid */}
      <div className="bg-white/90 backdrop-blur-xl border border-amber-900/10 rounded-3xl p-6 sm:p-8 shadow-glass-warm space-y-6">
        <div className="flex items-center justify-between border-b border-amber-900/10 pb-4">
          <div>
            <h2 className="text-lg font-bold font-display text-text-primary">
              Variant Matrix & Interactions
            </h2>
            <p className="text-xs text-text-muted font-mono mt-0.5">
              Hover over each button to trigger cursor magnetic pull and eclipse contrast inversion
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-surface-lowest p-1 rounded-full border border-border/80">
            {(['sm', 'default', 'lg'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all ${
                  selectedSize === s
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-neutral-100/70 dark:bg-neutral-900 border border-amber-900/10 min-h-[220px] flex items-center justify-center">
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 place-items-center">
            <div className="flex flex-col items-center gap-2">
              <EclipseButton 
                variant="primary" 
                size={selectedSize}
                text="Primary Action" 
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              />
              <span className="text-[10px] font-mono text-text-muted">variant="primary"</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <EclipseButton 
                variant="outline" 
                size={selectedSize}
                text="Outline Button" 
                isLoading={isLoading}
                leftIcon={<Sparkles className="w-4 h-4" />}
              />
              <span className="text-[10px] font-mono text-text-muted">variant="outline"</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <EclipseButton 
                variant="ghost" 
                size={selectedSize}
                text="Ghost Accent" 
                isLoading={isLoading}
                rightIcon={<Send className="w-4 h-4" />}
              />
              <span className="text-[10px] font-mono text-text-muted">variant="ghost"</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <EclipseButton 
                variant="destructive" 
                size={selectedSize}
                text="Delete / Risk" 
                isLoading={isLoading}
                leftIcon={<Trash2 className="w-4 h-4" />} 
              />
              <span className="text-[10px] font-mono text-text-muted">variant="destructive"</span>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Code & Props Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/90 backdrop-blur-xl border border-amber-900/10 rounded-3xl p-6 shadow-glass-warm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-display text-text-primary flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>Usage Code Snippet</span>
            </h3>
            <button
              onClick={() => copyCode(`import { EclipseButton } from '@/components/ui/eclipse-button';\n\n<EclipseButton\n  variant="primary"\n  text="Start Autonomous Recovery"\n  rightIcon={<ArrowRight className="w-4 h-4" />}\n/>`)}
              className="text-xs text-amber-700 hover:text-amber-800 font-mono flex items-center gap-1 font-bold"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-2xl bg-neutral-950 text-neutral-100 font-mono text-xs overflow-x-auto border border-neutral-800 leading-relaxed">
{`import { EclipseButton } from '@/components/ui/eclipse-button';
import { ArrowRight } from 'lucide-react';

export function Action() {
  return (
    <EclipseButton
      variant="primary"
      text="Start Autonomous Recovery"
      rightIcon={<ArrowRight className="w-4 h-4" />}
      onClick={() => console.log('Triggered')}
    />
  );
}`}
          </pre>
        </div>

        <div className="bg-white/90 backdrop-blur-xl border border-amber-900/10 rounded-3xl p-6 shadow-glass-warm space-y-4">
          <h3 className="text-sm font-bold font-display text-text-primary flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Component Specs & Features</span>
          </h3>
          <ul className="space-y-2.5 text-xs text-text-secondary font-sans">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
              <span><strong>Physics Engine</strong>: Uses <code>motion/react</code> spring physics (<code>stiffness: 250</code>, <code>damping: 25</code>) for responsive magnetic attraction.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
              <span><strong>Dual-Layer Clipping</strong>: Masked overlay layer renders inverted color themes dynamically under the cursor position.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
              <span><strong>Zero Extra Setup</strong>: Fully compatible with shadcn/ui directory conventions and standard Tailwind utility classes.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
              <span><strong>Accessible</strong>: Supports standard HTML button attributes, keyboard focus rings, and ARIA labels.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
