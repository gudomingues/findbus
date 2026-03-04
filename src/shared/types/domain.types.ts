// Domain Types - Seguindo princípios DDD e KISS

export interface BusStop {
  code: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface BusLine {
  code: number;
  circular: boolean;
  displayCode: string;
  direction: 1 | 2;
  type: number;
  mainTerminal: string;
  secondaryTerminal: string;
}

export interface Vehicle {
  prefix: number;
  accessible: boolean;
  timestamp: string;
  latitude: number;
  longitude: number;
}

export interface BusLinePosition {
  displayCode: string;
  lineCode: number;
  direction: 1 | 2;
  mainDestination: string;
  secondaryDestination: string;
  vehicleCount: number;
  vehicles: Vehicle[];
}

export interface Arrival {
  prefix: number;
  arrivalTime: string;
  accessible: boolean;
  captureTime: string;
  latitude: number;
  longitude: number;
}

export interface ArrivalPrediction {
  referenceTime: string;
  stop: BusStop;
  lines: Array<{
    displayCode: string;
    lineCode: number;
    direction: 1 | 2;
    mainDestination: string;
    secondaryDestination: string;
    vehicleCount: number;
    arrivals: Arrival[];
  }>;
}

export interface Corridor {
  code: number;
  name: string;
}
