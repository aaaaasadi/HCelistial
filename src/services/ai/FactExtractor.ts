import {
  Trip,
  TripSegment,
  TransportSegment,
  ConnectionInfo,
  DisruptionEvent,
  RecoveryPlan,
  SegmentImpact,
  VerifiedTravelFact
} from '../../types';

export class FactExtractor {
  /**
   * Extracts a normalized array of VerifiedTravelFact records from all active engine data.
   */
  public static extractFacts(params: {
    trip: Trip;
    connections: ConnectionInfo[];
    disruptions: DisruptionEvent[];
    impacts: SegmentImpact[];
    recoveryPlans: RecoveryPlan[];
  }): VerifiedTravelFact[] {
    const facts: VerifiedTravelFact[] = [];
    const { trip, connections, disruptions, recoveryPlans } = params;

    // 1. Facts from Transport Segments
    trip.segments.forEach((seg) => {
      if (seg.type === 'TRAIN' || seg.type === 'BUS' || seg.type === 'FLIGHT') {
        const tSeg = seg as TransportSegment;
        facts.push({
          type: `${tSeg.type}_STATUS` as any,
          value: tSeg.status,
          source: `SCHEDULED_${tSeg.type}_FEED`,
          verified: true
        });

        facts.push({
          type: 'DEPARTURE_TIME',
          value: `${tSeg.serviceNumber} ${tSeg.origin} at ${tSeg.departureTime}`,
          source: 'TRANSIT_OPERATOR_API',
          verified: true
        });

        facts.push({
          type: 'ARRIVAL_TIME',
          value: `${tSeg.serviceNumber} ${tSeg.destination} scheduled ${tSeg.scheduledArrival}, estimated ${tSeg.estimatedArrival}`,
          source: 'TRANSIT_TELEMETRY',
          verified: true
        });

        if (tSeg.delayMinutes > 0) {
          facts.push({
            type: 'DELAY',
            value: tSeg.delayMinutes,
            unit: 'minutes',
            source: 'LIVE_GPS_TRACKER',
            verified: true
          });
        }
      } else if (seg.type === 'HOTEL') {
        facts.push({
          type: 'HOTEL_STATUS',
          value: seg.status,
          source: 'PROPERTY_MANAGEMENT_SYSTEM',
          verified: true
        });
      } else if (seg.type === 'ACTIVITY') {
        facts.push({
          type: 'ACTIVITY_STATUS',
          value: seg.status,
          source: 'TOUR_OPERATOR_DISPATCH',
          verified: true
        });
      }
    });

    // 2. Facts from Connection Engine
    connections.forEach((conn) => {
      facts.push({
        type: 'CONNECTION_BUFFER',
        value: conn.availableBufferMinutes,
        unit: 'minutes',
        source: 'CONNECTION_ENGINE',
        verified: true
      });

      facts.push({
        type: 'CONNECTION_STATUS',
        value: conn.status,
        source: 'CONNECTION_ENGINE',
        verified: true
      });
    });

    // 3. Facts from Disruption Engine
    disruptions.forEach((disrupt) => {
      facts.push({
        type: 'TRAIN_DELAY',
        value: disrupt.delayMinutes,
        unit: 'minutes',
        source: 'DISRUPTION_RADAR',
        verified: true
      });
    });

    // 4. Facts from Recovery Plans
    recoveryPlans.forEach((plan) => {
      facts.push({
        type: 'RECOVERY_SCORE',
        value: `${plan.title}: ${plan.recoveryScore}%`,
        unit: '%',
        source: 'RECOVERY_SCORING_ENGINE',
        verified: true
      });

      facts.push({
        type: 'COST',
        value: `${plan.title}: total ₹${plan.totalCost} (+₹${plan.additionalCost})`,
        unit: 'INR',
        source: 'FARE_AGGREGATOR',
        verified: true
      });
    });

    return facts;
  }
}
