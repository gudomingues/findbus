// Prediction Service - Single Responsibility Principle (SRP)

import type { IHttpClient } from '../config/httpClient';
import type { ArrivalPrediction } from '../../../shared/types/domain.types';
import type { ApiPredictionResponse } from '../../../shared/types/api.types';
import { API_ENDPOINTS } from '../../../shared/constants/app.constants';
import { PredictionMapper } from '../../../shared/utils/mappers';
import { isValidNumber } from '../../../shared/utils/helpers';

export interface IPredictionService {
  getPredictionByStopAndLine(stopCode: number, lineCode: number): Promise<ArrivalPrediction | null>;
  getPredictionsByLine(lineCode: number): Promise<ArrivalPrediction | null>;
  getPredictionsByStop(stopCode: number): Promise<ArrivalPrediction | null>;
}

export class PredictionService implements IPredictionService {
  constructor(private httpClient: IHttpClient) {}

  async getPredictionByStopAndLine(
    stopCode: number,
    lineCode: number
  ): Promise<ArrivalPrediction | null> {
    if (!isValidNumber(stopCode) || !isValidNumber(lineCode)) {
      return null;
    }

    if (stopCode <= 0 || lineCode <= 0) {
      return null;
    }

    try {
      const response = await this.httpClient.get<ApiPredictionResponse>(
        API_ENDPOINTS.PREDICTIONS.BY_STOP_AND_LINE,
        { codigoParada: stopCode, codigoLinha: lineCode }
      );

      return PredictionMapper.toDomain(response);
    } catch (error) {
      console.error('Error getting prediction by stop and line:', error);
      return null;
    }
  }

  async getPredictionsByLine(lineCode: number): Promise<ArrivalPrediction | null> {
    if (!isValidNumber(lineCode) || lineCode <= 0) {
      return null;
    }

    try {
      const response = await this.httpClient.get<ApiPredictionResponse>(
        API_ENDPOINTS.PREDICTIONS.BY_LINE,
        { codigoLinha: lineCode }
      );

      return PredictionMapper.toDomain(response);
    } catch (error) {
      console.error('Error getting predictions by line:', error);
      return null;
    }
  }

  async getPredictionsByStop(stopCode: number): Promise<ArrivalPrediction | null> {
    if (!isValidNumber(stopCode) || stopCode <= 0) {
      console.warn('Invalid stop code:', stopCode);
      return null;
    }

    try {
      console.log('Fetching predictions for stop:', stopCode);
      
      const response = await this.httpClient.get<ApiPredictionResponse>(
        API_ENDPOINTS.PREDICTIONS.BY_STOP,
        { codigoParada: stopCode }
      );

      console.log('Predictions raw response:', response);
      
      if (!response) {
        console.warn('Empty predictions response');
        return null;
      }

      const mapped = PredictionMapper.toDomain(response);
      console.log('Mapped predictions:', mapped);
      
      return mapped;
    } catch (error) {
      console.error('Error getting predictions by stop:', error);
      return null;
    }
  }
}
