import { query } from '../config/db';
import { TransportSegment } from '../../src/types';
import pg from 'pg';

export class SegmentRepository {
  public static async findByTripId(tripId: string, client?: pg.PoolClient): Promise<TransportSegment[]> {
    const q = `
      SELECT 
        id, sequence, segment_type, title, origin, destination,
        scheduled_departure, scheduled_arrival, expected_departure, expected_arrival,
        status, provider, service_number, booking_id, platform_or_terminal,
        seat_or_class, is_disrupted, delay_minutes, notes, metadata
      FROM trip_segments
      WHERE trip_id = $1
      ORDER BY sequence ASC;
    `;
    const res = client ? await client.query(q, [tripId]) : await query(q, [tripId]);

    return res.rows.map((row) => ({
      id: row.id,
      sequence: row.sequence,
      type: row.segment_type,
      title: row.title,
      origin: row.origin,
      destination: row.destination,
      scheduledDeparture: row.scheduled_departure,
      scheduledArrival: row.scheduled_arrival,
      departureTime: row.expected_departure,
      estimatedArrival: row.expected_arrival,
      status: row.status,
      provider: row.provider,
      serviceNumber: row.service_number,
      bookingId: row.booking_id,
      bookingStatus: 'CONFIRMED',
      dataSource: 'DATABASE • POSTGRESQL 18',
      platformOrTerminal: row.platform_or_terminal,
      seatOrClass: row.seat_or_class,
      isDisrupted: row.is_disrupted,
      delayMinutes: row.delay_minutes || 0,
      notes: row.notes,
      ...(row.metadata || {})
    })) as TransportSegment[];
  }

  public static async updateSegment(
    id: string,
    updates: Partial<TransportSegment>,
    client?: pg.PoolClient
  ): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (updates.status !== undefined) {
      fields.push(`status = $${idx++}`);
      values.push(updates.status);
    }
    if (updates.departureTime !== undefined) {
      fields.push(`expected_departure = $${idx++}`);
      values.push(updates.departureTime);
    }
    if (updates.estimatedArrival !== undefined) {
      fields.push(`expected_arrival = $${idx++}`);
      values.push(updates.estimatedArrival);
    }
    if (updates.delayMinutes !== undefined) {
      fields.push(`delay_minutes = $${idx++}`);
      values.push(updates.delayMinutes);
    }
    if (updates.isDisrupted !== undefined) {
      fields.push(`is_disrupted = $${idx++}`);
      values.push(updates.isDisrupted);
    }
    if (updates.title !== undefined) {
      fields.push(`title = $${idx++}`);
      values.push(updates.title);
    }
    if (updates.provider !== undefined) {
      fields.push(`provider = $${idx++}`);
      values.push(updates.provider);
    }
    if (updates.serviceNumber !== undefined) {
      fields.push(`service_number = $${idx++}`);
      values.push(updates.serviceNumber);
    }
    if (updates.platformOrTerminal !== undefined) {
      fields.push(`platform_or_terminal = $${idx++}`);
      values.push(updates.platformOrTerminal);
    }
    if (updates.seatOrClass !== undefined) {
      fields.push(`seat_or_class = $${idx++}`);
      values.push(updates.seatOrClass);
    }
    if (updates.notes !== undefined) {
      fields.push(`notes = $${idx++}`);
      values.push(updates.notes);
    }

    if (fields.length === 0) return;

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);
    const sql = `UPDATE trip_segments SET ${fields.join(', ')} WHERE id = $${idx};`;

    if (client) {
      await client.query(sql, values);
    } else {
      await query(sql, values);
    }
  }

  public static async recordTransportStatus(
    segmentId: string,
    status: string,
    delayMinutes: number,
    expDep: string,
    expArr: string,
    reason?: string,
    client?: pg.PoolClient,
    source?: string
  ): Promise<void> {
    const id = `ts-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const q = `
      INSERT INTO transport_status (
        id, segment_id, status, delay_minutes, expected_departure, expected_arrival, reason, source
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
    `;
    const params = [id, segmentId, status, delayMinutes, expDep, expArr, reason || null, source || 'DEMO_DISRUPTION_ENGINE'];
    if (client) {
      await client.query(q, params);
    } else {
      await query(q, params);
    }
  }
}
