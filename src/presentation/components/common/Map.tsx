// Map Component - Google Maps Integration
// Com marcadores customizados para paradas e veículos

import React, { useMemo } from 'react';
import GoogleMapReact from 'google-map-react';
import type { BusStop, Vehicle } from '../../../shared/types/domain.types';
import './Map.css';

interface MapProps {
  stops: BusStop[];
  vehicles: Vehicle[];
  center?: { lat: number; lng: number };
  zoom?: number;
  showRoute?: boolean;
}

interface MarkerProps {
  lat: number;
  lng: number;
  $hover?: boolean;
}

// IMPORTANTE: Não desestruturamos lat/lng porque google-map-react precisa delas
const StopMarker: React.FC<MarkerProps> = (props) => {
  return (
    <div className={`custom-marker stop ${props.$hover ? 'hover' : ''}`}>
      <div className="marker-icon"></div>
    </div>
  );
};

const VehicleMarker: React.FC<MarkerProps & { accessible: boolean }> = (props) => {
  return (
    <div className={`custom-marker vehicle ${props.$hover ? 'hover' : ''}`}>
      <div className="marker-icon">V</div>
      {props.accessible && <span className="accessible-badge">A</span>}
    </div>
  );
};

// Validação rigorosa de coordenadas
const isValidCoordinate = (value: any): value is number => {
  return (
    typeof value === 'number' &&
    !isNaN(value) &&
    isFinite(value) &&
    value !== 0
  );
};

const isValidLatitude = (lat: any): boolean => {
  return isValidCoordinate(lat) && lat >= -90 && lat <= 90;
};

const isValidLongitude = (lng: any): boolean => {
  return isValidCoordinate(lng) && lng >= -180 && lng <= 180;
};

export const Map: React.FC<MapProps> = ({ 
  stops, 
  vehicles,
  center = { lat: -23.550520, lng: -46.633308 },
  zoom = 13,
  showRoute = false
}) => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';

  const validStops = useMemo(() => {
    if (!Array.isArray(stops)) {
      console.warn('Stops is not an array:', stops);
      return [];
    }
    
    const filtered = stops.filter(stop => {
      if (!stop) return false;
      
      const lat = stop.latitude;
      const lng = stop.longitude;
      
      const valid = isValidLatitude(lat) && isValidLongitude(lng);
      
      if (!valid) {
        console.warn('Invalid stop coordinates:', { code: stop.code, lat, lng });
      }
      
      return valid;
    });
    
    console.log('Valid stops:', filtered.length, 'of', stops.length);
    return filtered;
  }, [stops]);

  const validVehicles = useMemo(() => {
    if (!Array.isArray(vehicles)) {
      console.warn('Vehicles is not an array:', vehicles);
      return [];
    }
    
    const filtered = vehicles.filter(vehicle => {
      if (!vehicle) return false;
      
      const lat = vehicle.latitude;
      const lng = vehicle.longitude;
      
      const valid = isValidLatitude(lat) && isValidLongitude(lng);
      
      if (!valid) {
        console.warn('Invalid vehicle coordinates:', { prefix: vehicle.prefix, lat, lng });
      }
      
      return valid;
    });
    
    console.log('Valid vehicles:', filtered.length, 'of', vehicles.length);
    return filtered;
  }, [vehicles]);

  const calculatedCenter = useMemo(() => {
    if (validStops.length > 0) {
      const firstStop = validStops[0];
      console.log('Centering on first stop:', firstStop);
      return {
        lat: firstStop.latitude,
        lng: firstStop.longitude,
      };
    }
    if (validVehicles.length > 0) {
      const firstVehicle = validVehicles[0];
      console.log('Centering on first vehicle:', firstVehicle);
      return {
        lat: firstVehicle.latitude,
        lng: firstVehicle.longitude,
      };
    }
    console.log('Using default center:', center);
    return center;
  }, [validStops, validVehicles, center]);

  const mapOptions = {
    fullscreenControl: false,
    zoomControl: true,
  };

  const onGoogleApiLoaded = ({ map, maps }: any) => {
    // Removido: linhas retas não seguem as vias corretamente
    // Para seguir as vias seria necessário usar Directions API (com custo)
    // Agora mostramos apenas os pins das paradas e veículos
    
    // Ajusta zoom para mostrar todos os pontos
    if (validStops.length === 0 && validVehicles.length === 0) return;

    const bounds = new maps.LatLngBounds();
    
    validStops.forEach((stop) => {
      bounds.extend(new maps.LatLng(stop.latitude, stop.longitude));
    });
    
    validVehicles.forEach((vehicle) => {
      bounds.extend(new maps.LatLng(vehicle.latitude, vehicle.longitude));
    });
    
    if (validStops.length > 0 || validVehicles.length > 0) {
      map.fitBounds(bounds);
      
      // Ajusta zoom para não ficar muito próximo
      const listener = maps.event.addListener(map, 'idle', () => {
        if (map.getZoom() > 16) map.setZoom(16);
        maps.event.removeListener(listener);
      });
    }
  };

  if (!apiKey) {
    return (
      <div className="alert alert-warning m-3">
        API Key do Google Maps não configurada. Configure REACT_APP_GOOGLE_MAPS_API_KEY no arquivo .env
      </div>
    );
  }

  if (validStops.length === 0 && validVehicles.length === 0) {
    console.warn('No valid markers to display');
    return (
      <div className="alert alert-info m-3">
        Nenhum dado de localização válido disponível para exibir no mapa
      </div>
    );
  }

  console.log('Rendering map with:', {
    stops: validStops.length,
    vehicles: validVehicles.length,
    center: calculatedCenter,
    zoom
  });

  // Preparar marcadores com validação extra
  const stopMarkers = validStops
    .filter(stop => stop && isValidLatitude(stop.latitude) && isValidLongitude(stop.longitude))
    .map((stop) => ({
      key: `stop-${stop.code}`,
      lat: stop.latitude,
      lng: stop.longitude,
      type: 'stop' as const
    }));

  const vehicleMarkers = validVehicles
    .filter(vehicle => vehicle && isValidLatitude(vehicle.latitude) && isValidLongitude(vehicle.longitude))
    .map((vehicle) => ({
      key: `vehicle-${vehicle.prefix}`,
      lat: vehicle.latitude,
      lng: vehicle.longitude,
      type: 'vehicle' as const,
      accessible: vehicle.accessible
    }));

  console.log('Prepared markers:', { stops: stopMarkers.length, vehicles: vehicleMarkers.length });

  return (
    <div className="map-container">
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-icon stop"></span>
          <span>Paradas ({validStops.length})</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon vehicle"></span>
          <span>Veículos ({validVehicles.length})</span>
        </div>
        {validVehicles.some(v => v.accessible) && (
          <div className="legend-item">
            <span className="legend-icon accessible"></span>
            <span>Acessível</span>
          </div>
        )}
      </div>

      <GoogleMapReact
        bootstrapURLKeys={{ key: apiKey }}
        center={calculatedCenter}
        defaultZoom={zoom}
        options={mapOptions}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={onGoogleApiLoaded}
      >
        {stopMarkers.map((marker) => (
          <StopMarker
            key={marker.key}
            lat={marker.lat}
            lng={marker.lng}
          />
        ))}

        {vehicleMarkers.map((marker) => (
          <VehicleMarker
            key={marker.key}
            lat={marker.lat}
            lng={marker.lng}
            accessible={marker.accessible}
          />
        ))}
      </GoogleMapReact>
    </div>
  );
};
