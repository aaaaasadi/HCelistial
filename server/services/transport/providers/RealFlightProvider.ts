import {
  IFlightProvider,
  TransportSearchQuery,
  NormalizedTransportOption,
  NormalizedLiveStatus
} from '../interfaces/ITransportProvider';
import { Normalizer } from '../Normalizer';
import { MockFlightProvider } from './MockFlightProvider';

export class RealFlightProvider implements IFlightProvider {
  private apiKey: string | undefined;
  private apiUrl: string;
  private fallbackProvider: MockFlightProvider;
  private allowFallback: boolean;

  constructor(options?: { apiKey?: string; apiUrl?: string; allowFallback?: boolean }) {
    this.apiKey = options?.apiKey || process.env.FLIGHT_API_KEY;
    this.apiUrl = options?.apiUrl || process.env.FLIGHT_API_URL || 'https://api.aviationstack.com/v1';
    this.allowFallback = options?.allowFallback ?? (process.env.TRANSPORT_FALLBACK_TO_MOCK !== 'false');
    this.fallbackProvider = new MockFlightProvider();
  }

  public getProviderName(): string {
    return 'AviationStack Live Flight API';
  }

  public isReal(): boolean {
    return true;
  }

  public async searchFlights(query: TransportSearchQuery): Promise<NormalizedTransportOption[]> {
    if (!this.apiKey) {
      if (this.allowFallback) {
        console.warn(`[RealFlightProvider] Missing FLIGHT_API_KEY. Falling back to mock flight search.`);
        return this.fallbackProvider.searchFlights(query);
      }
      throw new Error(`[RealFlightProvider] Authentication failed: FLIGHT_API_KEY is not configured.`);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const url = `${this.apiUrl}/flights?access_key=${this.apiKey}&dep_iata=${encodeURIComponent(query.origin)}&arr_iata=${encodeURIComponent(query.destination)}`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.status === 401 || res.status === 403) {
        throw new Error(`[RealFlightProvider] Authentication failed (HTTP ${res.status}). Check FLIGHT_API_KEY.`);
      }
      if (res.status === 429) {
        throw new Error(`[RealFlightProvider] Rate limit exceeded on flight API (HTTP 429).`);
      }
      if (!res.ok) {
        throw new Error(`[RealFlightProvider] Flight provider error: HTTP ${res.status}`);
      }

      const json = await res.json();
      const items = Array.isArray(json.data) ? json.data : [];
      return items.map((raw: any) => Normalizer.normalizeFlightOption(raw, 'REAL', this.getProviderName()));
    } catch (err: any) {
      if (this.allowFallback) {
        console.warn(`[RealFlightProvider] Flight search failed (${err.message}). Falling back to mock flight provider.`);
        return this.fallbackProvider.searchFlights(query);
      }
      throw err;
    }
  }

  public async getLiveStatus(flightNumber: string, date?: string): Promise<NormalizedLiveStatus> {
    if (!this.apiKey) {
      if (this.allowFallback) {
        console.warn(`[RealFlightProvider] Missing FLIGHT_API_KEY. Falling back to mock flight status for ${flightNumber}.`);
        return this.fallbackProvider.getLiveStatus(flightNumber, date);
      }
      throw new Error(`[RealFlightProvider] Authentication failed: FLIGHT_API_KEY is not configured.`);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const url = `${this.apiUrl}/flights?access_key=${this.apiKey}&flight_iata=${encodeURIComponent(flightNumber)}`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.status === 401 || res.status === 403) {
        throw new Error(`[RealFlightProvider] Authentication failed (HTTP ${res.status}). Check FLIGHT_API_KEY.`);
      }
      if (res.status === 429) {
        throw new Error(`[RealFlightProvider] Rate limit exceeded on flight API (HTTP 429).`);
      }
      if (!res.ok) {
        throw new Error(`[RealFlightProvider] Flight live status error: HTTP ${res.status}`);
      }

      const json = await res.json();
      const item = Array.isArray(json.data) && json.data.length > 0 ? json.data[0] : null;
      if (!item) {
        throw new Error(`[RealFlightProvider] No flight live status record found for ${flightNumber}.`);
      }

      const delayMinutes = item.departure?.delay || 0;
      return {
        serviceNumber: item.flight?.iata || flightNumber,
        transportType: 'FLIGHT',
        status: item.flight_status === 'cancelled' ? 'CANCELLED' : delayMinutes > 15 ? 'DELAYED' : 'ON_TIME',
        delayMinutes,
        scheduledDeparture: item.departure?.scheduled || '8:00 PM',
        scheduledArrival: item.arrival?.scheduled || '9:30 PM',
        expectedDeparture: item.departure?.estimated || item.departure?.scheduled || '8:00 PM',
        expectedArrival: item.arrival?.estimated || item.arrival?.scheduled || '9:30 PM',
        currentLocation: `${item.departure?.airport || 'Airport'} Terminal ${item.departure?.terminal || '2'} Gate ${item.departure?.gate || 'TBD'}`,
        platformOrBay: item.departure?.gate ? `Gate ${item.departure.gate}` : undefined,
        lastPing: 'Just now',
        sourceType: 'REAL',
        sourceProvider: this.getProviderName(),
        rawPayload: item
      };
    } catch (err: any) {
      if (this.allowFallback) {
        console.warn(`[RealFlightProvider] Flight status failed (${err.message}). Falling back to mock live status.`);
        return this.fallbackProvider.getLiveStatus(flightNumber, date);
      }
      throw err;
    }
  }
}
