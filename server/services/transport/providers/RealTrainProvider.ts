import {
  ITrainProvider,
  TransportSearchQuery,
  NormalizedTransportOption,
  NormalizedLiveStatus
} from '../interfaces/ITransportProvider';
import { Normalizer } from '../Normalizer';
import { MockTrainProvider } from './MockTrainProvider';

export class RealTrainProvider implements ITrainProvider {
  private apiKey: string | undefined;
  private apiUrl: string;
  private fallbackProvider: MockTrainProvider;
  private allowFallback: boolean;

  constructor(options?: { apiKey?: string; apiUrl?: string; allowFallback?: boolean }) {
    this.apiKey = options?.apiKey || process.env.TRAIN_API_KEY;
    this.apiUrl = options?.apiUrl || process.env.TRAIN_API_URL || 'https://railway-live-enquiry.p.rapidapi.com';
    this.allowFallback = options?.allowFallback ?? (process.env.TRANSPORT_FALLBACK_TO_MOCK !== 'false');
    this.fallbackProvider = new MockTrainProvider();
  }

  public getProviderName(): string {
    return 'Indian Railways Live RailAPI';
  }

  public isReal(): boolean {
    return true;
  }

  public async searchTrains(query: TransportSearchQuery): Promise<NormalizedTransportOption[]> {
    if (!this.apiKey) {
      if (this.allowFallback) {
        console.warn(`[RealTrainProvider] Missing TRAIN_API_KEY. Falling back to mock train search.`);
        return this.fallbackProvider.searchTrains(query);
      }
      throw new Error(`[RealTrainProvider] Authentication failed: TRAIN_API_KEY is not configured.`);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const url = `${this.apiUrl}/trains/betweenStations?from=${encodeURIComponent(query.origin)}&to=${encodeURIComponent(query.destination)}&date=${query.date || ''}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': new URL(this.apiUrl).host,
          'Accept': 'application/json'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.status === 401 || res.status === 403) {
        throw new Error(`[RealTrainProvider] Provider authentication failed (HTTP ${res.status}). Check TRAIN_API_KEY.`);
      }
      if (res.status === 429) {
        throw new Error(`[RealTrainProvider] Rate limit exceeded on train API (HTTP 429).`);
      }
      if (!res.ok) {
        throw new Error(`[RealTrainProvider] Train provider error: HTTP ${res.status}`);
      }

      const json = await res.json();
      if (!json || !Array.isArray(json.data)) {
        throw new Error(`[RealTrainProvider] Empty or malformed response structure.`);
      }

      return json.data.map((item: any) => ({
        id: `train-${item.train_number}`,
        type: 'TRAIN' as const,
        provider: 'Indian Railways',
        serviceNumber: `${item.train_number} ${item.train_name}`,
        title: item.train_name,
        origin: item.from_station_name || query.origin,
        destination: item.to_station_name || query.destination,
        scheduledDeparture: item.departure_time || '10:00 AM',
        scheduledArrival: item.arrival_time || '1:30 PM',
        expectedDeparture: item.departure_time || '10:00 AM',
        expectedArrival: item.arrival_time || '1:30 PM',
        status: 'ON_TIME' as const,
        delayMinutes: 0,
        fareRupees: item.fare ? parseInt(item.fare, 10) : 240,
        availableSeats: typeof item.available_seats === 'number' ? item.available_seats : null,
        availabilityStatus: typeof item.available_seats === 'number' && item.available_seats > 0 ? 'AVAILABLE' as const : 'UNKNOWN' as const,
        terminalDistanceMinsFromStation: 0,
        sourceType: 'REAL' as const,
        sourceProvider: this.getProviderName()
      }));
    } catch (err: any) {
      if (this.allowFallback) {
        console.warn(`[RealTrainProvider] Live call failed (${err.message}). Transparently falling back to mock provider.`);
        return this.fallbackProvider.searchTrains(query);
      }
      throw err;
    }
  }

  public async getLiveStatus(trainNumber: string, date?: string): Promise<NormalizedLiveStatus> {
    if (!this.apiKey) {
      if (this.allowFallback) {
        console.warn(`[RealTrainProvider] Missing TRAIN_API_KEY. Falling back to mock live status for train ${trainNumber}.`);
        return this.fallbackProvider.getLiveStatus(trainNumber, date);
      }
      throw new Error(`[RealTrainProvider] Authentication failed: TRAIN_API_KEY is not configured.`);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const url = `${this.apiUrl}/trains/${encodeURIComponent(trainNumber)}/live-status?date=${date || ''}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': new URL(this.apiUrl).host,
          'Accept': 'application/json'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.status === 401 || res.status === 403) {
        throw new Error(`[RealTrainProvider] Provider authentication failed (HTTP ${res.status}). Check TRAIN_API_KEY.`);
      }
      if (res.status === 429) {
        throw new Error(`[RealTrainProvider] Rate limit exceeded on train API (HTTP 429).`);
      }
      if (!res.ok) {
        throw new Error(`[RealTrainProvider] Train provider live status error: HTTP ${res.status}`);
      }

      const raw = await res.json();
      return Normalizer.normalizeTrainLiveStatus(raw.data || raw, trainNumber, 'REAL', this.getProviderName());
    } catch (err: any) {
      if (this.allowFallback) {
        console.warn(`[RealTrainProvider] Live status failed (${err.message}). Falling back to mock live status.`);
        return this.fallbackProvider.getLiveStatus(trainNumber, date);
      }
      throw err;
    }
  }
}
