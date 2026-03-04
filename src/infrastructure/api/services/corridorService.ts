// Corridor Service - "De Olho na Via"
// Single Responsibility Principle (SRP): Gerencia apenas corredores
// Dependency Inversion Principle (DIP): Depende de IHttpClient

import type { IHttpClient } from '../config/httpClient';
import type { Corridor } from '../../../shared/types/corridor.types';

// Inline API type
interface ApiCorridorResponse {
  cc: number;
  nc: string;
  vp: number;
}

// Defensive Programming - Validações
const isValidSpeed = (speed: unknown): speed is number => {
  return typeof speed === 'number' && !isNaN(speed) && speed >= 0;
};

const isValidString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

// Mapper interno (Adapter Pattern)
class CorridorMapper {
  static toDomain(apiCorridor: ApiCorridorResponse): Corridor | null {
    // Defensive Programming - Early Return se dados inválidos
    if (!apiCorridor || typeof apiCorridor !== 'object') {
      return null;
    }

    if (!isValidSpeed(apiCorridor.vp)) {
      return null;
    }

    if (!isValidString(apiCorridor.nc)) {
      return null;
    }

    return {
      code: apiCorridor.cc,
      name: apiCorridor.nc.trim(),
      averageSpeed: apiCorridor.vp,
      timestamp: new Date().toISOString(),
    };
  }

  static toDomainArray(apiCorridors: ApiCorridorResponse[]): Corridor[] {
    if (!Array.isArray(apiCorridors)) {
      return [];
    }

    return apiCorridors
      .map(corridor => this.toDomain(corridor))
      .filter((corridor): corridor is Corridor => corridor !== null);
  }
}

export class CorridorService {
  constructor(private httpClient: IHttpClient) {}

  async getAllCorridors(): Promise<Corridor[]> {
    try {
      const response = await this.httpClient.get<ApiCorridorResponse[]>('/Corredor');

      console.log('Corridors API Response:', response);

      // Defensive Programming
      if (!response) {
        console.warn('Empty response from corridors API');
        return [];
      }

      const corridors = CorridorMapper.toDomainArray(response);
      console.log('Mapped corridors:', corridors);
      
      return corridors;
    } catch (error) {
      console.error('Error fetching corridors:', error);
      return [];
    }
  }
}
