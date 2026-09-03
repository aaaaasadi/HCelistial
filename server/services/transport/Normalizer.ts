import {
  NormalizedTransportOption,
  NormalizedLiveStatus,
  TransportOperationalStatus,
  AvailabilityStatus
} from './interfaces/ITransportProvider';
import { TransportOptionWithCost } from '../../../src/services/recovery/transportOptionsData';

export class Normalizer {
  /**
   * Normalizes an Indian Railways / RailAPI live train tracking payload into canonical NormalizedLiveStatus.
   */
  public static normalizeTrainLiveStatus(
    raw: any,
    trainNumber: string,
    sourceType: 'REAL' | 'MOCK' = 'REAL',
    sourceProvider: string = 'Indian Railways API'
  ): NormalizedLiveStatus {
    if (!raw) {
      throw new Error(`Invalid raw train live status payload for ${trainNumber}`);
    }

    const delayMinutes = typeof raw.delayMinutes === 'number'
      ? raw.delayMinutes
      : parseInt(raw.late_minutes || raw.delay || '0', 10) || 0;

    let status: TransportOperationalStatus = 'ON_TIME';
    if (raw.cancelled || raw.is_cancelled) {
      status = 'CANCELLED';
    } else if (raw.diverted || raw.is_diverted) {
      status = 'DIVERTED';
    } else if (delayMinutes > 15) {
      status = 'DELAYED';
    }

    return {
      serviceNumber: raw.train_number || raw.trainNumber || trainNumber,
      transportType: 'TRAIN',
      status,
      delayMinutes,
      scheduledDeparture: raw.scheduled_departure || raw.scheduledDeparture || '10:00 AM',
      scheduledArrival: raw.scheduled_arrival || raw.scheduledArrival || '1:30 PM',
      expectedDeparture: raw.expected_departure || raw.expectedDeparture || raw.scheduled_departure || '10:00 AM',
      expectedArrival: raw.expected_arrival || raw.expectedArrival || raw.scheduled_arrival || '1:30 PM',
      currentLocation: raw.current_station_name || raw.currentStation || raw.location || 'En Route',
      nextStop: raw.next_station_name || raw.nextStation || undefined,
      platformOrBay: raw.platform ? `Platform ${raw.platform}` : undefined,
      speedKmh: typeof raw.speed === 'number' ? raw.speed : undefined,
      lastPing: raw.last_updated || raw.lastPing || 'Just now',
      lastUpdated: new Date().toISOString(),
      reason: raw.delay_reason || raw.reason || (delayMinutes > 30 ? 'Operational delay on route' : undefined),
      sourceType,
      sourceProvider,
      rawPayload: raw
    };
  }

  /**
   * Normalizes an Indian Railways search payload into canonical NormalizedTransportOption.
   */
  public static normalizeTrainOption(
    raw: any,
    sourceType: 'REAL' | 'MOCK' = 'REAL',
    sourceProvider: string = 'Indian Railways Live RailAPI'
  ): NormalizedTransportOption {
    const delayMinutes = parseInt(raw.delay_minutes || raw.delayMinutes || '0', 10) || 0;
    let status: TransportOperationalStatus = 'ON_TIME';
    if (raw.is_cancelled || raw.cancelled) {
      status = 'CANCELLED';
    } else if (delayMinutes > 15) {
      status = 'DELAYED';
    }

    const fare = typeof raw.fare === 'number' ? raw.fare : parseInt(raw.price || raw.ticket_price || '240', 10) || 240;
    const availableSeats = typeof raw.available_seats === 'number' ? raw.available_seats : typeof raw.availableSeats === 'number' ? raw.availableSeats : null;
    const availabilityStatus: AvailabilityStatus = availableSeats !== null ? (availableSeats > 0 ? 'AVAILABLE' : 'UNAVAILABLE') : 'UNKNOWN';

    return {
      id: raw.id || `train-${raw.train_number || raw.serviceNumber || Math.random().toString(36).substring(7)}`,
      type: 'TRAIN',
      provider: raw.provider || 'Indian Railways',
      serviceNumber: `${raw.train_number || ''} ${raw.train_name || raw.serviceNumber || 'Express'}`.trim(),
      title: raw.train_name || raw.title || 'Superfast Express',
      origin: raw.from_station_name || raw.origin || raw.from || 'Origin Station',
      destination: raw.to_station_name || raw.destination || raw.to || 'Destination Station',
      travelDate: raw.date || raw.travelDate,
      scheduledDeparture: raw.departure_time || raw.scheduledDeparture || '10:00 AM',
      scheduledArrival: raw.arrival_time || raw.scheduledArrival || '1:30 PM',
      expectedDeparture: raw.expected_departure || raw.departure_time || '10:00 AM',
      expectedArrival: raw.expected_arrival || raw.arrival_time || '1:30 PM',
      duration: raw.duration || raw.travel_time,
      status,
      delayMinutes,
      fareRupees: fare,
      availableSeats,
      availabilityStatus,
      terminalDistanceMinsFromStation: 0,
      platformOrTerminal: raw.platform ? `Platform ${raw.platform}` : 'Platform 1',
      seatOrClass: raw.class || raw.seatOrClass || 'AC Chair Car (CC)',
      sourceType,
      sourceProvider,
      lastUpdated: new Date().toISOString(),
      notes: raw.notes || `Daily scheduled train service via ${raw.from_station_name || 'Station'}`
    };
  }

