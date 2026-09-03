import React from 'react';
import {
  Train,
  Bus,
  Plane,
  Building2,
  Ticket,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Info,
  Flame,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { StatusBadge } from '../common/StatusBadge';
import { ProviderBadge } from '../common/ProviderBadge';
import {
  TripSegment,
  TransportSegment,
  HotelSegment,
  ActivitySegment,
  ConnectionInfo
} from '../../types';

export const MyJourneyView: React.FC = () => {
  const {
    currentTrip,
    connections,
    journeyStatus,
    simulateDisruption,
    resetJourney,
    setCurrentTab,
    openDetailModal,
    openEditJourneyModal,
    confirmedPlan
  } = useDemo();

  const isDisrupted = journeyStatus === 'DISRUPTED';
  const isRecovered = journeyStatus === 'RECOVERED';
  const isAtRisk = journeyStatus === 'AT_RISK';

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

  const getLifecycleBadge = (seg: TripSegment) => {
    if (seg.type === 'HOTEL' || seg.type === 'ACTIVITY') {
      if (isRecovered) {
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">PRESERVED</span>;
      }
      return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-surface-high text-text-secondary border border-border">CONFIRMED</span>;
    }
    const tSeg = seg as TransportSegment;
    if (tSeg.isReplacement) {
      return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">RECOVERED (NEW)</span>;
    }
    if (tSeg.status === 'RECOVERED') {
      return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">RECOVERED</span>;
    }
    if (tSeg.status === 'MISSED' || tSeg.status === 'CANCELLED') {
      return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">DISRUPTED</span>;
    }
    if (tSeg.delayMinutes > 0) {
      return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">DELAYED</span>;
    }
    return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-surface-high text-text-secondary border border-border">ORIGINAL</span>;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-text-primary">
              {currentTrip.title}
            </h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-highest border border-border text-primary-light font-bold">
              DATA-DRIVEN TIMELINE
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1 font-mono">
            Origin: {currentTrip.origin} • Destination: {currentTrip.destination} • {currentTrip.segments.length} Itinerary Segments
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={openEditJourneyModal}
            className="px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>✏️ Modify Journey</span>
          </button>

          {!isDisrupted && !isRecovered ? (
            <button
              onClick={simulateDisruption}
              className="px-3.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 text-xs font-bold font-mono flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Flame className="w-4 h-4 text-rose-600 animate-bounce" />
              <span>Simulate Disruption</span>
            </button>
          ) : isDisrupted ? (
            <button
              onClick={() => setCurrentTab('recovery')}
              className="px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold font-display flex items-center gap-1.5 shadow-glow-danger transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>View Recovery Plans</span>
            </button>
          ) : (
            <button
              onClick={resetJourney}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-surface-lowest border border-border text-xs text-text-secondary font-mono flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>Reset Journey</span>
            </button>
          )}
        </div>
      </div>

      {/* Recovered Banner */}
      {isRecovered && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-4 shadow-glow-success animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-display text-emerald-200">
                ✓ RECOVERED JOURNEY ACTIVE
              </h4>
              <p className="text-xs text-emerald-300/80">
                {confirmedPlan ? confirmedPlan.title : 'Train + Bus Seamless Connector'} confirmed. Replacement transit active.
              </p>
            </div>
          </div>
          <span className="font-mono text-xs px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
            STATUS: RECOVERED
          </span>
        </div>
      )}

      {/* Disruption Alert Bar */}
      {isDisrupted && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-glow-danger">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse flex-shrink-0" />
            <span className="text-xs text-rose-200 font-mono">
              Transit disruption detected • Downstream connections violated • Multi-leg recovery required
            </span>
          </div>
          <button
            onClick={() => setCurrentTab('recovery')}
            className="text-xs font-bold font-display text-rose-300 hover:text-white underline whitespace-nowrap"
          >
            Launch Recovery Center →
          </button>
        </div>
      )}

      {/* At Risk Warning Bar */}
      {isAtRisk && !isDisrupted && (
        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-center gap-2.5 text-amber-300 text-xs font-mono">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-400" />
          <span>A transit delay has tightened your connection buffer. Monitoring connection feasibility.</span>
        </div>
      )}

      {/* ================= DYNAMIC DATA-DRIVEN TIMELINE ================= */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-border-strong before:to-primary">
        {currentTrip.segments.map((segment, index) => {
          // Case 1: Transport Segment (Train, Bus, Flight)
          if (segment.type === 'TRAIN' || segment.type === 'BUS' || segment.type === 'FLIGHT') {
            const transportSeg = segment as TransportSegment;
            const nextSegment = currentTrip.segments[index + 1];
            const connectionBetween = connections.find(
              (c) => c.fromSegmentId === transportSeg.id
            );

            return (
              <React.Fragment key={transportSeg.id}>
                {/* City Node Header */}
                <div className="relative">
                  <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-surface-lowest border-2 border-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-black font-display text-text-primary">
                      {transportSeg.origin}
                    </h3>
                    <span className="font-mono text-xs text-text-muted">
                      Scheduled Departure: {transportSeg.scheduledDeparture}
                    </span>
                  </div>
                </div>

                {/* Transport Card */}
                <div className="relative pl-2">
                  <div
                    onClick={() =>
                      openDetailModal({
                        title: transportSeg.serviceNumber,
                        subtitle: `${transportSeg.origin} → ${transportSeg.destination}`,
                        type: transportSeg.type,
                        data: {
                          Service: transportSeg.serviceNumber,
                          Provider: transportSeg.provider,
                          ScheduledDeparture: transportSeg.scheduledDeparture,
                          ScheduledArrival: transportSeg.scheduledArrival,
                          ExpectedArrival: transportSeg.estimatedArrival,
                          Status: transportSeg.status,
                          DelayMinutes: `${transportSeg.delayMinutes} min`,
                          Platform: transportSeg.platformOrTerminal,
                          Seating: transportSeg.seatOrClass,
                          DataSource: transportSeg.dataSource,
                          Notes: transportSeg.notes
                        }
                      })
                    }
                    className={`p-5 rounded-xl cursor-pointer hud-card-interactive ${
                      transportSeg.status === 'MISSED' || transportSeg.status === 'CANCELLED'
                        ? 'hud-card-disrupted'
                        : transportSeg.status === 'RECOVERED'
                        ? 'hud-card-recovered'
                        : transportSeg.status === 'DELAYED'
                        ? 'hud-card-disrupted'
                        : ''
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                          {getTransportIcon(transportSeg.type)}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-sm font-display text-text-primary">
                              {transportSeg.serviceNumber}
                            </span>
                            <ProviderBadge type={transportSeg.type} />
                            {getLifecycleBadge(transportSeg)}
                          </div>
                          <span className="text-xs text-text-muted font-mono">
                            {transportSeg.provider}
                          </span>
                        </div>
                      </div>
                      <StatusBadge status={transportSeg.status} />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-surface-lowest/70 border border-border/50 text-xs font-mono">
                      <div>
                        <span className="text-text-muted block text-[10px] uppercase">Departure</span>
                        <span className="font-bold text-text-primary">{transportSeg.departureTime}</span>
                      </div>
                      <div>
                        <span className="text-text-muted block text-[10px] uppercase">Arrival (Exp)</span>
                        <span className={`font-bold ${transportSeg.delayMinutes > 0 ? 'text-rose-400' : 'text-text-primary'}`}>
                          {transportSeg.estimatedArrival}
                        </span>
                      </div>
                      <div>
                        <span className="text-text-muted block text-[10px] uppercase">Delay</span>
                        <span className={`font-bold ${transportSeg.delayMinutes > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {transportSeg.delayMinutes > 0 ? `+${transportSeg.delayMinutes}m` : 'On Time'}
                        </span>
                      </div>
                      <div>
                        <span className="text-text-muted block text-[10px] uppercase">Bay / Platform</span>
                        <span className="font-bold text-text-primary">{transportSeg.platformOrTerminal || 'TBD'}</span>
                      </div>
                    </div>

                    {transportSeg.notes && (
                      <p className="text-xs text-text-muted mt-2.5 font-mono flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span>{transportSeg.notes}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* If next segment is also transport, render calculated ConnectionCard */}
                {connectionBetween && (
                  <>
                    <div className="relative">
                      <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-surface-lowest border-2 border-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-black font-display text-text-primary">
                          {connectionBetween.transferStation}
                        </h3>
                        <span className="font-mono text-xs text-text-muted">
                          Intermodal Interchange
                        </span>
                      </div>
                    </div>

                    <div className="relative pl-2">
                      <div
                        onClick={() =>
                          openDetailModal({
                            title: 'Intermodal Connection Calculation',
                            subtitle: connectionBetween.transferStation,
                            type: 'CONNECTION',
                            data: {
                              ArrivingFrom: connectionBetween.arrivingFrom,
                              NextDeparture: connectionBetween.nextDeparture,
                              Arrival: connectionBetween.arrivalTime,
                              Departure: connectionBetween.departureTime,
                              AvailableBuffer: `${connectionBetween.availableBufferMinutes} min`,
                              RequiredTransfer: `${connectionBetween.requiredTransferMinutes} min`,
                              ConnectionStatus: connectionBetween.status,
                              RiskLevel: connectionBetween.riskLevel,
                              EngineEvaluation: connectionBetween.explanation
                            }
                          })
                        }
                        className={`p-5 rounded-xl cursor-pointer border transition-all ${
                          connectionBetween.status === 'MISSED'
                            ? 'bg-rose-950/30 border-rose-500/40 shadow-glow-danger'
                            : connectionBetween.status === 'RECOVERED'
                            ? 'bg-emerald-950/30 border-emerald-500/40 shadow-glow-success'
                            : connectionBetween.riskLevel === 'HIGH' || connectionBetween.riskLevel === 'MEDIUM'
                            ? 'bg-amber-950/30 border-amber-500/40'
                            : 'bg-surface-container border-border-strong hover:border-primary/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Clock className={`w-4 h-4 ${connectionBetween.status === 'MISSED' ? 'text-rose-400' : 'text-primary'}`} />
                            <span className="font-mono font-bold text-xs uppercase tracking-wider text-text-primary">
                              CONNECTION BUFFER ANALYSIS
                            </span>
                          </div>
                          <StatusBadge status={connectionBetween.status} />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-surface-lowest/70 border border-border/50 text-xs font-mono">
                          <div>
                            <span className="text-text-muted block text-[10px] uppercase">Arrival Time</span>
                            <span className="font-bold text-text-primary">{connectionBetween.arrivalTime}</span>
                          </div>
                          <div>
                            <span className="text-text-muted block text-[10px] uppercase">Next Departure</span>
                            <span className="font-bold text-text-primary">{connectionBetween.departureTime}</span>
                          </div>
                          <div>
                            <span className="text-text-muted block text-[10px] uppercase">Available Buffer</span>
                            <span className={`font-bold ${connectionBetween.availableBufferMinutes < 0 ? 'text-rose-400' : connectionBetween.availableBufferMinutes < 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                              {connectionBetween.availableBufferMinutes} mins
                            </span>
                          </div>
                          <div>
                            <span className="text-text-muted block text-[10px] uppercase">Required Transit</span>
                            <span className="font-bold text-text-primary">{connectionBetween.requiredTransferMinutes} mins</span>
                          </div>
                        </div>

                        <p className="text-xs text-text-muted mt-2.5 font-mono">
                          {connectionBetween.explanation}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </React.Fragment>
            );
          }

          // Case 2: Hotel Segment
          if (segment.type === 'HOTEL') {
            const hotelSeg = segment as HotelSegment;
            return (
              <React.Fragment key={hotelSeg.id}>
                <div className="relative">
                  <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-surface-lowest border-2 border-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-black font-display text-text-primary">
                      {hotelSeg.location.split(',')[0]}
                    </h3>
                    <span className="font-mono text-xs text-text-muted">
                      Destination Accommodation
                    </span>
                  </div>
                </div>

                <div className="relative pl-2">
                  <div
                    onClick={() =>
                      openDetailModal({
                        title: hotelSeg.name,
                        subtitle: hotelSeg.location,
                        type: 'HOTEL',
                        data: {
                          Hotel: hotelSeg.name,
                          Location: hotelSeg.location,
                          CheckIn: hotelSeg.checkInTime,
                          BookingRef: hotelSeg.bookingRef,
                          Status: hotelSeg.status,
                          RoomType: hotelSeg.roomType,
                          Source: hotelSeg.dataSource,
                          Notes: hotelSeg.notes
                        }
                      })
                    }
                    className="p-4 rounded-xl cursor-pointer hud-card-interactive"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-text-primary font-display">
                              🏨 HOTEL: {hotelSeg.name}
                            </span>
                            <ProviderBadge type="HOTEL" />
                          </div>
                          <span className="text-[11px] text-text-muted font-mono">
                            Check-in: {hotelSeg.checkInTime} • {hotelSeg.location}
                          </span>
                        </div>
                      </div>
                      <StatusBadge status={hotelSeg.status} size="sm" />
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          }

          // Case 3: Activity Segment
          if (segment.type === 'ACTIVITY') {
            const actSeg = segment as ActivitySegment;
            return (
              <div key={actSeg.id} className="relative pl-2">
                <div
                  onClick={() =>
                    openDetailModal({
                      title: actSeg.name,
                      subtitle: actSeg.location,
                      type: 'ACTIVITY',
                      data: {
                        Activity: actSeg.name,
                        Location: actSeg.location,
                        StartTime: actSeg.startTime,
                        BookingRef: actSeg.bookingRef,
                        Status: actSeg.status,
                        Source: actSeg.dataSource,
                        Notes: actSeg.notes
                      }
                    })
                  }
                  className="p-4 rounded-xl cursor-pointer hud-card-interactive"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        <Ticket className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-text-primary font-display">
                            🎟️ ACTIVITY: {actSeg.name}
                          </span>
                          <ProviderBadge type="ACTIVITY" />
                        </div>
                        <span className="text-[11px] text-text-muted font-mono">
                          {actSeg.startTime} • {actSeg.location}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={actSeg.status} size="sm" />
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};
