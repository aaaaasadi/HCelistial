import { query } from '../config/db';
import { Trip, JourneyStatus } from '../../src/types';
import pg from 'pg';

export class TripRepository {
  public static async findById(id: string, client?: pg.PoolClient): Promise<{
    id: string;
    userId: string;
    title: string;
    origin: string;
    destination: string;
    startTime: string;
    endTime: string;
    status: JourneyStatus;
    journeyHealth: number;
  } | null> {
    const q = 'SELECT id, user_id, title, origin, destination, start_time, end_time, status, journey_health FROM trips WHERE id = $1;';
    const res = client ? await client.query(q, [id]) : await query(q, [id]);
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      origin: row.origin,
      destination: row.destination,
      startTime: row.start_time,
      endTime: row.end_time,
      status: row.status as JourneyStatus,
      journeyHealth: row.journey_health
    };
  }

  public static async findByUserId(userId: string): Promise<any[]> {
    const res = await query(
      'SELECT id, user_id, title, origin, destination, start_time, end_time, status, journey_health FROM trips WHERE user_id = $1 ORDER BY created_at DESC;',
      [userId]
    );
    return res.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      origin: row.origin,
      destination: row.destination,
      startTime: row.start_time,
      endTime: row.end_time,
      status: row.status as JourneyStatus,
      journeyHealth: row.journey_health
    }));
  }

  public static async updateStatusAndHealth(
    id: string,
    status: JourneyStatus,
    health: number,
    client?: pg.PoolClient
  ): Promise<void> {
    const q = 'UPDATE trips SET status = $1, journey_health = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3;';
    if (client) {
      await client.query(q, [status, health, id]);
    } else {
      await query(q, [status, health, id]);
    }
  }
}
