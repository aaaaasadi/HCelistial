import { Normalizer } from '../services/transport/Normalizer';
import { TransportCache } from '../services/transport/TransportCache';
import { MockTrainProvider } from '../services/transport/providers/MockTrainProvider';
import { RealTrainProvider } from '../services/transport/providers/RealTrainProvider';
import { MockBusProvider } from '../services/transport/providers/MockBusProvider';
import { RealBusProvider } from '../services/transport/providers/RealBusProvider';
import { MockFlightProvider } from '../services/transport/providers/MockFlightProvider';
import { RealFlightProvider } from '../services/transport/providers/RealFlightProvider';
import { TRAIN_FIXTURES } from '../services/transport/fixtures/trainFixtures';
import { BUS_FIXTURES } from '../services/transport/fixtures/busFixtures';
import { FLIGHT_FIXTURES } from '../services/transport/fixtures/flightFixtures';

export async function runProviderTests() {
  console.log('===========================================================');
  console.log('--- RUNNING PHASE 7 TRANSPORT PROVIDER & NORMALIZER TESTS ---');
  console.log('===========================================================');

  // Test 1: Normalizer - Train Live On-Time
  console.log('\n[Test 1] Testing Train Normalizer with On-Time Fixture...');
  const normTrainOnTime = Normalizer.normalizeTrainLiveStatus(
    TRAIN_FIXTURES.onTime12127,
    '12127',
    'REAL',
    'Indian Railways Live API'
  );
  console.assert(normTrainOnTime.status === 'ON_TIME', 'Status should be ON_TIME');
  console.assert(normTrainOnTime.delayMinutes === 0, 'Delay should be 0');
  console.assert(normTrainOnTime.sourceType === 'REAL', 'SourceType should be REAL');
  console.assert(normTrainOnTime.currentLocation === 'Kalyan Junction', 'Location mismatch');
  console.log('✓ Test 1 Passed: On-time train normalized accurately.');

  // Test 2: Normalizer - Train Live Delayed (+200m)
  console.log('\n[Test 2] Testing Train Normalizer with Delayed Fixture (+200m)...');
  const normTrainDelayed = Normalizer.normalizeTrainLiveStatus(
    TRAIN_FIXTURES.delayed12127,
    '12127',
    'REAL',
    'Indian Railways Live API'
  );
  console.assert(normTrainDelayed.status === 'DELAYED', 'Status should be DELAYED');
  console.assert(normTrainDelayed.delayMinutes === 200, 'Delay should be 200 min');
  console.assert(normTrainDelayed.expectedArrival === '4:50 PM', 'Expected arrival mismatch');
  console.assert(normTrainDelayed.reason?.includes('Signaling'), 'Reason missing');
  console.log('✓ Test 2 Passed: Delayed train normalized accurately with delay reason.');

  // Test 3: Normalizer - Train Cancelled
  console.log('\n[Test 3] Testing Train Normalizer with Cancelled Fixture...');
  const normTrainCancelled = Normalizer.normalizeTrainLiveStatus(
    TRAIN_FIXTURES.cancelled12127,
    '12127',
    'REAL',
    'Indian Railways Live API'
  );
  console.assert(normTrainCancelled.status === 'CANCELLED', 'Status should be CANCELLED');
  console.assert(normTrainCancelled.reason?.includes('boulder collapse'), 'Cancellation reason mismatch');
  console.log('✓ Test 3 Passed: Cancelled train normalized accurately.');

  // Test 4: Normalizer - Anti-Hallucination Guardrail (Unknown Availability & Price)
  console.log('\n[Test 4] Testing Anti-Hallucination Guardrails on Bus with Missing Seats...');
  const rawBusNoSeats = {
    operator_name: 'Test Bus Co',
    service_number: 'TB-100',
    fare: 500
    // No available_seats reported
  };
  const normBusNoSeats = Normalizer.normalizeBusOption(rawBusNoSeats, 'REAL', 'Test Bus Provider');
  console.assert(normBusNoSeats.availableSeats === null, 'Seats must be null when not reported');
  console.assert(normBusNoSeats.availabilityStatus === 'UNKNOWN', 'Status must be UNKNOWN');
  console.assert(normBusNoSeats.fareRupees === 500, 'Fare mismatch');
  console.log('✓ Test 4 Passed: Unknown availability preserved without inventing seat counts.');

  // Test 5: Normalizer - Flight Options
  console.log('\n[Test 5] Testing Flight Normalizer with Standby Fixtures...');
  const normFlights = FLIGHT_FIXTURES.standbyFlights.map((f) =>
    Normalizer.normalizeFlightOption(f, 'REAL', 'Aviation Flight API')
  );
  console.assert(normFlights.length === 2, 'Expected 2 flight options');
  console.assert(normFlights[0].serviceNumber === '6E-5128', 'Flight number mismatch');
  console.assert(normFlights[0].fareRupees === 3900, 'Fare mismatch');
  console.assert(normFlights[0].availableSeats === 3, 'Seat count mismatch');
  console.assert(normFlights[0].availabilityStatus === 'AVAILABLE', 'Availability status mismatch');
  console.log('✓ Test 5 Passed: Flight options normalized with accurate fares and seats.');

  // Test 6: TransportCache TTL and Clean-up
  console.log('\n[Test 6] Testing TransportCache in-memory TTL caching...');
  TransportCache.clear();
  TransportCache.set('test:key', { value: 123 }, 1); // 1 sec TTL
  console.assert(TransportCache.get('test:key') !== null, 'Cache entry should exist immediately');
  await new Promise((resolve) => setTimeout(resolve, 1100));
  console.assert(TransportCache.get('test:key') === null, 'Cache entry should expire after TTL');
  console.log('✓ Test 6 Passed: TransportCache stores, retrieves, and expires entries correctly.');

  // Test 7: Provider Adapters (Mock Mode)
  console.log('\n[Test 7] Testing Mock Train, Bus, Flight providers...');
  const mockTrain = new MockTrainProvider();
  const mockBus = new MockBusProvider();
  const mockFlight = new MockFlightProvider();

  const trains = await mockTrain.searchTrains({ origin: 'Mumbai', destination: 'Pune' });
  const buses = await mockBus.searchBuses({ origin: 'Pune', destination: 'Goa' });
  const flights = await mockFlight.searchFlights({ origin: 'BOM', destination: 'GOI' });

  console.assert(trains.length >= 2, 'Expected at least 2 mock trains');
  console.assert(buses.length >= 3, 'Expected at least 3 mock buses');
  console.assert(flights.length >= 2, 'Expected at least 2 mock flights');
  console.assert(trains[0].sourceType === 'MOCK', 'SourceType should be MOCK');
  console.assert(buses[0].sourceType === 'MOCK', 'SourceType should be MOCK');
  console.assert(flights[0].sourceType === 'MOCK', 'SourceType should be MOCK');
  console.log('✓ Test 7 Passed: Mock providers returned verified canonical options.');

  // Test 8: Real Providers Fallback Behavior
  console.log('\n[Test 8] Testing Real Providers fallback behavior when keys are missing...');
  const realTrain = new RealTrainProvider({ apiKey: undefined, allowFallback: true });
  const realBus = new RealBusProvider({ apiKey: undefined, allowFallback: true });
  const realFlight = new RealFlightProvider({ apiKey: undefined, allowFallback: true });

  const fallbackTrains = await realTrain.searchTrains({ origin: 'Mumbai', destination: 'Pune' });
  const fallbackBuses = await realBus.searchBuses({ origin: 'Pune', destination: 'Goa' });
  const fallbackFlights = await realFlight.searchFlights({ origin: 'BOM', destination: 'GOI' });

  console.assert(fallbackTrains.length > 0, 'Fallback trains should not be empty');
  console.assert(fallbackBuses.length > 0, 'Fallback buses should not be empty');
  console.assert(fallbackFlights.length > 0, 'Fallback flights should not be empty');
  console.assert(fallbackTrains[0].sourceType === 'MOCK', 'Fallback trains must be stamped MOCK');
  console.log('✓ Test 8 Passed: Real providers transparently fell back to mock mode and stamped source MOCK.');

  // Test 9: Real Provider Strict Error Handling (When Fallback is Disabled)
  console.log('\n[Test 9] Testing Real Provider strict error mode when fallback is disabled...');
  const strictRealTrain = new RealTrainProvider({ apiKey: undefined, allowFallback: false });
  let threw = false;
  try {
    await strictRealTrain.searchTrains({ origin: 'Mumbai', destination: 'Pune' });
  } catch (err: any) {
    threw = true;
    console.assert(err.message.includes('TRAIN_API_KEY'), 'Should report missing TRAIN_API_KEY');
  }
  console.assert(threw, 'Strict real provider must throw when credentials are missing');
  console.log('✓ Test 9 Passed: Strict error handling verified without fallback.');

  console.log('\n===========================================================');
  console.log('✓✓✓ ALL 9 TRANSPORT PROVIDER & NORMALIZER TESTS PASSED ✓✓✓');
  console.log('===========================================================');
}

runProviderTests().catch((err) => {
  console.error('[Provider Test Error]:', err);
  process.exit(1);
});
