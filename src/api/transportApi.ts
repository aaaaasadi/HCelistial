import { apiFetch } from './client';
import { JourneyBundleDTO } from '../../server/types/backendTypes';
import { NormalizedLiveStatus, NormalizedTransportOption } from '../../server/services/transport/interfaces/ITransportProvider';
import { SyntheticTravelDataset } from '../../server/services/dataset/syntheticDatasetGenerator';

// Client-side fallback generator for offline / GitHub Pages static mode using SyntheticTravelDataset
function generateClientMockTrains(params: { origin?: string; destination?: string; date?: string; query?: string }): NormalizedTransportOption[] {
  const orig = (params.origin || 'Panvel (PNVL)').trim();
  const dest = (params.destination || 'Chiplun (CHI)').trim();
  const date = params.date || '2026-09-10';
  const q = (params.query || '').toLowerCase().trim();

  const dataset = SyntheticTravelDataset.getInstance();
  const origLower = orig.toLowerCase();
  const destLower = dest.toLowerCase();

  let matched = dataset.trains.filter((t) => {
    const fromMatch =
      origLower.includes(t.originStationCode.toLowerCase()) ||
      t.originStationName.toLowerCase().includes(origLower) ||
      origLower.includes(t.originStationName.toLowerCase().split(' ')[0]);

    const toMatch =
      destLower.includes(t.destStationCode.toLowerCase()) ||
      t.destStationName.toLowerCase().includes(destLower) ||
      destLower.includes(t.destStationName.toLowerCase().split(' ')[0]);

    return fromMatch && toMatch;
  });

  if (matched.length === 0) {
    if (
      (origLower.includes('panvel') || origLower.includes('pnvl') || origLower.includes('mumbai') || origLower.includes('csmt')) &&
      (destLower.includes('chiplun') || destLower.includes('chi') || destLower.includes('ratnagiri') || destLower.includes('khed'))
    ) {
      matched = dataset.trains.filter(t => t.originStationCode === 'PNVL' && t.destStationCode === 'CHI');
    } else if (
      (origLower.includes('mumbai') || origLower.includes('csmt') || origLower.includes('dadar')) &&
      (destLower.includes('pune') || destLower.includes('pune jn'))
    ) {
      matched = dataset.trains.filter(t => t.originStationCode === 'CSMT' && t.destStationCode === 'PUNE');
    } else {
      matched = dataset.trains.slice(0, 8);
    }
  }

  let results: NormalizedTransportOption[] = matched.map((t) => ({
    id: `client-${t.id}`,
    type: 'TRAIN',
    provider: t.operator,
    serviceNumber: `${t.trainNumber} ${t.trainName}`,
    title: t.trainName,
    origin: orig,
    destination: dest,
    travelDate: date,
    scheduledDeparture: t.departureTime,
    scheduledArrival: t.arrivalTime,
    expectedDeparture: t.departureTime,
    expectedArrival: t.arrivalTime,
    duration: t.duration,
    status: t.status,
    delayMinutes: 0,
    fareRupees: t.fare,
    availableSeats: t.availableSeats,
    availabilityStatus: t.availableSeats > 0 ? 'AVAILABLE' : 'UNAVAILABLE',
    terminalDistanceMinsFromStation: 0,
    platformOrTerminal: t.platform,
    seatOrClass: t.classes,
    sourceType: 'MOCK',
    sourceProvider: 'Demo Railway Schedule Simulator (Mock)',
    lastUpdated: new Date().toISOString(),
    notes: `Demo synthetic railway schedule (${t.trainType})`
  }));

  if (q) {
    results = results.filter(
      (t) =>
        t.serviceNumber.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.provider.toLowerCase().includes(q)
    );
  }

  return results;
}

