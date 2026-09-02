import {
  ITrainProvider,
  TransportSearchQuery,
  NormalizedTransportOption,
  NormalizedLiveStatus
} from '../interfaces/ITransportProvider';
import { Normalizer } from '../Normalizer';
import { TRAIN_FIXTURES } from '../fixtures/trainFixtures';

export class MockTrainProvider implements ITrainProvider {
  public getProviderName(): string {
    return 'Indian Railways (CR) Demo Provider';
  }

  public isReal(): boolean {
    return false;
  }

  public async searchTrains(query: TransportSearchQuery): Promise<NormalizedTransportOption[]> {
    return [
      {
        id: 'opt-train-12127',
        type: 'TRAIN',
        provider: 'Indian Railways (CR)',
        serviceNumber: '12127 Intercity SF Express',
        title: 'Intercity Superfast Express (12127)',
        origin: query.origin || 'Mumbai CSMT',
        destination: query.destination || 'Pune Junction',
        scheduledDeparture: '10:00 AM',
        scheduledArrival: '1:30 PM',
        expectedDeparture: '10:00 AM',
        expectedArrival: '1:30 PM',
        status: 'ON_TIME',
        delayMinutes: 0,
        fareRupees: 240,
        availableSeats: 45,
        availabilityStatus: 'AVAILABLE',
        terminalDistanceMinsFromStation: 0,
        platformOrTerminal: 'Platform 4',
        seatOrClass: 'AC Chair Car (CC)',
        sourceType: 'MOCK',
        sourceProvider: this.getProviderName(),
        notes: 'Daily scheduled superfast intercity service.'
      },
      {
        id: 'opt-train-12780',
        type: 'TRAIN',
        provider: 'Indian Railways (SWR)',
        serviceNumber: '12780 Goa Express',
        title: 'Goa Express (12780)',
        origin: 'Pune Junction',
        destination: 'Madgaon (Goa)',
        scheduledDeparture: '6:00 PM',
        scheduledArrival: '4:30 AM',
        expectedDeparture: '6:00 PM',
        expectedArrival: '4:30 AM',
        status: 'ON_TIME',
        delayMinutes: 0,
        fareRupees: 490,
        availableSeats: 6,
        availabilityStatus: 'AVAILABLE',
        terminalDistanceMinsFromStation: 0,
        platformOrTerminal: 'Platform 2',
        seatOrClass: '3A AC Sleeper',
        sourceType: 'MOCK',
        sourceProvider: this.getProviderName(),
        notes: 'Direct overnight rail connector to Goa.'
      }
    ];
  }

  public async getLiveStatus(trainNumber: string, date?: string): Promise<NormalizedLiveStatus> {
    const isDelayed = date === 'DELAYED' || trainNumber.toLowerCase().includes('delayed') || process.env.DEMO_TRAIN_DELAY === 'true';
    const fixture = isDelayed ? TRAIN_FIXTURES.delayed12127 : TRAIN_FIXTURES.onTime12127;
    return Normalizer.normalizeTrainLiveStatus(fixture, trainNumber, 'MOCK', this.getProviderName());
  }
}
