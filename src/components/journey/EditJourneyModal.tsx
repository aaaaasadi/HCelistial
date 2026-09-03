import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  Star,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { TransportSegment, HotelSegment, ActivitySegment, TripSegment, TransportType } from '../../types';
import { transportApi } from '../../api/transportApi';
import { destinationApi } from '../../api/destinationApi';
import { NormalizedTransportOption } from '../../../server/services/transport/interfaces/ITransportProvider';
import { SyntheticHotel, SyntheticActivity } from '../../../server/services/dataset/syntheticDatasetGenerator';

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

  // Search results & loading for Transport
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<NormalizedTransportOption[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Hotel Search State
  const [hotelInputMode, setHotelInputMode] = useState<'search' | 'manual'>('search');
  const [hotelSearchCity, setHotelSearchCity] = useState('');
  const [hotelSearchCategory, setHotelSearchCategory] = useState('');
  const [hotelSearchResults, setHotelSearchResults] = useState<SyntheticHotel[]>([]);
  const [isSearchingHotels, setIsSearchingHotels] = useState(false);
  const [hasSearchedHotels, setHasSearchedHotels] = useState(false);

  // Hotel Manual State
  const [hotelName, setHotelName] = useState('');
  const [hotelLocation, setHotelLocation] = useState('');
  const [hotelCheckIn, setHotelCheckIn] = useState('02:00 PM');
  const [hotelRoomType, setHotelRoomType] = useState('Deluxe Suite');

  // Activity Search State
  const [activityInputMode, setActivityInputMode] = useState<'search' | 'manual'>('search');
  const [activitySearchCity, setActivitySearchCity] = useState('');
  const [activitySearchCategory, setActivitySearchCategory] = useState('');
  const [activitySearchResults, setActivitySearchResults] = useState<SyntheticActivity[]>([]);
  const [isSearchingActivities, setIsSearchingActivities] = useState(false);
  const [hasSearchedActivities, setHasSearchedActivities] = useState(false);

  // Activity Manual State
  const [activityName, setActivityName] = useState('');
  const [activityLocation, setActivityLocation] = useState('');
  const [activityStartTime, setActivityStartTime] = useState('09:00 AM');

  const popularQuickDestinations = ['Goa', 'Mumbai', 'Pune', 'Jaipur', 'Udaipur', 'Manali', 'Rishikesh', 'Munnar', 'Delhi', 'Bengaluru'];

  // Auto-load hotels & activities when entering tabs
  useEffect(() => {
    if (!isEditJourneyModalOpen || !isAddingNew) return;

    if (segmentType === 'HOTEL') {
      const city = hotelSearchCity.trim() || tripDestination || 'Goa';
      setIsSearchingHotels(true);
      destinationApi.searchHotels(city, hotelSearchCategory || undefined)
        .then(res => {
          setHotelSearchResults(res.data || []);
          setHasSearchedHotels(true);
        })
        .finally(() => setIsSearchingHotels(false));
    } else if (segmentType === 'ACTIVITY') {
      const city = activitySearchCity.trim() || tripDestination || 'Goa';
      setIsSearchingActivities(true);
      destinationApi.searchActivities(city, activitySearchCategory || undefined)
        .then(res => {
          setActivitySearchResults(res.data || []);
          setHasSearchedActivities(true);
        })
        .finally(() => setIsSearchingActivities(false));
    }
  }, [segmentType, isAddingNew, isEditJourneyModalOpen, hotelSearchCategory, activitySearchCategory]);

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
      dataSource: `${option.provider} • Verified Link`,
      notes: option.notes || `Booked via ${option.provider}`
    };

    addTripSegment(newSegment);
    setIsAddingNew(false);
    setSearchResults([]);
    setHasSearched(false);
    setSearchQuery('');
  };

  const handleSearchHotels = async (e?: React.FormEvent, customCity?: string) => {
    if (e) e.preventDefault();
    setIsSearchingHotels(true);
    setHasSearchedHotels(true);
    try {
      const city = (customCity !== undefined ? customCity : hotelSearchCity).trim() || tripDestination || 'Goa';
      const res = await destinationApi.searchHotels(city, hotelSearchCategory || undefined);
      setHotelSearchResults(res.data || []);
    } catch (err) {
      console.error('[EditJourneyModal] Hotel search error:', err);
      setHotelSearchResults([]);
    } finally {
      setIsSearchingHotels(false);
    }
  };

  const handleSelectHotel = (hotel: SyntheticHotel) => {
    const newHotel: HotelSegment = {
      id: `hotel-${Date.now()}`,
      type: 'HOTEL',
      name: hotel.hotelName,
      location: hotel.area || `${hotel.cityName}, ${hotel.address}`,
      checkInTime: hotel.checkInTime || '02:00 PM',
      status: 'CONFIRMED',
      bookingRef: `HTL-${Math.floor(1000 + Math.random() * 9000)}`,
      roomType: hotel.roomTypes[0] || 'Deluxe Suite',
      dataSource: 'HOTEL GDS • CONFIRMED',
      notes: `Rating: ${hotel.rating}/5.0 • Amenities: ${hotel.amenities.slice(0, 3).join(', ')}`
    };

    addTripSegment(newHotel);
    setIsAddingNew(false);
    setHotelSearchResults([]);
    setHasSearchedHotels(false);
  };

  const handleAddHotelManualSubmit = (e: React.FormEvent) => {
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
      dataSource: 'HOTEL GDS • CONFIRMED'
    };

    addTripSegment(newHotel);
    setIsAddingNew(false);
    setHotelName('');
    setHotelLocation('');
  };

  const handleSearchActivities = async (e?: React.FormEvent, customCity?: string) => {
    if (e) e.preventDefault();
    setIsSearchingActivities(true);
    setHasSearchedActivities(true);
    try {
      const city = (customCity !== undefined ? customCity : activitySearchCity).trim() || tripDestination || 'Goa';
      const res = await destinationApi.searchActivities(city, activitySearchCategory || undefined);
      setActivitySearchResults(res.data || []);
    } catch (err) {
      console.error('[EditJourneyModal] Activity search error:', err);
      setActivitySearchResults([]);
    } finally {
      setIsSearchingActivities(false);
    }
  };

  const handleSelectActivity = (act: SyntheticActivity) => {
    const newActivity: ActivitySegment = {
      id: `act-${Date.now()}`,
      type: 'ACTIVITY',
      name: act.activityName,
      location: act.cityName,
      startTime: act.startTime || '04:00 PM',
      status: 'CONFIRMED',
      bookingRef: `ACT-${Math.floor(1000 + Math.random() * 9000)}`,
      dataSource: 'ACTIVITY GDS • CONFIRMED',
      notes: `Category: ${act.category} • Duration: ${act.duration} • Best Time: ${act.bestTime}`
    };

    addTripSegment(newActivity);
    setIsAddingNew(false);
    setActivitySearchResults([]);
    setHasSearchedActivities(false);
  };

  const handleAddActivityManualSubmit = (e: React.FormEvent) => {
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
      dataSource: 'ACTIVITY GDS • CONFIRMED'
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
                Search & Configure Transport, Hotels, and Activities across India Database
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
                  Origin Hub
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
                  Destination
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

          {/* Segments Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold font-display text-text-primary">
                  Journey Timeline Segments ({currentTrip.segments.length})
                </h4>
                <p className="text-[11px] text-text-muted">
                  Multimodal sequence powering live telemetry & recovery cascading
                </p>
              </div>

              {!isAddingNew && (
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(true);
                    setSearchOrigin(tripOrigin);
                    setSearchDestination(tripDestination);
                    setHotelSearchCity(tripDestination || 'Goa');
                    setActivitySearchCity(tripDestination || 'Goa');
                    setSearchResults([]);
                    setHotelSearchResults([]);
                    setActivitySearchResults([]);
                    setHasSearched(false);
                    setHasSearchedHotels(false);
                    setHasSearchedActivities(false);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold font-mono shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add New Leg</span>
                </button>
              )}
            </div>

            {/* Segment Addition Panel */}
            {isAddingNew && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-900/15 space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                    <span className="text-xs font-bold text-amber-900 font-mono uppercase tracking-wider">
                      Configure New Journey Leg
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="text-text-muted hover:text-text-primary text-xs font-mono"
                  >
                    Cancel
                  </button>
                </div>

                {/* Segment Type Selector */}
                <div className="grid grid-cols-5 gap-2">
                  {(['TRAIN', 'BUS', 'FLIGHT', 'HOTEL', 'ACTIVITY'] as TransportType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setSegmentType(type);
                        setSearchResults([]);
                        setHotelSearchResults([]);
                        setActivitySearchResults([]);
                        setHasSearched(false);
                        setHasSearchedHotels(false);
                        setHasSearchedActivities(false);
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-mono font-bold flex flex-col items-center justify-center gap-1 border transition-all ${
                        segmentType === type
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-white text-text-secondary border-border hover:border-amber-400'
                      }`}
                    >
                      {type === 'TRAIN' && <Train className="w-4 h-4" />}
                      {type === 'BUS' && <Bus className="w-4 h-4" />}
                      {type === 'FLIGHT' && <Plane className="w-4 h-4" />}
                      {type === 'HOTEL' && <Building2 className="w-4 h-4" />}
                      {type === 'ACTIVITY' && <Ticket className="w-4 h-4" />}
                      <span className="text-[10px]">{type}</span>
                    </button>
                  ))}
                </div>

                {/* Search / Form for Selected Type */}
                {isTransportType ? (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-white border border-amber-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-amber-900 font-mono flex items-center gap-2">
                          <Search className="w-3.5 h-3.5 text-amber-600" />
                          <span>Search {segmentType === 'TRAIN' ? 'Train Services' : segmentType === 'BUS' ? 'Bus Routes' : 'Flight Routes'}</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          🟢 Scheduled Service
                        </span>
                      </div>

                      <form onSubmit={handleSearchTransport} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="text-[10px] font-mono font-bold text-text-secondary uppercase">
                              Service / Number (Optional)
                            </label>
                            <input
                              type="text"
                              placeholder={segmentType === 'TRAIN' ? 'e.g. 10103 or Mandovi' : segmentType === 'BUS' ? 'e.g. KSRTC Airavat' : 'e.g. 6E-3001 or IndiGo'}
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
                              placeholder="e.g. Panvel Junction"
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
                              placeholder="e.g. Chiplun"
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

                    {/* Transport Results Container */}
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
                                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                                      🟢 Scheduled Service
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
                  /* Hotel Search / Manual Section */
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-amber-900/10 pb-2">
                      <button
                        type="button"
                        onClick={() => setHotelInputMode('search')}
                        className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                          hotelInputMode === 'search'
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'text-text-secondary hover:bg-amber-100/50'
                        }`}
                      >
                        🔍 Search Hotel Database
                      </button>
                      <button
                        type="button"
                        onClick={() => setHotelInputMode('manual')}
                        className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                          hotelInputMode === 'manual'
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'text-text-secondary hover:bg-amber-100/50'
                        }`}
                      >
                        ✏️ Custom Entry
                      </button>
                    </div>

                    {hotelInputMode === 'search' ? (
                      <div className="space-y-3">
                        <form onSubmit={(e) => handleSearchHotels(e)} className="p-3.5 rounded-2xl bg-white border border-amber-200 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-mono font-bold text-text-secondary uppercase">
                                City / Destination
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Goa, Mumbai, Pune, Jaipur"
                                value={hotelSearchCity}
                                onChange={(e) => setHotelSearchCity(e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg bg-surface-lowest border border-border text-xs text-text-primary focus:outline-none focus:border-amber-600 font-mono"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-mono font-bold text-text-secondary uppercase">
                                Category Filter
                              </label>
                              <select
                                value={hotelSearchCategory}
                                onChange={(e) => setHotelSearchCategory(e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg bg-surface-lowest border border-border text-xs text-text-primary focus:outline-none focus:border-amber-600 font-mono"
                              >
                                <option value="">All Categories</option>
                                <option value="LUXURY">Luxury Palace</option>
                                <option value="RESORT">Beach & Spa Resort</option>
                                <option value="PREMIUM">Premium Suites</option>
                                <option value="MID_RANGE">Mid-Range Boutique</option>
                                <option value="BUDGET">Budget Comfort</option>
                              </select>
                            </div>
                          </div>

                          {/* Quick Destination Chips */}
                          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5">
                            <span className="text-[10px] font-mono text-text-muted uppercase font-bold flex-shrink-0">
                              Popular:
                            </span>
                            {popularQuickDestinations.map(city => (
                              <button
                                key={city}
                                type="button"
                                onClick={() => {
                                  setHotelSearchCity(city);
                                  handleSearchHotels(undefined, city);
                                }}
                                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors flex-shrink-0"
                              >
                                {city}
                              </button>
                            ))}
                          </div>

                          <div className="flex justify-end pt-1">
                            <button
                              type="submit"
                              disabled={isSearchingHotels}
                              className="px-5 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold font-mono shadow-sm flex items-center gap-2"
                            >
                              {isSearchingHotels ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  <span>Searching Database...</span>
                                </>
                              ) : (
                                <>
                                  <Search className="w-3.5 h-3.5" />
                                  <span>Search Hotels</span>
                                </>
                              )}
                            </button>
                          </div>
                        </form>

                        {/* Hotel Results List */}
                        {hasSearchedHotels && (
                          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                            <div className="text-xs font-bold text-text-primary font-mono flex items-center justify-between">
                              <span>Hotel Results ({hotelSearchResults.length}):</span>
                            </div>

                            {hotelSearchResults.length === 0 ? (
                              <div className="p-6 text-center rounded-2xl bg-white border border-amber-200 text-xs text-text-muted font-mono">
                                No hotels found for this query. Try searching by city name.
                              </div>
                            ) : (
                              hotelSearchResults.map((hotel) => (
                                <div
                                  key={hotel.id}
                                  className="p-3.5 rounded-2xl bg-white border border-amber-900/10 hover:border-amber-400 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                                >
                                  <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-2">
                                      <h5 className="text-xs font-bold text-text-primary font-display">
                                        {hotel.hotelName}
                                      </h5>
                                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                                        {hotel.category}
                                      </span>
                                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 font-mono">
                                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                        <span>{hotel.rating}</span>
                                      </div>
                                    </div>
                                    <p className="text-[11px] text-text-muted font-mono">{hotel.address || hotel.area}</p>
                                    <div className="text-[11px] font-mono text-text-secondary">
                                      Amenities: {hotel.amenities.slice(0, 4).join(', ')}
                                    </div>
                                    <div className="text-[11px] font-mono text-amber-800 font-bold">
                                      ₹{hotel.pricePerNight} / night • Check-in: {hotel.checkInTime}
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleSelectHotel(hotel)}
                                    className="px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold font-mono shadow-sm flex items-center justify-center gap-1.5 flex-shrink-0"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>+ Add to Journey</span>
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Hotel Manual Form */
                      <form onSubmit={handleAddHotelManualSubmit} className="space-y-3 p-3 rounded-xl bg-white border border-amber-200">
                        <div className="text-xs font-bold text-amber-900 font-mono">
                          🏨 Hotel Custom Details
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
                    )}
                  </div>
                ) : (
                  /* Activity Search / Manual Section */
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-amber-900/10 pb-2">
                      <button
                        type="button"
                        onClick={() => setActivityInputMode('search')}
                        className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                          activityInputMode === 'search'
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'text-text-secondary hover:bg-amber-100/50'
                        }`}
                      >
                        🔍 Search Activity Database
                      </button>
                      <button
                        type="button"
                        onClick={() => setActivityInputMode('manual')}
                        className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                          activityInputMode === 'manual'
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'text-text-secondary hover:bg-amber-100/50'
                        }`}
                      >
                        ✏️ Custom Entry
                      </button>
                    </div>

                    {activityInputMode === 'search' ? (
                      <div className="space-y-3">
                        <form onSubmit={(e) => handleSearchActivities(e)} className="p-3.5 rounded-2xl bg-white border border-amber-200 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-mono font-bold text-text-secondary uppercase">
                                City / Location
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Goa, Mumbai, Rishikesh, Jaipur"
                                value={activitySearchCity}
                                onChange={(e) => setActivitySearchCity(e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg bg-surface-lowest border border-border text-xs text-text-primary focus:outline-none focus:border-amber-600 font-mono"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-mono font-bold text-text-secondary uppercase">
                                Theme Filter
                              </label>
                              <select
                                value={activitySearchCategory}
                                onChange={(e) => setActivitySearchCategory(e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg bg-surface-lowest border border-border text-xs text-text-primary focus:outline-none focus:border-amber-600 font-mono"
                              >
                                <option value="">All Categories</option>
                                <option value="BEACH">Beach & Watersports</option>
                                <option value="ADVENTURE">Adventure & Trekking</option>
                                <option value="FOOD">Food & Gastronomy</option>
                                <option value="CULTURAL">Cultural & Heritage</option>
                                <option value="NATURE">Nature & Safari</option>
                                <option value="SIGHTSEEING">City Sightseeing</option>
                              </select>
                            </div>
                          </div>

                          {/* Quick Destination Chips */}
                          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5">
                            <span className="text-[10px] font-mono text-text-muted uppercase font-bold flex-shrink-0">
                              Popular:
                            </span>
                            {popularQuickDestinations.map(city => (
                              <button
                                key={city}
                                type="button"
                                onClick={() => {
                                  setActivitySearchCity(city);
                                  handleSearchActivities(undefined, city);
                                }}
                                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors flex-shrink-0"
                              >
                                {city}
                              </button>
                            ))}
                          </div>

                          <div className="flex justify-end pt-1">
                            <button
                              type="submit"
                              disabled={isSearchingActivities}
                              className="px-5 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold font-mono shadow-sm flex items-center gap-2"
                            >
                              {isSearchingActivities ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  <span>Searching Database...</span>
                                </>
                              ) : (
                                <>
                                  <Search className="w-3.5 h-3.5" />
                                  <span>Search Activities</span>
                                </>
                              )}
                            </button>
                          </div>
                        </form>

                        {/* Activity Results List */}
                        {hasSearchedActivities && (
                          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                            <div className="text-xs font-bold text-text-primary font-mono flex items-center justify-between">
                              <span>Activity Results ({activitySearchResults.length}):</span>
                            </div>

                            {activitySearchResults.length === 0 ? (
                              <div className="p-6 text-center rounded-2xl bg-white border border-amber-200 text-xs text-text-muted font-mono">
                                No activities found for this query. Try searching by city name.
                              </div>
                            ) : (
                              activitySearchResults.map((act) => (
                                <div
                                  key={act.id}
                                  className="p-3.5 rounded-2xl bg-white border border-amber-900/10 hover:border-amber-400 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                                >
                                  <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-2">
                                      <h5 className="text-xs font-bold text-text-primary font-display">
                                        {act.activityName}
                                      </h5>
                                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                                        {act.category}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-text-secondary">{act.description}</p>
                                    <div className="text-[11px] font-mono text-text-muted">
                                      Duration: {act.duration} • Best Time: {act.bestTime} • Start: {act.startTime}
                                    </div>
                                    <div className="text-[11px] font-mono text-amber-800 font-bold">
                                      ₹{act.price} / person
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleSelectActivity(act)}
                                    className="px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold font-mono shadow-sm flex items-center justify-center gap-1.5 flex-shrink-0"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>+ Add to Journey</span>
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Activity Manual Form */
                      <form onSubmit={handleAddActivityManualSubmit} className="space-y-3 p-3 rounded-xl bg-white border border-amber-200">
                        <div className="text-xs font-bold text-amber-900 font-mono">
                          🎟️ Activity Custom Details
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
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-amber-800">
                            #{idx + 1}
                          </span>
                          <span className="text-xs font-bold font-display text-text-primary">
                            {name}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-lowest border border-border text-text-muted">
                            {seg.type}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-text-muted flex items-center gap-2 mt-0.5">
                          {route && <span>{route}</span>}
                          {time && <span>• {time}</span>}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeTripSegment(seg.id)}
                      className="p-2 rounded-xl text-text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove Leg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-amber-900/10 bg-surface-lowest/70 flex items-center justify-between flex-shrink-0">
          <button
            type="button"
            onClick={closeEditJourneyModal}
            className="px-4 py-2 rounded-xl text-xs font-mono text-text-secondary hover:text-text-primary"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveTripHeader}
            className="px-6 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold font-mono shadow-glow-cream flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            <span>Save & Persist Journey</span>
          </button>
        </div>

      </div>
    </div>
  );
};
