-- TravelRescue Large Synthetic Travel Dataset Migration
-- PostgreSQL 18 Compatible Migration

-- 1. CITIES & DESTINATIONS (100-150 Cities across India)
CREATE TABLE IF NOT EXISTS cities (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    state VARCHAR(128) NOT NULL,
    country VARCHAR(64) NOT NULL DEFAULT 'India',
    region VARCHAR(64) NOT NULL, -- 'West', 'North', 'South', 'East', 'Central', 'NorthEast'
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    destination_type VARCHAR(64) NOT NULL DEFAULT 'CITY', -- 'METRO', 'BEACH', 'HILL_STATION', 'HERITAGE', 'PILGRIMAGE', 'ADVENTURE', 'NATURE', 'WILDLIFE', 'COASTAL', 'CULTURAL'
    tier VARCHAR(16) NOT NULL DEFAULT 'Tier-2',
    is_tourist_hub BOOLEAN DEFAULT FALSE,
    description TEXT,
    short_description VARCHAR(255),
    popularity_score INTEGER NOT NULL DEFAULT 85,
    best_time_to_visit VARCHAR(128) DEFAULT 'October to March',
    average_stay_days INTEGER NOT NULL DEFAULT 3,
    budget_level VARCHAR(64) DEFAULT 'Moderate (₹3,000 - ₹6,000 / day)',
    tags TEXT,
    data_source VARCHAR(64) NOT NULL DEFAULT 'VERIFIED_DESTINATION',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cities_name ON cities(name);
CREATE INDEX IF NOT EXISTS idx_cities_state ON cities(state);
CREATE INDEX IF NOT EXISTS idx_cities_region ON cities(region);
CREATE INDEX IF NOT EXISTS idx_cities_type ON cities(destination_type);
CREATE INDEX IF NOT EXISTS idx_cities_popularity ON cities(popularity_score);

-- 2. STATIONS & AIRPORTS & BUS TERMINALS (300+ Hubs)
CREATE TABLE IF NOT EXISTS stations (
    id VARCHAR(64) PRIMARY KEY,
    station_code VARCHAR(16) NOT NULL UNIQUE,
    station_name VARCHAR(255) NOT NULL,
    city_id VARCHAR(64) REFERENCES cities(id) ON DELETE CASCADE,
    city_name VARCHAR(255) NOT NULL,
    state VARCHAR(128) NOT NULL,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    station_type VARCHAR(64) NOT NULL, -- 'RAILWAY_JUNCTION', 'AIRPORT', 'BUS_TERMINAL', 'METRO_STATION'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_stations_code ON stations(station_code);
CREATE INDEX IF NOT EXISTS idx_stations_city ON stations(city_name);
CREATE INDEX IF NOT EXISTS idx_stations_type ON stations(station_type);

-- 3. POPULAR JOURNEYS / TRAVEL ROUTES
CREATE TABLE IF NOT EXISTS popular_journeys (
    id VARCHAR(64) PRIMARY KEY,
    origin_city_id VARCHAR(64) REFERENCES cities(id) ON DELETE CASCADE,
    origin_city_name VARCHAR(255) NOT NULL,
    dest_city_id VARCHAR(64) REFERENCES cities(id) ON DELETE CASCADE,
    dest_city_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    popularity_score INTEGER NOT NULL DEFAULT 90,
    estimated_duration VARCHAR(64) NOT NULL,
    recommended_days INTEGER NOT NULL DEFAULT 3,
    travel_style VARCHAR(64) NOT NULL DEFAULT 'Multimodal Scenic',
    approximate_budget NUMERIC(10, 2) NOT NULL DEFAULT 4500,
    available_transport_types VARCHAR(128) NOT NULL DEFAULT 'TRAIN, BUS, FLIGHT',
    tags TEXT,
    featured BOOLEAN DEFAULT TRUE,
    data_source VARCHAR(64) NOT NULL DEFAULT 'VERIFIED_CORRIDOR',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_popular_journeys_origin ON popular_journeys(origin_city_id);
CREATE INDEX IF NOT EXISTS idx_popular_journeys_dest ON popular_journeys(dest_city_id);
CREATE INDEX IF NOT EXISTS idx_popular_journeys_featured ON popular_journeys(featured);

-- 4. SYNTHETIC TRAINS (1,800+ Services)
CREATE TABLE IF NOT EXISTS synthetic_trains (
    id VARCHAR(64) PRIMARY KEY,
    train_number VARCHAR(32) NOT NULL,
    train_name VARCHAR(255) NOT NULL,
    operator VARCHAR(255) NOT NULL,
    origin_station_code VARCHAR(16) NOT NULL,
    origin_station_name VARCHAR(255) NOT NULL,
    dest_station_code VARCHAR(16) NOT NULL,
    dest_station_name VARCHAR(255) NOT NULL,
    departure_time VARCHAR(16) NOT NULL,
    arrival_time VARCHAR(16) NOT NULL,
    duration VARCHAR(32) NOT NULL,
    operating_days VARCHAR(64) NOT NULL DEFAULT 'DAILY',
    train_type VARCHAR(64) NOT NULL, -- 'SUPERFAST', 'EXPRESS', 'JAN_SHATABDI', 'INTERCITY', 'VANDE_BHARAT', 'TEJAS', 'DURONTO', 'PASSENGER'
    classes VARCHAR(128) NOT NULL DEFAULT '2S, SL, 3A, 2A, CC',
    fare NUMERIC(10, 2) NOT NULL,
    available_seats INTEGER NOT NULL DEFAULT 45,
    status VARCHAR(32) NOT NULL DEFAULT 'ON_TIME',
    platform VARCHAR(32) DEFAULT 'Platform 1',
    data_source VARCHAR(64) NOT NULL DEFAULT 'SYNTHETIC_SIMULATOR',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_trains_route ON synthetic_trains(origin_station_code, dest_station_code);
CREATE INDEX IF NOT EXISTS idx_trains_names ON synthetic_trains(origin_station_name, dest_station_name);
CREATE INDEX IF NOT EXISTS idx_trains_number ON synthetic_trains(train_number);
CREATE INDEX IF NOT EXISTS idx_trains_type ON synthetic_trains(train_type);

-- 5. SYNTHETIC BUSES (1,800+ Services)
CREATE TABLE IF NOT EXISTS synthetic_buses (
    id VARCHAR(64) PRIMARY KEY,
    service_number VARCHAR(64) NOT NULL,
    operator VARCHAR(255) NOT NULL,
    bus_type VARCHAR(128) NOT NULL, -- 'AC Sleeper', 'Volvo Multi-Axle', 'AC Seater', 'Non-AC Sleeper', 'Electric Luxury EV'
    origin_city VARCHAR(255) NOT NULL,
    origin_terminal VARCHAR(255) NOT NULL,
    dest_city VARCHAR(255) NOT NULL,
    dest_terminal VARCHAR(255) NOT NULL,
    departure_time VARCHAR(16) NOT NULL,
    arrival_time VARCHAR(16) NOT NULL,
    duration VARCHAR(32) NOT NULL,
    operating_days VARCHAR(64) NOT NULL DEFAULT 'DAILY',
    fare NUMERIC(10, 2) NOT NULL,
    available_seats INTEGER NOT NULL DEFAULT 20,
    status VARCHAR(32) NOT NULL DEFAULT 'ON_TIME',
    bay VARCHAR(32) DEFAULT 'Bay 1',
    amenities TEXT,
    data_source VARCHAR(64) NOT NULL DEFAULT 'SYNTHETIC_SIMULATOR',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_buses_route ON synthetic_buses(origin_city, dest_city);
CREATE INDEX IF NOT EXISTS idx_buses_service ON synthetic_buses(service_number);
CREATE INDEX IF NOT EXISTS idx_buses_operator ON synthetic_buses(operator);

-- 6. SYNTHETIC FLIGHTS (800+ Services)
CREATE TABLE IF NOT EXISTS synthetic_flights (
    id VARCHAR(64) PRIMARY KEY,
    flight_number VARCHAR(32) NOT NULL,
    airline VARCHAR(255) NOT NULL,
    origin_airport_code VARCHAR(16) NOT NULL,
    origin_city VARCHAR(255) NOT NULL,
    dest_airport_code VARCHAR(16) NOT NULL,
    dest_city VARCHAR(255) NOT NULL,
    departure_time VARCHAR(16) NOT NULL,
    arrival_time VARCHAR(16) NOT NULL,
    duration VARCHAR(32) NOT NULL,
    aircraft VARCHAR(64) DEFAULT 'Airbus A321neo',
    fare NUMERIC(10, 2) NOT NULL,
    available_seats INTEGER NOT NULL DEFAULT 15,
    status VARCHAR(32) NOT NULL DEFAULT 'ON_TIME',
    terminal VARCHAR(32) DEFAULT 'Terminal 2',
    gate VARCHAR(32) DEFAULT 'Gate 12',
    seat_class VARCHAR(64) DEFAULT 'Economy Flex',
    data_source VARCHAR(64) NOT NULL DEFAULT 'SYNTHETIC_SIMULATOR',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_flights_route ON synthetic_flights(origin_airport_code, dest_airport_code);
CREATE INDEX IF NOT EXISTS idx_flights_cities ON synthetic_flights(origin_city, dest_city);
CREATE INDEX IF NOT EXISTS idx_flights_number ON synthetic_flights(flight_number);

-- 7. SYNTHETIC HOTELS (1,200+ Properties)
CREATE TABLE IF NOT EXISTS synthetic_hotels (
    id VARCHAR(64) PRIMARY KEY,
    hotel_name VARCHAR(255) NOT NULL,
    city_id VARCHAR(64) REFERENCES cities(id) ON DELETE CASCADE,
    city_name VARCHAR(255) NOT NULL,
    area VARCHAR(255) NOT NULL,
    address TEXT,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.2,
    review_count INTEGER NOT NULL DEFAULT 150,
    category VARCHAR(64) NOT NULL, -- 'BUDGET', 'MID_RANGE', 'PREMIUM', 'LUXURY', 'RESORT', 'HERITAGE_PALACE', 'BOUTIQUE'
    price_per_night NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(16) NOT NULL DEFAULT 'INR',
    check_in_time VARCHAR(16) NOT NULL DEFAULT '02:00 PM',
    check_out_time VARCHAR(16) NOT NULL DEFAULT '11:00 AM',
    cancellation_policy VARCHAR(255) DEFAULT 'Free cancellation up to 24 hours prior',
    amenities TEXT,
    room_types VARCHAR(255) DEFAULT 'Deluxe King, Executive Sea View, Garden Villa',
    availability_status VARCHAR(32) DEFAULT 'AVAILABLE',
    popularity_score INTEGER NOT NULL DEFAULT 85,
    description TEXT,
    tags TEXT,
    data_source VARCHAR(64) NOT NULL DEFAULT 'VERIFIED_HOTEL_GDS',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_hotels_city ON synthetic_hotels(city_id);
CREATE INDEX IF NOT EXISTS idx_hotels_category ON synthetic_hotels(category);
CREATE INDEX IF NOT EXISTS idx_hotels_rating ON synthetic_hotels(rating);
CREATE INDEX IF NOT EXISTS idx_hotels_price ON synthetic_hotels(price_per_night);

-- 8. SYNTHETIC ACTIVITIES (800+ Activities)
CREATE TABLE IF NOT EXISTS synthetic_activities (
    id VARCHAR(64) PRIMARY KEY,
    activity_name VARCHAR(255) NOT NULL,
    city_id VARCHAR(64) REFERENCES cities(id) ON DELETE CASCADE,
    city_name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL, -- 'SIGHTSEEING', 'BEACH', 'ADVENTURE', 'NATURE', 'CULTURAL', 'HISTORY', 'MUSEUM', 'FOOD', 'SHOPPING', 'NIGHTLIFE', 'SPIRITUAL'
    description TEXT,
    duration VARCHAR(32) NOT NULL DEFAULT '3h 00m',
    start_time VARCHAR(16) NOT NULL DEFAULT '04:00 PM',
    end_time VARCHAR(16) NOT NULL DEFAULT '07:00 PM',
    price NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(16) NOT NULL DEFAULT 'INR',
    popularity_score INTEGER NOT NULL DEFAULT 88,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.5,
    best_time VARCHAR(64) DEFAULT 'Morning & Sunset',
    booking_required BOOLEAN DEFAULT TRUE,
    family_friendly BOOLEAN DEFAULT TRUE,
    indoor_outdoor VARCHAR(32) DEFAULT 'OUTDOOR',
    tags TEXT,
    data_source VARCHAR(64) NOT NULL DEFAULT 'VERIFIED_EXPERIENCE',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_activities_city ON synthetic_activities(city_id);
CREATE INDEX IF NOT EXISTS idx_activities_category ON synthetic_activities(category);
CREATE INDEX IF NOT EXISTS idx_activities_popularity ON synthetic_activities(popularity_score);

-- 9. DISRUPTION SCENARIOS (100+ Scenarios)
CREATE TABLE IF NOT EXISTS disruption_scenarios (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    route VARCHAR(255) NOT NULL,
    disruption_type VARCHAR(64) NOT NULL, -- 'TRAIN_DELAY', 'BUS_BREAKDOWN', 'FLIGHT_CANCELLATION', 'SIGNAL_FAILURE', 'WEATHER_FOG'
    severity VARCHAR(32) NOT NULL DEFAULT 'HIGH',
    delay_minutes INTEGER NOT NULL DEFAULT 60,
    reason TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
