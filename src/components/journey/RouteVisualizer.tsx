import React, { useState } from 'react';
import {
  Train,
  Bus,
  Plane,
  Building2,
  Ticket,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Zap,
  Radio,
  Sparkles,
  Info
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { TransportSegment, HotelSegment, ActivitySegment } from '../../types';

export const RouteVisualizer: React.FC = () => {
  const {
    currentTrip,
    journeyStatus,
    journeyHealth,
    openDetailModal,
    openEditJourneyModal
  } = useDemo();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const isDisrupted = journeyStatus === 'DISRUPTED';
  const isRecovered = journeyStatus === 'RECOVERED';
  const isAtRisk = journeyStatus === 'AT_RISK';

  const segments = currentTrip.segments || [];

  const getSegmentIcon = (type: string) => {
    switch (type) {
      case 'TRAIN':
        return <Train className="w-4 h-4" />;
      case 'BUS':
        return <Bus className="w-4 h-4" />;
      case 'FLIGHT':
        return <Plane className="w-4 h-4" />;
      case 'HOTEL':
        return <Building2 className="w-4 h-4" />;
      case 'ACTIVITY':
        return <Ticket className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div
      className={`rounded-3xl p-5 sm:p-6 transition-all duration-300 relative overflow-hidden ${
        isDisrupted
          ? 'hud-card-disrupted'
          : isRecovered
          ? 'hud-card-recovered'
          : isAtRisk
          ? 'bg-amber-50/90 border border-amber-300 shadow-md backdrop-blur-xl'
          : 'hud-card shadow-glass-warm'
      }`}
    >
      {/* Ambient background glow accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-900/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-amber-600/10 border border-amber-600/20 text-amber-800 flex items-center justify-center font-bold">
            <Radio className="w-4 h-4 text-amber-700 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold font-display text-text-primary tracking-tight">
                Live Route & Segment Telemetry Map
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 border border-emerald-300 font-bold">
                ● Live GPS Active
              </span>
            </div>
            <p className="text-[11px] text-text-muted font-mono">
              {currentTrip.origin} → {currentTrip.destination} • {segments.length} Synchronized Legs
            </p>
          </div>
        </div>

        <button
          onClick={openEditJourneyModal}
          className="text-[11px] font-mono font-bold text-amber-800 hover:text-amber-900 px-3 py-1.5 rounded-xl bg-amber-100/60 hover:bg-amber-100 border border-amber-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>✏️ Modify Itinerary</span>
        </button>
      </div>

      {/* Interactive Visual Timeline Track */}
      <div className="py-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {segments.map((seg, idx) => {
            const isTransport = seg.type === 'TRAIN' || seg.type === 'BUS' || seg.type === 'FLIGHT';
            const tSeg = isTransport ? (seg as TransportSegment) : null;
            const hSeg = seg.type === 'HOTEL' ? (seg as HotelSegment) : null;
            const aSeg = seg.type === 'ACTIVITY' ? (seg as ActivitySegment) : null;

            const name = tSeg ? tSeg.serviceNumber : hSeg ? hSeg.name : aSeg ? aSeg.name : 'Segment';
            const from = tSeg ? (tSeg.origin || tSeg.from) : hSeg ? hSeg.location : aSeg ? aSeg.location : '';
            const to = tSeg ? (tSeg.destination || tSeg.to) : '';
            const time = tSeg ? `${tSeg.departureTime} → ${tSeg.estimatedArrival}` : hSeg ? `Check-in: ${hSeg.checkInTime}` : aSeg ? `Start: ${aSeg.startTime}` : '';
            const delay = tSeg?.delayMinutes || 0;

            const isLegDisrupted = isDisrupted && (seg.id.includes('train') || idx === 0 || delay > 15);
            const isLegRecovered = isRecovered && (seg.id.includes('bus') || idx === 1);
            const isFirst = idx === 0;

            return (
              <div
                key={seg.id}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() =>
                  openDetailModal({
                    title: name,
                    type: 'SEGMENT',
                    data: seg as any
                  })
                }
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                  isLegDisrupted
                    ? 'bg-rose-50/90 border-rose-300 shadow-glow-danger hover:border-rose-400'
                    : isLegRecovered
                    ? 'bg-emerald-50/90 border-emerald-300 shadow-glow-success hover:border-emerald-400'
                    : hoveredIndex === idx
                    ? 'bg-white border-amber-500 shadow-lg -translate-y-1'
                    : 'bg-white/80 border-amber-900/15 shadow-sm hover:border-amber-400'
                }`}
              >
                {/* Connecting Track Line Arrow (for desktop) */}
                {idx < segments.length - 1 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-white border border-amber-300 items-center justify-center text-amber-700 shadow-sm">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}

                {/* Top Badge & Node Status */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                        isLegDisrupted
                          ? 'bg-rose-600 text-white animate-radar-danger'
                          : isLegRecovered
                          ? 'bg-emerald-600 text-white'
                          : isFirst
                          ? 'bg-amber-600 text-white animate-radar'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {getSegmentIcon(seg.type)}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-text-muted uppercase">
                      Leg #{idx + 1}
                    </span>
                  </div>

                  {isLegDisrupted ? (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-200 text-rose-900 border border-rose-300 animate-pulse">
                      +{delay || 70}m DELAY
                    </span>
                  ) : isLegRecovered ? (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900 border border-emerald-300">
                      REBOOKED
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                      ON TRACK
                    </span>
                  )}
                </div>

                {/* Service Name */}
                <h4 className="text-xs font-bold font-display text-text-primary truncate" title={name}>
                  {name}
                </h4>

                {/* Location Track */}
                <div className="text-[11px] font-mono text-text-secondary mt-1 truncate">
                  {to ? `${from} → ${to}` : from}
                </div>

                {/* Timings */}
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-muted mt-2 pt-2 border-t border-amber-900/10">
                  <Clock className="w-3 h-3 text-amber-700" />
                  <span>{time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-Time Telemetry Gauges Footer */}
      <div className="pt-3 border-t border-amber-900/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center relative z-10">
        <div className="p-2.5 rounded-xl bg-surface-lowest/70 border border-amber-900/10">
          <div className="text-[10px] font-mono text-text-muted uppercase">Feeder Speed</div>
          <div className="text-xs font-bold font-mono text-text-primary mt-0.5">
            {isDisrupted ? '42 km/h (Congested)' : '94 km/h (Cruising)'}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-surface-lowest/70 border border-amber-900/10">
          <div className="text-[10px] font-mono text-text-muted uppercase">GPS Heading</div>
          <div className="text-xs font-bold font-mono text-text-primary mt-0.5">
            18.5204° N, 73.8567° E
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-surface-lowest/70 border border-amber-900/10">
          <div className="text-[10px] font-mono text-text-muted uppercase">Connection Buffer</div>
          <div
            className={`text-xs font-bold font-mono mt-0.5 ${
              isDisrupted ? 'text-rose-700 font-black' : isRecovered ? 'text-emerald-700' : 'text-emerald-700'
            }`}
          >
            {isDisrupted ? '-45 mins (Violated)' : isRecovered ? '+35 mins (Optimal)' : '+25 mins (Healthy)'}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-surface-lowest/70 border border-amber-900/10">
          <div className="text-[10px] font-mono text-text-muted uppercase">Engine Status</div>
          <div
            className={`text-xs font-bold font-mono mt-0.5 flex items-center justify-center gap-1 ${
              isDisrupted ? 'text-rose-700' : 'text-emerald-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isDisrupted ? 'Recovery Ready' : 'Monitoring Active'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
