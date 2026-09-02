# Architecture — AI Multimodal Travel Disruption Recovery Engine

## 1. Architecture Goal
Create a modular full-stack application where external transport APIs provide changing transport information, PostgreSQL stores application/trip state, the backend performs recovery logic, and AI explains the resulting recovery options.

## 2. High-Level Architecture

Frontend
↓
Backend API
├── PostgreSQL
├── Train Service
├── Bus Service
├── Flight Service
├── Recovery Engine
└── AI Service
↓
Frontend

## 3. Recommended Stack
### Frontend
- React
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express
- JavaScript or TypeScript

### Database
- PostgreSQL
- Prisma or another lightweight ORM if useful

### AI
- LLM API through the backend

### External Data
- Train API
- Bus API
- Optional flight API

The implementation may use equivalent technologies only when there is a clear reason.

## 4. Data Responsibility

### External APIs
Provide:
- Train schedules/status
- Train delays/current status
- Bus search/availability
- Bus schedules/fares
- Optional live bus tracking
- Flight data at lower priority

### PostgreSQL
Stores:
- User accounts
- Trips
- Itinerary items
- Bookings
- User preferences
- Disruptions
- Recovery plans
- Selected recovery decisions
- Optional short-lived/cached API data

The database is not intended to be a complete national transport database.

## 5. Core Data Flow

User
↓
Trip/Itinerary stored in PostgreSQL
↓
Backend requests current transport information
↓
Transport Service normalizes API/mock response
↓
Disruption Detector
↓
Impact Analysis Engine
↓
Connection Detection
↓
Alternative Discovery
↓
Recovery Scoring Engine
↓
Recovery Plans
↓
AI Service
↓
Frontend

## 6. Recovery Engine

### Step A — Detect disruption
Input:
- Booking
- Current transport status
- Scheduled time

Output:
- Disruption record

### Step B — Analyze impact
Compare the updated expected arrival/departure against subsequent itinerary items.

Example:
Train expected arrival: 20:00
Bus departure: 18:30

Result:
Connection is infeasible.

### Step C — Find alternatives
Query transport services for options compatible with:
- Current location
- Earliest possible departure
- Destination
- Remaining itinerary

### Step D — Build recovery plans
A plan can contain multiple legs:
- Train → Bus
- Bus → Train
- Train → Train
- Bus → Bus

### Step E — Score plans
Use configurable factors:
- Cost
- Total delay
- Arrival time
- Transfers
- Itinerary impact
- User preferences

Suggested initial weights:
- Cost: 30%
- Arrival/time: 25%
- Itinerary preservation: 20%
- Transfers: 15%
- User preferences: 10%

### Step F — AI explanation
Send only verified structured data to the AI.

## 7. Database Model

### users
id, name, email, preferences, budget

### trips
id, user_id, name, start_date, end_date, status

### itinerary_items
id, trip_id, type, title, origin, destination, start_time, end_time, status

### bookings
id, trip_id, itinerary_item_id, provider, booking_reference, status

### transport_details
id, booking_id, mode, transport_number, scheduled_departure, scheduled_arrival

### disruptions
id, booking_id, type, severity, detected_at, description, status

### recovery_plans
id, disruption_id, description, total_cost, total_duration, delay_minutes, transfers, itinerary_impact, score, recommended

Use foreign keys, indexes and appropriate constraints.

## 8. Service Layer

Use interfaces/abstractions so providers can be replaced.

Example:

TrainService:
- getStatus()
- searchAlternatives()

BusService:
- searchAlternatives()
- getStatus() when supported

FlightService:
- searchAlternatives()
- getStatus() when supported

Mock services must implement the same interface.

## 9. API Endpoints

Suggested backend endpoints:

POST /api/trips
GET /api/trips/:id
POST /api/trips/:id/itinerary
POST /api/disruptions
GET /api/trips/:id/impact
GET /api/disruptions/:id/recovery-plans
POST /api/recovery-plans/:id/select

Transport-provider endpoints should remain behind the service layer rather than being exposed directly unless necessary.

## 10. Folder Structure

Suggested:

src/
  frontend/
  backend/
    controllers/
    routes/
    services/
      train/
      bus/
      flight/
      ai/
    recovery/
    database/
    middleware/
    utils/

prisma/ or database/
  schema/
  seed/

docs/
  PRD.md
  Architecture.md
  Rules.md
  Phases.md
  Design.md

Keep the actual structure consistent with the chosen framework.

## 11. Failure Handling
If an external API fails:
- Log the error safely.
- Fall back to mock data where appropriate.
- Clearly mark demo/mock results.
- Do not crash the entire application.

If AI fails:
- Display the deterministic recovery ranking.
- Do not fabricate an AI response.

## 12. Security
- Store secrets in environment variables.
- Never expose API keys in frontend bundles.
- Validate API inputs.
- Validate database inputs.
- Do not store unnecessary personal/payment information.
