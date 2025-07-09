import { Controller, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('hubspot')
  @ApiOperation({ summary: 'Procesar webhook de HubSpot' })
  @ApiResponse({ status: 200, description: 'Webhook procesado exitosamente' })
  async handleHubspotWebhook(@Body() payload: any) {
    return this.webhooksService.handleHubspotWebhook(payload);
  }

  @Post(':type')
  @ApiOperation({ summary: 'Procesar webhook genérico' })
  @ApiResponse({ status: 200, description: 'Webhook procesado exitosamente' })
  async processWebhook(@Param('type') type: string, @Body() data: any) {
    return this.webhooksService.processWebhook(type, data);
  }
} 