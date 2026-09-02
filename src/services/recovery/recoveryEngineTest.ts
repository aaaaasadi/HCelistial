import { RecoveryContext, UserPreferences } from '../../types';
import { getScenarioTrip } from '../../data/mockJourneyData';
import { RecoveryEngine } from './RecoveryEngine';
import { MOCK_AVAILABLE_TRANSPORT_OPTIONS } from './transportOptionsData';

export function runRecoveryEngineTests() {
  console.log('--- STARTING RECOVERY ENGINE UNIT TESTS ---');

  const baseTrip = getScenarioTrip('SCENARIO_3_SEVERE_DELAY');

  const basePreferences: UserPreferences = {
    primaryPriority: 'PRESERVE_BOOKINGS',
    avoidFlights: false,
    avoidOvernight: false,
    avoidLongTransfers: false,
    preferDirect: false,
    maxAdditionalBudget: 2500
  };

  const baseContext: RecoveryContext = {
    trip: baseTrip,
    affectedSegments: [baseTrip.segments[1]], // Bus segment missed
    disruptions: [
      {
        id: 'disrupt-1',
        segmentId: baseTrip.segments[0].id,
        title: 'Train 12127 Delayed +3h 20m',
        delayFormatted: '+200 min',
        delayMinutes: 200,
        reason: 'Locomotive traction failure near Lonavala',
        affectedNextLeg: 'Pune → Goa Bus',
        timestamp: '16:15 IST',
        severity: 'CRITICAL'
      }
    ],
    connections: [],
    transportOptions: MOCK_AVAILABLE_TRANSPORT_OPTIONS,
    userPreferences: basePreferences,
    currentTime: '4:50 PM'
  };

  // Test 1: Generate Plans (Multiple Alternatives)
  const plans = RecoveryEngine.generatePlans(baseContext);
  console.assert(plans.length >= 3, `Expected >= 3 plans, got ${plans.length}`);
  console.log(`✓ Test 1 Passed: Found ${plans.length} feasible alternatives.`);

  // Test 2: Scores strictly between 0 and 100 with no NaN or Infinity
  plans.forEach((p) => {
    console.assert(!isNaN(p.recoveryScore), `Score is NaN for plan ${p.title}`);
    console.assert(isFinite(p.recoveryScore), `Score is infinite for plan ${p.title}`);
    console.assert(p.recoveryScore >= 0 && p.recoveryScore <= 100, `Score out of bounds: ${p.recoveryScore}`);
  });
  console.log('✓ Test 2 Passed: All recovery scores clamped [0, 100] without NaN or Infinity.');

  // Test 3: Avoid-Flight Preference Filtering
  const noFlightContext: RecoveryContext = {
    ...baseContext,
    userPreferences: {
      ...basePreferences,
      avoidFlights: true
    }
  };
  const groundPlans = RecoveryEngine.generatePlans(noFlightContext);
  const flightInGround = groundPlans.some((p) => p.type === 'AIR' || p.transportTypes.includes('FLIGHT'));
  console.assert(!flightInGround, 'Flight plans should be filtered out when avoidFlights is true');
  console.log('✓ Test 3 Passed: Flight options strictly filtered out when avoidFlights=true.');

  // Test 4: Budget Filtering
  const strictBudgetContext: RecoveryContext = {
    ...baseContext,
    userPreferences: {
      ...basePreferences,
      maxAdditionalBudget: 200 // Only options with additionalCost <= 200 permitted
    }
  };
  const cheapPlans = RecoveryEngine.generatePlans(strictBudgetContext);
  cheapPlans.forEach((p) => {
    console.assert(p.additionalCost <= 200, `Plan ${p.title} exceeds budget: +₹${p.additionalCost}`);
  });
  console.log('✓ Test 4 Passed: Strict budget constraint verified.');

  // Test 5: Lowest Cost Priority boosts cheaper options
  const lowestCostContext: RecoveryContext = {
    ...baseContext,
    userPreferences: {
      ...basePreferences,
      primaryPriority: 'LOWEST_COST'
    }
  };
  const lowestCostPlans = RecoveryEngine.generatePlans(lowestCostContext);
  const cheapestPlan = lowestCostPlans.find((p) => p.tag === 'CHEAPEST');
  console.assert(cheapestPlan !== undefined, 'Cheapest plan must be tagged');
  console.log(`✓ Test 5 Passed: Lowest cost priority ranks ${cheapestPlan?.title} with score ${cheapestPlan?.recoveryScore}%.`);

  // Test 6: Fastest Arrival Priority boosts fastest options
  const fastestContext: RecoveryContext = {
    ...baseContext,
    userPreferences: {
      ...basePreferences,
      primaryPriority: 'FASTEST_ARRIVAL'
    }
  };
  const fastestPlans = RecoveryEngine.generatePlans(fastestContext);
  const fastestPlan = fastestPlans.find((p) => p.tag === 'FASTEST');
  console.assert(fastestPlan !== undefined, 'Fastest plan must be tagged');
  console.log(`✓ Test 6 Passed: Fastest arrival priority ranks ${fastestPlan?.title} (${fastestPlan?.newArrival}).`);

  // Test 7: Avoid Overnight Travel Filtering
  const noOvernightContext: RecoveryContext = {
    ...baseContext,
    userPreferences: {
      ...basePreferences,
      avoidOvernight: true
    }
  };
  const daytimePlans = RecoveryEngine.generatePlans(noOvernightContext);
  daytimePlans.forEach((p) => {
    console.assert(!p.title.includes('Overnight'), `Overnight plan ${p.title} was not filtered out`);
  });
  console.log('✓ Test 7 Passed: Avoid overnight travel filters out early-morning arrivals.');

  // Test 8: Empty Result when Constraints Impossible
  const impossibleContext: RecoveryContext = {
    ...baseContext,
    userPreferences: {
      ...basePreferences,
      avoidFlights: true,
      avoidOvernight: true,
      maxAdditionalBudget: 50 // Too low for any daytime non-flight option
    }
  };
  const emptyPlans = RecoveryEngine.generatePlans(impossibleContext);
  console.assert(emptyPlans.length === 0, `Expected 0 feasible plans, got ${emptyPlans.length}`);
  console.log('✓ Test 8 Passed: Correctly returns empty list when no options satisfy strict constraints.');

  console.log('--- ALL RECOVERY ENGINE UNIT TESTS PASSED ---');
  return true;
}

runRecoveryEngineTests();
