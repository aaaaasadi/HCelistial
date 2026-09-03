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
    return 'Indian Railways Simulated Feed (Mock)';
  }

  public isReal(): boolean {
    return false;
  }

  public async searchTrains(query: TransportSearchQuery): Promise<NormalizedTransportOption[]> {
    const orig = query.origin?.trim() || 'Mumbai CSMT';
    const dest = query.destination?.trim() || 'Pune Junction';
    const date = query.date || new Date().toISOString().split('T')[0];
    const q = (query.query || query.serviceNumber || '').trim().toLowerCase();

    const trains: NormalizedTransportOption[] = [
      {
        id: 'mock-train-12127',
        type: 'TRAIN',
        provider: 'Indian Railways (Central Railway)',
        serviceNumber: '12127 Intercity SF Express',
        title: 'Intercity Superfast Express (12127)',
        origin: orig,
        destination: dest,
        travelDate: date,
        scheduledDeparture: '10:00 AM',
        scheduledArrival: '1:30 PM',
        expectedDeparture: '10:00 AM',
        expectedArrival: '1:30 PM',
        duration: '3h 30m',
        status: 'ON_TIME',
        delayMinutes: 0,
        fareRupees: 240,
        availableSeats: 48,
        availabilityStatus: 'AVAILABLE',
        terminalDistanceMinsFromStation: 0,
        platformOrTerminal: 'Platform 4',
        seatOrClass: 'AC Chair Car (CC)',
        sourceType: 'MOCK',
        sourceProvider: this.getProviderName(),
        lastUpdated: new Date().toISOString(),
        notes: 'Daily scheduled superfast intercity service.'
      },
      {
        id: 'mock-train-22225',
        type: 'TRAIN',
        provider: 'Indian Railways (CR)',
        serviceNumber: '22225 Vande Bharat Express',
        title: 'Vande Bharat Semi-High Speed (22225)',
        origin: orig,
        destination: dest,
        travelDate: date,
        scheduledDeparture: '06:05 AM',
        scheduledArrival: '09:15 AM',
        expectedDeparture: '06:05 AM',
        expectedArrival: '09:15 AM',
        duration: '3h 10m',
        status: 'ON_TIME',
        delayMinutes: 0,
        fareRupees: 650,
        availableSeats: 26,
        availabilityStatus: 'AVAILABLE',
        terminalDistanceMinsFromStation: 0,
        platformOrTerminal: 'Platform 8',
        seatOrClass: 'Executive AC (EC)',
        sourceType: 'MOCK',
        sourceProvider: this.getProviderName(),
        lastUpdated: new Date().toISOString(),
        notes: 'Semi-high speed executive service.'
      },
      {
        id: 'mock-train-12123',
        type: 'TRAIN',
        provider: 'Indian Railways (CR)',
        serviceNumber: '12123 Deccan Queen SF Exp',
        title: 'Deccan Queen Superfast (12123)',
        origin: orig,
        destination: dest,
        travelDate: date,
        scheduledDeparture: '05:10 PM',
        scheduledArrival: '08:25 PM',
        expectedDeparture: '05:10 PM',
        expectedArrival: '08:25 PM',
        duration: '3h 15m',
        status: 'ON_TIME',
        delayMinutes: 0,
        fareRupees: 260,
        availableSeats: 32,
        availabilityStatus: 'AVAILABLE',
        terminalDistanceMinsFromStation: 0,
        platformOrTerminal: 'Platform 5',
        seatOrClass: 'Dining Car / AC Chair',
        sourceType: 'MOCK',
        sourceProvider: this.getProviderName(),
        lastUpdated: new Date().toISOString(),
        notes: 'Scenic Bhor Ghat heritage train.'
      },
      {
        id: 'mock-train-12780',
        type: 'TRAIN',
        provider: 'Indian Railways (SWR)',
        serviceNumber: '12780 Goa Express',
        title: 'Goa Superfast Express (12780)',
        origin: orig,
        destination: dest,
        travelDate: date,
        scheduledDeparture: '06:00 PM',
        scheduledArrival: '04:30 AM',
        expectedDeparture: '06:00 PM',
        expectedArrival: '04:30 AM',
        duration: '10h 30m',
        status: 'ON_TIME',
        delayMinutes: 0,
        fareRupees: 490,
        availableSeats: 14,
        availabilityStatus: 'AVAILABLE',
        terminalDistanceMinsFromStation: 0,
        platformOrTerminal: 'Platform 2',
        seatOrClass: '3A AC Sleeper',
        sourceType: 'MOCK',
        sourceProvider: this.getProviderName(),
        lastUpdated: new Date().toISOString(),
        notes: 'Direct overnight rail corridor service.'
      },
      {
        id: 'mock-train-11007',
        type: 'TRAIN',
        provider: 'Indian Railways (CR)',
        serviceNumber: '11007 Deccan Express',
        title: 'Deccan Express (11007)',
        origin: orig,
        destination: dest,
        travelDate: date,
        scheduledDeparture: '07:00 AM',
        scheduledArrival: '11:05 AM',
        expectedDeparture: '07:00 AM',
        expectedArrival: '11:05 AM',
        duration: '4h 05m',
        status: 'ON_TIME',
        delayMinutes: 0,
        fareRupees: 180,
        availableSeats: 64,
        availabilityStatus: 'AVAILABLE',
        terminalDistanceMinsFromStation: 0,
        platformOrTerminal: 'Platform 3',
        seatOrClass: 'Second Sitting (2S)',
        sourceType: 'MOCK',
        sourceProvider: this.getProviderName(),
        lastUpdated: new Date().toISOString(),
        notes: 'Morning intercity passenger service.'
      },
      {
        id: 'mock-train-12125',
        type: 'TRAIN',
        provider: 'Indian Railways (CR)',
        serviceNumber: '12125 Pragati Superfast',
        title: 'Pragati SF Express (12125)',
        origin: orig,
        destination: dest,
        travelDate: date,
        scheduledDeparture: '04:25 PM',
        scheduledArrival: '07:55 PM',
        expectedDeparture: '04:25 PM',
        expectedArrival: '07:55 PM',
        duration: '3h 30m',
        status: 'ON_TIME',
        delayMinutes: 0,
        fareRupees: 230,
        availableSeats: 52,
        availabilityStatus: 'AVAILABLE',
        terminalDistanceMinsFromStation: 0,
        platformOrTerminal: 'Platform 6',
        seatOrClass: 'AC Chair Car',
        sourceType: 'MOCK',
        sourceProvider: this.getProviderName(),
        lastUpdated: new Date().toISOString(),
        notes: 'Evening business commuter express.'
      }
    ];

    if (!q) return trains;
    return trains.filter(
      (t) =>
        t.serviceNumber.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.provider.toLowerCase().includes(q)
    );
  }

  public async getLiveStatus(trainNumber: string, date?: string): Promise<NormalizedLiveStatus> {
    const isDelayed = date === 'DELAYED' || trainNumber.toLowerCase().includes('delayed') || process.env.DEMO_TRAIN_DELAY === 'true';
    const fixture = isDelayed ? TRAIN_FIXTURES.delayed12127 : TRAIN_FIXTURES.onTime12127;
    return Normalizer.normalizeTrainLiveStatus(fixture, trainNumber, 'MOCK', this.getProviderName());
  }
}
