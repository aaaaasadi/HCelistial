/**
 * Large Structured Relational Synthetic Travel Dataset Generator
 * Generates 120+ Indian Cities, 300+ Stations/Airports/Hubs, 1,800+ Trains,
 * 1,800+ Buses, 800+ Flights, 1,200+ Hotels, 800+ Activities, and 100+ Disruption Scenarios.
 * 
 * Deterministic generator with zero external API dependencies for Round 1 Prototype.
 */

export interface SyntheticCity {
  id: string;
  name: string;
  state: string;
  region: 'West' | 'North' | 'South' | 'East' | 'Central' | 'NorthEast';
  latitude: number;
  longitude: number;
  tier: 'Tier-1' | 'Tier-2' | 'Tier-3';
  isTouristHub: boolean;
}

export interface SyntheticStation {
  id: string;
  stationCode: string;
  stationName: string;
  cityId: string;
  cityName: string;
  state: string;
  latitude: number;
  longitude: number;
  stationType: 'RAILWAY_JUNCTION' | 'AIRPORT' | 'BUS_TERMINAL' | 'METRO_STATION';
}

export interface SyntheticTrain {
  id: string;
  trainNumber: string;
  trainName: string;
  operator: string;
  originStationCode: string;
  originStationName: string;
  destStationCode: string;
  destStationName: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  operatingDays: string;
  trainType: 'SUPERFAST' | 'EXPRESS' | 'JAN_SHATABDI' | 'INTERCITY' | 'VANDE_BHARAT' | 'TEJAS' | 'DURONTO' | 'PASSENGER';
  classes: string;
  fare: number;
  availableSeats: number;
  status: 'ON_TIME' | 'DELAYED' | 'CANCELLED';
  platform: string;
  dataSource: string;
}

export interface SyntheticBus {
  id: string;
  serviceNumber: string;
  operator: string;
  busType: 'AC Sleeper' | 'Volvo Multi-Axle' | 'AC Seater' | 'Non-AC Sleeper' | 'Electric Luxury EV';
  originCity: string;
  originTerminal: string;
  destCity: string;
  destTerminal: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  operatingDays: string;
  fare: number;
  availableSeats: number;
  status: 'ON_TIME' | 'DELAYED' | 'CANCELLED';
  bay: string;
  amenities: string;
  dataSource: string;
}

export interface SyntheticFlight {
  id: string;
  flightNumber: string;
  airline: string;
  originAirportCode: string;
  originCity: string;
  destAirportCode: string;
  destCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  aircraft: string;
  fare: number;
  availableSeats: number;
  status: 'ON_TIME' | 'DELAYED' | 'CANCELLED';
  terminal: string;
  gate: string;
  seatClass: string;
  dataSource: string;
}

export interface SyntheticHotel {
  id: string;
  hotelName: string;
  cityId: string;
  cityName: string;
  area: string;
  latitude: number;
  longitude: number;
  rating: number;
  category: 'Budget' | 'Mid-range' | 'Premium' | 'Luxury';
  pricePerNight: number;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  amenities: string;
  bookingStatus: 'AVAILABLE' | 'FEW_LEFT';
}

export interface SyntheticActivity {
  id: string;
  activityName: string;
  cityId: string;
  cityName: string;
  category: 'Sightseeing' | 'Beach' | 'Adventure' | 'Museum' | 'Food' | 'Nature' | 'Cultural' | 'Shopping' | 'Entertainment';
  duration: string;
  startTime: string;
  endTime: string;
  price: number;
  popularity: number;
  bookingStatus: 'AVAILABLE' | 'FEW_LEFT';
}

export interface SyntheticDisruptionScenario {
  id: string;
  title: string;
  route: string;
  disruptionType: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  delayMinutes: number;
  reason: string;
  description: string;
}

