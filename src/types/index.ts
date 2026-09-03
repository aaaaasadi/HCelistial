export type TransportType = 'TRAIN' | 'BUS' | 'FLIGHT' | 'HOTEL' | 'ACTIVITY';

export type TransportStatus = 
  | 'ON_TIME' 
  | 'DELAYED' 
  | 'CANCELLED' 
  | 'BOARDING' 
  | 'DEPARTED' 
  | 'ARRIVED' 
  | 'AT_RISK' 
  | 'MISSED' 
  | 'CONFIRMED' 
  | 'RECOVERED';

export type JourneyStatus = 
  | 'ON_TRACK' 
  | 'AT_RISK' 
  | 'DISRUPTED' 
  | 'RECOVERING' 
  | 'RECOVERED';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ConnectionStatus = 'SAFE' | 'TIGHT' | 'AT_RISK' | 'MISSED' | 'RECOVERED';

export interface BaseSegment {
  id: string;
  type: TransportType;
  provider?: string;
  dataSource: string; // e.g. 'TRAIN API • DEMO DATA'
  notes?: string;
  bookingStatus?: 'CONFIRMED' | 'AT_RISK' | 'CANCELLED' | 'RECOVERED';
}

export interface TransportSegment extends BaseSegment {
  type: 'TRAIN' | 'BUS' | 'FLIGHT';
  serviceNumber: string;
  origin?: string;
  destination?: string;
  from?: string;
  to?: string;
  scheduledDeparture?: string;
  scheduledArrival?: string;
  departureTime: string; // Estimated or actual
  estimatedArrival: string; // Estimated or actual
  status: TransportStatus;
  delayMinutes: number;
  bufferMinutes?: number;
  risk?: RiskLevel;
  platformOrTerminal?: string;
  seatOrClass?: string;
  isDisrupted?: boolean;
  isReplacement?: boolean;
}

export interface HotelSegment extends BaseSegment {
  type: 'HOTEL';
  name: string;
  location: string;
  checkInTime: string;
  status: 'CONFIRMED' | 'LATE_CHECKIN_ALERT' | 'PRESERVED';
  bookingRef: string;
  roomType: string;
}

export interface ActivitySegment extends BaseSegment {
  type: 'ACTIVITY';
  name: string;
  location: string;
  startTime: string;
  status: 'CONFIRMED' | 'AT_RISK' | 'PRESERVED';
  bookingRef: string;
}

export type TripSegment = TransportSegment | HotelSegment | ActivitySegment;

export interface Trip {
  id: string;
  title: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: JourneyStatus;
  segments: TripSegment[];
}

export interface Booking {
  id: string;
  segmentId: string | null;
  bookingReference: string;
  provider: string;
  bookingType: string;
  status: string;
  price: number;
  currency: string;
}

export interface ConnectionInfo {
  id: string;
  fromSegmentId: string;
  toSegmentId: string;
  transferStation: string;
  fromCity: string;
  toCity: string;
  arrivingFrom: string;
  nextDeparture: string;
  arrivalTime: string;
  departureTime: string;
  availableBufferMinutes: number;
  requiredTransferMinutes: number;
  status: ConnectionStatus;
  riskLevel: RiskLevel;
  explanation: string;
}

export interface SegmentImpact {
  segmentId: string;
  segmentTitle: string;
  segmentType: TransportType;
  impactLevel: RiskLevel;
  reason: string;
  originalSchedule: string;
  projectedOutcome: string;
}

export interface DisruptionEvent {
  id: string;
  segmentId: string;
  title: string;
  delayFormatted: string;
  delayMinutes: number;
  reason: string;
  affectedNextLeg: string;
  timestamp: string;
  severity: 'HIGH' | 'CRITICAL';
}

export interface ImpactCascadeStep {
  id: string;
  stageName: string;
  segmentType: TransportType | 'CONNECTION' | 'HOTEL' | 'ACTIVITY';
  title: string;
  status: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  originalTime: string;
  projectedTime: string;
}

export interface RecoveryScoreBreakdown {
  arrivalTime: number;
  cost: number;
  itineraryPreservation: number;
  transfers: number;
  preferences: number;
}

