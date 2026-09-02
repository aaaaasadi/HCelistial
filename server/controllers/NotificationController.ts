import { Request, Response } from 'express';
import { NotificationRepository } from '../repositories/NotificationRepository';

export class NotificationController {
  public static async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const notifs = await NotificationRepository.findByUserId(userId);
      res.json(notifs);
    } catch (err: any) {
      console.error('[NotificationController.getNotifications error]:', err.message);
      res.status(500).json({ error: err.message });
    }
  }

  public static async markRead(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await NotificationRepository.markRead(id);
      res.json({ success: true, id });
    } catch (err: any) {
      console.error('[NotificationController.markRead error]:', err.message);
      res.status(500).json({ error: err.message });
    }
  }
}
