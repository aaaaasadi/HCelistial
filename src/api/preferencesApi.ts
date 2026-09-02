import { apiFetch } from './client';
import { UserPreferences } from '../types';

export const preferencesApi = {
  async getPreferences(userId: string): Promise<UserPreferences> {
    return apiFetch<UserPreferences>(`/users/${userId}/preferences`);
  },

  async updatePreferences(userId: string, prefs: Partial<UserPreferences>): Promise<UserPreferences> {
    return apiFetch<UserPreferences>(`/users/${userId}/preferences`, {
      method: 'PUT',
      body: JSON.stringify(prefs)
    });
  }
};
