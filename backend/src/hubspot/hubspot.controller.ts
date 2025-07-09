import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HubspotService } from './hubspot.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('hubspot')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('hubspot')
export class HubspotController {
  constructor(private readonly hubspotService: HubspotService) {}

  @Get('contacts')
  @ApiOperation({ summary: 'Obtener contactos de HubSpot' })
  @ApiResponse({ status: 200, description: 'Contactos obtenidos exitosamente' })
  async getContacts() {
    return this.hubspotService.getContacts();
  }

  @Post('sync')
  @ApiOperation({ summary: 'Sincronizar con HubSpot' })
  @ApiResponse({ status: 200, description: 'Sincronización iniciada' })
  async syncContacts() {
    return this.hubspotService.syncContacts();
  }
} 