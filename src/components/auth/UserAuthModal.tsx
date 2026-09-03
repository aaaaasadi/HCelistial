import React, { useState } from 'react';
import {
  X,
  User,
  UserPlus,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  Plane,
  Luggage,
  Briefcase
} from 'lucide-react';
import { useDemo, PRESET_USERS } from '../../context/DemoContext';
import { TravelerUser } from '../../types';

export const UserAuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, currentUser, loginUser, updateTripDetails } = useDemo();

  const [activeTab, setActiveTab] = useState<'switch' | 'custom'>('switch');
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customRole, setCustomRole] = useState('Independent Traveler');
  const [customBookingRef, setCustomBookingRef] = useState('');
  const [customOrigin, setCustomOrigin] = useState('Mumbai (CSTM)');
  const [customDestination, setCustomDestination] = useState('Goa (GOI)');

  if (!isAuthModalOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const initials = customName
      .trim()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newUser: TravelerUser = {
      id: `user-custom-${Date.now()}`,
      name: customName.trim(),
      email: customEmail.trim() || `${customName.toLowerCase().replace(/\s+/g, '.')}@traveler.io`,
      role: customRole.trim() || 'Traveler',
      bookingRef: customBookingRef.trim() || `BKG-${Math.floor(10000 + Math.random() * 90000)}`,
      avatarInitials: initials || 'TU',
      avatarColor: 'bg-amber-100 text-amber-900 border-amber-300'
    };

    loginUser(newUser);

    if (customOrigin && customDestination) {
      updateTripDetails(
        `${customName.split(' ')[0]}'s Custom Journey`,
        customOrigin,
        customDestination
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-amber-900/15 rounded-3xl shadow-glass-warm overflow-hidden transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-amber-900/10 bg-amber-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-glow-cream">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-text-primary">
                Traveler Profile & Account
              </h3>
              <p className="text-xs text-text-muted">
                Switch traveler persona or sign in as a custom user
              </p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-amber-100/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-amber-900/10 bg-surface-lowest/50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('switch')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold font-display border-b-2 transition-all ${
              activeTab === 'switch'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Select Traveler Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold font-display border-b-2 transition-all ${
              activeTab === 'custom'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Create / Custom User</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {activeTab === 'switch' ? (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-text-muted uppercase tracking-wider font-mono">
                Available Personas:
              </div>

              <div className="space-y-2.5">
                {PRESET_USERS.map((user) => {
                  const isCurrent = currentUser.id === user.id;
                  return (
                    <div
                      key={user.id}
                      onClick={() => loginUser(user)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                        isCurrent
                          ? 'bg-amber-50 border-amber-300 shadow-sm'
                          : 'bg-white hover:bg-amber-50/40 border-amber-900/10 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-mono border ${user.avatarColor || 'bg-amber-100 text-amber-800 border-amber-300'}`}>
                          {user.avatarInitials}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-text-primary flex items-center gap-2">
                            <span>{user.name}</span>
                            {isCurrent && (
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-600 text-white">
                                CURRENT
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-text-muted">
                            {user.role} • <span className="font-mono text-amber-700 font-medium">{user.bookingRef}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                          isCurrent
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-surface-lowest text-text-primary hover:bg-amber-600 hover:text-white'
                        }`}
                      >
                        {isCurrent ? 'Active' : 'Select'}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-amber-900/10 flex items-center justify-between text-xs text-text-muted">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-600" />
                  <span>Real-time trip recalculation</span>
                </span>
                <button
                  onClick={() => setActiveTab('custom')}
                  className="text-amber-700 hover:text-amber-800 font-bold hover:underline"
                >
                  + Add New Traveler
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold font-mono text-text-secondary uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Chen"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-lowest border border-border/80 text-text-primary text-xs focus:outline-none focus:border-amber-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-mono text-text-secondary uppercase mb-1">
                    Booking Reference
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BKG-98421"
                    value={customBookingRef}
                    onChange={(e) => setCustomBookingRef(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-lowest border border-border/80 text-text-primary text-xs focus:outline-none focus:border-amber-600 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold font-mono text-text-secondary uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="maya@enterprise.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-lowest border border-border/80 text-text-primary text-xs focus:outline-none focus:border-amber-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-mono text-text-secondary uppercase mb-1">
                    Traveler Role / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Business Consultant"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-lowest border border-border/80 text-text-primary text-xs focus:outline-none focus:border-amber-600 transition-colors"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                <div className="text-xs font-bold text-amber-900 font-display flex items-center gap-1.5">
                  <Luggage className="w-3.5 h-3.5 text-amber-600" />
                  <span>Custom Route Setup (Optional)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-mono text-text-muted">Origin City/Station</label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai (CSTM)"
                      value={customOrigin}
                      onChange={(e) => setCustomOrigin(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-border/60 text-xs text-text-primary focus:outline-none focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-text-muted">Destination City</label>
                    <input
                      type="text"
                      placeholder="e.g. Goa (GOI)"
                      value={customDestination}
                      onChange={(e) => setCustomDestination(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-border/60 text-xs text-text-primary focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={closeAuthModal}
                  className="px-4 py-2 rounded-full text-xs font-bold text-text-secondary hover:bg-surface-lowest transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-glow-cream flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Sign In & Load Journey</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
