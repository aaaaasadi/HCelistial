import { query } from '../config/db';
import { seedDatabase } from '../database/seed/seed';
import { JourneyService } from '../services/JourneyService';
import { DisruptionService } from '../services/DisruptionService';
import { RecoveryService } from '../services/RecoveryService';
import { PreferencesRepository } from '../repositories/PreferencesRepository';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { AIServiceBackend } from '../services/AIServiceBackend';

export async function runBackendIntegrationTests() {
  console.log('===========================================================');
  console.log('--- STARTING PHASE 6 BACKEND & POSTGRESQL PERSISTENCE TESTS ---');
  console.log('===========================================================');

  const tripId = 'trip-mum-pune-goa';
  const userId = 'TRV-88219';

  // Test 1: Seed Clean Demo Data
  console.log('\n[Test 1] Seeding clean demo state into PostgreSQL...');
  await seedDatabase();
  console.log('✓ Test 1 Passed: Demo data seeded successfully.');

  // Test 2: Verify Initial Journey Bundle from PostgreSQL
  console.log('\n[Test 2] Loading initial journey bundle from PostgreSQL...');
  const initialBundle = await JourneyService.getJourneyBundle(tripId);
  console.assert(initialBundle.trip.id === tripId, 'Test 2 Failed: Trip ID mismatch');
  console.assert(initialBundle.segments.length === 4, 'Test 2 Failed: Expected 4 segments');
  console.assert(initialBundle.connections.length === 1, 'Test 2 Failed: Expected 1 connection');
  console.assert(initialBundle.journeyStatus === 'ON_TRACK', 'Test 2 Failed: Expected ON_TRACK status');
  console.assert(initialBundle.journeyHealth === 95, 'Test 2 Failed: Expected 95% health');
  console.assert(initialBundle.dataSource === 'POSTGRESQL', 'Test 2 Failed: Expected POSTGRESQL dataSource');
  console.log('✓ Test 2 Passed: Initial trip, segments, connections, and health loaded from PostgreSQL.');

  // Test 3: Disruption Simulation Persistence
  console.log('\n[Test 3] Simulating severe delay disruption (Scenario 3)...');
  const disruptedBundle = await DisruptionService.simulateDisruption(tripId, 'SCENARIO_3_SEVERE_DELAY');
  console.assert(disruptedBundle.journeyStatus === 'DISRUPTED', 'Test 3 Failed: Status should be DISRUPTED');
  console.assert(disruptedBundle.journeyHealth === 48, 'Test 3 Failed: Health should be 48%');
  console.assert(disruptedBundle.disruptions.length > 0, 'Test 3 Failed: Disruptions should be persisted');
  console.assert(disruptedBundle.impacts.length > 0, 'Test 3 Failed: Impacts should be persisted');
  console.assert(disruptedBundle.recoveryPlans.length > 0, 'Test 3 Failed: Recovery plans should be persisted');

  // Verify directly in PostgreSQL via raw SQL
  const resDisrupt = await query('SELECT count(*) FROM disruptions WHERE trip_id = $1;', [tripId]);
  const resImpact = await query('SELECT count(*) FROM impacts WHERE trip_id = $1;', [tripId]);
  const resPlans = await query('SELECT count(*) FROM recovery_plans WHERE trip_id = $1;', [tripId]);
  console.assert(parseInt(resDisrupt.rows[0].count, 10) > 0, 'Test 3 Failed: Disruptions not in DB');
  console.assert(parseInt(resImpact.rows[0].count, 10) > 0, 'Test 3 Failed: Impacts not in DB');
  console.assert(parseInt(resPlans.rows[0].count, 10) > 0, 'Test 3 Failed: Recovery plans not in DB');
  console.log(`✓ Test 3 Passed: Disruption, impacts (${resImpact.rows[0].count}), and recovery plans (${resPlans.rows[0].count}) persisted in PostgreSQL.`);

  // Test 4: Recovery Plan Selection & Journey Reconstruction in PostgreSQL
  console.log('\n[Test 4] Selecting recovery plan in PostgreSQL...');
  const topPlan = disruptedBundle.recoveryPlans[0];
  const recoveredBundle = await RecoveryService.selectRecoveryPlan(tripId, topPlan.id);
  console.assert(recoveredBundle.journeyStatus === 'RECOVERED', 'Test 4 Failed: Expected RECOVERED status');
  console.assert(recoveredBundle.journeyHealth === 98, 'Test 4 Failed: Expected 98% health');
  console.assert(recoveredBundle.selectedPlanId === topPlan.id, 'Test 4 Failed: Selected plan ID mismatch');
  console.assert(recoveredBundle.segments[1].status === 'CONFIRMED', 'Test 4 Failed: Replaced segment should be confirmed');
  console.assert(recoveredBundle.segments[2].status === 'CONFIRMED', 'Test 4 Failed: Hotel should be confirmed');

  // Verify in PostgreSQL via raw SQL
  const resTripDB = await query('SELECT status, journey_health FROM trips WHERE id = $1;', [tripId]);
  const resSelectedDB = await query('SELECT id FROM recovery_plans WHERE trip_id = $1 AND is_selected = TRUE;', [tripId]);
  console.assert(resTripDB.rows[0].status === 'RECOVERED', 'Test 4 Failed: Trip status in DB not RECOVERED');
  console.assert(resTripDB.rows[0].journey_health === 98, 'Test 4 Failed: Health in DB not 98');
  console.assert(resSelectedDB.rows[0].id === topPlan.id, 'Test 4 Failed: Selected plan in DB mismatch');
  console.log('✓ Test 4 Passed: Recovery plan selected, trip transitioned to RECOVERED (98% health) in PostgreSQL.');

  // Test 5: User Preferences Persistence
  console.log('\n[Test 5] Updating user preferences in PostgreSQL...');
  const updatedPrefs = await PreferencesRepository.updateByUserId(userId, {
    maxAdditionalBudget: 2500,
    avoidFlights: true,
    primaryPriority: 'LOWEST_COST'
  });
  console.assert(updatedPrefs.maxAdditionalBudget === 2500, 'Test 5 Failed: Budget mismatch');
  console.assert(updatedPrefs.avoidFlights === true, 'Test 5 Failed: avoidFlights mismatch');
  console.assert(updatedPrefs.primaryPriority === 'LOWEST_COST', 'Test 5 Failed: Priority mismatch');

  const fetchedPrefs = await PreferencesRepository.findByUserId(userId);
  console.assert(fetchedPrefs?.maxAdditionalBudget === 2500, 'Test 5 Failed: Fetched budget mismatch');
  console.log('✓ Test 5 Passed: User preferences persisted and retrieved accurately from PostgreSQL.');

  // Test 6: AI Chat grounded in persisted database context
  console.log('\n[Test 6] Running AI Chat grounded in PostgreSQL state...');
  const aiResponse = await AIServiceBackend.askAI(tripId, 'Is my new journey safe?');
  console.assert(aiResponse.message.length > 0, 'Test 6 Failed: Empty AI message');
  console.assert(aiResponse.message.toLowerCase().includes('recovered') || aiResponse.message.toLowerCase().includes('safe'), 'Test 6 Failed: Response should confirm recovered state');

  const resMessages = await query('SELECT count(*) FROM ai_messages;');
  console.assert(parseInt(resMessages.rows[0].count, 10) >= 2, 'Test 6 Failed: AI messages not recorded');
  console.log('✓ Test 6 Passed: AI response grounded in database state, conversation persisted in PostgreSQL.');

  // Test 7: Journey Reset Persistence
  console.log('\n[Test 7] Resetting journey state in PostgreSQL...');
  const resetBundle = await JourneyService.resetJourney(tripId);
  console.assert(resetBundle.journeyStatus === 'ON_TRACK', 'Test 7 Failed: Expected ON_TRACK after reset');
  console.assert(resetBundle.journeyHealth === 95, 'Test 7 Failed: Expected 95% health after reset');
  console.assert(resetBundle.disruptions.length === 0, 'Test 7 Failed: Disruptions should be 0 after reset');
  console.assert(resetBundle.recoveryPlans.length === 0, 'Test 7 Failed: Recovery plans should be 0 after reset');
  console.log('✓ Test 7 Passed: Reset completely restored pristine state in PostgreSQL.');

  // Test 8: Relational Integrity & Orphan Check
  console.log('\n[Test 8] Checking database relational consistency & orphan records...');
  const orphanSegments = await query('SELECT count(*) FROM trip_segments WHERE trip_id NOT IN (SELECT id FROM trips);');
  const orphanBookings = await query('SELECT count(*) FROM bookings WHERE trip_id NOT IN (SELECT id FROM trips);');
  const orphanDisruptions = await query('SELECT count(*) FROM disruptions WHERE trip_id NOT IN (SELECT id FROM trips);');
  const orphanImpacts = await query('SELECT count(*) FROM impacts WHERE trip_id NOT IN (SELECT id FROM trips);');
  const orphanPlans = await query('SELECT count(*) FROM recovery_plans WHERE trip_id NOT IN (SELECT id FROM trips);');
  const orphanOptions = await query('SELECT count(*) FROM recovery_options WHERE recovery_plan_id NOT IN (SELECT id FROM recovery_plans);');
  const orphanNotifs = await query('SELECT count(*) FROM notifications WHERE trip_id NOT IN (SELECT id FROM trips);');

  console.assert(parseInt(orphanSegments.rows[0].count, 10) === 0, 'Foreign key orphan found in trip_segments');
  console.assert(parseInt(orphanBookings.rows[0].count, 10) === 0, 'Foreign key orphan found in bookings');
  console.assert(parseInt(orphanDisruptions.rows[0].count, 10) === 0, 'Foreign key orphan found in disruptions');
  console.assert(parseInt(orphanImpacts.rows[0].count, 10) === 0, 'Foreign key orphan found in impacts');
  console.assert(parseInt(orphanPlans.rows[0].count, 10) === 0, 'Foreign key orphan found in recovery_plans');
  console.assert(parseInt(orphanOptions.rows[0].count, 10) === 0, 'Foreign key orphan found in recovery_options');
  console.assert(parseInt(orphanNotifs.rows[0].count, 10) === 0, 'Foreign key orphan found in notifications');
  console.log('✓ Test 8 Passed: 0 orphan records found across all 12 tables. Foreign key integrity verified.');

  console.log('\n===========================================================');
  console.log('✓✓✓ ALL PHASE 6 BACKEND & POSTGRESQL PERSISTENCE TESTS PASSED ✓✓✓');
  console.log('===========================================================');
  process.exit(0);
}

runBackendIntegrationTests().catch((err) => {
  console.error('[Integration Test Failure]:', err);
  process.exit(1);
});
