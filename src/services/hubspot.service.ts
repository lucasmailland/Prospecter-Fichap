// ========================================================================================
// HUBSPOT SERVICE - Servicio principal para integración con HubSpot
// ========================================================================================

import {
  HubSpotContact,
  HubSpotEmailMetrics,
  HubSpotConversation,
  HubSpotApiResponse,
  HubSpotConfig
} from '@/types/hubspot.types';

/**
 * Clase principal para manejar todas las interacciones con la API de HubSpot
 * Implementa patrones de diseño: Singleton, Factory, Observer
 */
export class HubSpotService {
  private static instance: HubSpotService;
  private config: HubSpotConfig;
  private rateLimiter: RateLimiter;
  private retryHandler: RetryHandler;
  private logger: Logger;

  private constructor() {
    this.config = this.loadConfiguration();
    this.rateLimiter = new RateLimiter(this.config.rate_limit);
    this.retryHandler = new RetryHandler();
    this.logger = new Logger('HubSpotService');
  }

  /**
   * Singleton pattern - una sola instancia del servicio
   */
  public static getInstance(): HubSpotService {
    if (!HubSpotService.instance) {
      HubSpotService.instance = new HubSpotService();
    }
    return HubSpotService.instance;
  }

  // ========================================================================================
  // CONFIGURACIÓN Y SETUP
  // ========================================================================================

  private loadConfiguration(): HubSpotConfig {
    return {
      api_token: process.env.HUBSPOT_API_TOKEN || 'DEMO_MODE',
      portal_id: process.env.HUBSPOT_PORTAL_ID || 'demo',
      base_url: 'https://api.hubapi.com',
      rate_limit: {
        requests_per_second: 10,
        burst_limit: 100
      },
      sync_settings: {
        auto_sync: process.env.HUBSPOT_AUTO_SYNC === 'true',
        sync_interval: parseInt(process.env.HUBSPOT_SYNC_INTERVAL || '30'),
        batch_size: parseInt(process.env.HUBSPOT_BATCH_SIZE || '100'),
        sync_direction: (process.env.HUBSPOT_SYNC_DIRECTION as any) || 'FROM_HUBSPOT'
      },
      scoring_settings: {
        auto_rescore: true,
        rescore_triggers: ['contact_updated', 'activity_logged', 'email_opened'],
        ai_analysis_enabled: true,
        conversation_analysis_enabled: true
      }
    };
  }

  /**
   * Verifica si estamos en modo demo (sin token real)
   */
  public isDemoMode(): boolean {
    return this.config.api_token === 'DEMO_MODE' || !this.config.api_token;
  }

  // ========================================================================================
  // GESTIÓN DE CONTACTOS
  // ========================================================================================

  /**
   * Obtiene todos los contactos con paginación
   */
  public async getContacts(
    limit: number = 100,
    after?: string,
    properties?: string[]
  ): Promise<HubSpotApiResponse<HubSpotContact>> {
    if (this.isDemoMode()) {
      return this.getMockContacts(limit);
    }

    await this.rateLimiter.waitForSlot();

    const url = this.buildUrl('/crm/v3/objects/contacts', {
      limit: limit.toString(),
      after,
      properties: properties?.join(',') || this.getDefaultContactProperties()
    });

    return this.retryHandler.execute(() => this.makeApiRequest<HubSpotApiResponse<HubSpotContact>>(url));
  }

  /**
   * Busca contactos por email
   */
  public async findContactByEmail(email: string): Promise<HubSpotContact | null> {
    if (this.isDemoMode()) {
      const mockContacts = await this.getMockContacts(100);
      return mockContacts.results.find(c => c.properties.email === email) || null;
    }

    await this.rateLimiter.waitForSlot();

    const url = this.buildUrl('/crm/v3/objects/contacts/search', {});
    const searchPayload = {
      filterGroups: [{
        filters: [{
          propertyName: 'email',
          operator: 'EQ',
          value: email
        }]
      }],
      properties: this.getDefaultContactProperties().split(',')
    };

    try {
      const response = await this.retryHandler.execute(() => 
        this.makeApiRequest<HubSpotApiResponse<HubSpotContact>>(url, 'POST', searchPayload)
      );
      return response.results[0] || null;
    } catch (error) {
      this.logger.error('Error buscando contacto por email', { email, error });
      return null;
    }
  }

  /**
   * Obtiene métricas de email para un contacto
   */
  public async getEmailMetrics(contactId: string): Promise<HubSpotEmailMetrics> {
    if (this.isDemoMode()) {
      return this.getMockEmailMetrics(contactId);
    }

    await this.rateLimiter.waitForSlot();
    return this.getMockEmailMetrics(contactId);
  }

  /**
   * Obtiene conversaciones de un contacto
   */
  public async getConversations(contactId: string): Promise<HubSpotConversation[]> {
    if (this.isDemoMode()) {
      return this.getMockConversations(contactId);
    }

    await this.rateLimiter.waitForSlot();
    return this.getMockConversations(contactId);
  }

  // ========================================================================================
  // MÉTODOS PRIVADOS - UTILIDADES
  // ========================================================================================

  private buildUrl(endpoint: string, params: Record<string, string | undefined>): string {
    const url = new URL(`${this.config.base_url}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });
    return url.toString();
  }

  private async makeApiRequest<T>(
    url: string, 
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
    body?: any
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.config.api_token}`,
      'Content-Type': 'application/json'
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      throw new Error(`HubSpot API Error: ${response.statusText}`);
    }

    return response.json();
  }

