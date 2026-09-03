import { TransportSegment } from '../../types';

export interface TransportOptionWithCost extends TransportSegment {
  fareRupees: number;
  availableSeats: number;
  terminalDistanceMinsFromStation: number;
}

export const MOCK_AVAILABLE_TRANSPORT_OPTIONS: TransportOptionWithCost[] = [
  // ================= TRAINS =================
  {
    id: 'opt-train-12127-delayed',
    type: 'TRAIN',
    provider: 'Indian Railways (CR)',
    serviceNumber: '12127 Intercity SF Express (Active Train)',
    origin: 'Mumbai CSMT',
    destination: 'Pune Junction',
    from: 'Mumbai CSMT',
    to: 'Pune Junction',
    scheduledDeparture: '10:00 AM',
    scheduledArrival: '1:30 PM',
    departureTime: '10:00 AM',
    estimatedArrival: '4:50 PM',
    status: 'DELAYED',
    delayMinutes: 200,
    fareRupees: 240,
    availableSeats: 0, // already onboard
    terminalDistanceMinsFromStation: 0,
    platformOrTerminal: 'Platform 4',
    seatOrClass: 'Coach B2 - 44 (AC Chair)',
    dataSource: 'TRAIN API • VERIFIED',
    notes: 'Passenger is currently aboard this train.'
  },
  {
    id: 'opt-train-12780',
    type: 'TRAIN',
    provider: 'Indian Railways (SWR)',
    serviceNumber: '12780 Goa Express',
    origin: 'Pune Junction',
    destination: 'Madgaon (Goa)',
    from: 'Pune Junction',
    to: 'Madgaon (Goa)',
    scheduledDeparture: '6:00 PM',
    scheduledArrival: '4:30 AM',
    departureTime: '6:00 PM',
    estimatedArrival: '4:30 AM',
    status: 'ON_TIME',
    delayMinutes: 0,
    fareRupees: 490,
    availableSeats: 6,
    terminalDistanceMinsFromStation: 0,
    platformOrTerminal: 'Platform 2',
    seatOrClass: '3A AC Sleeper',
    dataSource: 'TRAIN API • VERIFIED',
    notes: 'Overnight ground service directly from Pune platform.'
  },

  // ================= BUSES =================
  {
    id: 'opt-bus-ksrtc-9902',
    type: 'BUS',
    provider: 'KSRTC Airavat Club Class (Premium)',
    serviceNumber: 'KA-9902 Multi-Axle Diamond Class',
    origin: 'Pune Railway Bus Bay',
    destination: 'Panaji (Goa)',
    from: 'Pune Railway Bus Bay',
    to: 'Panaji (Goa)',
    scheduledDeparture: '5:30 PM',
    scheduledArrival: '11:40 PM',
    departureTime: '5:30 PM',
    estimatedArrival: '11:40 PM',
    status: 'ON_TIME',
    delayMinutes: 0,
    fareRupees: 1000,
    availableSeats: 4,
    terminalDistanceMinsFromStation: 10, // 10 min walk to station bus bay
    platformOrTerminal: 'Bay 1, Station Approach',
    seatOrClass: 'Single Luxury Berth',
    dataSource: 'BUS API • VERIFIED',
    notes: 'Departs adjacent to Pune Station. Optimal transfer buffer.'
  },
  {
    id: 'opt-bus-purple-9011',
    type: 'BUS',
    provider: 'Purple Travels Economy',
    serviceNumber: 'PT-9011 Direct Sleeper Bus',
    origin: 'Pune Swargate',
    destination: 'Panaji (Goa)',
    from: 'Pune Swargate',
    to: 'Panaji (Goa)',
    scheduledDeparture: '6:30 PM',
    scheduledArrival: '1:30 AM',
    departureTime: '6:30 PM',
    estimatedArrival: '1:30 AM',
    status: 'ON_TIME',
    delayMinutes: 0,
    fareRupees: 630,
    availableSeats: 8,
    terminalDistanceMinsFromStation: 25, // 25 min transfer to Swargate
    platformOrTerminal: 'Platform B, Swargate Bus Station',
    seatOrClass: 'Lower Berth L7',
    dataSource: 'BUS API • VERIFIED',
    notes: 'Lowest cost option with late-night hotel arrival.'
  },
  {
    id: 'opt-bus-intrcity-4412',
    type: 'BUS',
    provider: 'IntrCity SmartBus',
    serviceNumber: 'IC-4412 AC Sleeper Lounge',
    origin: 'Pune Station',
    destination: 'Panaji (Goa)',
    from: 'Pune Station',
    to: 'Panaji (Goa)',
    scheduledDeparture: '8:00 PM',
    scheduledArrival: '3:00 AM',
    departureTime: '8:00 PM',
    estimatedArrival: '3:00 AM',
    status: 'ON_TIME',
    delayMinutes: 0,
    fareRupees: 810,
    availableSeats: 6,
    terminalDistanceMinsFromStation: 15,
    platformOrTerminal: 'IntrCity Boarding Lounge, Station Rd',
    seatOrClass: 'Captains Club Berth',
    dataSource: 'BUS API • VERIFIED',
    notes: 'Late evening departure with extra waiting buffer.'
  },

  // ================= FLIGHTS =================
  {
    id: 'opt-flight-indigo-5128',
    type: 'FLIGHT',
    provider: 'IndiGo Airlines',
    serviceNumber: '6E-5128 Airbus A320 Direct',
    origin: 'Mumbai (BOM)',
    destination: 'Goa (GOI)',
    from: 'Mumbai (BOM)',
    to: 'Goa (GOI)',
    scheduledDeparture: '7:00 PM',
    scheduledArrival: '8:15 PM',
    departureTime: '7:00 PM',
    estimatedArrival: '8:15 PM',
    status: 'ON_TIME',
    delayMinutes: 0,
    fareRupees: 3400,
    availableSeats: 3,
    terminalDistanceMinsFromStation: 60, // Transit to airport
    platformOrTerminal: 'Terminal 2, Gate 42A',
    seatOrClass: 'Economy 14F',
    dataSource: 'FLIGHT API • VERIFIED',
    notes: 'Emergency air transport. Fastest arrival into Goa.'
  },
  {
    id: 'opt-flight-fly91-1102',
    type: 'FLIGHT',
    provider: 'Fly91 Regional Air',
    serviceNumber: 'IC-1102 ATR-72 Express',
    origin: 'Pune (PNQ)',
    destination: 'Goa (GOX)',
    from: 'Pune (PNQ)',
    to: 'Goa (GOX)',
    scheduledDeparture: '6:15 PM',
    scheduledArrival: '7:25 PM',
    departureTime: '6:15 PM',
    estimatedArrival: '7:25 PM',
    status: 'ON_TIME',
    delayMinutes: 0,
    fareRupees: 2800,
    availableSeats: 2,
    terminalDistanceMinsFromStation: 40, // Transit from Pune Jn to Lohegaon Airport
    platformOrTerminal: 'Terminal 1, Bay 3',
    seatOrClass: 'Seat 8B',
    dataSource: 'FLIGHT API • VERIFIED',
    notes: 'Regional flight connection from Pune Lohegaon Airport.'
  }
];
