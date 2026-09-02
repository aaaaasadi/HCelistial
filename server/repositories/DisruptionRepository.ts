import { query } from '../config/db';
import { DisruptionEvent } from '../../src/types';
import pg from 'pg';

export class DisruptionRepository {
  public static async findByTripId(tripId: string, client?: pg.PoolClient): Promise<DisruptionEvent[]> {
    const q = `
      SELECT id, segment_id, title, severity, delay_minutes, delay_formatted, reason, description, affected_next_leg, detected_at
      FROM disruptions
      WHERE trip_id = $1
      ORDER BY created_at ASC;
    `;
    const res = client ? await client.query(q, [tripId]) : await query(q, [tripId]);

    return res.rows.map((r) => ({
      id: r.id,
      segmentId: r.segment_id,
      title: r.title,
      delayFormatted: r.delay_formatted || `+${r.delay_minutes} min`,
      delayMinutes: r.delay_minutes,
      reason: r.reason,
      affectedNextLeg: r.affected_next_leg || '',
      timestamp: r.detected_at || 'Just now',
      severity: r.severity as 'HIGH' | 'CRITICAL'
    }));
  }

  public static async saveDisruptions(
    tripId: string,
    disruptions: DisruptionEvent[],
    client?: pg.PoolClient
  ): Promise<void> {
    for (const d of disruptions) {
      const q = `
        INSERT INTO disruptions (
          id, trip_id, segment_id, type, severity, delay_minutes, delay_formatted, reason, description, affected_next_leg, detected_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO UPDATE SET
          severity = EXCLUDED.severity,
          delay_minutes = EXCLUDED.delay_minutes,
          delay_formatted = EXCLUDED.delay_formatted,
          reason = EXCLUDED.reason,
          affected_next_leg = EXCLUDED.affected_next_leg,
          updated_at = CURRENT_TIMESTAMP;
      `;
      const params = [
        d.id,
        tripId,
        d.segmentId,
        'DELAY',
        d.severity,
        d.delayMinutes,
        d.delayFormatted,
        d.reason,
        d.reason,
        d.affectedNextLeg,
        d.timestamp
      ];
      if (client) {
        await client.query(q, params);
      } else {
        await query(q, params);
      }
    }
  }

  public static async clearByTripId(tripId: string, client?: pg.PoolClient): Promise<void> {
    const q = 'DELETE FROM disruptions WHERE trip_id = $1;';
    if (client) {
      await client.query(q, [tripId]);
    } else {
      await query(q, [tripId]);
    }
  }
}
