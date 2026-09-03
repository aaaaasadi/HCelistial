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
  AlertTriangle,
  Compass
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { StatusBadge } from '../common/StatusBadge';
import { ProviderBadge } from '../common/ProviderBadge';
import { RiskIndicator } from '../common/RiskIndicator';
import { TransportSegment, HotelSegment, ActivitySegment } from '../../types';
import { EclipseButton } from '@/components/ui/eclipse-button';

import { RouteVisualizer } from '../journey/RouteVisualizer';

export const DashboardView: React.FC = () => {
  const {
    currentTrip,
    currentUser,
    journeyHealth,
    journeyStatus,
    connectionRisk,
    connections,
    activeAlertsCount,
    recoveryPlans,
    recommendedPlan,
    setCurrentTab,
    simulateDisruption,
    openDetailModal,
    openEditJourneyModal
  } = useDemo();

  const isDisrupted = journeyStatus === 'DISRUPTED';
  const isRecovered = journeyStatus === 'RECOVERED';
  const isAtRisk = journeyStatus === 'AT_RISK';

  const primaryConn = connections[0];

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'TRAIN':
        return <Train className="w-4 h-4 text-amber-700" />;
      case 'BUS':
        return <Bus className="w-4 h-4 text-amber-700" />;
      case 'FLIGHT':
        return <Plane className="w-4 h-4 text-amber-700" />;
      default:
        return <Train className="w-4 h-4 text-amber-700" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Greeting & Operational Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-text-primary">
            Good day, {currentUser?.name?.split(' ')[0] || 'Traveler'}
          </h1>
          <p className="text-sm text-text-muted mt-0.5">
            {isDisrupted ? (
              <span className="text-rose-700 font-medium">
                ⚠️ Active disruption detected on your itinerary. Recovery action recommended.
              </span>
            ) : isRecovered ? (
              <span className="text-emerald-700 font-medium">
                ✓ Your journey has been reconstructed and is operating on schedule.
              </span>
            ) : isAtRisk ? (
              <span className="text-amber-700 font-medium">
                ⚠️ Transit delay detected. Buffer is tightening.
              </span>
            ) : (
              'Your journey is being monitored for disruption across all legs.'
            )}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={openEditJourneyModal}
            className="px-4 py-2 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>✏️ Modify Journey</span>
          </button>

          {!isDisrupted && !isRecovered && (
            <button
              onClick={simulateDisruption}
              className="px-4 py-2 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 text-xs font-bold font-mono flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Flame className="w-4 h-4 text-rose-600 animate-bounce" />
              <span>Simulate Disruption</span>
            </button>
          )}

          <button
            onClick={() => setCurrentTab('monitor')}
            className="px-4 py-2 rounded-full bg-white hover:bg-surface-lowest border border-border text-xs font-semibold flex items-center gap-1.5 transition-colors text-text-secondary hover:text-text-primary shadow-sm"
          >
            <Activity className="w-3.5 h-3.5 text-amber-600" />
            <span>Live Monitor</span>
          </button>

          <button
            onClick={() => setCurrentTab('ai')}
            className="px-4 py-2 rounded-full bg-white hover:bg-surface-lowest border border-border text-xs font-semibold flex items-center gap-1.5 transition-colors text-text-secondary hover:text-text-primary shadow-sm"
          >
            <Bot className="w-3.5 h-3.5 text-amber-600" />
            <span>Ask AI</span>
          </button>
        </div>
      </div>

      {/* Interactive Animated Route Visualizer */}
      <RouteVisualizer />

      {/* Main Journey Health Card */}
      <div
        className={`rounded-2xl sm:rounded-3xl p-6 transition-all duration-300 ${
          isDisrupted
            ? 'hud-card-disrupted shadow-glow-danger'
            : isRecovered
            ? 'hud-card-recovered shadow-glow-success'
            : isAtRisk
            ? 'bg-amber-50 border border-amber-300 shadow-sm'
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
              <span className="font-mono text-xs text-amber-700 font-semibold">
                {currentTrip.id}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xl sm:text-2xl font-black font-display text-text-primary">
              <span>{currentTrip.origin.split(' ')[0]}</span>
              <ArrowRight className="w-5 h-5 text-text-muted" />
              <span>Pune</span>
              <ArrowRight className="w-5 h-5 text-text-muted" />
              <span className="text-amber-700">{currentTrip.destination.split(',')[0]}</span>
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
                      ? 'text-emerald-700'
                      : journeyHealth >= 70
                      ? 'text-amber-700'
                      : 'text-rose-700 animate-pulse'
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
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
              >
                <span>View Complete Journey</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress bar visualizer */}
        <div className="w-full bg-amber-100/60 rounded-full h-2.5 mt-6 overflow-hidden border border-amber-900/10">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              journeyHealth >= 90
                ? 'bg-emerald-600 shadow-glow-success'
                : journeyHealth >= 70
                ? 'bg-amber-600 shadow-glow-warning'
                : 'bg-rose-600 shadow-glow-danger'
            }`}
            style={{ width: `${journeyHealth}%` }}
          />
        </div>
      </div>

      {/* Disruption Alert Banner */}
      {isDisrupted && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700 flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-display text-rose-900">
                🚨 JOURNEY DISRUPTION DETECTED
              </h4>
              <p className="text-xs text-rose-800/80 mt-0.5">
                Feeder delay breaks your downstream transfer. Available buffer is insufficient.
              </p>
            </div>
          </div>
          <EclipseButton
            variant="destructive"
            size="sm"
            text="Analyze & Recover"
            onClick={() => setCurrentTab('recovery')}
            leftIcon={<LifeBuoy className="w-3.5 h-3.5" />}
            className="w-full sm:w-auto flex-shrink-0 shadow-glow-danger"
          />
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
          className="hud-card-interactive p-5 rounded-2xl cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-text-muted font-mono mb-2">
            <span>CONNECTION RISK</span>
            <Info className="w-3.5 h-3.5 text-text-subtle" />
          </div>
          <div className="flex items-center justify-between">
            <RiskIndicator level={connectionRisk} />
            <span className="text-[11px] text-amber-700 hover:underline font-mono font-bold">
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
          className="hud-card-interactive p-5 rounded-2xl cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-text-muted font-mono mb-2">
            <span>ACTIVE ALERTS</span>
            <AlertTriangle className={`w-3.5 h-3.5 ${activeAlertsCount > 0 ? 'text-rose-600' : 'text-text-subtle'}`} />
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
          className="hud-card-interactive p-5 rounded-2xl cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-text-muted font-mono mb-2">
            <span>RECOVERY PLANS</span>
            <LifeBuoy className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-2xl font-black font-display text-amber-700">
            {isRecovered ? '1 Selected' : isDisrupted ? `${recoveryPlans.length} Available` : '0 Required'}
          </div>
          <p className="text-[11px] text-amber-800/80 mt-2 font-mono truncate">
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
            className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1"
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
                  className={`p-5 rounded-2xl cursor-pointer hud-card-interactive ${
                    tSeg.status === 'MISSED' || tSeg.status === 'CANCELLED' || tSeg.delayMinutes > 60
                      ? 'hud-card-disrupted'
                      : tSeg.status === 'RECOVERED'
                      ? 'hud-card-recovered'
                      : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
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
                      <span className={tSeg.delayMinutes > 0 ? 'text-rose-700 font-bold' : ''}>
                        {tSeg.estimatedArrival}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                    <ProviderBadge type={tSeg.type} />
                    <span className="text-[10px] text-text-muted font-mono font-medium">
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
                  className="p-5 rounded-2xl cursor-pointer hud-card-interactive"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
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
                    <span className="text-[10px] font-mono text-text-muted">
                      {hSeg.bookingRef}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-mono font-medium">
                      Confirmed
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
                        Time: aSeg.startTime,
                        Status: aSeg.status,
                        BookingRef: aSeg.bookingRef,
                        Source: aSeg.dataSource
                      }
                    })
                  }
                  className="p-5 rounded-2xl cursor-pointer hud-card-interactive"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                        <Ticket className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold font-mono text-text-secondary uppercase">
                          ACTIVITY
                        </span>
                        <div className="text-xs text-text-muted font-mono truncate max-w-[120px]">
                          {aSeg.name}
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={aSeg.status} size="sm" />
                  </div>

                  <div className="my-3 space-y-1">
                    <div className="text-sm font-bold font-display text-text-primary truncate">
                      {aSeg.name}
                    </div>
                    <div className="text-xs text-text-muted font-mono">
                      Schedule: {aSeg.startTime}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-text-muted">
                      {aSeg.bookingRef}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-mono font-medium">
                      Active
                    </span>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>

      {/* Interactive Quick Launch Action Bar */}
      <div className="bg-white/90 backdrop-blur-xl border border-amber-900/10 rounded-3xl p-6 shadow-glass-warm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold font-display text-text-primary flex items-center gap-2">
            <Bot className="w-4 h-4 text-amber-600" />
            <span>Autonomous Intelligence & Tools</span>
          </h4>
          <p className="text-xs text-text-muted mt-0.5">
            Real-time multi-modal routing, verified facts AI assistant, and interactive components.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
          <EclipseButton
            variant="outline"
            size="sm"
            text="AI Guide"
            leftIcon={<Bot className="w-3.5 h-3.5" />}
            onClick={() => setCurrentTab('ai')}
          />
          <EclipseButton
            variant="ghost"
            size="sm"
            text="Explore"
            leftIcon={<Compass className="w-3.5 h-3.5" />}
            onClick={() => setCurrentTab('destinations')}
          />
          <EclipseButton
            variant="primary"
            size="sm"
            text="Recovery Center"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={() => setCurrentTab('recovery')}
          />
        </div>
      </div>
    </div>
  );
};
