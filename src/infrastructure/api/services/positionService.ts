// Position Service - Single Responsibility Principle (SRP)

import type { IHttpClient } from '../config/httpClient';
import type { BusLinePosition, Vehicle } from '../../../shared/types/domain.types';
import type { ApiPositionResponse } from '../../../shared/types/api.types';
import { API_ENDPOINTS } from '../../../shared/constants/app.constants';
import { PositionMapper, VehicleMapper } from '../../../shared/utils/mappers';
import { isValidNumber } from '../../../shared/utils/helpers';

export interface IPositionService {
  getAllPositions(): Promise<BusLinePosition[]>;
  getPositionsByLine(lineCode: number): Promise<Vehicle[]>;
  getPositionsByGarage(companyCode: number, lineCode?: number): Promise<BusLinePosition[]>;
}

export class PositionService implements IPositionService {
  constructor(private httpClient: IHttpClient) {}

  async getAllPositions(): Promise<BusLinePosition[]> {
    try {
      const response = await this.httpClient.get<ApiPositionResponse>(
        API_ENDPOINTS.POSITIONS.ALL
      );

      return PositionMapper.toDomain(response);
    } catch (error) {
      console.error('Error getting all positions:', error);
      return [];
    }
  }

  async getPositionsByLine(lineCode: number): Promise<Vehicle[]> {
    if (!isValidNumber(lineCode) || lineCode <= 0) {
      return [];
    }

    try {
      const response = await this.httpClient.get<ApiPositionResponse>(
        API_ENDPOINTS.POSITIONS.BY_LINE,
        { codigoLinha: lineCode }
      );

      // A API retorna vs diretamente para linha específica
      if (response.vs && Array.isArray(response.vs)) {
        return VehicleMapper.toDomainArray(response.vs);
      }

      return [];
    } catch (error) {
      console.error('Error getting positions by line:', error);
      return [];
    }
  }

  async getPositionsByGarage(
    companyCode: number,
    lineCode?: number
  ): Promise<BusLinePosition[]> {
    if (!isValidNumber(companyCode)) {
      return [];
    }

    try {
      const params: Record<string, number> = { codigoEmpresa: companyCode };
      if (lineCode && isValidNumber(lineCode)) {
        params.codigoLinha = lineCode;
      }

      const response = await this.httpClient.get<ApiPositionResponse>(
        API_ENDPOINTS.POSITIONS.BY_GARAGE,
        params
      );

      return PositionMapper.toDomain(response);
    } catch (error) {
      console.error('Error getting positions by garage:', error);
      return [];
    }
  }
}
