// CorridorView Component - "De Olho na Via"
// Mostra velocidade média dos corredores

import React from 'react';
import { useCorridorView } from '../../hooks/useCorridorView';
import { Loading } from '../common/Loading';
import type { Corridor } from '../../../shared/types/corridor.types';
import { formatTime } from '../../../shared/utils/helpers';
import './CorridorView.css';

const getSpeedStatus = (speed: number): { color: string; label: string } => {
  if (speed >= 40) return { color: 'success', label: 'Rápido' };
  if (speed >= 20) return { color: 'warning', label: 'Moderado' };
  return { color: 'danger', label: 'Lento' };
};

const SpeedGauge: React.FC<{ speed: number }> = ({ speed }) => {
  const status = getSpeedStatus(speed);
  const percentage = Math.min((speed / 60) * 100, 100);

  return (
    <div className="speed-gauge">
      <div className="speed-gauge-bar">
        <div
          className={`speed-gauge-fill bg-${status.color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="speed-gauge-value">
        <span className="speed-number">{speed.toFixed(1)}</span>
        <span className="speed-unit">km/h</span>
      </div>
      <span className={`badge bg-${status.color} speed-status`}>
        {status.label}
      </span>
    </div>
  );
};

export const CorridorView: React.FC = () => {
  const { corridors, loading, error, refresh } = useCorridorView();

  return (
    <div className="corridor-view">
      <div className="corridor-view-header">
        <h2 className="h4 mb-3">De Olho na Via</h2>
        <p className="text-muted">
          Velocidade média e tempo de percurso - Veja como está o desempenho dos principais corredores viários da cidade
        </p>
      </div>

      {error && (
        <div className="alert alert-warning" role="alert">
          {error}
        </div>
      )}

      {loading && corridors.length === 0 && <Loading message="Carregando corredores..." />}

      {corridors.length > 0 && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <small className="text-muted">
              {corridors.length} corredor{corridors.length !== 1 ? 'es' : ''} monitorado{corridors.length !== 1 ? 's' : ''}
            </small>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={refresh}
              disabled={loading}
            >
              {loading ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>

          <div className="corridors-grid">
            {corridors.map((corridor: Corridor) => (
              <div key={corridor.code} className="corridor-card card">
                <div className="card-body">
                  <h6 className="corridor-name">{corridor.name}</h6>
                  <SpeedGauge speed={corridor.averageSpeed} />
                  <small className="text-muted d-block mt-2">
                    Atualizado: {formatTime(corridor.timestamp)}
                  </small>
                </div>
              </div>
            ))}
          </div>

          <div className="alert alert-info mt-3">
            <small>
              Velocidades atualizadas automaticamente a cada 60 segundos
            </small>
          </div>
        </>
      )}

      {!loading && corridors.length === 0 && !error && (
        <div className="alert alert-secondary">
          Nenhum dado disponível no momento. Tente novamente mais tarde.
        </div>
      )}
    </div>
  );
};
