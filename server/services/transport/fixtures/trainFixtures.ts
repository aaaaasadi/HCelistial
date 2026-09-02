export const TRAIN_FIXTURES = {
  onTime12127: {
    train_number: '12127',
    train_name: 'Intercity SF Express',
    scheduled_departure: '10:00 AM',
    scheduled_arrival: '1:30 PM',
    expected_departure: '10:00 AM',
    expected_arrival: '1:30 PM',
    delay: 0,
    late_minutes: 0,
    current_station_name: 'Kalyan Junction',
    next_station_name: 'Karjat Junction',
    speed: 88,
    platform: '4',
    is_cancelled: false,
    is_diverted: false,
    last_updated: '30 seconds ago'
  },
  delayed12127: {
    train_number: '12127',
    train_name: 'Intercity SF Express',
    scheduled_departure: '10:00 AM',
    scheduled_arrival: '1:30 PM',
    expected_departure: '10:00 AM',
    expected_arrival: '4:50 PM',
    delay: 200,
    late_minutes: 200,
    current_station_name: 'Karjat Outskirts (KM 108.4)',
    next_station_name: 'Lonavala (Delayed Track)',
    speed: 12,
    platform: '4',
    is_cancelled: false,
    is_diverted: false,
    delay_reason: 'Signaling and traction failure between Karjat and Lonavala ghat section',
    last_updated: 'Just now'
  },
  cancelled12127: {
    train_number: '12127',
    train_name: 'Intercity SF Express',
    scheduled_departure: '10:00 AM',
    scheduled_arrival: '1:30 PM',
    expected_departure: '10:00 AM',
    expected_arrival: '1:30 PM',
    delay: 0,
    late_minutes: 0,
    is_cancelled: true,
    is_diverted: false,
    delay_reason: 'Track maintenance and boulder collapse in Bhor Ghat',
    last_updated: '1 minute ago'
  },
  malformedPayload: {
    randomField: 'unexpected',
    status: null
  }
};
