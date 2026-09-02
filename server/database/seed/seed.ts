import { withTransaction } from '../../config/db';
import { fileURLToPath } from 'url';

export async function seedDatabase() {
  console.log('[PostgreSQL Seeder] Seeding database with initial demo data...');

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

    // 2. Insert Demo User
    await client.query(
      `INSERT INTO users (id, name, email, loyalty_tier)
       VALUES ($1, $2, $3, $4);`,
      ['TRV-88219', 'Arjun Mehta', 'arjun.mehta@example.com', 'Gold Priority']
    );

    // 3. Insert User Preferences
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

    // 4. Insert Demo Trip (Mumbai -> Pune -> Goa)
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

    // 5. Insert Trip Segments
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
        schedArr: '11:00 PM',
        expDep: '5:00 PM',
        expArr: '11:00 PM',
        status: 'ON_TIME',
        provider: 'MSRTC Shivneri Volvo Premium',
        serviceNumber: 'SHIV-8821',
        bookingId: 'BUS-GOA-77319',
        platform: 'Bay 3, Swargate',
        seat: 'Upper Berth U4',
        notes: 'AC Multi-Axle Volvo Sleeper.'
      },
      {
        id: 'seg-hotel-goa',
        tripId: 'trip-mum-pune-goa',
        seq: 3,
        type: 'HOTEL',
        title: 'Casa Ocean Retreat, Candolim',
        origin: 'Panaji / Candolim',
        destination: 'Casa Ocean Retreat',
        schedDep: '11:30 PM',
        schedArr: '11:59 PM',
        expDep: '11:30 PM',
        expArr: '11:59 PM',
        status: 'CONFIRMED',
        provider: 'Casa Ocean Retreat & Spa',
        serviceNumber: 'HTL-GOA-2024',
        bookingId: 'HTL-CONF-55102',
        platform: 'Front Desk',
        seat: 'Deluxe Sea View Suite',
        notes: 'Standard check-in until 11:30 PM. Late arrival policy applies.'
      },
      {
        id: 'seg-activity-scuba',
        tripId: 'trip-mum-pune-goa',
        seq: 4,
        type: 'ACTIVITY',
        title: 'Morning Scuba Diving Expedition',
        origin: 'Grande Island, Goa',
        destination: 'Grande Island, Goa',
        schedDep: '8:00 AM (Tomorrow)',
        schedArr: '12:00 PM (Tomorrow)',
        expDep: '8:00 AM (Tomorrow)',
        expArr: '12:00 PM (Tomorrow)',
        status: 'CONFIRMED',
        provider: 'Goa Aquatic Adventures',
        serviceNumber: 'ACT-SCUBA-01',
        bookingId: 'ACT-GOA-90124',
        platform: 'Jetty 2, Panaji',
        seat: 'Certified Diver Slot #4',
        notes: 'Requires arrival in Goa prior to 7:00 AM briefing.'
      }
    ];

    for (const s of segments) {
      await client.query(
        `INSERT INTO trip_segments (
          id, trip_id, sequence, segment_type, title, origin, destination,
          scheduled_departure, scheduled_arrival, expected_departure, expected_arrival,
          status, provider, service_number, booking_id, platform_or_terminal,
          seat_or_class, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18);`,
        [
          s.id,
          s.tripId,
          s.seq,
          s.type,
          s.title,
          s.origin,
          s.destination,
          s.schedDep,
          s.schedArr,
          s.expDep,
          s.expArr,
          s.status,
          s.provider,
          s.serviceNumber,
          s.bookingId,
          s.platform,
          s.seat,
          s.notes
        ]
      );

      // Add transport status record
      await client.query(
        `INSERT INTO transport_status (
          id, segment_id, status, delay_minutes, expected_departure, expected_arrival, source
        ) VALUES ($1, $2, $3, $4, $5, $6, $7);`,
        [
          `ts-${s.id}`,
          s.id,
          s.status,
          0,
          s.expDep,
          s.expArr,
          'DEMO_FEED'
        ]
      );
    }

    // 6. Insert Bookings
    const bookings = [
      {
        id: 'bk-train',
        tripId: 'trip-mum-pune-goa',
        segId: 'seg-train-12127',
        ref: 'PNR-9482910',
        provider: 'Indian Railways (IRCTC)',
        type: 'TRAIN',
        status: 'CONFIRMED',
        price: 680
      },
      {
        id: 'bk-bus',
        tripId: 'trip-mum-pune-goa',
        segId: 'seg-bus-pune-goa',
        ref: 'BUS-GOA-77319',
        provider: 'MSRTC Shivneri',
        type: 'BUS',
        status: 'CONFIRMED',
        price: 1250
      },
      {
        id: 'bk-hotel',
        tripId: 'trip-mum-pune-goa',
        segId: 'seg-hotel-goa',
        ref: 'HTL-CONF-55102',
        provider: 'Casa Ocean Retreat',
        type: 'HOTEL',
        status: 'CONFIRMED',
        price: 4500
      },
      {
        id: 'bk-activity',
        tripId: 'trip-mum-pune-goa',
        segId: 'seg-activity-scuba',
        ref: 'ACT-GOA-90124',
        provider: 'Goa Aquatic Adventures',
        type: 'ACTIVITY',
        status: 'CONFIRMED',
        price: 3200
      }
    ];

    for (const b of bookings) {
      await client.query(
        `INSERT INTO bookings (id, trip_id, segment_id, booking_reference, provider, booking_type, status, price, currency)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
        [b.id, b.tripId, b.segId, b.ref, b.provider, b.type, b.status, b.price, 'INR']
      );
    }

    // 7. Insert Initial Notifications
    const notifs = [
      {
        id: 'notif-welcome',
        userId: 'TRV-88219',
        tripId: 'trip-mum-pune-goa',
        type: 'INFO',
        title: 'Trip Monitoring Active',
        message: 'Active monitoring enabled for your Mumbai → Pune → Goa expedition. 4 legs secured.',
        severity: 'INFO'
      },
      {
        id: 'notif-buffer',
        userId: 'TRV-88219',
        tripId: 'trip-mum-pune-goa',
        type: 'BUFFER_ALERT',
        title: 'Pune Transfer Window: Safe',
        message: 'You have 3h 30m scheduled buffer between Deccan Express arrival and Shivneri bus departure.',
        severity: 'LOW'
      }
    ];

    for (const n of notifs) {
      await client.query(
        `INSERT INTO notifications (id, user_id, trip_id, type, title, message, severity, read)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
        [n.id, n.userId, n.tripId, n.type, n.title, n.message, n.severity, false]
      );
    }

    // 8. Insert AI Conversation initial entry
    await client.query(
      `INSERT INTO ai_conversations (id, user_id, trip_id)
       VALUES ($1, $2, $3);`,
      ['conv-mum-goa', 'TRV-88219', 'trip-mum-pune-goa']
    );

    await client.query(
      `INSERT INTO ai_messages (id, conversation_id, role, content)
       VALUES ($1, $2, $3, $4);`,
      [
        'msg-welcome',
        'conv-mum-goa',
        'assistant',
        'Hello Arjun! I am your AI Travel Guide. Your journey to Goa is currently on track. Train 12127 departs CSMT at 7:00 AM on time with a safe 3h 30m buffer in Pune.'
      ]
    );
  });

  console.log('[PostgreSQL Seeder] ✓ Demo data seeded successfully.');
}

// Allow direct execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase()
    .then(() => {
      console.log('[PostgreSQL Seeder] Completed.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[PostgreSQL Seeder] Seeding failed:', err);
      process.exit(1);
    });
}
