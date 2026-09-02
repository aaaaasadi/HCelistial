import React from 'react';
import {
  Compass,
  LayoutDashboard,
  Route,
  Activity,
  LifeBuoy,
  Bot,
  Sliders,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { NavigationTab } from '../../types';

export const TopNav: React.FC = () => {
  const { 
    currentTab, 
    setCurrentTab, 
    journeyStatus, 
    unreadNotificationsCount 
  } = useDemo();

  const isDisrupted = journeyStatus === 'DISRUPTED';
  const isRecovered = journeyStatus === 'RECOVERED';
  const isAtRisk = journeyStatus === 'AT_RISK';

  const navItems: { id: NavigationTab; label: string; icon: React.ElementType; badge?: string; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'journey', label: 'My Journey', icon: Route },
    { 
      id: 'monitor', 
      label: 'Live Monitor', 
      icon: Activity,
      badge: 'LIVE',
      badgeColor: 'bg-primary/20 text-primary-light border-primary/40'
    },
    { 
      id: 'recovery', 
      label: 'Recovery Center', 
      icon: LifeBuoy,
      badge: isDisrupted ? 'ACTION REQ' : isRecovered ? 'SOLVED' : undefined,
      badgeColor: isDisrupted ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    },
    { id: 'ai', label: 'AI Travel Guide', icon: Bot },
    { id: 'preferences', label: 'Preferences', icon: Sliders },
    { 
      id: 'notifications', 
      label: 'Alerts', 
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? String(unreadNotificationsCount) : undefined,
      badgeColor: 'bg-rose-500 text-white font-bold'
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-surface/95 backdrop-blur-md border-b border-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Concept */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white shadow-glow-primary">
              <Compass className="w-6 h-6 animate-pulse-subtle" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black font-display tracking-tight text-text-primary">
                  Travel<span className="text-primary">Rescue</span>
                </span>
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-surface-highest border border-border text-primary-light">
                  PHASE 1
                </span>
              </div>
              <p className="text-[10px] text-text-muted font-mono tracking-wider hidden sm:block">
                AI DISRUPTION RECOVERY ENGINE
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium font-display transition-all duration-150 ${
                    isActive
                      ? 'text-white bg-surface-high border border-border-strong shadow-sm'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-container'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-text-muted'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`font-mono text-[9px] px-1.5 py-0.2 rounded-full border ${item.badgeColor || 'bg-surface-highest text-text-muted'}`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Area: Demo Status Badge & User */}
          <div className="flex items-center gap-3">
            {/* Demo Status Indicator */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-surface-lowest border border-border text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-text-secondary hidden lg:inline">
                DEMO MODE:
              </span>
              <span className={`text-[11px] font-bold ${isDisrupted ? 'text-rose-400' : isRecovered ? 'text-emerald-400' : isAtRisk ? 'text-amber-400' : 'text-primary-light'}`}>
                {isDisrupted ? 'DISRUPTION DETECTED' : isRecovered ? 'RECOVERED' : isAtRisk ? 'AT RISK' : 'ON TRACK'}
              </span>
            </div>

            {/* Traveler Profile */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-surface-high to-surface-highest border border-border-strong flex items-center justify-center text-xs font-bold text-primary font-mono">
                AM
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-medium text-text-primary leading-tight">
                  Arjun Mehta
                </div>
                <div className="text-[10px] text-text-muted font-mono">
                  BKG-78291 • Goa
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Scrollbar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-border/50 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-white bg-primary/20 border border-primary/40'
                    : 'text-text-secondary bg-surface-container'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] px-1 rounded bg-surface-highest">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
