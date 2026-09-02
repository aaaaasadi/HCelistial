import React from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  LifeBuoy,
  Info,
  Clock,
  ArrowRight,
  Check
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { NotificationItem } from '../../types';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setCurrentTab
  } = useDemo();

  const getNotifIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'DISRUPTION':
        return (
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        );
      case 'RECOVERY':
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'WARNING':
        return (
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        );
      case 'INFO':
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
            <Info className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-text-primary">
              Real-time Alerts
            </h1>
            <p className="text-xs text-text-muted font-mono mt-0.5">
              Trip event stream, disruption notifications, and automated recovery actions.
            </p>
          </div>
        </div>

        {notifications.some((n) => !n.read) && (
          <button
            onClick={markAllNotificationsRead}
            className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-high border border-border text-xs text-text-secondary font-mono flex items-center gap-1.5 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-surface-container border border-border text-text-muted font-mono text-xs">
            No active alerts at this time.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationRead(notif.id);
                setCurrentTab(notif.targetTab);
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                !notif.read
                  ? 'bg-surface-container border-primary/40 shadow-glow-primary'
                  : 'bg-surface-lowest/80 border-border hover:bg-surface-container'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {getNotifIcon(notif.type)}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold font-display text-text-primary">
                      {notif.title}
                    </h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-[10px] font-mono text-text-muted">
                    <Clock className="w-3 h-3" />
                    <span>{notif.timestamp}</span>
                    <span>•</span>
                    <span className="text-primary hover:underline">
                      Click to inspect in {notif.targetTab}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center text-text-muted hover:text-text-primary flex-shrink-0 pt-1">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
