import {
  IBusProvider,
  TransportSearchQuery,
  NormalizedTransportOption,
  NormalizedLiveStatus
} from '../interfaces/ITransportProvider';
import { Normalizer } from '../Normalizer';
import { MockBusProvider } from './MockBusProvider';

export class RealBusProvider implements IBusProvider {
  private apiKey: string | undefined;
  private apiUrl: string;
  private fallbackProvider: MockBusProvider;
  private allowFallback: boolean;

  constructor(options?: { apiKey?: string; apiUrl?: string; allowFallback?: boolean }) {
    this.apiKey = options?.apiKey || process.env.BUS_API_KEY;
    this.apiUrl = options?.apiUrl || process.env.BUS_API_URL || 'https://api.aopay.in/v1/bus';
    this.allowFallback = options?.allowFallback ?? (process.env.TRANSPORT_FALLBACK_TO_MOCK !== 'false');
    this.fallbackProvider = new MockBusProvider();
  }

  public getProviderName(): string {
    return 'AOPAY Intercity Bus API';
  }

  public isReal(): boolean {
    return true;
  }

  public async searchBuses(query: TransportSearchQuery): Promise<NormalizedTransportOption[]> {
    if (!this.apiKey) {
      if (this.allowFallback) {
        console.warn(`[RealBusProvider] Missing BUS_API_KEY. Falling back to mock bus search.`);
        return this.fallbackProvider.searchBuses(query);
      }
      throw new Error(`[RealBusProvider] Authentication failed: BUS_API_KEY is not configured.`);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const url = `${this.apiUrl}/search?from=${encodeURIComponent(query.origin)}&to=${encodeURIComponent(query.destination)}&date=${query.date || ''}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.status === 401 || res.status === 403) {
        throw new Error(`[RealBusProvider] Authentication failed (HTTP ${res.status}). Check BUS_API_KEY.`);
      }
      if (res.status === 429) {
        throw new Error(`[RealBusProvider] Rate limit exceeded on bus API (HTTP 429).`);
      }
      if (!res.ok) {
        throw new Error(`[RealBusProvider] Bus provider error: HTTP ${res.status}`);
      }

      const json = await res.json();
      const items = Array.isArray(json.buses) ? json.buses : Array.isArray(json.data) ? json.data : [];
      return items.map((raw: any) => Normalizer.normalizeBusOption(raw, 'REAL', this.getProviderName()));
    } catch (err: any) {
      if (this.allowFallback) {
        console.warn(`[RealBusProvider] Bus search failed (${err.message}). Falling back to mock bus provider.`);
        return this.fallbackProvider.searchBuses(query);
      }
      throw err;
    }
  }

  public async getLiveStatus(serviceNumber: string, date?: string): Promise<NormalizedLiveStatus> {
    if (!this.apiKey) {
      if (this.allowFallback) {
        console.warn(`[RealBusProvider] Missing BUS_API_KEY. Falling back to mock bus status for ${serviceNumber}.`);
        return this.fallbackProvider.getLiveStatus(serviceNumber, date);
      }
      throw new Error(`[RealBusProvider] Authentication failed: BUS_API_KEY is not configured.`);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const url = `${this.apiUrl}/track/${encodeURIComponent(serviceNumber)}?date=${date || ''}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.status === 401 || res.status === 403) {
        throw new Error(`[RealBusProvider] Authentication failed (HTTP ${res.status}). Check BUS_API_KEY.`);
      }
      if (res.status === 429) {
        throw new Error(`[RealBusProvider] Rate limit exceeded on bus API (HTTP 429).`);
      }
      if (!res.ok) {
        throw new Error(`[RealBusProvider] Bus status error: HTTP ${res.status}`);
      }

      const raw = await res.json();
      return {
        serviceNumber: raw.service_number || serviceNumber,
        transportType: 'BUS',
        status: raw.is_cancelled ? 'CANCELLED' : raw.delay_minutes > 15 ? 'DELAYED' : 'ON_TIME',
        delayMinutes: raw.delay_minutes || 0,
        scheduledDeparture: raw.scheduled_departure || '5:00 PM',
        scheduledArrival: raw.scheduled_arrival || '11:00 PM',
        expectedDeparture: raw.expected_departure || '5:00 PM',
        expectedArrival: raw.expected_arrival || '11:00 PM',
        currentLocation: raw.current_location || 'En Route',
        platformOrBay: raw.bay || undefined,
        lastPing: raw.last_updated || 'Just now',
        reason: raw.delay_reason || undefined,
        sourceType: 'REAL',
        sourceProvider: this.getProviderName(),
        rawPayload: raw
      };
    } catch (err: any) {
      if (this.allowFallback) {
        console.warn(`[RealBusProvider] Bus tracking failed (${err.message}). Falling back to mock live status.`);
        return this.fallbackProvider.getLiveStatus(serviceNumber, date);
      }
      throw err;
    }
  }
}
