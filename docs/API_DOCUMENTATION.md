# TravelRescue — Phase 6 Backend & PostgreSQL API Documentation

## 1. Quick Start

### Prerequisites
- Node.js (v18+)
- PostgreSQL 18 (running on `localhost:5432`)

### Environment Configuration
Create a `.env` file in the project root:
```env
DATABASE_URL=postgresql://postgres:adinath@localhost:5432/travelrescue_db
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Database Setup
1. **Create Database**:
   ```sql
   CREATE DATABASE travelrescue_db;
   ```
2. **Run Migrations**:
   ```bash
   npm run db:migrate
   ```
   Applies `server/database/migrations/001_initial_schema.sql` (12 relational tables with foreign keys and performance indexes).

3. **Seed Demo Data**:
   ```bash
   npm run db:seed
   ```
   Populates demo traveler Arjun Mehta (`TRV-88219`), Mumbai $\to$ Pune $\to$ Goa trip (`trip-mum-pune-goa`), 4 trip segments (Train, Bus, Hotel, Activity), initial bookings, preferences, and notifications.

4. **Start Backend Server**:
   ```bash
   npm run server
   ```
   Runs Express REST API on `http://localhost:5001`.

5. **Start Frontend (Vite)**:
   ```bash
   npm run dev
   ```
   Runs the interactive UI on `http://localhost:5173`.

---

## 2. API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check returning DB connection status & environment |
| `GET` | `/api/trips/:tripId` | Comprehensive journey bundle (trip, segments, connections, bookings, disruptions, impacts, recovery plans, preferences, health, notifications) |
| `POST` | `/api/trips/:tripId/demo/disruptions` | Simulates disruption scenario (`SCENARIO_1_NORMAL`, `SCENARIO_2_MINOR_DELAY`, `SCENARIO_3_SEVERE_DELAY`, `SCENARIO_4_MISSED_BUS`) and persists all cascading state in PostgreSQL |
| `POST` | `/api/trips/:tripId/recovery-plans/:planId/select` | Selects a recovery plan, replaces disrupted transit legs, restores hotel/activity status, updates trip to `RECOVERED` (98% health), and marks plan as selected in PostgreSQL |
| `POST` | `/api/trips/:tripId/reset` | Resets trip in PostgreSQL back to pristine demo state |
| `GET` | `/api/transport/trains/search` | Search train alternatives across active providers (cached for 10m) |
| `GET` | `/api/transport/buses/search` | Search bus alternatives across active providers (cached for 10m) |
| `GET` | `/api/transport/flights/search` | Search flight alternatives across active providers (cached for 10m) |
| `GET` | `/api/transport/:type/:serviceNumber/status` | Retrieve live operational status & delays for a transit service (cached for 30s) |
| `POST` | `/api/transport/sync/:tripId` | Live sync all transit legs for a trip $\to$ persists observations into `transport_status` in PostgreSQL $\to$ triggers Disruption & Recovery Engine if delay observed |
| `GET` | `/api/users/:userId/preferences` | Fetches stored traveler preferences from PostgreSQL |
| `PUT` | `/api/users/:userId/preferences` | Updates traveler preferences in PostgreSQL |
| `GET` | `/api/users/:userId/notifications` | Fetches traveler notifications |
| `PUT` | `/api/notifications/:id/read` | Marks a notification as read |
| `POST` | `/api/ai/chat` | AI Travel Guide chat grounded directly in persisted PostgreSQL trip context |

---

## 3. Key Endpoint Examples

### GET `/api/health`
```json
{
  "status": "ok",
  "service": "TravelRescue Backend API",
  "database": "connected",
  "databaseType": "PostgreSQL 18",
  "environment": "development"
}
```

### POST `/api/trips/trip-mum-pune-goa/demo/disruptions`
**Request Body**:
```json
{
  "scenarioId": "SCENARIO_3_SEVERE_DELAY"
}
```
**Response**:
Returns full `JourneyBundleDTO` with 1 disruption, 4 cascading impacts, and 4 ranked recovery plans persisted in PostgreSQL.

### POST `/api/trips/trip-mum-pune-goa/recovery-plans/:planId/select`
**Response**:
```json
{
  "journeyStatus": "RECOVERED",
  "journeyHealth": 98,
  "selectedPlanId": "candidate-train-ksrtc",
  "segments": [
    { "type": "TRAIN", "status": "ON_TIME", ... },
    { "type": "BUS", "title": "KSRTC Airavat Club Class", "status": "CONFIRMED", ... },
    { "type": "HOTEL", "status": "CONFIRMED", ... },
    { "type": "ACTIVITY", "status": "CONFIRMED", ... }
  ],
  "dataSource": "POSTGRESQL"
}
```

---

## 4. Architecture & Data Flow

```
FRONTEND (Vite + React)
   │
   ▼
Frontend API Client (src/api/)
   │
   ▼ [HTTP REST]
BACKEND (server/routes/ & server/controllers/)
   │
   ▼
Domain Services (server/services/)
   ├── JourneyService
   ├── DisruptionService
   ├── RecoveryService
   └── AIServiceBackend
   │
   ├──▶ Existing Deterministic Engines (Business Logic)
   │     ├── ConnectionEngine
   │     ├── ImpactEngine
   │     ├── RecoveryEngine & Scoring
   │     └── FactExtractor & Guardrails
   │
   ▼
Repository Layer (server/repositories/)
   │
   ▼
PostgreSQL 18 (travelrescue_db)
```
