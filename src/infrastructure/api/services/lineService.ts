// Line Service - Single Responsibility Principle (SRP)

import type { IHttpClient } from '../config/httpClient';
import type { BusLine } from '../../../shared/types/domain.types';
import type { ApiLineResponse } from '../../../shared/types/api.types';

const API_ENDPOINTS = {
  SEARCH: '/Linha/Buscar',
  BY_DIRECTION: '/Linha/BuscarLinhaSentido',
};

const isValidString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

const isValidNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

const mapApiLineToDomain = (apiLine: ApiLineResponse): BusLine | null => {
  if (!apiLine || typeof apiLine !== 'object') return null;
  if (!isValidNumber(apiLine.cl)) return null;
  if (!isValidString(apiLine.lt)) return null;

  return {
    code: apiLine.cl,
    circular: Boolean(apiLine.lc),
    displayCode: apiLine.lt,
    direction: apiLine.sl === 1 ? 1 : 2,
    type: isValidNumber(apiLine.tl) ? apiLine.tl : 10,
    mainTerminal: apiLine.tp || '',
    secondaryTerminal: apiLine.ts || '',
  };
};

export interface ILineService {
  searchLines(searchTerm: string): Promise<BusLine[]>;
  searchLineByDirection(searchTerm: string, direction: 1 | 2): Promise<BusLine[]>;
}

export class LineService implements ILineService {
  constructor(private httpClient: IHttpClient) {}

  async searchLines(searchTerm: string): Promise<BusLine[]> {
    // Defensive Programming - Early Return
    if (!isValidString(searchTerm)) {
      return [];
    }

    try {
      const response = await this.httpClient.get<ApiLineResponse[]>(
        API_ENDPOINTS.SEARCH,
        { termosBusca: searchTerm }
      );

      if (!Array.isArray(response)) return [];
      
      return response
        .map(line => mapApiLineToDomain(line))
        .filter((line): line is BusLine => line !== null);
    } catch (error) {
      console.error('Error searching lines:', error);
      return [];
    }
  }

  async searchLineByDirection(
    searchTerm: string,
    direction: 1 | 2
  ): Promise<BusLine[]> {
    if (!isValidString(searchTerm)) {
      return [];
    }

    if (direction !== 1 && direction !== 2) {
      return [];
    }

    try {
      const response = await this.httpClient.get<ApiLineResponse[]>(
        API_ENDPOINTS.BY_DIRECTION,
        { termosBusca: searchTerm, sentido: direction }
      );

      if (!Array.isArray(response)) return [];
      
      return response
        .map(line => mapApiLineToDomain(line))
        .filter((line): line is BusLine => line !== null);
    } catch (error) {
      console.error('Error searching line by direction:', error);
      return [];
    }
  }
}
