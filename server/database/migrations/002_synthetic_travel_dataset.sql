-- TravelRescue Large Synthetic Travel Dataset Migration
-- PostgreSQL 18 Compatible Migration

-- 1. CITIES (100-150 Cities across India)
CREATE TABLE IF NOT EXISTS cities (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    state VARCHAR(128) NOT NULL,
    region VARCHAR(64) NOT NULL,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    tier VARCHAR(16) NOT NULL DEFAULT 'Tier-2',
    is_tourist_hub BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cities_name ON cities(name);
CREATE INDEX IF NOT EXISTS idx_cities_state ON cities(state);
CREATE INDEX IF NOT EXISTS idx_cities_region ON cities(region);

-- 2. STATIONS & AIRPORTS & BUS TERMINALS (250-500 Hubs)
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

-- 3. SYNTHETIC TRAINS (1,000-3,000 Services)
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
    train_type VARCHAR(64) NOT NULL, -- 'SUPERFAST', 'EXPRESS', 'JAN_SHATABDI', 'INTERCITY', 'VANDE_BHARAT', 'PASSENGER', 'SPECIAL'
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

-- 4. SYNTHETIC BUSES (1,000-3,000 Services)
CREATE TABLE IF NOT EXISTS synthetic_buses (
    id VARCHAR(64) PRIMARY KEY,
    service_number VARCHAR(64) NOT NULL,
    operator VARCHAR(255) NOT NULL,
    bus_type VARCHAR(128) NOT NULL, -- 'AC Sleeper', 'Volvo Multi-Axle', 'AC Seater', 'Non-AC Sleeper', 'Electric Luxury'
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

-- 5. SYNTHETIC FLIGHTS (500-1,500 Services)
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

-- 6. SYNTHETIC HOTELS (1,000-3,000 Properties)
CREATE TABLE IF NOT EXISTS synthetic_hotels (
    id VARCHAR(64) PRIMARY KEY,
    hotel_name VARCHAR(255) NOT NULL,
    city_id VARCHAR(64) REFERENCES cities(id) ON DELETE CASCADE,
    city_name VARCHAR(255) NOT NULL,
    area VARCHAR(255) NOT NULL,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.2,
    category VARCHAR(64) NOT NULL, -- 'Budget', 'Mid-range', 'Premium', 'Luxury'
    price_per_night NUMERIC(10, 2) NOT NULL,
    check_in_time VARCHAR(16) NOT NULL DEFAULT '02:00 PM',
    check_out_time VARCHAR(16) NOT NULL DEFAULT '11:00 AM',
    cancellation_policy VARCHAR(255) DEFAULT 'Free cancellation up to 24 hours prior',
    amenities TEXT,
    booking_status VARCHAR(32) DEFAULT 'AVAILABLE',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_hotels_city ON synthetic_hotels(city_name);
CREATE INDEX IF NOT EXISTS idx_hotels_category ON synthetic_hotels(category);

-- 7. SYNTHETIC ACTIVITIES (500-1,500 Activities)
CREATE TABLE IF NOT EXISTS synthetic_activities (
    id VARCHAR(64) PRIMARY KEY,
    activity_name VARCHAR(255) NOT NULL,
    city_id VARCHAR(64) REFERENCES cities(id) ON DELETE CASCADE,
    city_name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL, -- 'Sightseeing', 'Beach', 'Adventure', 'Museum', 'Food', 'Nature', 'Cultural', 'Shopping', 'Entertainment'
    duration VARCHAR(32) NOT NULL DEFAULT '3h 00m',
    start_time VARCHAR(16) NOT NULL DEFAULT '04:00 PM',
    end_time VARCHAR(16) NOT NULL DEFAULT '07:00 PM',
    price NUMERIC(10, 2) NOT NULL,
    popularity NUMERIC(3, 2) NOT NULL DEFAULT 4.5,
    booking_status VARCHAR(32) DEFAULT 'AVAILABLE',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_activities_city ON synthetic_activities(city_name);
CREATE INDEX IF NOT EXISTS idx_activities_category ON synthetic_activities(category);

-- 8. DISRUPTION SCENARIOS (100+ Scenarios)
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
