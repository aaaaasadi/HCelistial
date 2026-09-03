import React, { useState } from 'react';
import {
  X,
  Edit3,
  Plus,
  Trash2,
  Train,
  Bus,
  Plane,
  Building2,
  Ticket,
  Save,
  CheckCircle2,
  MapPin,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { TransportSegment, HotelSegment, ActivitySegment, TripSegment, TransportType } from '../../types';

export const EditJourneyModal: React.FC = () => {
  const {
    isEditJourneyModalOpen,
    closeEditJourneyModal,
    currentTrip,
    updateTripDetails,
    addTripSegment,
    removeTripSegment,
    editTripSegment
  } = useDemo();

  const [tripTitle, setTripTitle] = useState(currentTrip.title);
  const [tripOrigin, setTripOrigin] = useState(currentTrip.origin);
  const [tripDestination, setTripDestination] = useState(currentTrip.destination);

  // New segment state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newType, setNewType] = useState<TransportType>('TRAIN');
  const [newService, setNewService] = useState('');
  const [newOrigin, setNewOrigin] = useState('');
  const [newDestination, setNewDestination] = useState('');
  const [newDeparture, setNewDeparture] = useState('10:00');
  const [newArrival, setNewArrival] = useState('14:30');
  const [newPlatform, setNewPlatform] = useState('Platform 1');
  const [newProvider, setNewProvider] = useState('Express Rail');

  if (!isEditJourneyModalOpen) return null;

  const handleSaveTripHeader = (e: React.FormEvent) => {
    e.preventDefault();
    updateTripDetails(tripTitle, tripOrigin, tripDestination);
    closeEditJourneyModal();
  };

  const handleAddSegmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.trim()) return;

    if (newType === 'HOTEL') {
      const newHotel: HotelSegment = {
        id: `hotel-${Date.now()}`,
        type: 'HOTEL',
        name: newService,
        location: newDestination || tripDestination,
        checkInTime: newDeparture,
        status: 'CONFIRMED',
        bookingRef: `HTL-${Math.floor(1000 + Math.random() * 9000)}`,
        roomType: 'Deluxe Suite',
        dataSource: 'MANUAL • USER CUSTOM'
      };
      addTripSegment(newHotel);
    } else if (newType === 'ACTIVITY') {
      const newActivity: ActivitySegment = {
        id: `act-${Date.now()}`,
        type: 'ACTIVITY',
        name: newService,
        location: newDestination || tripDestination,
        startTime: newDeparture,
        status: 'CONFIRMED',
        bookingRef: `ACT-${Math.floor(1000 + Math.random() * 9000)}`,
        dataSource: 'MANUAL • USER CUSTOM'
      };
      addTripSegment(newActivity);
    } else {
      const newTransport: TransportSegment = {
        id: `transport-${Date.now()}`,
        type: newType as 'TRAIN' | 'BUS' | 'FLIGHT',
        serviceNumber: newService,
        origin: newOrigin || tripOrigin,
        destination: newDestination || tripDestination,
        from: newOrigin || tripOrigin,
        to: newDestination || tripDestination,
        departureTime: newDeparture,
        scheduledArrival: newArrival,
        estimatedArrival: newArrival,
        delayMinutes: 0,
        platformOrTerminal: newPlatform,
        seatOrClass: 'Economy / Confirmed',
        status: 'ON_TIME',
        dataSource: 'MANUAL • USER CUSTOM',
        provider: newProvider
      };
      addTripSegment(newTransport);
    }

    setIsAddingNew(false);
    setNewService('');
    setNewOrigin('');
    setNewDestination('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-amber-900/15 rounded-3xl shadow-glass-warm overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-amber-900/10 bg-amber-50/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-glow-cream">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-text-primary">
                Modify & Customize Journey
              </h3>
              <p className="text-xs text-text-muted">
                Edit route details, add transit legs, or adjust timings
              </p>
            </div>
          </div>

          <button
            onClick={closeEditJourneyModal}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-amber-100/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Main Route Info */}
          <div className="p-4 rounded-2xl bg-surface-lowest/70 border border-amber-900/10 space-y-3">
            <div className="text-xs font-bold text-amber-900 font-mono uppercase tracking-wider">
              Journey Overview
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono font-bold text-text-secondary uppercase mb-1">
                  Trip Title
                </label>
                <input
                  type="text"
                  value={tripTitle}
                  onChange={(e) => setTripTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-border text-xs text-text-primary focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-text-secondary uppercase mb-1">
                  Origin City
                </label>
                <input
                  type="text"
                  value={tripOrigin}
                  onChange={(e) => setTripOrigin(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-border text-xs text-text-primary focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-text-secondary uppercase mb-1">
                  Destination City
                </label>
                <input
                  type="text"
                  value={tripDestination}
                  onChange={(e) => setTripDestination(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-border text-xs text-text-primary focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>
          </div>

          {/* Current Segments List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-text-primary font-display flex items-center gap-2">
                <span>Trip Segments ({currentTrip.segments.length})</span>
                <span className="text-[10px] text-text-muted font-mono font-normal">
                  (Changes dynamically recalculate connection buffer)
                </span>
              </div>

              {!isAddingNew && (
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold font-mono flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Segment</span>
                </button>
              )}
            </div>

            {/* Add New Segment Form */}
            {isAddingNew && (
              <form onSubmit={handleAddSegmentSubmit} className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                  <span className="text-xs font-bold text-amber-900 font-mono uppercase">
                    + Add New Itinerary Segment
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="text-xs text-text-muted hover:text-text-primary"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="text-[10px] font-mono text-text-muted uppercase">Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as TransportType)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-border text-xs text-text-primary focus:outline-none focus:border-amber-600"
                    >
                      <option value="TRAIN">Train</option>
                      <option value="BUS">Bus</option>
                      <option value="FLIGHT">Flight</option>
                      <option value="HOTEL">Hotel</option>
                      <option value="ACTIVITY">Activity</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-text-muted uppercase">Service / Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 12128 Intercity Exp"
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-border text-xs text-text-primary focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-text-muted uppercase">Departure / Start</label>
                    <input
                      type="text"
                      placeholder="06:45"
                      value={newDeparture}
                      onChange={(e) => setNewDeparture(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-border text-xs text-text-primary focus:outline-none focus:border-amber-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-text-muted uppercase">Arrival / End</label>
                    <input
                      type="text"
                      placeholder="10:05"
                      value={newArrival}
                      onChange={(e) => setNewArrival(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-border text-xs text-text-primary focus:outline-none focus:border-amber-600 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-mono text-text-muted uppercase">Origin Station</label>
                    <input
                      type="text"
                      placeholder="Mumbai CSTM"
                      value={newOrigin}
                      onChange={(e) => setNewOrigin(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-border text-xs text-text-primary focus:outline-none focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-text-muted uppercase">Destination Station</label>
                    <input
                      type="text"
                      placeholder="Pune Junction"
                      value={newDestination}
                      onChange={(e) => setNewDestination(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-border text-xs text-text-primary focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Append Segment</span>
                  </button>
                </div>
              </form>
            )}

            {/* List Existing Segments */}
            <div className="space-y-2">
              {currentTrip.segments.map((seg, idx) => {
                const isTransport = seg.type === 'TRAIN' || seg.type === 'BUS' || seg.type === 'FLIGHT';
                const tSeg = isTransport ? (seg as TransportSegment) : null;
                const hSeg = seg.type === 'HOTEL' ? (seg as HotelSegment) : null;
                const aSeg = seg.type === 'ACTIVITY' ? (seg as ActivitySegment) : null;

                const name = tSeg ? tSeg.serviceNumber : hSeg ? hSeg.name : aSeg ? aSeg.name : 'Segment';
                const route = tSeg ? `${tSeg.origin || tSeg.from} → ${tSeg.destination || tSeg.to}` : hSeg ? hSeg.location : aSeg ? aSeg.location : '';
                const time = tSeg ? `${tSeg.departureTime} - ${tSeg.estimatedArrival}` : hSeg ? `Check-in: ${hSeg.checkInTime}` : aSeg ? `Time: ${aSeg.startTime}` : '';

                return (
                  <div
                    key={seg.id}
                    className="p-3.5 rounded-2xl bg-white border border-amber-900/10 flex items-center justify-between gap-3 shadow-sm hover:border-amber-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                        {seg.type === 'TRAIN' && <Train className="w-4 h-4" />}
                        {seg.type === 'BUS' && <Bus className="w-4 h-4" />}
                        {seg.type === 'FLIGHT' && <Plane className="w-4 h-4" />}
                        {seg.type === 'HOTEL' && <Building2 className="w-4 h-4" />}
                        {seg.type === 'ACTIVITY' && <Ticket className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-text-primary flex items-center gap-2">
                          <span className="font-mono text-amber-700">#{idx + 1}</span>
                          <span>{name}</span>
                          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-surface-lowest text-text-muted">
                            {seg.type}
                          </span>
                        </div>
                        <div className="text-[11px] text-text-muted font-mono mt-0.5">
                          {route} • {time}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeTripSegment(seg.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove Segment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-amber-900/10 bg-surface-lowest/70 flex items-center justify-between flex-shrink-0">
          <div className="text-xs text-text-muted font-mono">
            Modifications apply across live engine
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={closeEditJourneyModal}
              className="px-4 py-2 rounded-full text-xs font-bold text-text-secondary hover:bg-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveTripHeader}
              className="px-5 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-glow-cream flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Update Journey</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
