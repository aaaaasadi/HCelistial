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
    return 'Aviation Flight Network Simulator (Mock)';
  }

  public isReal(): boolean {
    return false;
  }

  public async searchFlights(query: TransportSearchQuery): Promise<NormalizedTransportOption[]> {
    const orig = query.origin?.trim() || 'BOM (Mumbai)';
    const dest = query.destination?.trim() || 'GOI (Goa Dabolim)';
    const date = query.date || new Date().toISOString().split('T')[0];
    const q = (query.query || query.serviceNumber || '').trim().toLowerCase();

    const flights: NormalizedTransportOption[] = [
      {
        id: 'mock-flight-indigo-5128',
        type: 'FLIGHT',
        provider: 'IndiGo Airlines',
        serviceNumber: '6E-5128 Airbus A321neo',
        title: 'IndiGo Non-Stop Flight 6E-5128',
        origin: orig,
        destination: dest,
        travelDate: date,
        scheduledDeparture: '06:45 PM',
        scheduledArrival: '08:15 PM',
        expectedDeparture: '06:45 PM',
        expectedArrival: '08:15 PM',
        duration: '1h 30m',
        status: 'ON_TIME',
        delayMinutes: 0,
        fareRupees: 4250,
        availableSeats: 9,
        availabilityStatus: 'AVAILABLE',
        terminalDistanceMinsFromStation: 35,
        platformOrTerminal: 'Terminal 2 (Gate 14B)',
        seatOrClass: 'Economy Flex (Seat 12A)',
        sourceType: 'MOCK',
        sourceProvider: this.getProviderName(),
        lastUpdated: new Date().toISOString(),
        notes: 'Non-stop scheduled domestic flight with fast turnaround.'
      },
      {
        id: 'mock-flight-airindia-804',
        type: 'FLIGHT',
        provider: 'Air India',
        serviceNumber: 'AI-804 Boeing 737-800',
        title: 'Air India Express Flight AI-804',
        origin: orig,
        destination: dest,
        travelDate: date,
        scheduledDeparture: '08:10 PM',
        scheduledArrival: '09:35 PM',
        expectedDeparture: '08:10 PM',
        expectedArrival: '09:35 PM',
        duration: '1h 25m',
        status: 'ON_TIME',
        delayMinutes: 0,
        fareRupees: 3950,
        availableSeats: 16,
        availabilityStatus: 'AVAILABLE',
        terminalDistanceMinsFromStation: 35,
        platformOrTerminal: 'Terminal 2 (Gate 21A)',
        seatOrClass: 'Economy Choice (15F)',
        sourceType: 'MOCK',
        sourceProvider: this.getProviderName(),
        lastUpdated: new Date().toISOString(),
        notes: 'Complimentary baggage allowance (15kg check-in).'
      },
      {
        id: 'mock-flight-fly91-1102',
        type: 'FLIGHT',
        provider: 'Fly91 Regional Aviation',
        serviceNumber: 'IC-1102 ATR-72 600',
        title: 'Fly91 Regional Shuttle (IC-1102)',
        origin: orig,
        destination: dest,
        travelDate: date,
        scheduledDeparture: '06:15 PM',
        scheduledArrival: '07:25 PM',
        expectedDeparture: '06:15 PM',
        expectedArrival: '07:25 PM',
        duration: '1h 10m',
        status: 'ON_TIME',
        delayMinutes: 0,
        fareRupees: 3150,
        availableSeats: 6,
        availabilityStatus: 'AVAILABLE',
        terminalDistanceMinsFromStation: 25,
        platformOrTerminal: 'Terminal 1 (Gate 3)',
        seatOrClass: 'Regional Economy (4C)',
        sourceType: 'MOCK',
        sourceProvider: this.getProviderName(),
        lastUpdated: new Date().toISOString(),
        notes: 'Direct intra-regional shuttle flight.'
      },
      {
        id: 'mock-flight-akasa-1402',
        type: 'FLIGHT',
        provider: 'Akasa Air',
        serviceNumber: 'QP-1402 Boeing 737 MAX',
        title: 'Akasa Air Non-Stop QP-1402',
        origin: orig,
        destination: dest,
        travelDate: date,
        scheduledDeparture: '09:30 PM',
        scheduledArrival: '10:50 PM',
        expectedDeparture: '09:30 PM',
        expectedArrival: '10:50 PM',
        duration: '1h 20m',
        status: 'ON_TIME',
        delayMinutes: 0,
        fareRupees: 3450,
        availableSeats: 22,
        availabilityStatus: 'AVAILABLE',
        terminalDistanceMinsFromStation: 35,
        platformOrTerminal: 'Terminal 2 (Gate 18)',
        seatOrClass: 'Standard Economy',
        sourceType: 'MOCK',
        sourceProvider: this.getProviderName(),
        lastUpdated: new Date().toISOString(),
        notes: 'Late evening non-stop flight.'
      }
    ];

    if (!q) return flights;
    return flights.filter(
      (f) =>
        f.serviceNumber.toLowerCase().includes(q) ||
        f.title.toLowerCase().includes(q) ||
        f.provider.toLowerCase().includes(q)
    );
  }

  public async getLiveStatus(flightNumber: string, date?: string): Promise<NormalizedLiveStatus> {
    const fixture = FLIGHT_FIXTURES.onTime5128;
    return {
      serviceNumber: flightNumber,
      transportType: 'FLIGHT',
      status: 'ON_TIME',
      delayMinutes: 0,
      scheduledDeparture: fixture.scheduled_departure,
      scheduledArrival: fixture.scheduled_arrival,
      expectedDeparture: fixture.scheduled_departure,
      expectedArrival: fixture.scheduled_arrival,
      currentLocation: fixture.origin_airport,
      nextStop: fixture.destination_airport,
      platformOrBay: `Terminal ${fixture.terminal}`,
      lastPing: 'Just now',
      lastUpdated: new Date().toISOString(),
      sourceType: 'MOCK',
      sourceProvider: this.getProviderName(),
      rawPayload: fixture
    };
  }
}
