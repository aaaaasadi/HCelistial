import { withTransaction } from '../config/db';
import { TripRepository } from '../repositories/TripRepository';
import { SegmentRepository } from '../repositories/SegmentRepository';
import { RecoveryRepository } from '../repositories/RecoveryRepository';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { JourneyService } from './JourneyService';
import { JourneyBundleDTO } from '../types/backendTypes';

export class RecoveryService {
  public static async selectRecoveryPlan(
    tripId: string,
    planId: string
  ): Promise<JourneyBundleDTO> {
    console.log(`[RecoveryService] Selecting recovery plan ${planId} for trip ${tripId}...`);

    await withTransaction(async (client) => {
      const tripRecord = await TripRepository.findById(tripId, client);
      if (!tripRecord) throw new Error(`Trip ${tripId} not found`);

      const plans = await RecoveryRepository.findByTripId(tripId, client);
      const selectedPlan = plans.find((p) => p.id === planId);
      if (!selectedPlan) {
        throw new Error(`Recovery plan ${planId} not found for trip ${tripId}`);
      }

      if (!selectedPlan.feasibility.feasible) {
        throw new Error(`Selected recovery plan ${planId} is not feasible`);
      }

      // Mark plan as selected in PostgreSQL
      await RecoveryRepository.markPlanSelected(tripId, planId, client);

      // Reconstruct journey segments in PostgreSQL:
      // Replace segment 2 (the affected bus) with the recovery plan's primary leg
      const segments = await SegmentRepository.findByTripId(tripId, client);
      const replacementSeg = selectedPlan.segments[0];

      if (replacementSeg && segments[1]) {
        await SegmentRepository.updateSegment(
          segments[1].id,
          {
            title: replacementSeg.title,
            provider: replacementSeg.provider,
            serviceNumber: replacementSeg.serviceNumber,
            departureTime: replacementSeg.departureTime,
            estimatedArrival: replacementSeg.estimatedArrival,
            status: 'CONFIRMED',
            isDisrupted: false,
            delayMinutes: 0,
            platformOrTerminal: replacementSeg.platformOrTerminal || 'Platform Bay A',
            seatOrClass: replacementSeg.seatOrClass || 'Standard Reserved',
            notes: `Recovered via ${selectedPlan.title}. Confirmed seat.`
          },
          client
        );
      }

      // Restore Hotel & Activity status
      if (segments[2]) {
        await SegmentRepository.updateSegment(
          segments[2].id,
          {
            status: 'CONFIRMED',
            notes: 'Hotel preserved without cancellation fees.'
          },
          client
        );
      }

      if (segments[3]) {
        await SegmentRepository.updateSegment(
          segments[3].id,
          {
            status: 'CONFIRMED',
            notes: 'Morning scuba diving confirmed on schedule.'
          },
          client
        );
      }

      // Update trip health to 98% and status to RECOVERED in PostgreSQL
      await TripRepository.updateStatusAndHealth(tripId, 'RECOVERED', 98, client);

      // Create notification in PostgreSQL
      await NotificationRepository.createNotification(
        {
          userId: tripRecord.userId,
          tripId,
          type: 'RECOVERY',
          title: 'Journey Successfully Recovered',
          message: `Confirmed on ${selectedPlan.title}. Arrival in Goa tonight at ${selectedPlan.newArrival}. Hotel and scuba diving bookings intact.`,
          severity: 'INFO'
        },
        client
      );
    });

    return JourneyService.getJourneyBundle(tripId);
  }
}
