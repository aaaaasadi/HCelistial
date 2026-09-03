import { Request, Response } from 'express';
import { SyntheticTravelDataset } from '../services/dataset/syntheticDatasetGenerator';

export class DestinationController {
  public static async getDestinations(req: Request, res: Response): Promise<void> {
    try {
      const query = (req.query.query as string) || '';
      const region = (req.query.region as string) || '';
      const type = (req.query.type as string) || '';

      const dataset = SyntheticTravelDataset.getInstance();
      const results = dataset.searchDestinations({ query, region, type });

      res.status(200).json({
        success: true,
        count: results.length,
        data: results
      });
    } catch (err: any) {
      console.error('[DestinationController] Error fetching destinations:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async getDestinationDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const dataset = SyntheticTravelDataset.getInstance();
      const city = dataset.getDestinationById(id);

      if (!city) {
        res.status(404).json({ success: false, error: `Destination '${id}' not found.` });
        return;
      }

      const hotels = dataset.getHotelsByCity(city.id);
      const activities = dataset.getActivitiesByCity(city.id);
      const journeys = dataset.getPopularJourneys(city.id);

      res.status(200).json({
        success: true,
        data: {
          destination: city,
          popularHotels: hotels.slice(0, 6),
          popularActivities: activities.slice(0, 6),
          popularJourneys: journeys
        }
      });
    } catch (err: any) {
      console.error('[DestinationController] Error fetching destination details:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async getDestinationHotels(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = req.query.category as string;
      const dataset = SyntheticTravelDataset.getInstance();
      const hotels = dataset.getHotelsByCity(id, category);

      res.status(200).json({
        success: true,
        count: hotels.length,
        data: hotels
      });
    } catch (err: any) {
      console.error('[DestinationController] Error fetching hotels:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async getDestinationActivities(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = req.query.category as string;
      const dataset = SyntheticTravelDataset.getInstance();
      const activities = dataset.getActivitiesByCity(id, category);

      res.status(200).json({
        success: true,
        count: activities.length,
        data: activities
      });
    } catch (err: any) {
      console.error('[DestinationController] Error fetching activities:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async getPopularJourneys(req: Request, res: Response): Promise<void> {
    try {
      const cityId = req.query.cityId as string;
      const dataset = SyntheticTravelDataset.getInstance();
      const journeys = dataset.getPopularJourneys(cityId);

      res.status(200).json({
        success: true,
        count: journeys.length,
        data: journeys
      });
    } catch (err: any) {
      console.error('[DestinationController] Error fetching popular journeys:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async searchHotels(req: Request, res: Response): Promise<void> {
    try {
      const city = (req.query.city as string) || '';
      const category = req.query.category as string;
      const dataset = SyntheticTravelDataset.getInstance();
      const results = dataset.getHotelsByCity(city, category);

      res.status(200).json({
        success: true,
        count: results.length,
        data: results
      });
    } catch (err: any) {
      console.error('[DestinationController] Error searching hotels:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async searchActivities(req: Request, res: Response): Promise<void> {
    try {
      const city = (req.query.city as string) || '';
      const category = req.query.category as string;
      const dataset = SyntheticTravelDataset.getInstance();
      const results = dataset.getActivitiesByCity(city, category);

      res.status(200).json({
        success: true,
        count: results.length,
        data: results
      });
    } catch (err: any) {
      console.error('[DestinationController] Error searching activities:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