  /**
   * Normalizes an Intercity Bus tracking or search payload (e.g. AOPAY / RedBus schema).
   */
  public static normalizeBusOption(
    raw: any,
    sourceType: 'REAL' | 'MOCK' = 'REAL',
    sourceProvider: string = 'Intercity Bus API'
  ): NormalizedTransportOption {
    const fare = typeof raw.fare === 'number' ? raw.fare : parseFloat(raw.price || raw.ticket_price || '0') || 850;
    
    // Seat availability determination
    let availabilityStatus: AvailabilityStatus = 'UNKNOWN';
    let availableSeats: number | null = null;
    if (typeof raw.available_seats === 'number') {
      availableSeats = raw.available_seats;
      availabilityStatus = availableSeats > 0 ? 'AVAILABLE' : 'UNAVAILABLE';
    } else if (typeof raw.seatsAvailable === 'number') {
      availableSeats = raw.seatsAvailable;
      availabilityStatus = availableSeats > 0 ? 'AVAILABLE' : 'UNAVAILABLE';
    }

    const delayMinutes = parseInt(raw.delay_minutes || raw.delayMinutes || '0', 10) || 0;
    let status: TransportOperationalStatus = 'ON_TIME';
    if (raw.is_cancelled || raw.cancelled) {
      status = 'CANCELLED';
    } else if (delayMinutes > 15) {
      status = 'DELAYED';
    }

    return {
      id: raw.id || `bus-${raw.service_number || Math.random().toString(36).substring(7)}`,
      type: 'BUS',
      provider: raw.operator_name || raw.operator || raw.provider || 'Intercity Express Bus',
      serviceNumber: raw.service_number || raw.bus_number || raw.serviceNumber || 'BUS-EXP',
      title: `${raw.operator_name || raw.operator || 'Bus'} (${raw.bus_type || 'AC Sleeper'})`,
      origin: raw.origin || raw.from_city || raw.from || 'Origin Depot',
      destination: raw.destination || raw.to_city || raw.to || 'Destination Terminal',
      travelDate: raw.date || raw.travelDate,
      scheduledDeparture: raw.scheduled_departure || raw.departure_time || raw.departureTime || '5:00 PM',
      scheduledArrival: raw.scheduled_arrival || raw.arrival_time || raw.arrivalTime || '11:00 PM',
      expectedDeparture: raw.expected_departure || raw.departure_time || '5:00 PM',
      expectedArrival: raw.expected_arrival || raw.arrival_time || '11:00 PM',
      duration: raw.duration,
      status,
      delayMinutes,
      fareRupees: fare,
      availableSeats,
      availabilityStatus,
      terminalDistanceMinsFromStation: typeof raw.terminal_distance_mins === 'number' ? raw.terminal_distance_mins : 15,
      platformOrTerminal: raw.boarding_point || raw.bay ? `Bay ${raw.bay || raw.boarding_point}` : 'Bay 1',
      seatOrClass: raw.bus_type || 'AC Sleeper',
      sourceType,
      sourceProvider,
      lastUpdated: new Date().toISOString(),
      notes: raw.amenities ? `Amenities: ${Array.isArray(raw.amenities) ? raw.amenities.join(', ') : raw.amenities}` : undefined,
      rawPayload: raw
    };
  }

