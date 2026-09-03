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
    const orig = query.origin?.trim() || 'Panvel (PNVL)';
    const dest = query.destination?.trim() || 'Chiplun (CHI)';
    const date = query.date || '2026-09-10';
    const q = (query.query || query.serviceNumber || '').trim().toLowerCase();

    console.log(`[MockTrainProvider] ⚡ MOCK Schedule Query: ${orig} -> ${dest} on ${date}`);

    const origLower = orig.toLowerCase();
    const destLower = dest.toLowerCase();

    let trainList: NormalizedTransportOption[] = [];

    // 1. Konkan Railway Corridor (e.g. Panvel / Mumbai -> Chiplun / Ratnagiri / Goa / Mangalore)
    const isKonkan =
      origLower.includes('panvel') ||
      origLower.includes('pnvl') ||
      destLower.includes('chiplun') ||
      destLower.includes('chi') ||
      origLower.includes('chiplun') ||
      destLower.includes('ratnagiri') ||
      destLower.includes('rn') ||
      destLower.includes('khed') ||
      destLower.includes('sawantwadi') ||
      origLower.includes('khed');

    if (isKonkan) {
      trainList = [
        {
          id: 'mock-train-10103',
          type: 'TRAIN',
          provider: 'Indian Railways (Central / Konkan Railway)',
          serviceNumber: '10103 Mandovi Superfast Express',
          title: 'Mandovi Express (10103)',
          origin: orig,
          destination: dest,
          travelDate: date,
          scheduledDeparture: '08:35 AM',
          scheduledArrival: '01:10 PM',
          expectedDeparture: '08:35 AM',
          expectedArrival: '01:10 PM',
          duration: '4h 35m',
          status: 'ON_TIME',
          delayMinutes: 0,
          fareRupees: 185,
          availableSeats: 64,
          availabilityStatus: 'AVAILABLE',
          terminalDistanceMinsFromStation: 0,
          platformOrTerminal: 'Platform 7',
          seatOrClass: '2S / CC / Sleeper',
          sourceType: 'MOCK',
          sourceProvider: this.getProviderName(),
          lastUpdated: new Date().toISOString(),
          notes: 'Daily daytime Konkan Express via Panvel & Chiplun.'
        },
        {
          id: 'mock-train-12051',
          type: 'TRAIN',
          provider: 'Indian Railways (CR / KR)',
          serviceNumber: '12051 Jan Shatabdi Express',
          title: 'Jan Shatabdi SF Express (12051)',
          origin: orig,
          destination: dest,
          travelDate: date,
          scheduledDeparture: '06:00 AM',
          scheduledArrival: '09:45 AM',
          expectedDeparture: '06:00 AM',
          expectedArrival: '09:45 AM',
          duration: '3h 45m',
          status: 'ON_TIME',
          delayMinutes: 0,
          fareRupees: 215,
          availableSeats: 42,
          availabilityStatus: 'AVAILABLE',
          terminalDistanceMinsFromStation: 0,
          platformOrTerminal: 'Platform 5',
          seatOrClass: 'AC Chair Car (CC)',
          sourceType: 'MOCK',
          sourceProvider: this.getProviderName(),
          lastUpdated: new Date().toISOString(),
          notes: 'High priority morning Jan Shatabdi express service.'
        },
        {
          id: 'mock-train-10111',
          type: 'TRAIN',
          provider: 'Indian Railways (CR / KR)',
          serviceNumber: '10111 Konkan Kanya Express',
          title: 'Konkan Kanya Express (10111)',
          origin: orig,
          destination: dest,
          travelDate: date,
          scheduledDeparture: '11:55 PM',
          scheduledArrival: '04:30 AM',
          expectedDeparture: '11:55 PM',
          expectedArrival: '04:30 AM',
          duration: '4h 35m',
          status: 'ON_TIME',
          delayMinutes: 0,
          fareRupees: 290,
          availableSeats: 28,
          availabilityStatus: 'AVAILABLE',
          terminalDistanceMinsFromStation: 0,
          platformOrTerminal: 'Platform 6',
          seatOrClass: 'Sleeper (SL) / 3A',
          sourceType: 'MOCK',
          sourceProvider: this.getProviderName(),
          lastUpdated: new Date().toISOString(),
          notes: 'Daily overnight Konkan Railway express.'
        },
        {
          id: 'mock-train-12618',
          type: 'TRAIN',
          provider: 'Indian Railways (Northern / Southern Railway)',
          serviceNumber: '12618 Mangala Lakshadweep SF',
          title: 'Mangala Lakshadweep Express (12618)',
          origin: orig,
          destination: dest,
          travelDate: date,
          scheduledDeparture: '10:15 AM',
          scheduledArrival: '02:40 PM',
          expectedDeparture: '10:15 AM',
          expectedArrival: '02:40 PM',
          duration: '4h 25m',
          status: 'ON_TIME',
          delayMinutes: 0,
          fareRupees: 195,
          availableSeats: 55,
          availabilityStatus: 'AVAILABLE',
          terminalDistanceMinsFromStation: 0,
          platformOrTerminal: 'Platform 7',
          seatOrClass: 'Sleeper / 3A / 2A',
          sourceType: 'MOCK',
          sourceProvider: this.getProviderName(),
          lastUpdated: new Date().toISOString(),
          notes: 'Daily long-distance superfast corridor train.'
        },
        {
          id: 'mock-train-16345',
          type: 'TRAIN',
          provider: 'Indian Railways (Southern Railway)',
          serviceNumber: '16345 Netravati Express',
          title: 'Netravati Express (16345)',
          origin: orig,
          destination: dest,
          travelDate: date,
          scheduledDeparture: '12:45 PM',
          scheduledArrival: '05:20 PM',
          expectedDeparture: '12:45 PM',
          expectedArrival: '05:20 PM',
          duration: '4h 35m',
          status: 'ON_TIME',
          delayMinutes: 0,
          fareRupees: 190,
          availableSeats: 38,
          availabilityStatus: 'AVAILABLE',
          terminalDistanceMinsFromStation: 0,
          platformOrTerminal: 'Platform 6',
          seatOrClass: 'SL / 3A / 2A',
          sourceType: 'MOCK',
          sourceProvider: this.getProviderName(),
          lastUpdated: new Date().toISOString(),
          notes: 'Afternoon coastal express service.'
        },
        {
          id: 'mock-train-11003',
          type: 'TRAIN',
          provider: 'Indian Railways (CR)',
          serviceNumber: '11003 Tutari Express',
          title: 'Tutari Express (11003)',
          origin: orig,
          destination: dest,
          travelDate: date,
          scheduledDeparture: '01:05 AM',
          scheduledArrival: '05:40 AM',
          expectedDeparture: '01:05 AM',
          expectedArrival: '05:40 AM',
          duration: '4h 35m',
          status: 'ON_TIME',
          delayMinutes: 0,
          fareRupees: 170,
          availableSeats: 72,
          availabilityStatus: 'AVAILABLE',
          terminalDistanceMinsFromStation: 0,
          platformOrTerminal: 'Platform 5',
          seatOrClass: '2S / Sleeper / 3A',
          sourceType: 'MOCK',
          sourceProvider: this.getProviderName(),
          lastUpdated: new Date().toISOString(),
          notes: 'Overnight commuter express.'
        },
        {
          id: 'mock-train-22119',
          type: 'TRAIN',
          provider: 'Indian Railways (CR)',
          serviceNumber: '22119 Tejas Express',
          title: 'Tejas Premium Express (22119)',
          origin: orig,
          destination: dest,
          travelDate: date,
          scheduledDeparture: '06:40 AM',
          scheduledArrival: '10:10 AM',
          expectedDeparture: '06:40 AM',
          expectedArrival: '10:10 AM',
          duration: '3h 30m',
          status: 'ON_TIME',
          delayMinutes: 0,
          fareRupees: 580,
          availableSeats: 31,
          availabilityStatus: 'AVAILABLE',
          terminalDistanceMinsFromStation: 0,
          platformOrTerminal: 'Platform 7',
          seatOrClass: 'Executive / AC Chair',
          sourceType: 'MOCK',
          sourceProvider: this.getProviderName(),
          lastUpdated: new Date().toISOString(),
          notes: 'Premium high-speed air-conditioned service.'
        },
        {
          id: 'mock-train-12133',
          type: 'TRAIN',
          provider: 'Indian Railways (CR)',
          serviceNumber: '12133 Mangaluru SF Express',
          title: 'Mangaluru Superfast (12133)',
          origin: orig,
          destination: dest,
          travelDate: date,
          scheduledDeparture: '11:15 PM',
          scheduledArrival: '03:30 AM',
          expectedDeparture: '11:15 PM',
          expectedArrival: '03:30 AM',
          duration: '4h 15m',
          status: 'ON_TIME',
          delayMinutes: 0,
          fareRupees: 210,
          availableSeats: 44,
          availabilityStatus: 'AVAILABLE',
          terminalDistanceMinsFromStation: 0,
          platformOrTerminal: 'Platform 6',
          seatOrClass: '3A / 2A / Sleeper',
          sourceType: 'MOCK',
          sourceProvider: this.getProviderName(),
          lastUpdated: new Date().toISOString(),
          notes: 'Night superfast Konkan express.'
        },
        {
          id: 'mock-train-22229',
          type: 'TRAIN',
          provider: 'Indian Railways (CR)',
          serviceNumber: '22229 Mumbai Madgaon Vande Bharat',
          title: 'Vande Bharat Express (22229)',
          origin: orig,
          destination: dest,
          travelDate: date,
          scheduledDeparture: '06:15 AM',
          scheduledArrival: '09:50 AM',
          expectedDeparture: '06:15 AM',
          expectedArrival: '09:50 AM',
          duration: '3h 35m',
          status: 'ON_TIME',
          delayMinutes: 0,
          fareRupees: 690,
          availableSeats: 19,
          availabilityStatus: 'AVAILABLE',
          terminalDistanceMinsFromStation: 0,
          platformOrTerminal: 'Platform 7',
          seatOrClass: 'Executive (EC) / CC',
          sourceType: 'MOCK',
          sourceProvider: this.getProviderName(),
          lastUpdated: new Date().toISOString(),
          notes: 'Modern semi-high speed express train.'
        },
        {
          id: 'mock-train-50103',
          type: 'TRAIN',
          provider: 'Indian Railways (Konkan Railway)',
          serviceNumber: '50103 Diva Ratnagiri Passenger',
          title: 'Diva Ratnagiri Passenger (50103)',
          origin: orig,
          destination: dest,
          travelDate: date,
          scheduledDeparture: '06:30 AM',
          scheduledArrival: '12:45 PM',
          expectedDeparture: '06:30 AM',
          expectedArrival: '12:45 PM',
          duration: '6h 15m',
          status: 'ON_TIME',
          delayMinutes: 0,
          fareRupees: 75,
          availableSeats: 120,
          availabilityStatus: 'AVAILABLE',
          terminalDistanceMinsFromStation: 0,
          platformOrTerminal: 'Platform 4',
          seatOrClass: 'General Second (2S)',
          sourceType: 'MOCK',
          sourceProvider: this.getProviderName(),
          lastUpdated: new Date().toISOString(),
          notes: 'All-station local passenger connector.'
        }
      ];
    } else {
      // 2. Default & General Intercity Routes
      trainList = [
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
          scheduledArrival: '01:30 PM',
          expectedDeparture: '10:00 AM',
          expectedArrival: '01:30 PM',
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
    }

    console.log(`[MockTrainProvider] Generated ${trainList.length} total trains for ${orig} -> ${dest}`);

    if (q) {
      trainList = trainList.filter(
        (t) =>
          t.serviceNumber.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.provider.toLowerCase().includes(q)
      );
      console.log(`[MockTrainProvider] Filtered by query "${q}": ${trainList.length} matching trains`);
    }

    return trainList;
  }

  public async getLiveStatus(trainNumber: string, date?: string): Promise<NormalizedLiveStatus> {
    const isDelayed = date === 'DELAYED' || trainNumber.toLowerCase().includes('delayed') || process.env.DEMO_TRAIN_DELAY === 'true';
    const fixture = isDelayed ? TRAIN_FIXTURES.delayed12127 : TRAIN_FIXTURES.onTime12127;
    return Normalizer.normalizeTrainLiveStatus(fixture, trainNumber, 'MOCK', this.getProviderName());
  }
}
