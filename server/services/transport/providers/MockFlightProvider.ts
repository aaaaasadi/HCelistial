import {
  IFlightProvider,
  TransportSearchQuery,
  NormalizedTransportOption,
  NormalizedLiveStatus
} from '../interfaces/ITransportProvider';
import { Normalizer } from '../Normalizer';
import { FLIGHT_FIXTURES } from '../fixtures/flightFixtures';

export class MockFlightProvider implements IFlightProvider {
  public getProviderName(): string {
    return 'Aviation Regional Standby Demo Provider';
  }

  public isReal(): boolean {
    return false;
  }

  public async searchFlights(_query: TransportSearchQuery): Promise<NormalizedTransportOption[]> {
    return FLIGHT_FIXTURES.standbyFlights.map((raw) =>
      Normalizer.normalizeFlightOption(raw, 'MOCK', this.getProviderName())
    );
  }

  public async getLiveStatus(flightNumber: string, _date?: string): Promise<NormalizedLiveStatus> {
    const raw = FLIGHT_FIXTURES.liveStatus6E5128;
    return {
      serviceNumber: raw.flight_number || flightNumber,
      transportType: 'FLIGHT',
      status: 'ON_TIME',
      delayMinutes: 0,
      scheduledDeparture: raw.scheduled_departure,
      scheduledArrival: raw.scheduled_arrival,
      expectedDeparture: raw.expected_departure,
      expectedArrival: raw.expected_arrival,
      currentLocation: 'Mumbai Chhatrapati Shivaji T2 Gate 42B',
      platformOrBay: `Gate ${raw.gate}`,
      lastPing: '1 minute ago',
      sourceType: 'MOCK',
      sourceProvider: this.getProviderName(),
      rawPayload: raw
    };
  }
}
