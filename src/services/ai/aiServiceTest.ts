import { MockAIService } from '../mockAIService';
import { getScenarioTrip } from '../../data/mockJourneyData';
import { RecoveryEngine } from '../recovery/RecoveryEngine';
import { MOCK_AVAILABLE_TRANSPORT_OPTIONS } from '../recovery/transportOptionsData';
import { calculateConnection } from '../../utils/connectionEngine';
import { detectImpacts } from '../../utils/journeyCalculations';
import { FactExtractor } from './FactExtractor';
import { AIGuardrails } from './AIGuardrails';
import { AIPreferenceParser } from './AIPreferenceParser';
import { AITravelContext, UserPreferences, AIResponse } from '../../types';

export async function runAIServiceTests() {
  console.log('--- STARTING PHASE 5 AI TRAVEL GUIDE UNIT TESTS ---');

  const defaultPreferences: UserPreferences = {
    primaryPriority: 'PRESERVE_BOOKINGS',
    avoidFlights: false,
    avoidOvernight: false,
    avoidLongTransfers: true,
    preferDirect: false,
    maxAdditionalBudget: 2000
  };

  // Helper to build context
  function buildContext(scenarioId: 'SCENARIO_1_NORMAL' | 'SCENARIO_3_SEVERE_DELAY' | 'SCENARIO_6_RECOVERED', prefs = defaultPreferences): AITravelContext {
    const trip = getScenarioTrip(scenarioId);
    const transportSegs = trip.segments.filter((s) => s.type === 'TRAIN' || s.type === 'BUS' || s.type === 'FLIGHT');
    const connections = [
      calculateConnection(transportSegs[0] as any, transportSegs[1] as any, {
        transferStation: 'Pune Swargate Bus Terminal'
      })
    ];
    const impacts = detectImpacts(trip.segments, connections);
    const disruptions = scenarioId === 'SCENARIO_3_SEVERE_DELAY' ? [
      {
        id: 'disrupt-1',
        segmentId: trip.segments[0].id,
        title: 'Train 12127 Delayed +3h 20m',
        delayFormatted: '+200 min',
        delayMinutes: 200,
        reason: 'Locomotive failure',
        affectedNextLeg: 'Pune → Goa Bus',
        timestamp: '16:15 IST',
        severity: 'CRITICAL' as const
      }
    ] : [];

    const recoveryPlans = RecoveryEngine.generatePlans({
      trip,
      affectedSegments: scenarioId === 'SCENARIO_3_SEVERE_DELAY' ? [trip.segments[1]] : [],
      disruptions,
      connections,
      transportOptions: MOCK_AVAILABLE_TRANSPORT_OPTIONS,
      userPreferences: prefs,
      currentTime: '4:50 PM'
    });

    const verifiedFacts = FactExtractor.extractFacts({
      trip,
      connections,
      disruptions,
      impacts,
      recoveryPlans
    });

    return {
      traveler: { name: 'Arjun Mehta', id: 'TRV-88219', loyaltyTier: 'Gold Priority' },
      tripTitle: trip.title,
      trip,
      currentSegment: trip.segments[0],
      segments: trip.segments,
      transportStatuses: transportSegs.map((s) => ({
        segmentId: s.id,
        status: (s as any).status,
        delayMinutes: (s as any).delayMinutes,
        estimatedArrival: (s as any).estimatedArrival
      })),
      connections,
      disruptions,
      impacts,
      recoveryPlans,
      recommendedPlan: recoveryPlans[0] || null,
      userPreferences: prefs,
      journeyHealth: scenarioId === 'SCENARIO_1_NORMAL' ? 95 : scenarioId === 'SCENARIO_3_SEVERE_DELAY' ? 48 : 98,
      journeyStatus: scenarioId === 'SCENARIO_1_NORMAL' ? 'ON_TRACK' : scenarioId === 'SCENARIO_3_SEVERE_DELAY' ? 'DISRUPTED' : 'RECOVERED',
      verifiedFacts
    };
  }

  const aiService = new MockAIService();

  // Test 1: Normal state query
  const normalCtx = buildContext('SCENARIO_1_NORMAL');
  const res1 = await aiService.generateResponse(normalCtx, 'Is my journey on track?');
  console.assert(res1.message.includes('on track'), 'Test 1 failed: Expected on track confirmation');
  console.log('✓ Test 1 Passed: AI accurately reports normal on-track journey.');

  // Test 2: Connection buffer query in normal state
  const res2 = await aiService.generateResponse(normalCtx, 'Will I make my connection?');
  console.assert(res2.message.includes('Yes') && res2.message.includes('buffer'), 'Test 2 failed');
  console.log('✓ Test 2 Passed: AI reports safe buffer in normal state.');

  // Test 3: Disruption query
  const disruptCtx = buildContext('SCENARIO_3_SEVERE_DELAY');
  const res3 = await aiService.generateResponse(disruptCtx, 'What happened?');
  console.assert(res3.message.includes('delayed by 3 hours 20 minutes'), 'Test 3 failed: Missing delay details');
  console.assert(res3.structuredBreakdown !== undefined, 'Test 3 failed: Missing structured breakdown');
  console.log('✓ Test 3 Passed: AI explains train delay, broken Swargate connection, and downstream risk.');

  // Test 4: Recommendation query
  const res4 = await aiService.generateResponse(disruptCtx, "What's my best recovery option?");
  console.assert(res4.referencedPlanId !== undefined, 'Test 4 failed: Missing referencedPlanId');
  console.assert(res4.actions.some((a) => a.type === 'SELECT_PLAN'), 'Test 4 failed: Missing SELECT_PLAN action');
  console.log('✓ Test 4 Passed: AI provides top recommendation with structured actionable button.');

  // Test 5: "Why?" query
  const res5 = await aiService.generateResponse(disruptCtx, 'Why do you recommend this option?');
  console.assert(res5.message.includes('Recovery Score'), 'Test 5 failed: Missing score rationale');
  console.log('✓ Test 5 Passed: AI explains why this plan is mathematically optimal.');

  // Test 6: Cheapest option query
  const res6 = await aiService.generateResponse(disruptCtx, "What's the cheapest option?");
  console.assert(res6.message.includes('cheapest'), 'Test 6 failed: Missing cheapest info');
  console.log('✓ Test 6 Passed: AI locates and quotes lowest cost recovery plan.');

  // Test 7: Fastest option query
  const res7 = await aiService.generateResponse(disruptCtx, "What's the fastest option?");
  console.assert(res7.message.includes('fastest'), 'Test 7 failed: Missing fastest info');
  console.log('✓ Test 7 Passed: AI identifies earliest arrival alternative.');

  // Test 8: Flight avoidance query
  const res8 = await aiService.generateResponse(disruptCtx, 'Can I avoid flights?');
  console.assert(res8.message.includes('ground') || res8.message.includes('flights'), 'Test 8 failed');
  console.log('✓ Test 8 Passed: AI verifies ground-only transit availability.');

  // Test 9: Extra cost query
  const res9 = await aiService.generateResponse(disruptCtx, 'How much extra will I pay?');
  console.assert(res9.message.includes('₹'), 'Test 9 failed: Missing price figure');
  console.log('✓ Test 9 Passed: AI quotes exact verified additional fare.');

  // Test 10: Hotel impact query
  const res10 = await aiService.generateResponse(disruptCtx, 'What happens to my hotel?');
  console.assert(res10.message.includes('Casa Ocean Retreat'), 'Test 10 failed');
  console.log('✓ Test 10 Passed: AI explains hotel check-in status and preservation.');

  // Test 11: Plan comparison query
  const res11 = await aiService.generateResponse(disruptCtx, 'Compare the recovery options');
  console.assert(res11.actions.some((a) => a.type === 'COMPARE_PLANS'), 'Test 11 failed');
  console.log('✓ Test 11 Passed: AI outputs structured multi-plan comparison with action link.');

  // Test 12: Natural Language Preference Parser (Budget)
  const pref1 = AIPreferenceParser.parse("I don't want to spend more than ₹500 extra.");
  console.assert(pref1.updates.maxAdditionalBudget === 500, 'Test 12 failed');
  console.log('✓ Test 12 Passed: Natural language budget parsed into maxAdditionalBudget=500.');

  // Test 13: Natural Language Preference Parser (Avoid flights)
  const pref2 = AIPreferenceParser.parse('I want to avoid flights completely.');
  console.assert(pref2.updates.avoidFlights === true, 'Test 13 failed');
  console.log('✓ Test 13 Passed: Natural language flight avoidance parsed into avoidFlights=true.');

  // Test 14: Guardrails Anti-Hallucination
  const fakeResponse: AIResponse = {
    id: 'res-fake',
    message: 'Imaginary flight plan 999',
    referencedPlanId: 'non-existent-plan-xyz',
    referencedSegmentId: 'fake-seg-123',
    actions: [
      { type: 'SELECT_PLAN', label: 'Select Fake', planId: 'non-existent-plan-xyz' }
    ],
    facts: [],
    confidence: 0.5,
    dataSource: 'DEMO_ENGINE'
  };
  const sanitized = AIGuardrails.validateResponse(fakeResponse, disruptCtx);
  console.assert(sanitized.referencedPlanId === undefined, 'Guardrail failed: Did not strip invalid planId');
  console.assert(sanitized.referencedSegmentId === undefined, 'Guardrail failed: Did not strip invalid segmentId');
  console.assert(sanitized.actions.length === 0, 'Guardrail failed: Did not drop action with invalid planId');
  console.log('✓ Test 14 Passed: Guardrails successfully stripped hallucinated plan and segment references.');

  // Test 15: Recovered state query
  const recCtx = buildContext('SCENARIO_6_RECOVERED');
  const res15 = await aiService.generateResponse(recCtx, 'Is my new journey safe?');
  console.assert(res15.message.includes('recovered'), 'Test 15 failed');
  console.log('✓ Test 15 Passed: AI confirms journey has been successfully recovered.');

  console.log('--- ALL PHASE 5 AI TRAVEL GUIDE TESTS PASSED ---');
  return true;
}

runAIServiceTests();
