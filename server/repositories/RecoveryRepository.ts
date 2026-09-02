import { query } from '../config/db';
import { RecoveryPlan, TransportSegment } from '../../src/types';
import pg from 'pg';

export class RecoveryRepository {
  public static async findByTripId(tripId: string, client?: pg.PoolClient): Promise<RecoveryPlan[]> {
    const qPlans = `
      SELECT 
        id, plan_type, tag, title, subtitle, new_departure, new_arrival,
        total_travel_time, total_cost, additional_cost, transfers_count,
        itinerary_preservation, score, score_breakdown, feasibility,
        tradeoffs, affected_bookings, hotel_status, activity_status,
        is_recommended, is_selected
      FROM recovery_plans
      WHERE trip_id = $1
      ORDER BY score DESC;
    `;
    const resPlans = client ? await client.query(qPlans, [tripId]) : await query(qPlans, [tripId]);

    const plans: RecoveryPlan[] = [];

    for (const r of resPlans.rows) {
      // Fetch associated recovery options (segments)
      const qOpts = `
        SELECT 
          id, segment_sequence, transport_type, provider, service_number,
          origin, destination, departure_time, arrival_time, price, available, metadata
        FROM recovery_options
        WHERE recovery_plan_id = $1
        ORDER BY segment_sequence ASC;
      `;
      const resOpts = client ? await client.query(qOpts, [r.id]) : await query(qOpts, [r.id]);

      const segments: TransportSegment[] = resOpts.rows.map((opt) => ({
        id: opt.id,
        sequence: opt.segment_sequence,
        type: opt.transport_type,
        title: `${opt.provider} (${opt.service_number})`,
        origin: opt.origin,
        destination: opt.destination,
        scheduledDeparture: opt.departure_time,
        scheduledArrival: opt.arrival_time,
        departureTime: opt.departure_time,
        estimatedArrival: opt.arrival_time,
        status: 'CONFIRMED',
        provider: opt.provider,
        serviceNumber: opt.service_number,
        bookingId: `BK-REC-${opt.service_number}`,
        bookingStatus: 'CONFIRMED',
        dataSource: 'RECOVERY ENGINE • DEMO DATA',
        platformOrTerminal: opt.metadata?.platformOrTerminal || 'Standard Gate',
        seatOrClass: opt.metadata?.seatOrClass || 'Standard Class',
        delayMinutes: 0,
        isDisrupted: false,
        notes: `Selected recovery option: ₹${opt.price}`
      })) as TransportSegment[];

      plans.push({
        id: r.id,
        type: r.plan_type,
        tag: r.tag || undefined,
        title: r.title,
        subtitle: r.subtitle || '',
        transportTypes: segments.map((s) => s.type),
        segments,
        newDeparture: r.new_departure,
        newArrival: r.new_arrival,
        totalTravelTime: r.total_travel_time,
        totalCost: Number(r.total_cost),
        additionalCost: Number(r.additional_cost),
        transfersCount: r.transfers_count,
        itineraryPreservation: r.itinerary_preservation,
        recoveryScore: r.score,
        scoreBreakdown: r.score_breakdown || {
          arrivalTime: 25,
          cost: 25,
          itineraryPreservation: 25,
          transfers: 15,
          preferences: 10
        },
        feasibility: r.feasibility || { feasible: true, reasons: [] },
        tradeoffs: r.tradeoffs || { advantages: [], disadvantages: [] },
        affectedBookings: r.affected_bookings || { hotel: r.hotel_status, activity: r.activity_status },
        hotelStatus: r.hotel_status,
        activityStatus: r.activity_status,
        cost: Number(r.total_cost),
        routeSummary: segments.map((s) => `${s.origin} → ${s.destination} (${s.type})`)
      });
    }

    return plans;
  }

  public static async savePlans(
    tripId: string,
    plans: RecoveryPlan[],
    client?: pg.PoolClient
  ): Promise<void> {
    // Clear previous unselected plans for this trip
    await this.clearByTripId(tripId, client);

    for (const p of plans) {
      const qPlan = `
        INSERT INTO recovery_plans (
          id, trip_id, plan_type, tag, title, subtitle,
          new_departure, new_arrival, total_travel_time,
          total_cost, additional_cost, transfers_count,
          itinerary_preservation, score, score_breakdown,
          feasibility, tradeoffs, affected_bookings,
          hotel_status, activity_status, is_recommended, is_selected
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22);
      `;
      const planParams = [
        p.id,
        tripId,
        p.type,
        p.tag || null,
        p.title,
        p.subtitle,
        p.newDeparture,
        p.newArrival,
        p.totalTravelTime,
        p.totalCost,
        p.additionalCost,
        p.transfersCount,
        p.itineraryPreservation,
        p.recoveryScore,
        JSON.stringify(p.scoreBreakdown),
        JSON.stringify(p.feasibility),
        JSON.stringify(p.tradeoffs),
        JSON.stringify(p.affectedBookings),
        p.hotelStatus,
        p.activityStatus,
        p.tag === 'RECOMMENDED',
        false
      ];

      if (client) {
        await client.query(qPlan, planParams);
      } else {
        await query(qPlan, planParams);
      }

      // Insert recovery options
      for (let i = 0; i < p.segments.length; i++) {
        const seg = p.segments[i];
        const qOpt = `
          INSERT INTO recovery_options (
            id, recovery_plan_id, segment_sequence, transport_type,
            provider, service_number, origin, destination,
            departure_time, arrival_time, price, available, metadata
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
        `;
        const optParams = [
          `opt-${p.id}-${i + 1}`,
          p.id,
          i + 1,
          seg.type,
          seg.provider,
          seg.serviceNumber,
          seg.origin,
          seg.destination,
          seg.departureTime,
          seg.estimatedArrival,
          p.totalCost / (p.segments.length || 1),
          true,
          JSON.stringify({
            platformOrTerminal: seg.platformOrTerminal,
            seatOrClass: seg.seatOrClass
          })
        ];

        if (client) {
          await client.query(qOpt, optParams);
        } else {
          await query(qOpt, optParams);
        }
      }
    }
  }

  public static async markPlanSelected(
    tripId: string,
    planId: string,
    client?: pg.PoolClient
  ): Promise<void> {
    const qReset = 'UPDATE recovery_plans SET is_selected = FALSE WHERE trip_id = $1;';
    const qSelect = 'UPDATE recovery_plans SET is_selected = TRUE WHERE id = $1 AND trip_id = $2;';

    if (client) {
      await client.query(qReset, [tripId]);
      await client.query(qSelect, [planId, tripId]);
    } else {
      await query(qReset, [tripId]);
      await query(qSelect, [planId, tripId]);
    }
  }

  public static async clearByTripId(tripId: string, client?: pg.PoolClient): Promise<void> {
    const q = 'DELETE FROM recovery_plans WHERE trip_id = $1;';
    if (client) {
      await client.query(q, [tripId]);
    } else {
      await query(q, [tripId]);
    }
  }
}
