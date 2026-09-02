export interface FlightOption {
  flightNumber: string;
  airline: string;
  fromAirport: string;
  toAirport: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  status: 'ON_TIME' | 'BOARDING' | 'SCHEDULED';
  dataSource: string;
}

export class MockFlightService {
  public static getEmergencyRecoveryFlights(): FlightOption[] {
    return [
      {
        flightNumber: '6E-5128',
        airline: 'IndiGo Airlines',
        fromAirport: 'BOM (Mumbai T2)',
        toAirport: 'GOI (Dabolim, Goa)',
        departureTime: '8:15 PM',
        arrivalTime: '9:30 PM',
        price: 3900,
        status: 'SCHEDULED',
        dataSource: 'FLIGHT API • DEMO DATA'
      },
      {
        flightNumber: 'AI-681',
        airline: 'Air India',
        fromAirport: 'BOM (Mumbai T2)',
        toAirport: 'GOX (Mopa, Goa)',
        departureTime: '9:45 PM',
        arrivalTime: '11:00 PM',
        price: 4450,
        status: 'SCHEDULED',
        dataSource: 'FLIGHT API • DEMO DATA'
      }
    ];
  }
}
