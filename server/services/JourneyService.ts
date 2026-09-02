import { TripRepository } from '../repositories/TripRepository';
import { SegmentRepository } from '../repositories/SegmentRepository';
import { DisruptionRepository } from '../repositories/DisruptionRepository';
import { ImpactRepository } from '../repositories/ImpactRepository';
import { RecoveryRepository } from '../repositories/RecoveryRepository';
import { PreferencesRepository } from '../repositories/PreferencesRepository';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { calculateConnection } from '../../src/utils/connectionEngine';
import { JourneyBundleDTO } from '../types/backendTypes';
import { Trip, ConnectionInfo, Booking } from '../../src/types';
import { seedDatabase } from '../database/seed/seed';
import { query } from '../config/db';

export class JourneyService {
  public static async getJourneyBundle(tripId: string): Promise<JourneyBundleDTO> {
    const tripRecord = await TripRepository.findById(tripId);
    if (!tripRecord) {
      throw new Error(`Trip ${tripId} not found`);
    }

    const segments = await SegmentRepository.findByTripId(tripId);
    const disruptions = await DisruptionRepository.findByTripId(tripId);
    const impacts = await ImpactRepository.findByTripId(tripId);
    const recoveryPlans = await RecoveryRepository.findByTripId(tripId);
    const userPreferences = (await PreferencesRepository.findByUserId(tripRecord.userId)) || {
      primaryPriority: 'PRESERVE_BOOKINGS',
      maxAdditionalBudget: 2000,
      avoidFlights: false,
      avoidOvernight: false,
      avoidLongTransfers: true,
      preferDirect: false
    };
    const notifications = await NotificationRepository.findByUserId(tripRecord.userId);

    // Calculate connections between consecutive transport segments
    const transportSegs = segments.filter((s) => s.type === 'TRAIN' || s.type === 'BUS' || s.type === 'FLIGHT');
    const connections: ConnectionInfo[] = [];

    if (transportSegs.length >= 2) {
      const conn = calculateConnection(transportSegs[0] as any, transportSegs[1] as any, {
        transferStation: 'Pune Swargate Bus Terminal'
      });
      // If trip is recovered, ensure connection reflects it
      if (tripRecord.status === 'RECOVERED') {
        conn.status = 'RECOVERED';
        conn.riskLevel = 'SAFE';
        conn.explanation = 'Connection recovered via selected alternative plan. Safe buffer verified.';
      }
      connections.push(conn);
    }

    // Fetch Bookings
    const resBookings = await query('SELECT * FROM bookings WHERE trip_id = $1;', [tripId]);
    const bookings: Booking[] = resBookings.rows.map((b) => ({
      id: b.id,
      segmentId: b.segment_id,
      bookingReference: b.booking_reference,
      provider: b.provider,
      bookingType: b.booking_type,
      status: b.status,
      price: Number(b.price),
      currency: b.currency
    }));

    const trip: Trip = {
      id: tripRecord.id,
      title: tripRecord.title,
      origin: tripRecord.origin,
      destination: tripRecord.destination,
      startDate: tripRecord.startTime,
      segments,
      currentSegmentIndex: 0,
      health: tripRecord.journeyHealth,
      status: tripRecord.status
    };

    const recommendedPlan = recoveryPlans.find((p) => p.tag === 'RECOMMENDED') || recoveryPlans[0] || null;

    // Check selected plan
    const resSelected = await query('SELECT id FROM recovery_plans WHERE trip_id = $1 AND is_selected = TRUE LIMIT 1;', [tripId]);
    const selectedPlanId = resSelected.rows.length > 0 ? resSelected.rows[0].id : null;

    return {
      trip,
      segments,
      connections,
      bookings,
      disruptions,
      impacts,
      recoveryPlans,
      recommendedPlan,
      selectedPlanId,
      userPreferences,
      journeyHealth: tripRecord.journeyHealth,
      journeyStatus: tripRecord.status,
      notifications,
      dataSource: 'POSTGRESQL'
    };
  }

  public static async resetJourney(tripId: string): Promise<JourneyBundleDTO> {
    console.log(`[JourneyService] Resetting trip ${tripId} in PostgreSQL...`);
    await seedDatabase();
    return this.getJourneyBundle(tripId);
  }
}
