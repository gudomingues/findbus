// Custom Hook - Linha (De Olho na Linha)
// Seguindo princípios KISS e DRY

import { useState, useEffect, useCallback } from 'react';
import { serviceFactory } from '../../infrastructure/api/services/serviceFactory';
import type { BusLine, BusStop, Vehicle } from '../../shared/types/domain.types';
import { UPDATE_INTERVALS } from '../../shared/constants/app.constants';

interface UseLineViewReturn {
  lines: BusLine[];
  selectedLine: BusLine | null;
  stops: BusStop[];
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  searchLines: (searchTerm: string) => Promise<void>;
  selectLine: (line: BusLine) => Promise<void>;
  clearSelection: () => void;
}

export const useLineView = (): UseLineViewReturn => {
  const [lines, setLines] = useState<BusLine[]>([]);
  const [selectedLine, setSelectedLine] = useState<BusLine | null>(null);
  const [stops, setStops] = useState<BusStop[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchLines = useCallback(async (searchTerm: string) => {
    // Early Return Pattern
    if (!searchTerm || searchTerm.trim().length === 0) {
      setLines([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await serviceFactory.lineService.searchLines(searchTerm);
      setLines(results);
    } catch (err) {
      setError('Erro ao buscar linhas');
      setLines([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectLine = useCallback(async (line: BusLine) => {
    setSelectedLine(line);
    setLoading(true);
    setError(null);

    try {
      // Buscar paradas e veículos em paralelo
      const [stopsData, vehiclesData] = await Promise.all([
        serviceFactory.stopService.getStopsByLine(line.code),
        serviceFactory.positionService.getPositionsByLine(line.code),
      ]);

      setStops(stopsData);
      setVehicles(vehiclesData);
    } catch (err) {
      setError('Erro ao carregar dados da linha');
      setStops([]);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedLine(null);
    setStops([]);
    setVehicles([]);
    setLines([]);
    setError(null);
  }, []);

  // Auto-atualização de veículos
  useEffect(() => {
    if (!selectedLine) return;

    const interval = setInterval(async () => {
      try {
        const vehiclesData = await serviceFactory.positionService.getPositionsByLine(
          selectedLine.code
        );
        setVehicles(vehiclesData);
      } catch (err) {
        console.error('Erro ao atualizar veículos:', err);
      }
    }, UPDATE_INTERVALS.VEHICLE_POSITION);

    return () => clearInterval(interval);
  }, [selectedLine]);

  return {
    lines,
    selectedLine,
    stops,
    vehicles,
    loading,
    error,
    searchLines,
    selectLine,
    clearSelection,
  };
};
