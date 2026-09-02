import { query } from '../config/db';
import pg from 'pg';

export class AIConversationRepository {
  public static async getOrCreateConversation(
    userId: string,
    tripId: string,
    client?: pg.PoolClient
  ): Promise<string> {
    const qFind = 'SELECT id FROM ai_conversations WHERE user_id = $1 AND trip_id = $2 LIMIT 1;';
    const resFind = client ? await client.query(qFind, [userId, tripId]) : await query(qFind, [userId, tripId]);
    if (resFind.rows.length > 0) {
      return resFind.rows[0].id;
    }

    const newId = `conv-${Date.now()}`;
    const qInsert = 'INSERT INTO ai_conversations (id, user_id, trip_id) VALUES ($1, $2, $3);';
    if (client) {
      await client.query(qInsert, [newId, userId, tripId]);
    } else {
      await query(qInsert, [newId, userId, tripId]);
    }
    return newId;
  }

  public static async addMessage(
    conversationId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    action?: any,
    client?: pg.PoolClient
  ): Promise<void> {
    const msgId = `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const q = `
      INSERT INTO ai_messages (id, conversation_id, role, content, action)
      VALUES ($1, $2, $3, $4, $5);
    `;
    const params = [msgId, conversationId, role, content, action ? JSON.stringify(action) : null];
    if (client) {
      await client.query(q, params);
    } else {
      await query(q, params);
    }
  }

  public static async getRecentMessages(conversationId: string, limit = 20, client?: pg.PoolClient): Promise<any[]> {
    const q = `
      SELECT id, role, content, action, created_at
      FROM ai_messages
      WHERE conversation_id = $1
      ORDER BY created_at ASC
      LIMIT $2;
    `;
    const res = client ? await client.query(q, [conversationId, limit]) : await query(q, [conversationId, limit]);
    return res.rows;
  }
}
