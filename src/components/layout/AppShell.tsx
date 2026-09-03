import React, { ReactNode } from 'react';
import { TopNav } from './TopNav';
import { DemoStateBar } from './DemoStateBar';
import { DetailModal } from '../common/DetailModal';

export const AppShell: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-text-primary selection:bg-cream-gold/30 selection:text-cream-light">
      {/* Floating Top Header Navigation */}
      <TopNav />

      {/* Floating Scenario & Simulator Controller */}
      <DemoStateBar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Global Modals */}
      <DetailModal />

      {/* Elevated Warm Glass Footer */}
      <footer className="w-full bg-surface-lowest/80 border-t border-border/60 py-5 px-4 text-center text-xs text-text-muted font-mono mt-8 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-cream-muted font-sans font-medium">CelestialRescue — Autonomous Disruption Recovery Engine</span>
          <span className="px-3 py-1 rounded-full bg-surface-container border border-border/80 text-[11px] text-cream-gold/80">
            Phase 1 Autonomous Protocol
          </span>
        </div>
      </footer>
    </div>
  );
};