export type RecoveryPlanType = 'GROUND' | 'AIR' | 'MULTIMODAL';

export type RecoveryStatus = 
  | 'NO_RECOVERY_REQUIRED' 
  | 'RECOVERY_REQUIRED' 
  | 'ANALYZING' 
  | 'OPTIONS_AVAILABLE' 
  | 'PLAN_SELECTED' 
  | 'RECOVERED';

export interface RecoveryPlan {
  id: string;
  type: RecoveryPlanType;
  tag?: 'RECOMMENDED' | 'CHEAPEST' | 'FASTEST';
  title: string;
  subtitle: string;
  transportTypes: TransportType[];
  segments: TransportSegment[];
  newDeparture: string;
  newArrival: string;
  totalTravelTime: string;
  totalCost: number;
  additionalCost: number;
  transfersCount: number;
  itineraryPreservation: number; // 0 - 100
  recoveryScore: number; // 0 - 100
  scoreBreakdown: RecoveryScoreBreakdown;
  feasibility: {
    feasible: boolean;
    reasons: string[];
  };
  tradeoffs: {
    advantages: string[];
    disadvantages: string[];
  };
  affectedBookings: {
    hotel: 'PRESERVED' | 'LATE_ARRIVAL' | 'AT_RISK';
    activity: 'PRESERVED' | 'RESCHEDULE_NEEDED';
  };
  hotelStatus: 'PRESERVED' | 'LATE_ARRIVAL' | 'AT_RISK';
  activityStatus: 'PRESERVED' | 'RESCHEDULE_NEEDED';
  cost: number;
  routeSummary: string[];
  explanation: string;
  whyThisPlan: {
    pros: string[];
    cons: string[];
  };
  details: {
    leg1: string;
    leg2?: string;
    operator: string;
    availability: string;
  };
}

// Backward-compatible alias
export type RecoveryOption = RecoveryPlan;

export interface RecoveryContext {
  trip: Trip;
  affectedSegments: TripSegment[];
  disruptions: DisruptionEvent[];
  connections: ConnectionInfo[];
  transportOptions: TransportSegment[];
  userPreferences: UserPreferences;
  currentTime: string;
}

export interface RecoveryScoringConfig {
  arrivalWeight: number;
  costWeight: number;
  preservationWeight: number;
  transferWeight: number;
  preferenceWeight: number;
}

export interface RecoveryRecommendationContext {
  journey: Trip;
  disruption?: DisruptionEvent;
  impacts: SegmentImpact[];
  recoveryPlans: RecoveryPlan[];
  userPreferences: UserPreferences;
  recommendedPlan: RecoveryPlan | null;
}

export interface UserPreferences {
  primaryPriority: 'LOWEST_COST' | 'FASTEST_ARRIVAL' | 'FEWER_TRANSFERS' | 'PRESERVE_BOOKINGS';
  avoidFlights: boolean;
  avoidOvernight: boolean;
  avoidLongTransfers: boolean;
  preferDirect: boolean;
  maxAdditionalBudget: number;
}

export interface NotificationItem {
  id: string;
  type: 'INFO' | 'WARNING' | 'DISRUPTION' | 'RECOVERY';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  targetTab: NavigationTab;
  relatedSegmentId?: string;
}

export type DemoScenarioId = 
  | 'SCENARIO_1_NORMAL'
  | 'SCENARIO_2_TRAIN_DELAY'
  | 'SCENARIO_3_SEVERE_DELAY'
  | 'SCENARIO_4_BUS_CANCELLED'
  | 'SCENARIO_5_MISSED_CONNECTION'
  | 'SCENARIO_6_RECOVERED';

export type DemoState = 
  | 'STATE_1_NORMAL'
  | 'STATE_2_DISRUPTION'
  | 'STATE_3_IMPACT'
  | 'STATE_4_RECOVERY_OPTIONS'
  | 'STATE_5_PLAN_SELECTED'
  | 'STATE_6_RECOVERED';

export type NavigationTab = 
  | 'dashboard'
  | 'destinations'
  | 'journey'
  | 'monitor'
  | 'recovery'
  | 'ai'
  | 'preferences'
  | 'notifications'
  | 'components';


