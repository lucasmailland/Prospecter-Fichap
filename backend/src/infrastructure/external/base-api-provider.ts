import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { IApiProvider, ApiResponse, ApiProviderConfig } from './api-provider.interface';
import { ApiProvider } from '../../domain/entities/enrichment-log.entity';

@Injectable()
export abstract class BaseApiProvider implements IApiProvider {
  protected readonly logger = new Logger(this.constructor.name);
  protected readonly httpClient: AxiosInstance;
  
  protected requestCount = 0;
  protected lastRequestTime = 0;
  protected isActiveProvider = true;

  constructor(protected readonly config: ApiProviderConfig) {
    this.httpClient = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        'User-Agent': 'Prospecter-Fichap/1.0',
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para logging
    this.httpClient.interceptors.request.use(
      (config) => {
        this.logger.debug(`Request to ${config.url}`);
        return config;
      },
      (error) => {
        this.logger.error(`Request error: ${error.message}`);
        return Promise.reject(error);
      }
    );

    this.httpClient.interceptors.response.use(
      (response) => {
        this.logger.debug(`Response from ${response.config.url}: ${response.status}`);
        return response;
      },
      (error) => {
        this.logger.error(`Response error from ${error.config?.url}: ${error.message}`);
        return Promise.reject(error);
      }
    );
  }

  // Getters
  get provider(): ApiProvider {
    return this.config.provider;
  }

  get name(): string {
    return this.config.name;
  }

  get baseUrl(): string {
    return this.config.baseUrl;
  }

  get apiKey(): string {
    return this.config.apiKey;
  }

  get rateLimit(): { requests: number; window: number } {
    return this.config.rateLimit;
  }

  get costPerRequest(): number {
    return this.config.costPerRequest;
  }

  get isActive(): boolean {
    return this.isActiveProvider && !!this.config.apiKey;
  }

  // Métodos principales (abstractos)
  abstract validateEmail(email: string): Promise<ApiResponse>;
  abstract enrichCompany(domain: string): Promise<ApiResponse>;
  abstract enrichPerson(email: string): Promise<ApiResponse>;

  // Métodos de utilidad
  isRateLimited(): boolean {
    if (!this.isActive) return true;

    const now = Date.now();
    const timeWindow = now - this.config.rateLimit.window;

    // Limpiar requests antiguos
    if (this.lastRequestTime < timeWindow) {
      this.requestCount = 0;
    }

    return this.requestCount >= this.config.rateLimit.requests;
  }

  getRemainingRequests(): number {
    if (!this.isActive) return 0;

    const now = Date.now();
    const timeWindow = now - this.config.rateLimit.window;

    if (this.lastRequestTime < timeWindow) {
      return this.config.rateLimit.requests;
    }

    return Math.max(0, this.config.rateLimit.requests - this.requestCount);
  }

  resetRateLimit(): void {
    this.requestCount = 0;
    this.lastRequestTime = 0;
  }

  getCostEstimate(): number {
    return this.config.costPerRequest;
  }

  // Métodos de configuración
  setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
  }

  setActive(active: boolean): void {
    this.isActiveProvider = active;
  }

  updateRateLimit(requests: number, window: number): void {
    this.config.rateLimit = { requests, window };
  }

  // Métodos protegidos para uso interno
  protected async makeRequest<T>(
    method: 'GET' | 'POST',
    endpoint: string,
    params?: Record<string, any>,
    data?: any
  ): Promise<ApiResponse<T>> {
    const startTime = Date.now();

    try {
      // Verificar rate limit
      if (this.isRateLimited()) {
        return {
          success: false,
          error: 'Rate limit exceeded',
          rateLimited: true,
          responseTime: Date.now() - startTime,
        };
      }

      // Verificar si el proveedor está activo
      if (!this.isActive) {
        return {
          success: false,
          error: 'Provider is not active',
          responseTime: Date.now() - startTime,
        };
      }

      // Realizar la petición
      let response: AxiosResponse<T>;
      
      if (method === 'GET') {
        response = await this.httpClient.get<T>(endpoint, { params });
      } else {
        response = await this.httpClient.post<T>(endpoint, data, { params });
      }

      // Actualizar contadores
      this.requestCount++;
      this.lastRequestTime = Date.now();

      const responseTime = Date.now() - startTime;

      return {
        success: true,
        data: response.data,
        cost: this.config.costPerRequest,
        responseTime,
      };

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      if (error.response?.status === 429) {
        return {
          success: false,
          error: 'Rate limit exceeded',
          rateLimited: true,
          responseTime,
        };
      }

      return {
        success: false,
        error: error.message || 'Unknown error',
        responseTime,
      };
    }
  }

  protected extractDomainFromEmail(email: string): string {
    return email.split('@')[1]?.toLowerCase() || '';
  }

  protected isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  protected sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
} 