import { withTransaction } from '../config/db';
import { TripRepository } from '../repositories/TripRepository';
import { SegmentRepository } from '../repositories/SegmentRepository';
import { DisruptionRepository } from '../repositories/DisruptionRepository';
import { ImpactRepository } from '../repositories/ImpactRepository';
import { RecoveryRepository } from '../repositories/RecoveryRepository';
import { PreferencesRepository } from '../repositories/PreferencesRepository';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { JourneyService } from './JourneyService';
import { JourneyBundleDTO } from '../types/backendTypes';
import { calculateConnection } from '../../src/utils/connectionEngine';
import { detectImpacts } from '../../src/utils/journeyCalculations';
import { RecoveryEngine } from '../../src/services/recovery/RecoveryEngine';
import { MOCK_AVAILABLE_TRANSPORT_OPTIONS } from '../../src/services/recovery/transportOptionsData';
import { TransportService } from './transport/TransportService';
import { DisruptionEvent, SegmentImpact, JourneyStatus } from '../../src/types';

export class DisruptionService {
  public static async simulateDisruption(
    tripId: string,
    scenarioId: string
  ): Promise<JourneyBundleDTO> {
    console.log(`[DisruptionService] Simulating ${scenarioId} for trip ${tripId}...`);

    await withTransaction(async (client) => {
      const tripRecord = await TripRepository.findById(tripId, client);
      if (!tripRecord) throw new Error(`Trip ${tripId} not found`);

      const segments = await SegmentRepository.findByTripId(tripId, client);
      const userPreferences = (await PreferencesRepository.findByUserId(tripRecord.userId, client)) || {
        primaryPriority: 'PRESERVE_BOOKINGS',
        maxAdditionalBudget: 2000,
        avoidFlights: false,
        avoidOvernight: false,
        avoidLongTransfers: true,
        preferDirect: false
      };

      // Handle SCENARIO_1_NORMAL
      if (scenarioId === 'SCENARIO_1_NORMAL') {
        // Reset all segments to normal
        for (const s of segments) {
          await SegmentRepository.updateSegment(
            s.id,
            {
              status: s.type === 'HOTEL' || s.type === 'ACTIVITY' ? 'CONFIRMED' : 'ON_TIME',
              isDisrupted: false,
              delayMinutes: 0,
              departureTime: s.scheduledDeparture,
              estimatedArrival: s.scheduledArrival
            },
            client
          );
        }
        await DisruptionRepository.clearByTripId(tripId, client);
        await ImpactRepository.clearByTripId(tripId, client);
        await RecoveryRepository.clearByTripId(tripId, client);
        await TripRepository.updateStatusAndHealth(tripId, 'ON_TRACK', 95, client);
        return;
      }

      // Prepare scenario parameters
      let delayMinutes = 200; // 3h 20m default (severe delay)
      let trainStatus = 'DELAYED';
      let busStatus = 'MISSED';
      let trainExpArr = '4:50 PM';
      let tripStatus: JourneyStatus = 'DISRUPTED';
      let health = 48;
      let reason = 'Locomotive failure near Karjat Ghats section';
      let severity: 'HIGH' | 'CRITICAL' = 'CRITICAL';

      if (scenarioId === 'SCENARIO_2_MINOR_DELAY') {
        delayMinutes = 45;
        trainStatus = 'DELAYED';
        busStatus = 'ON_TIME';
        trainExpArr = '2:15 PM';
        tripStatus = 'AT_RISK';
        health = 74;
        reason = 'Track maintenance speed restriction near Lonavala';
        severity = 'HIGH';
      } else if (scenarioId === 'SCENARIO_4_MISSED_BUS') {
        delayMinutes = 180;
        trainStatus = 'DELAYED';
        busStatus = 'CANCELLED';
        trainExpArr = '4:30 PM';
        tripStatus = 'DISRUPTED';
        health = 35;
        reason = 'Signal failure; missed connector bus departed Swargate';
        severity = 'CRITICAL';
      }

      // Update feeder train segment (seq 1)
      const trainSeg = segments.find((s) => s.type === 'TRAIN') || segments[0];
      await SegmentRepository.updateSegment(
        trainSeg.id,
        {
          status: trainStatus as any,
          isDisrupted: true,
          delayMinutes,
          estimatedArrival: trainExpArr,
          notes: reason
        },
        client
      );

      // Update bus segment (seq 2)
      const busSeg = segments.find((s) => s.type === 'BUS') || segments[1];
      await SegmentRepository.updateSegment(
        busSeg.id,
        {
          status: busStatus as any,
          isDisrupted: busStatus === 'MISSED' || busStatus === 'CANCELLED',
          notes: busStatus === 'MISSED' ? 'Bus departed before train reached Pune.' : 'Service impacted.'
        },
        client
      );

      // Record transport status observation
      await SegmentRepository.recordTransportStatus(
        trainSeg.id,
        trainStatus,
        delayMinutes,
        trainSeg.scheduledDeparture,
        trainExpArr,
        reason,
        client
      );

      // Calculate connections
      const conn = calculateConnection(
        { ...trainSeg, estimatedArrival: trainExpArr, delayMinutes },
        { ...busSeg, status: busStatus as any },
        { transferStation: 'Pune Swargate Bus Terminal' }
      );

      // Detect impacts across entire trip
      const updatedSegs = await SegmentRepository.findByTripId(tripId, client);
      const impacts = detectImpacts(updatedSegs, [conn]);

      // Create disruption record
      const disruption: DisruptionEvent = {
        id: `disrupt-${Date.now()}`,
        segmentId: trainSeg.id,
        title: `Train 12127 Delayed +${Math.floor(delayMinutes / 60)}h ${delayMinutes % 60}m`,
        delayFormatted: `+${delayMinutes} min`,
        delayMinutes,
        reason,
        affectedNextLeg: 'Pune → Goa Bus (Shivneri)',
        timestamp: 'Just now',
        severity
      };

      await DisruptionRepository.saveDisruptions(tripId, [disruption], client);
      await ImpactRepository.saveImpacts(tripId, disruption.id, impacts, client);

      // Generate recovery plans if disrupted
      if (tripStatus === 'DISRUPTED') {
        let liveAlternatives = await TransportService.searchAllAlternatives('Pune', 'Goa');
        if (!liveAlternatives || liveAlternatives.length === 0) {
          liveAlternatives = MOCK_AVAILABLE_TRANSPORT_OPTIONS;
        }

        const recoveryPlans = RecoveryEngine.generatePlans({
          trip: {
            id: tripRecord.id,
            title: tripRecord.title,
            origin: tripRecord.origin,
            destination: tripRecord.destination,
            startDate: tripRecord.startTime,
            segments: updatedSegs,
            health,
            status: tripStatus
          },
          affectedSegments: [busSeg],
          disruptions: [disruption],
          connections: [conn],
          transportOptions: liveAlternatives,
          userPreferences,
          currentTime: '4:50 PM'
        });

        await RecoveryRepository.savePlans(tripId, recoveryPlans, client);

        // Disruption notification
        await NotificationRepository.createNotification(
          {
            userId: tripRecord.userId,
            tripId,
            type: 'DISRUPTION',
            title: `CRITICAL ALERT: Train 12127 Delayed +${delayMinutes}m`,
            message: `Connection in Pune broken. ${recoveryPlans.length} verified recovery options ready in Recovery Center.`,
            severity: 'CRITICAL'
          },
          client
        );
      }

      // Update trip status and health in PostgreSQL
      await TripRepository.updateStatusAndHealth(tripId, tripStatus, health, client);
    });

    return JourneyService.getJourneyBundle(tripId);
  }
}
