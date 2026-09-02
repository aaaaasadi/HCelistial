import { query } from '../config/db';
import { NotificationItem } from '../../src/types';
import pg from 'pg';

export class NotificationRepository {
  public static async findByUserId(userId: string, limit = 20, client?: pg.PoolClient): Promise<NotificationItem[]> {
    const q = `
      SELECT id, type, title, message, severity, read, created_at
      FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2;
    `;
    const res = client ? await client.query(q, [userId, limit]) : await query(q, [userId, limit]);

    return res.rows.map((r) => {
      const d = new Date(r.created_at);
      const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return {
        id: r.id,
        type: r.type,
        title: r.title,
        message: r.message,
        timestamp: timeStr,
        severity: r.severity,
        read: r.read
      };
    });
  }

  public static async createNotification(
    item: {
      userId: string;
      tripId: string;
      type: 'DISRUPTION' | 'RECOVERY' | 'BUFFER_ALERT' | 'INFO';
      title: string;
      message: string;
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'INFO';
    },
    client?: pg.PoolClient
  ): Promise<NotificationItem> {
    const id = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const q = `
      INSERT INTO notifications (id, user_id, trip_id, type, title, message, severity, read)
      VALUES ($1, $2, $3, $4, $5, $6, $7, false)
      RETURNING id, type, title, message, severity, read, created_at;
    `;
    const params = [id, item.userId, item.tripId, item.type, item.title, item.message, item.severity];
    const res = client ? await client.query(q, params) : await query(q, params);
    const r = res.rows[0];

    return {
      id: r.id,
      type: r.type,
      title: r.title,
      message: r.message,
      timestamp: 'Just now',
      severity: r.severity,
      read: false
    };
  }

  public static async markRead(id: string, client?: pg.PoolClient): Promise<void> {
    const q = 'UPDATE notifications SET read = true WHERE id = $1;';
    if (client) {
      await client.query(q, [id]);
    } else {
      await query(q, [id]);
    }
  }
}
