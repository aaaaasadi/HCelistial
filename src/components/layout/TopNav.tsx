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
      badgeColor: 'bg-primary/20 text-primary-light border-primary/30'
    },
    { 
      id: 'recovery', 
      label: 'Recovery Center', 
      icon: LifeBuoy,
      badge: isDisrupted ? 'ACTION REQ' : isRecovered ? 'SOLVED' : undefined,
      badgeColor: isDisrupted ? 'bg-disruption/20 text-disruption-bright border-disruption/40 animate-pulse' : 'bg-success/20 text-success-light border-success/40'
    },
    { id: 'ai', label: 'AI Guide', icon: Bot },
    { id: 'preferences', label: 'Preferences', icon: Sliders },
    { 
      id: 'notifications', 
      label: 'Alerts', 
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? String(unreadNotificationsCount) : undefined,
      badgeColor: 'bg-disruption text-white font-bold'
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full pt-3 px-3 sm:px-6 lg:px-8 pointer-events-none">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        {/* Floating Frosted Glass Island */}
        <div className="bg-surface-low/85 backdrop-blur-2xl border border-border/80 rounded-2xl sm:rounded-3xl shadow-glass-warm px-4 sm:px-6 py-2.5 sm:py-3 transition-all">
          <div className="flex items-center justify-between gap-4">
            
            {/* Brand / Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer group select-none"
              onClick={() => setCurrentTab('dashboard')}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cream-gold via-amber-500 to-primary flex items-center justify-center text-surface-lowest shadow-glow-cream transition-transform duration-300 group-hover:scale-105">
                <Compass className="w-5 h-5 text-surface-lowest animate-pulse-subtle stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black font-display tracking-tight text-cream-light">
                    Celestial<span className="text-cream-gold">Rescue</span>
                  </span>
                  <span className="font-mono text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cream-gold/15 border border-cream-gold/30 text-cream-gold">
                    PRO
                  </span>
                </div>
                <p className="text-[10px] text-text-muted font-mono tracking-wider hidden sm:block">
                  AUTONOMOUS DISRUPTION ENGINE
                </p>
              </div>
            </div>

            {/* Desktop Navigation Pills */}
            <nav className="hidden lg:flex items-center gap-1.5 bg-surface-lowest/60 p-1.5 rounded-full border border-border/60">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium font-display transition-all duration-200 select-none ${
                      isActive
                        ? 'text-surface-lowest bg-gradient-to-r from-cream-light to-cream-DEFAULT font-semibold shadow-md shadow-cream-gold/10'
                        : 'text-text-secondary hover:text-cream-light hover:bg-surface-high/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-surface-lowest stroke-[2.5]' : 'text-text-muted'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded-full border leading-none ${
                        isActive 
                          ? 'bg-surface-lowest text-cream-gold border-surface-lowest' 
                          : item.badgeColor || 'bg-surface-highest text-text-muted'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Side: Live Status Badge & Traveler Pill */}
            <div className="flex items-center gap-3">
              {/* Live Status Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-lowest/70 border border-border/80 text-xs font-mono">
                <span className={`w-2 h-2 rounded-full ${
                  isDisrupted ? 'bg-disruption animate-ping-slow' : isRecovered ? 'bg-success' : isAtRisk ? 'bg-warning animate-pulse' : 'bg-emerald-400 animate-pulse'
                }`} />
                <span className={`text-[11px] font-bold tracking-wide ${
                  isDisrupted ? 'text-disruption-bright' : isRecovered ? 'text-success-light' : isAtRisk ? 'text-warning-light' : 'text-cream-gold'
                }`}>
                  {isDisrupted ? 'DISRUPTION' : isRecovered ? 'RECOVERED' : isAtRisk ? 'AT RISK' : 'ON TRACK'}
                </span>
              </div>

              {/* Profile Avatar Pill */}
              <div className="flex items-center gap-2.5 pl-1">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-surface-high to-surface-highest border border-cream-gold/30 flex items-center justify-center text-xs font-bold text-cream-gold font-mono shadow-sm">
                  AM
                </div>
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-medium text-cream-light leading-tight">
                    Arjun Mehta
                  </div>
                  <div className="text-[10px] text-text-muted font-mono">
                    BKG-78291
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Mobile & Tablet Navigation Scroll Area */}
          <div className="flex lg:hidden overflow-x-auto pt-2.5 mt-2 gap-1.5 border-t border-border/40 no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? 'text-surface-lowest bg-cream-DEFAULT font-semibold shadow-sm'
                      : 'text-text-secondary bg-surface-container/70 hover:bg-surface-high'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-surface-lowest' : 'text-text-muted'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-surface-lowest/40 font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </header>
  );
};
