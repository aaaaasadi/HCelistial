export const FLIGHT_FIXTURES = {
  standbyFlights: [
    {
      id: 'flight-6e-5128',
      airline_name: 'IndiGo Airlines',
      flight_number: '6E-5128',
      origin: 'BOM (Mumbai T2)',
      destination: 'GOI (Dabolim, Goa)',
      departure_time: '8:15 PM',
      arrival_time: '9:30 PM',
      price: 3900,
      available_seats: 3,
      seat_class: 'Economy (Emergency Standby)',
      terminal: '2',
      flight_status: 'scheduled',
      aircraft: 'Airbus A320neo'
    },
    {
      id: 'flight-ai-681',
      airline_name: 'Air India',
      flight_number: 'AI-681',
      origin: 'BOM (Mumbai T2)',
      destination: 'GOX (Mopa, Goa)',
      departure_time: '9:45 PM',
      arrival_time: '11:00 PM',
      price: 4450,
      available_seats: 5,
      seat_class: 'Economy (Flexible)',
      terminal: '2',
      flight_status: 'scheduled',
      aircraft: 'Airbus A321'
    }
  ],
  liveStatus6E5128: {
    flight_number: '6E-5128',
    airline_name: 'IndiGo Airlines',
    departure_airport: 'BOM',
    arrival_airport: 'GOI',
    flight_status: 'active',
    departure_delay: 0,
    scheduled_departure: '8:15 PM',
    scheduled_arrival: '9:30 PM',
    expected_departure: '8:15 PM',
    expected_arrival: '9:30 PM',
    terminal: '2',
    gate: '42B'
  }
};
