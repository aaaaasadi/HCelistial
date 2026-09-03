import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Search,
  Compass,
  Star,
  Calendar,
  Building,
  Sparkles,
  ArrowRight,
  Filter,
  Palmtree,
  Mountain,
  Landmark,
  Shield,
  Clock,
  Tag,
  DollarSign,
  Plus,
  CheckCircle2,
  X
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { destinationApi } from '../../api/destinationApi';
import {
  SyntheticCity,
  PopularJourney,
  SyntheticHotel,
  SyntheticActivity
} from '../../../server/services/dataset/syntheticDatasetGenerator';

export const DestinationExplorerView: React.FC = () => {
  const { setCurrentTab, openEditJourneyModal, updateTripDetails } = useDemo();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [destinations, setDestinations] = useState<SyntheticCity[]>([]);
  const [popularJourneys, setPopularJourneys] = useState<PopularJourney[]>([]);
  const [selectedCity, setSelectedCity] = useState<SyntheticCity | null>(null);
  const [cityHotels, setCityHotels] = useState<SyntheticHotel[]>([]);
  const [cityActivities, setCityActivities] = useState<SyntheticActivity[]>([]);
  const [cityJourneys, setCityJourneys] = useState<PopularJourney[]>([]);
  const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'hotels' | 'activities' | 'corridors'>('overview');

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedRegion, selectedType]);

  const loadData = async () => {
    const res = await destinationApi.getDestinations({
      query: searchQuery || undefined,
      region: selectedRegion !== 'All' ? selectedRegion : undefined,
      type: selectedType !== 'All' ? selectedType : undefined
    });
    setDestinations(res.data);

    const jRes = await destinationApi.getPopularJourneys();
    setPopularJourneys(jRes.data);
  };

  const handleOpenCity = async (city: SyntheticCity) => {
    setSelectedCity(city);
    setActiveDetailTab('overview');
    const details = await destinationApi.getDestinationDetails(city.id);
    setCityHotels(details.popularHotels);
    setCityActivities(details.popularActivities);
    setCityJourneys(details.popularJourneys);
  };

  const handlePlanJourney = (origin: string, dest: string, title?: string) => {
    updateTripDetails(title || `${origin} → ${dest} Expedition`, origin, dest);
    setSelectedCity(null);
    openEditJourneyModal();
  };

  const regions = ['All', 'West', 'North', 'South', 'East', 'Central'];
  const types = ['All', 'BEACH', 'HERITAGE', 'HILL_STATION', 'METRO', 'ADVENTURE', 'SPIRITUAL', 'NATURE'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="hud-card p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-amber-50/40 to-amber-100/30 border border-amber-900/10 shadow-glass-warm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 font-mono text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
            <span>Discover India Travel Corridors</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-text-primary tracking-tight">
            Explore Destinations & Popular Journeys
          </h1>
          <p className="text-xs sm:text-sm text-text-muted max-w-2xl">
            Browse 120+ Indian tourism hubs, verified multimodal transport corridors, curated hotels, and experiences with full disruption resilience.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search Goa, Mumbai, Jaipur, Manali..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-border text-xs font-mono text-text-primary focus:outline-none focus:border-amber-600 shadow-sm"
          />
        </div>
      </div>

      {/* Featured Popular Corridors Carousel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h2 className="text-base font-bold font-display text-text-primary">
              Popular Multimodal Travel Corridors
            </h2>
          </div>
          <span className="text-[11px] font-mono text-text-muted">
            Click any route to plan
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularJourneys.slice(0, 4).map((j) => (
            <div
              key={j.id}
              onClick={() => handlePlanJourney(j.originCityName, j.destCityName, j.title)}
              className="p-4 rounded-2xl bg-white border border-amber-900/10 hover:border-amber-400 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    {j.travelStyle}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 font-mono">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{j.popularityScore}%</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold font-display text-text-primary group-hover:text-amber-700 transition-colors">
                  {j.title}
                </h3>
                <p className="text-xs text-text-muted line-clamp-2">
                  {j.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-border flex items-center justify-between text-xs font-mono">
                <span className="text-text-muted">Est. ₹{j.approximateBudget}</span>
                <span className="text-amber-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Plan Route <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Region & Type Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white/70 border border-amber-900/10 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold font-mono text-text-muted px-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Region:
          </span>
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all ${
                selectedRegion === reg
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-text-secondary hover:bg-amber-100/60'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-bold font-mono text-text-muted px-2">Theme:</span>
          {types.map((tp) => (
            <button
              key={tp}
              onClick={() => setSelectedType(tp)}
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all ${
                selectedType === tp
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'text-text-secondary hover:bg-amber-100/60'
              }`}
            >
              {tp === 'All' ? 'All Themes' : tp.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold font-display text-text-primary">
            Destinations ({destinations.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {destinations.map((city) => (
            <div
              key={city.id}
              className="p-5 rounded-3xl bg-white border border-amber-900/10 hover:border-amber-400 shadow-glass-warm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-amber-100 text-amber-800 font-bold">
                      {city.destinationType === 'BEACH' ? (
                        <Palmtree className="w-4 h-4" />
                      ) : city.destinationType === 'HILL_STATION' ? (
                        <Mountain className="w-4 h-4" />
                      ) : (
                        <Landmark className="w-4 h-4" />
                      )}
                    </span>
                    <div>
                      <h3 className="text-base font-bold font-display text-text-primary group-hover:text-amber-700 transition-colors">
                        {city.name}
                      </h3>
                      <p className="text-[11px] font-mono text-text-muted">{city.state} • {city.region} India</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 font-mono">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{city.popularityScore}/100</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                  {city.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {city.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-surface-lowest text-text-muted border border-border"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenCity(city)}
                  className="px-3.5 py-1.5 rounded-xl bg-surface-lowest hover:bg-amber-100/60 border border-border text-xs font-mono font-bold text-text-primary transition-all"
                >
                  Explore Details
                </button>

                <button
                  onClick={() => handlePlanJourney('Mumbai CSMT', city.name, `Trip to ${city.name}`)}
                  className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold font-mono shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <span>Plan Trip</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Destination Detail Modal */}
      {selectedCity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white border border-amber-900/15 rounded-3xl shadow-glass-warm overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-border bg-gradient-to-r from-amber-50/80 to-amber-100/40 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-200 text-amber-900">
                    {selectedCity.destinationType.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-mono text-text-muted">{selectedCity.state}</span>
                </div>
                <h2 className="text-2xl font-bold font-display text-text-primary">
                  {selectedCity.name}
                </h2>
              </div>

              <button
                onClick={() => setSelectedCity(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-amber-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tab Switcher */}
            <div className="px-6 py-2.5 border-b border-border bg-surface-lowest/60 flex items-center gap-2 overflow-x-auto text-xs font-mono font-bold">
              <button
                onClick={() => setActiveDetailTab('overview')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeDetailTab === 'overview'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveDetailTab('hotels')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeDetailTab === 'hotels'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Hotels ({cityHotels.length})
              </button>
              <button
                onClick={() => setActiveDetailTab('activities')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeDetailTab === 'activities'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Activities ({cityActivities.length})
              </button>
              <button
                onClick={() => setActiveDetailTab('corridors')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeDetailTab === 'corridors'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Corridors ({cityJourneys.length})
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5">
              {activeDetailTab === 'overview' && (
                <div className="space-y-4 text-xs font-mono">
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-900/10 space-y-2">
                    <h4 className="font-bold text-amber-900 uppercase tracking-wider text-[11px]">
                      Destination Overview
                    </h4>
                    <p className="text-text-secondary text-xs leading-relaxed font-sans">
                      {selectedCity.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-surface-lowest border border-border">
                      <div className="text-text-muted text-[10px] uppercase">Best Time to Visit</div>
                      <div className="font-bold text-text-primary mt-1">{selectedCity.bestTimeToVisit}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-lowest border border-border">
                      <div className="text-text-muted text-[10px] uppercase">Recommended Stay</div>
                      <div className="font-bold text-text-primary mt-1">{selectedCity.averageStayDays} Days</div>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-lowest border border-border">
                      <div className="text-text-muted text-[10px] uppercase">Budget Indicator</div>
                      <div className="font-bold text-text-primary mt-1">{selectedCity.budgetLevel}</div>
                    </div>
                  </div>
                </div>
              )}

              {activeDetailTab === 'hotels' && (
                <div className="space-y-3">
                  {cityHotels.map((h) => (
                    <div
                      key={h.id}
                      className="p-4 rounded-2xl bg-white border border-border hover:border-amber-400 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-text-primary font-display">{h.hotelName}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            ★ {h.rating} ({h.reviewCount} reviews)
                          </span>
                        </div>
                        <p className="text-[11px] text-text-muted font-mono">{h.address}</p>
                        <div className="text-[11px] font-mono text-text-secondary">
                          Amenities: {h.amenities.join(', ')}
                        </div>
                      </div>

                      <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                        <span className="text-sm font-bold text-amber-700 font-mono">₹{h.pricePerNight} <span className="text-[10px] text-text-muted font-normal">/ night</span></span>
                        <button
                          onClick={() => handlePlanJourney('Mumbai CSMT', selectedCity.name, `Trip to ${selectedCity.name} at ${h.hotelName}`)}
                          className="px-3 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold font-mono shadow-sm"
                        >
                          Book Hotel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeDetailTab === 'activities' && (
                <div className="space-y-3">
                  {cityActivities.map((a) => (
                    <div
                      key={a.id}
                      className="p-4 rounded-2xl bg-white border border-border hover:border-amber-400 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-text-primary font-display">{a.activityName}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                            {a.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-text-secondary">{a.description}</p>
                        <div className="text-[11px] font-mono text-text-muted">
                          Duration: {a.duration} • Best Time: {a.bestTime}
                        </div>
                      </div>

                      <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                        <span className="text-sm font-bold text-amber-700 font-mono">₹{a.price} <span className="text-[10px] text-text-muted font-normal">/ person</span></span>
                        <button
                          onClick={() => handlePlanJourney('Mumbai CSMT', selectedCity.name, `Trip to ${selectedCity.name} & ${a.activityName}`)}
                          className="px-3 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold font-mono shadow-sm"
                        >
                          Add Experience
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeDetailTab === 'corridors' && (
                <div className="space-y-3">
                  {cityJourneys.map((j) => (
                    <div
                      key={j.id}
                      className="p-4 rounded-2xl bg-white border border-border hover:border-amber-400 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs text-text-primary font-display">{j.title}</h4>
                        <p className="text-[11px] text-text-secondary">{j.description}</p>
                        <div className="text-[11px] font-mono text-text-muted">
                          Transport: {j.availableTransportTypes.join(', ')} • Est. {j.estimatedDuration}
                        </div>
                      </div>

                      <div className="text-right">
                        <button
                          onClick={() => handlePlanJourney(j.originCityName, j.destCityName, j.title)}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold font-mono shadow-sm"
                        >
                          Plan this Corridor
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-surface-lowest flex items-center justify-between">
              <span className="text-xs font-mono text-text-muted">
                Direct integration with Multimodal Disruption Recovery Engine
              </span>
              <button
                onClick={() => handlePlanJourney('Mumbai CSMT', selectedCity.name, `Trip to ${selectedCity.name}`)}
                className="px-5 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold font-mono shadow-glow-cream flex items-center gap-2"
              >
                <span>Plan Journey to {selectedCity.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
