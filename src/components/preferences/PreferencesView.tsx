import React, { useState } from 'react';
import {
  Sliders,
  CheckCircle2,
  DollarSign,
  Zap,
  GitMerge,
  ShieldCheck,
  Plane,
  Moon,
  Clock,
  Navigation
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { UserPreferences } from '../../types';

export const PreferencesView: React.FC = () => {
  const { userPreferences, updatePreferences, setCurrentTab } = useDemo();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handlePriorityChange = (priority: UserPreferences['primaryPriority']) => {
    updatePreferences({ primaryPriority: priority });
    showToast('Recovery preferences updated. Plans re-ranked accordingly.');
  };

  const handleToggle = (key: keyof UserPreferences) => {
    updatePreferences({ [key]: !userPreferences[key] });
    showToast('Recovery preferences updated.');
  };

  const handleBudgetChange = (val: number) => {
    updatePreferences({ maxAdditionalBudget: val });
    showToast('Contingency budget updated.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const priorities: {
    id: UserPreferences['primaryPriority'];
    label: string;
    icon: React.ElementType;
    desc: string;
  }[] = [
    {
      id: 'PRESERVE_BOOKINGS',
      label: 'Preserve Existing Bookings',
      icon: ShieldCheck,
      desc: 'Protect downstream hotel & prepaid excursion reservations at all costs'
    },
    {
      id: 'LOWEST_COST',
      label: 'Lowest Out-of-Pocket Cost',
      icon: DollarSign,
      desc: 'Prioritize cheapest transit even if arrival requires late-night check-in'
    },
    {
      id: 'FASTEST_ARRIVAL',
      label: 'Fastest Arrival',
      icon: Zap,
      desc: 'Get to Goa destination ASAP, utilizing express connectors or flights'
    },
    {
      id: 'FEWER_TRANSFERS',
      label: 'Fewer Transfers & Luggage Hassle',
      icon: GitMerge,
      desc: 'Minimize station changes and inter-depot cross-city movements'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-text-primary">
              Recovery Preferences
            </h1>
            <p className="text-xs text-text-muted font-mono mt-0.5">
              Tune how the recovery algorithm evaluates, ranks, and recommends alternative options.
            </p>
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Section 1: What matters most */}
      <div className="p-6 rounded-2xl bg-surface-container border border-border space-y-4">
        <div>
          <h2 className="text-sm font-bold font-display uppercase tracking-wider text-text-primary">
            WHAT MATTERS MOST?
          </h2>
          <p className="text-xs text-text-muted font-mono mt-0.5">
            Select the dominant weighting factor for scoring contingency travel plans.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {priorities.map((item) => {
            const Icon = item.icon;
            const isSelected = userPreferences.primaryPriority === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handlePriorityChange(item.id)}
                className={`p-4 rounded-xl cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-primary/10 border-primary/60 shadow-glow-primary'
                    : 'bg-surface-lowest/80 border-border hover:border-border-strong'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? 'bg-primary text-white'
                        : 'bg-surface-high text-text-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-display text-text-primary">
                        {item.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Constraints & Filters */}
      <div className="p-6 rounded-2xl bg-surface-container border border-border space-y-4">
        <div>
          <h2 className="text-sm font-bold font-display uppercase tracking-wider text-text-primary">
            ROUTING CONSTRAINTS
          </h2>
          <p className="text-xs text-text-muted font-mono mt-0.5">
            Hard constraints filtered out of candidate alternatives.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Avoid Flights */}
          <label className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-lowest border border-border cursor-pointer hover:border-border-strong transition-colors">
            <input
              type="checkbox"
              checked={userPreferences.avoidFlights}
              onChange={() => handleToggle('avoidFlights')}
              className="w-4 h-4 rounded border-border-strong text-primary focus:ring-primary bg-surface-high"
            />
            <div className="flex items-center gap-2 text-xs font-medium text-text-primary">
              <Plane className="w-4 h-4 text-text-muted" />
              <span>Avoid Air Travel (Ground Only)</span>
            </div>
          </label>

          {/* Avoid Overnight */}
          <label className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-lowest border border-border cursor-pointer hover:border-border-strong transition-colors">
            <input
              type="checkbox"
              checked={userPreferences.avoidOvernight}
              onChange={() => handleToggle('avoidOvernight')}
              className="w-4 h-4 rounded border-border-strong text-primary focus:ring-primary bg-surface-high"
            />
            <div className="flex items-center gap-2 text-xs font-medium text-text-primary">
              <Moon className="w-4 h-4 text-text-muted" />
              <span>Avoid Overnight Transit (Post-Midnight)</span>
            </div>
          </label>

          {/* Avoid Long Transfers */}
          <label className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-lowest border border-border cursor-pointer hover:border-border-strong transition-colors">
            <input
              type="checkbox"
              checked={userPreferences.avoidLongTransfers}
              onChange={() => handleToggle('avoidLongTransfers')}
              className="w-4 h-4 rounded border-border-strong text-primary focus:ring-primary bg-surface-high"
            />
            <div className="flex items-center gap-2 text-xs font-medium text-text-primary">
              <Clock className="w-4 h-4 text-text-muted" />
              <span>Avoid Long Layover Buffers (&gt; 2 hours)</span>
            </div>
          </label>

          {/* Prefer Direct Transport */}
          <label className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-lowest border border-border cursor-pointer hover:border-border-strong transition-colors">
            <input
              type="checkbox"
              checked={userPreferences.preferDirect}
              onChange={() => handleToggle('preferDirect')}
              className="w-4 h-4 rounded border-border-strong text-primary focus:ring-primary bg-surface-high"
            />
            <div className="flex items-center gap-2 text-xs font-medium text-text-primary">
              <Navigation className="w-4 h-4 text-text-muted" />
              <span>Prefer Single-Seat Direct Connections</span>
            </div>
          </label>
        </div>
      </div>

      {/* Section 3: Budget Constraint */}
      <div className="p-6 rounded-2xl bg-surface-container border border-border space-y-4">
        <div>
          <h2 className="text-sm font-bold font-display uppercase tracking-wider text-text-primary">
            MAXIMUM CONTINGENCY BUDGET
          </h2>
          <p className="text-xs text-text-muted font-mono mt-0.5">
            Maximum acceptable additional expenditure for emergency rebooking.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-64">
            <span className="absolute left-3.5 top-2.5 text-text-muted font-mono font-bold text-sm">
              ₹
            </span>
            <input
              type="number"
              value={userPreferences.maxAdditionalBudget}
              onChange={(e) => handleBudgetChange(Number(e.target.value))}
              step={500}
              min={0}
              max={10000}
              className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-surface-lowest border border-border font-mono text-sm text-text-primary font-bold focus:outline-none focus:border-primary"
            />
          </div>
          <span className="text-xs text-text-muted font-mono">
            Options exceeding this threshold receive a reduced budget score in the recovery ranking.
          </span>
        </div>
      </div>
    </div>
  );
};
