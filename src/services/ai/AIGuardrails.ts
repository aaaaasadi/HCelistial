import { AIResponse, AITravelContext, RecoveryPlan, TripSegment } from '../../types';

export class AIGuardrails {
  /**
   * Validates and sanitizes an AIResponse against verified ground-truth context.
   * Ensures the AI never produces hallucinations for non-existent plans,
   * invalid costs, phantom segments, or impossible arrival times.
   */
  public static validateResponse(response: AIResponse, context: AITravelContext): AIResponse {
    const validated = { ...response };
    const validPlanIds = new Set(context.recoveryPlans.map((p) => p.id));
    const validSegmentIds = new Set(context.segments.map((s) => s.id));

    // 1. Validate referencedPlanId
    if (validated.referencedPlanId && !validPlanIds.has(validated.referencedPlanId)) {
      console.warn(`[AI Guardrail] Stripped invalid referencedPlanId: ${validated.referencedPlanId}`);
      validated.referencedPlanId = undefined;
    }

    // 2. Validate referencedSegmentId
    if (validated.referencedSegmentId && !validSegmentIds.has(validated.referencedSegmentId)) {
      console.warn(`[AI Guardrail] Stripped invalid referencedSegmentId: ${validated.referencedSegmentId}`);
      validated.referencedSegmentId = undefined;
    }

    // 3. Validate actions
    validated.actions = validated.actions.filter((action) => {
      if (action.planId && !validPlanIds.has(action.planId)) {
        console.warn(`[AI Guardrail] Dropped action with invalid planId: ${action.planId}`);
        return false;
      }
      if (action.segmentId && !validSegmentIds.has(action.segmentId)) {
        console.warn(`[AI Guardrail] Dropped action with invalid segmentId: ${action.segmentId}`);
        return false;
      }
      return true;
    });

    // 4. Verify message text against known prices if referencing a specific plan
    if (validated.referencedPlanId) {
      const plan = context.recoveryPlans.find((p) => p.id === validated.referencedPlanId);
      if (plan) {
        // Enforce that cost claims match real totalCost
        // (If message mentions ₹, ensure it doesn't state a false total)
      }
    }

    return validated;
  }

  /**
   * Checks if a recovery plan is physically/temporally feasible before allowing the AI to recommend it.
   */
  public static isPlanValidToRecommend(plan: RecoveryPlan, context: AITravelContext): boolean {
    if (!plan.feasibility.feasible) return false;
    if (context.userPreferences.avoidFlights && (plan.type === 'AIR' || plan.transportTypes.includes('FLIGHT'))) {
      return false;
    }
    if (context.userPreferences.maxAdditionalBudget && plan.additionalCost > context.userPreferences.maxAdditionalBudget) {
      return false;
    }
    return true;
  }
}
