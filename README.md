# TravelRescue — AI-Powered Travel Disruption Recovery Engine

> **Intelligent Travel Resilience**: Detecting transit disruptions, calculating cascading connection and booking risks, generating scored multimodal alternatives (Train, Bus, Flight), and providing a grounded AI Travel Guide backed by PostgreSQL 18.

---

## 🏗️ System Architecture

```
             REAL TRANSPORT APIs
              /       |       \
          Train      Bus     Flight
             \        |       /
          Provider Adapters (Real & Mock)
                      ↓
          Canonical Normalization & Cache
             (30s Live / 10m Search TTL)
                      ↓
          Unified Transport Service
                      ↓
          Express 5.2 Backend API
                      ↓
          PostgreSQL 18 Persistence
             (12 Relational Tables)
                      ↓
         ┌────────────┼────────────┐
         ▼            ▼            ▼
    Disruption      Impact      Recovery
      Engine        Engine       Engine
         │            │            │
         └────────────┼────────────┘
                      ▼
             Feasibility Engine
                      ↓
              Scoring Engine
                      ↓
             Selected Journey
                      ↓
           Vite + React Frontend
                      ↓
      AI Travel Guide (Zero-Hallucination)
```

---

## ✨ Core Capabilities (Phases 1–8)

1. **Phase 1: Rich Interactive Frontend**:
   - Stitch-generated UI, Dark Mode, Emerald/Cyan luxury aesthetic.
   - Interactive Navigation: Dashboard, My Journey, Live Monitor, Recovery Center, AI Guide, Preferences, Notifications.
2. **Phase 2: Functional Journey State**:
   - Centralized journey graph with segment progression (Train $\to$ Bus $\to$ Hotel $\to$ Activity).
   - Connection buffer calculation and real-time telemetry observation.
3. **Phase 3: Disruption & Impact Engine**:
   - Automated detection of delays and cancellations.
   - Cascading impact propagation: identifies broken connections, delayed hotel check-ins, and missed excursions.
4. **Phase 4: Recovery Engine & Multi-Criteria Scoring**:
   - Multimodal alternative generation (Trains, Buses, Standby Flights).
   - Feasibility filter (eliminating impossible arrival windows or buffer violations).
   - Weighted multi-criteria scoring algorithm balancing arrival time, financial cost, transfer friction, and hotel preservation.
5. **Phase 5: Grounded AI Travel Guide**:
   - Context-grounded conversational travel assistant answering 9 core travel queries.
   - **Anti-Hallucination Guardrails**: Strictly constrained to PostgreSQL truth. Never invents schedules, train numbers, or prices.
6. **Phase 6: PostgreSQL Persistence & REST API**:
   - Full ACID persistence across 12 relational tables with foreign keys and cascade rules.
   - Express REST API with full lifecycle endpoints (`/api/trips`, `/api/disruptions`, `/api/recovery`, `/api/ai`).
7. **Phase 7: Real Transport API Integration**:
   - Provider abstraction layer (`ITrainProvider`, `IBusProvider`, `IFlightProvider`).
   - Adapters for Indian Railways / RailAPI, Intercity Bus (AOPAY schema), and AviationStack flight tracker.
   - Transparent mock fallback with data provenance badges (`LIVE DATA` vs `DEMO DATA`).
8. **Phase 8: Polish, Performance & Production Deployment**:
   - Master 15-step automated E2E test suite (`npm run test:e2e`).
   - In-memory rate-limit shield (`TransportCache.ts`).
   - Multi-stage `Dockerfile` and `render.yaml` infrastructure-as-code.
   - Responsive design verification across desktop, tablet, and mobile.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 6, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js 20+, Express 5.2, TypeScript (`tsx`).
- **Database**: PostgreSQL 18 (Local & Cloud SSL supported).
- **Architecture**: Repository Pattern, Provider Adapter Pattern, Domain-Driven Engines.
- **Deployment**: Docker, Render Blueprint, SPA static asset serving.

---

## 🚀 Local Quickstart

### 1. Prerequisites
- Node.js v18+ (Node v20+ recommended)
- PostgreSQL 16+ or 18 running locally or accessible via Cloud URL

### 2. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Verify your `.env` settings:
```env
DATABASE_URL=postgresql://postgres:adinath@localhost:5432/travelrescue_db
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Transport Providers (mock | real)
TRAIN_PROVIDER=mock
BUS_PROVIDER=mock
FLIGHT_PROVIDER=mock
TRANSPORT_FALLBACK_TO_MOCK=true

# Optional real keys (leave blank for deterministic mock mode)
TRAIN_API_KEY=
BUS_API_KEY=
FLIGHT_API_KEY=
```

### 3. Database Migration & Seeding
```bash
# Run migrations (creates 12 tables and indexes)
npm run db:migrate

# Seed baseline demo journey (Mumbai → Pune → Goa)
npm run db:seed
```

### 4. Start Development Servers
In two separate terminals:

```bash
# Terminal 1: Backend Server (Port 5001)
npm run server

# Terminal 2: Frontend App (Port 5173)
npm run dev
```

