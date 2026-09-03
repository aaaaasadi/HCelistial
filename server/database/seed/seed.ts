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
        `INSERT INTO cities (id, name, state, region, latitude, longitude, tier, is_tourist_hub)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;`,
        [city.id, city.name, city.state, city.region, city.latitude, city.longitude, city.tier, city.isTouristHub]
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

    // 4. Seed Synthetic Trains (1,800+ Services)
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

    // 5. Seed Synthetic Buses (1,800+ Services)
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

    // 6. Seed Synthetic Flights (800+ Services)
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

    // 7. Seed Synthetic Hotels (1,200+ Hotels)
    for (const hotel of dataset.hotels) {
      await client.query(
        `INSERT INTO synthetic_hotels (
          id, hotel_name, city_id, city_name, area, latitude, longitude,
          rating, category, price_per_night, check_in_time, check_out_time,
          cancellation_policy, amenities, booking_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (id) DO UPDATE SET hotel_name = EXCLUDED.hotel_name;`,
        [
          hotel.id, hotel.hotelName, hotel.cityId, hotel.cityName, hotel.area,
          hotel.latitude, hotel.longitude, hotel.rating, hotel.category, hotel.pricePerNight,
          hotel.checkInTime, hotel.checkOutTime, hotel.cancellationPolicy, hotel.amenities, hotel.bookingStatus
        ]
      );
    }
    console.log(`[PostgreSQL Seeder] Seeded ${dataset.hotels.length} synthetic hotels.`);

    // 8. Seed Synthetic Activities (800+ Activities)
    for (const act of dataset.activities) {
      await client.query(
        `INSERT INTO synthetic_activities (
          id, activity_name, city_id, city_name, category, duration,
          start_time, end_time, price, popularity, booking_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO UPDATE SET activity_name = EXCLUDED.activity_name;`,
        [
          act.id, act.activityName, act.cityId, act.cityName, act.category, act.duration,
          act.startTime, act.endTime, act.price, act.popularity, act.bookingStatus
        ]
      );
    }
    console.log(`[PostgreSQL Seeder] Seeded ${dataset.activities.length} synthetic activities.`);

    // 9. Seed Disruption Scenarios (100+ Scenarios)
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

    // 10. Insert Demo User (Arjun Mehta)
    await client.query(
      `INSERT INTO users (id, name, email, loyalty_tier)
       VALUES ($1, $2, $3, $4);`,
      ['TRV-88219', 'Arjun Mehta', 'arjun.mehta@example.com', 'Gold Priority']
    );

    // 11. Insert User Preferences
    await client.query(
      `INSERT INTO user_preferences (
        id, user_id, preferred_strategy, maximum_extra_budget,
        avoid_flights, avoid_overnight, avoid_long_transfers,
        prefer_direct, preserve_bookings, fewest_transfers, fastest, cheapest
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`,
      [
        'pref-arjun',
        'TRV-88219',
        'PRESERVE_BOOKINGS',
        2000,
        false,
        false,
        true,
        false,
        true,
        false,
        false,
        false
      ]
    );

    // 12. Insert Hero Demo Trip (Mumbai -> Pune -> Goa)
    await client.query(
      `INSERT INTO trips (id, user_id, title, origin, destination, start_time, end_time, status, journey_health)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
      [
        'trip-mum-pune-goa',
        'TRV-88219',
        'Mumbai → Pune → Goa Weekend Expedition',
        'Mumbai CSMT',
        'Panaji, Goa',
        'Today, 7:00 AM',
        'Tomorrow, 12:00 PM',
        'ON_TRACK',
        95
      ]
    );

    // 13. Insert Trip Segments
    const segments = [
      {
        id: 'seg-train-12127',
        tripId: 'trip-mum-pune-goa',
        seq: 1,
        type: 'TRAIN',
        title: 'Mumbai CSMT → Pune Jn (Deccan Express 12127)',
        origin: 'Mumbai CSMT',
        destination: 'Pune Junction',
        schedDep: '7:00 AM',
        schedArr: '1:30 PM',
        expDep: '7:00 AM',
        expArr: '1:30 PM',
        status: 'ON_TIME',
        provider: 'Indian Railways (IRCTC)',
        serviceNumber: '12127',
        bookingId: 'PNR-9482910',
        platform: 'Platform 8, CSMT',
        seat: 'Coach C2, Seat 44 (AC Chair Car)',
        notes: 'Confirmed e-Ticket. Feeder link to Pune.'
      },
      {
        id: 'seg-bus-pune-goa',
        tripId: 'trip-mum-pune-goa',
        seq: 2,
        type: 'BUS',
        title: 'Pune Swargate → Panaji, Goa (MSRTC Shivneri Volvo)',
        origin: 'Pune Swargate Bus Terminal',
        destination: 'Panaji (Goa)',
        schedDep: '5:00 PM',
        schedArr: '11:30 PM',
        expDep: '5:00 PM',
        expArr: '11:30 PM',
        status: 'ON_TIME',
        provider: 'MSRTC Shivneri Luxury',
        serviceNumber: 'MH-12-RN-4821',
        bookingId: 'BUS-892184',
        platform: 'Bay 4, Swargate',
        seat: 'Seat 14 (Window, Upper Deck)',
        notes: 'Express highway transit via NH48.'
      },
      {
        id: 'seg-hotel-goa',
        tripId: 'trip-mum-pune-goa',
        seq: 3,
        type: 'HOTEL',
        title: 'Check-in: Taj Cidade de Goa Heritage Resort',
        origin: 'Vainguinim Beach',
        destination: 'Panaji, Goa',
        schedDep: 'Tomorrow, 2:00 PM',
        schedArr: 'Day 3, 11:00 AM',
        expDep: 'Tomorrow, 2:00 PM',
        expArr: 'Day 3, 11:00 AM',
        status: 'ON_TIME',
        provider: 'Taj Hotels Resorts & Palaces',
        serviceNumber: 'RES-99382',
        bookingId: 'HTL-382910',
        platform: 'Vainguinim Beach Road',
        seat: 'Deluxe Sea View Suite (King Bed)',
        notes: 'Non-refundable booking. Late check-in window ends at 11:30 PM.'
      },
      {
        id: 'seg-activity-scuba',
        tripId: 'trip-mum-pune-goa',
        seq: 4,
        type: 'ACTIVITY',
        title: 'Grand Island Scuba Diving & Snorkeling Expedition',
        origin: 'Sinquerim Jetty',
        destination: 'Grand Island, Goa',
        schedDep: 'Tomorrow, 8:30 AM',
        schedArr: 'Tomorrow, 1:30 PM',
        expDep: 'Tomorrow, 8:30 AM',
        expArr: 'Tomorrow, 1:30 PM',
        status: 'ON_TIME',
        provider: 'Goa Aquatics & Marine Adventure Co.',
        serviceNumber: 'ACT-DIVE-04',
        bookingId: 'ACT-482918',
        platform: 'Boat Slip #2, Sinquerim',
        seat: 'Slot #4 (Includes Equipment & Dive Master)',
        notes: 'PADI certified instructor session. Strict departure at 8:30 AM.'
      }
    ];

    for (const s of segments) {
      await client.query(
        `INSERT INTO trip_segments (
          id, trip_id, sequence, segment_type, title, origin, destination,
          scheduled_departure, scheduled_arrival, expected_departure, expected_arrival,
          status, provider, service_number, booking_id, platform_or_terminal,
          seat_or_class, is_disrupted, delay_minutes, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20);`,
        [
          s.id, s.tripId, s.seq, s.type, s.title, s.origin, s.destination,
          s.schedDep, s.schedArr, s.expDep, s.expArr, s.status, s.provider,
          s.serviceNumber, s.bookingId, s.platform, s.seat, false, 0, s.notes
        ]
      );
    }

    // 14. Insert Bookings
    const bookings = [
      { id: 'bkg-train-1', tripId: 'trip-mum-pune-goa', segmentId: 'seg-train-12127', ref: 'PNR-9482910', provider: 'Indian Railways (IRCTC)', type: 'TRAIN_TICKET', price: 240 },
      { id: 'bkg-bus-1', tripId: 'trip-mum-pune-goa', segmentId: 'seg-bus-pune-goa', ref: 'BUS-892184', provider: 'MSRTC Shivneri', type: 'BUS_TICKET', price: 850 },
      { id: 'bkg-hotel-1', tripId: 'trip-mum-pune-goa', segmentId: 'seg-hotel-goa', ref: 'HTL-382910', provider: 'Taj Cidade de Goa', type: 'HOTEL_RESERVATION', price: 9200 },
      { id: 'bkg-act-1', tripId: 'trip-mum-pune-goa', segmentId: 'seg-activity-scuba', ref: 'ACT-482918', provider: 'Goa Aquatics Co.', type: 'TOUR_PASS', price: 3500 }
    ];

    for (const b of bookings) {
      await client.query(
        `INSERT INTO bookings (id, trip_id, segment_id, booking_reference, provider, booking_type, status, price, currency)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
        [b.id, b.tripId, b.segmentId, b.ref, b.provider, b.type, 'CONFIRMED', b.price, 'INR']
      );
    }
  });

  console.log('[PostgreSQL Seeder] ✅ Database seeded successfully with entire synthetic relational dataset!');
}

// Allow direct CLI execution: npx tsx server/database/seed/seed.ts
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[PostgreSQL Seeder] Seed failed:', err);
      process.exit(1);
    });
}
