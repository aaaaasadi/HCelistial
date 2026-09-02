import {
  RecoveryScoringConfig,
  RecoveryScoreBreakdown,
  UserPreferences,
  RecoveryContext
} from '../../types';
import { parseTimeToMinutes } from '../../utils/connectionEngine';
import { CandidatePlanDraft } from './AlternativeGenerator';
import { FeasibilityEngine } from './FeasibilityEngine';

export interface ScoredCandidate {
  candidate: CandidatePlanDraft;
  score: number;
  scoreBreakdown: RecoveryScoreBreakdown;
  totalCost: number;
  additionalCost: number;
  transfersCount: number;
  itineraryPreservation: number;
  totalTravelTime: string;
  finalArrival: string;
  departureTime: string;
  tradeoffs: {
    advantages: string[];
    disadvantages: string[];
  };
  explanation: string;
}

export class RecoveryScoringEngine {
  public static DEFAULT_CONFIG: RecoveryScoringConfig = {
    arrivalWeight: 0.30,
    costWeight: 0.25,
    preservationWeight: 0.20,
    transferWeight: 0.15,
    preferenceWeight: 0.10
  };

  /**
   * Scores and ranks a collection of feasible candidate recovery plans.
   */
  public static scoreCandidates(
    candidates: CandidatePlanDraft[],
    context: RecoveryContext,
    config: RecoveryScoringConfig = RecoveryScoringEngine.DEFAULT_CONFIG
  ): ScoredCandidate[] {
    if (candidates.length === 0) return [];

    // 1. Gather batch metadata for relative normalization
    const arrivalMinutesList = candidates.map((c) => {
      const lastSeg = c.segments[c.segments.length - 1];
      let mins = parseTimeToMinutes(lastSeg.estimatedArrival);
      // If arrival is early AM next day (e.g. 1:30 AM), add 1440 mins
      if (mins < 360) mins += 1440;
      return mins;
    });

    const costList = candidates.map((c) =>
      c.segments.reduce((acc, s) => acc + (s.fareRupees || 0), 0)
    );

    const minArrival = Math.min(...arrivalMinutesList);
    const maxArrival = Math.max(...arrivalMinutesList);

    const minCost = Math.min(...costList);
    const maxCost = Math.max(...costList);

    // 2. Score each candidate
    return candidates.map((candidate, idx) => {
      const arrMins = arrivalMinutesList[idx];
      const totalCost = costList[idx];
      const additionalCost = Math.max(0, totalCost - FeasibilityEngine.ORIGINAL_JOURNEY_COST);

      const firstSeg = candidate.segments[0];
      const lastSeg = candidate.segments[candidate.segments.length - 1];
      const transfersCount = Math.max(0, candidate.segments.length - 1);

      // Elapsed total time calculation
      const startMins = parseTimeToMinutes(firstSeg.departureTime);
      let diff = arrMins - startMins;
      if (diff < 0) diff += 1440;
      const elapsedHours = Math.floor(diff / 60);
      const elapsedMins = diff % 60;
      const totalTravelTime = `${elapsedHours}h ${elapsedMins > 0 ? `${elapsedMins}m` : ''}`.trim();

      // A. Arrival Score (30%): Normalized between min and max
      let arrivalScore = 95;
      if (maxArrival > minArrival) {
        arrivalScore = 100 - ((arrMins - minArrival) / (maxArrival - minArrival)) * 40;
      }
      arrivalScore = Math.max(40, Math.min(100, Math.round(arrivalScore)));

      // B. Cost Score (25%): Cheaper receives higher score
      let costScore = 90;
      if (maxCost > minCost) {
        costScore = 100 - ((totalCost - minCost) / (maxCost - minCost)) * 50;
      }
      costScore = Math.max(30, Math.min(100, Math.round(costScore)));

      // C. Itinerary Preservation Score (20%)
      let itineraryPreservation = 100;
      if (!candidate.hotelPreserved) itineraryPreservation -= 20;
      if (!candidate.activityPreserved) itineraryPreservation -= 25;
      // Partial deduction if first train was replaced
      if (candidate.segments[0].id !== 'opt-train-12127-delayed') {
        itineraryPreservation -= 10;
      }
      const preservationScore = Math.max(40, Math.min(100, itineraryPreservation));

      // D. Transfers Score (15%)
      let transferScore = 90;
      if (transfersCount === 0) transferScore = 100;
      else if (transfersCount === 1) transferScore = 90;
      else if (transfersCount === 2) transferScore = 70;
      else transferScore = 50;

      // E. User Preference Score (10%)
      let preferenceScore = 80;
      const priority = context.userPreferences.primaryPriority;

      if (priority === 'LOWEST_COST') {
        preferenceScore = totalCost === minCost ? 98 : costScore;
      } else if (priority === 'FASTEST_ARRIVAL') {
        preferenceScore = arrMins === minArrival ? 98 : arrivalScore;
      } else if (priority === 'FEWER_TRANSFERS') {
        preferenceScore = transfersCount === 0 ? 100 : transfersCount === 1 ? 90 : 65;
      } else if (priority === 'PRESERVE_BOOKINGS') {
        preferenceScore = candidate.hotelPreserved && candidate.activityPreserved ? 98 : 65;
      }

      if (context.userPreferences.preferDirect && transfersCount === 0) {
        preferenceScore = Math.min(100, preferenceScore + 10);
      }

      // Final Weighted Score (0 - 100)
      const rawScore =
        arrivalScore * config.arrivalWeight +
        costScore * config.costWeight +
        preservationScore * config.preservationWeight +
        transferScore * config.transferWeight +
        preferenceScore * config.preferenceWeight;

      const finalScore = Math.max(10, Math.min(99, Math.round(rawScore)));

      // Tradeoffs & Explanation Generator
      const advantages: string[] = [];
      const disadvantages: string[] = [];

      if (candidate.hotelPreserved) {
        advantages.push('Preserves hotel check-in at Casa Ocean Retreat without penalty');
      } else {
        disadvantages.push('Arrives after midnight (requires hotel late arrival notification)');
      }

      if (transfersCount <= 1) {
        advantages.push(transfersCount === 0 ? 'Direct journey with zero transfers' : 'Only 1 convenient transfer point');
      } else {
        disadvantages.push(`Requires ${transfersCount} intermodal transfers`);
      }

      if (additionalCost === 0) {
        advantages.push('Zero additional contingency expense (within original budget)');
      } else if (additionalCost <= (context.userPreferences.maxAdditionalBudget || 2000)) {
        advantages.push(`Contingency fare of ₹${additionalCost} fits within your ₹${context.userPreferences.maxAdditionalBudget} budget`);
      } else {
        disadvantages.push(`Requires additional ₹${additionalCost} fare`);
      }

      if (arrMins === minArrival) {
        advantages.push(`Fastest arrival into destination (${lastSeg.estimatedArrival})`);
      } else if (arrMins > 1440 + 120) {
        disadvantages.push(`Arrives late in the early morning (${lastSeg.estimatedArrival})`);
      }

      if (candidate.activityPreserved) {
        advantages.push('Tomorrow’s 9:00 AM scuba excursion fully protected');
      }

      // Human-readable rationale
      const explanation = `${candidate.title} scored ${finalScore}% based on ${
        arrMins === minArrival ? 'rapid arrival' : candidate.hotelPreserved ? 'complete booking protection' : 'economical ground transit'
      } with ${transfersCount === 0 ? 'no transfers' : `${transfersCount} transfer`}. Additional cost: ₹${additionalCost}.`;

      return {
        candidate,
        score: finalScore,
        scoreBreakdown: {
          arrivalTime: arrivalScore,
          cost: costScore,
          itineraryPreservation: preservationScore,
          transfers: transferScore,
          preferences: preferenceScore
        },
        totalCost,
        additionalCost,
        transfersCount,
        itineraryPreservation,
        totalTravelTime,
        finalArrival: lastSeg.estimatedArrival,
        departureTime: firstSeg.departureTime,
        tradeoffs: {
          advantages,
          disadvantages
        },
        explanation
      };
    });
  }
}
