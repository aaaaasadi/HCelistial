-- TravelRescue Initial Relational Schema
-- PostgreSQL 18 Compatible Migration

-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    loyalty_tier VARCHAR(64) DEFAULT 'Gold Priority',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. TRIPS
CREATE TABLE IF NOT EXISTS trips (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    start_time VARCHAR(64) NOT NULL,
    end_time VARCHAR(64) NOT NULL,
    status VARCHAR(64) NOT NULL DEFAULT 'ON_TRACK',
    journey_health INTEGER NOT NULL DEFAULT 95,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. TRIP SEGMENTS
CREATE TABLE IF NOT EXISTS trip_segments (
    id VARCHAR(64) PRIMARY KEY,
    trip_id VARCHAR(64) NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    sequence INTEGER NOT NULL,
    segment_type VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    scheduled_departure VARCHAR(64) NOT NULL,
    scheduled_arrival VARCHAR(64) NOT NULL,
    expected_departure VARCHAR(64) NOT NULL,
    expected_arrival VARCHAR(64) NOT NULL,
    status VARCHAR(64) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    service_number VARCHAR(64) NOT NULL,
    booking_id VARCHAR(64) NOT NULL,
    platform_or_terminal VARCHAR(128),
    seat_or_class VARCHAR(128),
    is_disrupted BOOLEAN DEFAULT FALSE,
    delay_minutes INTEGER DEFAULT 0,
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(64) PRIMARY KEY,
    trip_id VARCHAR(64) NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    segment_id VARCHAR(64) REFERENCES trip_segments(id) ON DELETE CASCADE,
    booking_reference VARCHAR(128) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    booking_type VARCHAR(64) NOT NULL,
    status VARCHAR(64) NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    currency VARCHAR(16) NOT NULL DEFAULT 'INR',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. TRANSPORT STATUS
CREATE TABLE IF NOT EXISTS transport_status (
    id VARCHAR(64) PRIMARY KEY,
    segment_id VARCHAR(64) NOT NULL REFERENCES trip_segments(id) ON DELETE CASCADE,
    status VARCHAR(64) NOT NULL,
    delay_minutes INTEGER DEFAULT 0,
    actual_departure VARCHAR(64),
    actual_arrival VARCHAR(64),
    expected_departure VARCHAR(64),
    expected_arrival VARCHAR(64),
    reason TEXT,
    source VARCHAR(128) NOT NULL DEFAULT 'MOCK_ENGINE',
    recorded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. DISRUPTIONS
CREATE TABLE IF NOT EXISTS disruptions (
    id VARCHAR(64) PRIMARY KEY,
    trip_id VARCHAR(64) NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    segment_id VARCHAR(64) NOT NULL REFERENCES trip_segments(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL DEFAULT 'Transport Disruption',
    type VARCHAR(64) NOT NULL,
    severity VARCHAR(32) NOT NULL,
    delay_minutes INTEGER NOT NULL DEFAULT 0,
    delay_formatted VARCHAR(64),
    reason TEXT NOT NULL,
    description TEXT,
    affected_next_leg VARCHAR(255),
    detected_at VARCHAR(64),
    status VARCHAR(64) NOT NULL DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. IMPACTS
CREATE TABLE IF NOT EXISTS impacts (
    id VARCHAR(64) PRIMARY KEY,
    trip_id VARCHAR(64) NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    disruption_id VARCHAR(64) REFERENCES disruptions(id) ON DELETE CASCADE,
    affected_segment_id VARCHAR(64) NOT NULL REFERENCES trip_segments(id) ON DELETE CASCADE,
    impact_type VARCHAR(64) NOT NULL,
    severity VARCHAR(32) NOT NULL,
    reason TEXT NOT NULL,
    original_schedule VARCHAR(128),
    projected_outcome VARCHAR(128),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. RECOVERY PLANS
CREATE TABLE IF NOT EXISTS recovery_plans (
    id VARCHAR(64) PRIMARY KEY,
    trip_id VARCHAR(64) NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    plan_type VARCHAR(64) NOT NULL,
    tag VARCHAR(64),
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    new_departure VARCHAR(64) NOT NULL,
    new_arrival VARCHAR(64) NOT NULL,
    total_travel_time VARCHAR(64) NOT NULL,
    total_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    additional_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    transfers_count INTEGER NOT NULL DEFAULT 0,
    itinerary_preservation INTEGER NOT NULL DEFAULT 100,
    score INTEGER NOT NULL DEFAULT 0,
    score_breakdown JSONB DEFAULT '{}'::jsonb,
    feasibility JSONB DEFAULT '{}'::jsonb,
    tradeoffs JSONB DEFAULT '{}'::jsonb,
    affected_bookings JSONB DEFAULT '{}'::jsonb,
    hotel_status VARCHAR(64) NOT NULL DEFAULT 'PRESERVED',
    activity_status VARCHAR(64) NOT NULL DEFAULT 'PRESERVED',
    is_recommended BOOLEAN NOT NULL DEFAULT FALSE,
    is_selected BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(64) NOT NULL DEFAULT 'AVAILABLE',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. RECOVERY OPTIONS
CREATE TABLE IF NOT EXISTS recovery_options (
    id VARCHAR(64) PRIMARY KEY,
    recovery_plan_id VARCHAR(64) NOT NULL REFERENCES recovery_plans(id) ON DELETE CASCADE,
    segment_sequence INTEGER NOT NULL DEFAULT 1,
    transport_type VARCHAR(64) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    service_number VARCHAR(64) NOT NULL,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    departure_time VARCHAR(64) NOT NULL,
    arrival_time VARCHAR(64) NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. USER PREFERENCES
CREATE TABLE IF NOT EXISTS user_preferences (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    preferred_strategy VARCHAR(64) NOT NULL DEFAULT 'PRESERVE_BOOKINGS',
    maximum_extra_budget INTEGER NOT NULL DEFAULT 2000,
    avoid_flights BOOLEAN NOT NULL DEFAULT FALSE,
    avoid_overnight BOOLEAN NOT NULL DEFAULT FALSE,
    avoid_long_transfers BOOLEAN NOT NULL DEFAULT TRUE,
    prefer_direct BOOLEAN NOT NULL DEFAULT FALSE,
    preserve_bookings BOOLEAN NOT NULL DEFAULT TRUE,
    fewest_transfers BOOLEAN NOT NULL DEFAULT FALSE,
    fastest BOOLEAN NOT NULL DEFAULT FALSE,
    cheapest BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 11. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    trip_id VARCHAR(64) NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    type VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(32) NOT NULL DEFAULT 'INFO',
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 12. AI CONVERSATIONS & MESSAGES
CREATE TABLE IF NOT EXISTS ai_conversations (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    trip_id VARCHAR(64) NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_messages (
    id VARCHAR(64) PRIMARY KEY,
    conversation_id VARCHAR(64) NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role VARCHAR(32) NOT NULL,
    content TEXT NOT NULL,
    action JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- PERFORMANCE & FOREIGN KEY INDEXES
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_segments_trip_seq ON trip_segments(trip_id, sequence);
CREATE INDEX IF NOT EXISTS idx_bookings_trip ON bookings(trip_id);
CREATE INDEX IF NOT EXISTS idx_transport_status_seg ON transport_status(segment_id);
CREATE INDEX IF NOT EXISTS idx_disruptions_trip_seg ON disruptions(trip_id, segment_id);
CREATE INDEX IF NOT EXISTS idx_impacts_trip_disrupt ON impacts(trip_id, disruption_id);
CREATE INDEX IF NOT EXISTS idx_recovery_plans_trip ON recovery_plans(trip_id);
CREATE INDEX IF NOT EXISTS idx_recovery_options_plan ON recovery_options(recovery_plan_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_trip ON notifications(user_id, trip_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_trip ON ai_conversations(trip_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conv ON ai_messages(conversation_id);