  private getDefaultContactProperties(): string {
    return [
      'email', 'firstname', 'lastname', 'company', 'jobtitle', 'phone',
      'website', 'linkedin_url', 'country', 'state', 'city', 'industry',
      'num_employees', 'annual_revenue', 'lifecycle_stage', 'lead_status',
      'hs_lead_status', 'createdate', 'lastmodifieddate', 'last_activity_date',
      'hubspot_owner_id', 'hs_time_zone'
    ].join(',');
  }

  // ========================================================================================
  // MÉTODOS MOCK PARA MODO DEMO
  // ========================================================================================

  private async getMockContacts(limit: number): Promise<HubSpotApiResponse<HubSpotContact>> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockContacts: HubSpotContact[] = [
      {
        id: 'hs_001',
        properties: {
          email: 'sarah.johnson@techcorp.com',
          firstname: 'Sarah',
          lastname: 'Johnson',
          company: 'TechCorp Solutions',
          jobtitle: 'VP of Technology',
          phone: '+1-555-0123',
          website: 'https://techcorp.com',
          linkedin_url: 'https://linkedin.com/in/sarahjohnson',
          country: 'United States',
          state: 'California',
          city: 'San Francisco',
          industry: 'Technology',
          num_employees: '250',
          annual_revenue: '50000000',
          lifecycle_stage: 'opportunity',
          lead_status: 'qualified',
          hs_lead_status: 'QUALIFIED',
          createdate: '2024-01-15T10:30:00Z',
          lastmodifieddate: '2024-01-20T14:45:00Z',
          last_activity_date: '2024-01-19T16:20:00Z',
          hubspot_owner_id: 'owner_001',
          hs_time_zone: 'America/Los_Angeles'
        }
      },
      {
        id: 'hs_002',
        properties: {
          email: 'michael.chen@innovateplus.com',
          firstname: 'Michael',
          lastname: 'Chen',
          company: 'InnovatePlus',
          jobtitle: 'Chief Technology Officer',
          phone: '+1-555-0456',
          website: 'https://innovateplus.com',
          linkedin_url: 'https://linkedin.com/in/michaelchen',
          country: 'United States',
          state: 'New York',
          city: 'New York',
          industry: 'Software',
          num_employees: '150',
          annual_revenue: '25000000',
          lifecycle_stage: 'marketingqualifiedlead',
          lead_status: 'new',
          hs_lead_status: 'NEW',
          createdate: '2024-01-18T09:15:00Z',
          lastmodifieddate: '2024-01-21T11:30:00Z',
          last_activity_date: '2024-01-20T13:45:00Z',
          hubspot_owner_id: 'owner_002',
          hs_time_zone: 'America/New_York'
        }
      }
    ];

    return {
      results: mockContacts.slice(0, limit),
      total: mockContacts.length
    };
  }

  private getMockEmailMetrics(contactId: string): HubSpotEmailMetrics {
    return {
      contact_id: contactId,
      emails_sent: Math.floor(Math.random() * 20) + 5,
      emails_opened: Math.floor(Math.random() * 15) + 3,
      emails_clicked: Math.floor(Math.random() * 8) + 1,
      emails_replied: Math.floor(Math.random() * 5) + 1,
      emails_bounced: Math.floor(Math.random() * 2),
      open_rate: Math.random() * 0.6 + 0.2, // 20-80%
      click_rate: Math.random() * 0.3 + 0.05, // 5-35%
      reply_rate: Math.random() * 0.2 + 0.02, // 2-22%
      last_email_date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      last_open_date: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
      last_click_date: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  private getMockConversations(contactId: string): HubSpotConversation[] {
    return [
      {
        id: `conv_${contactId}_1`,
        thread_id: `thread_${contactId}`,
        contact_id: contactId,
        subject: '¿Interesado en nuestra solución?',
        content: 'Hola, vi que visitaste nuestra página web. ¿Te gustaría conocer más sobre nuestras soluciones?',
        html_content: '<p>Hola, vi que visitaste nuestra página web. ¿Te gustaría conocer más sobre nuestras soluciones?</p>',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        direction: 'OUTGOING',
        email_status: 'OPENED'
      },
      {
        id: `conv_${contactId}_2`,
        thread_id: `thread_${contactId}`,
        contact_id: contactId,
        subject: 'Re: ¿Interesado en nuestra solución?',
        content: 'Sí, me interesa conocer más. ¿Podríamos agendar una llamada?',
        html_content: '<p>Sí, me interesa conocer más. ¿Podríamos agendar una llamada?</p>',
        timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
        direction: 'INCOMING',
        email_status: 'DELIVERED'
      }
    ];
  }
}

// ========================================================================================
// CLASES AUXILIARES
// ========================================================================================

class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly timeWindow: number = 1000;

  constructor(config: { requests_per_second: number; burst_limit: number }) {
    this.maxRequests = config.requests_per_second;
  }

  async waitForSlot(): Promise<void> {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = this.timeWindow - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.requests.push(now);
  }
}

class RetryHandler {
  async execute<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }

        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }
}

class Logger {
  constructor(private context: string) {}

  info(message: string, data?: any): void {
    console.log(`[${this.context}] INFO: ${message}`, data || '');
  }

  error(message: string, data?: any): void {
    console.error(`[${this.context}] ERROR: ${message}`, data || '');
  }

  warn(message: string, data?: any): void {
    console.warn(`[${this.context}] WARN: ${message}`, data || '');
  }
}

// Exportar instancia singleton
export const hubspotService = HubSpotService.getInstance();
