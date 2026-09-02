import {
  ITrainProvider,
  IBusProvider,
  IFlightProvider,
  TransportSearchQuery,
  NormalizedTransportOption,
  NormalizedLiveStatus,
  TransportType
} from './interfaces/ITransportProvider';
import { MockTrainProvider } from './providers/MockTrainProvider';
import { RealTrainProvider } from './providers/RealTrainProvider';
import { MockBusProvider } from './providers/MockBusProvider';
import { RealBusProvider } from './providers/RealBusProvider';
import { MockFlightProvider } from './providers/MockFlightProvider';
import { RealFlightProvider } from './providers/RealFlightProvider';
import { Normalizer } from './Normalizer';
import { TransportCache } from './TransportCache';
import { TransportOptionWithCost } from '../../../src/services/recovery/transportOptionsData';
import { SegmentRepository } from '../../repositories/SegmentRepository';
import { TripRepository } from '../../repositories/TripRepository';
import { JourneyService } from '../JourneyService';
import { DisruptionService } from '../DisruptionService';
import { JourneyBundleDTO } from '../../types/backendTypes';

export class TransportService {
  private static trainProvider: ITrainProvider | null = null;
  private static busProvider: IBusProvider | null = null;
  private static flightProvider: IFlightProvider | null = null;

  public static getTrainProvider(): ITrainProvider {
    if (!this.trainProvider) {
      const mode = (process.env.TRAIN_PROVIDER || 'mock').toLowerCase();
      this.trainProvider = mode === 'real' ? new RealTrainProvider() : new MockTrainProvider();
    }
    return this.trainProvider;
  }

  public static getBusProvider(): IBusProvider {
    if (!this.busProvider) {
      const mode = (process.env.BUS_PROVIDER || 'mock').toLowerCase();
      this.busProvider = mode === 'real' ? new RealBusProvider() : new MockBusProvider();
    }
    return this.busProvider;
  }

  public static getFlightProvider(): IFlightProvider {
    if (!this.flightProvider) {
      const mode = (process.env.FLIGHT_PROVIDER || 'mock').toLowerCase();
      this.flightProvider = mode === 'real' ? new RealFlightProvider() : new MockFlightProvider();
    }
    return this.flightProvider;
  }

  /**
   * Reset providers (useful during tests when toggling env variables).
   */
  public static resetProviders(): void {
    this.trainProvider = null;
    this.busProvider = null;
    this.flightProvider = null;
  }

  /**
   * Search trains with caching
   */
  public static async searchTrains(query: TransportSearchQuery): Promise<NormalizedTransportOption[]> {
    const cacheKey = `search:train:${query.origin}:${query.destination}:${query.date || ''}`;
    const cached = TransportCache.get<NormalizedTransportOption[]>(cacheKey);
    if (cached) return cached;

    const results = await this.getTrainProvider().searchTrains(query);
    TransportCache.set(cacheKey, results, TransportCache.SEARCH_OPTIONS_TTL_SEC);
    return results;
  }

  /**
   * Search buses with caching
   */
  public static async searchBuses(query: TransportSearchQuery): Promise<NormalizedTransportOption[]> {
    const cacheKey = `search:bus:${query.origin}:${query.destination}:${query.date || ''}`;
    const cached = TransportCache.get<NormalizedTransportOption[]>(cacheKey);
    if (cached) return cached;

    const results = await this.getBusProvider().searchBuses(query);
    TransportCache.set(cacheKey, results, TransportCache.SEARCH_OPTIONS_TTL_SEC);
    return results;
  }

  /**
   * Search flights with caching
   */
  public static async searchFlights(query: TransportSearchQuery): Promise<NormalizedTransportOption[]> {
    const cacheKey = `search:flight:${query.origin}:${query.destination}:${query.date || ''}`;
    const cached = TransportCache.get<NormalizedTransportOption[]>(cacheKey);
    if (cached) return cached;

    const results = await this.getFlightProvider().searchFlights(query);
    TransportCache.set(cacheKey, results, TransportCache.SEARCH_OPTIONS_TTL_SEC);
    return results;
  }

