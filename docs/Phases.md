# Phases — Implementation Plan

## Phase 0 — Planning
Goal:
- Confirm architecture
- Confirm database model
- Confirm UI structure
- Confirm environment variables
- Create repository structure

Do not build advanced features yet.

## Phase 1 — PostgreSQL + Backend Foundation
Build:
- Database
- Schema
- Migrations
- Seed/demo data
- Basic Express server
- Health endpoint

Success:
Database connects and seed data can be read through the backend.

## Phase 2 — Trips and Itineraries
Build:
- Create trip
- View trip
- Add itinerary items
- Add bookings
- Trip timeline API

Success:
A user can create/view the Mumbai → Pune → Goa demo itinerary.

## Phase 3 — Mock Transport Services
Build:
- Mock TrainService
- Mock BusService
- Optional Mock FlightService

Seed realistic:
- schedules
- fares
- delays
- availability

Success:
Backend can search alternative trains/buses without external APIs.

## Phase 4 — Disruption Simulation
Build:
- Delay disruption
- Cancellation disruption
- Disruption record
- Disruption UI

Success:
User can trigger:
"Train Mumbai → Pune delayed by 4 hours."

## Phase 5 — Connection Detection
Build logic that compares:
- Updated arrival
- Next departure
- Transfer buffer

Success:
System identifies:
"Passenger will miss Pune → Goa bus."

## Phase 6 — Itinerary Impact Analysis
Build logic that checks downstream:
- transport
- hotel
- activities

Success:
System identifies all affected itinerary items.

## Phase 7 — Recovery Engine
Build:
- Alternative discovery
- Multi-leg recovery plans
- Scoring
- Ranking

Support:
- Train → Bus
- Bus → Train
- Train → Train
- Bus → Bus

Success:
System generates 2–3 feasible recovery plans.

## Phase 8 — Frontend Recovery Center
Build:
- Disruption alert
- Recovery plan cards
- Score
- Cost
- Delay
- Transfers
- Itinerary impact
- Recommended option

Success:
A judge can understand the recovery decision without technical explanation.

## Phase 9 — AI Recommendation
Build backend AI service.

AI receives:
- disruption
- itinerary
- feasible recovery plans
- scores
- user preferences

AI returns:
- recommendation
- explanation
- trade-offs

Success:
AI explains the recommendation without inventing facts.

## Phase 10 — Real Train API
Integrate a suitable train API.

Requirements:
- Keep it behind TrainService.
- Store credentials in environment variables.
- Normalize provider response into the application's internal format.
- Keep mock fallback.

Success:
The same recovery engine can work with real train data.

## Phase 11 — Real Bus API
Integrate a suitable bus API such as AOPAY if access/terms are appropriate.

Requirements:
- Keep it behind BusService.
- Keep mock fallback.
- Never expose credentials.

Success:
Alternative bus search can use live/provider data.

## Phase 12 — Secondary Flight Support
Add:
- FlightService
- Basic flight alternatives
- Flight disruption type

Do not let flight development delay the train/bus MVP.

## Phase 13 — Advanced Enhancements
Only after the core flow is stable:
- Weather disruptions
- Live tracking
- Notifications
- Maps
- Better optimization
- Hotel/activity recovery
- Recovery history
- Analytics dashboard

## Phase Completion Rule
Do not move to the next phase until:
- Current phase works
- No critical errors remain
- Existing functionality still works
- The phase can be demonstrated independently
