import { TransportSegment } from '../types';

export interface BusTelemetry {
  busService: string;
  operator: string;
  departureStation: string;
  status: 'SCHEDULED_ON_TIME' | 'AT_RISK_OF_NO_SHOW' | 'MISSED_BY_PASSENGER';
  depotCheckIn: string;
  gateOrBay: string;
  pnrStatus: string;
  operatorContact: string;
}

export class MockBusService {
  public static getInitialSegment(): TransportSegment {
    return {
      id: 'seg-bus-02',
      type: 'BUS',
      provider: 'Purple Travels Intercity',
      serviceNumber: 'PT-8842 Multi-Axle Volvo AC Sleeper',
      from: 'Pune Swargate',
      to: 'Panaji (Goa)',
      departureTime: '5:00 PM',
      scheduledArrival: '11:00 PM',
      estimatedArrival: '11:00 PM',
      status: 'ON_TIME',
      delayMinutes: 0,
      bufferMinutes: 210, // 3h 30m safe transfer window
      risk: 'LOW',
      dataSource: 'BUS API • DEMO DATA',
      notes: 'Swargate Terminal Bay 3 • Seat Upper Berth U4',
      isDisrupted: false,
      platformOrTerminal: 'Bay 3, Swargate',
      seatOrClass: 'Upper Sleeper U4'
    };
  }

  public static getDisruptedSegment(): TransportSegment {
    return {
      id: 'seg-bus-02',
      type: 'BUS',
      provider: 'Purple Travels Intercity',
      serviceNumber: 'PT-8842 Multi-Axle Volvo AC Sleeper',
      from: 'Pune Swargate',
      to: 'Panaji (Goa)',
      departureTime: '5:00 PM',
      scheduledArrival: '11:00 PM',
      estimatedArrival: '11:00 PM (Bus departs without passenger)',
      status: 'MISSED',
      delayMinutes: 0,
      bufferMinutes: -10,
      risk: 'CRITICAL',
      dataSource: 'BUS API • DEMO DATA',
      notes: 'Departure at 5:00 PM will occur before feeder train arrives (4:50 PM + 20m transfer to Swargate).',
      isDisrupted: true,
      platformOrTerminal: 'Bay 3, Swargate',
      seatOrClass: 'Upper Sleeper U4'
    };
  }

  public static getTelemetry(isDisrupted: boolean): BusTelemetry {
    return {
      busService: 'PT-8842 Volvo Multi-Axle AC Sleeper',
      operator: 'Purple Travels Pvt Ltd',
      departureStation: 'Swargate Private Bus Terminal, Pune',
      status: isDisrupted ? 'AT_RISK_OF_NO_SHOW' : 'SCHEDULED_ON_TIME',
      depotCheckIn: 'Vehicle inspected & assigned to Platform Bay 3',
      gateOrBay: 'Bay 3',
      pnrStatus: 'Confirmed (Ticket #PT99201)',
      operatorContact: '+91 20 2444 8888 (Pune Swargate Desk)'
    };
  }
}
