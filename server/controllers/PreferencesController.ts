import { Request, Response } from 'express';
import { PreferencesRepository } from '../repositories/PreferencesRepository';

export class PreferencesController {
  public static async getPreferences(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const prefs = await PreferencesRepository.findByUserId(userId);
      if (!prefs) {
        res.status(404).json({ error: `Preferences for user ${userId} not found` });
        return;
      }
      res.json(prefs);
    } catch (err: any) {
      console.error('[PreferencesController.getPreferences error]:', err.message);
      res.status(500).json({ error: err.message });
    }
  }

  public static async updatePreferences(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const updates = req.body;
      const updated = await PreferencesRepository.updateByUserId(userId, updates);
      res.json(updated);
    } catch (err: any) {
      console.error('[PreferencesController.updatePreferences error]:', err.message);
      res.status(500).json({ error: err.message });
    }
  }
}
