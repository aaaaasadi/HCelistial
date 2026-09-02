# Rules — AI Coding and Project Rules

## 1. General
- Build incrementally.
- Keep every completed phase runnable.
- Prefer simple, maintainable solutions.
- Do not over-engineer the prototype.
- Do not create unnecessary dependencies.

## 2. Data Rules
- External APIs are the source for live/rapidly changing transport information.
- PostgreSQL is the source of truth for application-specific persistent data.
- Do not duplicate the entire external transport database into PostgreSQL.
- Mock transport data is allowed for development and demos.
- Clearly distinguish mock data from live data.

## 3. AI Rules
- AI must never invent live train/bus/flight availability.
- AI must never invent fares, schedules, delays or seat availability.
- Deterministic backend logic must calculate factual recovery options first.
- AI should explain and compare supplied options.
- If AI is unavailable, the application must still show recovery plans.

## 4. API Rules
- Keep API integrations behind service abstractions.
- Never put API keys in frontend code.
- Use environment variables for credentials.
- Implement timeouts and safe error handling.
- Do not make the whole application dependent on a single external provider.
- Provide mock fallbacks during development.

## 5. Database Rules
- Use PostgreSQL.
- Use primary keys and foreign keys.
- Maintain referential integrity.
- Avoid unnecessary duplication.
- Use timestamps consistently.
- Add indexes to frequently queried foreign keys/status fields where appropriate.
- Do not store secrets in the database.

## 6. Recovery Engine Rules
- Recovery decisions must be reproducible from the supplied data.
- Never recommend an option that is impossible based on departure/arrival times.
- Account for connection feasibility.
- Account for downstream itinerary impact.
- Keep scoring weights configurable.
- Explain why a recovery plan received its score.

## 7. Frontend Rules
- The interface must clearly distinguish:
  - Normal
  - Warning
  - Disrupted
  - Recovery
- Do not overload screens with unnecessary information.
- Recovery options should be easy to compare.
- Show why an option is recommended.
- Always provide a useful loading, empty and error state.

## 8. Code Quality
- Use clear naming.
- Keep functions focused.
- Avoid giant components.
- Avoid duplicated business logic.
- Keep transport API logic out of UI components.
- Keep database access out of presentation components.
- Use reusable components where practical.

## 9. Scope Control
Do not add major features before the MVP works.

Priority:
1. Train
2. Bus
3. Connections
4. Impact analysis
5. Recovery engine
6. AI explanation
7. Real APIs
8. Flights
9. Advanced features

## 10. Demo Reliability
- The main demo must work without live API credentials.
- Seed realistic mock data.
- Include a deterministic disruption simulation.
- Do not require an internet connection for the core demo if avoidable.
- Never let an external API failure destroy the demo.

## 11. Changes
Before making major architectural changes:
- Explain the reason.
- Identify affected components.
- Preserve existing working functionality.

Do not silently replace the database, framework or core architecture.

## 12. Testing
Test at minimum:
- Normal itinerary
- Train delay
- Train cancellation
- Bus delay
- Bus cancellation
- Missed connection
- No alternative found
- External API failure
- AI failure
- Successful recovery-plan selection
