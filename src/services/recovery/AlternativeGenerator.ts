import {
  RecoveryContext,
  TransportSegment,
  RecoveryPlanType
} from '../../types';
import {
  MOCK_AVAILABLE_TRANSPORT_OPTIONS,
  TransportOptionWithCost
} from './transportOptionsData';

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
   * based on available mock transport inventory and geographic/temporal logic.
   */
  public static generateCandidates(context: RecoveryContext): CandidatePlanDraft[] {
    const candidates: CandidatePlanDraft[] = [];

    const trainOption = MOCK_AVAILABLE_TRANSPORT_OPTIONS.find(
      (o) => o.id === 'opt-train-12127-delayed'
    );
    const ksrtcBus = MOCK_AVAILABLE_TRANSPORT_OPTIONS.find(
      (o) => o.id === 'opt-bus-ksrtc-9902'
    );
    const purpleBus = MOCK_AVAILABLE_TRANSPORT_OPTIONS.find(
      (o) => o.id === 'opt-bus-purple-9011'
    );
    const intrcityBus = MOCK_AVAILABLE_TRANSPORT_OPTIONS.find(
      (o) => o.id === 'opt-bus-intrcity-4412'
    );
    const goaExpressTrain = MOCK_AVAILABLE_TRANSPORT_OPTIONS.find(
      (o) => o.id === 'opt-train-12780'
    );
    const indigoFlight = MOCK_AVAILABLE_TRANSPORT_OPTIONS.find(
      (o) => o.id === 'opt-flight-indigo-5128'
    );
    const fly91Flight = MOCK_AVAILABLE_TRANSPORT_OPTIONS.find(
      (o) => o.id === 'opt-flight-fly91-1102'
    );

    // 1. Candidate: Train 12127 + KSRTC Airavat Bus (Station adjacent, arrives 11:40 PM)
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

    // 2. Candidate: Train 12127 + Purple Travels Economy Sleeper (Arrives 1:30 AM)
    if (trainOption && purpleBus) {
      candidates.push({
        id: 'candidate-train-purple',
        type: 'GROUND',
        title: 'Economy Direct Sleeper Bus',
        subtitle: 'Lowest out-of-pocket expense with late-night hotel arrival notification',
        segments: [trainOption, purpleBus],
        hotelPreserved: false, // Late arrival past midnight
        activityPreserved: true,
        notes: 'Departs Swargate at 6:30 PM. Generous transfer window of 1h 40m.'
      });
    }

    // 3. Candidate: Direct Emergency Air Flight (Mumbai BOM → Goa GOI)
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

    // 4. Candidate: Train 12127 + Pune Regional Flight (Fly91 ATR-72)
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

    // 5. Candidate: Train 12127 + Goa Express (Train → Train)
    if (trainOption && goaExpressTrain) {
      candidates.push({
        id: 'candidate-train-train',
        type: 'GROUND',
        title: 'All-Rail Overnight Intercity Express',
        subtitle: 'Single platform interchange with sleeper coach berth',
        segments: [trainOption, goaExpressTrain],
        hotelPreserved: false, // Arrives 4:30 AM
        activityPreserved: false, // Arrives tired right before scuba
        notes: 'Departs Pune Platform 2 at 6:00 PM, arrives Madgaon 4:30 AM.'
      });
    }

    // 6. Candidate: Train 12127 + IntrCity SmartBus (Late evening 8:00 PM)
    if (trainOption && intrcityBus) {
      candidates.push({
        id: 'candidate-train-intrcity',
        type: 'GROUND',
        title: 'Evening SmartBus Sleeper Lounge',
        subtitle: 'Extended dinner buffer at Pune Station with overnight transit',
        segments: [trainOption, intrcityBus],
        hotelPreserved: false, // Arrives 3:00 AM
        activityPreserved: true,
        notes: 'Departs 8:00 PM from IntrCity Station Lounge. 3h 10m buffer.'
      });
    }

    return candidates;
  }
}
