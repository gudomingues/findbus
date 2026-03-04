// StopView Component - "De Olho no Ponto"
// Mostra previsões de chegada em tempo real

import React, { useState } from 'react';
import { useStopView } from '../../hooks/useStopView';
import { SearchBar } from '../common/SearchBar';
import { Loading } from '../common/Loading';
import { Modal } from '../common/Modal';
import { Map } from '../common/Map';
import type { BusStop, Arrival } from '../../../shared/types/domain.types';
import { formatTime } from '../../../shared/utils/helpers';
import './StopView.css';

export const StopView: React.FC = () => {
  const {
    stops,
    selectedStop,
    predictions,
    loading,
    error,
    searchStops,
    selectStop,
    clearSelection,
  } = useStopView();

  const [selectedArrival, setSelectedArrival] = useState<Arrival | null>(null);
  const [showMap, setShowMap] = useState(true);

  const handleStopClick = (stop: BusStop) => {
    selectStop(stop);
    setShowMap(true);
  };

  const handleArrivalClick = (arrival: Arrival) => {
    setSelectedArrival(arrival);
  };

  const closeArrivalModal = () => {
    setSelectedArrival(null);
  };

  const handleClearSelection = () => {
    clearSelection();
    setShowMap(true);
  };

  const calculateMinutesUntilArrival = (arrivalTime: string): number => {
    if (!arrivalTime) return 0;

    try {
      const [hours, minutes] = arrivalTime.split(':').map(Number);
      const now = new Date();
      const arrival = new Date();
      arrival.setHours(hours, minutes, 0, 0);

      const diff = arrival.getTime() - now.getTime();
      return Math.max(0, Math.floor(diff / 60000));
    } catch {
      return 0;
    }
  };

  return (
    <div className="stop-view">
      <div className="stop-view-header">
        <h2 className="h4 mb-3">De Olho no Ponto</h2>
        <p className="text-muted">
          Próximos ônibus - Saiba em quanto tempo e quais linhas de ônibus se aproximam do ponto que você está ou irá utilizar
        </p>
      </div>

      <SearchBar
        placeholder="Digite o nome ou endereço da parada..."
        onSearch={searchStops}
        disabled={loading}
      />

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading && !selectedStop && <Loading message="Buscando paradas..." />}

      {/* Lista de paradas */}
      {!selectedStop && stops.length > 0 && (
        <div className="list-group">
          {stops.map(stop => (
            <button
              key={stop.code}
              type="button"
              className="list-group-item list-group-item-action"
              onClick={() => handleStopClick(stop)}
            >
              <div>
                <h6 className="mb-1">{stop.name}</h6>
                <small className="text-muted">{stop.address}</small>
                <br />
                <small className="text-muted">Código: {stop.code}</small>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Previsões da parada selecionada */}
      {selectedStop && (
        <div className="stop-details">
          <div className="card mb-3">
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">{selectedStop.name}</h5>
                <small>{selectedStop.address}</small>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-light"
                onClick={handleClearSelection}
              >
                Voltar
              </button>
            </div>
            <div className="card-body p-0">
              {loading && <Loading message="Carregando previsões..." />}

              {!loading && (
                <>
                  {/* Mapa da parada */}
                  {showMap && selectedStop && selectedStop.latitude !== 0 && selectedStop.longitude !== 0 && (
                    <div className="map-wrapper">
                      <Map
                        stops={[selectedStop]}
                        vehicles={[]}
                        showRoute={false}
                        zoom={16}
                      />
                    </div>
                  )}

                  <div className="p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      {predictions && (
                        <small className="text-muted">
                          Atualizado: {formatTime(predictions.referenceTime)}
                        </small>
                      )}
                      <div>
                        {selectedStop && selectedStop.latitude !== 0 && selectedStop.longitude !== 0 && (
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => setShowMap(!showMap)}
                          >
                            {showMap ? 'Ocultar Mapa' : 'Mostrar Mapa'}
                          </button>
                        )}
                        {predictions && (
                          <span className="badge bg-secondary">
                            {predictions.lines.length} {predictions.lines.length === 1 ? 'linha' : 'linhas'}
                          </span>
                        )}
                      </div>
                    </div>
                    )

                    {predictions && predictions.lines.length === 0 && (
                      <div className="alert alert-info">
                        Nenhuma previsão disponível no momento
                      </div>
                    )}

                    {predictions && predictions.lines.map((line, lineIndex) => (
                      <div key={`${line.lineCode}-${lineIndex}`} className="prediction-line mb-4">
                        <div className="prediction-line-header">
                          <h6>
                            <span className="badge bg-primary me-2">{line.displayCode}</span>
                            {line.mainDestination}
                          </h6>
                          <small className="text-muted">
                            Sentido: {line.direction === 1 ? 'Ida' : 'Volta'} • 
                            {line.vehicleCount} {line.vehicleCount === 1 ? 'veículo' : 'veículos'}
                          </small>
                        </div>

                        {line.arrivals.length === 0 && (
                          <p className="text-muted mt-2">Sem previsão de chegada</p>
                        )}

                        {line.arrivals.length > 0 && (
                          <div className="arrivals-list mt-2">
                            {line.arrivals.map((arrival, arrivalIndex) => {
                              const minutesLeft = calculateMinutesUntilArrival(arrival.arrivalTime);
                              return (
                                <button
                                  key={`${arrival.prefix}-${arrivalIndex}`}
                                  type="button"
                                  className="arrival-item btn btn-outline-primary btn-sm"
                                  onClick={() => handleArrivalClick(arrival)}
                                >
                                  <div className="d-flex justify-content-between align-items-center w-100">
                                    <div className="text-start">
                                      <strong>Veículo {arrival.prefix}</strong>
                                      {arrival.accessible && (
                                        <span className="badge bg-success ms-2">Acessível</span>
                                      )}
                                    </div>
                                    <div className="text-end">
                                      <div className="arrival-time">
                                        {minutesLeft === 0 ? (
                                          <span className="badge bg-danger">CHEGANDO</span>
                                        ) : minutesLeft <= 5 ? (
                                          <span className="badge bg-warning text-dark">
                                            {minutesLeft} min
                                          </span>
                                        ) : (
                                          <span className="badge bg-secondary">
                                            {minutesLeft} min
                                          </span>
                                        )}
                                      </div>
                                      <small className="text-muted">às {arrival.arrivalTime}</small>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="alert alert-info mt-3 mb-0">
                      <small>
                        Previsões atualizadas automaticamente a cada 30 segundos
                      </small>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal com detalhes da chegada */}
      {selectedArrival && (
        <Modal
          isOpen={!!selectedArrival}
          onClose={closeArrivalModal}
          title={`Veículo ${selectedArrival.prefix}`}
        >
          <div className="arrival-details">
            <dl className="row mb-0">
              <dt className="col-sm-4">Prefixo:</dt>
              <dd className="col-sm-8">{selectedArrival.prefix}</dd>

              <dt className="col-sm-4">Horário previsto:</dt>
              <dd className="col-sm-8">
                {selectedArrival.arrivalTime}
                <br />
                <small className="text-muted">
                  Em {calculateMinutesUntilArrival(selectedArrival.arrivalTime)} minutos
                </small>
              </dd>

              <dt className="col-sm-4">Acessibilidade:</dt>
              <dd className="col-sm-8">
                {selectedArrival.accessible ? (
                  <span className="badge bg-success">Acessível para PcD</span>
                ) : (
                  <span className="badge bg-secondary">Não acessível</span>
                )}
              </dd>
            </dl>

            <div className="alert alert-info mt-3 mb-0">
              <small>
                Os horários são estimativas e podem variar conforme o trânsito
              </small>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
