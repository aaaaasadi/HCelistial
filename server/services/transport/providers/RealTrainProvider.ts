import {
  ITrainProvider,
  TransportSearchQuery,
  NormalizedTransportOption,
  NormalizedLiveStatus
} from '../interfaces/ITransportProvider';
import { Normalizer } from '../Normalizer';

// Common station name to IRCTC station code dictionary helper
const STATION_CODE_MAP: Record<string, string> = {
  mumbai: 'CSMT',
  'mumbai csmt': 'CSMT',
  'mumbai central': 'BCT',
  'dadar': 'DR',
  'thaner': 'TNA',
  'lokmanya tilak': 'LTT',
  pune: 'PUNE',
  'pune junction': 'PUNE',
  'pune jn': 'PUNE',
  goa: 'MAO',
  'madgaon': 'MAO',
  'madgaon goa': 'MAO',
  'karmali': 'KRMI',
  'thivim': 'THVM',
  delhi: 'NDLS',
  'new delhi': 'NDLS',
  'hazrat nizamuddin': 'NZM',
  bangalore: 'SBC',
  'bengaluru': 'SBC',
  'yesvantpur': 'YPR',
  jaipur: 'JP',
  ahmedabad: 'ADI',
  hyderabad: 'HYB',
  secunderabad: 'SC',
  kolkata: 'HWH',
  howrah: 'HWH',
  chennai: 'MAS'
};

function resolveStationCode(stationInput: string): string {
  const clean = stationInput.trim().toLowerCase();
  if (STATION_CODE_MAP[clean]) return STATION_CODE_MAP[clean];
  for (const [key, code] of Object.entries(STATION_CODE_MAP)) {
    if (clean.includes(key)) return code;
  }
  // If 3-4 letters uppercase already, use as code
  if (/^[A-Za-z]{2,5}$/.test(stationInput.trim())) {
    return stationInput.trim().toUpperCase();
  }
  return stationInput.trim();
}

export class RealTrainProvider implements ITrainProvider {
  private apiKey: string | undefined;
  private apiUrl: string;

  constructor(options?: { apiKey?: string; apiUrl?: string }) {
    this.apiKey = options?.apiKey || process.env.TRAIN_API_KEY;
    this.apiUrl = options?.apiUrl || process.env.TRAIN_API_URL || 'https://railway-live-enquiry.p.rapidapi.com';
  }

  public getProviderName(): string {
    return 'Indian Railways Live RailAPI';
  }

  public isReal(): boolean {
    return true;
  }

  public async searchTrains(query: TransportSearchQuery): Promise<NormalizedTransportOption[]> {
    if (!this.apiKey) {
      throw new Error(
        `[RealTrainProvider] Configuration Error: TRAIN_API_KEY is not configured on the server. Please provide TRAIN_API_KEY in .env or switch TRAIN_PROVIDER=mock.`
      );
    }

    const startTime = Date.now();
    const fromCode = resolveStationCode(query.origin);
    const toCode = resolveStationCode(query.destination);
    const travelDate = query.date || new Date().toISOString().split('T')[0];

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const url = `${this.apiUrl}/trains/betweenStations?from=${encodeURIComponent(fromCode)}&to=${encodeURIComponent(toCode)}&date=${encodeURIComponent(travelDate)}`;
      
      console.log(`[RealTrainProvider] Requesting real train search: ${fromCode} -> ${toCode} for ${travelDate}`);

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

      const durationMs = Date.now() - startTime;

      if (res.status === 401 || res.status === 403) {
        throw new Error(`[RealTrainProvider] Authentication failed (HTTP ${res.status}). Verify TRAIN_API_KEY.`);
      }
      if (res.status === 429) {
        throw new Error(`[RealTrainProvider] Rate limit exceeded on train API (HTTP 429).`);
      }
      if (!res.ok) {
        throw new Error(`[RealTrainProvider] Provider API error: HTTP ${res.status}`);
      }

      const json = await res.json();
      const rawList: any[] = Array.isArray(json.data)
        ? json.data
        : Array.isArray(json.trains)
        ? json.trains
        : Array.isArray(json.body)
        ? json.body
        : Array.isArray(json.data?.trainBetweenStationList)
        ? json.data.trainBetweenStationList
        : [];

      console.log(`[RealTrainProvider] Received ${rawList.length} real train results in ${durationMs}ms`);

      let results = rawList.map((item: any) =>
        Normalizer.normalizeTrainOption(
          {
            ...item,
            from_station_name: item.from_station_name || item.from_station || query.origin,
            to_station_name: item.to_station_name || item.to_station || query.destination,
            date: travelDate
          },
          'REAL',
          this.getProviderName()
        )
      );

      // Filter by train number or query if provided
      const q = (query.query || query.serviceNumber || '').trim().toLowerCase();
      if (q) {
        results = results.filter(
          (t) =>
            t.serviceNumber.toLowerCase().includes(q) ||
            t.title.toLowerCase().includes(q) ||
            t.id.toLowerCase().includes(q)
        );
      }

      return results;
    } catch (err: any) {
      console.error(`[RealTrainProvider] Real search failed (${err.message})`);
      throw err;
    }
  }

  public async getLiveStatus(trainNumber: string, date?: string): Promise<NormalizedLiveStatus> {
    if (!this.apiKey) {
      throw new Error(
        `[RealTrainProvider] Configuration Error: TRAIN_API_KEY is not configured for live status tracking.`
      );
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const cleanNumber = trainNumber.match(/\d+/)?.[0] || trainNumber.trim();
      const travelDate = date || new Date().toISOString().split('T')[0];
      const url = `${this.apiUrl}/trains/${encodeURIComponent(cleanNumber)}/live-status?date=${encodeURIComponent(travelDate)}`;
      
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

      if (!res.ok) {
        throw new Error(`[RealTrainProvider] Live status tracking error: HTTP ${res.status}`);
      }

      const raw = await res.json();
      return Normalizer.normalizeTrainLiveStatus(raw.data || raw, cleanNumber, 'REAL', this.getProviderName());
    } catch (err: any) {
      console.error(`[RealTrainProvider] Live status lookup failed for ${trainNumber}:`, err.message);
      throw err;
    }
  }
}
