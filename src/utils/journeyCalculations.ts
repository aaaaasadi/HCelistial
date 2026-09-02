import {
  Trip,
  TripSegment,
  TransportSegment,
  ConnectionInfo,
  JourneyStatus,
  SegmentImpact,
  RiskLevel
} from '../types';

/**
 * Derives the overall journey-level status from the segments and connection risks.
 */
export function deriveJourneyStatus(
  segments: TripSegment[],
  connections: ConnectionInfo[]
): JourneyStatus {
  // Check if any segment is recovered or replacement active
  const hasRecovered = segments.some(
    (s) => s.type !== 'HOTEL' && s.type !== 'ACTIVITY' && (s as TransportSegment).status === 'RECOVERED'
  );
  if (hasRecovered) {
    return 'RECOVERED';
  }

  // Check for any cancelled segments
  const hasCancelled = segments.some(
    (s) => (s as TransportSegment).status === 'CANCELLED'
  );
  if (hasCancelled) {
    return 'DISRUPTED';
  }

  // Check connection status
  const hasMissedConnection = connections.some(
    (c) => c.status === 'MISSED' || c.riskLevel === 'CRITICAL'
  );
  if (hasMissedConnection) {
    return 'DISRUPTED';
  }

  const hasHighRiskConnection = connections.some(
    (c) => c.status === 'TIGHT' || c.riskLevel === 'HIGH' || c.riskLevel === 'MEDIUM'
  );
  if (hasHighRiskConnection) {
    return 'AT_RISK';
  }

  // Check if any individual transport segment is delayed
  const hasDelayedSegment = segments.some(
    (s) => (s as TransportSegment).delayMinutes > 0
  );
  if (hasDelayedSegment) {
    return 'AT_RISK';
  }

  return 'ON_TRACK';
}

/**
 * Calculates a normalized journey health score (0-100%) dynamically from current journey conditions.
 */
export function calculateJourneyHealth(
  segments: TripSegment[],
  connections: ConnectionInfo[],
  impacts: SegmentImpact[]
): number {
  let score = 95; // Baseline pristine score

  // Check if recovered
  const isRecovered = segments.some(
    (s) => (s as TransportSegment).status === 'RECOVERED'
  );
  if (isRecovered) {
    return 98;
  }

  // Deduct for delayed segments
  for (const seg of segments) {
    if (seg.type === 'TRAIN' || seg.type === 'BUS' || seg.type === 'FLIGHT') {
      const tSeg = seg as TransportSegment;
      if (tSeg.status === 'CANCELLED') {
        score -= 50;
      } else if (tSeg.delayMinutes > 120) {
        score -= 30;
      } else if (tSeg.delayMinutes > 30) {
        score -= 15;
      } else if (tSeg.delayMinutes > 0) {
        score -= 5;
      }
    }
  }

  // Deduct for connection risk
  for (const conn of connections) {
    if (conn.status === 'MISSED' || conn.riskLevel === 'CRITICAL') {
      score -= 25;
    } else if (conn.riskLevel === 'HIGH') {
      score -= 15;
    } else if (conn.riskLevel === 'MEDIUM') {
      score -= 8;
    }
  }

  // Deduct for downstream impacts
  for (const impact of impacts) {
    if (impact.impactLevel === 'CRITICAL') {
      score -= 10;
    } else if (impact.impactLevel === 'HIGH') {
      score -= 6;
    } else if (impact.impactLevel === 'MEDIUM') {
      score -= 3;
    }
  }

  return Math.max(20, Math.min(98, score));
}

/**
 * Traverses the journey segments to detect cascading downstream impacts
 * when upstream disruptions or connection buffer deficits occur.
 */
export function detectImpacts(
  segments: TripSegment[],
  connections: ConnectionInfo[]
): SegmentImpact[] {
  const impacts: SegmentImpact[] = [];

  const transportSegments = segments.filter(
    (s): s is TransportSegment => s.type === 'TRAIN' || s.type === 'BUS' || s.type === 'FLIGHT'
  );

  // Check for broken connection
  const criticalConn = connections.find((c) => c.riskLevel === 'CRITICAL' || c.status === 'MISSED');

  if (criticalConn) {
    // Upstream feeder segment
    const feeder = transportSegments.find((s) => s.id === criticalConn.fromSegmentId);
    if (feeder && feeder.delayMinutes > 0) {
      impacts.push({
        segmentId: feeder.id,
        segmentTitle: feeder.serviceNumber,
        segmentType: feeder.type,
        impactLevel: 'HIGH',
        reason: `${feeder.serviceNumber} running +${feeder.delayMinutes}m late.`,
        originalSchedule: feeder.scheduledArrival || feeder.estimatedArrival || '',
        projectedOutcome: `Estimated arrival: ${feeder.estimatedArrival}`
      });
    }

    // Downstream feeder segment that is missed
    const downstream = transportSegments.find((s) => s.id === criticalConn.toSegmentId);
    if (downstream) {
      impacts.push({
        segmentId: downstream.id,
        segmentTitle: downstream.serviceNumber,
        segmentType: downstream.type,
        impactLevel: 'CRITICAL',
        reason: `Departs at ${downstream.scheduledDeparture || downstream.departureTime}. Available buffer is ${criticalConn.availableBufferMinutes}m (requires ${criticalConn.requiredTransferMinutes}m). Bus cannot be reached.`,
        originalSchedule: downstream.scheduledDeparture || downstream.departureTime || '',
        projectedOutcome: 'Guaranteed missed departure'
      });
    }

    // Hotel impact
    const hotel = segments.find((s) => s.type === 'HOTEL');
    if (hotel) {
      impacts.push({
        segmentId: hotel.id,
        segmentTitle: hotel.name,
        segmentType: 'HOTEL',
        impactLevel: 'MEDIUM',
        reason: 'Late arrival past midnight requires hotel notification to prevent room cancellation.',
        originalSchedule: 'Check-in 11:00 PM',
        projectedOutcome: 'Arrival delayed past 2:00 AM'
      });
    }

    // Activity impact
    const activity = segments.find((s) => s.type === 'ACTIVITY');
    if (activity) {
      impacts.push({
        segmentId: activity.id,
        segmentTitle: activity.name,
        segmentType: 'ACTIVITY',
        impactLevel: 'LOW',
        reason: 'Next-day morning activity is at risk if passenger arrives sleep-deprived in the early morning hours.',
        originalSchedule: 'Tomorrow 9:00 AM',
        projectedOutcome: 'Participation fatigue risk'
      });
    }
  }

  return impacts;
}
