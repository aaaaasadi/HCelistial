import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import {
  Trip,
  TripSegment,
  TransportSegment,
  HotelSegment,
  ActivitySegment,
  ConnectionInfo,
  SegmentImpact,
  ImpactCascadeStep,
  RecoveryPlan,
  RecoveryOption,
  RecoveryContext,
  RecoveryStatus,
  RecoveryRecommendationContext,
  UserPreferences,
  NotificationItem,
  RiskLevel,
  JourneyStatus,
  NavigationTab,
  DemoScenarioId,
  AITravelContext,
  AIAction,
  TravelerUser
} from '../types';

export const PRESET_USERS: TravelerUser[] = [
  {
    id: 'user-arjun',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@enterprise.com',
    role: 'Frequent Business Traveler',
    bookingRef: 'BKG-78291',
    avatarInitials: 'AM',
    avatarColor: 'bg-amber-100 text-amber-900 border-amber-300'
  },
  {
    id: 'user-priya',
    name: 'Priya Sharma',
    email: 'priya.sharma@techglobal.io',
    role: 'Executive Conference Delegate',
    bookingRef: 'BKG-44912',
    avatarInitials: 'PS',
    avatarColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
  },
  {
    id: 'user-marcus',
    name: 'Marcus Vance',
    email: 'marcus.v@adventures.org',
    role: 'International Explorer',
    bookingRef: 'BKG-90183',
    avatarInitials: 'MV',
    avatarColor: 'bg-blue-100 text-blue-900 border-blue-300'
  }
];
import { getScenarioTrip, BASE_HOTEL_SEGMENT, BASE_ACTIVITY_SEGMENT } from '../data/mockJourneyData';
import { calculateConnection } from '../utils/connectionEngine';
import {
  deriveJourneyStatus,
  calculateJourneyHealth,
  detectImpacts
} from '../utils/journeyCalculations';
import { generateNotificationForStateChange } from '../utils/notificationGenerator';
import { MockRecoveryEngine } from '../services/mockRecoveryEngine';
import { RecoveryEngine } from '../services/recovery/RecoveryEngine';
import { MOCK_AVAILABLE_TRANSPORT_OPTIONS } from '../services/recovery/transportOptionsData';
import { FactExtractor } from '../services/ai/FactExtractor';
import { tripsApi } from '../api/tripsApi';
import { preferencesApi } from '../api/preferencesApi';
import { transportApi } from '../api/transportApi';
import { checkBackendHealth } from '../api/client';

interface DetailModalData {
  title: string;
  subtitle?: string;
  type: string;
  data: Record<string, string | number | boolean | undefined>;
}

interface DemoContextType {
  // Navigation & Tab
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;

  // Single Source of Truth
  currentTrip: Trip;
  activeScenario: DemoScenarioId;
  connections: ConnectionInfo[];
  impacts: SegmentImpact[];
  impactCascade: ImpactCascadeStep[];
  journeyStatus: JourneyStatus;
  journeyHealth: number;
  connectionRisk: RiskLevel;
  activeAlertsCount: number;
  isDatabaseMode: boolean;

  // AI & Recovery Data
  aiContext: AITravelContext;
  recoveryRecommendationContext: RecoveryRecommendationContext;
  recoveryPlans: RecoveryPlan[];
  recommendedPlan: RecoveryPlan | null;
  selectedPlan: RecoveryPlan | null;
  confirmedPlan: RecoveryPlan | null;
  recoveryStatus: RecoveryStatus;
  userPreferences: UserPreferences;

  // Comparison Modal
  comparisonPlan: RecoveryPlan | null;
  isComparisonModalOpen: boolean;
  openComparisonModal: (plan: RecoveryPlan) => void;
  closeComparisonModal: () => void;

  // Actions
  applyScenario: (scenarioId: DemoScenarioId) => void;
  simulateDisruption: () => void;
  resetJourney: () => void;
  updateSegment: (segmentId: string, updates: Partial<TransportSegment>) => void;
  selectPlanForConfirmation: (plan: RecoveryPlan) => void;
  confirmRecovery: () => void;
  closeConfirmationModal: () => void;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => void;
  executeAIAction: (action: AIAction) => void;
  refreshTelemetry: () => Promise<void>;
  isRefreshingTelemetry: boolean;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // User Profile & Authentication
  currentUser: TravelerUser;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginUser: (user: TravelerUser) => void;
  logoutUser: () => void;

