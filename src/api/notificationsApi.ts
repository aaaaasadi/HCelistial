import { apiFetch } from './client';
import { NotificationItem } from '../types';

export const notificationsApi = {
  async getNotifications(userId: string): Promise<NotificationItem[]> {
    return apiFetch<NotificationItem[]>(`/users/${userId}/notifications`);
  },

  async markRead(id: string): Promise<void> {
    await apiFetch(`/notifications/${id}/read`, {
      method: 'PUT'
    });
  }
};
