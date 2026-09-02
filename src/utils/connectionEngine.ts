import { TransportSegment, ConnectionInfo, ConnectionStatus, RiskLevel } from '../types';

/**
 * Configurable connection calculation thresholds.
 * Centralized here to avoid magic numbers scattered across the codebase.
 */
export const CONNECTION_THRESHOLDS = {
  DEFAULT_TRANSFER_MINUTES: 30,
  
  // Safe: Available buffer >= required transfer + 45 min
  SAFE_MARGIN_MINUTES: 45,
  
  // Tight: Available buffer >= required transfer + 15 min
  TIGHT_MARGIN_MINUTES: 15,
  
  // Critical: Available buffer < required transfer
  MINIMUM_TRANSFER_MARGIN_MINUTES: 0,
};

/**
 * Converts a 12-hour formatted time string (e.g. "1:30 PM", "10:00 AM") into total minutes from midnight.
 */
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  
  // Strip out any trailing parenthetical details (e.g. "(Arr: 4:50 PM)")
  const cleanStr = timeStr.replace(/\(.*?\)/g, '').trim();
  const match = cleanStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridian = match[3]?.toUpperCase();

  if (meridian === 'PM' && hours < 12) {
    hours += 12;
  } else if (meridian === 'AM' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

/**
 * Calculates intermodal connection feasibility, available buffer, and risk level
 * between two sequential transport segments.
 */
export function calculateConnection(
  fromSegment: TransportSegment,
  toSegment: TransportSegment,
  options?: {
    transferStation?: string;
    requiredTransferMinutes?: number;
  }
): ConnectionInfo {
  const fromDest = fromSegment.destination || fromSegment.to || '';
  const fromOrig = fromSegment.origin || fromSegment.from || '';
  const toOrig = toSegment.origin || toSegment.from || '';
  const toDest = toSegment.destination || toSegment.to || '';
  const nextDepartureTime = toSegment.scheduledDeparture || toSegment.departureTime || '';

  const transferStation = options?.transferStation || `${fromDest} Intermodal Hub`;
  const requiredTransferMinutes = options?.requiredTransferMinutes ?? CONNECTION_THRESHOLDS.DEFAULT_TRANSFER_MINUTES;

  // Arrival time of previous segment (actual/estimated accounts for delays)
  const arrivalMinutes = parseTimeToMinutes(fromSegment.estimatedArrival);
  // Departure time of next segment
  const nextDepartureMinutes = parseTimeToMinutes(nextDepartureTime);

  // Calculate available buffer in minutes (handle crossing midnight if next departure is early morning)
  let rawDiff = nextDepartureMinutes - arrivalMinutes;
  if (rawDiff < -720) {
    // Next departure is next day (e.g. 11 PM to 2 AM)
    rawDiff += 1440;
  }

  const availableBufferMinutes = rawDiff;

  // Determine connection status & risk
  let status: ConnectionStatus = 'SAFE';
  let riskLevel: RiskLevel = 'LOW';
  let explanation = '';

  if (fromSegment.isReplacement || toSegment.isReplacement || fromSegment.status === 'RECOVERED' || toSegment.status === 'RECOVERED') {
    status = 'RECOVERED';
    riskLevel = 'LOW';
    explanation = `✓ SAFE: Replacement connection confirmed with ${availableBufferMinutes} mins transfer window.`;
  } else if (toSegment.status === 'CANCELLED') {
    status = 'MISSED';
    riskLevel = 'CRITICAL';
    explanation = `⚠️ CANCELLED: Feeder transport service has been cancelled by operator. Connection impossible.`;
  } else if (availableBufferMinutes <= 0) {
    status = 'MISSED';
    riskLevel = 'CRITICAL';
    explanation = `⚠️ MISSED: ${fromSegment.serviceNumber} arrives at ${fromSegment.estimatedArrival}, after ${toSegment.serviceNumber} departs at ${nextDepartureTime}.`;
  } else if (availableBufferMinutes < requiredTransferMinutes) {
    status = 'AT_RISK';
    riskLevel = 'CRITICAL';
    explanation = `⚠️ CRITICAL: Available buffer is only ${availableBufferMinutes} mins, but ${requiredTransferMinutes} mins are required for transit. High probability of missed connection.`;
  } else if (availableBufferMinutes < requiredTransferMinutes + CONNECTION_THRESHOLDS.TIGHT_MARGIN_MINUTES) {
    status = 'TIGHT';
    riskLevel = 'HIGH';
    explanation = `⚠️ HIGH RISK: Buffer of ${availableBufferMinutes} mins is very tight. Any further delay of ${(availableBufferMinutes - requiredTransferMinutes)} mins will break connection.`;
  } else if (availableBufferMinutes < requiredTransferMinutes + CONNECTION_THRESHOLDS.SAFE_MARGIN_MINUTES) {
    status = 'TIGHT';
    riskLevel = 'MEDIUM';
    explanation = `MODERATE RISK: Buffer has tightened to ${availableBufferMinutes} mins. Transfer requires brisk transit.`;
  } else {
    status = 'SAFE';
    riskLevel = 'LOW';
    const hours = Math.floor(availableBufferMinutes / 60);
    const mins = availableBufferMinutes % 60;
    const bufferStr = hours > 0 ? `${hours}h ${mins > 0 ? `${mins}m` : ''}`.trim() : `${mins}m`;
    explanation = `✓ SAFE: ${bufferStr} buffer comfortably exceeds the ${requiredTransferMinutes}-minute required transfer time.`;
  }

  return {
    id: `conn-${fromSegment.id}-${toSegment.id}`,
    fromSegmentId: fromSegment.id,
    toSegmentId: toSegment.id,
    transferStation,
    fromCity: `${fromDest} (${fromSegment.serviceNumber})`,
    toCity: `${toOrig} (${toSegment.serviceNumber})`,
    arrivingFrom: `${fromOrig} (Arr: ${fromSegment.estimatedArrival})`,
    nextDeparture: `${toDest} (Dep: ${nextDepartureTime})`,
    arrivalTime: fromSegment.estimatedArrival,
    departureTime: nextDepartureTime,
    availableBufferMinutes,
    requiredTransferMinutes,
    status,
    riskLevel,
    explanation
  };
}
