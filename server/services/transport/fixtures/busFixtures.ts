export const BUS_FIXTURES = {
  searchPuneToGoa: [
    {
      id: 'bus-ksrtc-9902',
      operator_name: 'KSRTC Airavat Club Class',
      service_number: 'KA-09-F-9902',
      bus_type: 'Multi-Axle Volvo AC Sleeper',
      origin: 'Pune Swargate',
      destination: 'Panaji (Goa)',
      scheduled_departure: '6:30 PM',
      scheduled_arrival: '11:45 PM',
      departure_time: '6:30 PM',
      arrival_time: '11:45 PM',
      fare: 850,
      available_seats: 8,
      terminal_distance_mins: 20,
      bay: 'Platform 4, Swargate Terminal',
      amenities: ['Charging Point', 'Blanket', 'Water Bottle', 'Emergency Exit']
    },
    {
      id: 'bus-kadamba-104',
      operator_name: 'Kadamba Transport Corp (KTC)',
      service_number: 'GA-03-X-1044',
      bus_type: 'Scania Diamond AC Sleeper',
      origin: 'Pune Railway Station Bus Bay',
      destination: 'Panaji (Goa)',
      scheduled_departure: '7:15 PM',
      scheduled_arrival: '12:30 AM',
      departure_time: '7:15 PM',
      arrival_time: '12:30 AM',
      fare: 780,
      available_seats: 12,
      terminal_distance_mins: 5,
      bay: 'Bay 1, Station Forecourt',
      amenities: ['CCTV', 'Reading Lamp', 'Water Bottle']
    },
    {
      id: 'bus-purple-8842',
      operator_name: 'Purple Travels Pvt Ltd',
      service_number: 'PT-8842',
      bus_type: 'Volvo Multi-Axle AC Sleeper',
      origin: 'Pune Swargate',
      destination: 'Panaji (Goa)',
      scheduled_departure: '5:00 PM',
      scheduled_arrival: '11:00 PM',
      departure_time: '5:00 PM',
      arrival_time: '11:00 PM',
      fare: 620,
      available_seats: 0,
      terminal_distance_mins: 20,
      bay: 'Bay 3, Swargate Terminal'
    }
  ],
  liveStatusPT8842: {
    service_number: 'PT-8842',
    operator_name: 'Purple Travels Pvt Ltd',
    origin: 'Pune Swargate',
    destination: 'Panaji (Goa)',
    scheduled_departure: '5:00 PM',
    scheduled_arrival: '11:00 PM',
    expected_departure: '5:00 PM',
    expected_arrival: '11:00 PM',
    delay_minutes: 0,
    bay: 'Bay 3',
    current_status: 'SCHEDULED_ON_TIME',
    depot_check_in: 'Vehicle inspected & assigned to Platform Bay 3',
    operator_contact: '+91 20 2444 8888 (Pune Swargate Desk)'
  },
  cancelledBus: {
    service_number: 'PT-8842',
    operator_name: 'Purple Travels Pvt Ltd',
    is_cancelled: true,
    delay_reason: 'Vehicle breakdown at Katraj Depot'
  }
};
