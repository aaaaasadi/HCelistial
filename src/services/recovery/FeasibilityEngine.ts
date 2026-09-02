import { RecoveryContext } from '../../types';
import { parseTimeToMinutes } from '../../utils/connectionEngine';
import { CandidatePlanDraft } from './AlternativeGenerator';

export interface FeasibilityResult {
  feasible: boolean;
  reasons: string[];
}

export class FeasibilityEngine {
  public static ORIGINAL_JOURNEY_COST = 900; // Base original train + bus cost in INR

  /**
   * Evaluates if a candidate recovery plan satisfies temporal, geographic,
   * budget, seat availability, and traveler preference constraints.
   */
  public static isRecoveryPlanFeasible(
    candidate: CandidatePlanDraft,
    context: RecoveryContext
  ): FeasibilityResult {
    const reasons: string[] = [];
    const { userPreferences } = context;

    // 1. Check Preference: Avoid Flights
    if (userPreferences.avoidFlights) {
      const hasFlight = candidate.segments.some((s) => s.type === 'FLIGHT');
      if (hasFlight) {
        return {
          feasible: false,
          reasons: ["Plan utilizes air travel, which violates user's 'Avoid Flights' constraint."]
        };
      }
    }

    // 2. Check Preference: Avoid Overnight
    if (userPreferences.avoidOvernight) {
      const lastSegment = candidate.segments[candidate.segments.length - 1];
      const arrivalMin = parseTimeToMinutes(lastSegment.estimatedArrival);
      // Overnight arrival: between 1:00 AM (60 min) and 6:00 AM (360 min)
      if (arrivalMin > 60 && arrivalMin < 360) {
        return {
          feasible: false,
          reasons: [`Plan arrives overnight at ${lastSegment.estimatedArrival}, violating 'Avoid Overnight' constraint.`]
        };
      }
    }

    // 3. Temporal Feasibility (Buffer & Transfer Verification)
    for (let i = 0; i < candidate.segments.length - 1; i++) {
      const fromSeg = candidate.segments[i];
      const toSeg = candidate.segments[i + 1];

      const arrMins = parseTimeToMinutes(fromSeg.estimatedArrival);
      const depMins = parseTimeToMinutes(toSeg.departureTime);

      let buffer = depMins - arrMins;
      if (buffer < -720) {
        buffer += 1440; // overnight next day
      }

      const requiredTransit = Math.max(15, toSeg.terminalDistanceMinsFromStation || 20);

      if (buffer < requiredTransit) {
        return {
          feasible: false,
          reasons: [
            `Temporal violation at ${fromSeg.destination}: Transfer requires ${requiredTransit} mins, but available buffer is only ${buffer} mins.`
          ]
        };
      }
    }

    // 4. Geographic Feasibility
    for (let i = 0; i < candidate.segments.length - 1; i++) {
      const fromSeg = candidate.segments[i];
      const toSeg = candidate.segments[i + 1];

      const fromDest = (fromSeg.destination || fromSeg.to || '').toLowerCase();
      const toOrig = (toSeg.origin || toSeg.from || '').toLowerCase();

      // Check city overlap (e.g. Pune vs Pune)
      const matchesCity =
        fromDest.includes('pune') && toOrig.includes('pune') ||
        fromDest.includes('mumbai') && toOrig.includes('mumbai') ||
        fromDest.includes('goa') && toOrig.includes('goa');

      if (!matchesCity) {
        return {
          feasible: false,
          reasons: [
            `Geographic gap: ${fromSeg.destination} does not connect directly to ${toSeg.origin}.`
          ]
        };
      }
    }

    // 5. Budget Constraints
    const totalCost = candidate.segments.reduce((acc, s) => acc + (s.fareRupees || 0), 0);
    const additionalCost = Math.max(0, totalCost - FeasibilityEngine.ORIGINAL_JOURNEY_COST);

    if (userPreferences.maxAdditionalBudget && userPreferences.maxAdditionalBudget > 0) {
      if (additionalCost > userPreferences.maxAdditionalBudget) {
        return {
          feasible: false,
          reasons: [
            `Additional cost of ₹${additionalCost} exceeds maximum contingency budget of ₹${userPreferences.maxAdditionalBudget}.`
          ]
        };
      }
    }

    // 6. Transport Availability in Mock Data
    for (const seg of candidate.segments) {
      // If not the current train passenger is aboard, verify seats available
      if (seg.id !== 'opt-train-12127-delayed' && seg.availableSeats <= 0) {
        return {
          feasible: false,
          reasons: [`No seats available on ${seg.serviceNumber}.`]
        };
      }
    }

    return {
      feasible: true,
      reasons: ['✓ Plan satisfies all temporal, geographic, capacity, and preference requirements.']
    };
  }
}
