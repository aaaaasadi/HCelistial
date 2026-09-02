import React, { ReactNode } from 'react';
import { TopNav } from './TopNav';
import { DemoStateBar } from './DemoStateBar';
import { DetailModal } from '../common/DetailModal';

export const AppShell: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-text-primary">
      {/* Top Header Navigation */}
      <TopNav />

      {/* Persistent Demo Controller & Disruption Simulator */}
      <DemoStateBar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Global Modals */}
      <DetailModal />

      {/* Footer */}
      <footer className="w-full bg-surface-lowest border-t border-border py-4 px-4 text-center text-xs text-text-muted font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TravelRescue — Autonomous Travel Disruption Recovery Engine</span>
          <span>Phase 1 Business Prototype • All Provider Data Mocked</span>
        </div>
      </footer>
    </div>
  );
};
