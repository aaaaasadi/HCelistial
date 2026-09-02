import React, { useState } from 'react';
import {
  Activity,
  RefreshCw,
  Train,
  Bus,
  Plane,
  Radio,
  Wifi,
  Zap,
  Clock,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { ProviderBadge } from '../common/ProviderBadge';
import { StatusBadge } from '../common/StatusBadge';
import { TransportSegment } from '../../types';

export const LiveMonitorView: React.FC = () => {
  const {
    currentTrip,
    connections,
    journeyStatus,
    refreshTelemetry,
    isRefreshingTelemetry
  } = useDemo();

  const [lastUpdated, setLastUpdated] = useState('30 seconds ago');

  const handleRefresh = async () => {
    await refreshTelemetry();
    setLastUpdated('Just now');
  };

  const transportSegments = currentTrip.segments.filter(
    (s): s is TransportSegment => s.type === 'TRAIN' || s.type === 'BUS' || s.type === 'FLIGHT'
  );

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'TRAIN':
        return <Train className="w-5 h-5 text-primary" />;
      case 'BUS':
        return <Bus className="w-5 h-5 text-primary" />;
      case 'FLIGHT':
        return <Plane className="w-5 h-5 text-primary" />;
      default:
        return <Activity className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Header & Polling Heartbeat */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary animate-pulse">
              <Radio className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-text-primary">
              Live Journey Monitor
            </h1>
          </div>
          <p className="text-xs text-text-muted mt-1 font-mono">
            Directly monitoring {transportSegments.length} active transport segments for {currentTrip.title}.
          </p>
        </div>

        {/* Polling Heartbeat & Refresh CTA */}
        <div className="flex items-center gap-3 bg-surface-container p-2 rounded-xl border border-border">
          <div className="text-left font-mono text-xs pr-2 border-r border-border/60">
            <div className="text-text-muted text-[10px] uppercase">Last Verified</div>
            <div className="text-text-primary font-bold">{lastUpdated}</div>
          </div>
          <div className="text-left font-mono text-xs pr-3 hidden sm:block">
            <div className="text-text-muted text-[10px] uppercase">Telemetry State</div>
            <div className="text-primary-light font-bold">
              {journeyStatus === 'DISRUPTED' ? 'Disruption Active' : 'Normal Polling'}
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshingTelemetry}
            className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingTelemetry ? 'animate-spin' : ''}`} />
            <span>{isRefreshingTelemetry ? 'Polling API...' : 'Refresh Status'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {transportSegments.map((seg) => {
          const isSegDisrupted = seg.status === 'MISSED' || seg.status === 'CANCELLED' || seg.delayMinutes > 30;
          return (
            <div
              key={seg.id}
              className={`p-5 rounded-xl hud-card border transition-all ${
                isSegDisrupted
                  ? 'hud-card-disrupted'
                  : seg.status === 'RECOVERED'
                  ? 'hud-card-recovered'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getTransportIcon(seg.type)}
                  <span className="font-bold font-display text-sm text-text-primary uppercase">
                    {seg.type} STATUS
                  </span>
                </div>
                <StatusBadge status={seg.status} size="sm" />
              </div>

              <div className="mb-4">
                <ProviderBadge sourceText={seg.dataSource} />
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex justify-between p-2 rounded bg-surface-lowest/80 border border-border/50">
                  <span className="text-text-muted">Service</span>
                  <span className="font-bold text-text-primary truncate max-w-[150px]">{seg.serviceNumber}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-surface-lowest/80 border border-border/50">
                  <span className="text-text-muted">Route</span>
                  <span className="font-bold text-text-primary">{(seg.origin || seg.from || '').split(' ')[0]} → {(seg.destination || seg.to || '').split(' ')[0]}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-surface-lowest/80 border border-border/50">
                  <span className="text-text-muted">Expected Arrival</span>
                  <span className={`font-bold ${seg.delayMinutes > 0 ? 'text-rose-400' : 'text-text-primary'}`}>
                    {seg.estimatedArrival}
                  </span>
                </div>
                <div className="flex justify-between p-2 rounded bg-surface-lowest/80 border border-border/50">
                  <span className="text-text-muted">Delay Status</span>
                  <span className={`font-bold ${seg.delayMinutes > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {seg.delayMinutes > 0 ? `+${seg.delayMinutes} min delay` : 'On Time (0 min)'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-text-muted font-mono">
                <span className="truncate max-w-[180px]">Provider: {seg.provider}</span>
                <span className="text-primary flex items-center gap-1">
                  <Wifi className="w-3 h-3" /> Live
                </span>
              </div>
            </div>
          );
        })}

        {/* Flight Standby Feed */}
        <div className="p-5 rounded-xl hud-card border transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-primary" />
              <span className="font-bold font-display text-sm text-text-primary">
                FLIGHT STANDBY
              </span>
            </div>
            <StatusBadge status="ON_TIME" size="sm" />
          </div>

          <div className="mb-4">
            <ProviderBadge sourceText="FLIGHT API • DEMO DATA" />
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="flex justify-between p-2 rounded bg-surface-lowest/80 border border-border/50">
              <span className="text-text-muted">Corridor</span>
              <span className="font-bold text-text-primary">BOM (Mumbai) ↔ GOI (Goa)</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-surface-lowest/80 border border-border/50">
              <span className="text-text-muted">Weather</span>
              <span className="font-bold text-emerald-400">CAVOK Clear</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-surface-lowest/80 border border-border/50">
              <span className="text-text-muted">Emergency Flights</span>
              <span className="font-bold text-primary-light">IndiGo 6E-5128 Ready</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-surface-lowest/80 border border-border/50">
              <span className="text-text-muted">Availability</span>
              <span className="font-bold text-text-primary">3 Economy Seats</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-text-muted font-mono">
            <span>Airbus A320 Direct</span>
            <span className="text-primary flex items-center gap-1">
              <Wifi className="w-3 h-3" /> Standby
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Telemetry Event Log Stream */}
      <div className="p-6 rounded-2xl bg-surface-container border border-border space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-display text-text-primary flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span>Telemetry Event Stream</span>
            </h3>
            <p className="text-xs text-text-muted font-mono mt-0.5">
              Live updates reflecting current trip state from central store.
            </p>
          </div>
          <span className="font-mono text-xs text-primary-light">
            Protocol: WebSocket/SSE Active
          </span>
        </div>

        <div className="bg-surface-lowest rounded-xl p-4 font-mono text-xs space-y-2 border border-border-subtle max-h-48 overflow-y-auto">
          <div className="flex items-center gap-2 text-text-muted">
            <span className="text-primary">[23:20:00 UTC]</span>
            <span>SYSTEM-HEARTBEAT: Monitoring {currentTrip.id} ({currentTrip.title}).</span>
          </div>
          {connections.map((conn) => (
            <div key={conn.id} className="flex items-center gap-2 text-text-secondary">
              <span className="text-primary">[23:20:10 UTC]</span>
              <span>
                CONNECTION-CALC: {conn.fromCity} $\to$ {conn.toCity} buffer = {conn.availableBufferMinutes}m (requires {conn.requiredTransferMinutes}m) $\to$ {conn.status}.
              </span>
            </div>
          ))}
          {journeyStatus === 'DISRUPTED' && (
            <div className="flex items-center gap-2 text-rose-400 font-bold animate-pulse">
              <span className="text-rose-500">[23:20:25 UTC]</span>
              <span>🚨 DISRUPTION-TRIGGER: Connection deficit detected. Immediate multi-leg recovery dispatched.</span>
            </div>
          )}
          {journeyStatus === 'RECOVERED' && (
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="text-emerald-500">[23:20:30 UTC]</span>
              <span>✓ RECOVERY-RESOLVED: Replacement transit active. All downstream bookings confirmed preserved.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
