import {
  ITrainProvider,
  TransportSearchQuery,
  NormalizedTransportOption,
  NormalizedLiveStatus
} from '../interfaces/ITransportProvider';
import { Normalizer } from '../Normalizer';

// Common station name to IRCTC station code dictionary helper
const STATION_CODE_MAP: Record<string, string> = {
  panvel: 'PNVL',
  pnvl: 'PNVL',
  chiplun: 'CHI',
  chi: 'CHI',
  ratnagiri: 'RN',
  rn: 'RN',
  khed: 'KHED',
  sawantwadi: 'SWV',
  mangaon: 'MNI',
  roha: 'ROHA',
  mumbai: 'CSMT',
  'mumbai csmt': 'CSMT',
  'mumbai central': 'BCT',
  'dadar': 'DR',
  'thane': 'TNA',
  'kalyan': 'KYN',
  'vasai road': 'BSR',
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
  chennai: 'MAS',
  mangalore: 'MAJN'
};

function resolveStationCode(stationInput: string): string {
  const clean = stationInput.trim().toLowerCase();
  if (STATION_CODE_MAP[clean]) return STATION_CODE_MAP[clean];
  for (const [key, code] of Object.entries(STATION_CODE_MAP)) {
    if (clean.includes(key)) return code;
  }
  // If already a clean uppercase station code
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
    if (!this.apiKey || this.apiKey.trim() === '') {
      console.warn(`[RealTrainProvider] TRAIN_API_KEY is not configured on the server.`);
      throw new Error(
        `[RealTrainProvider] Configuration Error: TRAIN_API_KEY is not configured in .env. To search live trains using the REAL provider, set a valid TRAIN_API_KEY in .env, or switch TRAIN_PROVIDER=mock in .env.`
      );
    }

    const startTime = Date.now();
    const fromCode = resolveStationCode(query.origin);
    const toCode = resolveStationCode(query.destination);
    const travelDate = query.date || new Date().toISOString().split('T')[0];
    const trainFilter = (query.query || query.serviceNumber || '').trim().toLowerCase();

    console.log(`[RealTrainProvider] 🔍 REAL API Query Initiated:`);
    console.log(`  - Origin: ${query.origin} (Code: ${fromCode})`);
    console.log(`  - Destination: ${query.destination} (Code: ${toCode})`);
    console.log(`  - Travel Date: ${travelDate}`);
    console.log(`  - Filter: ${trainFilter || 'ALL TRAINS'}`);
    console.log(`  - Provider URL: ${this.apiUrl}`);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      // Support primary standard RapidAPI endpoints
      const url = `${this.apiUrl}/trains/betweenStations?from=${encodeURIComponent(fromCode)}&to=${encodeURIComponent(toCode)}&date=${encodeURIComponent(travelDate)}`;

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
      console.log(`[RealTrainProvider] HTTP Status: ${res.status} in ${durationMs}ms`);

      if (res.status === 401 || res.status === 403) {
        throw new Error(`[RealTrainProvider] Authentication failed (HTTP ${res.status}). Please verify your TRAIN_API_KEY in .env.`);
      }
      if (res.status === 429) {
        throw new Error(`[RealTrainProvider] Rate limit exceeded on train API (HTTP 429).`);
      }
      if (!res.ok) {
        throw new Error(`[RealTrainProvider] Provider API error: HTTP ${res.status} (${res.statusText})`);
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
        : Array.isArray(json.data?.trains)
        ? json.data.trains
        : [];

      console.log(`[RealTrainProvider] Provider returned ${rawList.length} total train services for route ${fromCode} -> ${toCode}`);

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

      // If user specified an optional train number or train name, filter accordingly
      if (trainFilter) {
        results = results.filter(
          (t) =>
            t.serviceNumber.toLowerCase().includes(trainFilter) ||
            t.title.toLowerCase().includes(trainFilter) ||
            t.id.toLowerCase().includes(trainFilter)
        );
        console.log(`[RealTrainProvider] Filtered by query "${trainFilter}": ${results.length} trains matching`);
      }

      return results;
    } catch (err: any) {
      console.error(`[RealTrainProvider] Search request failed: ${err.message}`);
      throw err;
    }
  }

  public async getLiveStatus(trainNumber: string, date?: string): Promise<NormalizedLiveStatus> {
    if (!this.apiKey || this.apiKey.trim() === '') {
      throw new Error(
        `[RealTrainProvider] Configuration Error: TRAIN_API_KEY is not configured in .env for live status tracking.`
      );
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const cleanNumber = trainNumber.match(/\d+/)?.[0] || trainNumber.trim();
      const travelDate = date || new Date().toISOString().split('T')[0];
      const url = `${this.apiUrl}/trains/${encodeURIComponent(cleanNumber)}/live-status?date=${encodeURIComponent(travelDate)}`;
      
      console.log(`[RealTrainProvider] Fetching live telemetry for train ${cleanNumber} on ${travelDate}`);

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
        throw new Error(`[RealTrainProvider] Live status API error: HTTP ${res.status}`);
      }

      const raw = await res.json();
      return Normalizer.normalizeTrainLiveStatus(raw.data || raw, cleanNumber, 'REAL', this.getProviderName());
    } catch (err: any) {
      console.error(`[RealTrainProvider] Live status lookup failed for ${trainNumber}:`, err.message);
      throw err;
    }
  }
}
