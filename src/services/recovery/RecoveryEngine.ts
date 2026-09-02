import {
  RecoveryPlan,
  RecoveryContext,
  TransportSegment,
  TransportType,
  RecoveryScoringConfig
} from '../../types';
import { AlternativeGenerator, CandidatePlanDraft } from './AlternativeGenerator';
import { FeasibilityEngine, FeasibilityResult } from './FeasibilityEngine';
import { RecoveryScoringEngine, ScoredCandidate } from './RecoveryScoringEngine';
import { parseTimeToMinutes } from '../../utils/connectionEngine';

export class RecoveryEngine {
  /**
   * Evaluates the recovery context, generates candidate alternatives,
   * validates feasibility, scores using multi-factor criteria, ranks, and tags options.
   */
  public static generatePlans(
    context: RecoveryContext,
    scoringConfig?: RecoveryScoringConfig
  ): RecoveryPlan[] {
    // 1. Generate candidate combinations
    const rawCandidates = AlternativeGenerator.generateCandidates(context);

    // 2. Validate feasibility against temporal, geographic, budget, and preference constraints
    const feasibleCandidatesWithValidation: { candidate: CandidatePlanDraft; validation: FeasibilityResult }[] = [];

    for (const candidate of rawCandidates) {
      const validation = FeasibilityEngine.isRecoveryPlanFeasible(candidate, context);
      if (validation.feasible) {
        feasibleCandidatesWithValidation.push({ candidate, validation });
      }
    }

    if (feasibleCandidatesWithValidation.length === 0) {
      return [];
    }

    // 3. Score all feasible candidates
    const feasibleDrafts = feasibleCandidatesWithValidation.map((item) => item.candidate);
    const scoredList = RecoveryScoringEngine.scoreCandidates(
      feasibleDrafts,
      context,
      scoringConfig
    );

    // 4. Sort by score descending
    scoredList.sort((a, b) => b.score - a.score);

    // 5. Identify Cheapest and Fastest for tagging
    let cheapestIdx = 0;
    let lowestCost = Infinity;

    let fastestIdx = 0;
    let earliestArrivalMins = Infinity;

    scoredList.forEach((item, idx) => {
      if (item.totalCost < lowestCost) {
        lowestCost = item.totalCost;
        cheapestIdx = idx;
      }

      let arrMins = parseTimeToMinutes(item.finalArrival);
      if (arrMins < 360) arrMins += 1440; // past midnight
      if (arrMins < earliestArrivalMins) {
        earliestArrivalMins = arrMins;
        fastestIdx = idx;
      }
    });

    // 6. Map into finalized RecoveryPlan model
    const plans: RecoveryPlan[] = scoredList.map((item, idx) => {
      let tag: 'RECOMMENDED' | 'CHEAPEST' | 'FASTEST' | undefined = undefined;
      if (idx === 0) {
        tag = 'RECOMMENDED';
      } else if (idx === cheapestIdx) {
        tag = 'CHEAPEST';
      } else if (idx === fastestIdx) {
        tag = 'FASTEST';
      }

      const transportTypes: TransportType[] = Array.from(
        new Set(item.candidate.segments.map((s) => s.type))
      );

      const routeSummary: string[] = item.candidate.segments.map(
        (s) => `${s.type}: ${s.serviceNumber} (${s.departureTime} → ${s.estimatedArrival})`
      );

      const leg1 = `${item.candidate.segments[0].serviceNumber} (Departs ${item.candidate.segments[0].departureTime})`;
      const leg2 = item.candidate.segments[1]
        ? `${item.candidate.segments[1].serviceNumber} (Departs ${item.candidate.segments[1].departureTime})`
        : undefined;

      const operator = item.candidate.segments.map((s) => s.provider).join(' + ');

      return {
        id: item.candidate.id,
        type: item.candidate.type,
        tag,
        title: item.candidate.title,
        subtitle: item.candidate.subtitle,
        transportTypes,
        segments: item.candidate.segments,
        newDeparture: `${item.departureTime} (${item.candidate.segments[0].origin})`,
        newArrival: `${item.finalArrival} (${item.candidate.segments[item.candidate.segments.length - 1].destination})`,
        totalTravelTime: item.totalTravelTime,
        totalCost: item.totalCost,
        additionalCost: item.additionalCost,
        cost: item.totalCost,
        transfersCount: item.transfersCount,
        itineraryPreservation: item.itineraryPreservation,
        recoveryScore: item.score,
        scoreBreakdown: item.scoreBreakdown,
        feasibility: {
          feasible: true,
          reasons: ['Satisfies all transit and preference conditions.']
        },
        tradeoffs: item.tradeoffs,
        whyThisPlan: {
          pros: item.tradeoffs.advantages,
          cons: item.tradeoffs.disadvantages
        },
        affectedBookings: {
          hotel: item.candidate.hotelPreserved ? 'PRESERVED' : 'LATE_ARRIVAL',
          activity: item.candidate.activityPreserved ? 'PRESERVED' : 'RESCHEDULE_NEEDED'
        },
        hotelStatus: item.candidate.hotelPreserved ? 'PRESERVED' : 'LATE_ARRIVAL',
        activityStatus: item.candidate.activityPreserved ? 'PRESERVED' : 'RESCHEDULE_NEEDED',
        routeSummary,
        explanation: item.explanation,
        details: {
          leg1,
          leg2,
          operator,
          availability: 'Instant Auto-Reservation Available'
        }
      };
    });

    return plans;
  }

  /**
   * Retrieves the top recommended plan.
   */
  public static getRecommendedPlan(context: RecoveryContext): RecoveryPlan | null {
    const plans = RecoveryEngine.generatePlans(context);
    return plans.length > 0 ? plans[0] : null;
  }

  /**
   * Validates a candidate recovery plan independently.
   */
  public static validatePlan(
    candidate: CandidatePlanDraft,
    context: RecoveryContext
  ): FeasibilityResult {
    return FeasibilityEngine.isRecoveryPlanFeasible(candidate, context);
  }
}
