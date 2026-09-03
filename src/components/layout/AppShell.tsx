import React, { ReactNode } from 'react';
import { TopNav } from './TopNav';
import { DemoStateBar } from './DemoStateBar';
import { DetailModal } from '../common/DetailModal';
import { UserAuthModal } from '../auth/UserAuthModal';
import { EditJourneyModal } from '../journey/EditJourneyModal';

export const AppShell: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-text-primary selection:bg-amber-500/20 selection:text-amber-900 relative">
      {/* Subtle Ambient Background Glowing Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-[120px] animate-pulse-subtle" />
        <div className="absolute top-[40%] right-[-5%] w-[450px] h-[450px] bg-blue-400/8 rounded-full blur-[140px] animate-float" />
        <div className="absolute bottom-[-10%] left-[5%] w-[400px] h-[400px] bg-rose-400/6 rounded-full blur-[130px]" />
      </div>

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
      <UserAuthModal />
      <EditJourneyModal />

      {/* Elevated Warm Glass Footer */}
      <footer className="w-full bg-white/80 border-t border-amber-900/10 py-5 px-4 text-center text-xs text-text-muted font-mono mt-8 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-text-secondary font-sans font-medium">CelestialRescue — Autonomous Disruption Recovery Engine</span>
          <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] text-amber-800 font-semibold">
            Phase 1 Autonomous Protocol
          </span>
        </div>
      </footer>
    </div>
  );
};