function generateClientMockBuses(params: { origin?: string; destination?: string; date?: string; query?: string }): NormalizedTransportOption[] {
  const orig = (params.origin || 'Pune Swargate').trim();
  const dest = (params.destination || 'Panaji (Goa)').trim();
  const date = params.date || '2026-09-10';
  const q = (params.query || '').toLowerCase().trim();

  const dataset = SyntheticTravelDataset.getInstance();
  const origLower = orig.toLowerCase();
  const destLower = dest.toLowerCase();

  let matched = dataset.buses.filter((b) => {
    const fromMatch =
      origLower.includes(b.originCity.toLowerCase()) ||
      b.originCity.toLowerCase().includes(origLower) ||
      origLower.includes(b.originTerminal.toLowerCase().split(' ')[0]);

    const toMatch =
      destLower.includes(b.destCity.toLowerCase()) ||
      b.destCity.toLowerCase().includes(destLower) ||
      destLower.includes(b.destTerminal.toLowerCase().split(' ')[0]);

    return fromMatch && toMatch;
  });

  if (matched.length === 0) {
    if (origLower.includes('pune') && (destLower.includes('goa') || destLower.includes('panaji') || destLower.includes('madgaon'))) {
      matched = dataset.buses.filter(b => b.originCity === 'Pune' && b.destCity.includes('Goa'));
    } else {
      matched = dataset.buses.slice(0, 8);
    }
  }

  let results: NormalizedTransportOption[] = matched.map((b) => ({
    id: `client-${b.id}`,
    type: 'BUS',
    provider: b.operator,
    serviceNumber: b.serviceNumber,
    title: `${b.operator} (${b.busType})`,
    origin: orig,
    destination: dest,
    travelDate: date,
    scheduledDeparture: b.departureTime,
    scheduledArrival: b.arrivalTime,
    expectedDeparture: b.departureTime,
    expectedArrival: b.arrivalTime,
    duration: b.duration,
    status: b.status,
    delayMinutes: 0,
    fareRupees: b.fare,
    availableSeats: b.availableSeats,
    availabilityStatus: b.availableSeats > 0 ? 'AVAILABLE' : 'UNAVAILABLE',
    terminalDistanceMinsFromStation: 15,
    platformOrTerminal: b.bay,
    seatOrClass: b.busType,
    sourceType: 'MOCK',
    sourceProvider: 'Demo Bus Network Simulator (Mock)',
    lastUpdated: new Date().toISOString(),
    notes: b.amenities
  }));

  if (q) {
    results = results.filter(
      (b) =>
        b.serviceNumber.toLowerCase().includes(q) ||
        b.title.toLowerCase().includes(q) ||
        b.provider.toLowerCase().includes(q)
    );
  }

  return results;
}

function generateClientMockFlights(params: { origin?: string; destination?: string; date?: string; query?: string }): NormalizedTransportOption[] {
  const orig = (params.origin || 'BOM (Mumbai)').trim();
  const dest = (params.destination || 'GOI (Goa Dabolim)').trim();
  const date = params.date || '2026-09-10';
  const q = (params.query || '').toLowerCase().trim();

  const dataset = SyntheticTravelDataset.getInstance();
  const origLower = orig.toLowerCase();
  const destLower = dest.toLowerCase();

  let matched = dataset.flights.filter((f) => {
    const fromMatch =
      origLower.includes(f.originAirportCode.toLowerCase()) ||
      f.originCity.toLowerCase().includes(origLower) ||
      origLower.includes(f.originCity.toLowerCase());

    const toMatch =
      destLower.includes(f.destAirportCode.toLowerCase()) ||
      f.destCity.toLowerCase().includes(destLower) ||
      destLower.includes(f.destCity.toLowerCase());

    return fromMatch && toMatch;
  });

  if (matched.length === 0) {
    if ((origLower.includes('mumbai') || origLower.includes('bom')) && (destLower.includes('goa') || destLower.includes('goi') || destLower.includes('gox'))) {
      matched = dataset.flights.filter(f => f.originAirportCode === 'BOM' && f.destAirportCode === 'GOI');
    } else {
      matched = dataset.flights.slice(0, 8);
    }
  }

  let results: NormalizedTransportOption[] = matched.map((f) => ({
    id: `client-${f.id}`,
    type: 'FLIGHT',
    provider: f.airline,
    serviceNumber: `${f.flightNumber} (${f.aircraft})`,
    title: `${f.airline} Flight ${f.flightNumber}`,
    origin: orig,
    destination: dest,
    travelDate: date,
    scheduledDeparture: f.departureTime,
    scheduledArrival: f.arrivalTime,
    expectedDeparture: f.departureTime,
    expectedArrival: f.arrivalTime,
    duration: f.duration,
    status: f.status,
    delayMinutes: 0,
    fareRupees: f.fare,
    availableSeats: f.availableSeats,
    availabilityStatus: f.availableSeats > 0 ? 'AVAILABLE' : 'UNAVAILABLE',
    terminalDistanceMinsFromStation: 35,
    platformOrTerminal: `${f.terminal} (${f.gate})`,
    seatOrClass: f.seatClass,
    sourceType: 'MOCK',
    sourceProvider: 'Demo Airline Flight Simulator (Mock)',
    lastUpdated: new Date().toISOString(),
    notes: `Scheduled domestic commercial route (${f.aircraft})`
  }));

  if (q) {
    results = results.filter(
      (f) =>
        f.serviceNumber.toLowerCase().includes(q) ||
        f.title.toLowerCase().includes(q) ||
        f.provider.toLowerCase().includes(q)
    );
  }

  return results;
}

