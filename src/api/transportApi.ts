import { apiFetch } from './client';
import { JourneyBundleDTO } from '../../server/types/backendTypes';
import { NormalizedLiveStatus, NormalizedTransportOption } from '../../server/services/transport/interfaces/ITransportProvider';

export const transportApi = {
  async searchTrains(params: { origin?: string; destination?: string; date?: string }): Promise<{ count: number; data: NormalizedTransportOption[] }> {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return apiFetch(`/transport/trains/search?${qs}`);
  },

  async searchBuses(params: { origin?: string; destination?: string; date?: string }): Promise<{ count: number; data: NormalizedTransportOption[] }> {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return apiFetch(`/transport/buses/search?${qs}`);
  },

  async searchFlights(params: { origin?: string; destination?: string; date?: string }): Promise<{ count: number; data: NormalizedTransportOption[] }> {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return apiFetch(`/transport/flights/search?${qs}`);
  },

  async getLiveStatus(type: string, serviceNumber: string): Promise<{ success: boolean; data: NormalizedLiveStatus }> {
    return apiFetch(`/transport/${type}/${encodeURIComponent(serviceNumber)}/status`);
  },

  async syncTripTelemetry(tripId: string): Promise<{ success: boolean; message: string; data: JourneyBundleDTO }> {
    return apiFetch(`/transport/sync/${encodeURIComponent(tripId)}`, {
      method: 'POST'
    });
  }
};
