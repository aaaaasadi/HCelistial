# PRD — AI Multimodal Travel Disruption Recovery Engine

## 1. Product Overview
Build an AI-powered web application that helps travelers recover their journey when a train or bus disruption occurs.

The product does not simply find another vehicle. Its core purpose is to understand how a disruption affects the rest of a trip, identify missed connections and downstream itinerary impacts, generate alternative recovery plans, rank them, and explain the best option.

## 2. Target Users
- Individual travelers
- Students and budget travelers
- Families and groups
- Travelers using multi-leg train/bus journeys

## 3. Primary Problem
A delay or cancellation in one part of a journey can cause a chain reaction:
- Missed train/bus connections
- Late hotel check-in
- Missed activities
- Increased cost
- Confusing manual re-planning

The system should reduce this burden by reconstructing the affected journey.

## 4. Primary Scope
### Train
- Delays
- Cancellations
- Expected arrival changes
- Missed connections

### Bus
- Delays
- Cancellations
- Alternative bus discovery
- Missed connections

### Connections
- Train → Bus
- Bus → Train
- Train → Train
- Bus → Bus

### Itinerary Impact
Determine which future itinerary items become infeasible or affected.

### AI Recovery Recommendations
Generate and explain 2–3 recovery plans based on:
- Cost
- Arrival time
- Delay
- Transfers
- Connection feasibility
- Itinerary preservation
- User budget/preferences

## 5. Secondary Scope
Flight disruption support should exist as a secondary transport type using the same architecture. It should not dominate the MVP.

## 6. Core User Flow
1. User creates/selects a trip.
2. User adds itinerary and bookings.
3. Transport status is obtained from an API or mock service.
4. A disruption is detected or simulated.
5. The system calculates itinerary impact.
6. The system identifies missed connections.
7. Alternative transport options are retrieved.
8. Recovery plans are generated.
9. Recovery plans are scored.
10. AI explains and recommends the strongest option.
11. User selects a recovery plan.
12. The itinerary is updated.

## 7. Main Demo Scenario
Trip:
Mumbai → Pune → Goa

Itinerary:
- Train: Mumbai → Pune
- Bus: Pune → Goa
- Hotel: Goa
- Activity: Goa

Disruption:
Mumbai → Pune train is delayed by 4 hours.

Expected behavior:
- Detect the delayed arrival.
- Determine that the Pune → Goa bus will be missed.
- Identify affected downstream itinerary items.
- Search alternative train/bus combinations.
- Generate 2–3 recovery plans.
- Rank them.
- Explain the recommended plan with AI.
- Update the itinerary after user selection.

## 8. Database
Use PostgreSQL for persistent application data.

Core entities:
- Users
- Trips
- Itinerary Items
- Bookings
- Transport Details
- Disruptions
- Recovery Plans

Do not attempt to permanently store every train and bus in India. Rapidly changing transport data should primarily come from external APIs. Relevant data may be cached when useful.

## 9. External Data
Create service interfaces for:
- Train data
- Bus data
- Flight data

Use real APIs when credentials/access are available. Use realistic mock services as a fallback.

API keys must never be exposed in frontend code.

## 10. AI Responsibilities
AI must not invent transport availability, prices, schedules, or live status.

The deterministic backend/recovery engine provides factual options and scores. AI:
- Explains trade-offs
- Recommends among calculated options
- Produces a clear recovery summary
- Answers user questions using supplied data

## 11. MVP Success Criteria
A working demo must successfully show:

Disruption → Impact Analysis → Missed Connection → Alternatives → Recovery Scoring → AI Recommendation → Updated Itinerary

A reliable end-to-end flow is more important than a large number of incomplete features.
