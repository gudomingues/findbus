// API Constants - Seguindo princípio DRY

export const API_CONFIG = {
  BASE_URL: '/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

export const API_ENDPOINTS = {
  AUTH: '/Login/Autenticar',
  LINES: {
    SEARCH: '/Linha/Buscar',
    BY_DIRECTION: '/Linha/BuscarLinhaSentido',
  },
  STOPS: {
    SEARCH: '/Parada/Buscar',
    BY_LINE: '/Parada/BuscarParadasPorLinha',
    BY_CORRIDOR: '/Parada/BuscarParadasPorCorredor',
  },
  CORRIDORS: '/Corredor',
  POSITIONS: {
    ALL: '/Posicao',
    BY_LINE: '/Posicao/Linha',
    BY_GARAGE: '/Posicao/Garagem',
  },
  PREDICTIONS: {
    BY_STOP_AND_LINE: '/Previsao',
    BY_LINE: '/Previsao/Linha',
    BY_STOP: '/Previsao/Parada',
  },
} as const;

export const FEATURES = {
  LINE_VIEW: 'line-view',
  STOP_VIEW: 'stop-view',
  TRAFFIC_VIEW: 'traffic-view',
} as const;

export const MAP_CONFIG = {
  DEFAULT_CENTER: {
    lat: -23.550520,
    lng: -46.633308,
  },
  DEFAULT_ZOOM: 12,
  LINE_ZOOM: 15,
  STOP_ZOOM: 16,
} as const;

export const UPDATE_INTERVALS = {
  VEHICLE_POSITION: 15000, // 15 segundos
  ARRIVAL_PREDICTION: 30000, // 30 segundos
} as const;
