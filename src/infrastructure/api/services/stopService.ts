// Stop Service - Single Responsibility Principle (SRP)

import type { IHttpClient } from '../config/httpClient';
import type { BusStop } from '../../../shared/types/domain.types';
import type { ApiStopResponse } from '../../../shared/types/api.types';
import { API_ENDPOINTS } from '../../../shared/constants/app.constants';
import { StopMapper } from '../../../shared/utils/mappers';
import { isValidString, isValidNumber } from '../../../shared/utils/helpers';

export interface IStopService {
  searchStops(searchTerm: string): Promise<BusStop[]>;
  getStopsByLine(lineCode: number): Promise<BusStop[]>;
  getStopsByCorridor(corridorCode: number): Promise<BusStop[]>;
}

export class StopService implements IStopService {
  constructor(private httpClient: IHttpClient) {}

  async searchStops(searchTerm: string): Promise<BusStop[]> {
    if (!isValidString(searchTerm)) {
      return [];
    }

    try {
      const response = await this.httpClient.get<ApiStopResponse[]>(
        API_ENDPOINTS.STOPS.SEARCH,
        { termosBusca: searchTerm }
      );

      return StopMapper.toDomainArray(response);
    } catch (error) {
      console.error('Error searching stops:', error);
      return [];
    }
  }

  async getStopsByLine(lineCode: number): Promise<BusStop[]> {
    if (!isValidNumber(lineCode) || lineCode <= 0) {
      return [];
    }

    try {
      const response = await this.httpClient.get<ApiStopResponse[]>(
        API_ENDPOINTS.STOPS.BY_LINE,
        { codigoLinha: lineCode }
      );

      return StopMapper.toDomainArray(response);
    } catch (error) {
      console.error('Error getting stops by line:', error);
      return [];
    }
  }

  async getStopsByCorridor(corridorCode: number): Promise<BusStop[]> {
    if (!isValidNumber(corridorCode) || corridorCode <= 0) {
      return [];
    }

    try {
      const response = await this.httpClient.get<ApiStopResponse[]>(
        API_ENDPOINTS.STOPS.BY_CORRIDOR,
        { codigoCorredor: corridorCode }
      );

      return StopMapper.toDomainArray(response);
    } catch (error) {
      console.error('Error getting stops by corridor:', error);
      return [];
    }
  }
}
