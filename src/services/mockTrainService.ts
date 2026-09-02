import { TransportSegment } from '../types';

export interface TrainTelemetry {
  trainNumber: string;
  trainName: string;
  currentStation: string;
  nextStation: string;
  speedKmh: number;
  pnrStatus: string;
  signalState: 'CLEAR' | 'CAUTION' | 'STOP_SIGNAL_FAILURE';
  lastPing: string;
  nextCheck: string;
  provider: string;
}

export class MockTrainService {
  public static getInitialSegment(): TransportSegment {
    return {
      id: 'seg-train-01',
      type: 'TRAIN',
      provider: 'Indian Railways (CR)',
      serviceNumber: '12127 Intercity SF Express',
      from: 'Mumbai CSMT',
      to: 'Pune Junction',
      departureTime: '10:00 AM',
      scheduledArrival: '1:30 PM',
      estimatedArrival: '1:30 PM',
      status: 'ON_TIME',
      delayMinutes: 0,
      bufferMinutes: 210, // 3h 30m before 5:00 PM bus
      risk: 'LOW',
      dataSource: 'TRAIN API • DEMO DATA',
      notes: 'Platform 4 • Coach B2, Seat 44 (AC Chair Car)',
      isDisrupted: false,
      platformOrTerminal: 'Platform 4',
      seatOrClass: 'Coach B2 - 44 (AC Chair)'
    };
  }

  public static getDisruptedSegment(): TransportSegment {
    return {
      id: 'seg-train-01',
      type: 'TRAIN',
      provider: 'Indian Railways (CR)',
      serviceNumber: '12127 Intercity SF Express',
      from: 'Mumbai CSMT',
      to: 'Pune Junction',
      departureTime: '10:00 AM',
      scheduledArrival: '1:30 PM',
      estimatedArrival: '4:50 PM',
      status: 'DELAYED',
      delayMinutes: 200, // 3h 20m
      bufferMinutes: -10, // -10m connection buffer
      risk: 'CRITICAL',
      dataSource: 'TRAIN API • DEMO DATA',
      notes: 'Signaling and traction failure between Karjat and Lonavala ghat section',
      isDisrupted: true,
      platformOrTerminal: 'Platform 4',
      seatOrClass: 'Coach B2 - 44 (AC Chair)'
    };
  }

  public static getTelemetry(isDisrupted: boolean): TrainTelemetry {
    const now = new Date();
    return {
      trainNumber: '12127',
      trainName: 'Intercity SF Express',
      currentStation: isDisrupted ? 'Karjat Outskirts (KM 108.4)' : 'Kalyan Junction',
      nextStation: isDisrupted ? 'Lonavala (Delayed Track)' : 'Karjat Junction',
      speedKmh: isDisrupted ? 12 : 88,
      pnrStatus: 'CNF (Confirmed)',
      signalState: isDisrupted ? 'STOP_SIGNAL_FAILURE' : 'CLEAR',
      lastPing: '30 seconds ago',
      nextCheck: 'In 2 minutes 30 seconds',
      provider: 'CR Centralized Train Management System'
    };
  }
}
