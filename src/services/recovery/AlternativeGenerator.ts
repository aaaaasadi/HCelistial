import {
  RecoveryContext,
  TransportSegment,
  RecoveryPlanType
} from '../../types';
import {
  MOCK_AVAILABLE_TRANSPORT_OPTIONS,
  TransportOptionWithCost
} from './transportOptionsData';
import { parseTimeToMinutes } from '../../utils/connectionEngine';

function formatMinutes(totalMins: number): string {
  const norm = ((totalMins % 1440) + 1440) % 1440;
  const hours = Math.floor(norm / 60);
  const minutes = norm % 60;
  const meridian = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${meridian}`;
}

export interface CandidatePlanDraft {
  id: string;
  type: RecoveryPlanType;
  title: string;
  subtitle: string;
  segments: TransportOptionWithCost[];
  hotelPreserved: boolean;
  activityPreserved: boolean;
  notes: string;
}

export class AlternativeGenerator {
  /**
   * Generates candidate alternative itineraries for a disrupted journey
   * dynamically adapting to the user's active route, stations, and custom segments.
   */
  public static generateCandidates(context: RecoveryContext): CandidatePlanDraft[] {
    const candidates: CandidatePlanDraft[] = [];
    const trip = context.trip;
    const transportSegments = trip.segments.filter(
      (s): s is TransportSegment => s.type === 'TRAIN' || s.type === 'BUS' || s.type === 'FLIGHT'
    );

    const firstSeg = transportSegments[0];

    const origin = (trip.origin || 'Mumbai').split(' ')[0];
    const destination = (trip.destination || 'Goa').split(' ')[0];
    const transferPoint = firstSeg ? (firstSeg.destination || firstSeg.to || 'Pune').split(' ')[0] : 'Transit Hub';

    const feederArrivalStr = firstSeg ? (firstSeg.estimatedArrival || firstSeg.scheduledArrival || '4:50 PM') : '4:50 PM';
    const feederArrMins = parseTimeToMinutes(feederArrivalStr) || 1010;

    // If default Mumbai - Pune - Goa route, pull enriched static catalog
    const isStandardMumbaiGoa = trip.origin.toLowerCase().includes('mumbai') && trip.destination.toLowerCase().includes('goa');

    if (isStandardMumbaiGoa) {
      const trainOption = MOCK_AVAILABLE_TRANSPORT_OPTIONS.find((o) => o.id === 'opt-train-12127-delayed');
      const ksrtcBus = MOCK_AVAILABLE_TRANSPORT_OPTIONS.find((o) => o.id === 'opt-bus-ksrtc-9902');
      const purpleBus = MOCK_AVAILABLE_TRANSPORT_OPTIONS.find((o) => o.id === 'opt-bus-purple-9011');
      const intrcityBus = MOCK_AVAILABLE_TRANSPORT_OPTIONS.find((o) => o.id === 'opt-bus-intrcity-4412');
      const goaExpressTrain = MOCK_AVAILABLE_TRANSPORT_OPTIONS.find((o) => o.id === 'opt-train-12780');
      const indigoFlight = MOCK_AVAILABLE_TRANSPORT_OPTIONS.find((o) => o.id === 'opt-flight-indigo-5128');
      const fly91Flight = MOCK_AVAILABLE_TRANSPORT_OPTIONS.find((o) => o.id === 'opt-flight-fly91-1102');

      if (trainOption && ksrtcBus) {
        candidates.push({
          id: 'candidate-train-ksrtc',
          type: 'GROUND',
          title: 'Train + Bus Seamless Connector',
          subtitle: 'Optimal ground connection with minimal delay and preserved hotel stay',
          segments: [trainOption, ksrtcBus],
          hotelPreserved: true,
          activityPreserved: true,
          notes: 'Arrives in Goa tonight at 11:40 PM. Walk to station bus bay in 10 mins.'
        });
      }

      if (trainOption && purpleBus) {
        candidates.push({
          id: 'candidate-train-purple',
          type: 'GROUND',
          title: 'Economy Direct Sleeper Bus',
          subtitle: 'Lowest out-of-pocket expense with late-night hotel arrival notification',
          segments: [trainOption, purpleBus],
          hotelPreserved: false,
          activityPreserved: true,
          notes: 'Departs Swargate at 6:30 PM. Generous transfer window of 1h 40m.'
        });
      }

      if (indigoFlight) {
        candidates.push({
          id: 'candidate-direct-flight',
          type: 'AIR',
          title: 'Emergency Air Rescue Express',
          subtitle: 'Fastest arrival into Goa for critical meetings or tight schedules',
          segments: [indigoFlight],
          hotelPreserved: true,
          activityPreserved: true,
          notes: 'Fastest arrival at 8:15 PM tonight. Premium airline fare.'
        });
      }

      if (trainOption && fly91Flight) {
        candidates.push({
          id: 'candidate-train-fly91',
          type: 'MULTIMODAL',
          title: 'Train + Regional Flight Connector',
          subtitle: 'Arrive before 8:00 PM via Lohegaon Airport regional shuttle',
          segments: [trainOption, fly91Flight],
          hotelPreserved: true,
          activityPreserved: true,
          notes: 'Requires 40m taxi from Pune Junction to Lohegaon Airport.'
        });
      }

      if (trainOption && goaExpressTrain) {
        candidates.push({
          id: 'candidate-train-train',
          type: 'GROUND',
          title: 'All-Rail Overnight Intercity Express',
          subtitle: 'Single platform interchange with sleeper coach berth',
          segments: [trainOption, goaExpressTrain],
          hotelPreserved: false,
          activityPreserved: false,
          notes: 'Departs Pune Platform 2 at 6:00 PM, arrives Madgaon 4:30 AM.'
        });
      }

      if (trainOption && intrcityBus) {
        candidates.push({
          id: 'candidate-train-intrcity',
          type: 'GROUND',
          title: 'Evening SmartBus Sleeper Lounge',
          subtitle: 'Extended dinner buffer at Pune Station with overnight transit',
          segments: [trainOption, intrcityBus],
          hotelPreserved: false,
          activityPreserved: true,
          notes: 'Departs 8:00 PM from IntrCity Station Lounge. 3h 10m buffer.'
        });
      }

      return candidates;
    }

    // Dynamic Route Engine for ANY custom user itinerary:
    const feederOption: TransportOptionWithCost = firstSeg
      ? {
          ...firstSeg,
          origin: firstSeg.origin || origin,
          destination: firstSeg.destination || transferPoint,
          from: firstSeg.origin || origin,
          to: firstSeg.destination || transferPoint,
          fareRupees: 650,
          availableSeats: 0,
          terminalDistanceMinsFromStation: 0
        }
      : {
          id: 'opt-feeder-custom',
          type: 'TRAIN',
          serviceNumber: 'Transit Leg 1',
          origin: origin,
          destination: transferPoint,
          from: origin,
          to: transferPoint,
          departureTime: '6:00 AM',
          scheduledArrival: '10:00 AM',
          estimatedArrival: '12:00 PM',
          delayMinutes: 120,
          platformOrTerminal: 'Platform 1',
          seatOrClass: 'Confirmed',
          status: 'DELAYED',
          dataSource: 'LIVE TELEMETRY',
          provider: 'Regional Transit',
          fareRupees: 500,
          availableSeats: 0,
          terminalDistanceMinsFromStation: 0
        };

    // 1. Dynamic Optimal Connector (Departs 1 hour after feeder arrival)
    const optDepMins = feederArrMins + 60;
    const optArrMins = optDepMins + 300;
    const dynamicOptimalConnector: TransportOptionWithCost = {
      id: 'opt-dyn-connector',
      type: 'BUS',
      serviceNumber: `EXPRESS-${transferPoint.slice(0, 3).toUpperCase()}-01`,
      origin: `${transferPoint} Central`,
      destination: `${destination} Terminal`,
      from: transferPoint,
      to: destination,
      departureTime: formatMinutes(optDepMins),
      scheduledArrival: formatMinutes(optArrMins),
      estimatedArrival: formatMinutes(optArrMins),
      delayMinutes: 0,
      platformOrTerminal: 'Bay 4',
      seatOrClass: 'Executive Sleeper',
      status: 'ON_TIME',
      dataSource: 'CENTRAL_INVENTORY_API',
      provider: `${transferPoint} Intercity Line`,
      fareRupees: 1100,
      availableSeats: 12,
      terminalDistanceMinsFromStation: 10
    };

    candidates.push({
      id: 'candidate-dyn-optimal',
      type: 'GROUND',
      title: `${transferPoint} Seamless Rebooking Connector`,
      subtitle: `Optimal connection from ${transferPoint} to ${destination} with guaranteed departure`,
      segments: [feederOption, dynamicOptimalConnector],
      hotelPreserved: true,
      activityPreserved: true,
      notes: `Departs ${transferPoint} at ${dynamicOptimalConnector.departureTime} with 1 hour buffer.`
    });

    // 2. Direct Rescue Flight from Origin to Destination
    const directFlightOpt: TransportOptionWithCost = {
      id: 'opt-dyn-flight',
      type: 'FLIGHT',
      serviceNumber: `AIR-${origin.slice(0, 3).toUpperCase()}-901`,
      origin: `${origin} Airport`,
      destination: `${destination} Airport`,
      from: origin,
      to: destination,
      departureTime: formatMinutes(feederArrMins + 120),
      scheduledArrival: formatMinutes(feederArrMins + 200),
      estimatedArrival: formatMinutes(feederArrMins + 200),
      delayMinutes: 0,
      platformOrTerminal: 'Terminal 2',
      seatOrClass: 'Economy Flex',
      status: 'ON_TIME',
      dataSource: 'GDS_FLIGHT_FEED',
      provider: 'SkyExpress Airlines',
      fareRupees: 4200,
      availableSeats: 6,
      terminalDistanceMinsFromStation: 35
    };

    candidates.push({
      id: 'candidate-dyn-air',
      type: 'AIR',
      title: `Direct Emergency Air Rescue (${origin} → ${destination})`,
      subtitle: `Fastest non-stop rescue flight to ${destination}`,
      segments: [directFlightOpt],
      hotelPreserved: true,
      activityPreserved: true,
      notes: `Arrives in ${destination} at ${directFlightOpt.estimatedArrival}. Direct connection.`
    });

    // 3. Economy Overnight Coach
    const econDepMins = feederArrMins + 120;
    const econArrMins = econDepMins + 380;
    const dynamicEconomyBus: TransportOptionWithCost = {
      id: 'opt-dyn-economy',
      type: 'BUS',
      serviceNumber: `ECO-${transferPoint.slice(0, 3).toUpperCase()}-77`,
      origin: `${transferPoint} Bus Station`,
      destination: `${destination} Station`,
      from: transferPoint,
      to: destination,
      departureTime: formatMinutes(econDepMins),
      scheduledArrival: formatMinutes(econArrMins),
      estimatedArrival: formatMinutes(econArrMins),
      delayMinutes: 0,
      platformOrTerminal: 'Bay 12',
      seatOrClass: 'Semi-Sleeper',
      status: 'ON_TIME',
      dataSource: 'REGIONAL_BUS_API',
      provider: 'National Express Lines',
      fareRupees: 750,
      availableSeats: 22,
      terminalDistanceMinsFromStation: 15
    };

    candidates.push({
      id: 'candidate-dyn-economy',
      type: 'GROUND',
      title: `Economy Direct Transit (${transferPoint} → ${destination})`,
      subtitle: `Lowest cost rebooking option with comfortable transfer window`,
      segments: [feederOption, dynamicEconomyBus],
      hotelPreserved: false,
      activityPreserved: true,
      notes: `Departs at ${dynamicEconomyBus.departureTime} with 2 hours buffer.`
    });

    return candidates;
  }
}
