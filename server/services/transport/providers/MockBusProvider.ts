import {
  IBusProvider,
  TransportSearchQuery,
  NormalizedTransportOption,
  NormalizedLiveStatus
} from '../interfaces/ITransportProvider';
import { Normalizer } from '../Normalizer';
import { BUS_FIXTURES } from '../fixtures/busFixtures';

export class MockBusProvider implements IBusProvider {
  public getProviderName(): string {
    return 'Intercity Bus Network Demo Provider';
  }

  public isReal(): boolean {
    return false;
  }

  public async searchBuses(_query: TransportSearchQuery): Promise<NormalizedTransportOption[]> {
    return BUS_FIXTURES.searchPuneToGoa.map((raw) =>
      Normalizer.normalizeBusOption(raw, 'MOCK', this.getProviderName())
    );
  }

  public async getLiveStatus(serviceNumber: string, date?: string): Promise<NormalizedLiveStatus> {
    const isCancelled = date === 'CANCELLED' || serviceNumber.toLowerCase().includes('cancelled');
    if (isCancelled) {
      const raw = BUS_FIXTURES.cancelledBus;
      return {
        serviceNumber: raw.service_number || serviceNumber,
        transportType: 'BUS',
        status: 'CANCELLED',
        delayMinutes: 0,
        scheduledDeparture: '5:00 PM',
        scheduledArrival: '11:00 PM',
        expectedDeparture: '5:00 PM',
        expectedArrival: '11:00 PM',
        currentLocation: 'Swargate Depot (Out of Service)',
        lastPing: 'Just now',
        reason: raw.delay_reason,
        sourceType: 'MOCK',
        sourceProvider: this.getProviderName(),
        rawPayload: raw
      };
    }
    const raw = BUS_FIXTURES.liveStatusPT8842;
    return {
      serviceNumber: raw.service_number || serviceNumber,
      transportType: 'BUS',
      status: 'ON_TIME',
      delayMinutes: 0,
      scheduledDeparture: raw.scheduled_departure,
      scheduledArrival: raw.scheduled_arrival,
      expectedDeparture: raw.expected_departure,
      expectedArrival: raw.expected_arrival,
      currentLocation: 'Swargate Private Bus Terminal Bay 3',
      platformOrBay: raw.bay,
      lastPing: '2 minutes ago',
      sourceType: 'MOCK',
      sourceProvider: this.getProviderName(),
      rawPayload: raw
    };
  }
}
