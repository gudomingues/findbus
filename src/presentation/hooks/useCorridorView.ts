// useCorridorView Hook - "De Olho na Via"
// Custom Hook para gerenciar estado de corredores

import { useState, useEffect } from 'react';
import { serviceFactory } from '../../infrastructure/api/services/serviceFactory';
import type { Corridor } from '../../shared/types/corridor.types';

const UPDATE_INTERVAL_CORRIDORS = 60000; // 60 segundos

export const useCorridorView = () => {
  const [corridors, setCorridors] = useState<Corridor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCorridors = async () => {
    try {
      console.log('Loading corridors...');
      setLoading(true);
      setError(null);

      const corridorService = serviceFactory.corridorService;
      const data = await corridorService.getAllCorridors();

      console.log('Corridors loaded:', data.length, 'items');

      if (data.length === 0) {
        setError('Nenhum corredor encontrado ou dados indisponíveis no momento');
      }

      setCorridors(data);
    } catch (err) {
      console.error('Error loading corridors:', err);
      setError('Erro ao carregar dados dos corredores. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCorridors();

    // Auto-atualização a cada 60 segundos
    const interval = setInterval(loadCorridors, UPDATE_INTERVAL_CORRIDORS);

    return () => clearInterval(interval);
  }, []);

  return {
    corridors,
    loading,
    error,
    refresh: loadCorridors,
  };
};
