// Custom Hook - Parada (De Olho no Ponto)
// Seguindo princípios KISS e DRY

import { useState, useEffect, useCallback } from 'react';
import { serviceFactory } from '../../infrastructure/api/services/serviceFactory';
import type { BusStop, ArrivalPrediction } from '../../shared/types/domain.types';
import { UPDATE_INTERVALS } from '../../shared/constants/app.constants';

interface UseStopViewReturn {
  stops: BusStop[];
  selectedStop: BusStop | null;
  predictions: ArrivalPrediction | null;
  loading: boolean;
  error: string | null;
  searchStops: (searchTerm: string) => Promise<void>;
  selectStop: (stop: BusStop) => Promise<void>;
  clearSelection: () => void;
}

export const useStopView = (): UseStopViewReturn => {
  const [stops, setStops] = useState<BusStop[]>([]);
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);
  const [predictions, setPredictions] = useState<ArrivalPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchStops = useCallback(async (searchTerm: string) => {
    if (!searchTerm || searchTerm.trim().length === 0) {
      setStops([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await serviceFactory.stopService.searchStops(searchTerm);
      setStops(results);
    } catch (err) {
      setError('Erro ao buscar paradas');
      setStops([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectStop = useCallback(async (stop: BusStop) => {
    console.log('Selecting stop:', stop);
    setSelectedStop(stop);
    setLoading(true);
    setError(null);

    try {
      const predictionsData = await serviceFactory.predictionService.getPredictionsByStop(
        stop.code
      );
      
      console.log('Predictions received:', predictionsData);
      
      if (!predictionsData) {
        console.warn('No predictions data');
        setPredictions({
          stop: stop,
          referenceTime: new Date().toISOString(),
          lines: [],
        });
      } else {
        setPredictions(predictionsData);
      }
    } catch (err) {
      console.error('Error loading predictions:', err);
      setError('Erro ao carregar previsões');
      setPredictions(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedStop(null);
    setPredictions(null);
    setStops([]);
    setError(null);
  }, []);

  // Auto-atualização de previsões
  useEffect(() => {
    if (!selectedStop) return;

    const interval = setInterval(async () => {
      try {
        const predictionsData = await serviceFactory.predictionService.getPredictionsByStop(
          selectedStop.code
        );
        setPredictions(predictionsData);
      } catch (err) {
        console.error('Erro ao atualizar previsões:', err);
      }
    }, UPDATE_INTERVALS.ARRIVAL_PREDICTION);

    return () => clearInterval(interval);
  }, [selectedStop]);

  return {
    stops,
    selectedStop,
    predictions,
    loading,
    error,
    searchStops,
    selectStop,
    clearSelection,
  };
};