export const transportApi = {
  async searchTrains(params: { origin?: string; destination?: string; date?: string; query?: string }): Promise<{ count: number; data: NormalizedTransportOption[] }> {
    try {
      const cleanParams: Record<string, string> = {};
      if (params.origin) cleanParams.origin = params.origin;
      if (params.destination) cleanParams.destination = params.destination;
      if (params.date) cleanParams.date = params.date;
      if (params.query) cleanParams.query = params.query;

      const qs = new URLSearchParams(cleanParams).toString();
      const res = await apiFetch<{ success: boolean; count: number; data: NormalizedTransportOption[] }>(`/transport/trains/search?${qs}`);
      if (res && Array.isArray(res.data) && res.data.length > 0) {
        return { count: res.data.length, data: res.data };
      }
      const fallback = generateClientMockTrains(params);
      return { count: fallback.length, data: fallback };
    } catch (err: any) {
      console.warn('[transportApi] Backend search failed or offline, falling back to synthetic dataset:', err.message);
      const fallback = generateClientMockTrains(params);
      return { count: fallback.length, data: fallback };
    }
  },

  async searchBuses(params: { origin?: string; destination?: string; date?: string; query?: string }): Promise<{ count: number; data: NormalizedTransportOption[] }> {
    try {
      const cleanParams: Record<string, string> = {};
      if (params.origin) cleanParams.origin = params.origin;
      if (params.destination) cleanParams.destination = params.destination;
      if (params.date) cleanParams.date = params.date;
      if (params.query) cleanParams.query = params.query;

      const qs = new URLSearchParams(cleanParams).toString();
      const res = await apiFetch<{ success: boolean; count: number; data: NormalizedTransportOption[] }>(`/transport/buses/search?${qs}`);
      if (res && Array.isArray(res.data) && res.data.length > 0) {
        return { count: res.data.length, data: res.data };
      }
      const fallback = generateClientMockBuses(params);
      return { count: fallback.length, data: fallback };
    } catch (err: any) {
      console.warn('[transportApi] Backend search failed or offline, falling back to synthetic dataset:', err.message);
      const fallback = generateClientMockBuses(params);
      return { count: fallback.length, data: fallback };
    }
  },

  async searchFlights(params: { origin?: string; destination?: string; date?: string; query?: string }): Promise<{ count: number; data: NormalizedTransportOption[] }> {
    try {
      const cleanParams: Record<string, string> = {};
      if (params.origin) cleanParams.origin = params.origin;
      if (params.destination) cleanParams.destination = params.destination;
      if (params.date) cleanParams.date = params.date;
      if (params.query) cleanParams.query = params.query;

      const qs = new URLSearchParams(cleanParams).toString();
      const res = await apiFetch<{ success: boolean; count: number; data: NormalizedTransportOption[] }>(`/transport/flights/search?${qs}`);
      if (res && Array.isArray(res.data) && res.data.length > 0) {
        return { count: res.data.length, data: res.data };
      }
      const fallback = generateClientMockFlights(params);
      return { count: fallback.length, data: fallback };
    } catch (err: any) {
      console.warn('[transportApi] Backend search failed or offline, falling back to synthetic dataset:', err.message);
      const fallback = generateClientMockFlights(params);
      return { count: fallback.length, data: fallback };
    }
  },

  async getLiveStatus(type: string, serviceNumber: string): Promise<{ success: boolean; data: NormalizedLiveStatus }> {
    return apiFetch(`/transport/${type}/${encodeURIComponent(serviceNumber)}/status`);
  },

  async syncTripTelemetry(tripId: string): Promise<{ success: boolean; message: string; data: JourneyBundleDTO }> {
    return apiFetch(`/transport/sync/${encodeURIComponent(tripId)}`, {
      method: 'POST'
    });
  }
};
