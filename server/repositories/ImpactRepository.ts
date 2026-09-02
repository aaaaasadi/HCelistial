import { query } from '../config/db';
import { SegmentImpact, RiskLevel, TransportType } from '../../src/types';
import pg from 'pg';

export class ImpactRepository {
  public static async findByTripId(tripId: string, client?: pg.PoolClient): Promise<SegmentImpact[]> {
    const q = `
      SELECT 
        i.affected_segment_id, s.title as segment_title, s.segment_type,
        i.severity, i.reason, i.original_schedule, i.projected_outcome
      FROM impacts i
      JOIN trip_segments s ON s.id = i.affected_segment_id
      WHERE i.trip_id = $1
      ORDER BY s.sequence ASC;
    `;
    const res = client ? await client.query(q, [tripId]) : await query(q, [tripId]);

    return res.rows.map((r) => ({
      segmentId: r.affected_segment_id,
      segmentTitle: r.segment_title,
      segmentType: r.segment_type as TransportType,
      impactLevel: r.severity as RiskLevel,
      reason: r.reason,
      originalSchedule: r.original_schedule,
      projectedOutcome: r.projected_outcome
    }));
  }

  public static async saveImpacts(
    tripId: string,
    disruptionId: string | null,
    impacts: SegmentImpact[],
    client?: pg.PoolClient
  ): Promise<void> {
    for (const imp of impacts) {
      const id = `imp-${tripId}-${imp.segmentId}`;
      const q = `
        INSERT INTO impacts (
          id, trip_id, disruption_id, affected_segment_id, impact_type, severity, reason, original_schedule, projected_outcome
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          severity = EXCLUDED.severity,
          reason = EXCLUDED.reason,
          projected_outcome = EXCLUDED.projected_outcome,
          updated_at = CURRENT_TIMESTAMP;
      `;
      const params = [
        id,
        tripId,
        disruptionId,
        imp.segmentId,
        'CASCADE_DELAY',
        imp.impactLevel,
        imp.reason,
        imp.originalSchedule,
        imp.projectedOutcome
      ];
      if (client) {
        await client.query(q, params);
      } else {
        await query(q, params);
      }
    }
  }

  public static async clearByTripId(tripId: string, client?: pg.PoolClient): Promise<void> {
    const q = 'DELETE FROM impacts WHERE trip_id = $1;';
    if (client) {
      await client.query(q, [tripId]);
    } else {
      await query(q, [tripId]);
    }
  }
}
