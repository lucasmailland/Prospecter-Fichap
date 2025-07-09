import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Servicio funcionando correctamente' })
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Información de la API' })
  @ApiResponse({ status: 200, description: 'Información básica de la API' })
  getInfo() {
    return {
      name: 'Prospecter-Fichap API',
      version: '1.0.0',
      description: 'API para gestión de prospectos y leads',
      docs: '/api/docs',
    };
  }
} 