  /**
   * Normalizes an Aviation tracker payload (e.g. AviationStack / OpenSky).
   */
  public static normalizeFlightOption(
    raw: any,
    sourceType: 'REAL' | 'MOCK' = 'REAL',
    sourceProvider: string = 'Aviation Flight API'
  ): NormalizedTransportOption {
    const fare = typeof raw.price === 'number' ? raw.price : parseFloat(raw.fare || '3500') || 3500;
    
    let availabilityStatus: AvailabilityStatus = 'UNKNOWN';
    let availableSeats: number | null = null;
    if (typeof raw.available_seats === 'number') {
      availableSeats = raw.available_seats;
      availabilityStatus = availableSeats > 0 ? 'AVAILABLE' : 'UNAVAILABLE';
    }

    const delayMinutes = parseInt(raw.departure_delay || raw.delayMinutes || '0', 10) || 0;
    let status: TransportOperationalStatus = 'ON_TIME';
    if (raw.flight_status === 'cancelled' || raw.is_cancelled) {
      status = 'CANCELLED';
    } else if (delayMinutes > 15) {
      status = 'DELAYED';
    }

    return {
      id: raw.id || `flight-${raw.flight_number || Math.random().toString(36).substring(7)}`,
      type: 'FLIGHT',
      provider: raw.airline || raw.airline_name || 'Commercial Airline',
      serviceNumber: raw.flight_number || raw.flight_iata || raw.serviceNumber || 'FLIGHT-001',
      title: `${raw.airline || 'Flight'} ${raw.flight_number || ''}`,
      origin: raw.origin || raw.departure_airport || 'Airport Origin',
      destination: raw.destination || raw.arrival_airport || 'Airport Destination',
      travelDate: raw.date || raw.travelDate,
      scheduledDeparture: raw.scheduled_departure || raw.departure_time || '8:00 PM',
      scheduledArrival: raw.scheduled_arrival || raw.arrival_time || '9:30 PM',
      expectedDeparture: raw.expected_departure || raw.departure_time || '8:00 PM',
      expectedArrival: raw.expected_arrival || raw.arrival_time || '9:30 PM',
      duration: raw.duration,
      status,
      delayMinutes,
      fareRupees: fare,
      availableSeats,
      availabilityStatus,
      terminalDistanceMinsFromStation: typeof raw.terminal_distance_mins === 'number' ? raw.terminal_distance_mins : 35,
      platformOrTerminal: raw.terminal ? `Terminal ${raw.terminal}` : 'Terminal 2',
      seatOrClass: raw.seat_class || 'Economy Flex',
      sourceType,
      sourceProvider,
      lastUpdated: new Date().toISOString(),
      notes: raw.aircraft ? `Aircraft: ${raw.aircraft}` : undefined,
      rawPayload: raw
    };
  }

  /**
   * Converts a collection of canonical NormalizedTransportOptions to TransportOptionWithCost
   * so the existing RecoveryEngine can calculate feasibility and score recovery plans.
   */
  public static toRecoveryTransportOption(option: NormalizedTransportOption): TransportOptionWithCost {
    return {
      id: option.id,
      type: option.type,
      provider: option.provider,
      serviceNumber: option.serviceNumber,
      origin: option.origin,
      destination: option.destination,
      from: option.origin,
      to: option.destination,
      scheduledDeparture: option.scheduledDeparture,
      scheduledArrival: option.scheduledArrival,
      departureTime: option.scheduledDeparture,
      estimatedArrival: option.expectedArrival,
      status: option.status === 'CANCELLED' ? 'CANCELLED' : option.delayMinutes > 0 ? 'DELAYED' : 'ON_TIME',
      delayMinutes: option.delayMinutes,
      fareRupees: option.fareRupees,
      availableSeats: option.availableSeats !== null ? option.availableSeats : 1, // At least 1 if unknown or available
      terminalDistanceMinsFromStation: option.terminalDistanceMinsFromStation,
      platformOrTerminal: option.platformOrTerminal,
      seatOrClass: option.seatOrClass,
      dataSource: `${option.type} API • ${option.sourceType === 'REAL' ? 'LIVE DATA' : 'DEMO DATA'}`,
      notes: option.notes || `${option.sourceProvider} (${option.sourceType})`
    };
  }
}
