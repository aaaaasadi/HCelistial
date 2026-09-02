import { Request, Response } from 'express';
import { JourneyService } from '../services/JourneyService';
import { DisruptionService } from '../services/DisruptionService';
import { RecoveryService } from '../services/RecoveryService';

export class TripController {
  public static async getTrip(req: Request, res: Response): Promise<void> {
    try {
      const { tripId } = req.params;
      const bundle = await JourneyService.getJourneyBundle(tripId);
      res.json(bundle);
    } catch (err: any) {
      console.error('[TripController.getTrip error]:', err.message);
      res.status(err.message.includes('not found') ? 404 : 500).json({
        error: err.message
      });
    }
  }

  public static async simulateDisruption(req: Request, res: Response): Promise<void> {
    try {
      const { tripId } = req.params;
      const { scenarioId } = req.body;
      if (!scenarioId) {
        res.status(400).json({ error: 'Missing scenarioId' });
        return;
      }
      const bundle = await DisruptionService.simulateDisruption(tripId, scenarioId);
      res.json(bundle);
    } catch (err: any) {
      console.error('[TripController.simulateDisruption error]:', err.message);
      res.status(500).json({ error: err.message });
    }
  }

  public static async selectRecoveryPlan(req: Request, res: Response): Promise<void> {
    try {
      const { tripId, planId } = req.params;
      if (!planId) {
        res.status(400).json({ error: 'Missing planId' });
        return;
      }
      const bundle = await RecoveryService.selectRecoveryPlan(tripId, planId);
      res.json(bundle);
    } catch (err: any) {
      console.error('[TripController.selectRecoveryPlan error]:', err.message);
      res.status(err.message.includes('not found') ? 404 : 400).json({ error: err.message });
    }
  }

  public static async resetTrip(req: Request, res: Response): Promise<void> {
    try {
      const { tripId } = req.params;
      const bundle = await JourneyService.resetJourney(tripId);
      res.json(bundle);
    } catch (err: any) {
      console.error('[TripController.resetTrip error]:', err.message);
      res.status(500).json({ error: err.message });
    }
  }
}
