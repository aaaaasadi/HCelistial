export type TransportType = 'TRAIN' | 'BUS' | 'FLIGHT';

export type TransportOperationalStatus = 'ON_TIME' | 'DELAYED' | 'CANCELLED' | 'DIVERTED' | 'SCHEDULED';

export type AvailabilityStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'UNKNOWN';

export interface TransportSearchQuery {
  origin: string;
  destination: string;
  date?: string; // YYYY-MM-DD
  time?: string;
  passengers?: number;
}

export interface NormalizedTransportOption {
  id: string;
  type: TransportType;
  provider: string;
  serviceNumber: string;
  title: string;
  origin: string;
  destination: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  expectedDeparture: string;
  expectedArrival: string;
  status: TransportOperationalStatus;
  delayMinutes: number;
  fareRupees: number;
  availableSeats: number | null; // null if provider doesn't report seat counts
  availabilityStatus: AvailabilityStatus;
  terminalDistanceMinsFromStation: number;
  platformOrTerminal?: string;
  seatOrClass?: string;
  sourceType: 'REAL' | 'MOCK';
  sourceProvider: string;
  notes?: string;
  rawPayload?: any;
}

export interface NormalizedLiveStatus {
  serviceNumber: string;
  transportType: TransportType;
  status: TransportOperationalStatus;
  delayMinutes: number;
  scheduledDeparture: string;
  scheduledArrival: string;
  expectedDeparture: string;
  expectedArrival: string;
  currentLocation?: string;
  nextStop?: string;
  platformOrBay?: string;
  speedKmh?: number;
  lastPing: string;
  reason?: string;
  sourceType: 'REAL' | 'MOCK';
  sourceProvider: string;
  rawPayload?: any;
}

export interface ITrainProvider {
  searchTrains(query: TransportSearchQuery): Promise<NormalizedTransportOption[]>;
  getLiveStatus(trainNumber: string, date?: string): Promise<NormalizedLiveStatus>;
  getProviderName(): string;
  isReal(): boolean;
}

export interface IBusProvider {
  searchBuses(query: TransportSearchQuery): Promise<NormalizedTransportOption[]>;
  getLiveStatus(serviceNumber: string, date?: string): Promise<NormalizedLiveStatus>;
  getProviderName(): string;
  isReal(): boolean;
}

export interface IFlightProvider {
  searchFlights(query: TransportSearchQuery): Promise<NormalizedTransportOption[]>;
  getLiveStatus(flightNumber: string, date?: string): Promise<NormalizedLiveStatus>;
  getProviderName(): string;
  isReal(): boolean;
}
