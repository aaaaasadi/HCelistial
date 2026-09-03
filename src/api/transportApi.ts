import { apiFetch } from './client';
import { JourneyBundleDTO } from '../../server/types/backendTypes';
import { NormalizedLiveStatus, NormalizedTransportOption } from '../../server/services/transport/interfaces/ITransportProvider';

// Client-side fallback generator for offline / GitHub Pages static mode only
function generateClientMockTrains(params: { origin?: string; destination?: string; date?: string; query?: string }): NormalizedTransportOption[] {
  const orig = params.origin?.trim() || 'Panvel (PNVL)';
  const dest = params.destination?.trim() || 'Chiplun (CHI)';
  const date = params.date || '2026-09-10';
  const q = (params.query || '').toLowerCase().trim();

  const origLower = orig.toLowerCase();
  const destLower = dest.toLowerCase();

  const isKonkan =
    origLower.includes('panvel') ||
    origLower.includes('pnvl') ||
    destLower.includes('chiplun') ||
    destLower.includes('chi') ||
    origLower.includes('chiplun') ||
    destLower.includes('ratnagiri') ||
    destLower.includes('rn') ||
    destLower.includes('khed') ||
    destLower.includes('sawantwadi');

  let allTrains: NormalizedTransportOption[] = [];

  if (isKonkan) {
    allTrains = [
      {
        id: 'client-train-10103',
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
        sourceProvider: 'Demo Railway Schedule Simulator (Mock)',
        lastUpdated: new Date().toISOString(),
        notes: 'Daily daytime Konkan Express via Panvel & Chiplun.'
      },
      {
        id: 'client-train-12051',
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
        sourceProvider: 'Demo Railway Schedule Simulator (Mock)',
        lastUpdated: new Date().toISOString(),
        notes: 'High priority morning Jan Shatabdi express service.'
      },
      {
        id: 'client-train-10111',
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
        sourceProvider: 'Demo Railway Schedule Simulator (Mock)',
        lastUpdated: new Date().toISOString(),
        notes: 'Daily overnight Konkan Railway express.'
      },
      {
        id: 'client-train-12618',
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
        sourceProvider: 'Demo Railway Schedule Simulator (Mock)',
        lastUpdated: new Date().toISOString(),
        notes: 'Daily long-distance superfast corridor train.'
      },
      {
        id: 'client-train-16345',
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
        sourceProvider: 'Demo Railway Schedule Simulator (Mock)',
        lastUpdated: new Date().toISOString(),
        notes: 'Afternoon coastal express service.'
      },
      {
        id: 'client-train-11003',
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
        sourceProvider: 'Demo Railway Schedule Simulator (Mock)',
        lastUpdated: new Date().toISOString(),
        notes: 'Overnight commuter express.'
      },
      {
        id: 'client-train-22119',
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
        sourceProvider: 'Demo Railway Schedule Simulator (Mock)',
        lastUpdated: new Date().toISOString(),
        notes: 'Premium high-speed air-conditioned service.'
      },
      {
        id: 'client-train-12133',
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
        sourceProvider: 'Demo Railway Schedule Simulator (Mock)',
        lastUpdated: new Date().toISOString(),
        notes: 'Night superfast Konkan express.'
      },
      {
        id: 'client-train-22229',
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
        sourceProvider: 'Demo Railway Schedule Simulator (Mock)',
        lastUpdated: new Date().toISOString(),
        notes: 'Modern semi-high speed express train.'
      },
      {
        id: 'client-train-50103',
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
        sourceProvider: 'Demo Railway Schedule Simulator (Mock)',
        lastUpdated: new Date().toISOString(),
        notes: 'All-station local passenger connector.'
      }
    ];
  } else {
    allTrains = [
      {
        id: 'client-mock-train-12127',
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
        sourceProvider: 'Demo Railway Schedule Simulator (Mock)',
        lastUpdated: new Date().toISOString(),
        notes: 'Daily scheduled superfast intercity service.'
      },
      {
        id: 'client-mock-train-22225',
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
        availableSeats: 24,
        availabilityStatus: 'AVAILABLE',
        terminalDistanceMinsFromStation: 0,
        platformOrTerminal: 'Platform 8',
        seatOrClass: 'Executive AC (EC)',
        sourceType: 'MOCK',
        sourceProvider: 'Demo Railway Schedule Simulator (Mock)',
        lastUpdated: new Date().toISOString(),
        notes: 'High-speed modern train with onboard catering.'
      },
      {
        id: 'client-mock-train-12123',
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
        sourceProvider: 'Demo Railway Schedule Simulator (Mock)',
        lastUpdated: new Date().toISOString(),
        notes: 'Historic express service with scenic Bhor Ghat transit.'
      },
      {
        id: 'client-mock-train-12780',
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
        sourceProvider: 'Demo Railway Schedule Simulator (Mock)',
        lastUpdated: new Date().toISOString(),
        notes: 'Direct overnight rail corridor service.'
      },
      {
        id: 'client-mock-train-11007',
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
        availableSeats: 62,
        availabilityStatus: 'AVAILABLE',
        terminalDistanceMinsFromStation: 0,
        platformOrTerminal: 'Platform 3',
        seatOrClass: 'Second Sitting (2S)',
        sourceType: 'MOCK',
        sourceProvider: 'Demo Railway Schedule Simulator (Mock)',
        lastUpdated: new Date().toISOString(),
        notes: 'Regular morning intercity passenger service.'
      }
    ];
  }

  if (!q) return allTrains;
  return allTrains.filter(
    (t) =>
      t.serviceNumber.toLowerCase().includes(q) ||
      t.title.toLowerCase().includes(q) ||
      t.provider.toLowerCase().includes(q)
  );
}

