import { Router } from 'express';
import { TripController } from '../controllers/TripController';
import { PreferencesController } from '../controllers/PreferencesController';
import { NotificationController } from '../controllers/NotificationController';
import { AIController } from '../controllers/AIController';
import { HealthController } from '../controllers/HealthController';
import { TransportController } from '../controllers/TransportController';

export const apiRouter = Router();

// Health Check
apiRouter.get('/health', HealthController.getHealth);

// Trips & Journey State
apiRouter.get('/trips/:tripId', TripController.getTrip);
apiRouter.post('/trips/:tripId/demo/disruptions', TripController.simulateDisruption);
apiRouter.post('/trips/:tripId/recovery-plans/:planId/select', TripController.selectRecoveryPlan);
apiRouter.post('/trips/:tripId/reset', TripController.resetTrip);

// Transport Feeds, Alternative Search & Live Telemetry
apiRouter.get('/transport/trains/search', TransportController.searchTrains);
apiRouter.get('/transport/buses/search', TransportController.searchBuses);
apiRouter.get('/transport/flights/search', TransportController.searchFlights);
apiRouter.get('/transport/:type/:serviceNumber/status', TransportController.getLiveStatus);
apiRouter.post('/transport/sync/:tripId', TransportController.syncTripTelemetry);

// User Preferences
apiRouter.get('/users/:userId/preferences', PreferencesController.getPreferences);
apiRouter.put('/users/:userId/preferences', PreferencesController.updatePreferences);

// Notifications
apiRouter.get('/users/:userId/notifications', NotificationController.getNotifications);
apiRouter.put('/notifications/:id/read', NotificationController.markRead);

// AI Travel Guide
apiRouter.post('/ai/chat', AIController.askAI);
