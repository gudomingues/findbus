import { HttpClient } from '../config/httpClient';
import { LineService } from './lineService';
import { StopService } from './stopService';
import { PositionService } from './positionService';
import { PredictionService } from './predictionService';
import { CorridorService } from './corridorService';

const API_BASE_URL = '/api';

class ServiceFactory {
  private static instance: ServiceFactory;
  private httpClient: HttpClient;
  private _lineService: LineService | null = null;
  private _stopService: StopService | null = null;
  private _positionService: PositionService | null = null;
  private _predictionService: PredictionService | null = null;
  private _corridorService: CorridorService | null = null;

  private constructor() {
    this.httpClient = new HttpClient(API_BASE_URL);
  }

  static getInstance(): ServiceFactory {
    // Singleton Pattern - YAGNI (só cria quando necessário)
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  async authenticate(): Promise<boolean> {
    const token = process.env.REACT_APP_OLHOVIVO_TOKEN;
    
    if (!token) {
      console.error('REACT_APP_OLHOVIVO_TOKEN not found in environment');
      return false;
    }

    return this.httpClient.authenticate(token);
  }

  isAuthenticated(): boolean {
    return this.httpClient.isAuth();
  }

  get lineService(): LineService {
    // Lazy initialization - YAGNI
    if (!this._lineService) {
      this._lineService = new LineService(this.httpClient);
    }
    return this._lineService;
  }

  get stopService(): StopService {
    if (!this._stopService) {
      this._stopService = new StopService(this.httpClient);
    }
    return this._stopService;
  }

  get positionService(): PositionService {
    if (!this._positionService) {
      this._positionService = new PositionService(this.httpClient);
    }
    return this._positionService;
  }

  get predictionService(): PredictionService {
    if (!this._predictionService) {
      this._predictionService = new PredictionService(this.httpClient);
    }
    return this._predictionService;
  }

  get corridorService(): CorridorService {
    if (!this._corridorService) {
      this._corridorService = new CorridorService(this.httpClient);
    }
    return this._corridorService;
  }
}

export const serviceFactory = ServiceFactory.getInstance();
