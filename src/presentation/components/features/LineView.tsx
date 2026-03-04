// LineView Component - "De Olho na Linha"
// Mostra trajeto e veículos em tempo real

import React, { useState } from 'react';
import { useLineView } from '../../hooks/useLineView';
import { SearchBar } from '../common/SearchBar';
import { Loading } from '../common/Loading';
import { Modal } from '../common/Modal';
import { Map } from '../common/Map';
import type { BusLine, Vehicle } from '../../../shared/types/domain.types';
import { formatTime } from '../../../shared/utils/helpers';
import './LineView.css';

export const LineView: React.FC = () => {
  const {
    lines,
    selectedLine,
    stops,
    vehicles,
    loading,
    error,
    searchLines,
    selectLine,
    clearSelection,
  } = useLineView();

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showMap, setShowMap] = useState(true);

  const handleLineClick = (line: BusLine) => {
    selectLine(line);
    setShowMap(true);
  };

  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const closeVehicleModal = () => {
    setSelectedVehicle(null);
  };

  const handleClearSelection = () => {
    clearSelection();
    setShowMap(true);
  };

  return (
    <div className="line-view">
      <div className="line-view-header">
        <h2 className="h4 mb-3">De Olho na Linha</h2>
        <p className="text-muted">
          Localização dos ônibus - Consulte, ao longo do trajeto de sua linha, onde estão os ônibus que poderão atendê-lo
        </p>
      </div>

      <SearchBar
        placeholder="Digite o número ou nome da linha..."
        onSearch={searchLines}
        disabled={loading}
      />

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading && !selectedLine && <Loading message="Buscando linhas..." />}

      {/* Lista de linhas */}
      {!selectedLine && lines.length > 0 && (
        <div className="list-group">
          {lines.map(line => (
            <button
              key={`${line.code}-${line.direction}`}
              type="button"
              className="list-group-item list-group-item-action"
              onClick={() => handleLineClick(line)}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="mb-1">
                    <span className="badge bg-primary me-2">{line.displayCode}</span>
                    {line.mainTerminal}
                  </h6>
                  <small className="text-muted">
                    Sentido: {line.direction === 1 ? 'Ida' : 'Volta'} • 
                    Terminal: {line.secondaryTerminal}
                  </small>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Detalhes da linha selecionada */}
      {selectedLine && (
        <div className="line-details">
          <div className="card mb-3">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">
                  Linha {selectedLine.displayCode}
                </h5>
                <small>{selectedLine.mainTerminal} → {selectedLine.secondaryTerminal}</small>
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
              {loading && <Loading message="Carregando dados da linha..." />}

              {!loading && (
                <>
                         {/* Mapa */}
                        {showMap && (stops.length > 0 || vehicles.length > 0) && (
                          <div className="map-wrapper">
                            <Map
                              stops={stops}
                              vehicles={vehicles}
                              showRoute={false}
                              zoom={13}
                            />
                          </div>
                        )}

                  <div className="row p-3">
                    <div className="col-md-6">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">Paradas ({stops.length})</h6>
                        {stops.length > 0 && (
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setShowMap(!showMap)}
                          >
                            {showMap ? 'Ocultar Mapa' : 'Mostrar Mapa'}
                          </button>
                        )}
                      </div>
                      <div className="stops-list">
                        {stops.length === 0 && (
                          <p className="text-muted">Nenhuma parada encontrada</p>
                        )}
                        {stops.map(stop => (
                          <div key={stop.code} className="stop-item">
                            <small>
                              <strong>{stop.name}</strong>
                              <br />
                              <span className="text-muted">{stop.address}</span>
                            </small>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <h6>Veículos em operação ({vehicles.length})</h6>
                      <div className="vehicles-list">
                        {vehicles.length === 0 && (
                          <p className="text-muted">Nenhum veículo em operação no momento</p>
                        )}
                        {vehicles.map(vehicle => (
                          <button
                            key={vehicle.prefix}
                            type="button"
                            className="vehicle-item btn btn-outline-secondary btn-sm mb-2"
                            onClick={() => handleVehicleClick(vehicle)}
                          >
                            <strong>Veículo {vehicle.prefix}</strong>
                                   {vehicle.accessible && (
                                     <span className="badge bg-success ms-2">Acessível</span>
                                   )}
                            <br />
                            <small className="text-muted">
                              Atualizado: {formatTime(vehicle.timestamp)}
                            </small>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                         {vehicles.length > 0 && (
                           <div className="alert alert-info m-3 mb-0">
                             <small>
                               Posições atualizadas automaticamente a cada 15 segundos no mapa
                             </small>
                           </div>
                         )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal com detalhes do veículo */}
      {selectedVehicle && (
        <Modal
          isOpen={!!selectedVehicle}
          onClose={closeVehicleModal}
          title={`Veículo ${selectedVehicle.prefix}`}
        >
          <div className="vehicle-details">
            <dl className="row mb-0">
              <dt className="col-sm-4">Prefixo:</dt>
              <dd className="col-sm-8">{selectedVehicle.prefix}</dd>

                     <dt className="col-sm-4">Acessibilidade:</dt>
                     <dd className="col-sm-8">
                       {selectedVehicle.accessible ? (
                         <span className="badge bg-success">Acessível para PcD</span>
                       ) : (
                         <span className="badge bg-secondary">Não acessível</span>
                       )}
                     </dd>

              <dt className="col-sm-4">Localização:</dt>
              <dd className="col-sm-8">
                Lat: {selectedVehicle.latitude.toFixed(6)}
                <br />
                Lng: {selectedVehicle.longitude.toFixed(6)}
              </dd>

              <dt className="col-sm-4">Última atualização:</dt>
              <dd className="col-sm-8">{formatTime(selectedVehicle.timestamp)}</dd>
            </dl>

            <div className="alert alert-info mt-3 mb-0">
              <small>
                A posição deste veículo é atualizada automaticamente no mapa a cada 15 segundos
              </small>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
