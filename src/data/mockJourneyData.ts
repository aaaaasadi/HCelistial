import { Trip, DemoScenarioId, TransportSegment, HotelSegment, ActivitySegment } from '../types';

export const BASE_HOTEL_SEGMENT: HotelSegment = {
  id: 'seg-hotel-goa',
  type: 'HOTEL',
  name: 'Casa Ocean Retreat & Spa',
  location: 'Candolim Beach Road, North Goa',
  checkInTime: '11:00 PM',
  status: 'CONFIRMED',
  bookingRef: 'BKG-GOA-78291',
  dataSource: 'HOTEL GDS • CONFIRMED',
  bookingStatus: 'CONFIRMED',
  roomType: 'Deluxe Sea View Suite (Pre-Paid)',
  notes: 'Late check-in policy: Holds room until 12:00 AM unless notified.'
};

export const BASE_ACTIVITY_SEGMENT: ActivitySegment = {
  id: 'seg-activity-goa',
  type: 'ACTIVITY',
  name: 'Grand Island Scuba Dive & Dolphin Safari',
  location: 'Sinquerim Jetty, North Goa',
  startTime: 'Tomorrow • 9:00 AM',
  status: 'CONFIRMED',
  bookingRef: 'ACT-SCUBA-4410',
  dataSource: 'ACTIVITY GDS • CONFIRMED',
  bookingStatus: 'CONFIRMED',
  notes: 'Report to jetty at 8:30 AM. Non-refundable after 6:00 PM today.'
};

