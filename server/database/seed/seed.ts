import { withTransaction } from '../../config/db';
import { fileURLToPath } from 'url';
import { SyntheticTravelDataset } from '../../services/dataset/syntheticDatasetGenerator';

export async function seedDatabase() {
  console.log('[PostgreSQL Seeder] Seeding database with large relational travel dataset...');

  const dataset = SyntheticTravelDataset.getInstance();

  await withTransaction(async (client) => {
    // 1. Clear existing demo records
    await client.query('DELETE FROM ai_messages;');
    await client.query('DELETE FROM ai_conversations;');
    await client.query('DELETE FROM notifications;');
    await client.query('DELETE FROM recovery_options;');
    await client.query('DELETE FROM recovery_plans;');
    await client.query('DELETE FROM impacts;');
    await client.query('DELETE FROM disruptions;');
    await client.query('DELETE FROM transport_status;');
    await client.query('DELETE FROM bookings;');
    await client.query('DELETE FROM trip_segments;');
    await client.query('DELETE FROM trips;');
    await client.query('DELETE FROM user_preferences;');
    await client.query('DELETE FROM users;');

    // Clear synthetic tables if they exist
    await client.query('DELETE FROM disruption_scenarios WHERE true;');
    await client.query('DELETE FROM popular_journeys WHERE true;');
    await client.query('DELETE FROM synthetic_activities WHERE true;');
    await client.query('DELETE FROM synthetic_hotels WHERE true;');
    await client.query('DELETE FROM synthetic_flights WHERE true;');
    await client.query('DELETE FROM synthetic_buses WHERE true;');
    await client.query('DELETE FROM synthetic_trains WHERE true;');
    await client.query('DELETE FROM stations WHERE true;');
    await client.query('DELETE FROM cities WHERE true;');

    // 2. Seed Cities (120+ Cities)
    for (const city of dataset.cities) {
      await client.query(
        `INSERT INTO cities (
          id, name, state, country, region, latitude, longitude, destination_type,
          tier, is_tourist_hub, description, short_description, popularity_score,
          best_time_to_visit, average_stay_days, budget_level, tags, data_source
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;`,
        [
          city.id, city.name, city.state, city.country, city.region, city.latitude,
          city.longitude, city.destinationType, city.tier, city.isTouristHub,
          city.description, city.shortDescription, city.popularityScore,
          city.bestTimeToVisit, city.averageStayDays, city.budgetLevel,
          city.tags.join(', '), city.dataSource
        ]
      );
    }
    console.log(`[PostgreSQL Seeder] Seeded ${dataset.cities.length} cities.`);

    // 3. Seed Stations & Airports (300+ Hubs)
    for (const stn of dataset.stations) {
      await client.query(
        `INSERT INTO stations (id, station_code, station_name, city_id, city_name, state, latitude, longitude, station_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO UPDATE SET station_name = EXCLUDED.station_name;`,
        [stn.id, stn.stationCode, stn.stationName, stn.cityId, stn.cityName, stn.state, stn.latitude, stn.longitude, stn.stationType]
      );
    }
    console.log(`[PostgreSQL Seeder] Seeded ${dataset.stations.length} stations and airports.`);

    // 4. Seed Popular Journeys (40+ Corridors)
    for (const pj of dataset.popularJourneys) {
      await client.query(
        `INSERT INTO popular_journeys (
          id, origin_city_id, origin_city_name, dest_city_id, dest_city_name,
          title, description, popularity_score, estimated_duration, recommended_days,
          travel_style, approximate_budget, available_transport_types, tags, featured, data_source
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
        [
          pj.id, pj.originCityId, pj.originCityName, pj.destCityId, pj.destCityName,
          pj.title, pj.description, pj.popularityScore, pj.estimatedDuration, pj.recommendedDays,
          pj.travelStyle, pj.approximateBudget, pj.availableTransportTypes.join(', '),
          pj.tags.join(', '), pj.featured, pj.dataSource
        ]
      );
    }
    console.log(`[PostgreSQL Seeder] Seeded ${dataset.popularJourneys.length} popular travel corridors.`);

    // 5. Seed Synthetic Trains (1,800+ Services)
    for (const train of dataset.trains) {
      await client.query(
        `INSERT INTO synthetic_trains (
          id, train_number, train_name, operator, origin_station_code, origin_station_name,
          dest_station_code, dest_station_name, departure_time, arrival_time, duration,
          operating_days, train_type, classes, fare, available_seats, status, platform, data_source
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        ON CONFLICT (id) DO UPDATE SET train_name = EXCLUDED.train_name;`,
        [
          train.id, train.trainNumber, train.trainName, train.operator, train.originStationCode,
          train.originStationName, train.destStationCode, train.destStationName, train.departureTime,
          train.arrivalTime, train.duration, train.operatingDays, train.trainType, train.classes,
          train.fare, train.availableSeats, train.status, train.platform, train.dataSource
        ]
      );
    }
    console.log(`[PostgreSQL Seeder] Seeded ${dataset.trains.length} synthetic train services.`);

    // 6. Seed Synthetic Buses (1,800+ Services)
    for (const bus of dataset.buses) {
      await client.query(
        `INSERT INTO synthetic_buses (
          id, service_number, operator, bus_type, origin_city, origin_terminal,
          dest_city, dest_terminal, departure_time, arrival_time, duration,
          operating_days, fare, available_seats, status, bay, amenities, data_source
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        ON CONFLICT (id) DO UPDATE SET operator = EXCLUDED.operator;`,
        [
          bus.id, bus.serviceNumber, bus.operator, bus.busType, bus.originCity,
          bus.originTerminal, bus.destCity, bus.destTerminal, bus.departureTime,
          bus.arrivalTime, bus.duration, bus.operatingDays, bus.fare, bus.availableSeats,
          bus.status, bus.bay, bus.amenities, bus.dataSource
        ]
      );
    }
    console.log(`[PostgreSQL Seeder] Seeded ${dataset.buses.length} synthetic bus services.`);

    // 7. Seed Synthetic Flights (800+ Services)
    for (const flt of dataset.flights) {
      await client.query(
        `INSERT INTO synthetic_flights (
          id, flight_number, airline, origin_airport_code, origin_city,
          dest_airport_code, dest_city, departure_time, arrival_time, duration,
          aircraft, fare, available_seats, status, terminal, gate, seat_class, data_source
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        ON CONFLICT (id) DO UPDATE SET airline = EXCLUDED.airline;`,
        [
          flt.id, flt.flightNumber, flt.airline, flt.originAirportCode, flt.originCity,
          flt.destAirportCode, flt.destCity, flt.departureTime, flt.arrivalTime, flt.duration,
          flt.aircraft, flt.fare, flt.availableSeats, flt.status, flt.terminal, flt.gate,
          flt.seatClass, flt.dataSource
        ]
      );
    }
    console.log(`[PostgreSQL Seeder] Seeded ${dataset.flights.length} synthetic flight services.`);

    // 8. Seed Synthetic Hotels (1,200+ Hotels)
    for (const hotel of dataset.hotels) {
      await client.query(
        `INSERT INTO synthetic_hotels (
          id, hotel_name, city_id, city_name, area, address, latitude, longitude,
          rating, review_count, category, price_per_night, currency, check_in_time, check_out_time,
          cancellation_policy, amenities, room_types, availability_status, popularity_score,
          description, tags, data_source
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
        ON CONFLICT (id) DO UPDATE SET hotel_name = EXCLUDED.hotel_name;`,
        [
          hotel.id, hotel.hotelName, hotel.cityId, hotel.cityName, hotel.area, hotel.address,
          hotel.latitude, hotel.longitude, hotel.rating, hotel.reviewCount, hotel.category,
          hotel.pricePerNight, hotel.currency, hotel.checkInTime, hotel.checkOutTime,
          hotel.cancellationPolicy, hotel.amenities.join(', '), hotel.roomTypes.join(', '),
          hotel.availabilityStatus, hotel.popularityScore, hotel.description,
          hotel.tags.join(', '), hotel.dataSource
        ]
      );
    }
    console.log(`[PostgreSQL Seeder] Seeded ${dataset.hotels.length} synthetic hotels.`);

    // 9. Seed Synthetic Activities (800+ Activities)
    for (const act of dataset.activities) {
      await client.query(
        `INSERT INTO synthetic_activities (
          id, activity_name, city_id, city_name, category, description, duration,
          start_time, end_time, price, currency, popularity_score, rating,
          best_time, booking_required, family_friendly, indoor_outdoor, tags, data_source
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        ON CONFLICT (id) DO UPDATE SET activity_name = EXCLUDED.activity_name;`,
        [
          act.id, act.activityName, act.cityId, act.cityName, act.category, act.description,
          act.duration, act.startTime, act.endTime, act.price, act.currency,
          act.popularityScore, act.rating, act.bestTime, act.bookingRequired,
          act.familyFriendly, act.indoorOutdoor, act.tags.join(', '), act.dataSource
        ]
      );
    }
    console.log(`[PostgreSQL Seeder] Seeded ${dataset.activities.length} synthetic activities.`);

    // 10. Seed Disruption Scenarios (100+ Scenarios)
    for (const disc of dataset.disruptionScenarios) {
      await client.query(
        `INSERT INTO disruption_scenarios (
          id, title, route, disruption_type, severity, delay_minutes, reason, description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
        [disc.id, disc.title, disc.route, disc.disruptionType, disc.severity, disc.delayMinutes, disc.reason, disc.description]
      );
    }
    console.log(`[PostgreSQL Seeder] Seeded ${dataset.disruptionScenarios.length} disruption scenarios.`);

    // 11. Insert Demo User (Arjun Mehta)
    await client.query(
      `INSERT INTO users (id, name, email, loyalty_tier)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;`,
      ['TRV-88219', 'Arjun Mehta', 'arjun.mehta@example.com', 'Gold Priority']
    );

    // 12. Insert User Preferences
    await client.query(
      `INSERT INTO user_preferences (
        id, user_id, preferred_strategy, maximum_extra_budget,
        avoid_flights, avoid_overnight, avoid_long_transfers,
        prefer_direct, preserve_bookings, fewest_transfers, fastest, cheapest
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (id) DO UPDATE SET preferred_strategy = EXCLUDED.preferred_strategy;`,
      [
        'pref-arjun',
        'TRV-88219',
        'PRESERVE_BOOKINGS',
        2000,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false
      ]
    );

    // 13. Seed Hero Demo Trip
    await client.query(
      `INSERT INTO trips (
        id, user_id, title, origin, destination, status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
      ['TRIP-DEMO-001', 'TRV-88219', 'Mumbai to Goa Expedition', 'Mumbai CSMT', 'North Goa', 'ON_TRACK']
    );

    console.log('[PostgreSQL Seeder] Successfully finished seeding complete relational travel dataset.');
  });
}

// Direct execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase()
    .then(() => {
      console.log('[PostgreSQL Seeder] Completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[PostgreSQL Seeder] Seeder error:', err);
      process.exit(1);
    });
}
