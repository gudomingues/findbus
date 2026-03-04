// API Response Types - Mapeia resposta da API SPTrans

export interface ApiStopResponse {
  cp: number;
  np: string;
  ed: string;
  py: number;
  px: number;
}

export interface ApiLineResponse {
  cl: number;
  lc: boolean;
  lt: string;
  sl: 1 | 2;
  tl: number;
  tp: string;
  ts: string;
}

export interface ApiVehicleResponse {
  p: number;
  a: boolean;
  ta: string;
  py: number;
  px: number;
}

export interface ApiPositionResponse {
  hr: string;
  l?: Array<{
    c: string;
    cl: number;
    sl: 1 | 2;
    lt0: string;
    lt1: string;
    qv: number;
    vs: ApiVehicleResponse[];
  }>;
  vs?: ApiVehicleResponse[];
}

export interface ApiArrivalResponse {
  p: number;
  t: string;
  a: boolean;
  ta: string;
  py: number;
  px: number;
}

export interface ApiPredictionResponse {
  hr: string;
  p?: {
    cp: number;
    np: string;
    py: number;
    px: number;
    l: Array<{
      c: string;
      cl: number;
      sl: 1 | 2;
      lt0: string;
      lt1: string;
      qv: number;
      vs: ApiArrivalResponse[];
    }>;
  };
  ps?: Array<{
    cp: number;
    np: string;
    py: number;
    px: number;
    vs: ApiArrivalResponse[];
  }>;
}

export interface ApiCorridorResponse {
  cc: number;
  nc: string;
}
