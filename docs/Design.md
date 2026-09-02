# Design — UI/UX Specification

## 1. Product Personality
The interface should feel:
- Modern
- Trustworthy
- Intelligent
- Travel-focused
- Professional
- Easy to understand during stressful disruptions

Avoid making it look like a generic AI chatbot.

## 2. Visual Direction
Use a clean light-first travel dashboard.

Suggested palette:
- Primary: deep navy/indigo
- Background: off-white/light gray
- Success: green
- Warning: amber
- Disruption: red
- Recovery: blue/indigo

Use colors consistently and maintain accessible contrast.

## 3. Typography
Use a modern sans-serif font such as:
- Inter
- Manrope
- Plus Jakarta Sans

Use strong hierarchy:
- Large page titles
- Medium section titles
- Clear body text
- Compact metadata

## 4. Layout
Desktop-first responsive dashboard.

Use:
- Left sidebar or compact top navigation
- Main content area
- Cards
- Timeline components
- Status badges
- Clear CTA buttons

Avoid excessive gradients, excessive glassmorphism and decorative elements that reduce readability.

## 5. Main Screens

### Dashboard
Show:
- Upcoming trips
- Active disruption
- Recovery status
- Quick access to trips

### Trip Details
Show a chronological journey:

Mumbai
↓
🚆 Train
↓
Pune
↓
🚌 Bus
↓
Goa
↓
🏨 Hotel
↓
🎟️ Activity

Each item should show:
- Time
- Status
- Booking/provider
- Location
- Disruption state

### Disruption Alert
Clearly show:
- What happened
- Delay/cancellation duration
- Affected booking
- Next affected connection
- "Find Recovery" CTA

Example:

"Train delayed by 4 hours"
"Your Pune → Goa bus connection will be missed."

### Recovery Center
Show 2–3 recovery plans as comparable cards.

Each card:
- Plan name
- Transport sequence
- Departure
- Arrival
- Cost
- Total delay
- Transfers
- Itinerary impact
- Recovery score
- Recommended badge when applicable

Recommended option should be visually prominent without hiding alternatives.

### AI Explanation
Use a compact panel:

"Why this plan?"

Then explain:
- Why it was selected
- Main trade-off
- Cost/time advantage
- Itinerary preservation

### Updated Itinerary
After selection:
- Show the new route
- Highlight changed items
- Mark the disruption as resolved/recovered
- Show updated times

## 6. Interaction Principles
- User should understand a disruption within seconds.
- The next action should always be obvious.
- Avoid unnecessary forms.
- Use confirmation before irreversible actions.
- Provide clear error and fallback states.

## 7. Responsive Design
Desktop is the primary hackathon presentation target.

Also support:
- Tablet
- Mobile

On mobile:
- Stack recovery cards
- Keep important status information near the top
- Avoid wide tables

## 8. Accessibility
- Use sufficient color contrast.
- Do not communicate status using color alone.
- Provide text labels for icons.
- Ensure keyboard-friendly controls.
- Use semantic HTML where possible.

## 9. Demo Visual Priority
The most visually important sequence should be:

1. Normal itinerary
2. Disruption appears
3. Affected connection highlighted
4. Recovery plans appear
5. AI recommendation highlighted
6. Updated itinerary displayed

The UI should make the product's core value immediately visible to a hackathon judge.
