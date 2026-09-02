import { query } from '../config/db';
import { UserDTO } from '../types/backendTypes';

export class UserRepository {
  public static async findById(id: string): Promise<UserDTO | null> {
    const res = await query(
      'SELECT id, name, email, loyalty_tier FROM users WHERE id = $1;',
      [id]
    );
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      loyaltyTier: row.loyalty_tier
    };
  }
}
