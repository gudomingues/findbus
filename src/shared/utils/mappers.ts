// Mappers - Seguindo Single Responsibility Principle (SRP)
// Defensive Programming aplicado

import type {
  ApiStopResponse,
  ApiLineResponse,
  ApiVehicleResponse,
  ApiPositionResponse,
  ApiPredictionResponse,
  ApiCorridorResponse,
} from '../types/api.types';
import type {
  BusStop,
  BusLine,
  Vehicle,
  BusLinePosition,
  ArrivalPrediction,
  Corridor,
} from '../types/domain.types';
import { isValidString, isValidNumber, safeParseNumber } from './helpers';

export class StopMapper {
  static toDomain(apiStop: ApiStopResponse): BusStop | null {
    // Early Return Pattern - Defensive Programming
    if (!apiStop || typeof apiStop !== 'object') return null;
    if (!isValidNumber(apiStop.cp)) return null;
    if (!isValidString(apiStop.np)) return null;

    return {
      code: apiStop.cp,
      name: apiStop.np,
      address: apiStop.ed || '',
      latitude: safeParseNumber(apiStop.py),
      longitude: safeParseNumber(apiStop.px),
    };
  }

  static toDomainArray(apiStops: ApiStopResponse[]): BusStop[] {
    if (!Array.isArray(apiStops)) return [];
    
    // Short-Circuit Evaluation
    return apiStops
      .map(stop => this.toDomain(stop))
      .filter((stop): stop is BusStop => stop !== null);
  }
}

export class LineMapper {
  static toDomain(apiLine: ApiLineResponse): BusLine | null {
    if (!apiLine || typeof apiLine !== 'object') return null;
    if (!isValidNumber(apiLine.cl)) return null;
    if (!isValidString(apiLine.lt)) return null;

    return {
      code: apiLine.cl,
      circular: Boolean(apiLine.lc),
      displayCode: apiLine.lt,
      direction: apiLine.sl === 1 ? 1 : 2,
      type: safeParseNumber(apiLine.tl, 10),
      mainTerminal: apiLine.tp || '',
      secondaryTerminal: apiLine.ts || '',
    };
  }

  static toDomainArray(apiLines: ApiLineResponse[]): BusLine[] {
    if (!Array.isArray(apiLines)) return [];
    
    return apiLines
      .map(line => this.toDomain(line))
      .filter((line): line is BusLine => line !== null);
  }
}

export class VehicleMapper {
  static toDomain(apiVehicle: ApiVehicleResponse): Vehicle | null {
    if (!apiVehicle || typeof apiVehicle !== 'object') return null;
    if (!isValidNumber(apiVehicle.p)) return null;

    return {
      prefix: apiVehicle.p,
      accessible: Boolean(apiVehicle.a),
      timestamp: apiVehicle.ta || '',
      latitude: safeParseNumber(apiVehicle.py),
      longitude: safeParseNumber(apiVehicle.px),
    };
  }

  static toDomainArray(apiVehicles: ApiVehicleResponse[]): Vehicle[] {
    if (!Array.isArray(apiVehicles)) return [];
    
    return apiVehicles
      .map(vehicle => this.toDomain(vehicle))
      .filter((vehicle): vehicle is Vehicle => vehicle !== null);
  }
}

export class PositionMapper {
  static toDomain(apiPosition: ApiPositionResponse): BusLinePosition[] {
    if (!apiPosition || typeof apiPosition !== 'object') return [];
    if (!Array.isArray(apiPosition.l)) return [];

    return apiPosition.l
      .map(line => {
        if (!isValidNumber(line.cl)) return null;
        if (!isValidString(line.c)) return null;

        return {
          displayCode: line.c,
          lineCode: line.cl,
          direction: line.sl === 1 ? 1 : 2,
          mainDestination: line.lt0 || '',
          secondaryDestination: line.lt1 || '',
          vehicleCount: safeParseNumber(line.qv, 0),
          vehicles: VehicleMapper.toDomainArray(line.vs || []),
        } as BusLinePosition;
      })
      .filter((pos): pos is BusLinePosition => pos !== null);
  }
}

export class PredictionMapper {
  static toDomain(apiPrediction: ApiPredictionResponse): ArrivalPrediction | null {
    if (!apiPrediction || typeof apiPrediction !== 'object') return null;
    if (!apiPrediction.p) return null;

    const stopData = StopMapper.toDomain({
      cp: apiPrediction.p.cp,
      np: apiPrediction.p.np,
      ed: '',
      py: apiPrediction.p.py,
      px: apiPrediction.p.px,
    });

    if (!stopData) return null;

    const lines = (apiPrediction.p.l || [])
      .map(line => {
        if (!isValidNumber(line.cl)) return null;

        return {
          displayCode: line.c || '',
          lineCode: line.cl,
          direction: line.sl === 1 ? 1 : 2,
          mainDestination: line.lt0 || '',
          secondaryDestination: line.lt1 || '',
          vehicleCount: safeParseNumber(line.qv, 0),
          arrivals: (line.vs || [])
            .map(arrival => ({
              prefix: safeParseNumber(arrival.p, 0),
              arrivalTime: arrival.t || '',
              accessible: Boolean(arrival.a),
              captureTime: arrival.ta || '',
              latitude: safeParseNumber(arrival.py),
              longitude: safeParseNumber(arrival.px),
            }))
            .filter(a => a.prefix > 0),
        };
      })
      .filter(line => line !== null);

    return {
      referenceTime: apiPrediction.hr || '',
      stop: stopData,
      lines: lines as ArrivalPrediction['lines'],
    };
  }
}

export class CorridorMapper {
  static toDomain(apiCorridor: ApiCorridorResponse): Corridor | null {
    if (!apiCorridor || typeof apiCorridor !== 'object') return null;
    if (!isValidNumber(apiCorridor.cc)) return null;
    if (!isValidString(apiCorridor.nc)) return null;

    return {
      code: apiCorridor.cc,
      name: apiCorridor.nc,
    };
  }

  static toDomainArray(apiCorridors: ApiCorridorResponse[]): Corridor[] {
    if (!Array.isArray(apiCorridors)) return [];
    
    return apiCorridors
      .map(corridor => this.toDomain(corridor))
      .filter((corridor): corridor is Corridor => corridor !== null);
  }
}