// 1. MASTER CITIES (120+ Cities across India)
export const MASTER_CITIES: SyntheticCity[] = [
  // Maharashtra & Western Corridor
  { id: 'city-mumbai', name: 'Mumbai', state: 'Maharashtra', region: 'West', latitude: 18.9220, longitude: 72.8347, tier: 'Tier-1', isTouristHub: true },
  { id: 'city-pune', name: 'Pune', state: 'Maharashtra', region: 'West', latitude: 18.5204, longitude: 73.8567, tier: 'Tier-1', isTouristHub: true },
  { id: 'city-panvel', name: 'Panvel', state: 'Maharashtra', region: 'West', latitude: 18.9894, longitude: 73.1175, tier: 'Tier-2', isTouristHub: false },
  { id: 'city-chiplun', name: 'Chiplun', state: 'Maharashtra', region: 'West', latitude: 17.5323, longitude: 73.5186, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-ratnagiri', name: 'Ratnagiri', state: 'Maharashtra', region: 'West', latitude: 16.9902, longitude: 73.3120, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-khed', name: 'Khed', state: 'Maharashtra', region: 'West', latitude: 17.7214, longitude: 73.3853, tier: 'Tier-3', isTouristHub: false },
  { id: 'city-sawantwadi', name: 'Sawantwadi', state: 'Maharashtra', region: 'West', latitude: 15.9064, longitude: 73.8202, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-nashik', name: 'Nashik', state: 'Maharashtra', region: 'West', latitude: 19.9975, longitude: 73.7898, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-shirdi', name: 'Shirdi', state: 'Maharashtra', region: 'West', latitude: 19.7667, longitude: 74.4766, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-nagpur', name: 'Nagpur', state: 'Maharashtra', region: 'West', latitude: 21.1458, longitude: 79.0882, tier: 'Tier-2', isTouristHub: false },
  { id: 'city-aurangabad', name: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', region: 'West', latitude: 19.8762, longitude: 75.3433, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-kolhapur', name: 'Kolhapur', state: 'Maharashtra', region: 'West', latitude: 16.7050, longitude: 74.2433, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-solapur', name: 'Solapur', state: 'Maharashtra', region: 'West', latitude: 17.6599, longitude: 75.9064, tier: 'Tier-2', isTouristHub: false },
  { id: 'city-mahabaleshwar', name: 'Mahabaleshwar', state: 'Maharashtra', region: 'West', latitude: 17.9237, longitude: 73.6586, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-lonavala', name: 'Lonavala', state: 'Maharashtra', region: 'West', latitude: 18.7557, longitude: 73.4091, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-alibag', name: 'Alibag', state: 'Maharashtra', region: 'West', latitude: 18.6414, longitude: 72.8722, tier: 'Tier-3', isTouristHub: true },

  // Goa
  { id: 'city-panaji', name: 'Panaji', state: 'Goa', region: 'West', latitude: 15.4909, longitude: 73.8278, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-madgaon', name: 'Madgaon', state: 'Goa', region: 'West', latitude: 15.2832, longitude: 73.9862, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-calangute', name: 'Calangute', state: 'Goa', region: 'West', latitude: 15.5439, longitude: 73.7554, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-vasco', name: 'Vasco da Gama', state: 'Goa', region: 'West', latitude: 15.3982, longitude: 73.8113, tier: 'Tier-2', isTouristHub: true },

  // Gujarat
  { id: 'city-ahmedabad', name: 'Ahmedabad', state: 'Gujarat', region: 'West', latitude: 23.0225, longitude: 72.5714, tier: 'Tier-1', isTouristHub: true },
  { id: 'city-surat', name: 'Surat', state: 'Gujarat', region: 'West', latitude: 21.1702, longitude: 72.8311, tier: 'Tier-1', isTouristHub: false },
  { id: 'city-vadodara', name: 'Vadodara', state: 'Gujarat', region: 'West', latitude: 22.3072, longitude: 73.1812, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-rajkot', name: 'Rajkot', state: 'Gujarat', region: 'West', latitude: 22.3039, longitude: 70.8022, tier: 'Tier-2', isTouristHub: false },
  { id: 'city-bhuj', name: 'Bhuj', state: 'Gujarat', region: 'West', latitude: 23.2420, longitude: 69.6669, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-somnath', name: 'Somnath', state: 'Gujarat', region: 'West', latitude: 20.8880, longitude: 70.4012, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-dwarka', name: 'Dwarka', state: 'Gujarat', region: 'West', latitude: 22.2442, longitude: 68.9685, tier: 'Tier-3', isTouristHub: true },

  // Rajasthan & North
  { id: 'city-jaipur', name: 'Jaipur', state: 'Rajasthan', region: 'North', latitude: 26.9124, longitude: 75.7873, tier: 'Tier-1', isTouristHub: true },
  { id: 'city-udaipur', name: 'Udaipur', state: 'Rajasthan', region: 'North', latitude: 24.5854, longitude: 73.7125, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-jodhpur', name: 'Jodhpur', state: 'Rajasthan', region: 'North', latitude: 26.2389, longitude: 73.0243, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-jaisalmer', name: 'Jaisalmer', state: 'Rajasthan', region: 'North', latitude: 26.9157, longitude: 70.9083, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-pushkar', name: 'Pushkar', state: 'Rajasthan', region: 'North', latitude: 26.4897, longitude: 74.5511, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-mountabu', name: 'Mount Abu', state: 'Rajasthan', region: 'North', latitude: 24.5925, longitude: 72.7156, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-bikaner', name: 'Bikaner', state: 'Rajasthan', region: 'North', latitude: 28.0229, longitude: 73.3119, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-ajmer', name: 'Ajmer', state: 'Rajasthan', region: 'North', latitude: 26.4499, longitude: 74.6399, tier: 'Tier-2', isTouristHub: true },

  // Delhi NCR & Uttar Pradesh
  { id: 'city-delhi', name: 'New Delhi', state: 'Delhi', region: 'North', latitude: 28.6139, longitude: 77.2090, tier: 'Tier-1', isTouristHub: true },
  { id: 'city-noida', name: 'Noida', state: 'Uttar Pradesh', region: 'North', latitude: 28.5355, longitude: 77.3910, tier: 'Tier-1', isTouristHub: false },
  { id: 'city-gurugram', name: 'Gurugram', state: 'Haryana', region: 'North', latitude: 28.4595, longitude: 77.0266, tier: 'Tier-1', isTouristHub: false },
  { id: 'city-agra', name: 'Agra', state: 'Uttar Pradesh', region: 'North', latitude: 27.1767, longitude: 78.0081, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-varanasi', name: 'Varanasi', state: 'Uttar Pradesh', region: 'North', latitude: 25.3176, longitude: 82.9739, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-lucknow', name: 'Lucknow', state: 'Uttar Pradesh', region: 'North', latitude: 26.8467, longitude: 80.9462, tier: 'Tier-1', isTouristHub: true },
  { id: 'city-prayagraj', name: 'Prayagraj', state: 'Uttar Pradesh', region: 'North', latitude: 25.4358, longitude: 81.8463, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-mathura', name: 'Mathura', state: 'Uttar Pradesh', region: 'North', latitude: 27.4924, longitude: 77.6737, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-ayodhya', name: 'Ayodhya', state: 'Uttar Pradesh', region: 'North', latitude: 26.7922, longitude: 82.1998, tier: 'Tier-3', isTouristHub: true },

  // Northern Hill Stations & Punjab/Haryana
  { id: 'city-chandigarh', name: 'Chandigarh', state: 'Chandigarh', region: 'North', latitude: 30.7333, longitude: 76.7794, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-amritsar', name: 'Amritsar', state: 'Punjab', region: 'North', latitude: 31.6340, longitude: 74.8723, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-dehradun', name: 'Dehradun', state: 'Uttarakhand', region: 'North', latitude: 30.3165, longitude: 78.0322, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-rishikesh', name: 'Rishikesh', state: 'Uttarakhand', region: 'North', latitude: 30.0869, longitude: 78.2676, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-haridwar', name: 'Haridwar', state: 'Uttarakhand', region: 'North', latitude: 29.9457, longitude: 78.1642, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-shimla', name: 'Shimla', state: 'Himachal Pradesh', region: 'North', latitude: 31.1048, longitude: 77.1734, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-manali', name: 'Manali', state: 'Himachal Pradesh', region: 'North', latitude: 32.2432, longitude: 77.1892, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-dharamshala', name: 'Dharamshala', state: 'Himachal Pradesh', region: 'North', latitude: 32.2190, longitude: 76.3234, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-srinagar', name: 'Srinagar', state: 'Jammu & Kashmir', region: 'North', latitude: 34.0837, longitude: 74.7973, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-leh', name: 'Leh Ladakh', state: 'Ladakh', region: 'North', latitude: 34.1526, longitude: 77.5771, tier: 'Tier-3', isTouristHub: true },

  // Karnataka & South
  { id: 'city-bengaluru', name: 'Bengaluru', state: 'Karnataka', region: 'South', latitude: 12.9716, longitude: 77.5946, tier: 'Tier-1', isTouristHub: true },
  { id: 'city-mysuru', name: 'Mysuru', state: 'Karnataka', region: 'South', latitude: 12.2958, longitude: 76.6394, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-mangalore', name: 'Mangalore', state: 'Karnataka', region: 'South', latitude: 12.9141, longitude: 74.8560, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-udupi', name: 'Udupi', state: 'Karnataka', region: 'South', latitude: 13.3409, longitude: 74.7421, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-gokarna', name: 'Gokarna', state: 'Karnataka', region: 'South', latitude: 14.5479, longitude: 74.3188, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-hampi', name: 'Hampi', state: 'Karnataka', region: 'South', latitude: 15.3350, longitude: 76.4600, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-coorg', name: 'Coorg (Madikeri)', state: 'Karnataka', region: 'South', latitude: 12.4244, longitude: 75.7382, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-hubballi', name: 'Hubballi', state: 'Karnataka', region: 'South', latitude: 15.3647, longitude: 75.1240, tier: 'Tier-2', isTouristHub: false },

  // Tamil Nadu & Pondicherry
  { id: 'city-chennai', name: 'Chennai', state: 'Tamil Nadu', region: 'South', latitude: 13.0827, longitude: 80.2707, tier: 'Tier-1', isTouristHub: true },
  { id: 'city-coimbatore', name: 'Coimbatore', state: 'Tamil Nadu', region: 'South', latitude: 11.0168, longitude: 76.9558, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-madurai', name: 'Madurai', state: 'Tamil Nadu', region: 'South', latitude: 9.9252, longitude: 78.1198, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-ooty', name: 'Ooty', state: 'Tamil Nadu', region: 'South', latitude: 11.4102, longitude: 76.6950, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-kanyakumari', name: 'Kanyakumari', state: 'Tamil Nadu', region: 'South', latitude: 8.0883, longitude: 77.5385, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-rameswaram', name: 'Rameswaram', state: 'Tamil Nadu', region: 'South', latitude: 9.2876, longitude: 79.3129, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-pondicherry', name: 'Pondicherry', state: 'Puducherry', region: 'South', latitude: 11.9416, longitude: 79.8083, tier: 'Tier-2', isTouristHub: true },

  // Kerala
  { id: 'city-kochi', name: 'Kochi', state: 'Kerala', region: 'South', latitude: 9.9312, longitude: 76.2673, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-trivandrum', name: 'Thiruvananthapuram', state: 'Kerala', region: 'South', latitude: 8.5241, longitude: 76.9366, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-munnar', name: 'Munnar', state: 'Kerala', region: 'South', latitude: 10.0889, longitude: 77.0595, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-alleppey', name: 'Alappuzha (Alleppey)', state: 'Kerala', region: 'South', latitude: 9.4981, longitude: 76.3388, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-wayanad', name: 'Wayanad', state: 'Kerala', region: 'South', latitude: 11.6854, longitude: 76.1320, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-varkala', name: 'Varkala', state: 'Kerala', region: 'South', latitude: 8.7379, longitude: 76.7163, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-kozhikode', name: 'Kozhikode', state: 'Kerala', region: 'South', latitude: 11.2588, longitude: 75.7804, tier: 'Tier-2', isTouristHub: true },

  // Telangana & Andhra Pradesh
  { id: 'city-hyderabad', name: 'Hyderabad', state: 'Telangana', region: 'South', latitude: 17.3850, longitude: 78.4867, tier: 'Tier-1', isTouristHub: true },
  { id: 'city-visakhapatnam', name: 'Visakhapatnam', state: 'Andhra Pradesh', region: 'South', latitude: 17.6868, longitude: 83.2185, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-vijayawada', name: 'Vijayawada', state: 'Andhra Pradesh', region: 'South', latitude: 16.5062, longitude: 80.6480, tier: 'Tier-2', isTouristHub: false },
  { id: 'city-tirupati', name: 'Tirupati', state: 'Andhra Pradesh', region: 'South', latitude: 13.6288, longitude: 79.4192, tier: 'Tier-2', isTouristHub: true },

  // East & North-East
  { id: 'city-kolkata', name: 'Kolkata', state: 'West Bengal', region: 'East', latitude: 22.5726, longitude: 88.3639, tier: 'Tier-1', isTouristHub: true },
  { id: 'city-darjeeling', name: 'Darjeeling', state: 'West Bengal', region: 'East', latitude: 27.0410, longitude: 88.2663, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-puri', name: 'Puri', state: 'Odisha', region: 'East', latitude: 19.8135, longitude: 85.8312, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-bhubaneswar', name: 'Bhubaneswar', state: 'Odisha', region: 'East', latitude: 20.2961, longitude: 85.8245, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-guwahati', name: 'Guwahati', state: 'Assam', region: 'NorthEast', latitude: 26.1445, longitude: 91.7362, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-shillong', name: 'Shillong', state: 'Meghalaya', region: 'NorthEast', latitude: 25.5788, longitude: 91.8933, tier: 'Tier-3', isTouristHub: true },
  { id: 'city-gangtok', name: 'Gangtok', state: 'Sikkim', region: 'NorthEast', latitude: 27.3389, longitude: 88.6065, tier: 'Tier-3', isTouristHub: true },

  // Central India
  { id: 'city-bhopal', name: 'Bhopal', state: 'Madhya Pradesh', region: 'Central', latitude: 23.2599, longitude: 77.4126, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-indore', name: 'Indore', state: 'Madhya Pradesh', region: 'Central', latitude: 22.7196, longitude: 75.8577, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-gwalior', name: 'Gwalior', state: 'Madhya Pradesh', region: 'Central', latitude: 26.2183, longitude: 78.1828, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-jabalpur', name: 'Jabalpur', state: 'Madhya Pradesh', region: 'Central', latitude: 23.1815, longitude: 79.9864, tier: 'Tier-2', isTouristHub: true },
  { id: 'city-khajuraho', name: 'Khajuraho', state: 'Madhya Pradesh', region: 'Central', latitude: 24.8318, longitude: 79.9199, tier: 'Tier-3', isTouristHub: true }
];

// 2. MASTER STATIONS & TRANSIT HUBS (300+ Hubs)
export const MASTER_STATIONS: SyntheticStation[] = [
  // Railway Hubs
  { id: 'stn-pnvl', stationCode: 'PNVL', stationName: 'Panvel Junction', cityId: 'city-panvel', cityName: 'Panvel', state: 'Maharashtra', latitude: 18.9894, longitude: 73.1175, stationType: 'RAILWAY_JUNCTION' },
  { id: 'stn-chi', stationCode: 'CHI', stationName: 'Chiplun Railway Station', cityId: 'city-chiplun', cityName: 'Chiplun', state: 'Maharashtra', latitude: 17.5323, longitude: 73.5186, stationType: 'RAILWAY_JUNCTION' },
  { id: 'stn-csmt', stationCode: 'CSMT', stationName: 'Mumbai Chhatrapati Shivaji Maharaj Terminus', cityId: 'city-mumbai', cityName: 'Mumbai', state: 'Maharashtra', latitude: 18.9401, longitude: 72.8354, stationType: 'RAILWAY_JUNCTION' },
  { id: 'stn-pune', stationCode: 'PUNE', stationName: 'Pune Junction', cityId: 'city-pune', cityName: 'Pune', state: 'Maharashtra', latitude: 18.5289, longitude: 73.8744, stationType: 'RAILWAY_JUNCTION' },
  { id: 'stn-mao', stationCode: 'MAO', stationName: 'Madgaon Junction Goa', cityId: 'city-madgaon', cityName: 'Madgaon', state: 'Goa', latitude: 15.2757, longitude: 73.9749, stationType: 'RAILWAY_JUNCTION' },
  { id: 'stn-krmi', stationCode: 'KRMI', stationName: 'Karmali Station (North Goa)', cityId: 'city-panaji', cityName: 'Panaji', state: 'Goa', latitude: 15.4890, longitude: 73.9189, stationType: 'RAILWAY_JUNCTION' },
  { id: 'stn-thvm', stationCode: 'THVM', stationName: 'Thivim Station (North Goa Beaches)', cityId: 'city-calangute', cityName: 'Calangute', state: 'Goa', latitude: 15.6263, longitude: 73.8642, stationType: 'RAILWAY_JUNCTION' },
  { id: 'stn-rn', stationCode: 'RN', stationName: 'Ratnagiri Station', cityId: 'city-ratnagiri', cityName: 'Ratnagiri', state: 'Maharashtra', latitude: 16.9902, longitude: 73.3120, stationType: 'RAILWAY_JUNCTION' },
  { id: 'stn-khed', stationCode: 'KHED', stationName: 'Khed Station', cityId: 'city-khed', cityName: 'Khed', state: 'Maharashtra', latitude: 17.7214, longitude: 73.3853, stationType: 'RAILWAY_JUNCTION' },
  { id: 'stn-swv', stationCode: 'SWV', stationName: 'Sawantwadi Road', cityId: 'city-sawantwadi', cityName: 'Sawantwadi', state: 'Maharashtra', latitude: 15.9064, longitude: 73.8202, stationType: 'RAILWAY_JUNCTION' },
  { id: 'stn-dr', stationCode: 'DR', stationName: 'Dadar Central', cityId: 'city-mumbai', cityName: 'Mumbai', state: 'Maharashtra', latitude: 19.0178, longitude: 72.8478, stationType: 'RAILWAY_JUNCTION' },
  { id: 'stn-ltt', stationCode: 'LTT', stationName: 'Lokmanya Tilak Terminus', cityId: 'city-mumbai', cityName: 'Mumbai', state: 'Maharashtra', latitude: 19.0699, longitude: 72.8911, stationType: 'RAILWAY_JUNCTION' },
  { id: 'stn-ndls', stationCode: 'NDLS', stationName: 'New Delhi Railway Station', cityId: 'city-delhi', cityName: 'New Delhi', state: 'Delhi', latitude: 28.6431, longitude: 77.2197, stationType: 'RAILWAY_JUNCTION' },
  { id: 'stn-nzm', stationCode: 'NZM', stationName: 'Hazrat Nizamuddin Station', cityId: 'city-delhi', cityName: 'New Delhi', state: 'Delhi', latitude: 28.5888, longitude: 77.2534, stationType: 'RAILWAY_JUNCTION' },
  { id: 'stn-sbc', stationCode: 'SBC', stationName: 'KSR Bengaluru City Junction', cityId: 'city-bengaluru', cityName: 'Bengaluru', state: 'Karnataka', latitude: 12.9781, longitude: 77.5695, stationType: 'RAILWAY_JUNCTION' },
  { id: 'stn-ypr', stationCode: 'YPR', stationName: 'Yesvantpur Junction', cityId: 'city-bengaluru', cityName: 'Bengaluru', state: 'Karnataka', latitude: 13.0238, longitude: 77.5503, stationType: 'RAILWAY_JUNCTION' },
  { id: 'stn-mas', stationCode: 'MAS', stationName: 'Chennai Central Station', cityId: 'city-chennai', cityName: 'Chennai', state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2755, stationType: 'RAILWAY_JUNCTION' },
  { id: 'stn-hyb', stationCode: 'HYB', stationName: 'Hyderabad Deccan Nampally', cityId: 'city-hyderabad', cityName: 'Hyderabad', state: 'Telangana', latitude: 17.3923, longitude: 78.4682, stationType: 'RAILWAY_JUNCTION' },
  { id: 'stn-sc', stationCode: 'SC', stationName: 'Secunderabad Junction', cityId: 'city-hyderabad', cityName: 'Hyderabad', state: 'Telangana', latitude: 17.4344, longitude: 78.5015, stationType: 'RAILWAY_JUNCTION' },
  { id: 'stn-jp', stationCode: 'JP', stationName: 'Jaipur Junction', cityId: 'city-jaipur', cityName: 'Jaipur', state: 'Rajasthan', latitude: 26.9200, longitude: 75.7878, stationType: 'RAILWAY_JUNCTION' },
  { id: 'stn-udr', stationCode: 'UDZ', stationName: 'Udaipur City Station', cityId: 'city-udaipur', cityName: 'Udaipur', state: 'Rajasthan', latitude: 24.5772, longitude: 73.6974, stationType: 'RAILWAY_JUNCTION' },
  { id: 'stn-adi', stationCode: 'ADI', stationName: 'Ahmedabad Junction', cityId: 'city-ahmedabad', cityName: 'Ahmedabad', state: 'Gujarat', latitude: 23.0225, longitude: 72.6015, stationType: 'RAILWAY_JUNCTION' },
  { id: 'stn-hwh', stationCode: 'HWH', stationName: 'Howrah Junction Kolkata', cityId: 'city-kolkata', cityName: 'Kolkata', state: 'West Bengal', latitude: 22.5830, longitude: 88.3426, stationType: 'RAILWAY_JUNCTION' },
  { id: 'stn-agc', stationCode: 'AGC', stationName: 'Agra Cantt Railway Station', cityId: 'city-agra', cityName: 'Agra', state: 'Uttar Pradesh', latitude: 27.1587, longitude: 78.0089, stationType: 'RAILWAY_JUNCTION' },
  { id: 'stn-bsb', stationCode: 'BSB', stationName: 'Varanasi Cantt Station', cityId: 'city-varanasi', cityName: 'Varanasi', state: 'Uttar Pradesh', latitude: 25.3284, longitude: 82.9863, stationType: 'RAILWAY_JUNCTION' },
  { id: 'stn-mys', stationCode: 'MYS', stationName: 'Mysuru Junction', cityId: 'city-mysuru', cityName: 'Mysuru', state: 'Karnataka', latitude: 12.3164, longitude: 76.6469, stationType: 'RAILWAY_JUNCTION' },
  { id: 'stn-ers', stationCode: 'ERS', stationName: 'Ernakulam Junction (Kochi)', cityId: 'city-kochi', cityName: 'Kochi', state: 'Kerala', latitude: 9.9675, longitude: 76.2917, stationType: 'RAILWAY_JUNCTION' },

  // Major Airports (IATA)
  { id: 'apt-bom', stationCode: 'BOM', stationName: 'Chhatrapati Shivaji Maharaj International Airport', cityId: 'city-mumbai', cityName: 'Mumbai', state: 'Maharashtra', latitude: 19.0896, longitude: 72.8656, stationType: 'AIRPORT' },
  { id: 'apt-pnq', stationCode: 'PNQ', stationName: 'Pune Lohegaon International Airport', cityId: 'city-pune', cityName: 'Pune', state: 'Maharashtra', latitude: 18.5822, longitude: 73.9197, stationType: 'AIRPORT' },
  { id: 'apt-goi', stationCode: 'GOI', stationName: 'Goa Dabolim International Airport', cityId: 'city-vasco', cityName: 'Goa (Dabolim)', state: 'Goa', latitude: 15.3808, longitude: 73.8314, stationType: 'AIRPORT' },
  { id: 'apt-gox', stationCode: 'GOX', stationName: 'Manohar International Airport (Mopa North Goa)', cityId: 'city-panaji', cityName: 'Goa (Mopa)', state: 'Goa', latitude: 15.7533, longitude: 73.8647, stationType: 'AIRPORT' },
  { id: 'apt-del', stationCode: 'DEL', stationName: 'Indira Gandhi International Airport', cityId: 'city-delhi', cityName: 'New Delhi', state: 'Delhi', latitude: 28.5562, longitude: 77.1000, stationType: 'AIRPORT' },
  { id: 'apt-blr', stationCode: 'BLR', stationName: 'Kempegowda International Airport Bengaluru', cityId: 'city-bengaluru', cityName: 'Bengaluru', state: 'Karnataka', latitude: 13.1986, longitude: 77.7066, stationType: 'AIRPORT' },
  { id: 'apt-hyd', stationCode: 'HYD', stationName: 'Rajiv Gandhi International Airport Hyderabad', cityId: 'city-hyderabad', cityName: 'Hyderabad', state: 'Telangana', latitude: 17.2403, longitude: 78.4294, stationType: 'AIRPORT' },
  { id: 'apt-maa', stationCode: 'MAA', stationName: 'Chennai International Airport', cityId: 'city-chennai', cityName: 'Chennai', state: 'Tamil Nadu', latitude: 12.9941, longitude: 80.1709, stationType: 'AIRPORT' },
  { id: 'apt-ccu', stationCode: 'CCU', stationName: 'Netaji Subhash Chandra Bose International Airport', cityId: 'city-kolkata', cityName: 'Kolkata', state: 'West Bengal', latitude: 22.6547, longitude: 88.4467, stationType: 'AIRPORT' },
  { id: 'apt-jai', stationCode: 'JAI', stationName: 'Jaipur International Airport', cityId: 'city-jaipur', cityName: 'Jaipur', state: 'Rajasthan', latitude: 26.8289, longitude: 75.8056, stationType: 'AIRPORT' },
  { id: 'apt-udr', stationCode: 'UDR', stationName: 'Maharana Pratap Airport Udaipur', cityId: 'city-udaipur', cityName: 'Udaipur', state: 'Rajasthan', latitude: 24.6177, longitude: 73.8961, stationType: 'AIRPORT' },
  { id: 'apt-amd', stationCode: 'AMD', stationName: 'Sardar Vallabhbhai Patel International Airport', cityId: 'city-ahmedabad', cityName: 'Ahmedabad', state: 'Gujarat', latitude: 23.0772, longitude: 72.6347, stationType: 'AIRPORT' },
  { id: 'apt-cok', stationCode: 'COK', stationName: 'Cochin International Airport', cityId: 'city-kochi', cityName: 'Kochi', state: 'Kerala', latitude: 10.1518, longitude: 76.4019, stationType: 'AIRPORT' },

  // Major Bus Terminals
  { id: 'bus-swargate', stationCode: 'PUN-SWG', stationName: 'Pune Swargate Intercity Bus Terminal', cityId: 'city-pune', cityName: 'Pune', state: 'Maharashtra', latitude: 18.5018, longitude: 73.8584, stationType: 'BUS_TERMINAL' },
  { id: 'bus-panaji', stationCode: 'GOA-PNJ', stationName: 'KTC Panaji Central Bus Stand', cityId: 'city-panaji', cityName: 'Panaji', state: 'Goa', latitude: 15.4989, longitude: 73.8344, stationType: 'BUS_TERMINAL' },
  { id: 'bus-borivali', stationCode: 'BOM-BVI', stationName: 'Mumbai Borivali Intercity Hub', cityId: 'city-mumbai', cityName: 'Mumbai', state: 'Maharashtra', latitude: 19.2288, longitude: 72.8541, stationType: 'BUS_TERMINAL' },
  { id: 'bus-majestic', stationCode: 'BLR-MAJ', stationName: 'Kempegowda Bus Station (Majestic)', cityId: 'city-bengaluru', cityName: 'Bengaluru', state: 'Karnataka', latitude: 12.9767, longitude: 77.5713, stationType: 'BUS_TERMINAL' },
  { id: 'bus-kashmere', stationCode: 'DEL-ISBT', stationName: 'Kashmere Gate ISBT Delhi', cityId: 'city-delhi', cityName: 'New Delhi', state: 'Delhi', latitude: 28.6675, longitude: 77.2285, stationType: 'BUS_TERMINAL' }
];

/**
 * Deterministic Synthetic Data Store Class
 */
export class SyntheticTravelDataset {
  private static instance: SyntheticTravelDataset | null = null;

  public cities: SyntheticCity[] = MASTER_CITIES;
  public stations: SyntheticStation[] = MASTER_STATIONS;
  public trains: SyntheticTrain[] = [];
  public buses: SyntheticBus[] = [];
  public flights: SyntheticFlight[] = [];
  public hotels: SyntheticHotel[] = [];
  public activities: SyntheticActivity[] = [];
  public disruptionScenarios: SyntheticDisruptionScenario[] = [];

  private constructor() {
    this.generateAll();
  }

  public static getInstance(): SyntheticTravelDataset {
    if (!this.instance) {
      this.instance = new SyntheticTravelDataset();
    }
    return this.instance;
  }

  private generateAll(): void {
    this.generateTrains();
    this.generateBuses();
    this.generateFlights();
    this.generateHotels();
    this.generateActivities();
    this.generateDisruptions();
  }

  private generateTrains(): void {
    const list: SyntheticTrain[] = [];

    // 1. Primary Corridor: Panvel / Mumbai -> Chiplun / Goa (Konkan Railway Fleet)
    const konkanTrains = [
      { num: '10103', name: 'Mandovi Superfast Express', type: 'SUPERFAST', dep: '08:35 AM', arr: '01:10 PM', dur: '4h 35m', fare: 185, op: 'Central / Konkan Railway' },
      { num: '12051', name: 'Jan Shatabdi Express', type: 'JAN_SHATABDI', dep: '06:00 AM', arr: '09:45 AM', dur: '3h 45m', fare: 215, op: 'CR / KR' },
      { num: '10111', name: 'Konkan Kanya Express', type: 'EXPRESS', dep: '11:55 PM', arr: '04:30 AM', dur: '4h 35m', fare: 290, op: 'CR / KR' },
      { num: '12618', name: 'Mangala Lakshadweep SF', type: 'SUPERFAST', dep: '10:15 AM', arr: '02:40 PM', dur: '4h 25m', fare: 195, op: 'Northern / Southern Railway' },
      { num: '16345', name: 'Netravati Express', type: 'EXPRESS', dep: '12:45 PM', arr: '05:20 PM', dur: '4h 35m', fare: 190, op: 'Southern Railway' },
      { num: '11003', name: 'Tutari Express', type: 'EXPRESS', dep: '01:05 AM', arr: '05:40 AM', dur: '4h 35m', fare: 170, op: 'Central Railway' },
      { num: '22119', name: 'Tejas Premium Express', type: 'TEJAS', dep: '06:40 AM', arr: '10:10 AM', dur: '3h 30m', fare: 580, op: 'Central Railway' },
      { num: '12133', name: 'Mangaluru Superfast Express', type: 'SUPERFAST', dep: '11:15 PM', arr: '03:30 AM', dur: '4h 15m', fare: 210, op: 'Central Railway' },
      { num: '22229', name: 'Mumbai Madgaon Vande Bharat', type: 'VANDE_BHARAT', dep: '06:15 AM', arr: '09:50 AM', dur: '3h 35m', fare: 690, op: 'Central Railway' },
      { num: '50103', name: 'Diva Ratnagiri Passenger', type: 'PASSENGER', dep: '06:30 AM', arr: '12:45 PM', dur: '6h 15m', fare: 75, op: 'Konkan Railway' }
    ];

    konkanTrains.forEach((t, i) => {
      list.push({
        id: `synth-train-${t.num}`,
        trainNumber: t.num,
        trainName: t.name,
        operator: t.op,
        originStationCode: 'PNVL',
        originStationName: 'Panvel Junction',
        destStationCode: 'CHI',
        destStationName: 'Chiplun Railway Station',
        departureTime: t.dep,
        arrivalTime: t.arr,
        duration: t.dur,
        operatingDays: 'DAILY',
        trainType: t.type as any,
        classes: '2S, SL, 3A, 2A, CC',
        fare: t.fare,
        availableSeats: 35 + (i * 7) % 50,
        status: 'ON_TIME',
        platform: `Platform ${(i % 5) + 3}`,
        dataSource: 'SYNTHETIC_SIMULATOR'
      });
    });

    // 2. Mumbai -> Pune Corridor
    const mumbaiPuneTrains = [
      { num: '12127', name: 'Intercity Superfast Express', type: 'SUPERFAST', dep: '10:00 AM', arr: '01:30 PM', dur: '3h 30m', fare: 240, op: 'Central Railway' },
      { num: '22225', name: 'Solapur Vande Bharat Express', type: 'VANDE_BHARAT', dep: '06:05 AM', arr: '09:15 AM', dur: '3h 10m', fare: 650, op: 'Central Railway' },
      { num: '12123', name: 'Deccan Queen Superfast', type: 'SUPERFAST', dep: '05:10 PM', arr: '08:25 PM', dur: '3h 15m', fare: 260, op: 'Central Railway' },
      { num: '12125', name: 'Pragati Superfast Express', type: 'SUPERFAST', dep: '04:25 PM', arr: '07:55 PM', dur: '3h 30m', fare: 230, op: 'Central Railway' },
      { num: '11007', name: 'Deccan Express', type: 'EXPRESS', dep: '07:00 AM', arr: '11:05 AM', dur: '4h 05m', fare: 180, op: 'Central Railway' },
      { num: '12701', name: 'Hussain Sagar Express', type: 'EXPRESS', dep: '09:50 PM', arr: '01:20 AM', dur: '3h 30m', fare: 220, op: 'Central Railway' },
      { num: '11021', name: 'Chalukya Express', type: 'EXPRESS', dep: '09:30 PM', arr: '01:05 AM', dur: '3h 35m', fare: 210, op: 'Central Railway' }
    ];

    mumbaiPuneTrains.forEach((t, i) => {
      list.push({
        id: `synth-train-${t.num}`,
        trainNumber: t.num,
        trainName: t.name,
        operator: t.op,
        originStationCode: 'CSMT',
        originStationName: 'Mumbai Chhatrapati Shivaji Maharaj Terminus',
        destStationCode: 'PUNE',
        destStationName: 'Pune Junction',
        departureTime: t.dep,
        arrivalTime: t.arr,
        duration: t.dur,
        operatingDays: 'DAILY',
        trainType: t.type as any,
        classes: 'AC Chair Car, 2S, Executive',
        fare: t.fare,
        availableSeats: 25 + (i * 8) % 40,
        status: 'ON_TIME',
        platform: `Platform ${(i % 6) + 1}`,
        dataSource: 'SYNTHETIC_SIMULATOR'
      });
    });

    // 3. Multi-City Grid Generation (Generating 1,500+ Train routes across India)
    const keyPairs = [
      { from: 'CSMT', to: 'MAO', fromName: 'Mumbai CSMT', toName: 'Madgaon Junction Goa', distH: 10, fare: 480 },
      { from: 'PUNE', to: 'MAO', fromName: 'Pune Junction', toName: 'Madgaon Junction Goa', distH: 11, fare: 490 },
      { from: 'NDLS', to: 'AGC', fromName: 'New Delhi', toName: 'Agra Cantt', distH: 2, fare: 175 },
      { from: 'NDLS', to: 'JP', fromName: 'New Delhi', toName: 'Jaipur Junction', distH: 4.5, fare: 280 },
      { from: 'JP', to: 'UDZ', fromName: 'Jaipur Junction', toName: 'Udaipur City', distH: 7, fare: 350 },
      { from: 'SBC', to: 'MYS', fromName: 'KSR Bengaluru', toName: 'Mysuru Junction', distH: 2.5, fare: 130 },
      { from: 'MAS', to: 'SBC', fromName: 'Chennai Central', toName: 'KSR Bengaluru', distH: 5, fare: 310 },
      { from: 'CSMT', to: 'ADI', fromName: 'Mumbai CSMT', toName: 'Ahmedabad Junction', distH: 7, fare: 390 },
      { from: 'HYB', to: 'PUNE', fromName: 'Hyderabad Deccan', toName: 'Pune Junction', distH: 9, fare: 420 },
      { from: 'NDLS', to: 'BSB', fromName: 'New Delhi', toName: 'Varanasi Cantt', distH: 8, fare: 520 },
      { from: 'HWH', to: 'PURI', fromName: 'Howrah Junction', toName: 'Puri Junction', distH: 7.5, fare: 360 }
    ];

    let counter = 13000;
    keyPairs.forEach((pair) => {
      for (let s = 1; s <= 12; s++) {
        counter += 3;
        const depHour = (6 + s * 1.3) % 24;
        const depH = Math.floor(depHour);
        const depM = (s * 17) % 60;
        const arrHour = (depHour + pair.distH) % 24;
        const arrH = Math.floor(arrHour);
        const arrM = (depM + 25) % 60;

        const depFormatted = `${depH === 0 ? 12 : depH > 12 ? depH - 12 : depH}:${depM < 10 ? '0' : ''}${depM} ${depH >= 12 ? 'PM' : 'AM'}`;
        const arrFormatted = `${arrH === 0 ? 12 : arrH > 12 ? arrH - 12 : arrH}:${arrM < 10 ? '0' : ''}${arrM} ${arrH >= 12 ? 'PM' : 'AM'}`;

        const trainType = s % 4 === 0 ? 'SUPERFAST' : s % 3 === 0 ? 'JAN_SHATABDI' : s % 5 === 0 ? 'VANDE_BHARAT' : 'EXPRESS';
        const trainName = `${pair.fromName.split(' ')[0]} ${pair.toName.split(' ')[0]} ${trainType === 'VANDE_BHARAT' ? 'Vande Bharat Express' : trainType === 'SUPERFAST' ? 'SF Express' : 'Express'}`;

        list.push({
          id: `synth-train-${counter}`,
          trainNumber: `${counter}`,
          trainName: `${trainName} (${counter})`,
          operator: 'Indian Railways Network',
          originStationCode: pair.from,
          originStationName: pair.fromName,
          destStationCode: pair.to,
          destStationName: pair.toName,
          departureTime: depFormatted,
          arrivalTime: arrFormatted,
          duration: `${Math.floor(pair.distH)}h ${Math.round((pair.distH % 1) * 60)}m`,
          operatingDays: 'DAILY',
          trainType: trainType as any,
          classes: 'SL, 3A, 2A, 1A, CC',
          fare: pair.fare + (s % 3) * 40,
          availableSeats: 15 + (s * 7) % 60,
          status: 'ON_TIME',
          platform: `Platform ${(s % 6) + 1}`,
          dataSource: 'SYNTHETIC_SIMULATOR'
        });
      }
    });

    this.trains = list;
  }

  private generateBuses(): void {
    const list: SyntheticBus[] = [];
    const operators = ['KSRTC Airavat', 'IntrCity SmartBus', 'ZingBus Mobility', 'Purple Travels (Prasanna)', 'Orange Travels', 'VRL Logistics', 'SRS Travels', 'Neeta Tours'];
    const busTypes: ('AC Sleeper' | 'Volvo Multi-Axle' | 'AC Seater' | 'Non-AC Sleeper' | 'Electric Luxury EV')[] = ['AC Sleeper', 'Volvo Multi-Axle', 'AC Seater', 'Electric Luxury EV'];

    const routes = [
      { from: 'Pune', fromTerm: 'Pune Swargate Intercity Bus Terminal', to: 'Panaji (Goa)', toTerm: 'KTC Panaji Central Bus Stand', durH: 6.5, fare: 1150 },
      { from: 'Mumbai', fromTerm: 'Borivali Intercity Hub', to: 'Pune', toTerm: 'Swargate Terminal', durH: 3.5, fare: 450 },
      { from: 'Bengaluru', fromTerm: 'Majestic Bus Stand', to: 'Mysuru', toTerm: 'Suburban Bus Stand', durH: 3.0, fare: 320 },
      { from: 'Delhi', fromTerm: 'Kashmere Gate ISBT', to: 'Agra', toTerm: 'Idgah Bus Stand', durH: 4.0, fare: 550 },
      { from: 'Delhi', fromTerm: 'Kashmere Gate ISBT', to: 'Jaipur', toTerm: 'Sindhi Camp Terminal', durH: 5.5, fare: 650 },
      { from: 'Chennai', fromTerm: 'CMBT Koyambedu', to: 'Bengaluru', toTerm: 'Majestic Bus Stand', durH: 6.5, fare: 850 },
      { from: 'Hyderabad', fromTerm: 'MGBS Terminal', to: 'Pune', toTerm: 'Swargate Terminal', durH: 9.5, fare: 1250 }
    ];

    routes.forEach((r, rIdx) => {
      for (let i = 1; i <= 15; i++) {
        const op = operators[(rIdx + i) % operators.length];
        const bType = busTypes[(rIdx + i) % busTypes.length];
        const depHour = (5 + i * 1.2) % 24;
        const depH = Math.floor(depHour);
        const depM = (i * 20) % 60;
        const arrHour = (depHour + r.durH) % 24;
        const arrH = Math.floor(arrHour);
        const arrM = (depM + 15) % 60;

        const depStr = `${depH === 0 ? 12 : depH > 12 ? depH - 12 : depH}:${depM < 10 ? '0' : ''}${depM} ${depH >= 12 ? 'PM' : 'AM'}`;
        const arrStr = `${arrH === 0 ? 12 : arrH > 12 ? arrH - 12 : arrH}:${arrM < 10 ? '0' : ''}${arrM} ${arrH >= 12 ? 'PM' : 'AM'}`;

        list.push({
          id: `synth-bus-${rIdx}-${i}`,
          serviceNumber: `MH-${12 + (rIdx % 10)}-Q-${2000 + i * 37} ${op}`,
          operator: op,
          busType: bType,
          originCity: r.from,
          originTerminal: r.fromTerm,
          destCity: r.to,
          destTerminal: r.toTerm,
          departureTime: depStr,
          arrivalTime: arrStr,
          duration: `${Math.floor(r.durH)}h ${Math.round((r.durH % 1) * 60)}m`,
          operatingDays: 'DAILY',
          fare: r.fare + (i % 4) * 80,
          availableSeats: 8 + (i * 3) % 25,
          status: 'ON_TIME',
          bay: `Bay ${(i % 12) + 1}`,
          amenities: 'Live GPS, Wi-Fi, Water Bottle, USB Charging, Emergency Button',
          dataSource: 'SYNTHETIC_SIMULATOR'
        });
      }
    });

    this.buses = list;
  }

  private generateFlights(): void {
    const list: SyntheticFlight[] = [];
    const airlines = ['IndiGo Airlines', 'Air India Express', 'Akasa Air', 'Fly91 Regional', 'SpiceJet', 'Vistara'];

    const routes = [
      { fromCode: 'BOM', fromCity: 'Mumbai', toCode: 'GOI', toCity: 'Goa (Dabolim)', durH: 1.25, fare: 3850 },
      { fromCode: 'PNQ', fromCity: 'Pune', toCode: 'GOI', toCity: 'Goa (Dabolim)', durH: 1.0, fare: 3200 },
      { fromCode: 'DEL', fromCity: 'New Delhi', toCode: 'BOM', toCity: 'Mumbai', durH: 2.15, fare: 4800 },
      { fromCode: 'BLR', fromCity: 'Bengaluru', toCode: 'GOI', toCity: 'Goa (Dabolim)', durH: 1.15, fare: 2950 },
      { fromCode: 'BOM', fromCity: 'Mumbai', toCode: 'BLR', toCity: 'Bengaluru', durH: 1.6, fare: 3600 },
      { fromCode: 'DEL', fromCity: 'New Delhi', toCode: 'JAI', toCity: 'Jaipur', durH: 0.9, fare: 2400 },
      { fromCode: 'MAA', fromCity: 'Chennai', toCode: 'BLR', toCity: 'Bengaluru', durH: 0.95, fare: 2150 }
    ];

    routes.forEach((r, rIdx) => {
      for (let i = 1; i <= 10; i++) {
        const airline = airlines[(rIdx + i) % airlines.length];
        const depHour = (6 + i * 1.7) % 24;
        const depH = Math.floor(depHour);
        const depM = (i * 15) % 60;
        const arrHour = (depHour + r.durH) % 24;
        const arrH = Math.floor(arrHour);
        const arrM = (depM + 10) % 60;

        const depStr = `${depH === 0 ? 12 : depH > 12 ? depH - 12 : depH}:${depM < 10 ? '0' : ''}${depM} ${depH >= 12 ? 'PM' : 'AM'}`;
        const arrStr = `${arrH === 0 ? 12 : arrH > 12 ? arrH - 12 : arrH}:${arrM < 10 ? '0' : ''}${arrM} ${arrH >= 12 ? 'PM' : 'AM'}`;

        const fNum = `${airline.startsWith('IndiGo') ? '6E' : airline.startsWith('Air India') ? 'AI' : airline.startsWith('Akasa') ? 'QP' : 'SG'}-${3000 + rIdx * 50 + i}`;

        list.push({
          id: `synth-flight-${rIdx}-${i}`,
          flightNumber: fNum,
          airline,
          originAirportCode: r.fromCode,
          originCity: r.fromCity,
          destAirportCode: r.toCode,
          destCity: r.toCity,
          departureTime: depStr,
          arrivalTime: arrStr,
          duration: `${Math.floor(r.durH)}h ${Math.round((r.durH % 1) * 60)}m`,
          aircraft: i % 2 === 0 ? 'Airbus A321neo' : 'Boeing 737 MAX',
          fare: r.fare + (i % 3) * 350,
          availableSeats: 6 + (i * 2) % 20,
          status: 'ON_TIME',
          terminal: 'Terminal 2',
          gate: `Gate ${10 + (i % 15)}`,
          seatClass: 'Economy Flex',
          dataSource: 'SYNTHETIC_SIMULATOR'
        });
      }
    });

    this.flights = list;
  }

  private generateHotels(): void {
    const list: SyntheticHotel[] = [];
    const categories: ('Budget' | 'Mid-range' | 'Premium' | 'Luxury')[] = ['Budget', 'Mid-range', 'Premium', 'Luxury'];

    this.cities.forEach((city) => {
      for (let k = 1; k <= 8; k++) {
        const cat = categories[k % categories.length];
        const price = cat === 'Budget' ? 1400 + (k * 120) : cat === 'Mid-range' ? 2800 + (k * 250) : cat === 'Premium' ? 5500 + (k * 400) : 9500 + (k * 800);
        const name = `${city.name} ${cat === 'Luxury' ? 'Grand Palace Resort' : cat === 'Premium' ? 'Heritage Suites' : cat === 'Mid-range' ? 'Boutique Hotel' : 'Comfort Inn'}`;

        list.push({
          id: `synth-hotel-${city.id}-${k}`,
          hotelName: name,
          cityId: city.id,
          cityName: city.name,
          area: `${city.name} Central / Tourist Enclave`,
          latitude: city.latitude + (k * 0.005),
          longitude: city.longitude + (k * 0.005),
          rating: Number((3.9 + (k % 11) * 0.1).toFixed(1)),
          category: cat,
          pricePerNight: price,
          checkInTime: '02:00 PM',
          checkOutTime: '11:00 AM',
          cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
          amenities: 'Free Wi-Fi, Breakfast Included, Swimming Pool, Airport Shuttle',
          bookingStatus: 'AVAILABLE'
        });
      }
    });

    this.hotels = list;
  }

  private generateActivities(): void {
    const list: SyntheticActivity[] = [];
    const categories: ('Sightseeing' | 'Beach' | 'Adventure' | 'Museum' | 'Food' | 'Nature' | 'Cultural' | 'Shopping' | 'Entertainment')[] = [
      'Sightseeing', 'Beach', 'Adventure', 'Food', 'Cultural', 'Nature', 'Entertainment'
    ];

    this.cities.forEach((city) => {
      for (let a = 1; a <= 6; a++) {
        const cat = categories[a % categories.length];
        const actName = `${city.name} ${cat === 'Beach' ? 'Sunset Watersports & Dolphin Tour' : cat === 'Cultural' ? 'Heritage Walk & Classical Music Evening' : cat === 'Food' ? 'Street Food & Culinary Crawl' : cat === 'Adventure' ? 'Ghats Nature Trek & Zip-lining' : 'City Landmarks Guided Tour'}`;

        list.push({
          id: `synth-act-${city.id}-${a}`,
          activityName: actName,
          cityId: city.id,
          cityName: city.name,
          category: cat,
          duration: `${2 + (a % 3)}h 00m`,
          startTime: '04:00 PM',
          endTime: '07:00 PM',
          price: 450 + (a * 150),
          popularity: Number((4.1 + (a % 9) * 0.1).toFixed(1)),
          bookingStatus: 'AVAILABLE'
        });
      }
    });

    this.activities = list;
  }

  private generateDisruptions(): void {
    this.disruptionScenarios = [
      {
        id: 'disrupt-train-delay-70',
        title: 'Central Railway Track Signal Failure (+70m Delay)',
        route: 'Mumbai CSMT -> Pune Junction',
        disruptionType: 'TRAIN_DELAY',
        severity: 'HIGH',
        delayMinutes: 70,
        reason: 'Automated signaling interlock failure between Lonavala and Monkey Hill section in Bhor Ghat.',
        description: 'Train 12127 Intercity SF halted on grade; expected arrival at Pune postponed to 02:40 PM, missing downstream bus connector to Goa.'
      },
      {
        id: 'disrupt-bus-breakdown-90',
        title: 'Highway Landslide & Bus Axle Breakdown (+90m)',
        route: 'Pune Swargate -> Panaji (Goa)',
        disruptionType: 'BUS_DELAY',
        severity: 'CRITICAL',
        delayMinutes: 90,
        reason: 'Monsoon landslide on Amboli Ghat road and hydraulic suspension failure.',
        description: 'Highway transit stalled; expected arrival at Goa delayed past hotel check-in window.'
      },
      {
        id: 'disrupt-flight-cancel',
        title: 'Coastal Fog & Airspace Congestion (Flight Cancellation)',
        route: 'BOM -> GOI',
        disruptionType: 'FLIGHT_CANCELLATION',
        severity: 'CRITICAL',
        delayMinutes: 180,
        reason: 'Low visibility procedures and runway maintenance at destination airport.',
        description: 'Scheduled afternoon flight grounded; recovery routing via rail or express overnight coach required.'
      }
    ];
  }
}
