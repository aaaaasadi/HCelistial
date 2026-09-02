import { ImpactCascadeStep, RecoveryPlan, UserPreferences } from '../types';
import { RecoveryEngine } from './recovery/RecoveryEngine';
import { getScenarioTrip } from '../data/mockJourneyData';
import { MOCK_AVAILABLE_TRANSPORT_OPTIONS } from './recovery/transportOptionsData';

export class MockRecoveryEngine {
  public static getImpactCascade(): ImpactCascadeStep[] {
    return [
      {
        id: 'impact-1',
        stageName: 'TRAIN DELAY',
        segmentType: 'TRAIN',
        title: 'Initial Disruption: Mumbai → Pune Delay',
        status: '3h 20m Delay',
        severity: 'HIGH',
        description: 'Traction motor and signaling breakdown outside Karjat has halted Express 12127.',
        originalTime: '10:00 AM → 1:30 PM',
        projectedTime: 'Expected Arrival: 4:50 PM (+200 min)'
      },
      {
        id: 'impact-2',
        stageName: 'ARRIVAL VIOLATION',
        segmentType: 'CONNECTION',
        title: 'Late Arrival at Pune Junction',
        status: '4:50 PM Arrival',
        severity: 'CRITICAL',
        description: 'Passenger reaches Pune station platform with only 10 minutes until scheduled bus departure across the city.',
        originalTime: 'Buffer: 3h 30m',
        projectedTime: 'Available: -10m Buffer'
      },
      {
        id: 'impact-3',
        stageName: 'CONNECTION RISK',
        segmentType: 'CONNECTION',
        title: 'Pune Swargate Connection Violated',
        status: 'Connection Broken',
        severity: 'CRITICAL',
        description: 'Minimum required transfer time from Pune Jn to Swargate Terminal is 30 mins. Reaching Swargate before 5:00 PM is physically impossible.',
        originalTime: 'Required transfer: 30m',
        projectedTime: 'Deficit: -40m infeasible'
      },
      {
        id: 'impact-4',
        stageName: 'BUS MISSED',
        segmentType: 'BUS',
        title: 'Pune → Goa Volvo Bus Missed',
        status: 'Guaranteed Miss',
        severity: 'HIGH',
        description: 'Purple Travels PT-8842 leaves on time at 5:00 PM. Ticket is forfeited without immediate intervention.',
        originalTime: '5:00 PM → 11:00 PM',
        projectedTime: 'Missed departure'
      },
      {
        id: 'impact-5',
        stageName: 'HOTEL ARRIVAL',
        segmentType: 'HOTEL',
        title: 'Casa Ocean Retreat Check-in Delay',
        status: 'Late Check-in Risk',
        severity: 'MEDIUM',
        description: 'Original check-in scheduled for 11:00 PM. Unresolved disruption pushes arrival to next morning, risking reservation cancellation.',
        originalTime: 'Check-in: 11:00 PM',
        projectedTime: 'Arrival delay past 2:00 AM'
      },
      {
        id: 'impact-6',
        stageName: 'ACTIVITY AT RISK',
        segmentType: 'ACTIVITY',
        title: 'Grand Island Scuba Dive Excursion',
        status: 'Conditional Risk',
        severity: 'LOW',
        description: 'Departure from dock is 9:00 AM tomorrow. If traveler arrives after 4:00 AM exhausted, activity participation may be compromised.',
        originalTime: 'Tomorrow 9:00 AM',
        projectedTime: 'Recoverable with Option 1 or 3'
      }
    ];
  }

  /**
   * Delegates recovery plan generation to the modular RecoveryEngine.
   */
  public static getRecoveryPlans(preferences?: UserPreferences): RecoveryPlan[] {
    const trip = getScenarioTrip('SCENARIO_3_SEVERE_DELAY');
    const defaultPrefs: UserPreferences = preferences || {
      primaryPriority: 'PRESERVE_BOOKINGS',
      avoidFlights: false,
      avoidOvernight: false,
      avoidLongTransfers: true,
      preferDirect: false,
      maxAdditionalBudget: 2000
    };

    return RecoveryEngine.generatePlans({
      trip,
      affectedSegments: [trip.segments[1]],
      disruptions: [
        {
          id: 'disrupt-auto',
          segmentId: trip.segments[0].id,
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
      userPreferences: defaultPrefs,
      currentTime: '4:50 PM'
    });
  }
}
