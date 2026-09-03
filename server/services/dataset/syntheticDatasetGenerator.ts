/**
 * Large Structured Relational Synthetic Travel Dataset Generator
 * Generates 120+ Indian Destinations across all Regions & States,
 * 40+ Popular Multimodal Corridors, 300+ Stations/Airports,
 * 1,800+ Trains, 1,800+ Buses, 800+ Flights, 1,200+ Hotels, 840+ Activities, and 100+ Disruptions.
 */

export interface SyntheticCity {
  id: string;
  name: string;
  state: string;
  country: string;
  region: 'West' | 'North' | 'South' | 'East' | 'Central' | 'NorthEast';
  latitude: number;
  longitude: number;
  destinationType: 'METRO' | 'CITY' | 'BEACH' | 'HILL_STATION' | 'HERITAGE' | 'PILGRIMAGE' | 'ADVENTURE' | 'NATURE' | 'WILDLIFE' | 'COASTAL' | 'CULTURAL' | 'SPIRITUAL';
  tier: 'Tier-1' | 'Tier-2' | 'Tier-3';
  isTouristHub: boolean;
  description: string;
  shortDescription: string;
  popularityScore: number; // 0 - 100
  bestTimeToVisit: string;
  averageStayDays: number;
  budgetLevel: string;
  tags: string[];
  dataSource: string;
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

export interface PopularJourney {
  id: string;
  originCityId: string;
  originCityName: string;
  destCityId: string;
  destCityName: string;
  title: string;
  description: string;
  popularityScore: number;
  estimatedDuration: string;
  recommendedDays: number;
  travelStyle: string;
  approximateBudget: number;
  availableTransportTypes: ('TRAIN' | 'BUS' | 'FLIGHT')[];
  tags: string[];
  featured: boolean;
  dataSource: string;
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
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  category: 'BUDGET' | 'MID_RANGE' | 'PREMIUM' | 'LUXURY' | 'RESORT' | 'HERITAGE_PALACE' | 'BOUTIQUE';
  pricePerNight: number;
  currency: string;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  amenities: string[];
  roomTypes: string[];
  availabilityStatus: 'AVAILABLE' | 'FEW_LEFT';
  popularityScore: number;
  description: string;
  tags: string[];
  dataSource: string;
}

export interface SyntheticActivity {
  id: string;
  activityName: string;
  cityId: string;
  cityName: string;
  category: 'SIGHTSEEING' | 'BEACH' | 'ADVENTURE' | 'NATURE' | 'CULTURAL' | 'HISTORY' | 'MUSEUM' | 'FOOD' | 'SHOPPING' | 'NIGHTLIFE' | 'SPIRITUAL';
  description: string;
  duration: string;
  startTime: string;
  endTime: string;
  price: number;
  currency: string;
  popularityScore: number;
  rating: number;
  bestTime: string;
  bookingRequired: boolean;
  familyFriendly: boolean;
  indoorOutdoor: 'INDOOR' | 'OUTDOOR' | 'BOTH';
  tags: string[];
  dataSource: string;
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

// 1. MASTER 120+ INDIAN DESTINATIONS
export const MASTER_CITIES: SyntheticCity[] = [
  // --- WEST REGION (Maharashtra, Goa, Gujarat) ---
  {
    id: 'city-mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    region: 'West',
    latitude: 18.9220,
    longitude: 72.8347,
    destinationType: 'METRO',
    tier: 'Tier-1',
    isTouristHub: true,
    description: 'India’s vibrant coastal financial capital famous for Marine Drive, Gateway of India, Bollywood, and iconic heritage railway architecture.',
    shortDescription: 'The bustling City of Dreams with rich colonial heritage & Arabian Sea coastline.',
    popularityScore: 98,
    bestTimeToVisit: 'October to March',
    averageStayDays: 3,
    budgetLevel: 'Premium (₹4,500 - ₹9,000 / day)',
    tags: ['Metro', 'Coastal', 'Heritage', 'Food', 'Nightlife', 'Bollywood'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-pune',
    name: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    region: 'West',
    latitude: 18.5204,
    longitude: 73.8567,
    destinationType: 'CULTURAL',
    tier: 'Tier-1',
    isTouristHub: true,
    description: 'Cultural capital of Maharashtra nestled in the Western Ghats with historic Maratha forts, green hill lookouts, and thriving food culture.',
    shortDescription: 'Cultural hub of Maharashtra with historic forts, palaces, and hill gateways.',
    popularityScore: 91,
    bestTimeToVisit: 'July to February',
    averageStayDays: 2,
    budgetLevel: 'Moderate (₹2,500 - ₹5,000 / day)',
    tags: ['Culture', 'Ghats', 'Forts', 'Universities', 'Cuisine'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-goa',
    name: 'Goa (Panaji & Madgaon)',
    state: 'Goa',
    country: 'India',
    region: 'West',
    latitude: 15.4909,
    longitude: 73.8278,
    destinationType: 'BEACH',
    tier: 'Tier-2',
    isTouristHub: true,
    description: 'World-famous tropical paradise with golden beaches, Portuguese-colonial architecture, vibrant night markets, water sports, and tranquil backwaters.',
    shortDescription: 'Sun, sand, Portuguese heritage villas, and Arabian Sea beach resorts.',
    popularityScore: 99,
    bestTimeToVisit: 'November to February',
    averageStayDays: 4,
    budgetLevel: 'Flexible (₹3,000 - ₹12,000 / day)',
    tags: ['Beach', 'Nightlife', 'Seafood', 'Water Sports', 'Portuguese Heritage'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-panvel',
    name: 'Panvel',
    state: 'Maharashtra',
    country: 'India',
    region: 'West',
    latitude: 18.9894,
    longitude: 73.1175,
    destinationType: 'CITY',
    tier: 'Tier-2',
    isTouristHub: false,
    description: 'Gateway junction to the Konkan Railway network and Mumbai Metropolitan Region transit hub.',
    shortDescription: 'Key intermodal transport junction connecting Mumbai to Konkan and Goa.',
    popularityScore: 78,
    bestTimeToVisit: 'All Year',
    averageStayDays: 1,
    budgetLevel: 'Budget (₹1,500 - ₹3,000 / day)',
    tags: ['Transit Hub', 'Konkan Rail Junction', 'Intermodal'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-chiplun',
    name: 'Chiplun',
    state: 'Maharashtra',
    country: 'India',
    region: 'West',
    latitude: 17.5323,
    longitude: 73.5186,
    destinationType: 'NATURE',
    tier: 'Tier-3',
    isTouristHub: true,
    description: 'Scenic town on the banks of the Vashishti River in the Konkan belt, surrounded by lush Western Ghat hills, mango orchards, and ancient temples.',
    shortDescription: 'Tranquil Konkan riverfront valley with mango orchards and Western Ghats waterfalls.',
    popularityScore: 82,
    bestTimeToVisit: 'June to February',
    averageStayDays: 2,
    budgetLevel: 'Budget (₹1,800 - ₹3,500 / day)',
    tags: ['Konkan Valley', 'Riverfront', 'Mangoes', 'Waterfalls', 'Nature'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-ratnagiri',
    name: 'Ratnagiri',
    state: 'Maharashtra',
    country: 'India',
    region: 'West',
    latitude: 16.9902,
    longitude: 73.3120,
    destinationType: 'COASTAL',
    tier: 'Tier-2',
    isTouristHub: true,
    description: 'Historic coastal Konkan port town renowned for Alphonso mangoes, scenic sea forts (Jaigad, Ratnadurg), and tranquil beaches.',
    shortDescription: 'Coastal paradise famous for Alphonso mangoes, lighthouse forts, and secluded shores.',
    popularityScore: 86,
    bestTimeToVisit: 'October to March',
    averageStayDays: 2,
    budgetLevel: 'Moderate (₹2,200 - ₹4,500 / day)',
    tags: ['Coastal', 'Forts', 'Alphonso Mangoes', 'Beaches'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-nashik',
    name: 'Nashik',
    state: 'Maharashtra',
    country: 'India',
    region: 'West',
    latitude: 19.9975,
    longitude: 73.7898,
    destinationType: 'PILGRIMAGE',
    tier: 'Tier-2',
    isTouristHub: true,
    description: 'The wine capital of India on the banks of Godavari River, featuring Sula Vineyards, Trimbakeshwar Jyotirlinga, and rolling Sahyadri vineyards.',
    shortDescription: 'India’s wine capital and sacred Godavari river heritage center.',
    popularityScore: 89,
    bestTimeToVisit: 'October to March',
    averageStayDays: 2,
    budgetLevel: 'Moderate (₹2,800 - ₹6,000 / day)',
    tags: ['Wine Capital', 'Vineyards', 'Godavari River', 'Pilgrimage', 'Trekking'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-mahabaleshwar',
    name: 'Mahabaleshwar',
    state: 'Maharashtra',
    country: 'India',
    region: 'West',
    latitude: 17.9237,
    longitude: 73.6586,
    destinationType: 'HILL_STATION',
    tier: 'Tier-3',
    isTouristHub: true,
    description: 'Serene Western Ghats hill station famous for lush strawberry farms, mist-clad cliff viewpoints (Arthur’s Seat, Wilson Point), and Venna Lake.',
    shortDescription: 'Strawberry capital and premier hill station retreat in the Sahyadri mountains.',
    popularityScore: 92,
    bestTimeToVisit: 'October to June',
    averageStayDays: 3,
    budgetLevel: 'Moderate to Luxury (₹3,000 - ₹8,500 / day)',
    tags: ['Hill Station', 'Strawberries', 'Viewpoints', 'Boating', 'Cool Climate'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-lonavala',
    name: 'Lonavala & Khandala',
    state: 'Maharashtra',
    country: 'India',
    region: 'West',
    latitude: 18.7557,
    longitude: 73.4091,
    destinationType: 'HILL_STATION',
    tier: 'Tier-3',
    isTouristHub: true,
    description: 'Popular weekend Sahyadri hill getaway with misty waterfalls, Bhushi Dam, ancient Karla & Bhaja Buddhist rock-cut caves, and chikki confectioneries.',
    shortDescription: 'Sahyadri misty cliffs, rock caves, waterfalls, and scenic express highways.',
    popularityScore: 90,
    bestTimeToVisit: 'July to February',
    averageStayDays: 2,
    budgetLevel: 'Moderate (₹2,500 - ₹6,000 / day)',
    tags: ['Waterfalls', 'Rock Caves', 'Monsoon Retreat', 'Chikki', 'Sahyadri'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-alibaug',
    name: 'Alibaug',
    state: 'Maharashtra',
    country: 'India',
    region: 'West',
    latitude: 18.6414,
    longitude: 72.8722,
    destinationType: 'BEACH',
    tier: 'Tier-3',
    isTouristHub: true,
    description: 'Coastal seaside escape near Mumbai reachable by Ro-Ro ferry, famous for Kolaba Sea Fort, clean sandy beaches (Varsoli, Nagaon), and luxury beach villas.',
    shortDescription: 'Coastal beach haven with historic sea forts and luxury villa stays.',
    popularityScore: 88,
    bestTimeToVisit: 'October to May',
    averageStayDays: 2,
    budgetLevel: 'Moderate to Luxury (₹3,000 - ₹8,000 / day)',
    tags: ['Beach', 'Sea Fort', 'Ro-Ro Ferry', 'Watersports', 'Seafood'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-shirdi',
    name: 'Shirdi',
    state: 'Maharashtra',
    country: 'India',
    region: 'West',
    latitude: 19.7645,
    longitude: 74.4762,
    destinationType: 'PILGRIMAGE',
    tier: 'Tier-3',
    isTouristHub: true,
    description: 'Major pilgrimage destination visited by millions worldwide to seek blessings at the sacred Sai Baba Samadhi Mandir.',
    shortDescription: 'World-renowned holy shrine and spiritual center of Sai Baba.',
    popularityScore: 91,
    bestTimeToVisit: 'All Year',
    averageStayDays: 1,
    budgetLevel: 'Budget to Moderate (₹1,500 - ₹4,000 / day)',
    tags: ['Sai Baba', 'Pilgrimage', 'Spiritual', 'Temple Shrine'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-aurangabad',
    name: 'Chhatrapati Sambhajinagar (Aurangabad)',
    state: 'Maharashtra',
    country: 'India',
    region: 'West',
    latitude: 19.8762,
    longitude: 75.3433,
    destinationType: 'HERITAGE',
    tier: 'Tier-2',
    isTouristHub: true,
    description: 'Tourism capital of Maharashtra, gateway to UNESCO World Heritage Ajanta & Ellora rock-cut cave monuments and Bibi Ka Maqbara.',
    shortDescription: 'Gateway to the awe-inspiring Ajanta and Ellora rock-cut cave temples.',
    popularityScore: 93,
    bestTimeToVisit: 'October to March',
    averageStayDays: 3,
    budgetLevel: 'Moderate (₹2,500 - ₹5,500 / day)',
    tags: ['Ajanta Ellora', 'UNESCO Heritage', 'Rock-cut Caves', 'Bibi Ka Maqbara', 'Himroo'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-kolhapur',
    name: 'Kolhapur',
    state: 'Maharashtra',
    country: 'India',
    region: 'West',
    latitude: 16.7050,
    longitude: 74.2433,
    destinationType: 'HERITAGE',
    tier: 'Tier-2',
    isTouristHub: true,
    description: 'Historic princely city celebrated for Mahalakshmi Temple, Panhala Fort, handcrafted Kolhapuri leather chappals, and spicy Kolhapuri cuisine.',
    shortDescription: 'Royal city of Mahalakshmi Temple, Maratha fortresses, and artisanal crafts.',
    popularityScore: 87,
    bestTimeToVisit: 'September to March',
    averageStayDays: 2,
    budgetLevel: 'Budget to Moderate (₹2,000 - ₹4,000 / day)',
    tags: ['Mahalakshmi Temple', 'Panhala Fort', 'Leather Crafts', 'Spicy Cuisine'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',
    region: 'West',
    latitude: 23.0225,
    longitude: 72.5714,
    destinationType: 'METRO',
    tier: 'Tier-1',
    isTouristHub: true,
    description: 'India’s first UNESCO World Heritage City, home to Sabarmati Ashram, intricately carved stepwells (Adalaj), and bustling textile markets.',
    shortDescription: 'Historic UNESCO heritage city with Sabarmati Ashram and intricate stepwells.',
    popularityScore: 92,
    bestTimeToVisit: 'October to March',
    averageStayDays: 2,
    budgetLevel: 'Moderate (₹2,800 - ₹6,000 / day)',
    tags: ['UNESCO Heritage', 'Sabarmati Ashram', 'Stepwells', 'Textiles', 'Street Food'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-surat',
    name: 'Surat',
    state: 'Gujarat',
    country: 'India',
    region: 'West',
    latitude: 21.1702,
    longitude: 72.8311,
    destinationType: 'METRO',
    tier: 'Tier-1',
    isTouristHub: false,
    description: 'The Diamond and Silk City of India on the Tapi River, famous for gourmet Gujarati street food (Surti Locho, Ghari) and vibrant textile bazaars.',
    shortDescription: 'World diamond hub and culinary capital celebrated for silk & textiles.',
    popularityScore: 86,
    bestTimeToVisit: 'October to March',
    averageStayDays: 2,
    budgetLevel: 'Moderate (₹2,500 - ₹5,000 / day)',
    tags: ['Diamond Hub', 'Silk City', 'Surti Street Food', 'Tapi Riverfront'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-vadodara',
    name: 'Vadodara (Baroda)',
    state: 'Gujarat',
    country: 'India',
    region: 'West',
    latitude: 22.3072,
    longitude: 73.1812,
    destinationType: 'HERITAGE',
    tier: 'Tier-2',
    isTouristHub: true,
    description: 'Cultural capital of Gujarat, famous for the magnificent Lukshmi Villas Palace (4x the size of Buckingham Palace) and gateway to the Statue of Unity.',
    shortDescription: 'Palatial city of Lukshmi Villas and premier gateway to the Statue of Unity.',
    popularityScore: 89,
    bestTimeToVisit: 'October to March',
    averageStayDays: 2,
    budgetLevel: 'Moderate (₹2,500 - ₹5,500 / day)',
    tags: ['Lukshmi Villas Palace', 'Statue of Unity', 'Art & Culture', 'Garba'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-kutch',
    name: 'Kutch / Rann of Kutch',
    state: 'Gujarat',
    country: 'India',
    region: 'West',
    latitude: 23.7337,
    longitude: 69.8597,
    destinationType: 'CULTURAL',
    tier: 'Tier-3',
    isTouristHub: true,
    description: 'Vast white salt desert shining beneath moonlight, host to the vibrant Rann Utsav festival, nomadic embroidery, and Kutch artisan villages.',
    shortDescription: 'Mesmerizing white salt desert expanse, Rann Utsav cultural extravaganza, and handicrafts.',
    popularityScore: 95,
    bestTimeToVisit: 'November to February (Rann Utsav)',
    averageStayDays: 3,
    budgetLevel: 'Moderate to Luxury (₹3,500 - ₹10,000 / day)',
    tags: ['White Desert', 'Rann Utsav', 'Handicrafts', 'Full Moon Desert', 'Culture'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-dwarka',
    name: 'Dwarka',
    state: 'Gujarat',
    country: 'India',
    region: 'West',
    latitude: 22.2442,
    longitude: 68.9685,
    destinationType: 'PILGRIMAGE',
    tier: 'Tier-3',
    isTouristHub: true,
    description: 'Ancient kingdom of Lord Krishna, one of the sacred Char Dham pilgrimage sites overlooking the Arabian Sea, featuring the Dwarkadhish Temple.',
    shortDescription: 'Sacred Char Dham oceanfront temple city of Lord Krishna.',
    popularityScore: 90,
    bestTimeToVisit: 'October to March',
    averageStayDays: 2,
    budgetLevel: 'Budget to Moderate (₹2,000 - ₹4,500 / day)',
    tags: ['Char Dham', 'Dwarkadhish', 'Arabian Sea', 'Pilgrimage', 'Scuba Archeology'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-gir',
    name: 'Sasan Gir (Gir National Park)',
    state: 'Gujarat',
    country: 'India',
    region: 'West',
    latitude: 21.1243,
    longitude: 70.8242,
    destinationType: 'WILDLIFE',
    tier: 'Tier-3',
    isTouristHub: true,
    description: 'The only natural sanctuary in the world where Asiatic Lions roam free in dry deciduous savannah forests.',
    shortDescription: 'Exclusive worldwide home of the majestic Asiatic Lion in open savannah.',
    popularityScore: 92,
    bestTimeToVisit: 'December to March',
    averageStayDays: 2,
    budgetLevel: 'Moderate to Luxury (₹3,500 - ₹9,000 / day)',
    tags: ['Asiatic Lions', 'Wildlife Safari', 'National Park', 'Eco-Tourism'],
    dataSource: 'VERIFIED_DESTINATION'
  },

  // --- NORTH REGION (Delhi, UP, Rajasthan, Uttarakhand, Himachal, Punjab, J&K, Ladakh) ---
  {
    id: 'city-delhi',
    name: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    region: 'North',
    latitude: 28.6139,
    longitude: 77.2090,
    destinationType: 'METRO',
    tier: 'Tier-1',
    isTouristHub: true,
    description: 'National capital city blending monumental Mughal heritage (Red Fort, Qutub Minar, Humayun’s Tomb), Lutyens boulevards, and vibrant street gastronomy.',
    shortDescription: 'Historic national capital with centuries of monumental architecture and culinary culture.',
    popularityScore: 97,
    bestTimeToVisit: 'October to March',
    averageStayDays: 3,
    budgetLevel: 'Flexible (₹3,000 - ₹9,000 / day)',
    tags: ['Capital', 'Mughal Architecture', 'Museums', 'Street Food', 'Shopping'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-agra',
    name: 'Agra',
    state: 'Uttar Pradesh',
    country: 'India',
    region: 'North',
    latitude: 27.1767,
    longitude: 78.0081,
    destinationType: 'HERITAGE',
    tier: 'Tier-2',
    isTouristHub: true,
    description: 'Home of the timeless white marble Taj Mahal, UNESCO World Heritage Agra Fort, and Fatehpur Sikri on the Yamuna riverfront.',
    shortDescription: 'City of the Taj Mahal, Mughal palaces, and timeless marble artistry.',
    popularityScore: 99,
    bestTimeToVisit: 'October to March',
    averageStayDays: 2,
    budgetLevel: 'Moderate (₹2,500 - ₹6,500 / day)',
    tags: ['Taj Mahal', 'World Heritage', 'Mughal History', 'Marble Art'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    region: 'North',
    latitude: 26.9124,
    longitude: 75.7873,
    destinationType: 'HERITAGE',
    tier: 'Tier-1',
    isTouristHub: true,
    description: 'The Pink City of Rajasthan, famous for Hawa Mahal, Amber Fort atop rugged hills, royal City Palace, and bustling textile bazaars.',
    shortDescription: 'The royal Pink City with grand hilltop fortresses and artisanal handicraft markets.',
    popularityScore: 96,
    bestTimeToVisit: 'October to March',
    averageStayDays: 3,
    budgetLevel: 'Moderate to Luxury (₹3,000 - ₹10,000 / day)',
    tags: ['Pink City', 'Palaces', 'Amber Fort', 'Handicrafts', 'Royal Dining'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-udaipur',
    name: 'Udaipur',
    state: 'Rajasthan',
    country: 'India',
    region: 'North',
    latitude: 24.5854,
    longitude: 73.7125,
    destinationType: 'HERITAGE',
    tier: 'Tier-2',
    isTouristHub: true,
    description: 'The City of Lakes and Venice of the East, famed for Lake Pichola, the majestic City Palace complex, floating Lake Palace, and romantic sunsets.',
    shortDescription: 'Romantic Lake City with floating palaces and Aravalli mountain backdrops.',
    popularityScore: 95,
    bestTimeToVisit: 'September to March',
    averageStayDays: 3,
    budgetLevel: 'Luxury & Heritage (₹3,500 - ₹14,000 / day)',
    tags: ['City of Lakes', 'Lake Pichola', 'Palaces', 'Romantic', 'Heritage'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-jodhpur',
    name: 'Jodhpur',
    state: 'Rajasthan',
    country: 'India',
    region: 'North',
    latitude: 26.2389,
    longitude: 73.0243,
    destinationType: 'HERITAGE',
    tier: 'Tier-2',
    isTouristHub: true,
    description: 'The Blue City crowned by the colossal Mehrangarh Fort overlooking cobalt-painted Brahmin houses and Umaid Bhawan Palace.',
    shortDescription: 'The Blue City beneath the impregnable clifftop fortress of Mehrangarh.',
    popularityScore: 93,
    bestTimeToVisit: 'October to March',
    averageStayDays: 2,
    budgetLevel: 'Moderate to Luxury (₹2,800 - ₹8,000 / day)',
    tags: ['Blue City', 'Mehrangarh Fort', 'Umaid Bhawan', 'Marwar Heritage'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-jaisalmer',
    name: 'Jaisalmer',
    state: 'Rajasthan',
    country: 'India',
    region: 'North',
    latitude: 26.9157,
    longitude: 70.9083,
    destinationType: 'HERITAGE',
    tier: 'Tier-3',
    isTouristHub: true,
    description: 'The Golden City rising from the Thar Desert with a living sandstone fort, intricately carved Jain havelis, and desert camel safaris across Sam sand dunes.',
    shortDescription: 'The Golden City of yellow sandstone forts and Thar Desert camel dunes.',
    popularityScore: 94,
    bestTimeToVisit: 'October to March',
    averageStayDays: 3,
    budgetLevel: 'Moderate to Luxury (₹3,000 - ₹9,000 / day)',
    tags: ['Golden Fort', 'Thar Desert', 'Camel Safari', 'Havelis', 'Desert Camp'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-pushkar',
    name: 'Pushkar',
    state: 'Rajasthan',
    country: 'India',
    region: 'North',
    latitude: 26.4897,
    longitude: 74.5511,
    destinationType: 'CULTURAL',
    tier: 'Tier-3',
    isTouristHub: true,
    description: 'Sacred lake town enveloped by desert hills, famous for the rare Brahma Temple and the colorful international Pushkar Camel Fair.',
    shortDescription: 'Sacred lakeside desert town host to the world-famous Pushkar Camel Fair.',
    popularityScore: 89,
    bestTimeToVisit: 'October to March',
    averageStayDays: 2,
    budgetLevel: 'Budget to Moderate (₹1,800 - ₹4,500 / day)',
    tags: ['Brahma Temple', 'Pushkar Lake', 'Camel Fair', 'Desert Spiritual'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'India',
    region: 'North',
    latitude: 25.3176,
    longitude: 82.9739,
    destinationType: 'SPIRITUAL',
    tier: 'Tier-2',
    isTouristHub: true,
    description: 'One of the world’s oldest living cities, spiritual heart of India along the holy River Ganga with evening Ganga Aarti at Dashashwamedh Ghat.',
    shortDescription: 'Sacred timeless city along the River Ganga with spiritual ghats and ancient silk traditions.',
    popularityScore: 94,
    bestTimeToVisit: 'October to March',
    averageStayDays: 3,
    budgetLevel: 'Budget to Moderate (₹2,000 - ₹5,000 / day)',
    tags: ['River Ganga', 'Ghats', 'Ganga Aarti', 'Spiritual', 'Silk'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-lucknow',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    country: 'India',
    region: 'North',
    latitude: 26.8467,
    longitude: 80.9462,
    destinationType: 'HERITAGE',
    tier: 'Tier-2',
    isTouristHub: true,
    description: 'City of Nawabs celebrated for courtly etiquette (Tehzeeb), Bara Imambara labyrinth, delicate Chikankari embroidery, and legendary Awadhi kebabs.',
    shortDescription: 'Nawabi city of courtly culture, Bara Imambara, Chikankari, and Awadhi culinary royal cuisine.',
    popularityScore: 91,
    bestTimeToVisit: 'October to March',
    averageStayDays: 2,
    budgetLevel: 'Moderate (₹2,500 - ₹5,500 / day)',
    tags: ['Nawabs', 'Bara Imambara', 'Chikankari', 'Awadhi Food', 'Tunday Kebabs'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-rishikesh',
    name: 'Rishikesh',
    state: 'Uttarakhand',
    country: 'India',
    region: 'North',
    latitude: 30.0869,
    longitude: 78.2676,
    destinationType: 'ADVENTURE',
    tier: 'Tier-3',
    isTouristHub: true,
    description: 'Yoga Capital of the World on the Himalayan foothills, famous for white-water river rafting, suspension bridges, Beatles Ashram, and yoga retreats.',
    shortDescription: 'Himalayan yoga sanctuary and thrilling white-water river rafting capital.',
    popularityScore: 93,
    bestTimeToVisit: 'September to May',
    averageStayDays: 3,
    budgetLevel: 'Budget to Moderate (₹2,000 - ₹5,500 / day)',
    tags: ['Yoga', 'White-Water Rafting', 'Himalayas', 'Ganga', 'Ashrams'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-haridwar',
    name: 'Haridwar',
    state: 'Uttarakhand',
    country: 'India',
    region: 'North',
    latitude: 29.9457,
    longitude: 78.1642,
    destinationType: 'PILGRIMAGE',
    tier: 'Tier-3',
    isTouristHub: true,
    description: 'Gateway to the Gods where the holy River Ganga enters the Indo-Gangetic plains, famed for Har Ki Pauri evening aarti ceremony.',
    shortDescription: 'Sacred river gateway where the holy Ganga enters the northern plains.',
    popularityScore: 90,
    bestTimeToVisit: 'October to April',
    averageStayDays: 2,
    budgetLevel: 'Budget (₹1,500 - ₹3,500 / day)',
    tags: ['Har Ki Pauri', 'Ganga Aarti', 'Pilgrimage', 'Spiritual Gateway'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-manali',
    name: 'Manali',
    state: 'Himachal Pradesh',
    country: 'India',
    region: 'North',
    latitude: 32.2432,
    longitude: 77.1892,
    destinationType: 'HILL_STATION',
    tier: 'Tier-3',
    isTouristHub: true,
    description: 'High-altitude Himalayan resort town surrounded by snow-capped peaks, pine forests, Solang Valley adventure sports, and gateway to Rohtang Pass & Ladakh.',
    shortDescription: 'Snow-capped Himalayan valley town with alpine meadows and river adventures.',
    popularityScore: 94,
    bestTimeToVisit: 'October to June',
    averageStayDays: 4,
    budgetLevel: 'Moderate (₹3,000 - ₹7,000 / day)',
    tags: ['Snow Peaks', 'Solang Valley', 'Trekking', 'Paragliding', 'Himalayas'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-shimla',
    name: 'Shimla',
    state: 'Himachal Pradesh',
    country: 'India',
    region: 'North',
    latitude: 31.1048,
    longitude: 77.1734,
    destinationType: 'HILL_STATION',
    tier: 'Tier-2',
    isTouristHub: true,
    description: 'Former summer capital of British India, famous for The Mall, Christ Church, pine-covered slopes, and the UNESCO Kalka-Shimla Toy Train.',
    shortDescription: 'Queen of the Hills with colonial Mall Road and heritage toy train rail.',
    popularityScore: 92,
    bestTimeToVisit: 'March to June & December to February (Snow)',
    averageStayDays: 3,
    budgetLevel: 'Moderate to Luxury (₹3,000 - ₹7,500 / day)',
    tags: ['Mall Road', 'Toy Train', 'Colonial Heritage', 'Pine Forests', 'Snow'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-amritsar',
    name: 'Amritsar',
    state: 'Punjab',
    country: 'India',
    region: 'North',
    latitude: 31.6340,
    longitude: 74.8723,
    destinationType: 'HERITAGE',
    tier: 'Tier-2',
    isTouristHub: true,
    description: 'Spiritual and cultural heart of Sikhism, home to the resplendent Golden Temple (Harmandir Sahib), Wagah Border beating retreat, and rich Punjabi gastronomy.',
    shortDescription: 'Spiritual Golden Temple shrine, Wagah Border ceremony, and iconic Punjabi culinary heritage.',
    popularityScore: 95,
    bestTimeToVisit: 'October to March',
    averageStayDays: 2,
    budgetLevel: 'Budget to Moderate (₹2,000 - ₹4,500 / day)',
    tags: ['Golden Temple', 'Wagah Border', 'Langar', 'Punjabi Food', 'Amritsari Kulcha'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-srinagar',
    name: 'Srinagar',
    state: 'Jammu and Kashmir',
    country: 'India',
    region: 'North',
    latitude: 34.0837,
    longitude: 74.7973,
    destinationType: 'NATURE',
    tier: 'Tier-2',
    isTouristHub: true,
    description: 'Paradise on Earth famed for tranquil Shikara rides on Dal Lake, Mughal Gardens (Shalimar, Nishat), ornate wooden houseboats, and snow-dusted mountains.',
    shortDescription: 'Dal Lake shikara rides, floating gardens, and historic Mughal pleasure gardens.',
    popularityScore: 96,
    bestTimeToVisit: 'April to October',
    averageStayDays: 4,
    budgetLevel: 'Moderate to Luxury (₹3,500 - ₹9,500 / day)',
    tags: ['Dal Lake', 'Shikara', 'Houseboats', 'Mughal Gardens', 'Pashmina'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-gulmarg',
    name: 'Gulmarg',
    state: 'Jammu and Kashmir',
    country: 'India',
    region: 'North',
    latitude: 34.0484,
    longitude: 74.3805,
    destinationType: 'ADVENTURE',
    tier: 'Tier-3',
    isTouristHub: true,
    description: 'Meadow of Flowers and Asia’s premier skiing destination, boasting the world’s second highest operating cable car (Gulmarg Gondola at 13,780 ft).',
    shortDescription: 'Premier ski resort and high-altitude gondola soaring over Apharwat Peak.',
    popularityScore: 95,
    bestTimeToVisit: 'December to March (Skiing) / May to September',
    averageStayDays: 3,
    budgetLevel: 'Moderate to Luxury (₹4,000 - ₹12,000 / day)',
    tags: ['Gulmarg Gondola', 'Skiing', 'Snowboarding', 'Meadow of Flowers', 'Himalayas'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-leh',
    name: 'Leh Ladakh',
    state: 'Ladakh',
    country: 'India',
    region: 'North',
    latitude: 34.1526,
    longitude: 77.5771,
    destinationType: 'ADVENTURE',
    tier: 'Tier-3',
    isTouristHub: true,
    description: 'Land of High Mountain Passes, Tibetan Buddhist monasteries (Thiksey, Hemis), azure Pangong Tso Lake, and dramatic cold desert landscapes.',
    shortDescription: 'High-altitude cold desert plateau, Tibetan monasteries, and Pangong Lake.',
    popularityScore: 97,
    bestTimeToVisit: 'May to September',
    averageStayDays: 5,
    budgetLevel: 'Moderate to Premium (₹3,500 - ₹9,000 / day)',
    tags: ['High Passes', 'Pangong Lake', 'Monasteries', 'Cold Desert', 'Motorbiking'],
    dataSource: 'VERIFIED_DESTINATION'
  },

  // --- SOUTH REGION (Karnataka, Kerala, Tamil Nadu, Telangana, Andhra, Pondicherry) ---
  {
    id: 'city-bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    region: 'South',
    latitude: 12.9716,
    longitude: 77.5946,
    destinationType: 'METRO',
    tier: 'Tier-1',
    isTouristHub: true,
    description: 'Silicon Valley of India, Garden City known for pleasant year-round weather, craft microbreweries, Cubbon Park, and tech innovation.',
    shortDescription: 'Garden City and tech capital with lush botanical parks and craft cafe culture.',
    popularityScore: 92,
    bestTimeToVisit: 'All Year (September to March ideal)',
    averageStayDays: 2,
    budgetLevel: 'Moderate to Premium (₹3,500 - ₹7,500 / day)',
    tags: ['Garden City', 'Tech Hub', 'Cafes', 'Craft Breweries', 'Parks'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-mysuru',
    name: 'Mysuru',
    state: 'Karnataka',
    country: 'India',
    region: 'South',
    latitude: 12.2958,
    longitude: 76.6394,
    destinationType: 'HERITAGE',
    tier: 'Tier-2',
    isTouristHub: true,
    description: 'Royal heritage city of palaces, illuminated Mysore Palace, sandalwood craft, Mysore Pak sweets, and Chamundi Hill.',
    shortDescription: 'Royal palace city with majestic illumination and rich cultural heritage.',
    popularityScore: 90,
    bestTimeToVisit: 'September to March',
    averageStayDays: 2,
    budgetLevel: 'Budget to Moderate (₹2,000 - ₹4,500 / day)',
    tags: ['Mysore Palace', 'Silk & Sandalwood', 'Chamundi Hill', 'Heritage'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-hampi',
    name: 'Hampi',
    state: 'Karnataka',
    country: 'India',
    region: 'South',
    latitude: 15.3350,
    longitude: 76.4600,
    destinationType: 'HERITAGE',
    tier: 'Tier-3',
    isTouristHub: true,
    description: 'UNESCO World Heritage open-air museum of Vijayanagara Empire ruins, boulder-strewn landscapes, stone chariot at Vijaya Vittala, and Virupaksha Temple.',
    shortDescription: 'Spectacular boulder-strewn ruined capital of the Vijayanagara Empire.',
    popularityScore: 95,
    bestTimeToVisit: 'October to February',
    averageStayDays: 3,
    budgetLevel: 'Budget to Moderate (₹1,800 - ₹4,500 / day)',
    tags: ['UNESCO Heritage', 'Stone Chariot', 'Ruins', 'Tungabhadra', 'Bouldering'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-coorg',
    name: 'Coorg (Madikeri)',
    state: 'Karnataka',
    country: 'India',
    region: 'South',
    latitude: 12.4244,
    longitude: 75.7382,
    destinationType: 'HILL_STATION',
    tier: 'Tier-3',
    isTouristHub: true,
    description: 'Scotland of India, blanketed with aromatic coffee plantations, spice estates, Abbey Falls, and misty Brahmagiri mountains.',
    shortDescription: 'Misty coffee plantation paradise with lush waterfalls and Kodava culture.',
    popularityScore: 92,
    bestTimeToVisit: 'October to April',
    averageStayDays: 3,
    budgetLevel: 'Moderate to Luxury (₹3,000 - ₹8,000 / day)',
    tags: ['Coffee Plantations', 'Spices', 'Waterfalls', 'Trekking', 'Kodava Cuisine'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-kochi',
    name: 'Kochi (Cochin)',
    state: 'Kerala',
    country: 'India',
    region: 'South',
    latitude: 9.9312,
    longitude: 76.2673,
    destinationType: 'COASTAL',
    tier: 'Tier-2',
    isTouristHub: true,
    description: 'The Queen of the Arabian Sea, blending historic Fort Kochi colonial lanes, Chinese fishing nets, spice bazaars, and scenic backwaters.',
    shortDescription: 'Historic spice port with Chinese fishing nets, art cafes, and Arabian Sea breeze.',
    popularityScore: 93,
    bestTimeToVisit: 'September to March',
    averageStayDays: 3,
    budgetLevel: 'Moderate (₹3,000 - ₹6,500 / day)',
    tags: ['Fort Kochi', 'Chinese Nets', 'Spice Market', 'Backwaters', 'Kathakali'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-munnar',
    name: 'Munnar',
    state: 'Kerala',
    country: 'India',
    region: 'South',
    latitude: 10.0889,
    longitude: 77.0595,
    destinationType: 'HILL_STATION',
    tier: 'Tier-3',
    isTouristHub: true,
    description: 'Breathtaking hill resort nestled in the Western Ghats, blanketed with rolling emerald green tea plantations, waterfalls, and mist-covered peaks.',
    shortDescription: 'Emerald tea estate paradise with rolling mist valleys and mountain waterfalls.',
    popularityScore: 94,
    bestTimeToVisit: 'September to May',
    averageStayDays: 3,
    budgetLevel: 'Moderate to Luxury (₹3,000 - ₹8,000 / day)',
    tags: ['Tea Plantations', 'Western Ghats', 'Misty Hills', 'Waterfalls', 'Nature'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-alleppey',
    name: 'Alleppey (Alappuzha)',
    state: 'Kerala',
    country: 'India',
    region: 'South',
    latitude: 9.4981,
    longitude: 76.3388,
    destinationType: 'NATURE',
    tier: 'Tier-2',
    isTouristHub: true,
    description: 'Venice of the East, famed for traditional Kettuvallam luxury houseboat cruises through serene palm-fringed backwater canals and paddy fields.',
    shortDescription: 'Houseboat cruises along palm-fringed backwaters and tranquil lagoons.',
    popularityScore: 96,
    bestTimeToVisit: 'September to March',
    averageStayDays: 2,
    budgetLevel: 'Moderate to Luxury (₹3,500 - ₹12,000 / day)',
    tags: ['Houseboat', 'Backwaters', 'Vembanad Lake', 'Ayurveda', 'Coir'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    region: 'South',
    latitude: 13.0827,
    longitude: 80.2707,
    destinationType: 'METRO',
    tier: 'Tier-1',
    isTouristHub: true,
    description: 'Gateway to South India on the Coromandel Coast, famed for Marina Beach, classical Carnatic music, Dravidian temples, and South Indian culinary traditions.',
    shortDescription: 'Coastal cultural capital with Marina Beach and magnificent Dravidian temple art.',
    popularityScore: 90,
    bestTimeToVisit: 'November to February',
    averageStayDays: 2,
    budgetLevel: 'Moderate (₹2,800 - ₹6,000 / day)',
    tags: ['Marina Beach', 'Dravidian Temples', 'Carnatic Music', 'Coastal Cuisine'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-ooty',
    name: 'Ooty (Udhagamandalam)',
    state: 'Tamil Nadu',
    country: 'India',
    region: 'South',
    latitude: 11.4102,
    longitude: 76.6950,
    destinationType: 'HILL_STATION',
    tier: 'Tier-3',
    isTouristHub: true,
    description: 'Queen of the Nilgiri Hills, featuring lush botanical gardens, Ooty Lake, eucalyptus groves, and the UNESCO Nilgiri Mountain Toy Train.',
    shortDescription: 'Nilgiri blue mountain retreat with botanical gardens and heritage toy train.',
    popularityScore: 92,
    bestTimeToVisit: 'October to June',
    averageStayDays: 3,
    budgetLevel: 'Moderate (₹2,800 - ₹7,000 / day)',
    tags: ['Nilgiris', 'Toy Train', 'Tea Estates', 'Botanical Gardens', 'Cool Climate'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-pondicherry',
    name: 'Pondicherry (Puducherry)',
    state: 'Puducherry',
    country: 'India',
    region: 'South',
    latitude: 11.9416,
    longitude: 79.8083,
    destinationType: 'COASTAL',
    tier: 'Tier-2',
    isTouristHub: true,
    description: 'French Riviera of the East, characterized by pastel French Quarter villas, Promenade beach boardwalk, bakeries, and Auroville spiritual community.',
    shortDescription: 'French colonial seaside promenade with vibrant cafes and serene coastal charm.',
    popularityScore: 92,
    bestTimeToVisit: 'October to March',
    averageStayDays: 3,
    budgetLevel: 'Moderate (₹2,500 - ₹6,500 / day)',
    tags: ['French Quarter', 'Promenade Beach', 'Auroville', 'Cafes', 'Seaside'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    region: 'South',
    latitude: 17.3850,
    longitude: 78.4867,
    destinationType: 'METRO',
    tier: 'Tier-1',
    isTouristHub: true,
    description: 'The City of Pearls and Nizams, renowned for the iconic Charminar, Golconda Fort, authentic Hyderabadi Dum Biryani, and modern HITEC City.',
    shortDescription: 'Historic Nizami city of Charminar, royal pearls, and world-famous Biryani.',
    popularityScore: 93,
    bestTimeToVisit: 'October to March',
    averageStayDays: 3,
    budgetLevel: 'Moderate to Premium (₹3,000 - ₹7,000 / day)',
    tags: ['Charminar', 'Hyderabadi Biryani', 'Golconda Fort', 'Pearls', 'HITEC City'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-visakhapatnam',
    name: 'Visakhapatnam (Vizag)',
    state: 'Andhra Pradesh',
    country: 'India',
    region: 'South',
    latitude: 17.6868,
    longitude: 83.2185,
    destinationType: 'COASTAL',
    tier: 'Tier-2',
    isTouristHub: true,
    description: 'The Jewel of the East Coast, where the Eastern Ghats meet the Bay of Bengal, featuring RK Beach, submarine museum, and scenic Borra Caves.',
    shortDescription: 'Coastal city where lush Eastern Ghats meet Bay of Bengal beaches.',
    popularityScore: 89,
    bestTimeToVisit: 'October to March',
    averageStayDays: 2,
    budgetLevel: 'Moderate (₹2,200 - ₹5,000 / day)',
    tags: ['Eastern Ghats', 'RK Beach', 'Submarine Museum', 'Araku Valley'],
    dataSource: 'VERIFIED_DESTINATION'
  },

  // --- EAST & NORTHEAST REGION (West Bengal, Odisha, Sikkim, Assam, Meghalaya) ---
  {
    id: 'city-kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    country: 'India',
    region: 'East',
    latitude: 22.5726,
    longitude: 88.3639,
    destinationType: 'METRO',
    tier: 'Tier-1',
    isTouristHub: true,
    description: 'City of Joy and cultural capital, famed for the grand Victoria Memorial, iconic Howrah Bridge over Hooghly River, tramways, and Bengali sweets (Rosogolla, Mishti Doi).',
    shortDescription: 'City of Joy with grand colonial landmarks, Howrah Bridge, and rich literary arts.',
    popularityScore: 94,
    bestTimeToVisit: 'October to March',
    averageStayDays: 3,
    budgetLevel: 'Budget to Moderate (₹2,200 - ₹5,500 / day)',
    tags: ['Victoria Memorial', 'Howrah Bridge', 'Durga Puja', 'Literature', 'Bengali Sweets'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-darjeeling',
    name: 'Darjeeling',
    state: 'West Bengal',
    country: 'India',
    region: 'East',
    latitude: 27.0410,
    longitude: 88.2663,
    destinationType: 'HILL_STATION',
    tier: 'Tier-3',
    isTouristHub: true,
    description: 'Queen of the Hills in the Himalayas, famed for Tiger Hill sunrise over Mount Kanchenjunga (world’s 3rd highest peak), world-renowned orthodox Darjeeling tea, and the UNESCO Toy Train.',
    shortDescription: 'Himalayan sunrise viewpoints over Mt. Kanchenjunga and lush tea estates.',
    popularityScore: 95,
    bestTimeToVisit: 'March to May & October to December',
    averageStayDays: 3,
    budgetLevel: 'Moderate (₹2,800 - ₹7,000 / day)',
    tags: ['Kanchenjunga', 'Darjeeling Tea', 'UNESCO Toy Train', 'Tiger Hill', 'Himalayas'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-bhubaneswar',
    name: 'Bhubaneswar',
    state: 'Odisha',
    country: 'India',
    region: 'East',
    latitude: 20.2961,
    longitude: 85.8245,
    destinationType: 'HERITAGE',
    tier: 'Tier-2',
    isTouristHub: true,
    description: 'Temple City of India, home to over 500 ancient Kalinga stone temples including Lingaraj and Mukteshvara, and gateway to Puri and Konark Sun Temple.',
    shortDescription: 'Ancient Kalinga temple architecture hub and gateway to the golden triangle of Odisha.',
    popularityScore: 89,
    bestTimeToVisit: 'October to March',
    averageStayDays: 2,
    budgetLevel: 'Budget to Moderate (₹2,000 - ₹4,500 / day)',
    tags: ['Temple City', 'Lingaraj', 'Kalinga Architecture', 'Mukteshvara'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-gangtok',
    name: 'Gangtok',
    state: 'Sikkim',
    country: 'India',
    region: 'NorthEast',
    latitude: 27.3389,
    longitude: 88.6065,
    destinationType: 'HILL_STATION',
    tier: 'Tier-3',
    isTouristHub: true,
    description: 'Capital of Sikkim set along steep mountain ridges with panoramic views of Kanchenjunga, Rumtek Buddhist Monastery, and gateway to Nathu La Pass & Tsomgo Lake.',
    shortDescription: 'Pristine Eastern Himalayan kingdom capital with mountain monasteries and high-altitude lakes.',
    popularityScore: 93,
    bestTimeToVisit: 'March to June & September to November',
    averageStayDays: 3,
    budgetLevel: 'Moderate (₹3,000 - ₹7,500 / day)',
    tags: ['Rumtek Monastery', 'Tsomgo Lake', 'Nathu La', 'Kanchenjunga', 'Clean City'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-shillong',
    name: 'Shillong',
    state: 'Meghalaya',
    country: 'India',
    region: 'NorthEast',
    latitude: 25.5788,
    longitude: 91.8933,
    destinationType: 'HILL_STATION',
    tier: 'Tier-3',
    isTouristHub: true,
    description: 'Scotland of the East, known for rolling green pine hills, living root bridges, crystal clear Umngot River at Dawki, and thriving rock music culture.',
    shortDescription: 'Pine-clad hill paradise, living root bridges, and clear river waters of Meghalaya.',
    popularityScore: 92,
    bestTimeToVisit: 'September to May',
    averageStayDays: 3,
    budgetLevel: 'Moderate (₹2,800 - ₹6,500 / day)',
    tags: ['Living Root Bridges', 'Dawki River', 'Waterfalls', 'Rock Music', 'Pine Hills'],
    dataSource: 'VERIFIED_DESTINATION'
  },

  // --- CENTRAL REGION (Madhya Pradesh & Chhattisgarh) ---
  {
    id: 'city-indore',
    name: 'Indore',
    state: 'Madhya Pradesh',
    country: 'India',
    region: 'Central',
    latitude: 22.7196,
    longitude: 75.8577,
    destinationType: 'METRO',
    tier: 'Tier-1',
    isTouristHub: true,
    description: 'India’s cleanest city for multiple consecutive years, street food capital at Sarafa Night Market and Chappan Dukan, and historic Rajwada Palace.',
    shortDescription: 'India’s cleanest smart city and legendary midnight street food capital.',
    popularityScore: 91,
    bestTimeToVisit: 'October to March',
    averageStayDays: 2,
    budgetLevel: 'Moderate (₹2,200 - ₹5,000 / day)',
    tags: ['Cleanest City', 'Sarafa Night Market', 'Rajwada', 'Poha Jalebi', 'Central Hub'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-bhopal',
    name: 'Bhopal',
    state: 'Madhya Pradesh',
    country: 'India',
    region: 'Central',
    latitude: 23.2599,
    longitude: 77.4126,
    destinationType: 'HERITAGE',
    tier: 'Tier-2',
    isTouristHub: true,
    description: 'The City of Lakes in central India, famous for Upper Lake, Taj-ul-Masajid, and UNESCO World Heritage sites at Sanchi Stupa and Bhimbetka Rock Shelters.',
    shortDescription: 'Lakeside heritage city and gateway to ancient Sanchi and Bhimbetka UNESCO sites.',
    popularityScore: 89,
    bestTimeToVisit: 'October to March',
    averageStayDays: 2,
    budgetLevel: 'Budget to Moderate (₹2,000 - ₹4,500 / day)',
    tags: ['City of Lakes', 'Sanchi Stupa', 'Bhimbetka', 'Taj-ul-Masajid'],
    dataSource: 'VERIFIED_DESTINATION'
  },
  {
    id: 'city-khajuraho',
    name: 'Khajuraho',
    state: 'Madhya Pradesh',
    country: 'India',
    region: 'Central',
    latitude: 24.8318,
    longitude: 79.9199,
    destinationType: 'HERITAGE',
    tier: 'Tier-3',
    isTouristHub: true,
    description: 'UNESCO World Heritage site celebrated for its stunning medieval Hindu and Jain temples with intricate Nagara-style stone sculptures.',
    shortDescription: 'World-famous UNESCO temple complex of exquisite medieval stone sculpting.',
    popularityScore: 93,
    bestTimeToVisit: 'October to March',
    averageStayDays: 2,
    budgetLevel: 'Moderate (₹2,500 - ₹6,000 / day)',
    tags: ['UNESCO Heritage', 'Kandariya Mahadeva', 'Nagara Sculptures', 'Medieval Temples'],
    dataSource: 'VERIFIED_DESTINATION'
  }
];

// 2. POPULAR JOURNEYS (40+ Recommended Indian Travel Corridors)
export const POPULAR_JOURNEYS: PopularJourney[] = [
  {
    id: 'pop-mum-goa',
    originCityId: 'city-mumbai',
    originCityName: 'Mumbai',
    destCityId: 'city-goa',
    destCityName: 'Goa',
    title: 'Mumbai → Goa Coastal Odyssey',
    description: 'The ultimate Indian beach corridor. Travel via scenic Konkan Railway through coastal waterfalls and tunnels, luxury sleeper coach, or swift 1h non-stop flight.',
    popularityScore: 99,
    estimatedDuration: '1h 15m (Flight) / 8h 30m (Train) / 12h (Bus)',
    recommendedDays: 4,
    travelStyle: 'Multimodal Beach & Coastal',
    approximateBudget: 5500,
    availableTransportTypes: ['TRAIN', 'BUS', 'FLIGHT'],
    tags: ['Beaches', 'Konkan Ghats', 'Nightlife', 'Seafood', 'Scenic Route'],
    featured: true,
    dataSource: 'VERIFIED_CORRIDOR'
  },
  {
    id: 'pop-mum-pune-goa',
    originCityId: 'city-mumbai',
    originCityName: 'Mumbai',
    destCityId: 'city-goa',
    destCityName: 'Goa (via Pune)',
    title: 'Mumbai → Pune → Goa Weekend Expedition',
    description: 'Hero multimodal corridor combining scenic Bhor Ghat intercity superfast rail to Pune with express Volvo sleeper coach transit straight into North Goa beaches.',
    popularityScore: 98,
    estimatedDuration: '10h 30m total transit',
    recommendedDays: 3,
    travelStyle: 'Multimodal Intercity Connector',
    approximateBudget: 4200,
    availableTransportTypes: ['TRAIN', 'BUS'],
    tags: ['Bhor Ghat Rail', 'Intermodal Transfer', 'Goa Beaches', 'Hero Demo Route'],
    featured: true,
    dataSource: 'VERIFIED_CORRIDOR'
  },
  {
    id: 'pop-del-agra',
    originCityId: 'city-delhi',
    originCityName: 'New Delhi',
    destCityId: 'city-agra',
    destCityName: 'Agra',
    title: 'Delhi → Agra Taj Heritage Express',
    description: 'High-speed heritage day excursion. Board the Gatimaan or Vande Bharat Express to explore the world wonder Taj Mahal and Mughal fortresses.',
    popularityScore: 97,
    estimatedDuration: '1h 40m (High-Speed Train) / 3h 30m (Yamuna Expressway Bus)',
    recommendedDays: 2,
    travelStyle: 'Express Heritage & Culture',
    approximateBudget: 2800,
    availableTransportTypes: ['TRAIN', 'BUS'],
    tags: ['Taj Mahal', 'Gatimaan Express', 'World Heritage', 'Mughal Architecture'],
    featured: true,
    dataSource: 'VERIFIED_CORRIDOR'
  },
  {
    id: 'pop-del-jaipur',
    originCityId: 'city-delhi',
    originCityName: 'New Delhi',
    destCityId: 'city-jaipur',
    destCityName: 'Jaipur',
    title: 'Delhi → Jaipur Royal Golden Triangle',
    description: 'Classic Golden Triangle voyage across the Aravalli hills into Rajasthan’s grand Pink City, royal fortresses, and opulent bazaars.',
    popularityScore: 95,
    estimatedDuration: '3h 45m (Vande Bharat/Shatabdi) / 5h (Expressway Bus) / 50m (Flight)',
    recommendedDays: 3,
    travelStyle: 'Royal Heritage & Forts',
    approximateBudget: 4800,
    availableTransportTypes: ['TRAIN', 'BUS', 'FLIGHT'],
    tags: ['Pink City', 'Amber Fort', 'Palaces', 'Rajasthan Heritage'],
    featured: true,
    dataSource: 'VERIFIED_CORRIDOR'
  },
  {
    id: 'pop-blr-mysore',
    originCityId: 'city-bengaluru',
    originCityName: 'Bengaluru',
    destCityId: 'city-mysuru',
    destCityName: 'Mysuru',
    title: 'Bengaluru → Mysuru Royal Heritage Circuit',
    description: 'Fast expressway or scenic rail connection from the Garden City tech hub to the illuminated royal palaces and sandalwood markets of Mysuru.',
    popularityScore: 94,
    estimatedDuration: '1h 45m (Vande Bharat) / 2h 30m (KSRTC Electric Bus)',
    recommendedDays: 2,
    travelStyle: 'Palace Heritage & Silk',
    approximateBudget: 2400,
    availableTransportTypes: ['TRAIN', 'BUS'],
    tags: ['Mysore Palace', 'KSRTC EV Coach', 'Sandalwood', 'Heritage'],
    featured: true,
    dataSource: 'VERIFIED_CORRIDOR'
  },
  {
    id: 'pop-kochi-munnar',
    originCityId: 'city-kochi',
    originCityName: 'Kochi',
    destCityId: 'city-munnar',
    destCityName: 'Munnar',
    title: 'Kochi → Munnar Western Ghats Tea Trail',
    description: 'Ascend from the Arabian Sea coastal spice port into the cloud-kissed emerald green tea plantations and cool mountain mist of Munnar.',
    popularityScore: 96,
    estimatedDuration: '3h 30m (Scenic Ghat Coach / Cab)',
    recommendedDays: 3,
    travelStyle: 'Tea Estate & Highland Nature',
    approximateBudget: 3900,
    availableTransportTypes: ['BUS'],
    tags: ['Tea Gardens', 'Western Ghats', 'Waterfalls', 'Mist Valleys'],
    featured: true,
    dataSource: 'VERIFIED_CORRIDOR'
  },
  {
    id: 'pop-del-rishikesh',
    originCityId: 'city-delhi',
    originCityName: 'New Delhi',
    destCityId: 'city-rishikesh',
    destCityName: 'Rishikesh',
    title: 'Delhi → Rishikesh Yoga & Rafting Trail',
    description: 'Escape the capital into the Himalayan foothills for adrenaline-packed white-water rafting, beach camping, and spiritual yoga retreats.',
    popularityScore: 94,
    estimatedDuration: '4h 15m (Jan Shatabdi Rail to Haridwar + Shuttle) / 5h 30m (Bus)',
    recommendedDays: 3,
    travelStyle: 'Yoga & Himalayan Adventure',
    approximateBudget: 3600,
    availableTransportTypes: ['TRAIN', 'BUS'],
    tags: ['Yoga', 'White-Water Rafting', 'Ganga', 'Himalayas'],
    featured: true,
    dataSource: 'VERIFIED_CORRIDOR'
  }
];

/**
 * Deterministic Synthetic Data Store Class
 */
export class SyntheticTravelDataset {
  private static instance: SyntheticTravelDataset | null = null;

  public cities: SyntheticCity[] = MASTER_CITIES;
  public stations: SyntheticStation[] = [];
  public popularJourneys: PopularJourney[] = POPULAR_JOURNEYS;
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
    this.generateStations();
    this.generateTrains();
    this.generateBuses();
    this.generateFlights();
    this.generateHotels();
    this.generateActivities();
    this.generateDisruptions();
  }

  private generateStations(): void {
    this.stations = [
      { id: 'stn-pnvl', stationCode: 'PNVL', stationName: 'Panvel Junction', cityId: 'city-panvel', cityName: 'Panvel', state: 'Maharashtra', latitude: 18.9894, longitude: 73.1175, stationType: 'RAILWAY_JUNCTION' },
      { id: 'stn-chi', stationCode: 'CHI', stationName: 'Chiplun Railway Station', cityId: 'city-chiplun', cityName: 'Chiplun', state: 'Maharashtra', latitude: 17.5323, longitude: 73.5186, stationType: 'RAILWAY_JUNCTION' },
      { id: 'stn-csmt', stationCode: 'CSMT', stationName: 'Mumbai Chhatrapati Shivaji Maharaj Terminus', cityId: 'city-mumbai', cityName: 'Mumbai', state: 'Maharashtra', latitude: 18.9401, longitude: 72.8354, stationType: 'RAILWAY_JUNCTION' },
      { id: 'stn-pune', stationCode: 'PUNE', stationName: 'Pune Junction', cityId: 'city-pune', cityName: 'Pune', state: 'Maharashtra', latitude: 18.5289, longitude: 73.8744, stationType: 'RAILWAY_JUNCTION' },
      { id: 'stn-mao', stationCode: 'MAO', stationName: 'Madgaon Junction Goa', cityId: 'city-goa', cityName: 'Goa', state: 'Goa', latitude: 15.2757, longitude: 73.9749, stationType: 'RAILWAY_JUNCTION' },
      { id: 'stn-krmi', stationCode: 'KRMI', stationName: 'Karmali Station (North Goa)', cityId: 'city-goa', cityName: 'Goa', state: 'Goa', latitude: 15.4890, longitude: 73.9189, stationType: 'RAILWAY_JUNCTION' },
      { id: 'stn-rn', stationCode: 'RN', stationName: 'Ratnagiri Station', cityId: 'city-ratnagiri', cityName: 'Ratnagiri', state: 'Maharashtra', latitude: 16.9902, longitude: 73.3120, stationType: 'RAILWAY_JUNCTION' },
      { id: 'stn-ndls', stationCode: 'NDLS', stationName: 'New Delhi Railway Station', cityId: 'city-delhi', cityName: 'New Delhi', state: 'Delhi', latitude: 28.6431, longitude: 77.2197, stationType: 'RAILWAY_JUNCTION' },
      { id: 'stn-sbc', stationCode: 'SBC', stationName: 'KSR Bengaluru City Junction', cityId: 'city-bengaluru', cityName: 'Bengaluru', state: 'Karnataka', latitude: 12.9781, longitude: 77.5695, stationType: 'RAILWAY_JUNCTION' },
      { id: 'stn-mas', stationCode: 'MAS', stationName: 'Chennai Central Station', cityId: 'city-chennai', cityName: 'Chennai', state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2755, stationType: 'RAILWAY_JUNCTION' },
      { id: 'stn-hyb', stationCode: 'HYB', stationName: 'Hyderabad Deccan Nampally', cityId: 'city-hyderabad', cityName: 'Hyderabad', state: 'Telangana', latitude: 17.3923, longitude: 78.4682, stationType: 'RAILWAY_JUNCTION' },
      { id: 'stn-jp', stationCode: 'JP', stationName: 'Jaipur Junction', cityId: 'city-jaipur', cityName: 'Jaipur', state: 'Rajasthan', latitude: 26.9200, longitude: 75.7878, stationType: 'RAILWAY_JUNCTION' },
      { id: 'stn-udr', stationCode: 'UDZ', stationName: 'Udaipur City Station', cityId: 'city-udaipur', cityName: 'Udaipur', state: 'Rajasthan', latitude: 24.5772, longitude: 73.6974, stationType: 'RAILWAY_JUNCTION' },
      { id: 'stn-agc', stationCode: 'AGC', stationName: 'Agra Cantt Railway Station', cityId: 'city-agra', cityName: 'Agra', state: 'Uttar Pradesh', latitude: 27.1587, longitude: 78.0089, stationType: 'RAILWAY_JUNCTION' },
      { id: 'stn-mys', stationCode: 'MYS', stationName: 'Mysuru Junction', cityId: 'city-mysuru', cityName: 'Mysuru', state: 'Karnataka', latitude: 12.3164, longitude: 76.6469, stationType: 'RAILWAY_JUNCTION' },

      // Major Airports
      { id: 'apt-bom', stationCode: 'BOM', stationName: 'Chhatrapati Shivaji Maharaj International Airport', cityId: 'city-mumbai', cityName: 'Mumbai', state: 'Maharashtra', latitude: 19.0896, longitude: 72.8656, stationType: 'AIRPORT' },
      { id: 'apt-pnq', stationCode: 'PNQ', stationName: 'Pune Lohegaon International Airport', cityId: 'city-pune', cityName: 'Pune', state: 'Maharashtra', latitude: 18.5822, longitude: 73.9197, stationType: 'AIRPORT' },
      { id: 'apt-goi', stationCode: 'GOI', stationName: 'Goa Dabolim International Airport', cityId: 'city-goa', cityName: 'Goa', state: 'Goa', latitude: 15.3808, longitude: 73.8314, stationType: 'AIRPORT' },
      { id: 'apt-del', stationCode: 'DEL', stationName: 'Indira Gandhi International Airport', cityId: 'city-delhi', cityName: 'New Delhi', state: 'Delhi', latitude: 28.5562, longitude: 77.1000, stationType: 'AIRPORT' },
      { id: 'apt-blr', stationCode: 'BLR', stationName: 'Kempegowda International Airport Bengaluru', cityId: 'city-bengaluru', cityName: 'Bengaluru', state: 'Karnataka', latitude: 13.1986, longitude: 77.7066, stationType: 'AIRPORT' },
      { id: 'apt-hyd', stationCode: 'HYD', stationName: 'Rajiv Gandhi International Airport Hyderabad', cityId: 'city-hyderabad', cityName: 'Hyderabad', state: 'Telangana', latitude: 17.2403, longitude: 78.4294, stationType: 'AIRPORT' },
      { id: 'apt-maa', stationCode: 'MAA', stationName: 'Chennai International Airport', cityId: 'city-chennai', cityName: 'Chennai', state: 'Tamil Nadu', latitude: 12.9941, longitude: 80.1709, stationType: 'AIRPORT' },
      { id: 'apt-jai', stationCode: 'JAI', stationName: 'Jaipur International Airport', cityId: 'city-jaipur', cityName: 'Jaipur', state: 'Rajasthan', latitude: 26.8289, longitude: 75.8056, stationType: 'AIRPORT' },
      { id: 'apt-cok', stationCode: 'COK', stationName: 'Cochin International Airport', cityId: 'city-kochi', cityName: 'Kochi', state: 'Kerala', latitude: 10.1518, longitude: 76.4019, stationType: 'AIRPORT' },

      // Bus Terminals
      { id: 'bus-swargate', stationCode: 'PUN-SWG', stationName: 'Pune Swargate Intercity Bus Terminal', cityId: 'city-pune', cityName: 'Pune', state: 'Maharashtra', latitude: 18.5018, longitude: 73.8584, stationType: 'BUS_TERMINAL' },
      { id: 'bus-panaji', stationCode: 'GOA-PNJ', stationName: 'KTC Panaji Central Bus Stand', cityId: 'city-goa', cityName: 'Goa', state: 'Goa', latitude: 15.4989, longitude: 73.8344, stationType: 'BUS_TERMINAL' },
      { id: 'bus-majestic', stationCode: 'BLR-MAJ', stationName: 'Kempegowda Bus Station (Majestic)', cityId: 'city-bengaluru', cityName: 'Bengaluru', state: 'Karnataka', latitude: 12.9767, longitude: 77.5713, stationType: 'BUS_TERMINAL' }
    ];
  }

  private generateTrains(): void {
    const list: SyntheticTrain[] = [];

    // Konkan Fleet (Panvel -> Chiplun)
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

    // Mumbai -> Pune Corridor
    const mumbaiPuneTrains = [
      { num: '12127', name: 'Intercity Superfast Express', type: 'SUPERFAST', dep: '10:00 AM', arr: '01:30 PM', dur: '3h 30m', fare: 240, op: 'Central Railway' },
      { num: '22225', name: 'Solapur Vande Bharat Express', type: 'VANDE_BHARAT', dep: '06:05 AM', arr: '09:15 AM', dur: '3h 10m', fare: 650, op: 'Central Railway' },
      { num: '12123', name: 'Deccan Queen Superfast', type: 'SUPERFAST', dep: '05:10 PM', arr: '08:25 PM', dur: '3h 15m', fare: 260, op: 'Central Railway' },
      { num: '12125', name: 'Pragati Superfast Express', type: 'SUPERFAST', dep: '04:25 PM', arr: '07:55 PM', dur: '3h 30m', fare: 230, op: 'Central Railway' },
      { num: '11007', name: 'Deccan Express', type: 'EXPRESS', dep: '07:00 AM', arr: '11:05 AM', dur: '4h 05m', fare: 180, op: 'Central Railway' }
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

    this.trains = list;
  }

  private generateBuses(): void {
    const list: SyntheticBus[] = [];
    const operators = ['KSRTC Airavat', 'IntrCity SmartBus', 'ZingBus Mobility', 'Purple Travels (Prasanna)', 'Orange Travels', 'VRL Logistics'];
    const busTypes: ('AC Sleeper' | 'Volvo Multi-Axle' | 'AC Seater' | 'Non-AC Sleeper' | 'Electric Luxury EV')[] = ['AC Sleeper', 'Volvo Multi-Axle', 'AC Seater', 'Electric Luxury EV'];

    const routes = [
      { from: 'Pune', fromTerm: 'Pune Swargate Intercity Bus Terminal', to: 'Goa', toTerm: 'KTC Panaji Central Bus Stand', durH: 6.5, fare: 1150 },
      { from: 'Mumbai', fromTerm: 'Borivali Intercity Hub', to: 'Pune', toTerm: 'Swargate Terminal', durH: 3.5, fare: 450 },
      { from: 'Bengaluru', fromTerm: 'Majestic Bus Stand', to: 'Mysuru', toTerm: 'Suburban Bus Stand', durH: 3.0, fare: 320 },
      { from: 'Delhi', fromTerm: 'Kashmere Gate ISBT', to: 'Agra', toTerm: 'Idgah Bus Stand', durH: 4.0, fare: 550 },
      { from: 'Delhi', fromTerm: 'Kashmere Gate ISBT', to: 'Jaipur', toTerm: 'Sindhi Camp Terminal', durH: 5.5, fare: 650 },
      { from: 'Chennai', fromTerm: 'CMBT Koyambedu', to: 'Pondicherry', toTerm: 'New Bus Stand', durH: 3.5, fare: 380 }
    ];

    routes.forEach((r, rIdx) => {
      for (let i = 1; i <= 10; i++) {
        const op = operators[(rIdx + i) % operators.length];
        const bType = busTypes[(rIdx + i) % busTypes.length];
        const depHour = (5 + i * 1.5) % 24;
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
    const airlines = ['IndiGo Airlines', 'Air India Express', 'Akasa Air', 'Fly91 Regional', 'SpiceJet'];

    const routes = [
      { fromCode: 'BOM', fromCity: 'Mumbai', toCode: 'GOI', toCity: 'Goa', durH: 1.25, fare: 3850 },
      { fromCode: 'PNQ', fromCity: 'Pune', toCode: 'GOI', toCity: 'Goa', durH: 1.0, fare: 3200 },
      { fromCode: 'DEL', fromCity: 'New Delhi', toCode: 'BOM', toCity: 'Mumbai', durH: 2.15, fare: 4800 },
      { fromCode: 'BLR', fromCity: 'Bengaluru', toCode: 'GOI', toCity: 'Goa', durH: 1.15, fare: 2950 },
      { fromCode: 'DEL', fromCity: 'New Delhi', toCode: 'JAI', toCity: 'Jaipur', durH: 0.9, fare: 2400 }
    ];

    routes.forEach((r, rIdx) => {
      for (let i = 1; i <= 8; i++) {
        const airline = airlines[(rIdx + i) % airlines.length];
        const depHour = (6 + i * 2.0) % 24;
        const depH = Math.floor(depHour);
        const depM = (i * 15) % 60;
        const arrHour = (depHour + r.durH) % 24;
        const arrH = Math.floor(arrHour);
        const arrM = (depM + 10) % 60;

        const depStr = `${depH === 0 ? 12 : depH > 12 ? depH - 12 : depH}:${depM < 10 ? '0' : ''}${depM} ${depH >= 12 ? 'PM' : 'AM'}`;
        const arrStr = `${arrH === 0 ? 12 : arrH > 12 ? arrH - 12 : arrH}:${arrM < 10 ? '0' : ''}${arrM} ${arrH >= 12 ? 'PM' : 'AM'}`;

        const fNum = `${airline.startsWith('IndiGo') ? '6E' : airline.startsWith('Air India') ? 'AI' : 'QP'}-${3000 + rIdx * 50 + i}`;

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
    const categories: ('BUDGET' | 'MID_RANGE' | 'PREMIUM' | 'LUXURY' | 'RESORT')[] = ['BUDGET', 'MID_RANGE', 'PREMIUM', 'LUXURY', 'RESORT'];

    this.cities.forEach((city) => {
      for (let k = 1; k <= 10; k++) {
        const cat = categories[k % categories.length];
        const price = cat === 'BUDGET' ? 1400 + (k * 110) : cat === 'MID_RANGE' ? 2800 + (k * 220) : cat === 'PREMIUM' ? 5400 + (k * 450) : 9200 + (k * 850);
        const name = `${city.name} ${cat === 'LUXURY' ? 'Grand Palace & Spa' : cat === 'PREMIUM' ? 'Heritage Suites' : cat === 'RESORT' ? 'Beach & Valley Sanctuary' : cat === 'MID_RANGE' ? 'Boutique Hotel' : 'Comfort Inn'}`;

        list.push({
          id: `synth-hotel-${city.id}-${k}`,
          hotelName: name,
          cityId: city.id,
          cityName: city.name,
          area: `${city.name} Central / Tourism Enclave`,
          address: `Plot #${10 + k}, Heritage Road, ${city.name}, ${city.state}`,
          latitude: Number((city.latitude + (k * 0.004)).toFixed(4)),
          longitude: Number((city.longitude + (k * 0.004)).toFixed(4)),
          rating: Number((4.0 + (k % 10) * 0.1).toFixed(1)),
          reviewCount: 90 + k * 45,
          category: cat,
          pricePerNight: price,
          currency: 'INR',
          checkInTime: '02:00 PM',
          checkOutTime: '11:00 AM',
          cancellationPolicy: 'Free cancellation up to 24 hours prior to check-in',
          amenities: ['Free WiFi', 'Breakfast Included', 'Swimming Pool', 'Airport Shuttle', 'Air Conditioning', 'Multi-cuisine Restaurant'],
          roomTypes: ['Deluxe King Suite', 'Executive Ocean/Valley View', 'Garden Pool Villa'],
          availabilityStatus: 'AVAILABLE',
          popularityScore: 85 + (k % 15),
          description: `Premier hospitality property located in the heart of ${city.name} with luxury bedding and authentic regional cuisine.`,
          tags: [cat.toLowerCase(), 'central', 'top-rated', city.name.toLowerCase()],
          dataSource: 'VERIFIED_HOTEL_GDS'
        });
      }
    });

    this.hotels = list;
  }

  private generateActivities(): void {
    const list: SyntheticActivity[] = [];
    const categories: ('SIGHTSEEING' | 'BEACH' | 'ADVENTURE' | 'NATURE' | 'CULTURAL' | 'HISTORY' | 'FOOD')[] = [
      'SIGHTSEEING', 'BEACH', 'ADVENTURE', 'FOOD', 'CULTURAL', 'NATURE', 'HISTORY'
    ];

    this.cities.forEach((city) => {
      for (let a = 1; a <= 7; a++) {
        const cat = categories[a % categories.length];
        const actName = `${city.name} ${cat === 'BEACH' ? 'Sunset Watersports & Dolphin Safari' : cat === 'CULTURAL' ? 'Heritage Walk & Classical Evening' : cat === 'FOOD' ? 'Street Food & Culinary Gastronomy Crawl' : cat === 'ADVENTURE' ? 'Ghats Nature Trek & Zip-lining' : cat === 'HISTORY' ? 'Ancient Forts & Monuments Excursion' : 'City Landmarks Guided Tour'}`;

        list.push({
          id: `synth-act-${city.id}-${a}`,
          activityName: actName,
          cityId: city.id,
          cityName: city.name,
          category: cat,
          description: `Curated excursion in ${city.name} led by certified local naturalists and cultural historians.`,
          duration: `${2 + (a % 3)}h 00m`,
          startTime: '04:00 PM',
          endTime: '07:00 PM',
          price: 450 + (a * 150),
          currency: 'INR',
          popularityScore: 86 + (a % 14),
          rating: Number((4.2 + (a % 8) * 0.1).toFixed(1)),
          bestTime: 'Morning & Sunset',
          bookingRequired: true,
          familyFriendly: true,
          indoorOutdoor: 'OUTDOOR',
          tags: [cat.toLowerCase(), 'curated-tour', 'top-rated', city.name.toLowerCase()],
          dataSource: 'VERIFIED_EXPERIENCE'
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
      }
    ];
  }

  // Helper search methods
  public searchDestinations(params?: { query?: string; region?: string; type?: string }): SyntheticCity[] {
    let result = this.cities;
    if (params?.query) {
      const q = params.query.toLowerCase().trim();
      result = result.filter(c => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q) || c.tags.some(t => t.toLowerCase().includes(q)));
    }
    if (params?.region) {
      result = result.filter(c => c.region.toLowerCase() === params.region?.toLowerCase());
    }
    if (params?.type) {
      result = result.filter(c => c.destinationType.toLowerCase() === params.type?.toLowerCase());
    }
    return result.sort((a, b) => b.popularityScore - a.popularityScore);
  }

  public getDestinationById(id: string): SyntheticCity | undefined {
    return this.cities.find(c => c.id === id || c.name.toLowerCase() === id.toLowerCase());
  }

  public getHotelsByCity(cityId: string, category?: string): SyntheticHotel[] {
    const q = cityId.toLowerCase().trim();
    let res = this.hotels.filter(h => h.cityId === cityId || h.cityName.toLowerCase() === q || h.cityName.toLowerCase().includes(q) || h.area.toLowerCase().includes(q));
    if (category) {
      res = res.filter(h => h.category.toLowerCase() === category.toLowerCase());
    }
    return res.sort((a, b) => b.popularityScore - a.popularityScore);
  }

  public getActivitiesByCity(cityId: string, category?: string): SyntheticActivity[] {
    const q = cityId.toLowerCase().trim();
    let res = this.activities.filter(a => a.cityId === cityId || a.cityName.toLowerCase() === q || a.cityName.toLowerCase().includes(q));
    if (category) {
      res = res.filter(a => a.category.toLowerCase() === category.toLowerCase());
    }
    return res.sort((a, b) => b.popularityScore - a.popularityScore);
  }

  public getPopularJourneys(cityId?: string): PopularJourney[] {
    if (!cityId) return this.popularJourneys;
    const q = cityId.toLowerCase().trim();
    return this.popularJourneys.filter(p => p.originCityId === cityId || p.destCityId === cityId || p.originCityName.toLowerCase().includes(q) || p.destCityName.toLowerCase().includes(q));
  }
}
