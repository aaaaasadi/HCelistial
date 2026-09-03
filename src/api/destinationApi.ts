import { apiFetch } from './client';
import {
  SyntheticCity,
  PopularJourney,
  SyntheticHotel,
  SyntheticActivity,
  SyntheticTravelDataset
} from '../../server/services/dataset/syntheticDatasetGenerator';

export const destinationApi = {
  async getDestinations(params?: { query?: string; region?: string; type?: string }): Promise<{ count: number; data: SyntheticCity[] }> {
    try {
      const qParams: Record<string, string> = {};
      if (params?.query) qParams.query = params.query;
      if (params?.region) qParams.region = params.region;
      if (params?.type) qParams.type = params.type;

      const qs = new URLSearchParams(qParams).toString();
      const res = await apiFetch<{ success: boolean; count: number; data: SyntheticCity[] }>(`/destinations?${qs}`);
      if (res && Array.isArray(res.data) && res.data.length > 0) {
        return { count: res.data.length, data: res.data };
      }
      const local = SyntheticTravelDataset.getInstance().searchDestinations(params);
      return { count: local.length, data: local };
    } catch {
      const local = SyntheticTravelDataset.getInstance().searchDestinations(params);
      return { count: local.length, data: local };
    }
  },

  async getDestinationDetails(id: string): Promise<{
    destination: SyntheticCity;
    popularHotels: SyntheticHotel[];
    popularActivities: SyntheticActivity[];
    popularJourneys: PopularJourney[];
  }> {
    try {
      const res = await apiFetch<{
        success: boolean;
        data: {
          destination: SyntheticCity;
          popularHotels: SyntheticHotel[];
          popularActivities: SyntheticActivity[];
          popularJourneys: PopularJourney[];
        };
      }>(`/destinations/${encodeURIComponent(id)}`);
      if (res && res.data) {
        return res.data;
      }
      return this.getLocalDestinationDetails(id);
    } catch {
      return this.getLocalDestinationDetails(id);
    }
  },

  async getPopularJourneys(cityId?: string): Promise<{ count: number; data: PopularJourney[] }> {
    try {
      const qs = cityId ? `?cityId=${encodeURIComponent(cityId)}` : '';
      const res = await apiFetch<{ success: boolean; count: number; data: PopularJourney[] }>(`/popular-journeys${qs}`);
      if (res && Array.isArray(res.data) && res.data.length > 0) {
        return { count: res.data.length, data: res.data };
      }
      const local = SyntheticTravelDataset.getInstance().getPopularJourneys(cityId);
      return { count: local.length, data: local };
    } catch {
      const local = SyntheticTravelDataset.getInstance().getPopularJourneys(cityId);
      return { count: local.length, data: local };
    }
  },

  async searchHotels(city: string, category?: string): Promise<{ count: number; data: SyntheticHotel[] }> {
    try {
      const qs = `city=${encodeURIComponent(city)}${category ? `&category=${encodeURIComponent(category)}` : ''}`;
      const res = await apiFetch<{ success: boolean; count: number; data: SyntheticHotel[] }>(`/hotels/search?${qs}`);
      if (res && Array.isArray(res.data) && res.data.length > 0) {
        return { count: res.data.length, data: res.data };
      }
      const local = SyntheticTravelDataset.getInstance().getHotelsByCity(city, category);
      return { count: local.length, data: local };
    } catch {
      const local = SyntheticTravelDataset.getInstance().getHotelsByCity(city, category);
      return { count: local.length, data: local };
    }
  },

  async searchActivities(city: string, category?: string): Promise<{ count: number; data: SyntheticActivity[] }> {
    try {
      const qs = `city=${encodeURIComponent(city)}${category ? `&category=${encodeURIComponent(category)}` : ''}`;
      const res = await apiFetch<{ success: boolean; count: number; data: SyntheticActivity[] }>(`/activities/search?${qs}`);
      if (res && Array.isArray(res.data) && res.data.length > 0) {
        return { count: res.data.length, data: res.data };
      }
      const local = SyntheticTravelDataset.getInstance().getActivitiesByCity(city, category);
      return { count: local.length, data: local };
    } catch {
      const local = SyntheticTravelDataset.getInstance().getActivitiesByCity(city, category);
      return { count: local.length, data: local };
    }
  },

  getLocalDestinationDetails(id: string) {
    const dataset = SyntheticTravelDataset.getInstance();
    const city = dataset.getDestinationById(id) || dataset.cities[0];
    const hotels = dataset.getHotelsByCity(city.id);
    const activities = dataset.getActivitiesByCity(city.id);
    const journeys = dataset.getPopularJourneys(city.id);

    return {
      destination: city,
      popularHotels: hotels.slice(0, 6),
      popularActivities: activities.slice(0, 6),
      popularJourneys: journeys
    };
  }
};
