import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhooksService {
  async handleHubspotWebhook(payload: any) {
    // TODO: Implementar manejo de webhook de HubSpot
    return { message: 'Webhook procesado', payload };
  }

  async processWebhook(type: string, data: any) {
    // TODO: Implementar procesamiento de diferentes tipos de webhook
    return { message: 'Webhook procesado', type, data };
  }
} 