import { Request, Response } from 'express';
import { checkConnection } from '../config/db';

export class HealthController {
  public static async getHealth(_req: Request, res: Response): Promise<void> {
    const dbStatus = await checkConnection();
    res.json({
      status: 'ok',
      service: 'TravelRescue Backend API',
      database: dbStatus.connected ? 'connected' : 'disconnected',
      databaseType: 'PostgreSQL 18',
      environment: process.env.NODE_ENV || 'development'
    });
  }
}
