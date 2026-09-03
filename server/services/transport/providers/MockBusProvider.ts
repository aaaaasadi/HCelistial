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
    return 'Intercity Bus Network Simulator (Mock)';
  }

  public isReal(): boolean {
    return false;
  }

  public async searchBuses(query: TransportSearchQuery): Promise<NormalizedTransportOption[]> {
    const orig = query.origin?.trim() || 'Pune Swargate';
    const dest = query.destination?.trim() || 'Panaji (Goa)';
    const date = query.date || new Date().toISOString().split('T')[0];
    const q = (query.query || query.serviceNumber || '').trim().toLowerCase();

    const buses: NormalizedTransportOption[] = [
      {
        id: 'mock-bus-ksrtc-9902',
        type: 'BUS',
        provider: 'KSRTC Intercity GDS',
        serviceNumber: 'KA-01-F-9902 Airavat Club Class',
        title: 'KSRTC Airavat Multi-Axle Volvo (Club Class)',
        origin: orig,
        destination: dest,
        travelDate: date,
        scheduledDeparture: '05:00 PM',
        scheduledArrival: '11:40 PM',
        expectedDeparture: '05:00 PM',
        expectedArrival: '11:40 PM',
        duration: '6h 40m',
        status: 'ON_TIME',
        delayMinutes: 0,
        fareRupees: 1150,
        availableSeats: 18,
        availabilityStatus: 'AVAILABLE',
        terminalDistanceMinsFromStation: 10,
        platformOrTerminal: 'Bay 4, Intermodal Station Terminal',
        seatOrClass: 'Multi-Axle Semi-Sleeper AC',
        sourceType: 'MOCK',
        sourceProvider: this.getProviderName(),
        lastUpdated: new Date().toISOString(),
        notes: 'Highway express via NH48 with dedicated luggage space.'
      },
      {
        id: 'mock-bus-intrcity-4412',
        type: 'BUS',
        provider: 'IntrCity SmartBus Network',
        serviceNumber: 'MH-12-Q-4412 SmartBus Deluxe',
        title: 'IntrCity SmartBus Premium Lounge Coach',
        origin: orig,
        destination: dest,
        travelDate: date,
        scheduledDeparture: '08:00 PM',
        scheduledArrival: '03:00 AM',
        expectedDeparture: '08:00 PM',
        expectedArrival: '03:00 AM',
        duration: '7h 00m',
        status: 'ON_TIME',
        delayMinutes: 0,
        fareRupees: 1350,
        availableSeats: 12,
        availabilityStatus: 'AVAILABLE',
        terminalDistanceMinsFromStation: 15,
        platformOrTerminal: 'IntrCity Station Lounge, Swargate',
        seatOrClass: 'AC Sleeper Berth (Single/Double)',
        sourceType: 'MOCK',
        sourceProvider: this.getProviderName(),
        lastUpdated: new Date().toISOString(),
        notes: 'Onboard washroom, Wi-Fi, and live GPS tracking.'
      },
      {
        id: 'mock-bus-purple-9011',
        type: 'BUS',
        provider: 'Purple Travels (Prasanna)',
        serviceNumber: 'MH-14-BT-9011 Night Express',
        title: 'Purple Travels 2+1 Sleeper Coach',
        origin: orig,
        destination: dest,
        travelDate: date,
        scheduledDeparture: '06:30 PM',
        scheduledArrival: '01:30 AM',
        expectedDeparture: '06:30 PM',
        expectedArrival: '01:30 AM',
        duration: '7h 00m',
        status: 'ON_TIME',
        delayMinutes: 0,
        fareRupees: 890,
        availableSeats: 26,
        availabilityStatus: 'AVAILABLE',
        terminalDistanceMinsFromStation: 15,
        platformOrTerminal: 'Swargate Bus Stand, Bay 12',
        seatOrClass: 'Economy Sleeper (AC)',
        sourceType: 'MOCK',
        sourceProvider: this.getProviderName(),
        lastUpdated: new Date().toISOString(),
        notes: 'Comfortable overnight long-haul coach.'
      },
      {
        id: 'mock-bus-zing-302',
        type: 'BUS',
        provider: 'ZingBus Electric Mobility',
        serviceNumber: 'DL-01-ZB-302 Climate Coach',
        title: 'ZingBus Eco EV Premium Coach',
        origin: orig,
        destination: dest,
        travelDate: date,
        scheduledDeparture: '09:15 PM',
        scheduledArrival: '05:30 AM',
        expectedDeparture: '09:15 PM',
        expectedArrival: '05:30 AM',
        duration: '8h 15m',
        status: 'ON_TIME',
        delayMinutes: 0,
        fareRupees: 1050,
        availableSeats: 15,
        availabilityStatus: 'AVAILABLE',
        terminalDistanceMinsFromStation: 12,
        platformOrTerminal: 'ZingBus Hub, Station Road',
        seatOrClass: 'Luxury EV Semi-Sleeper',
        sourceType: 'MOCK',
        sourceProvider: this.getProviderName(),
        lastUpdated: new Date().toISOString(),
        notes: 'Zero emissions EV luxury transit.'
      }
    ];

    if (!q) return buses;
    return buses.filter(
      (b) =>
        b.serviceNumber.toLowerCase().includes(q) ||
        b.title.toLowerCase().includes(q) ||
        b.provider.toLowerCase().includes(q)
    );
  }

  public async getLiveStatus(serviceNumber: string, date?: string): Promise<NormalizedLiveStatus> {
    const isCancelled = serviceNumber.includes('cancelled') || date === 'CANCELLED';
    const isDelayed = serviceNumber.includes('delayed') || date === 'DELAYED';
    const fixture = isCancelled
      ? BUS_FIXTURES.cancelled9902
      : isDelayed
      ? BUS_FIXTURES.delayed4412
      : BUS_FIXTURES.onTime9902;
    return {
      serviceNumber,
      transportType: 'BUS',
      status: fixture.status as any,
      delayMinutes: fixture.delay_minutes || 0,
      scheduledDeparture: fixture.scheduled_departure,
      scheduledArrival: fixture.scheduled_arrival,
      expectedDeparture: fixture.expected_departure || fixture.scheduled_departure,
      expectedArrival: fixture.expected_arrival || fixture.scheduled_arrival,
      currentLocation: fixture.current_location,
      nextStop: fixture.next_stop,
      platformOrBay: fixture.bay ? `Bay ${fixture.bay}` : undefined,
      lastPing: 'Just now',
      lastUpdated: new Date().toISOString(),
      sourceType: 'MOCK',
      sourceProvider: this.getProviderName(),
      rawPayload: fixture
    };
  }
}
