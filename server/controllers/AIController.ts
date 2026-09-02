import { Request, Response } from 'express';
import { AIServiceBackend } from '../services/AIServiceBackend';

export class AIController {
  public static async askAI(req: Request, res: Response): Promise<void> {
    try {
      const { tripId, question } = req.body;
      if (!tripId || !question) {
        res.status(400).json({ error: 'Missing tripId or question' });
        return;
      }
      const response = await AIServiceBackend.askAI(tripId, question);
      res.json(response);
    } catch (err: any) {
      console.error('[AIController.askAI error]:', err.message);
      res.status(500).json({ error: err.message });
    }
  }
}
