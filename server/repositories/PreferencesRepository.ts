import { query } from '../config/db';
import { UserPreferences, RecoveryPriority } from '../../src/types';
import pg from 'pg';

export class PreferencesRepository {
  public static async findByUserId(userId: string, client?: pg.PoolClient): Promise<UserPreferences | null> {
    const q = `
      SELECT 
        preferred_strategy, maximum_extra_budget, avoid_flights,
        avoid_overnight, avoid_long_transfers, prefer_direct
      FROM user_preferences
      WHERE user_id = $1;
    `;
    const res = client ? await client.query(q, [userId]) : await query(q, [userId]);
    if (res.rows.length === 0) return null;

    const r = res.rows[0];
    return {
      primaryPriority: r.preferred_strategy as RecoveryPriority,
      maxAdditionalBudget: r.maximum_extra_budget,
      avoidFlights: r.avoid_flights,
      avoidOvernight: r.avoid_overnight,
      avoidLongTransfers: r.avoid_long_transfers,
      preferDirect: r.prefer_direct
    };
  }

  public static async updateByUserId(
    userId: string,
    prefs: Partial<UserPreferences>,
    client?: pg.PoolClient
  ): Promise<UserPreferences> {
    // Check if exists
    const current = await this.findByUserId(userId, client) || {
      primaryPriority: 'PRESERVE_BOOKINGS',
      maxAdditionalBudget: 2000,
      avoidFlights: false,
      avoidOvernight: false,
      avoidLongTransfers: true,
      preferDirect: false
    };

    const merged: UserPreferences = {
      primaryPriority: prefs.primaryPriority || current.primaryPriority,
      maxAdditionalBudget: prefs.maxAdditionalBudget !== undefined ? prefs.maxAdditionalBudget : current.maxAdditionalBudget,
      avoidFlights: prefs.avoidFlights !== undefined ? prefs.avoidFlights : current.avoidFlights,
      avoidOvernight: prefs.avoidOvernight !== undefined ? prefs.avoidOvernight : current.avoidOvernight,
      avoidLongTransfers: prefs.avoidLongTransfers !== undefined ? prefs.avoidLongTransfers : current.avoidLongTransfers,
      preferDirect: prefs.preferDirect !== undefined ? prefs.preferDirect : current.preferDirect
    };

    const q = `
      INSERT INTO user_preferences (
        id, user_id, preferred_strategy, maximum_extra_budget,
        avoid_flights, avoid_overnight, avoid_long_transfers, prefer_direct, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) DO UPDATE SET
        preferred_strategy = EXCLUDED.preferred_strategy,
        maximum_extra_budget = EXCLUDED.maximum_extra_budget,
        avoid_flights = EXCLUDED.avoid_flights,
        avoid_overnight = EXCLUDED.avoid_overnight,
        avoid_long_transfers = EXCLUDED.avoid_long_transfers,
        prefer_direct = EXCLUDED.prefer_direct,
        updated_at = CURRENT_TIMESTAMP;
    `;
    const params = [
      `pref-${userId}`,
      userId,
      merged.primaryPriority,
      merged.maxAdditionalBudget,
      merged.avoidFlights,
      merged.avoidOvernight,
      merged.avoidLongTransfers,
      merged.preferDirect
    ];

    if (client) {
      await client.query(q, params);
    } else {
      await query(q, params);
    }

    return merged;
  }
}
