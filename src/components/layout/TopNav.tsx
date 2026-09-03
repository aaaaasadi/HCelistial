import React, { useState, useRef, useEffect } from 'react';
import {
  Compass,
  LayoutDashboard,
  Route,
  Activity,
  LifeBuoy,
  Bot,
  Sliders,
  Bell,
  User,
  LogOut,
  Edit3,
  UserCheck,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { NavigationTab } from '../../types';

export const TopNav: React.FC = () => {
  const { 
    currentTab, 
    setCurrentTab, 
    journeyStatus, 
    unreadNotificationsCount,
    currentUser,
    openAuthModal,
    logoutUser,
    openEditJourneyModal
  } = useDemo();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    { 
      id: 'recovery', 
      label: 'Recovery Center', 
      icon: LifeBuoy,
      badge: isDisrupted ? 'ACTION REQ' : isRecovered ? 'SOLVED' : undefined,
      badgeColor: isDisrupted ? 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse' : 'bg-emerald-100 text-emerald-700 border-emerald-300'
    },
    { id: 'ai', label: 'AI Guide', icon: Bot },
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
    <header className="sticky top-0 z-40 w-full pt-3 px-3 sm:px-6 lg:px-8 pointer-events-none">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        {/* Floating Frosted Cream & Glass Island */}
        <div className="bg-white/90 backdrop-blur-2xl border border-amber-900/10 rounded-2xl sm:rounded-3xl shadow-glass-warm px-4 sm:px-6 py-2.5 sm:py-3 transition-all">
          <div className="flex items-center justify-between gap-4">
            
            {/* Brand / Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer group select-none"
              onClick={() => setCurrentTab('dashboard')}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-white shadow-glow-cream transition-transform duration-300 group-hover:scale-105">
                <Compass className="w-5 h-5 text-white animate-pulse-subtle stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black font-display tracking-tight text-text-primary">
                    Celestial<span className="text-amber-600">Rescue</span>
                  </span>
                  <span className="font-mono text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800">
                    PRO
                  </span>
                </div>
                <p className="text-[10px] text-text-muted font-mono tracking-wider hidden sm:block">
                  AUTONOMOUS DISRUPTION ENGINE
                </p>
              </div>
            </div>

            {/* Desktop Navigation Pills */}
            <nav className="hidden lg:flex items-center gap-1.5 bg-surface-lowest/70 p-1.5 rounded-full border border-border/60">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium font-display transition-all duration-200 select-none ${
                      isActive
                        ? 'text-white bg-amber-600 font-semibold shadow-md shadow-amber-600/25'
                        : 'text-text-secondary hover:text-text-primary hover:bg-white/80'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white stroke-[2.5]' : 'text-text-muted'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded-full border leading-none ${
                        isActive 
                          ? 'bg-white text-amber-700 border-white font-bold' 
                          : item.badgeColor || 'bg-white text-text-muted border-border'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Side: Live Status Badge & Interactive Profile Dropdown */}
            <div className="flex items-center gap-3">
              {/* Live Status Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-lowest/80 border border-border/80 text-xs font-mono">
                <span className={`w-2 h-2 rounded-full ${
                  isDisrupted ? 'bg-disruption animate-ping-slow' : isRecovered ? 'bg-success' : isAtRisk ? 'bg-warning animate-pulse' : 'bg-emerald-500 animate-pulse'
                }`} />
                <span className={`text-[11px] font-bold tracking-wide ${
                  isDisrupted ? 'text-disruption-dark' : isRecovered ? 'text-success' : isAtRisk ? 'text-warning' : 'text-emerald-700'
                }`}>
                  {isDisrupted ? 'DISRUPTION' : isRecovered ? 'RECOVERED' : isAtRisk ? 'AT RISK' : 'ON TRACK'}
                </span>
              </div>

              {/* Profile Avatar Pill with Dropdown */}
              <div className="relative" ref={profileMenuRef}>
                <div
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2.5 p-1 sm:pr-2.5 rounded-full hover:bg-amber-50/80 cursor-pointer border border-transparent hover:border-amber-200 transition-all select-none"
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold font-mono shadow-sm border ${currentUser.avatarColor || 'bg-amber-100 text-amber-800 border-amber-300'}`}>
                    {currentUser.avatarInitials}
                  </div>
                  <div className="hidden xl:block text-left">
                    <div className="text-xs font-medium text-text-primary leading-tight flex items-center gap-1">
                      <span>{currentUser.name}</span>
                      <ChevronDown className={`w-3 h-3 text-text-muted transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                    </div>
                    <div className="text-[10px] text-text-muted font-mono">
                      {currentUser.bookingRef}
                    </div>
                  </div>
                </div>

                {/* Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-amber-900/15 rounded-2xl shadow-glass-warm p-2.5 space-y-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-amber-900/10">
                      <div className="text-xs font-bold text-text-primary">
                        {currentUser.name}
                      </div>
                      <div className="text-[11px] text-text-muted font-mono truncate">
                        {currentUser.email}
                      </div>
                      <div className="text-[10px] text-amber-800 font-mono mt-1 font-semibold">
                        Ref: {currentUser.bookingRef}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        openEditJourneyModal();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-text-primary hover:bg-amber-50 text-left transition-colors"
                    >
                      <Edit3 className="w-4 h-4 text-amber-600" />
                      <span>Modify / Edit Journey</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        openAuthModal();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-text-primary hover:bg-amber-50 text-left transition-colors"
                    >
                      <UserCheck className="w-4 h-4 text-amber-600" />
                      <span>Switch Traveler Persona</span>
                    </button>

                    <div className="pt-1 border-t border-amber-900/10">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          logoutUser();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 text-left transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-rose-600" />
                        <span>Log Out / Sign In</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Mobile Navigation Scroll Area */}
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
                      ? 'text-white bg-amber-600 font-semibold shadow-sm'
                      : 'text-text-secondary bg-surface-lowest hover:bg-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-text-muted'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white font-mono">
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
