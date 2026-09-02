import { NotificationItem, JourneyStatus, TransportSegment, ConnectionInfo } from '../types';

export function generateNotificationForStateChange(
  previousStatus: JourneyStatus,
  newStatus: JourneyStatus,
  segments: TransportSegment[],
  connections: ConnectionInfo[]
): NotificationItem | null {
  const timestamp = 'Just now';
  const id = `notif-${Date.now()}`;

  if (newStatus === 'RECOVERED') {
    return {
      id,
      type: 'RECOVERY',
      title: '✓ Journey Recovered',
      message: 'Your journey has been successfully reconstructed. Replacement connection confirmed with safe buffer.',
      timestamp,
      read: false,
      targetTab: 'journey'
    };
  }

  if (newStatus === 'DISRUPTED') {
    const brokenConn = connections.find((c) => c.status === 'MISSED' || c.riskLevel === 'CRITICAL');
    const cancelledSeg = segments.find((s) => s.status === 'CANCELLED');

    if (cancelledSeg) {
      return {
        id,
        type: 'DISRUPTION',
        title: '🚨 Transit Cancelled',
        message: `${cancelledSeg.serviceNumber} has been cancelled by operator. Recovery required.`,
        timestamp,
        read: false,
        targetTab: 'recovery',
        relatedSegmentId: cancelledSeg.id
      };
    }

    if (brokenConn) {
      return {
        id,
        type: 'DISRUPTION',
        title: '🚨 Missed Connection Imminent',
        message: `Your bus connection at ${brokenConn.transferStation} can no longer be reached. Multi-leg recovery required.`,
        timestamp,
        read: false,
        targetTab: 'recovery',
        relatedSegmentId: brokenConn.toSegmentId
      };
    }

    return {
      id,
      type: 'DISRUPTION',
      title: '🚨 Disruption Detected',
      message: 'Significant transit disruption detected. Immediate recovery action recommended.',
      timestamp,
      read: false,
      targetTab: 'recovery'
    };
  }

  if (newStatus === 'AT_RISK') {
    const delayedSeg = segments.find((s) => s.delayMinutes > 0);
    const delayMsg = delayedSeg
      ? `${delayedSeg.serviceNumber} is delayed by ${delayedSeg.delayMinutes} minutes.`
      : 'A delay has been detected.';
    return {
      id,
      type: 'WARNING',
      title: '⚠️ Connection Risk Warning',
      message: `${delayMsg} Your transfer buffer is tightening.`,
      timestamp,
      read: false,
      targetTab: 'journey'
    };
  }

  if (previousStatus !== 'ON_TRACK' && newStatus === 'ON_TRACK') {
    return {
      id,
      type: 'INFO',
      title: '🟢 Journey on Track',
      message: 'All transit segments and intermodal connections are operating within safe schedule parameters.',
      timestamp,
      read: false,
      targetTab: 'dashboard'
    };
  }

  return null;
}
