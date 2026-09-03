import {
  IFlightProvider,
  TransportSearchQuery,
  NormalizedTransportOption,
  NormalizedLiveStatus
} from '../interfaces/ITransportProvider';
import { Normalizer } from '../Normalizer';

// Airport city to IATA code map
const AIRPORT_IATA_MAP: Record<string, string> = {
  mumbai: 'BOM',
  'mumbai airport': 'BOM',
  bom: 'BOM',
  goa: 'GOI',
  'goa dabolim': 'GOI',
  'dabolim': 'GOI',
  'mopa': 'GOX',
  goi: 'GOI',
  gox: 'GOX',
  delhi: 'DEL',
  'new delhi': 'DEL',
  del: 'DEL',
  bangalore: 'BLR',
  'bengaluru': 'BLR',
  blr: 'BLR',
  pune: 'PNQ',
  pnq: 'PNQ',
  jaipur: 'JAI',
  jai: 'JAI',
  hyderabad: 'HYD',
  hyd: 'HYD',
  chennai: 'MAA',
  maa: 'MAA',
  kolkata: 'CCU',
  ccu: 'CCU'
};

function resolveIataCode(airportInput: string): string {
  const clean = airportInput.trim().toLowerCase();
  if (AIRPORT_IATA_MAP[clean]) return AIRPORT_IATA_MAP[clean];
  for (const [key, code] of Object.entries(AIRPORT_IATA_MAP)) {
    if (clean.includes(key)) return code;
  }
  if (/^[A-Za-z]{3}$/.test(airportInput.trim())) {
    return airportInput.trim().toUpperCase();
  }
  return airportInput.trim().toUpperCase();
}

export class RealFlightProvider implements IFlightProvider {
  private apiKey: string | undefined;
  private apiUrl: string;

  constructor(options?: { apiKey?: string; apiUrl?: string }) {
    this.apiKey = options?.apiKey || process.env.FLIGHT_API_KEY;
    this.apiUrl = options?.apiUrl || process.env.FLIGHT_API_URL || 'https://api.aviationstack.com/v1';
  }

  public getProviderName(): string {
    return 'AviationStack Live Flight API';
  }

  public isReal(): boolean {
    return true;
  }

  public async searchFlights(query: TransportSearchQuery): Promise<NormalizedTransportOption[]> {
    if (!this.apiKey) {
      throw new Error(
        `[RealFlightProvider] Configuration Error: FLIGHT_API_KEY is not configured on the server. Please provide FLIGHT_API_KEY in .env or switch FLIGHT_PROVIDER=mock.`
      );
    }

    const startTime = Date.now();
    const depIata = resolveIataCode(query.origin);
    const arrIata = resolveIataCode(query.destination);
    const travelDate = query.date || new Date().toISOString().split('T')[0];

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const url = `${this.apiUrl}/flights?access_key=${this.apiKey}&dep_iata=${encodeURIComponent(depIata)}&arr_iata=${encodeURIComponent(arrIata)}&flight_date=${encodeURIComponent(travelDate)}`;
      console.log(`[RealFlightProvider] Requesting live flight search: ${depIata} -> ${arrIata} on ${travelDate}`);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      const durationMs = Date.now() - startTime;

      if (res.status === 401 || res.status === 403) {
        throw new Error(`[RealFlightProvider] Authentication failed (HTTP ${res.status}). Verify FLIGHT_API_KEY.`);
      }
      if (res.status === 429) {
        throw new Error(`[RealFlightProvider] Rate limit exceeded on flight API (HTTP 429).`);
      }
      if (!res.ok) {
        throw new Error(`[RealFlightProvider] Flight provider error: HTTP ${res.status}`);
      }

      const json = await res.json();
      const items = Array.isArray(json.data) ? json.data : [];
      console.log(`[RealFlightProvider] Received ${items.length} real flight options in ${durationMs}ms`);

      let results = items.map((raw: any) =>
        Normalizer.normalizeFlightOption(
          {
            ...raw,
            departure_airport: raw.departure?.airport || query.origin,
            arrival_airport: raw.arrival?.airport || query.destination,
            airline_name: raw.airline?.name,
            flight_number: raw.flight?.iata || raw.flight?.number,
            departure_time: raw.departure?.scheduled,
            arrival_time: raw.arrival?.scheduled,
            date: travelDate
          },
          'REAL',
          this.getProviderName()
        )
      );

      const q = (query.query || query.serviceNumber || '').trim().toLowerCase();
      if (q) {
        results = results.filter(
          (f) =>
            f.serviceNumber.toLowerCase().includes(q) ||
            f.title.toLowerCase().includes(q) ||
            f.provider.toLowerCase().includes(q)
        );
      }

      return results;
    } catch (err: any) {
      console.error(`[RealFlightProvider] Flight search failed:`, err.message);
      throw err;
    }
  }

  public async getLiveStatus(flightNumber: string, date?: string): Promise<NormalizedLiveStatus> {
    if (!this.apiKey) {
      throw new Error(
        `[RealFlightProvider] Configuration Error: FLIGHT_API_KEY is not configured for flight live status.`
      );
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const travelDate = date || new Date().toISOString().split('T')[0];
      const url = `${this.apiUrl}/flights?access_key=${this.apiKey}&flight_iata=${encodeURIComponent(flightNumber)}&flight_date=${encodeURIComponent(travelDate)}`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`[RealFlightProvider] Flight live status error: HTTP ${res.status}`);
      }

      const json = await res.json();
      const item = Array.isArray(json.data) && json.data.length > 0 ? json.data[0] : null;
      if (!item) {
        throw new Error(`[RealFlightProvider] No flight live record found for ${flightNumber} on ${travelDate}.`);
      }

      const delayMinutes = parseInt(item.departure?.delay || '0', 10);
      return {
        serviceNumber: flightNumber,
        transportType: 'FLIGHT',
        status: item.flight_status === 'active' || item.flight_status === 'scheduled' ? 'ON_TIME' : item.flight_status === 'cancelled' ? 'CANCELLED' : 'DELAYED',
        delayMinutes,
        scheduledDeparture: item.departure?.scheduled || '8:00 PM',
        scheduledArrival: item.arrival?.scheduled || '9:30 PM',
        expectedDeparture: item.departure?.estimated || item.departure?.scheduled || '8:00 PM',
        expectedArrival: item.arrival?.estimated || item.arrival?.scheduled || '9:30 PM',
        currentLocation: item.departure?.airport || 'En Route',
        nextStop: item.arrival?.airport,
        platformOrBay: item.departure?.gate ? `Gate ${item.departure?.gate}` : undefined,
        speedKmh: undefined,
        lastPing: 'Just now',
        lastUpdated: new Date().toISOString(),
        sourceType: 'REAL',
        sourceProvider: this.getProviderName(),
        rawPayload: item
      };
    } catch (err: any) {
      console.error(`[RealFlightProvider] Flight live status failed for ${flightNumber}:`, err.message);
      throw err;
    }
  }
}
