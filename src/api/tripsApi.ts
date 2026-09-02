import { apiFetch } from './client';
import { JourneyBundleDTO } from '../../server/types/backendTypes';

export const tripsApi = {
  async getTrip(tripId: string): Promise<JourneyBundleDTO> {
    return apiFetch<JourneyBundleDTO>(`/trips/${tripId}`);
  },

  async simulateDisruption(tripId: string, scenarioId: string): Promise<JourneyBundleDTO> {
    return apiFetch<JourneyBundleDTO>(`/trips/${tripId}/demo/disruptions`, {
      method: 'POST',
      body: JSON.stringify({ scenarioId })
    });
  },

  async selectRecoveryPlan(tripId: string, planId: string): Promise<JourneyBundleDTO> {
    return apiFetch<JourneyBundleDTO>(`/trips/${tripId}/recovery-plans/${planId}/select`, {
      method: 'POST'
    });
  },

  async resetTrip(tripId: string): Promise<JourneyBundleDTO> {
    return apiFetch<JourneyBundleDTO>(`/trips/${tripId}/reset`, {
      method: 'POST'
    });
  }
};
