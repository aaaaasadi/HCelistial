import {
  Trip,
  TransportSegment,
  ConnectionInfo,
  Booking,
  DisruptionEvent,
  SegmentImpact,
  RecoveryPlan,
  UserPreferences,
  NotificationItem,
  JourneyStatus,
  AITravelContext,
  AIResponse,
  AIAction
} from '../../src/types';

export interface JourneyBundleDTO {
  trip: Trip;
  segments: TransportSegment[];
  connections: ConnectionInfo[];
  bookings: Booking[];
  disruptions: DisruptionEvent[];
  impacts: SegmentImpact[];
  recoveryPlans: RecoveryPlan[];
  recommendedPlan: RecoveryPlan | null;
  selectedPlanId?: string | null;
  userPreferences: UserPreferences;
  journeyHealth: number;
  journeyStatus: JourneyStatus;
  notifications: NotificationItem[];
  dataSource: 'POSTGRESQL';
}

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  loyaltyTier: string;
}

export interface SimulateDisruptionRequest {
  scenarioId: 'SCENARIO_1_NORMAL' | 'SCENARIO_2_MINOR_DELAY' | 'SCENARIO_3_SEVERE_DELAY' | 'SCENARIO_4_MISSED_BUS' | 'SCENARIO_5_FLIGHT_CONTINGENCY';
}

export interface SelectPlanRequest {
  planId: string;
}

export interface AskAIRequest {
  tripId: string;
  question: string;
}
