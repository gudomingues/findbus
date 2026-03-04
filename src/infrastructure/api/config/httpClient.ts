// HTTP Client - Seguindo Dependency Inversion Principle (DIP)
// Interface Segregation Principle (ISP)

import axios, { AxiosInstance, AxiosError } from 'axios';

const API_CONFIG = {
  BASE_URL: '/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

const retry = async <T>(
  fn: () => Promise<T>,
  attempts = 3,
  delay = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (attempts <= 1) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, attempts - 1, delay);
  }
};

export interface IHttpClient {
  get<T>(url: string, params?: Record<string, unknown>): Promise<T>;
  post<T>(url: string, data?: unknown): Promise<T>;
}

export class HttpClient implements IHttpClient {
  private client: AxiosInstance;
  private isAuthenticated = false;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: API_CONFIG.TIMEOUT,
      withCredentials: false,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        console.error('API Error:', error.message);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): Error {
    if (error.response) {
      return new Error(`API Error: ${error.response.status} - ${error.response.statusText}`);
    }
    if (error.request) {
      return new Error('Network Error: No response from server');
    }
    return new Error(`Request Error: ${error.message}`);
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    // Early Return Pattern
    if (!this.isAuthenticated) {
      throw new Error('Not authenticated. Call authenticate() first.');
    }

    return retry(async () => {
      const response = await this.client.get<T>(url, { params });
      return response.data;
    }, API_CONFIG.RETRY_ATTEMPTS);
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async authenticate(token: string): Promise<boolean> {
    // Short-Circuit Evaluation
    if (!token || typeof token !== 'string') {
      return false;
    }

    if (this.isAuthenticated) {
      return true;
    }

    try {
      const result = await this.post<boolean>(`/Login/Autenticar?token=${token}`);
      this.isAuthenticated = result === true;
      return this.isAuthenticated;
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  }

  isAuth(): boolean {
    return this.isAuthenticated;
  }
}
