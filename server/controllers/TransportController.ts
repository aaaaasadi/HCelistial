import { Request, Response } from 'express';
import { TransportService } from '../services/transport/TransportService';
import { TransportType } from '../services/transport/interfaces/ITransportProvider';

export class TransportController {
  public static async searchTrains(req: Request, res: Response): Promise<void> {
    try {
      const origin = (req.query.origin || req.query.from || 'Mumbai CSMT') as string;
      const destination = (req.query.destination || req.query.to || 'Pune Junction') as string;
      const date = req.query.date as string | undefined;
      const query = (req.query.query || req.query.q || req.query.trainNumber || req.query.serviceNumber) as string | undefined;

      const results = await TransportService.searchTrains({ origin, destination, date, query });
      res.json({
        success: true,
        count: results.length,
        data: results
      });
    } catch (err: any) {
      console.error('[TransportController] searchTrains error:', err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async searchBuses(req: Request, res: Response): Promise<void> {
    try {
      const origin = (req.query.origin || req.query.from || 'Pune Swargate') as string;
      const destination = (req.query.destination || req.query.to || 'Panaji (Goa)') as string;
      const date = req.query.date as string | undefined;
      const query = (req.query.query || req.query.q || req.query.operator || req.query.serviceNumber) as string | undefined;

      const results = await TransportService.searchBuses({ origin, destination, date, query });
      res.json({
        success: true,
        count: results.length,
        data: results
      });
    } catch (err: any) {
      console.error('[TransportController] searchBuses error:', err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async searchFlights(req: Request, res: Response): Promise<void> {
    try {
      const origin = (req.query.origin || req.query.from || 'BOM') as string;
      const destination = (req.query.destination || req.query.to || 'GOI') as string;
      const date = req.query.date as string | undefined;
      const query = (req.query.query || req.query.q || req.query.flightNumber || req.query.airline) as string | undefined;

      const results = await TransportService.searchFlights({ origin, destination, date, query });
      res.json({
        success: true,
        count: results.length,
        data: results
      });
    } catch (err: any) {
      console.error('[TransportController] searchFlights error:', err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async getLiveStatus(req: Request, res: Response): Promise<void> {
    try {
      const type = (req.params.type || 'TRAIN').toUpperCase() as TransportType;
      const serviceNumber = req.params.serviceNumber;
      const date = req.query.date as string | undefined;

      const status = await TransportService.getLiveStatus(type, serviceNumber, date);
      res.json({
        success: true,
        data: status
      });
    } catch (err: any) {
      console.error('[TransportController] getLiveStatus error:', err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async syncTripTelemetry(req: Request, res: Response): Promise<void> {
    try {
      const tripId = req.params.tripId;
      const bundle = await TransportService.syncTripTelemetry(tripId);
      res.json({
        success: true,
        message: 'Trip telemetry synchronized with live providers',
        data: bundle
      });
    } catch (err: any) {
      console.error('[TransportController] syncTripTelemetry error:', err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
