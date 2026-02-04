/**
 * Enhanced API Layer for Financial Operations
 * Structured API client with error handling, retries, and validation
 */

import { FinancialException, FinancialErrorFactory, financialErrorHandler } from './error-handling';
import { performanceMonitor } from './performance-optimization';

// ============================================================================
// API CLIENT CONFIG
// ============================================================================

export interface ApiConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
}

// ============================================================================
// ENHANCED API CLIENT
// ============================================================================

export class FinancialApiClient {
  private config: Required<ApiConfig>;
  private requestInterceptors: Array<(config: RequestInit) => RequestInit> = [];
  private responseInterceptors: Array<(response: Response) => Promise<Response>> = [];

  constructor(config: ApiConfig) {
    this.config = {
      baseUrl: config.baseUrl,
      apiKey: config.apiKey || '',
      timeout: config.timeout || 30000,
      retries: config.retries || 3,
      retryDelay: config.retryDelay || 1000,
      headers: config.headers || {},
    };
  }

  /**
   * Add request interceptor
   */
  public addRequestInterceptor(interceptor: (config: RequestInit) => RequestInit): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  public addResponseInterceptor(interceptor: (response: Response) => Promise<Response>): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Execute API request with retry logic
   */
  public async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<{ data: T; status: number; headers: Headers }> {
    const markName = `api_request_${Date.now()}`;
    performanceMonitor.mark(markName);

    const method = options.method || 'GET';
    const url = `${this.config.baseUrl}${endpoint}`;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= (options.retries ?? this.config.retries); attempt++) {
      try {
        const response = await this.executeRequest<T>(url, method, options);
        const duration = performanceMonitor.measure(
          `api_${method}_${endpoint}`,
          markName,
          { status: response.status }
        );

        if (duration > 1000) {
          console.warn(`Slow API request: ${method} ${endpoint} took ${duration}ms`);
        }

        return response;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors
        if (error instanceof FinancialException && error.code.startsWith('FIN_AUTH')) {
          throw error;
        }

        // Exponential backoff
        if (attempt < (options.retries ?? this.config.retries)) {
          const delay = (options.retries ?? this.config.retries) * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Request failed after retries');
  }

  /**
   * Execute GET request
   */
  public async get<T = any>(endpoint: string, options?: Omit<RequestOptions, 'method'>): Promise<{ data: T; status: number; headers: Headers }> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * Execute POST request
   */
  public async post<T = any>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<{ data: T; status: number; headers: Headers }> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * Execute PUT request
   */
  public async put<T = any>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<{ data: T; status: number; headers: Headers }> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  /**
   * Execute DELETE request
   */
  public async delete<T = any>(endpoint: string, options?: Omit<RequestOptions, 'method'>): Promise<{ data: T; status: number; headers: Headers }> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Execute PATCH request
   */
  public async patch<T = any>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<{ data: T; status: number; headers: Headers }> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  /**
   * Internal method to execute request
   */
  private async executeRequest<T>(
    url: string,
    method: string,
    options: RequestOptions
  ): Promise<{ data: T; status: number; headers: Headers }> {
    const timeout = options.timeout || this.config.timeout;
    const requestInit: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
        ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
        ...options.headers,
      },
    };

    if (options.body && method !== 'GET') {
      requestInit.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
    }

    // Apply request interceptors
    let finalInit = requestInit;
    for (const interceptor of this.requestInterceptors) {
      finalInit = interceptor(finalInit);
    }

    // Make request
    let response = await fetch(url, finalInit);

    // Apply response interceptors
    for (const interceptor of this.responseInterceptors) {
      response = await interceptor(response);
    }

    // Handle errors
    if (!response.ok) {
      const error = await this.handleErrorResponse(response);
      throw error;
    }

    // Parse response
    const data = (await response.json()) as T;

    return {
      data,
      status: response.status,
      headers: response.headers,
    };
  }

  /**
   * Handle error responses
   */
  private async handleErrorResponse(response: Response): Promise<FinancialException> {
    try {
      const errorData = await response.json();
      throw FinancialErrorFactory.externalServiceError(`HTTP ${response.status}`, response.status);
    } catch {
      throw FinancialErrorFactory.externalServiceError(`HTTP ${response.status}`, response.status);
    }
  }
}

// ============================================================================
// SPECIALIZED API SERVICES
// ============================================================================

export class FinanceApiService {
  private client: FinancialApiClient;

  constructor(client: FinancialApiClient) {
    this.client = client;
  }

  // ======= FOUNDERS =======

  async getFounders() {
    return this.client.get('/api/internal/finance/founders');
  }

