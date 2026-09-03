import {
  ITrainProvider,
  TransportSearchQuery,
  NormalizedTransportOption,
  NormalizedLiveStatus
} from '../interfaces/ITransportProvider';
import { Normalizer } from '../Normalizer';
import { SyntheticTravelDataset } from '../dataset/syntheticDatasetGenerator';
import { TRAIN_FIXTURES } from '../fixtures/trainFixtures';

export class MockTrainProvider implements ITrainProvider {
  public getProviderName(): string {
    return 'Demo Railway Schedule Simulator';
  }

  public isReal(): boolean {
    return false;
  }

  public async searchTrains(query: TransportSearchQuery): Promise<NormalizedTransportOption[]> {
    const orig = (query.origin || 'Panvel (PNVL)').trim();
    const dest = (query.destination || 'Chiplun (CHI)').trim();
    const date = query.date || '2026-09-10';
    const q = (query.query || query.serviceNumber || '').trim().toLowerCase();

    console.log(`[MockTrainProvider] ⚡ DEMO Train Search: ${orig} -> ${dest} on ${date}`);

    const dataset = SyntheticTravelDataset.getInstance();
    const origLower = orig.toLowerCase();
    const destLower = dest.toLowerCase();

    // 1. Direct and fuzzy matching against synthetic trains in dataset
    let matched = dataset.trains.filter((t) => {
      const fromMatch =
        origLower.includes(t.originStationCode.toLowerCase()) ||
        t.originStationName.toLowerCase().includes(origLower) ||
        origLower.includes(t.originStationName.toLowerCase().split(' ')[0]);

      const toMatch =
        destLower.includes(t.destStationCode.toLowerCase()) ||
        t.destStationName.toLowerCase().includes(destLower) ||
        destLower.includes(t.destStationName.toLowerCase().split(' ')[0]);

      return fromMatch && toMatch;
    });

    // 2. Special route fallbacks for Konkan Railway (Panvel / Mumbai -> Chiplun / Goa)
    if (matched.length === 0) {
      if (
        (origLower.includes('panvel') || origLower.includes('pnvl') || origLower.includes('mumbai') || origLower.includes('csmt')) &&
        (destLower.includes('chiplun') || destLower.includes('chi') || destLower.includes('ratnagiri') || destLower.includes('khed'))
      ) {
        matched = dataset.trains.filter(t => t.originStationCode === 'PNVL' && t.destStationCode === 'CHI');
      } else if (
        (origLower.includes('mumbai') || origLower.includes('csmt') || origLower.includes('dadar')) &&
        (destLower.includes('pune') || destLower.includes('pune jn'))
      ) {
        matched = dataset.trains.filter(t => t.originStationCode === 'CSMT' && t.destStationCode === 'PUNE');
      } else {
        // Broad search across synthetic dataset
        matched = dataset.trains.slice(0, 8);
      }
    }

    let results: NormalizedTransportOption[] = matched.map((t) => ({
      id: t.id,
      type: 'TRAIN',
      provider: t.operator,
      serviceNumber: `${t.trainNumber} ${t.trainName}`,
      title: t.trainName,
      origin: orig,
      destination: dest,
      travelDate: date,
      scheduledDeparture: t.departureTime,
      scheduledArrival: t.arrivalTime,
      expectedDeparture: t.departureTime,
      expectedArrival: t.arrivalTime,
      duration: t.duration,
      status: t.status,
      delayMinutes: 0,
      fareRupees: t.fare,
      availableSeats: t.availableSeats,
      availabilityStatus: t.availableSeats > 0 ? 'AVAILABLE' : 'UNAVAILABLE',
      terminalDistanceMinsFromStation: 0,
      platformOrTerminal: t.platform,
      seatOrClass: t.classes,
      sourceType: 'MOCK',
      sourceProvider: this.getProviderName(),
      lastUpdated: new Date().toISOString(),
      notes: `Demo synthetic railway schedule (${t.trainType})`
    }));

    if (q) {
      results = results.filter(
        (t) =>
          t.serviceNumber.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.provider.toLowerCase().includes(q)
      );
    }

    console.log(`[MockTrainProvider] Returning ${results.length} demo trains for ${orig} -> ${dest}`);
    return results;
  }

  public async getLiveStatus(trainNumber: string, date?: string): Promise<NormalizedLiveStatus> {
    const isDelayed = date === 'DELAYED' || trainNumber.toLowerCase().includes('delayed') || process.env.DEMO_TRAIN_DELAY === 'true';
    const fixture = isDelayed ? TRAIN_FIXTURES.delayed12127 : TRAIN_FIXTURES.onTime12127;
    return Normalizer.normalizeTrainLiveStatus(fixture, trainNumber, 'MOCK', this.getProviderName());
  }
}