Visit the application at: **`http://localhost:5173/`**

---

## 🧪 Automated Testing

TravelRescue includes 4 specialized automated test suites:

| Command | Suite | Purpose |
|---|---|---|
| `npm run test:providers` | Provider Unit Tests | Validates normalizers, anti-hallucination guardrails, TTL cache, and mock fallback (9 tests). |
| `npm run test:transport` | Transport Integration | Validates multimodal search, live status, PostgreSQL telemetry sync, and REST endpoints (7 tests). |
| `npm run test:backend` | Persistence Tests | Validates PostgreSQL database operations, repository integrity, and AI grounding (8 tests). |
| `npm run test:e2e` | Master E2E Suite | 15-step master end-to-end verification covering the entire journey lifecycle from normal state to disruption, recovery, restart, and reset. |
| `npm run build` | Production Build | Full TypeScript compiler and Vite asset compilation. |

---

## 🎭 2-Minute Hackathon Demo Script

Follow these steps for a presentation:

1. **Step 1: Open the Dashboard (`http://localhost:5173/`)**:
   - Point out the **Journey Health Score (95%)** and status badge: **ON TRACK**.
   - Note the connected itinerary: Mumbai $\to$ Pune (Train 12127) $\to$ Goa (Bus) $\to$ Resort Hotel $\to$ Sunset Cruise.
2. **Step 2: Inspect "My Journey"**:
   - View the multimodal Journey Graph and Timeline showing the planned 3h 30m buffer in Pune.
3. **Step 3: Open "Live Monitor"**:
   - Point out the real-time telemetry cards with data provenance tags (**DEMO DATA** or **LIVE DATA**).
   - Click **"Refresh Status"**: live telemetry syncs to PostgreSQL `transport_status`.
4. **Step 4: Trigger Disruption Simulator**:
   - In the top bar, click **"SIMULATE TRAIN DELAY (+3h 20m)"**.
   - Watch the Disruption Engine detect that the 3h 20m delay eliminates the connection buffer.
   - Journey status updates to **DISRUPTED** (Health drops to 48%).
   - The **Impact Cascade** alerts that the Pune bus is missed and the hotel check-in will be delayed.
5. **Step 5: Navigate to "Recovery Center"**:
   - Review the 4 scored recovery options ranked by multi-criteria utility:
     - **Plan 1 (Recommended)**: Train + Bus Seamless Connector (Score: 89/100, preserves hotel).
     - **Plan 2**: Express Direct Sleeper Bus (Score: 82/100, budget friendly).
     - **Plan 3**: Emergency Standby Flight (Score: 78/100, fastest arrival).
   - Click **"Compare"** to see side-by-side arrival tradeoffs and cost breakdowns.
6. **Step 6: Select the Recommended Plan**:
   - Click **"Select This Recovery Plan"** and confirm.
   - Celebration confetti triggers! The trip transitions to **RECOVERED** (98% health).
   - The replaced segment is saved in PostgreSQL and the hotel reservation is preserved.
7. **Step 7: Ask the AI Travel Guide**:
   - Switch to **AI Travel Guide**.
   - Click or ask: *"Why was this recovery plan recommended?"*
   - Notice the AI's exact, grounded explanation citing the verified arrival time and hotel preservation.
   - Ask: *"What happens to my hotel?"*
   - Notice the AI confirms the hotel reservation was kept intact without hallucinating fake policies.
8. **Step 8: Demonstrate Persistence & Reset**:
   - Refresh the browser (`F5`). All recovered states and segments remain persisted in PostgreSQL.
   - Click **"Reset Demo"** in the top bar to restore the clean baseline.

---

## 🚢 Cloud Deployment

### Docker Deployment
```bash
# Build production Docker image
docker build -t travelrescue:latest .

# Run container
docker run -p 5001:5001 -e DATABASE_URL="your-cloud-postgres-url" travelrescue:latest
```

### Render Blueprint (1-Click Deployment)
The included [`render.yaml`](file:///c:/Users/DELL%20INDIA/Celestial/render.yaml) automatically provisions:
1. **Node Web Service**: Runs `npm start`, serving both backend REST API and pre-built frontend SPA.
2. **Managed PostgreSQL**: Automatically creates `travelrescue-db` with SSL enabled.

---

## 🔒 Security & Guardrails

- **Zero Secret Leakage**: No API keys or passwords in the frontend bundle.
- **Data Provenance**: Every transport observation and recovery option explicitly identifies its source (`REAL` or `MOCK`).
- **Anti-Hallucination Guarantee**: If seat availability or prices are not confirmed by the provider, the system marks them `UNKNOWN` or `null` rather than generating simulated numbers.
- **Rate-Limit Protection**: In-memory caching shields upstream APIs (30s TTL for live telemetry, 10m TTL for route search).
- **SQL Injection Prevention**: All database queries use parameterized SQL (`$1, $2, ...`).
- **Graceful Degradation**: If real APIs are unreachable, the system transparently falls back to mock fixtures when configured.

---

## 📄 License
MIT License. Built for Intelligent Travel Resilience.
