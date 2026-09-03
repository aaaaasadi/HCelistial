import {
  IBusProvider,
  TransportSearchQuery,
  NormalizedTransportOption,
  NormalizedLiveStatus
} from '../interfaces/ITransportProvider';
import { Normalizer } from '../Normalizer';
import { SyntheticTravelDataset } from '../dataset/syntheticDatasetGenerator';
import { BUS_FIXTURES } from '../fixtures/busFixtures';

export class MockBusProvider implements IBusProvider {
  public getProviderName(): string {
    return 'Demo Bus Network Simulator';
  }

  public isReal(): boolean {
    return false;
  }

  public async searchBuses(query: TransportSearchQuery): Promise<NormalizedTransportOption[]> {
    const orig = (query.origin || 'Pune Swargate').trim();
    const dest = (query.destination || 'Panaji (Goa)').trim();
    const date = query.date || '2026-09-10';
    const q = (query.query || query.serviceNumber || '').trim().toLowerCase();

    console.log(`[MockBusProvider] ⚡ DEMO Bus Search: ${orig} -> ${dest} on ${date}`);

    const dataset = SyntheticTravelDataset.getInstance();
    const origLower = orig.toLowerCase();
    const destLower = dest.toLowerCase();

    let matched = dataset.buses.filter((b) => {
      const fromMatch =
        origLower.includes(b.originCity.toLowerCase()) ||
        b.originCity.toLowerCase().includes(origLower) ||
        origLower.includes(b.originTerminal.toLowerCase().split(' ')[0]);

      const toMatch =
        destLower.includes(b.destCity.toLowerCase()) ||
        b.destCity.toLowerCase().includes(destLower) ||
        destLower.includes(b.destTerminal.toLowerCase().split(' ')[0]);

      return fromMatch && toMatch;
    });

    if (matched.length === 0) {
      if (origLower.includes('pune') && (destLower.includes('goa') || destLower.includes('panaji') || destLower.includes('madgaon'))) {
        matched = dataset.buses.filter(b => b.originCity === 'Pune' && b.destCity.includes('Goa'));
      } else {
        matched = dataset.buses.slice(0, 8);
      }
    }

    let results: NormalizedTransportOption[] = matched.map((b) => ({
      id: b.id,
      type: 'BUS',
      provider: b.operator,
      serviceNumber: b.serviceNumber,
      title: `${b.operator} (${b.busType})`,
      origin: orig,
      destination: dest,
      travelDate: date,
      scheduledDeparture: b.departureTime,
      scheduledArrival: b.arrivalTime,
      expectedDeparture: b.departureTime,
      expectedArrival: b.arrivalTime,
      duration: b.duration,
      status: b.status,
      delayMinutes: 0,
      fareRupees: b.fare,
      availableSeats: b.availableSeats,
      availabilityStatus: b.availableSeats > 0 ? 'AVAILABLE' : 'UNAVAILABLE',
      terminalDistanceMinsFromStation: 15,
      platformOrTerminal: b.bay,
      seatOrClass: b.busType,
      sourceType: 'MOCK',
      sourceProvider: this.getProviderName(),
      lastUpdated: new Date().toISOString(),
      notes: b.amenities
    }));

    if (q) {
      results = results.filter(
        (b) =>
          b.serviceNumber.toLowerCase().includes(q) ||
          b.title.toLowerCase().includes(q) ||
          b.provider.toLowerCase().includes(q)
      );
    }

    console.log(`[MockBusProvider] Returning ${results.length} demo buses for ${orig} -> ${dest}`);
    return results;
  }

  public async getLiveStatus(serviceNumber: string, date?: string): Promise<NormalizedLiveStatus> {
    const fixture = BUS_FIXTURES.onTimeBus;
    return {
      serviceNumber: fixture.service_number,
      transportType: 'BUS',
      status: 'ON_TIME',
      delayMinutes: 0,
      scheduledDeparture: fixture.scheduled_departure,
      scheduledArrival: fixture.scheduled_arrival,
      expectedDeparture: fixture.scheduled_departure,
      expectedArrival: fixture.scheduled_arrival,
      currentLocation: fixture.current_location,
      platformOrBay: `Bay ${fixture.bay}`,
      speedKmh: fixture.speed,
      lastPing: '2 mins ago',
      lastUpdated: new Date().toISOString(),
      sourceType: 'MOCK',
      sourceProvider: this.getProviderName()
    };
  }
}
