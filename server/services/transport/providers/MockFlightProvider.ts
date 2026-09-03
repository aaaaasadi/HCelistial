import {
  IFlightProvider,
  TransportSearchQuery,
  NormalizedTransportOption,
  NormalizedLiveStatus
} from '../interfaces/ITransportProvider';
import { Normalizer } from '../Normalizer';
import { SyntheticTravelDataset } from '../dataset/syntheticDatasetGenerator';
import { FLIGHT_FIXTURES } from '../fixtures/flightFixtures';

export class MockFlightProvider implements IFlightProvider {
  public getProviderName(): string {
    return 'Demo Airline Flight Simulator';
  }

  public isReal(): boolean {
    return false;
  }

  public async searchFlights(query: TransportSearchQuery): Promise<NormalizedTransportOption[]> {
    const orig = (query.origin || 'BOM (Mumbai)').trim();
    const dest = (query.destination || 'GOI (Goa Dabolim)').trim();
    const date = query.date || '2026-09-10';
    const q = (query.query || query.serviceNumber || '').trim().toLowerCase();

    console.log(`[MockFlightProvider] ⚡ DEMO Flight Search: ${orig} -> ${dest} on ${date}`);

    const dataset = SyntheticTravelDataset.getInstance();
    const origLower = orig.toLowerCase();
    const destLower = dest.toLowerCase();

    let matched = dataset.flights.filter((f) => {
      const fromMatch =
        origLower.includes(f.originAirportCode.toLowerCase()) ||
        f.originCity.toLowerCase().includes(origLower) ||
        origLower.includes(f.originCity.toLowerCase());

      const toMatch =
        destLower.includes(f.destAirportCode.toLowerCase()) ||
        f.destCity.toLowerCase().includes(destLower) ||
        destLower.includes(f.destCity.toLowerCase());

      return fromMatch && toMatch;
    });

    if (matched.length === 0) {
      if ((origLower.includes('mumbai') || origLower.includes('bom')) && (destLower.includes('goa') || destLower.includes('goi') || destLower.includes('gox'))) {
        matched = dataset.flights.filter(f => f.originAirportCode === 'BOM' && f.destAirportCode === 'GOI');
      } else {
        matched = dataset.flights.slice(0, 8);
      }
    }

    let results: NormalizedTransportOption[] = matched.map((f) => ({
      id: f.id,
      type: 'FLIGHT',
      provider: f.airline,
      serviceNumber: `${f.flightNumber} (${f.aircraft})`,
      title: `${f.airline} Flight ${f.flightNumber}`,
      origin: orig,
      destination: dest,
      travelDate: date,
      scheduledDeparture: f.departureTime,
      scheduledArrival: f.arrivalTime,
      expectedDeparture: f.departureTime,
      expectedArrival: f.arrivalTime,
      duration: f.duration,
      status: f.status,
      delayMinutes: 0,
      fareRupees: f.fare,
      availableSeats: f.availableSeats,
      availabilityStatus: f.availableSeats > 0 ? 'AVAILABLE' : 'UNAVAILABLE',
      terminalDistanceMinsFromStation: 35,
      platformOrTerminal: `${f.terminal} (${f.gate})`,
      seatOrClass: f.seatClass,
      sourceType: 'MOCK',
      sourceProvider: this.getProviderName(),
      lastUpdated: new Date().toISOString(),
      notes: `Scheduled domestic commercial route (${f.aircraft})`
    }));

    if (q) {
      results = results.filter(
        (f) =>
          f.serviceNumber.toLowerCase().includes(q) ||
          f.title.toLowerCase().includes(q) ||
          f.provider.toLowerCase().includes(q)
      );
    }

    console.log(`[MockFlightProvider] Returning ${results.length} demo flights for ${orig} -> ${dest}`);
    return results;
  }

  public async getLiveStatus(flightNumber: string, date?: string): Promise<NormalizedLiveStatus> {
    const fixture = FLIGHT_FIXTURES.onTimeFlight;
    return {
      serviceNumber: fixture.flight_number,
      transportType: 'FLIGHT',
      status: 'ON_TIME',
      delayMinutes: 0,
      scheduledDeparture: fixture.scheduled_departure,
      scheduledArrival: fixture.scheduled_arrival,
      expectedDeparture: fixture.scheduled_departure,
      expectedArrival: fixture.scheduled_arrival,
      currentLocation: fixture.current_location,
      platformOrBay: `${fixture.terminal} (${fixture.gate})`,
      speedKmh: fixture.speed,
      lastPing: '1 min ago',
      lastUpdated: new Date().toISOString(),
      sourceType: 'MOCK',
      sourceProvider: this.getProviderName()
    };
  }
}