function generateClientMockBuses(params: { origin?: string; destination?: string; date?: string; query?: string }): NormalizedTransportOption[] {
  const orig = params.origin?.trim() || 'Pune Swargate';
  const dest = params.destination?.trim() || 'Panaji (Goa)';
  const date = params.date || new Date().toISOString().split('T')[0];
  const q = (params.query || '').toLowerCase().trim();

  const allBuses: NormalizedTransportOption[] = [
    {
      id: 'client-mock-bus-ksrtc-9902',
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
      sourceProvider: 'Client Demo Simulator (Mock)',
      lastUpdated: new Date().toISOString(),
      notes: 'Highway express via NH48 with dedicated luggage space.'
    },
    {
      id: 'client-mock-bus-intrcity-4412',
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
      sourceProvider: 'Client Demo Simulator (Mock)',
      lastUpdated: new Date().toISOString(),
      notes: 'Onboard washroom, Wi-Fi, and live GPS tracking.'
    },
    {
      id: 'client-mock-bus-purple-9011',
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
      sourceProvider: 'Client Demo Simulator (Mock)',
      lastUpdated: new Date().toISOString(),
      notes: 'Comfortable overnight long-haul coach.'
    },
    {
      id: 'client-mock-bus-zing-302',
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
      sourceProvider: 'Client Demo Simulator (Mock)',
      lastUpdated: new Date().toISOString(),
      notes: 'Zero emissions EV luxury transit.'
    }
  ];

  if (!q) return allBuses;
  return allBuses.filter(
    (b) =>
      b.serviceNumber.toLowerCase().includes(q) ||
      b.title.toLowerCase().includes(q) ||
      b.provider.toLowerCase().includes(q)
  );
}

function generateClientMockFlights(params: { origin?: string; destination?: string; date?: string; query?: string }): NormalizedTransportOption[] {
  const orig = params.origin?.trim() || 'BOM (Mumbai)';
  const dest = params.destination?.trim() || 'GOI (Goa Dabolim)';
  const date = params.date || new Date().toISOString().split('T')[0];
  const q = (params.query || '').toLowerCase().trim();

  const allFlights: NormalizedTransportOption[] = [
    {
      id: 'client-mock-flight-indigo-5128',
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
      sourceProvider: 'Client Demo Simulator (Mock)',
      lastUpdated: new Date().toISOString(),
      notes: 'Non-stop scheduled domestic flight with fast turnaround.'
    },
    {
      id: 'client-mock-flight-airindia-804',
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
      sourceProvider: 'Client Demo Simulator (Mock)',
      lastUpdated: new Date().toISOString(),
      notes: 'Complimentary baggage allowance (15kg check-in).'
    },
    {
      id: 'client-mock-flight-fly91-1102',
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
      sourceProvider: 'Client Demo Simulator (Mock)',
      lastUpdated: new Date().toISOString(),
      notes: 'Direct intra-regional shuttle flight.'
    },
    {
      id: 'client-mock-flight-akasa-1402',
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
      sourceProvider: 'Client Demo Simulator (Mock)',
      lastUpdated: new Date().toISOString(),
      notes: 'Late evening non-stop flight.'
    }
  ];

  if (!q) return allFlights;
  return allFlights.filter(
    (f) =>
      f.serviceNumber.toLowerCase().includes(q) ||
      f.title.toLowerCase().includes(q) ||
      f.provider.toLowerCase().includes(q)
  );
}