  // Journey Customization / Editing
  isEditJourneyModalOpen: boolean;
  openEditJourneyModal: () => void;
  closeEditJourneyModal: () => void;
  updateTripDetails: (title: string, origin: string, destination: string) => void;
  addTripSegment: (segment: TripSegment) => void;
  removeTripSegment: (segmentId: string) => void;
  editTripSegment: (segmentId: string, updates: Partial<TripSegment>) => void;

  // Detail Modal
  isConfirmModalOpen: boolean;
  detailModal: DetailModalData | null;
  openDetailModal: (data: DetailModalData) => void;
  closeDetailModal: () => void;
}

const defaultPreferences: UserPreferences = {
  primaryPriority: 'PRESERVE_BOOKINGS',
  avoidFlights: false,
  avoidOvernight: false,
  avoidLongTransfers: true,
  preferDirect: false,
  maxAdditionalBudget: 2000
};

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [activeScenario, setActiveScenario] = useState<DemoScenarioId>('SCENARIO_1_NORMAL');
  const [currentTrip, setCurrentTrip] = useState<Trip>(() => getScenarioTrip('SCENARIO_1_NORMAL'));
  const [currentUser, setCurrentUser] = useState<TravelerUser>(PRESET_USERS[0]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isEditJourneyModalOpen, setIsEditJourneyModalOpen] = useState<boolean>(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(defaultPreferences);
  const [selectedPlan, setSelectedPlan] = useState<RecoveryPlan | null>(null);
  const [confirmedPlan, setConfirmedPlan] = useState<RecoveryPlan | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [comparisonPlan, setComparisonPlan] = useState<RecoveryPlan | null>(null);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [detailModal, setDetailModal] = useState<DetailModalData | null>(null);
  const [isRefreshingTelemetry, setIsRefreshingTelemetry] = useState(false);
  const [isDatabaseMode, setIsDatabaseMode] = useState<boolean>(false);

  const loginUser = (user: TravelerUser) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    setNotifications((prev) => [
      {
        id: `notif-login-${Date.now()}`,
        type: 'INFO',
        title: `👤 Logged in as ${user.name}`,
        message: `Active booking ${user.bookingRef} loaded into Central Trip Store.`,
        timestamp: 'Just now',
        read: false,
        targetTab: 'dashboard'
      },
      ...prev
    ]);
  };

  const logoutUser = () => {
    setIsAuthModalOpen(true);
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const openEditJourneyModal = () => setIsEditJourneyModalOpen(true);
  const closeEditJourneyModal = () => setIsEditJourneyModalOpen(false);

  const updateTripDetails = (title: string, origin: string, destination: string) => {
    setCurrentTrip((prev) => ({
      ...prev,
      title: title.trim() || prev.title,
      origin: origin.trim() || prev.origin,
      destination: destination.trim() || prev.destination
    }));
  };

  const addTripSegment = (segment: TripSegment) => {
    setCurrentTrip((prev) => ({
      ...prev,
      segments: [...prev.segments, segment]
    }));
  };

  const removeTripSegment = (segmentId: string) => {
    setCurrentTrip((prev) => ({
      ...prev,
      segments: prev.segments.filter((s) => s.id !== segmentId)
    }));
  };

  const editTripSegment = (segmentId: string, updates: Partial<TripSegment>) => {
    setCurrentTrip((prev) => ({
      ...prev,
      segments: prev.segments.map((s) => (s.id === segmentId ? ({ ...s, ...updates } as TripSegment) : s))
    }));
  };

  // Connect to PostgreSQL backend on mount
  useEffect(() => {
    async function initFromBackend() {
      try {
        const health = await checkBackendHealth();
        if (health.connected && health.database === 'connected') {
          setIsDatabaseMode(true);
          const bundle = await tripsApi.getTrip('trip-mum-pune-goa');
          if (bundle && bundle.trip) {
            setCurrentTrip(bundle.trip);
            setUserPreferences(bundle.userPreferences);
            if (bundle.notifications && bundle.notifications.length > 0) {
              setNotifications(bundle.notifications);
            }
            if (bundle.selectedPlanId && bundle.recoveryPlans) {
              const p = bundle.recoveryPlans.find((plan) => plan.id === bundle.selectedPlanId);
              if (p) {
                setSelectedPlan(p);
                setConfirmedPlan(p);
              }
            }
            if (bundle.trip.status === 'RECOVERED') {
              setActiveScenario('SCENARIO_6_RECOVERED');
            } else if (bundle.trip.status === 'DISRUPTED') {
              setActiveScenario('SCENARIO_3_SEVERE_DELAY');
            } else if (bundle.trip.status === 'AT_RISK') {
              setActiveScenario('SCENARIO_2_TRAIN_DELAY');
            }
          }
        } else {
          setIsDatabaseMode(false);
        }
      } catch (err) {
        console.warn('[DemoContext] Backend not available, running in local fallback mode.');
        setIsDatabaseMode(false);
      }
    }
    initFromBackend();
  }, []);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-welcome',
      type: 'INFO',
      title: '🟢 Journey Initialized',
      message: 'Mumbai → Pune → Goa monitored. All transit legs operating on time.',
      timestamp: '10 mins ago',
      read: false,
      targetTab: 'dashboard'
    }
  ]);

  // Derived: calculate connections dynamically between consecutive transport segments
  const connections: ConnectionInfo[] = useMemo(() => {
    const transportSegments = currentTrip.segments.filter(
      (s): s is TransportSegment => s.type === 'TRAIN' || s.type === 'BUS' || s.type === 'FLIGHT'
    );

    const calculatedConns: ConnectionInfo[] = [];
    for (let i = 0; i < transportSegments.length - 1; i++) {
      const fromSeg = transportSegments[i];
      const toSeg = transportSegments[i + 1];
      const conn = calculateConnection(fromSeg, toSeg, {
        transferStation: `${fromSeg.destination || fromSeg.to} Intermodal Transit Hub`
      });
      calculatedConns.push(conn);
    }
    return calculatedConns;
  }, [currentTrip.segments]);

  // Derived: impacts
  const impacts: SegmentImpact[] = useMemo(() => {
    return detectImpacts(currentTrip.segments, connections);
  }, [currentTrip.segments, connections]);

  const impactCascade: ImpactCascadeStep[] = useMemo(() => {
    return MockRecoveryEngine.getImpactCascade();
  }, []);

  // Derived: journey status
  const journeyStatus: JourneyStatus = useMemo(() => {
    return deriveJourneyStatus(currentTrip.segments, connections);
  }, [currentTrip.segments, connections]);

  // Derived: journey health percentage
  const journeyHealth: number = useMemo(() => {
    return calculateJourneyHealth(currentTrip.segments, connections, impacts);
  }, [currentTrip.segments, connections, impacts]);

  // Derived: connection risk (primary connection)
  const connectionRisk: RiskLevel = useMemo(() => {
    if (connections.length === 0) return 'LOW';
    return connections[0].riskLevel;
  }, [connections]);

  const activeAlertsCount = useMemo(() => {
    return journeyStatus === 'DISRUPTED' ? 1 : journeyStatus === 'AT_RISK' ? 1 : 0;
  }, [journeyStatus]);

  // Derived: Recovery Context for the standalone Recovery Engine
  const recoveryContext: RecoveryContext = useMemo(() => {
    return {
      trip: currentTrip,
      affectedSegments: currentTrip.segments.filter(
        (s) =>
          s.type !== 'HOTEL' &&
          s.type !== 'ACTIVITY' &&
          ((s as TransportSegment).isDisrupted ||
            (s as TransportSegment).status === 'MISSED' ||
            (s as TransportSegment).status === 'CANCELLED')
      ),
      disruptions:
        journeyStatus === 'DISRUPTED'
          ? [
              {
                id: 'disrupt-active',
                segmentId: currentTrip.segments[0].id,
                title: 'Train 12127 Delayed +3h 20m',
                delayFormatted: '+200 min',
                delayMinutes: 200,
                reason: 'Locomotive traction failure near Lonavala',
                affectedNextLeg: 'Pune → Goa Bus',
                timestamp: '16:15 IST',
                severity: 'CRITICAL'
              }
            ]
          : [],
      connections,
      transportOptions: MOCK_AVAILABLE_TRANSPORT_OPTIONS,
      userPreferences,
      currentTime: '4:50 PM'
    };
  }, [currentTrip, journeyStatus, connections, userPreferences]);

  // Derived: Recovery Plans generated by the modular Recovery Engine
  const recoveryPlans: RecoveryPlan[] = useMemo(() => {
    return RecoveryEngine.generatePlans(recoveryContext);
  }, [recoveryContext]);

  const recommendedPlan: RecoveryPlan | null = useMemo(() => {
    return recoveryPlans.length > 0 ? recoveryPlans[0] : null;
  }, [recoveryPlans]);

  // Derived: Recovery Status
  const recoveryStatus: RecoveryStatus = useMemo(() => {
    if (journeyStatus === 'RECOVERED') return 'RECOVERED';
    if (selectedPlan && isConfirmModalOpen) return 'PLAN_SELECTED';
    if (journeyStatus === 'DISRUPTED') {
      return recoveryPlans.length > 0 ? 'OPTIONS_AVAILABLE' : 'RECOVERY_REQUIRED';
    }
    return 'NO_RECOVERY_REQUIRED';
  }, [journeyStatus, selectedPlan, isConfirmModalOpen, recoveryPlans.length]);

  // Derived: RecoveryRecommendationContext for AI Travel Guide
  const recoveryRecommendationContext: RecoveryRecommendationContext = useMemo(() => {
    return {
      journey: currentTrip,
      disruption: recoveryContext.disruptions[0],
      impacts,
      recoveryPlans,
      userPreferences,
      recommendedPlan
    };
  }, [currentTrip, recoveryContext.disruptions, impacts, recoveryPlans, userPreferences, recommendedPlan]);

  // Derived: AITravelContext with Verified Facts
  const aiContext: AITravelContext = useMemo(() => {
    const verifiedFacts = FactExtractor.extractFacts({
      trip: currentTrip,
      connections,
      disruptions: recoveryContext.disruptions,
      impacts,
      recoveryPlans
    });

    const transportStatuses = currentTrip.segments
      .filter((s): s is TransportSegment => s.type === 'TRAIN' || s.type === 'BUS' || s.type === 'FLIGHT')
      .map((tSeg) => ({
        segmentId: tSeg.id,
        status: tSeg.status,
        delayMinutes: tSeg.delayMinutes,
        estimatedArrival: tSeg.estimatedArrival
      }));

    return {
      traveler: {
        name: 'Arjun Mehta',
        id: 'TRV-88219',
        loyaltyTier: 'Gold Priority'
      },
      tripTitle: currentTrip.title,
      trip: currentTrip,
      currentSegment: currentTrip.segments[0],
      segments: currentTrip.segments,
      transportStatuses,
      connections,
      disruptions: recoveryContext.disruptions,
      impacts,
      recoveryPlans,
      recommendedPlan,
      userPreferences,
      journeyHealth,
      journeyStatus,
      activeDisruption:
        journeyStatus === 'DISRUPTED'
          ? 'Train 12127 delayed +3h 20m. Connection at Pune Swargate broken.'
          : undefined,
      verifiedFacts
    };
  }, [
    currentTrip,
    journeyStatus,
    journeyHealth,
    connections,
    recoveryContext.disruptions,
    impacts,
    recoveryPlans,
    recommendedPlan,
    userPreferences
  ]);

  // Event-driven notification generation on status changes
  const [prevStatus, setPrevStatus] = useState<JourneyStatus>(journeyStatus);
  useEffect(() => {
    if (prevStatus !== journeyStatus) {
      const transportSegs = currentTrip.segments.filter(
        (s): s is TransportSegment => s.type === 'TRAIN' || s.type === 'BUS' || s.type === 'FLIGHT'
      );
      const newNotif = generateNotificationForStateChange(
        prevStatus,
        journeyStatus,
        transportSegs,
        connections
      );
      if (newNotif) {
        setNotifications((prev) => [newNotif, ...prev]);
      }
      setPrevStatus(journeyStatus);
    }
  }, [journeyStatus, prevStatus, currentTrip.segments, connections]);

  // Actions
  const applyScenario = (scenarioId: DemoScenarioId) => {
    setActiveScenario(scenarioId);

    if (isDatabaseMode) {
      tripsApi
        .simulateDisruption('trip-mum-pune-goa', scenarioId)
        .then((bundle) => {
          if (bundle && bundle.trip) {
            setCurrentTrip(bundle.trip);
            setUserPreferences(bundle.userPreferences);
            if (bundle.notifications && bundle.notifications.length > 0) {
              setNotifications(bundle.notifications);
            }
          }
        })
        .catch((err) => {
          console.warn('[DemoContext] Backend simulation failed, falling back to local calculation:', err);
          const newTrip = getScenarioTrip(scenarioId);
          setCurrentTrip(newTrip);
        });
    } else {
      const newTrip = getScenarioTrip(scenarioId);
      setCurrentTrip(newTrip);
    }

    if (scenarioId === 'SCENARIO_6_RECOVERED') {
      if (recoveryPlans.length > 0) {
        setSelectedPlan(recoveryPlans[0]);
        setConfirmedPlan(recoveryPlans[0]);
      }
    } else if (scenarioId === 'SCENARIO_1_NORMAL') {
      setSelectedPlan(null);
      setConfirmedPlan(null);
    }
  };

  const simulateDisruption = () => {
    applyScenario('SCENARIO_3_SEVERE_DELAY');
  };

  const resetJourney = () => {
    setActiveScenario('SCENARIO_1_NORMAL');
    setSelectedPlan(null);
    setConfirmedPlan(null);

    if (isDatabaseMode) {
      tripsApi
        .resetTrip('trip-mum-pune-goa')
        .then((bundle) => {
          if (bundle && bundle.trip) {
            setCurrentTrip(bundle.trip);
            setUserPreferences(bundle.userPreferences);
            setNotifications(bundle.notifications);
          }
        })
        .catch((err) => {
          console.warn('[DemoContext] Backend reset failed, using local reset:', err);
          applyScenario('SCENARIO_1_NORMAL');
        });
    } else {
      applyScenario('SCENARIO_1_NORMAL');
    }

    setNotifications([
      {
        id: `notif-${Date.now()}`,
        type: 'INFO',
        title: '🟢 Journey Reset to On Track',
        message: 'Normal schedule restored. All connections monitored and operating within safe thresholds.',
        timestamp: 'Just now',
        read: false,
        targetTab: 'dashboard'
      }
    ]);
  };

  const updateSegment = (segmentId: string, updates: Partial<TransportSegment>) => {
    setCurrentTrip((prev) => ({
      ...prev,
      segments: prev.segments.map((seg) => {
        if (seg.id === segmentId) {
          return { ...seg, ...updates } as TripSegment;
        }
        return seg;
      })
    }));
  };

  const selectPlanForConfirmation = (plan: RecoveryPlan) => {
    setSelectedPlan(plan);
    setIsConfirmModalOpen(true);
  };

  /**
   * Complete Recovery Reconstruction Loop
   * Replaces affected segments with the selected recovery plan, preserves unaffected hotel/activity bookings,
   * recalculates connections, updates health to 98%, and transitions status to RECOVERED.
   */
  const confirmRecovery = () => {
    const planToUse = selectedPlan || recommendedPlan;
    if (planToUse) {
      setConfirmedPlan(planToUse);

      // Reconstruct journey segments
      const preservedHotel: HotelSegment = {
        ...BASE_HOTEL_SEGMENT,
        status: planToUse.hotelStatus === 'PRESERVED' ? 'PRESERVED' : 'LATE_CHECKIN_ALERT'
      };

      const preservedActivity: ActivitySegment = {
        ...BASE_ACTIVITY_SEGMENT,
        status: planToUse.activityStatus === 'PRESERVED' ? 'PRESERVED' : 'AT_RISK'
      };

      // Mark the recovery segments with recovered status
      const recoveryTransportSegments: TransportSegment[] = planToUse.segments.map((seg, idx) => ({
        ...seg,
        status: 'RECOVERED',
        bookingStatus: 'CONFIRMED',
        isReplacement: idx > 0,
        notes: `✓ Confirmed under TravelRescue Guarantee (${planToUse.title})`
      }));

      const newTrip: Trip = {
        ...currentTrip,
        status: 'RECOVERED',
        segments: [...recoveryTransportSegments, preservedHotel, preservedActivity]
      };

      setCurrentTrip(newTrip);
      setActiveScenario('SCENARIO_6_RECOVERED');

      if (isDatabaseMode) {
        tripsApi
          .selectRecoveryPlan('trip-mum-pune-goa', planToUse.id)
          .then((bundle) => {
            if (bundle && bundle.trip) {
              setCurrentTrip(bundle.trip);
              if (bundle.notifications && bundle.notifications.length > 0) {
                setNotifications(bundle.notifications);
              }
            }
          })
          .catch((err) => {
            console.warn('[DemoContext] Backend plan selection failed:', err);
          });
      }

      // Dispatch event notification
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          type: 'RECOVERY',
          title: '✓ Recovery Plan Confirmed',
          message: `Your journey has been reconstructed around "${planToUse.title}". Hotel and activity bookings secured.`,
          timestamp: 'Just now',
          read: false,
          targetTab: 'journey'
        },
        ...prev
      ]);
    }

    setIsConfirmModalOpen(false);
    setCurrentTab('journey');
  };

  const closeConfirmationModal = () => {
    setIsConfirmModalOpen(false);
  };

  const openComparisonModal = (plan: RecoveryPlan) => {
    setComparisonPlan(plan);
    setIsComparisonModalOpen(true);
  };

  const closeComparisonModal = () => {
    setIsComparisonModalOpen(false);
  };

  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    setUserPreferences((prev) => {
      const merged = { ...prev, ...newPrefs };
      if (isDatabaseMode) {
        preferencesApi.updatePreferences('TRV-88219', newPrefs).catch((err) => {
          console.warn('[DemoContext] Failed to persist preferences to backend:', err);
        });
      }
      return merged;
    });
  };

  const executeAIAction = (action: AIAction) => {
    if (action.actionTab) {
      setCurrentTab(action.actionTab);
    }

    if (action.type === 'SELECT_PLAN' && action.planId) {
      const plan = recoveryPlans.find((p) => p.id === action.planId);
      if (plan) {
        selectPlanForConfirmation(plan);
      }
    } else if (action.type === 'COMPARE_PLANS') {
      const plan = (action.planId && recoveryPlans.find((p) => p.id === action.planId)) || recommendedPlan || recoveryPlans[0];
      if (plan) {
        openComparisonModal(plan);
      }
    } else if (action.type === 'UPDATE_PREFERENCE' && action.preferenceUpdate) {
      updatePreferences(action.preferenceUpdate);
      setNotifications((prev) => [
        {
          id: `notif-ai-pref-${Date.now()}`,
          type: 'INFO',
          title: '🤖 Preference Updated by AI Guide',
          message: 'Recovery plans have been dynamically re-ranked according to your new preference.',
          timestamp: 'Just now',
          read: false,
          targetTab: 'recovery'
        },
        ...prev
      ]);
    } else if (action.type === 'VIEW_JOURNEY') {
      setCurrentTab('journey');
    } else if (action.type === 'VIEW_RECOVERY') {
      setCurrentTab('recovery');
    }
  };

  const refreshTelemetry = async () => {
    setIsRefreshingTelemetry(true);
    try {
      if (isDatabaseMode) {
        const syncRes = await transportApi.syncTripTelemetry('trip-mum-pune-goa');
        const bundle = syncRes.data || (await tripsApi.getTrip('trip-mum-pune-goa'));
        if (bundle && bundle.trip) {
          setCurrentTrip(bundle.trip);
          setUserPreferences(bundle.userPreferences);
          if (bundle.notifications && bundle.notifications.length > 0) {
            setNotifications(bundle.notifications);
          }
          if (bundle.trip.status === 'RECOVERED') {
            setActiveScenario('SCENARIO_6_RECOVERED');
          } else if (bundle.trip.status === 'DISRUPTED') {
            setActiveScenario('SCENARIO_3_SEVERE_DELAY');
          } else if (bundle.trip.status === 'AT_RISK') {
            setActiveScenario('SCENARIO_2_TRAIN_DELAY');
          }
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 800));
    } finally {
      setIsRefreshingTelemetry(false);
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const openDetailModal = (data: DetailModalData) => {
    setDetailModal(data);
  };

  const closeDetailModal = () => {
    setDetailModal(null);
  };

  return (
    <DemoContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        currentTrip,
        activeScenario,
        connections,
        impacts,
        impactCascade,
        journeyStatus,
        journeyHealth,
        connectionRisk,
        activeAlertsCount,
        isDatabaseMode,
        aiContext,
        recoveryRecommendationContext,
        recoveryPlans,
        recommendedPlan,
        selectedPlan,
        confirmedPlan,
        recoveryStatus,
        userPreferences,
        comparisonPlan,
        isComparisonModalOpen,
        openComparisonModal,
        closeComparisonModal,
        applyScenario,
        simulateDisruption,
        resetJourney,
        updateSegment,
        selectPlanForConfirmation,
        confirmRecovery,
        closeConfirmationModal,
        updatePreferences,
        executeAIAction,
        refreshTelemetry,
        isRefreshingTelemetry,
        notifications,
        unreadNotificationsCount: notifications.filter((n) => !n.read).length,
        markNotificationRead,
        markAllNotificationsRead,
        currentUser,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        loginUser,
        logoutUser,
        isEditJourneyModalOpen,
        openEditJourneyModal,
        closeEditJourneyModal,
        updateTripDetails,
        addTripSegment,
        removeTripSegment,
        editTripSegment,
        isConfirmModalOpen,
        detailModal,
        openDetailModal,
        closeDetailModal
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