  async getFounder(id: string) {
    return this.client.get(`/api/internal/finance/founders/${id}`);
  }

  async createFounder(data: any) {
    return this.client.post('/api/internal/finance/founders', data);
  }

  async updateFounder(id: string, data: any) {
    return this.client.put(`/api/internal/finance/founders/${id}`, data);
  }

  async deleteFounder(id: string) {
    return this.client.delete(`/api/internal/finance/founders/${id}`);
  }

  // ======= ACCOUNTS =======

  async getAccounts() {
    return this.client.get('/api/internal/finance/accounts');
  }

  async createAccount(data: any) {
    return this.client.post('/api/internal/finance/accounts', data);
  }

  async updateAccount(id: string, data: any) {
    return this.client.put(`/api/internal/finance/accounts/${id}`, data);
  }

  async deleteAccount(id: string) {
    return this.client.delete(`/api/internal/finance/accounts/${id}`);
  }

  // ======= EXPENSES =======

  async getExpenses(filters?: Record<string, any>) {
    const params = new URLSearchParams(filters || {});
    return this.client.get(`/api/internal/finance/expenses?${params}`);
  }

  async createExpense(data: any) {
    return this.client.post('/api/internal/finance/expenses', data);
  }

  async updateExpense(id: string, data: any) {
    return this.client.put(`/api/internal/finance/expenses/${id}`, data);
  }

  async deleteExpense(id: string) {
    return this.client.delete(`/api/internal/finance/expenses/${id}`);
  }

  async bulkDeleteExpenses(ids: string[]) {
    return this.client.post('/api/internal/finance/expenses/bulk-delete', { ids });
  }

  // ======= SUBSCRIPTIONS =======

  async getSubscriptions() {
    return this.client.get('/api/internal/finance/subscriptions');
  }

  async createSubscription(data: any) {
    return this.client.post('/api/internal/finance/subscriptions', data);
  }

  async updateSubscription(id: string, data: any) {
    return this.client.put(`/api/internal/finance/subscriptions/${id}`, data);
  }

  async deleteSubscription(id: string) {
    return this.client.delete(`/api/internal/finance/subscriptions/${id}`);
  }

  // ======= ANALYTICS & METRICS =======

  async getFinancialMetrics() {
    return this.client.get('/api/internal/finance/metrics');
  }

  async getDashboard() {
    return this.client.get('/api/internal/finance/dashboard');
  }

  async getCashFlow(months: number = 12) {
    return this.client.get(`/api/internal/finance/cash-flow?months=${months}`);
  }

  async getFinancialHealthScore() {
    return this.client.get('/api/internal/finance/health-score');
  }

  // ======= EXPORTS =======

  async exportExpenses(format: 'csv' | 'json' = 'csv') {
    return this.client.get(`/api/internal/finance/export/expenses?format=${format}`);
  }

  async exportFinancialStatement(format: 'csv' | 'json' | 'pdf' = 'pdf') {
    return this.client.get(`/api/internal/finance/export/statement?format=${format}`);
  }

  // ======= RECONCILIATION =======

  async getReconciliations() {
    return this.client.get('/api/internal/finance/reconciliations');
  }

  async createReconciliation(data: any) {
    return this.client.post('/api/internal/finance/reconciliations', data);
  }

  // ======= AUDIT TRAIL =======

  async getAuditTrail(entityType?: string, entityId?: string) {
    const params = new URLSearchParams();
    if (entityType) params.append('entityType', entityType);
    if (entityId) params.append('entityId', entityId);
    return this.client.get(`/api/internal/finance/audit?${params}`);
  }
}

// ============================================================================
// GLOBAL INSTANCE FACTORY
// ============================================================================

let globalApiClient: FinancialApiClient | null = null;
let globalApiService: FinanceApiService | null = null;

export function initializeFinanceApi(config: ApiConfig): FinanceApiService {
  globalApiClient = new FinancialApiClient(config);

  // Add global error handler
  globalApiClient.addResponseInterceptor(async (response) => {
    if (!response.ok) {
      const error = FinancialErrorFactory.externalServiceError(`HTTP ${response.status}`, response.status);
      await financialErrorHandler.handle(error);
    }
    return response;
  });

  globalApiService = new FinanceApiService(globalApiClient);
  return globalApiService;
}

export function getFinanceApi(): FinanceApiService {
  if (!globalApiService) {
    globalApiService = new FinanceApiService(new FinancialApiClient({ baseUrl: '/api' }));
  }
  return globalApiService;
}

export default {
  FinancialApiClient,
  FinanceApiService,
  initializeFinanceApi,
  getFinanceApi,
};