export const transportApi = {
  async searchTrains(params: { origin?: string; destination?: string; date?: string; query?: string }): Promise<{ count: number; data: NormalizedTransportOption[] }> {
    try {
      const cleanParams: Record<string, string> = {};
      if (params.origin) cleanParams.origin = params.origin;
      if (params.destination) cleanParams.destination = params.destination;
      if (params.date) cleanParams.date = params.date;
      if (params.query) cleanParams.query = params.query;

      const qs = new URLSearchParams(cleanParams).toString();
      const res = await apiFetch<{ success: boolean; count: number; data: NormalizedTransportOption[] }>(`/transport/trains/search?${qs}`);
      if (res && Array.isArray(res.data) && res.data.length > 0) {
        return { count: res.data.length, data: res.data };
      }
      const fallback = generateClientMockTrains(params);
      return { count: fallback.length, data: fallback };
    } catch (err: any) {
      console.warn('[transportApi] Backend search failed or offline, falling back to mock simulator:', err.message);
      const fallback = generateClientMockTrains(params);
      return { count: fallback.length, data: fallback };
    }
  },

  async searchBuses(params: { origin?: string; destination?: string; date?: string; query?: string }): Promise<{ count: number; data: NormalizedTransportOption[] }> {
    try {
      const cleanParams: Record<string, string> = {};
      if (params.origin) cleanParams.origin = params.origin;
      if (params.destination) cleanParams.destination = params.destination;
      if (params.date) cleanParams.date = params.date;
      if (params.query) cleanParams.query = params.query;

      const qs = new URLSearchParams(cleanParams).toString();
      const res = await apiFetch<{ success: boolean; count: number; data: NormalizedTransportOption[] }>(`/transport/buses/search?${qs}`);
      if (res && Array.isArray(res.data) && res.data.length > 0) {
        return { count: res.data.length, data: res.data };
      }
      const fallback = generateClientMockBuses(params);
      return { count: fallback.length, data: fallback };
    } catch (err: any) {
      console.warn('[transportApi] Backend search failed or offline, falling back to mock simulator:', err.message);
      const fallback = generateClientMockBuses(params);
      return { count: fallback.length, data: fallback };
    }
  },

  async searchFlights(params: { origin?: string; destination?: string; date?: string; query?: string }): Promise<{ count: number; data: NormalizedTransportOption[] }> {
    try {
      const cleanParams: Record<string, string> = {};
      if (params.origin) cleanParams.origin = params.origin;
      if (params.destination) cleanParams.destination = params.destination;
      if (params.date) cleanParams.date = params.date;
      if (params.query) cleanParams.query = params.query;

      const qs = new URLSearchParams(cleanParams).toString();
      const res = await apiFetch<{ success: boolean; count: number; data: NormalizedTransportOption[] }>(`/transport/flights/search?${qs}`);
      if (res && Array.isArray(res.data) && res.data.length > 0) {
        return { count: res.data.length, data: res.data };
      }
      const fallback = generateClientMockFlights(params);
      return { count: fallback.length, data: fallback };
    } catch (err: any) {
      console.warn('[transportApi] Backend search failed or offline, falling back to mock simulator:', err.message);
      const fallback = generateClientMockFlights(params);
      return { count: fallback.length, data: fallback };
    }
  },

  async getLiveStatus(type: string, serviceNumber: string): Promise<{ success: boolean; data: NormalizedLiveStatus }> {
    return apiFetch(`/transport/${type}/${encodeURIComponent(serviceNumber)}/status`);
  },

  async syncTripTelemetry(tripId: string): Promise<{ success: boolean; message: string; data: JourneyBundleDTO }> {
    return apiFetch(`/transport/sync/${encodeURIComponent(tripId)}`, {
      method: 'POST'
    });
  }
};