  /**
   * Multimodal search across all available providers for recovery options.
   */
  public static async searchAllAlternatives(
    origin: string,
    destination: string,
    date?: string
  ): Promise<TransportOptionWithCost[]> {
    const query: TransportSearchQuery = { origin, destination, date };
    const [trains, buses, flights] = await Promise.all([
      this.searchTrains(query).catch(() => []),
      this.searchBuses(query).catch(() => []),
      this.searchFlights(query).catch(() => [])
    ]);

    const allNormalized: NormalizedTransportOption[] = [...trains, ...buses, ...flights];
    return allNormalized.map((opt) => Normalizer.toRecoveryTransportOption(opt));
  }

  /**
   * Retrieves live status for a transport service with 30s TTL caching.
   */
  public static async getLiveStatus(
    type: TransportType,
    serviceNumber: string,
    date?: string
  ): Promise<NormalizedLiveStatus> {
    const cacheKey = `status:${type}:${serviceNumber}:${date || ''}`;
    const cached = TransportCache.get<NormalizedLiveStatus>(cacheKey);
    if (cached) return cached;

    let status: NormalizedLiveStatus;
    if (type === 'TRAIN') {
      status = await this.getTrainProvider().getLiveStatus(serviceNumber, date);
    } else if (type === 'BUS') {
      status = await this.getBusProvider().getLiveStatus(serviceNumber, date);
    } else {
      status = await this.getFlightProvider().getLiveStatus(serviceNumber, date);
    }

    TransportCache.set(cacheKey, status, TransportCache.LIVE_STATUS_TTL_SEC);
    return status;
  }

  /**
   * Polls live transport providers for all active transit segments in a trip,
   * records observations into PostgreSQL `transport_status`, updates segment telemetry,
   * and triggers the disruption/impact/recovery pipeline if delays or cancellations occur.
   */
  public static async syncTripTelemetry(tripId: string): Promise<JourneyBundleDTO> {
    console.log(`[TransportService] Syncing live telemetry for trip ${tripId}...`);
    const segments = await SegmentRepository.findByTripId(tripId);

    const transportSegments = segments.filter(
      (s) => s.type === 'TRAIN' || s.type === 'BUS' || s.type === 'FLIGHT'
    );

    let delayDetected = false;
    let cancelledDetected = false;

    for (const seg of transportSegments) {
      try {
        // Extract clean service number (e.g. '12127 Intercity SF Express' -> '12127')
        const serviceCode = seg.serviceNumber.split(' ')[0] || seg.serviceNumber;
        const queryStatus = (seg.delayMinutes > 30 || seg.status === 'DELAYED') ? 'DELAYED' : seg.status === 'CANCELLED' ? 'CANCELLED' : undefined;
        const liveStatus = await this.getLiveStatus(seg.type as TransportType, serviceCode, queryStatus);

        // Record observation in PostgreSQL transport_status table
        await SegmentRepository.recordTransportStatus(
          seg.id,
          liveStatus.status,
          liveStatus.delayMinutes,
          liveStatus.expectedDeparture,
          liveStatus.expectedArrival,
          liveStatus.reason || `${liveStatus.sourceProvider} (${liveStatus.sourceType})`,
          undefined,
          `${liveStatus.sourceProvider} [${liveStatus.sourceType}]`
        );

        // Update trip_segments telemetry
        await SegmentRepository.updateSegment(seg.id, {
          status: liveStatus.status === 'CANCELLED' ? 'CANCELLED' : liveStatus.delayMinutes > 15 ? 'DELAYED' : 'ON_TIME',
          delayMinutes: liveStatus.delayMinutes,
          departureTime: liveStatus.expectedDeparture,
          estimatedArrival: liveStatus.expectedArrival,
          notes: liveStatus.reason || seg.notes
        });

        if (liveStatus.delayMinutes >= 30) {
          delayDetected = true;
        }
        if (liveStatus.status === 'CANCELLED') {
          cancelledDetected = true;
        }
      } catch (err: any) {
        console.warn(`[TransportService] Failed to sync telemetry for segment ${seg.id}:`, err.message);
      }
    }

    // If live delay or cancellation detected and trip was previously ON_TRACK, trigger disruption analysis
    const trip = await TripRepository.findById(tripId);
    if ((delayDetected || cancelledDetected) && trip && trip.status === 'ON_TRACK') {
      console.log(`[TransportService] Significant delay/cancellation observed from live provider. Triggering Disruption Engine.`);
      return DisruptionService.simulateDisruption(
        tripId,
        cancelledDetected ? 'SCENARIO_4_MISSED_BUS' : 'SCENARIO_3_SEVERE_DELAY'
      );
    }

    return JourneyService.getJourneyBundle(tripId);
  }
}
