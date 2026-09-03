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
  Clock,
  Search,
  Loader2,
  Radio,
  Tag,
  ShieldCheck,
  Zap,
  Info,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { TransportSegment, HotelSegment, ActivitySegment, TripSegment, TransportType } from '../../types';
import { transportApi } from '../../api/transportApi';
import { NormalizedTransportOption } from '../../../server/services/transport/interfaces/ITransportProvider';

export const EditJourneyModal: React.FC = () => {
  const {
    isEditJourneyModalOpen,
    closeEditJourneyModal,
    currentTrip,
    updateTripDetails,
    addTripSegment,
    removeTripSegment
  } = useDemo();

  const [tripTitle, setTripTitle] = useState(currentTrip.title);
  const [tripOrigin, setTripOrigin] = useState(currentTrip.origin);
  const [tripDestination, setTripDestination] = useState(currentTrip.destination);

  // Add Segment State
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [segmentType, setSegmentType] = useState<TransportType>('TRAIN');

  // Search parameters for real transport API
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOrigin, setSearchOrigin] = useState('');
  const [searchDestination, setSearchDestination] = useState('');
  const [searchDate, setSearchDate] = useState(new Date().toISOString().split('T')[0]);

  // Search results & loading
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<NormalizedTransportOption[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Hotel & Activity manual inputs
  const [hotelName, setHotelName] = useState('');
  const [hotelLocation, setHotelLocation] = useState('');
  const [hotelCheckIn, setHotelCheckIn] = useState('02:00 PM');
  const [hotelRoomType, setHotelRoomType] = useState('Deluxe Suite');

  const [activityName, setActivityName] = useState('');
  const [activityLocation, setActivityLocation] = useState('');
  const [activityStartTime, setActivityStartTime] = useState('09:00 AM');

  if (!isEditJourneyModalOpen) return null;

  const handleSearchTransport = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    setHasSearched(true);
    setSearchError(null);

    try {
      const orig = searchOrigin.trim() || tripOrigin;
      const dest = searchDestination.trim() || tripDestination;

      if (segmentType === 'TRAIN') {
        const res = await transportApi.searchTrains({
          origin: orig,
          destination: dest,
          date: searchDate,
          query: searchQuery
        });
        setSearchResults(res.data || []);
      } else if (segmentType === 'BUS') {
        const res = await transportApi.searchBuses({
          origin: orig,
          destination: dest,
          date: searchDate,
          query: searchQuery
        });
        setSearchResults(res.data || []);
      } else if (segmentType === 'FLIGHT') {
        const res = await transportApi.searchFlights({
          origin: orig,
          destination: dest,
          date: searchDate,
          query: searchQuery
        });
        setSearchResults(res.data || []);
      }
    } catch (err: any) {
      console.error('[EditJourneyModal] Transport search failed:', err);
      setSearchError(err.message || 'Failed to search transport API.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectTransportOption = (option: NormalizedTransportOption) => {
    const newSegment: TransportSegment = {
      id: `transport-${Date.now()}`,
      type: option.type,
      serviceNumber: option.serviceNumber,
      provider: option.provider,
      origin: option.origin,
      destination: option.destination,
      from: option.origin,
      to: option.destination,
      departureTime: option.scheduledDeparture,
      scheduledDeparture: option.scheduledDeparture,
      scheduledArrival: option.scheduledArrival,
      estimatedArrival: option.expectedArrival || option.scheduledArrival,
      delayMinutes: option.delayMinutes || 0,
      platformOrTerminal: option.platformOrTerminal || (option.type === 'TRAIN' ? 'Platform 1' : option.type === 'FLIGHT' ? 'Terminal 2' : 'Bay 1'),
      seatOrClass: option.seatOrClass || (option.type === 'TRAIN' ? 'AC Chair Car' : option.type === 'FLIGHT' ? 'Economy Flex' : 'Executive Sleeper'),
      status: option.status === 'DELAYED' ? 'DELAYED' : 'ON_TIME',
      dataSource: `${option.sourceProvider} [${option.sourceType}]`,
      notes: option.notes || `Booked via ${option.provider}`
    };

    addTripSegment(newSegment);
    setIsAddingNew(false);
    setSearchResults([]);
    setHasSearched(false);
    setSearchQuery('');
  };

  const handleAddHotelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotelName.trim()) return;

    const newHotel: HotelSegment = {
      id: `hotel-${Date.now()}`,
      type: 'HOTEL',
      name: hotelName.trim(),
      location: hotelLocation.trim() || tripDestination,
      checkInTime: hotelCheckIn,
      status: 'CONFIRMED',
      bookingRef: `HTL-${Math.floor(1000 + Math.random() * 9000)}`,
      roomType: hotelRoomType.trim() || 'Deluxe Room',
      dataSource: 'HOTEL PARTNER GDS • CONFIRMED'
    };

    addTripSegment(newHotel);
    setIsAddingNew(false);
    setHotelName('');
    setHotelLocation('');
  };

  const handleAddActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityName.trim()) return;

    const newActivity: ActivitySegment = {
      id: `act-${Date.now()}`,
      type: 'ACTIVITY',
      name: activityName.trim(),
      location: activityLocation.trim() || tripDestination,
      startTime: activityStartTime,
      status: 'CONFIRMED',
      bookingRef: `ACT-${Math.floor(1000 + Math.random() * 9000)}`,
      dataSource: 'EXPERIENCE PROVIDER • CONFIRMED'
    };

    addTripSegment(newActivity);
    setIsAddingNew(false);
    setActivityName('');
    setActivityLocation('');
  };

  const handleSaveTripHeader = (e: React.FormEvent) => {
    e.preventDefault();
    updateTripDetails(tripTitle, tripOrigin, tripDestination);
    closeEditJourneyModal();
  };

  const isTransportType = segmentType === 'TRAIN' || segmentType === 'BUS' || segmentType === 'FLIGHT';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white border border-amber-900/15 rounded-3xl shadow-glass-warm overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 sm:py-5 border-b border-amber-900/10 bg-amber-50/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-glow-cream">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-text-primary">
                Modify & Customize Journey
              </h3>
              <p className="text-xs text-text-muted">
                Live Transport Search across Train, Bus, and Flight APIs with automatic schedule population
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
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Main Route Overview */}
          <div className="p-4 rounded-2xl bg-surface-lowest/70 border border-amber-900/10 space-y-3">
            <div className="text-xs font-bold text-amber-900 font-mono uppercase tracking-wider flex items-center justify-between">
              <span>Journey Overview</span>
              <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Live Central Trip Store
              </span>
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
                  className="w-full px-3 py-2 rounded-xl bg-white border border-border text-xs text-text-primary focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-text-secondary uppercase mb-1">
                  Origin City / Hub
                </label>
                <input
                  type="text"
                  value={tripOrigin}
                  onChange={(e) => setTripOrigin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-border text-xs text-text-primary focus:outline-none focus:border-amber-600"
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
                  className="w-full px-3 py-2 rounded-xl bg-white border border-border text-xs text-text-primary focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>
          </div>

          {/* Add Segment Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-text-primary font-display flex items-center gap-2">
                  <span>Itinerary Segments ({currentTrip.segments.length})</span>
                </h4>
                <p className="text-[11px] text-text-muted font-mono">
                  Connection feasibility, transfer buffers, and recovery options recalculate automatically.
                </p>
              </div>

              {!isAddingNew && (
                <button
                  onClick={() => {
                    setIsAddingNew(true);
                    setSearchOrigin(tripOrigin);
                    setSearchDestination(tripDestination);
                    setSearchResults([]);
                    setHasSearched(false);
                    setSearchError(null);
                  }}
                  className="px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold font-mono flex items-center gap-1.5 transition-all shadow-glow-cream"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add New Segment</span>
                </button>
              )}
            </div>

            {/* Interactive Real Transport Search Box */}
            {isAddingNew && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-900 font-mono uppercase">
                      Select Segment Type:
                    </span>
                    <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-amber-200">
                      {(['TRAIN', 'BUS', 'FLIGHT', 'HOTEL', 'ACTIVITY'] as TransportType[]).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setSegmentType(t);
                            setSearchResults([]);
                            setHasSearched(false);
                            setSearchError(null);
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-bold font-mono transition-all ${
                            segmentType === t
                              ? 'bg-amber-600 text-white shadow-sm'
                              : 'text-text-muted hover:text-text-primary'
                          }`}
                        >
                          {t === 'TRAIN' && '🚆 Train'}
                          {t === 'BUS' && '🚌 Bus'}
                          {t === 'FLIGHT' && '✈️ Flight'}
                          {t === 'HOTEL' && '🏨 Hotel'}
                          {t === 'ACTIVITY' && '🎟️ Activity'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="text-xs font-bold text-text-muted hover:text-text-primary px-2 py-1 rounded-lg hover:bg-amber-100"
                  >
                    Cancel
                  </button>
                </div>

                {/* Transport Real API Search Form */}
                {isTransportType ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-white border border-amber-200/80 space-y-3">
                      <div className="flex items-center justify-between text-xs text-amber-900 font-semibold font-mono">
                        <span className="flex items-center gap-1.5">
                          <Radio className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                          <span>Live {segmentType} Schedule & Availability Search</span>
                        </span>
                        <span className="text-[10px] text-text-muted font-normal">
                          (Departure and arrival times populated automatically)
                        </span>
                      </div>

                      <form onSubmit={handleSearchTransport} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="text-[10px] font-mono font-bold text-text-secondary uppercase">
                              {segmentType === 'TRAIN' && 'Train Name or Number'}
                              {segmentType === 'BUS' && 'Bus Operator / Service'}
                              {segmentType === 'FLIGHT' && 'Flight No. or Airline'}
                            </label>
                            <input
                              type="text"
                              placeholder={
                                segmentType === 'TRAIN'
                                  ? 'e.g. 12127, Vande Bharat, Deccan Queen'
                                  : segmentType === 'BUS'
                                  ? 'e.g. KSRTC, IntrCity, ZingBus'
                                  : 'e.g. 6E-5128, IndiGo, Air India'
                              }
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-surface-lowest border border-border text-xs text-text-primary focus:outline-none focus:border-amber-600 font-mono"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-mono font-bold text-text-secondary uppercase">
                              Origin {segmentType === 'FLIGHT' ? 'Airport / City' : 'Station / City'}
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Mumbai CSMT"
                              value={searchOrigin}
                              onChange={(e) => setSearchOrigin(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-surface-lowest border border-border text-xs text-text-primary focus:outline-none focus:border-amber-600"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-mono font-bold text-text-secondary uppercase">
                              Destination {segmentType === 'FLIGHT' ? 'Airport / City' : 'Station / City'}
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Pune Junction"
                              value={searchDestination}
                              onChange={(e) => setSearchDestination(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-surface-lowest border border-border text-xs text-text-primary focus:outline-none focus:border-amber-600"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-text-muted">Travel Date:</span>
                            <input
                              type="date"
                              value={searchDate}
                              onChange={(e) => setSearchDate(e.target.value)}
                              className="px-2.5 py-1 rounded-lg bg-surface-lowest border border-border text-xs font-mono text-text-primary focus:outline-none focus:border-amber-600"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isSearching}
                            className="px-5 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold font-mono shadow-glow-cream flex items-center gap-2 transition-all disabled:opacity-50"
                          >
                            {isSearching ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Querying Transport Providers...</span>
                              </>
                            ) : (
                              <>
                                <Search className="w-3.5 h-3.5" />
                                <span>Search {segmentType === 'TRAIN' ? 'Trains' : segmentType === 'BUS' ? 'Buses' : 'Flights'}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Search Error Alert */}
                    {searchError && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>Provider Notice:</strong> {searchError}
                        </div>
                      </div>
                    )}

                    {/* Results Container */}
                    {hasSearched && !searchError && (
                      <div className="space-y-2.5 pt-1">
                        <div className="text-xs font-bold text-text-primary font-mono flex items-center justify-between">
                          <span>Available Matching Results ({searchResults.length}):</span>
                          <span className="text-[10px] text-text-muted font-normal">
                            Select an option to auto-populate journey leg
                          </span>
                        </div>

                        {searchResults.length === 0 ? (
                          <div className="p-6 text-center rounded-2xl bg-white border border-amber-200/80 text-xs text-text-muted font-mono">
                            No direct {segmentType.toLowerCase()} routes found for this search. Try modifying your stations or service name.
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                            {searchResults.map((option) => (
                              <div
                                key={option.id}
                                className="p-3.5 rounded-2xl bg-white border border-amber-900/10 hover:border-amber-400 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                              >
                                <div className="space-y-1.5 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-bold text-text-primary font-display">
                                      {option.serviceNumber}
                                    </span>
                                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                                      {option.provider}
                                    </span>
                                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                                      option.sourceType === 'REAL'
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                        : 'bg-amber-50 text-amber-800 border-amber-200'
                                    }`}>
                                      {option.sourceType === 'REAL' ? '🟢 REAL API' : '⚡ MOCK DATA'}
                                    </span>
                                  </div>

                                  <div className="text-xs font-bold text-text-primary flex items-center gap-2 font-mono">
                                    <span>{option.origin} ({option.scheduledDeparture})</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
                                    <span>{option.destination} ({option.scheduledArrival})</span>
                                  </div>

                                  <div className="flex items-center gap-3 text-[11px] text-text-muted font-mono flex-wrap">
                                    {option.duration && (
                                      <span>Duration: <strong className="text-text-primary">{option.duration}</strong></span>
                                    )}
                                    <span>Class: <strong className="text-text-primary">{option.seatOrClass || 'Confirmed'}</strong></span>
                                    <span>Platform/Gate: <strong className="text-text-primary">{option.platformOrTerminal || 'Assigned on arrival'}</strong></span>
                                    {option.fareRupees > 0 && (
                                      <span>Fare: <strong className="text-amber-800">₹{option.fareRupees}</strong></span>
                                    )}
                                    {option.availableSeats !== null && (
                                      <span className="text-emerald-700 font-semibold">{option.availableSeats} seats available</span>
                                    )}
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleSelectTransportOption(option)}
                                  className="px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold font-mono shadow-sm flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] flex-shrink-0"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>+ Add to Journey</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : segmentType === 'HOTEL' ? (
                  /* Hotel Manual Form */
                  <form onSubmit={handleAddHotelSubmit} className="space-y-3 p-3 rounded-xl bg-white border border-amber-200">
                    <div className="text-xs font-bold text-amber-900 font-mono">
                      🏨 Hotel Stay Details
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-mono font-bold text-text-secondary uppercase">Hotel Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Casa Ocean Retreat"
                          value={hotelName}
                          onChange={(e) => setHotelName(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-surface-lowest border border-border text-xs text-text-primary focus:outline-none focus:border-amber-600"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono font-bold text-text-secondary uppercase">Location / City</label>
                        <input
                          type="text"
                          placeholder="e.g. Candolim, Goa"
                          value={hotelLocation}
                          onChange={(e) => setHotelLocation(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-surface-lowest border border-border text-xs text-text-primary focus:outline-none focus:border-amber-600"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono font-bold text-text-secondary uppercase">Check-in Time</label>
                        <input
                          type="text"
                          placeholder="02:00 PM"
                          value={hotelCheckIn}
                          onChange={(e) => setHotelCheckIn(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-surface-lowest border border-border text-xs text-text-primary focus:outline-none focus:border-amber-600 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono font-bold text-text-secondary uppercase">Room Type</label>
                        <input
                          type="text"
                          placeholder="Deluxe Sea View Suite"
                          value={hotelRoomType}
                          onChange={(e) => setHotelRoomType(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-surface-lowest border border-border text-xs text-text-primary focus:outline-none focus:border-amber-600"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm"
                      >
                        + Add Hotel Leg
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Activity Manual Form */
                  <form onSubmit={handleAddActivitySubmit} className="space-y-3 p-3 rounded-xl bg-white border border-amber-200">
                    <div className="text-xs font-bold text-amber-900 font-mono">
                      🎟️ Activity / Experience Details
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-mono font-bold text-text-secondary uppercase">Activity Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Scuba Diving at Grande Island"
                          value={activityName}
                          onChange={(e) => setActivityName(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-surface-lowest border border-border text-xs text-text-primary focus:outline-none focus:border-amber-600"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono font-bold text-text-secondary uppercase">Location</label>
                        <input
                          type="text"
                          placeholder="e.g. Grande Island, Goa"
                          value={activityLocation}
                          onChange={(e) => setActivityLocation(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-surface-lowest border border-border text-xs text-text-primary focus:outline-none focus:border-amber-600"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono font-bold text-text-secondary uppercase">Start Time</label>
                        <input
                          type="text"
                          placeholder="09:00 AM"
                          value={activityStartTime}
                          onChange={(e) => setActivityStartTime(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-surface-lowest border border-border text-xs text-text-primary focus:outline-none focus:border-amber-600 font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm"
                      >
                        + Add Activity Leg
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Current Active Segments List */}
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
                      <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                        {seg.type === 'TRAIN' && <Train className="w-4 h-4" />}
                        {seg.type === 'BUS' && <Bus className="w-4 h-4" />}
                        {seg.type === 'FLIGHT' && <Plane className="w-4 h-4" />}
                        {seg.type === 'HOTEL' && <Building2 className="w-4 h-4" />}
                        {seg.type === 'ACTIVITY' && <Ticket className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-text-primary flex items-center gap-2">
                          <span className="font-mono text-amber-700 font-semibold">#{idx + 1}</span>
                          <span>{name}</span>
                          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-surface-lowest text-text-muted">
                            {seg.type}
                          </span>
                          {tSeg && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {tSeg.status}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-text-muted font-mono mt-0.5">
                          {route} • <span className="text-text-primary font-semibold">{time}</span> {tSeg?.platformOrTerminal && `• ${tSeg.platformOrTerminal}`}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeTripSegment(seg.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove Segment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-amber-900/10 bg-surface-lowest/70 flex items-center justify-between flex-shrink-0">
          <div className="text-xs text-text-muted font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Transport schedules synchronized with real provider feeds</span>
          </div>

          <div className="flex items-center gap-2.5">
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