// ==========================================
// PHASE 5: AI TRAVEL GUIDE & INTELLIGENT LAYER
// ==========================================

export type VerifiedFactType =
  | 'TRAIN_DELAY'
  | 'TRAIN_STATUS'
  | 'BUS_STATUS'
  | 'FLIGHT_STATUS'
  | 'DEPARTURE_TIME'
  | 'ARRIVAL_TIME'
  | 'DELAY'
  | 'CONNECTION_BUFFER'
  | 'CONNECTION_STATUS'
  | 'COST'
  | 'RECOVERY_SCORE'
  | 'HOTEL_STATUS'
  | 'ACTIVITY_STATUS';

export interface VerifiedTravelFact {
  type: VerifiedFactType;
  value: string | number | boolean;
  unit?: string;
  source: string;
  verified: boolean;
}

export interface AITravelContext {
  traveler: {
    name: string;
    id: string;
    loyaltyTier?: string;
  };
  tripTitle: string;
  trip: Trip;
  currentSegment?: TripSegment;
  segments: TripSegment[];
  transportStatuses: {
    segmentId: string;
    status: TransportStatus;
    delayMinutes: number;
    estimatedArrival: string;
  }[];
  connections: ConnectionInfo[];
  disruptions: DisruptionEvent[];
  impacts: SegmentImpact[];
  recoveryPlans: RecoveryPlan[];
  recommendedPlan: RecoveryPlan | null;
  userPreferences: UserPreferences;
  journeyHealth: number;
  journeyStatus: JourneyStatus;
  activeDisruption?: string;
  verifiedFacts: VerifiedTravelFact[];
}

export type AIActionType =
  | 'VIEW_JOURNEY'
  | 'VIEW_IMPACT'
  | 'VIEW_RECOVERY'
  | 'COMPARE_PLANS'
  | 'SELECT_PLAN'
  | 'UPDATE_PREFERENCE'
  | 'ASK_WHY';

export interface AIAction {
  type: AIActionType;
  label: string;
  planId?: string;
  segmentId?: string;
  preferenceUpdate?: Partial<UserPreferences>;
  actionTab?: NavigationTab;
  prompt?: string;
}

export interface AIResponse {
  id: string;
  message: string;
  structuredBreakdown?: {
    answer: string;
    why: string;
    options?: string;
    recommendation?: string;
    tradeoffs?: string;
  };
  referencedPlanId?: string;
  referencedSegmentId?: string;
  actions: AIAction[];
  facts: VerifiedTravelFact[];
  confidence: number;
  dataSource: 'DEMO_ENGINE' | 'VERIFIED_FACTS';
}

export interface AIConversationState {
  messages: ChatMessageData[];
  currentContext?: AITravelContext;
  activeTripId: string;
  selectedPlanId?: string;
  temporaryPreferences?: Partial<UserPreferences>;
}

export interface ChatMessageData {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  structuredBreakdown?: {
    answer: string;
    why: string;
    options?: string;
    recommendation?: string;
    tradeoffs?: string;
  };
  actions?: AIAction[];
  facts?: VerifiedTravelFact[];
  confidence?: number;
  dataSource?: 'DEMO_ENGINE' | 'VERIFIED_FACTS';
  referencedPlanId?: string;
  referencedSegmentId?: string;
  suggestedAction?: {
    label: string;
    actionTab: string;
  };
}

export interface IAIService {
  generateResponse(
    context: AITravelContext,
    question: string,
    state?: AIConversationState
  ): Promise<AIResponse>;
  generateRecommendation(context: AITravelContext): Promise<AIResponse>;
  explainRecoveryPlan(context: AITravelContext, plan: RecoveryPlan): Promise<AIResponse>;
  compareRecoveryPlans(context: AITravelContext, plans: RecoveryPlan[]): Promise<AIResponse>;
  summarizeDisruption(context: AITravelContext): Promise<AIResponse>;
}

export interface TravelerUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  bookingRef: string;
  avatarInitials: string;
  avatarColor?: string;
}

