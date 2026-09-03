import {
  IBusProvider,
  TransportSearchQuery,
  NormalizedTransportOption,
  NormalizedLiveStatus
} from '../interfaces/ITransportProvider';
import { Normalizer } from '../Normalizer';

export class RealBusProvider implements IBusProvider {
  private apiKey: string | undefined;
  private apiUrl: string;

  constructor(options?: { apiKey?: string; apiUrl?: string }) {
    this.apiKey = options?.apiKey || process.env.BUS_API_KEY;
    this.apiUrl = options?.apiUrl || process.env.BUS_API_URL || 'https://api.aopay.in/v1/bus';
  }

  public getProviderName(): string {
    return 'AOPAY Intercity Bus API';
  }

  public isReal(): boolean {
    return true;
  }

  public async searchBuses(query: TransportSearchQuery): Promise<NormalizedTransportOption[]> {
    if (!this.apiKey) {
      throw new Error(
        `[RealBusProvider] Configuration Error: BUS_API_KEY is not configured on the server. Please provide BUS_API_KEY in .env or switch BUS_PROVIDER=mock.`
      );
    }

    const startTime = Date.now();
    const travelDate = query.date || new Date().toISOString().split('T')[0];

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const url = `${this.apiUrl}/search?from=${encodeURIComponent(query.origin)}&to=${encodeURIComponent(query.destination)}&date=${encodeURIComponent(travelDate)}`;
      console.log(`[RealBusProvider] Requesting live bus search: ${query.origin} -> ${query.destination} for ${travelDate}`);

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const durationMs = Date.now() - startTime;

      if (res.status === 401 || res.status === 403) {
        throw new Error(`[RealBusProvider] Authentication failed (HTTP ${res.status}). Verify BUS_API_KEY.`);
      }
      if (res.status === 429) {
        throw new Error(`[RealBusProvider] Rate limit exceeded on bus API (HTTP 429).`);
      }
      if (!res.ok) {
        throw new Error(`[RealBusProvider] Bus provider error: HTTP ${res.status}`);
      }

      const json = await res.json();
      const items = Array.isArray(json.buses) ? json.buses : Array.isArray(json.data) ? json.data : [];
      console.log(`[RealBusProvider] Received ${items.length} real bus options in ${durationMs}ms`);

      let results = items.map((raw: any) =>
        Normalizer.normalizeBusOption(
          { ...raw, date: travelDate },
          'REAL',
          this.getProviderName()
        )
      );

      const q = (query.query || query.serviceNumber || '').trim().toLowerCase();
      if (q) {
        results = results.filter(
          (b) =>
            b.serviceNumber.toLowerCase().includes(q) ||
            b.title.toLowerCase().includes(q) ||
            b.provider.toLowerCase().includes(q)
        );
      }

      return results;
    } catch (err: any) {
      console.error(`[RealBusProvider] Bus search failed:`, err.message);
      throw err;
    }
  }

  public async getLiveStatus(serviceNumber: string, date?: string): Promise<NormalizedLiveStatus> {
    if (!this.apiKey) {
      throw new Error(
        `[RealBusProvider] Configuration Error: BUS_API_KEY is not configured for bus live tracking.`
      );
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const travelDate = date || new Date().toISOString().split('T')[0];
      const url = `${this.apiUrl}/track/${encodeURIComponent(serviceNumber)}?date=${encodeURIComponent(travelDate)}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`[RealBusProvider] Live bus tracking error: HTTP ${res.status}`);
      }

      const json = await res.json();
      const raw = json.data || json;
      return {
        serviceNumber,
        transportType: 'BUS',
        status: raw.status === 'DELAYED' ? 'DELAYED' : 'ON_TIME',
        delayMinutes: parseInt(raw.delay_minutes || '0', 10),
        scheduledDeparture: raw.scheduled_departure || '5:00 PM',
        scheduledArrival: raw.scheduled_arrival || '11:40 PM',
        expectedDeparture: raw.expected_departure || raw.scheduled_departure || '5:00 PM',
        expectedArrival: raw.expected_arrival || raw.scheduled_arrival || '11:40 PM',
        currentLocation: raw.current_location || raw.gps_location || 'En Route',
        nextStop: raw.next_stop,
        platformOrBay: raw.bay ? `Bay ${raw.bay}` : undefined,
        speedKmh: typeof raw.speed === 'number' ? raw.speed : undefined,
        lastPing: raw.last_ping || 'Just now',
        lastUpdated: new Date().toISOString(),
        sourceType: 'REAL',
        sourceProvider: this.getProviderName(),
        rawPayload: raw
      };
    } catch (err: any) {
      console.error(`[RealBusProvider] Live bus tracking failed for ${serviceNumber}:`, err.message);
      throw err;
    }
  }
}