export function getScenarioTrip(scenarioId: DemoScenarioId): Trip {
  switch (scenarioId) {
    case 'SCENARIO_2_TRAIN_DELAY': {
      // Moderate delay: 45 min delay on train
      const train: TransportSegment = {
        id: 'seg-train-mumbai-pune',
        type: 'TRAIN',
        provider: 'Indian Railways (CR)',
        serviceNumber: '12127 Intercity SF Express',
        origin: 'Mumbai CSMT',
        destination: 'Pune Junction',
        scheduledDeparture: '10:00 AM',
        scheduledArrival: '1:30 PM',
        departureTime: '10:00 AM',
        estimatedArrival: '2:15 PM',
        status: 'DELAYED',
        delayMinutes: 45,
        bookingStatus: 'CONFIRMED',
        dataSource: 'TRAIN API • VERIFIED',
        platformOrTerminal: 'Platform 4',
        seatOrClass: 'Coach B2 - 44 (AC Chair)',
        notes: 'Track speed restriction of 40 km/h between Monkey Hill & Khandala.'
      };

      const bus: TransportSegment = {
        id: 'seg-bus-pune-goa',
        type: 'BUS',
        provider: 'Purple Travels Intercity',
        serviceNumber: 'PT-8842 Multi-Axle Volvo AC Sleeper',
        origin: 'Pune Swargate',
        destination: 'Panaji (Goa)',
        scheduledDeparture: '5:00 PM',
        scheduledArrival: '11:00 PM',
        departureTime: '5:00 PM',
        estimatedArrival: '11:00 PM',
        status: 'ON_TIME',
        delayMinutes: 0,
        bookingStatus: 'CONFIRMED',
        dataSource: 'BUS API • VERIFIED',
        platformOrTerminal: 'Bay 3, Swargate',
        seatOrClass: 'Upper Berth U4'
      };

      return {
        id: 'trip-mum-pune-goa',
        title: 'Mumbai → Pune → Goa Weekend Expedition',
        origin: 'Mumbai CSMT',
        destination: 'Panaji, Goa',
        startDate: 'Today',
        endDate: 'Tomorrow',
        status: 'AT_RISK',
        segments: [train, bus, BASE_HOTEL_SEGMENT, BASE_ACTIVITY_SEGMENT]
      };
    }

    case 'SCENARIO_3_SEVERE_DELAY':
    case 'SCENARIO_5_MISSED_CONNECTION': {
      // Severe delay: 200 min (3h 20m) delay causing missed bus
      const train: TransportSegment = {
        id: 'seg-train-mumbai-pune',
        type: 'TRAIN',
        provider: 'Indian Railways (CR)',
        serviceNumber: '12127 Intercity SF Express',
        origin: 'Mumbai CSMT',
        destination: 'Pune Junction',
        scheduledDeparture: '10:00 AM',
        scheduledArrival: '1:30 PM',
        departureTime: '10:00 AM',
        estimatedArrival: '4:50 PM',
        status: 'DELAYED',
        delayMinutes: 200,
        bookingStatus: 'CONFIRMED',
        dataSource: 'TRAIN API • VERIFIED',
        platformOrTerminal: 'Platform 4',
        seatOrClass: 'Coach B2 - 44 (AC Chair)',
        isDisrupted: true,
        notes: 'Locomotive traction breakdown and signaling block near Lonavala.'
      };

      const bus: TransportSegment = {
        id: 'seg-bus-pune-goa',
        type: 'BUS',
        provider: 'Purple Travels Intercity',
        serviceNumber: 'PT-8842 Multi-Axle Volvo AC Sleeper',
        origin: 'Pune Swargate',
        destination: 'Panaji (Goa)',
        scheduledDeparture: '5:00 PM',
        scheduledArrival: '11:00 PM',
        departureTime: '5:00 PM',
        estimatedArrival: '11:00 PM (Departed Without Passenger)',
        status: 'MISSED',
        delayMinutes: 0,
        bookingStatus: 'AT_RISK',
        dataSource: 'BUS API • VERIFIED',
        platformOrTerminal: 'Bay 3, Swargate',
        seatOrClass: 'Upper Berth U4',
        isDisrupted: true,
        notes: 'Cannot be reached before 5:00 PM departure.'
      };

      const hotel: HotelSegment = {
        ...BASE_HOTEL_SEGMENT,
        status: 'LATE_CHECKIN_ALERT'
      };

      const activity: ActivitySegment = {
        ...BASE_ACTIVITY_SEGMENT,
        status: 'AT_RISK'
      };

      return {
        id: 'trip-mum-pune-goa',
        title: 'Mumbai → Pune → Goa Weekend Expedition',
        origin: 'Mumbai CSMT',
        destination: 'Panaji, Goa',
        startDate: 'Today',
        endDate: 'Tomorrow',
        status: 'DISRUPTED',
        segments: [train, bus, hotel, activity]
      };
    }

    case 'SCENARIO_4_BUS_CANCELLED': {
      // Train on time, bus cancelled by operator
      const train: TransportSegment = {
        id: 'seg-train-mumbai-pune',
        type: 'TRAIN',
        provider: 'Indian Railways (CR)',
        serviceNumber: '12127 Intercity SF Express',
        origin: 'Mumbai CSMT',
        destination: 'Pune Junction',
        scheduledDeparture: '10:00 AM',
        scheduledArrival: '1:30 PM',
        departureTime: '10:00 AM',
        estimatedArrival: '1:30 PM',
        status: 'ON_TIME',
        delayMinutes: 0,
        bookingStatus: 'CONFIRMED',
        dataSource: 'TRAIN API • VERIFIED',
        platformOrTerminal: 'Platform 4',
        seatOrClass: 'Coach B2 - 44 (AC Chair)'
      };

      const bus: TransportSegment = {
        id: 'seg-bus-pune-goa',
        type: 'BUS',
        provider: 'Purple Travels Intercity',
        serviceNumber: 'PT-8842 Multi-Axle Volvo AC Sleeper',
        origin: 'Pune Swargate',
        destination: 'Panaji (Goa)',
        scheduledDeparture: '5:00 PM',
        scheduledArrival: '11:00 PM',
        departureTime: '5:00 PM',
        estimatedArrival: 'CANCELLED',
        status: 'CANCELLED',
        delayMinutes: 0,
        bookingStatus: 'CANCELLED',
        dataSource: 'BUS API • VERIFIED',
        platformOrTerminal: 'Bay 3, Swargate',
        seatOrClass: 'Upper Berth U4',
        isDisrupted: true,
        notes: 'Operator cancelled departure due to vehicle mechanical failure.'
      };

      return {
        id: 'trip-mum-pune-goa',
        title: 'Mumbai → Pune → Goa Weekend Expedition',
        origin: 'Mumbai CSMT',
        destination: 'Panaji, Goa',
        startDate: 'Today',
        endDate: 'Tomorrow',
        status: 'DISRUPTED',
        segments: [train, bus, BASE_HOTEL_SEGMENT, BASE_ACTIVITY_SEGMENT]
      };
    }

    case 'SCENARIO_6_RECOVERED': {
      // Reconstructed route with replacement bus connector
      const train: TransportSegment = {
        id: 'seg-train-mumbai-pune',
        type: 'TRAIN',
        provider: 'Indian Railways (CR)',
        serviceNumber: '12127 Intercity SF Express',
        origin: 'Mumbai CSMT',
        destination: 'Pune Junction',
        scheduledDeparture: '10:00 AM',
        scheduledArrival: '1:30 PM',
        departureTime: '10:00 AM',
        estimatedArrival: '4:50 PM',
        status: 'RECOVERED',
        delayMinutes: 200,
        bookingStatus: 'RECOVERED',
        dataSource: 'TRAIN API • VERIFIED',
        platformOrTerminal: 'Platform 4',
        seatOrClass: 'Coach B2 - 44 (AC Chair)',
        notes: 'Delay absorbed via automated intermodal connector dispatch.'
      };

      const replacementBus: TransportSegment = {
        id: 'seg-bus-pune-goa-recovered',
        type: 'BUS',
        provider: 'KSRTC Airavat Club Class (Replacement)',
        serviceNumber: 'KA-9902 Multi-Axle Diamond Class',
        origin: 'Pune Railway Bus Bay',
        destination: 'Panaji (Goa)',
        scheduledDeparture: '5:30 PM',
        scheduledArrival: '11:40 PM',
        departureTime: '5:30 PM',
        estimatedArrival: '11:40 PM',
        status: 'RECOVERED',
        delayMinutes: 0,
        bookingStatus: 'CONFIRMED',
        dataSource: 'BUS API • VERIFIED',
        platformOrTerminal: 'Bay 1, Station Approach',
        seatOrClass: 'Seat 12A (Single Luxury)',
        isReplacement: true,
        notes: '✓ Confirmed under TravelRescue Guarantee. Preserves hotel reservation.'
      };

      const hotel: HotelSegment = {
        ...BASE_HOTEL_SEGMENT,
        status: 'PRESERVED'
      };

      const activity: ActivitySegment = {
        ...BASE_ACTIVITY_SEGMENT,
        status: 'PRESERVED'
      };

      return {
        id: 'trip-mum-pune-goa',
        title: 'Mumbai → Pune → Goa Weekend Expedition',
        origin: 'Mumbai CSMT',
        destination: 'Panaji, Goa',
        startDate: 'Today',
        endDate: 'Tomorrow',
        status: 'RECOVERED',
        segments: [train, replacementBus, hotel, activity]
      };
    }

    case 'SCENARIO_1_NORMAL':
    default: {
      const train: TransportSegment = {
        id: 'seg-train-mumbai-pune',
        type: 'TRAIN',
        provider: 'Indian Railways (CR)',
        serviceNumber: '12127 Intercity SF Express',
        origin: 'Mumbai CSMT',
        destination: 'Pune Junction',
        scheduledDeparture: '10:00 AM',
        scheduledArrival: '1:30 PM',
        departureTime: '10:00 AM',
        estimatedArrival: '1:30 PM',
        status: 'ON_TIME',
        delayMinutes: 0,
        bookingStatus: 'CONFIRMED',
        dataSource: 'TRAIN API • VERIFIED',
        platformOrTerminal: 'Platform 4',
        seatOrClass: 'Coach B2 - 44 (AC Chair)',
        notes: 'On time. Clear tracks reported across Bhor Ghat.'
      };

      const bus: TransportSegment = {
        id: 'seg-bus-pune-goa',
        type: 'BUS',
        provider: 'Purple Travels Intercity',
        serviceNumber: 'PT-8842 Multi-Axle Volvo AC Sleeper',
        origin: 'Pune Swargate',
        destination: 'Panaji (Goa)',
        scheduledDeparture: '5:00 PM',
        scheduledArrival: '11:00 PM',
        departureTime: '5:00 PM',
        estimatedArrival: '11:00 PM',
        status: 'ON_TIME',
        delayMinutes: 0,
        bookingStatus: 'CONFIRMED',
        dataSource: 'BUS API • VERIFIED',
        platformOrTerminal: 'Bay 3, Swargate',
        seatOrClass: 'Upper Berth U4',
        notes: 'Vehicle pre-inspected and assigned to bay.'
      };

      return {
        id: 'trip-mum-pune-goa',
        title: 'Mumbai → Pune → Goa Weekend Expedition',
        origin: 'Mumbai CSMT',
        destination: 'Panaji, Goa',
        startDate: 'Today',
        endDate: 'Tomorrow',
        status: 'ON_TRACK',
        segments: [train, bus, BASE_HOTEL_SEGMENT, BASE_ACTIVITY_SEGMENT]
      };
    }
  }
}
