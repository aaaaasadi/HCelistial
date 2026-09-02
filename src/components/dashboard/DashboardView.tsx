import React from 'react';
import {
  Train,
  Bus,
  Plane,
  Building2,
  Ticket,
  ArrowRight,
  Flame,
  LifeBuoy,
  Activity,
  Bot,
  ChevronRight,
  Info,
  AlertTriangle
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { StatusBadge } from '../common/StatusBadge';
import { ProviderBadge } from '../common/ProviderBadge';
import { RiskIndicator } from '../common/RiskIndicator';
import { TransportSegment, HotelSegment, ActivitySegment } from '../../types';

export const DashboardView: React.FC = () => {
  const {
    currentTrip,
    journeyHealth,
    journeyStatus,
    connectionRisk,
    connections,
    activeAlertsCount,
    recoveryPlans,
    recommendedPlan,
    setCurrentTab,
    simulateDisruption,
    openDetailModal
  } = useDemo();

  const isDisrupted = journeyStatus === 'DISRUPTED';
  const isRecovered = journeyStatus === 'RECOVERED';
  const isAtRisk = journeyStatus === 'AT_RISK';

  const primaryConn = connections[0];

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'TRAIN':
        return <Train className="w-4 h-4" />;
      case 'BUS':
        return <Bus className="w-4 h-4" />;
      case 'FLIGHT':
        return <Plane className="w-4 h-4" />;
      default:
        return <Train className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Greeting & Operational Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-text-primary">
            Good evening, Arjun
          </h1>
          <p className="text-sm text-text-muted mt-0.5">
            {isDisrupted ? (
              <span className="text-rose-400 font-medium">
                ⚠️ Active disruption detected on your itinerary. Recovery action recommended.
              </span>
            ) : isRecovered ? (
              <span className="text-emerald-400 font-medium">
                ✓ Your journey has been reconstructed and is operating on schedule.
              </span>
            ) : isAtRisk ? (
              <span className="text-amber-400 font-medium">
                ⚠️ Transit delay detected. Buffer is tightening.
              </span>
            ) : (
              'Your journey is being monitored for disruption across all legs.'
            )}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {!isDisrupted && !isRecovered && (
            <button
              onClick={simulateDisruption}
              className="px-3.5 py-2 rounded-lg bg-disruption/20 hover:bg-disruption/30 border border-disruption/40 text-rose-300 text-xs font-bold font-mono flex items-center gap-1.5 transition-colors"
            >
              <Flame className="w-4 h-4 text-disruption" />
              <span>Simulate Disruption</span>
            </button>
          )}

          <button
            onClick={() => setCurrentTab('monitor')}
            className="px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-high border border-border text-xs font-medium flex items-center gap-1.5 transition-colors text-text-secondary hover:text-text-primary"
          >
            <Activity className="w-3.5 h-3.5 text-primary" />
            <span>Live Monitor</span>
          </button>

          <button
            onClick={() => setCurrentTab('ai')}
            className="px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-high border border-border text-xs font-medium flex items-center gap-1.5 transition-colors text-text-secondary hover:text-text-primary"
          >
            <Bot className="w-3.5 h-3.5 text-primary-light" />
            <span>Ask AI</span>
          </button>
        </div>
      </div>

      {/* Main Journey Health Card */}
      <div
        className={`rounded-2xl p-6 transition-all duration-300 ${
          isDisrupted
            ? 'hud-card-disrupted shadow-glow-danger'
            : isRecovered
            ? 'hud-card-recovered shadow-glow-success'
            : isAtRisk
            ? 'bg-amber-950/20 border border-amber-500/40'
            : 'hud-card'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Journey Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-text-muted uppercase tracking-wider">
                CURRENT ITINERARY
              </span>
              <span className="text-text-subtle">•</span>
              <span className="font-mono text-xs text-primary-light">
                {currentTrip.id}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xl sm:text-2xl font-black font-display">
              <span>{currentTrip.origin.split(' ')[0]}</span>
              <ArrowRight className="w-5 h-5 text-text-muted" />
              <span>Pune</span>
              <ArrowRight className="w-5 h-5 text-text-muted" />
              <span className="text-primary">{currentTrip.destination.split(',')[0]}</span>
            </div>

            <p className="text-xs text-text-muted">
              {isRecovered
                ? 'Original delay absorbed via KSRTC Club Class Connector. All bookings preserved.'
                : isDisrupted
                ? 'Transit disruption detected. Available connection buffer violated.'
                : isAtRisk
                ? 'Transit delay active. Connection buffer is tightening.'
                : 'Multi-leg transit: Feeder segments monitored with automated connection tracking.'}
            </p>
          </div>

          {/* Health Gauge & Status */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="text-left sm:text-right">
              <div className="text-xs font-mono text-text-muted uppercase">
                Journey Health
              </div>
              <div className="flex items-baseline sm:justify-end gap-1 mt-0.5">
                <span
                  className={`text-3xl sm:text-4xl font-black font-display ${
                    journeyHealth >= 90
                      ? 'text-emerald-400'
                      : journeyHealth >= 70
                      ? 'text-amber-400'
                      : 'text-rose-400 animate-pulse'
                  }`}
                >
                  {journeyHealth}%
                </span>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2">
              <StatusBadge
                status={
                  isRecovered
                    ? 'RECOVERED'
                    : isDisrupted
                    ? 'DELAYED'
                    : isAtRisk
                    ? 'AT_RISK'
                    : 'ON_TIME'
                }
                size="lg"
                pulse={isDisrupted}
              />
              <button
                onClick={() => setCurrentTab('journey')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-light transition-colors"
              >
                <span>View Complete Journey</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress bar visualizer */}
        <div className="w-full bg-surface-lowest rounded-full h-2 mt-6 overflow-hidden border border-border/50">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              journeyHealth >= 90
                ? 'bg-emerald-500 shadow-glow-success'
                : journeyHealth >= 70
                ? 'bg-amber-500 shadow-glow-warning'
                : 'bg-rose-500 shadow-glow-danger'
            }`}
            style={{ width: `${journeyHealth}%` }}
          />
        </div>
      </div>

      {/* Disruption Alert Banner */}
      {isDisrupted && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-display text-rose-200">
                🚨 JOURNEY DISRUPTION DETECTED
              </h4>
              <p className="text-xs text-rose-300/80 mt-0.5">
                Feeder delay breaks your downstream transfer. Available buffer is insufficient.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentTab('recovery')}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold font-display flex items-center justify-center gap-2 shadow-glow-danger transition-colors flex-shrink-0"
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Analyze & Recover</span>
          </button>
        </div>
      )}

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Connection Risk */}
        <div
          onClick={() =>
            primaryConn &&
            openDetailModal({
              title: 'Connection Risk Analysis',
              subtitle: primaryConn.transferStation,
              type: 'CONNECTION',
              data: {
                Status: primaryConn.status,
                RiskLevel: primaryConn.riskLevel,
                AvailableBuffer: `${primaryConn.availableBufferMinutes} mins`,
                RequiredTransfer: `${primaryConn.requiredTransferMinutes} mins`,
                FeederArrival: primaryConn.arrivalTime,
                NextDeparture: primaryConn.departureTime,
                Analysis: primaryConn.explanation
              }
            })
          }
          className="hud-card-interactive p-4 rounded-xl cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-text-muted font-mono mb-2">
            <span>CONNECTION RISK</span>
            <Info className="w-3.5 h-3.5 text-text-subtle" />
          </div>
          <div className="flex items-center justify-between">
            <RiskIndicator level={connectionRisk} />
            <span className="text-[11px] text-primary hover:underline font-mono">
              Why?
            </span>
          </div>
          <p className="text-[11px] text-text-muted mt-2 truncate font-mono">
            {primaryConn ? `Buffer: ${primaryConn.availableBufferMinutes} min (${primaryConn.status})` : 'Calculating...'}
          </p>
        </div>

        {/* Active Alerts */}
        <div
          onClick={() => setCurrentTab('notifications')}
          className="hud-card-interactive p-4 rounded-xl cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-text-muted font-mono mb-2">
            <span>ACTIVE ALERTS</span>
            <AlertTriangle className={`w-3.5 h-3.5 ${activeAlertsCount > 0 ? 'text-rose-400' : 'text-text-subtle'}`} />
          </div>
          <div className="text-2xl font-black font-display text-text-primary">
            {activeAlertsCount}
          </div>
          <p className="text-[11px] text-text-muted mt-2 font-mono">
            {activeAlertsCount > 0
              ? 'Critical disruption alert requires review'
              : 'Zero active disruption warnings'}
          </p>
        </div>

        {/* Recovery Plans */}
        <div
          onClick={() => setCurrentTab('recovery')}
          className="hud-card-interactive p-4 rounded-xl cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-text-muted font-mono mb-2">
            <span>RECOVERY PLANS</span>
            <LifeBuoy className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="text-2xl font-black font-display text-primary">
            {isRecovered ? '1 Selected' : isDisrupted ? `${recoveryPlans.length} Available` : '0 Required'}
          </div>
          <p className="text-[11px] text-text-muted mt-2 font-mono text-primary-light truncate">
            {isDisrupted && recommendedPlan
              ? `Recommended: ${recommendedPlan.title.split(' ')[0]} (${recommendedPlan.recoveryScore}% Score)`
              : isRecovered
              ? 'Plan confirmed & locked'
              : 'Itinerary stable'}
          </p>
        </div>
      </div>

      {/* Dynamic Trip Segments */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-display text-text-primary flex items-center gap-2">
            <span>Trip Segments</span>
            <span className="text-xs font-normal text-text-muted font-mono">
              (Live Data from Central Trip Store)
            </span>
          </h3>
          <button
            onClick={() => setCurrentTab('journey')}
            className="text-xs text-primary hover:text-primary-light font-medium flex items-center gap-1"
          >
            <span>Timeline Graph</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentTrip.segments.map((seg) => {
            if (seg.type === 'TRAIN' || seg.type === 'BUS' || seg.type === 'FLIGHT') {
              const tSeg = seg as TransportSegment;
              return (
                <div
                  key={tSeg.id}
                  onClick={() =>
                    openDetailModal({
                      title: tSeg.serviceNumber,
                      subtitle: `${tSeg.origin} → ${tSeg.destination}`,
                      type: tSeg.type,
                      data: {
                        Service: tSeg.serviceNumber,
                        Provider: tSeg.provider,
                        DepartureTime: tSeg.departureTime,
                        ScheduledArrival: tSeg.scheduledArrival,
                        EstimatedArrival: tSeg.estimatedArrival,
                        Status: tSeg.status,
                        Delay: `${tSeg.delayMinutes} min`,
                        Platform: tSeg.platformOrTerminal,
                        Seating: tSeg.seatOrClass,
                        Source: tSeg.dataSource,
                        Notes: tSeg.notes
                      }
                    })
                  }
                  className={`p-4 rounded-xl cursor-pointer hud-card-interactive ${
                    tSeg.status === 'MISSED' || tSeg.status === 'CANCELLED' || tSeg.delayMinutes > 60
                      ? 'hud-card-disrupted'
                      : tSeg.status === 'RECOVERED'
                      ? 'hud-card-recovered'
                      : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        {getTransportIcon(tSeg.type)}
                      </div>
                      <div>
                        <span className="text-xs font-bold font-mono text-text-secondary uppercase">
                          {tSeg.type}
                        </span>
                        <div className="text-xs text-text-muted font-mono truncate max-w-[120px]">
                          {tSeg.serviceNumber.split(' ')[0]}
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={tSeg.status} size="sm" />
                  </div>

                  <div className="my-3 space-y-1">
                    <div className="text-sm font-bold font-display text-text-primary truncate">
                      {(tSeg.origin || tSeg.from || '').split(' ')[0]} → {(tSeg.destination || tSeg.to || '').split(' ')[0]}
                    </div>
                    <div className="text-xs text-text-muted font-mono">
                      {tSeg.departureTime} →{' '}
                      <span className={tSeg.delayMinutes > 0 ? 'text-rose-400 font-bold' : ''}>
                        {tSeg.estimatedArrival}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                    <ProviderBadge type={tSeg.type} />
                    <span className="text-[10px] text-text-muted font-mono">
                      {tSeg.delayMinutes > 0 ? `+${tSeg.delayMinutes}m` : 'On Time'}
                    </span>
                  </div>
                </div>
              );
            }

            if (seg.type === 'HOTEL') {
              const hSeg = seg as HotelSegment;
              return (
                <div
                  key={hSeg.id}
                  onClick={() =>
                    openDetailModal({
                      title: hSeg.name,
                      subtitle: hSeg.location,
                      type: 'HOTEL',
                      data: {
                        Hotel: hSeg.name,
                        Location: hSeg.location,
                        CheckInTime: hSeg.checkInTime,
                        Status: hSeg.status,
                        BookingRef: hSeg.bookingRef,
                        RoomType: hSeg.roomType,
                        Source: hSeg.dataSource
                      }
                    })
                  }
                  className="p-4 rounded-xl cursor-pointer hud-card-interactive"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold font-mono text-text-secondary uppercase">
                          HOTEL
                        </span>
                        <div className="text-xs text-text-muted font-mono">
                          Goa Candolim
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={hSeg.status} size="sm" />
                  </div>

                  <div className="my-3 space-y-1">
                    <div className="text-sm font-bold font-display text-text-primary truncate">
                      {hSeg.name}
                    </div>
                    <div className="text-xs text-text-muted font-mono">
                      Check-in: {hSeg.checkInTime}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                    <ProviderBadge type="HOTEL" />
                    <span className="text-[10px] text-text-muted font-mono truncate max-w-[80px]">
                      {hSeg.bookingRef}
                    </span>
                  </div>
                </div>
              );
            }

            if (seg.type === 'ACTIVITY') {
              const aSeg = seg as ActivitySegment;
              return (
                <div
                  key={aSeg.id}
                  onClick={() =>
                    openDetailModal({
                      title: aSeg.name,
                      subtitle: aSeg.location,
                      type: 'ACTIVITY',
                      data: {
                        Activity: aSeg.name,
                        Location: aSeg.location,
                        ScheduledTime: aSeg.startTime,
                        Status: aSeg.status,
                        BookingRef: aSeg.bookingRef,
                        Source: aSeg.dataSource
                      }
                    })
                  }
                  className="p-4 rounded-xl cursor-pointer hud-card-interactive"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        <Ticket className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold font-mono text-text-secondary uppercase">
                          ACTIVITY
                        </span>
                        <div className="text-xs text-text-muted font-mono">
                          Goa Watersports
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={aSeg.status} size="sm" />
                  </div>

                  <div className="my-3 space-y-1">
                    <div className="text-sm font-bold font-display text-text-primary truncate">
                      Grand Island Scuba
                    </div>
                    <div className="text-xs text-text-muted font-mono">
                      {aSeg.startTime}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                    <ProviderBadge type="ACTIVITY" />
                    <span className="text-[10px] text-text-muted font-mono">
                      {aSeg.bookingRef}
                    </span>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
};
