import { Controller, Get, Post, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { SecurityService } from '../../infrastructure/security/security.service';

@ApiTags('security')
@Controller('security')
@UseGuards(ThrottlerGuard)
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get('stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener estadísticas de seguridad',
    description: 'Retorna estadísticas de eventos de seguridad, IPs bloqueadas y actividad reciente',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de seguridad obtenidas exitosamente',
    schema: {
      type: 'object',
      properties: {
        totalEvents: { type: 'number', description: 'Total de eventos de seguridad' },
        blockedIPs: { type: 'number', description: 'Número de IPs bloqueadas' },
        suspiciousIPs: { type: 'number', description: 'Número de IPs sospechosas' },
        recentEvents: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              timestamp: { type: 'string', format: 'date-time' },
              eventType: { type: 'string' },
              ip: { type: 'string' },
              endpoint: { type: 'string' },
              severity: { type: 'string' },
              details: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 429,
    description: 'Demasiadas solicitudes - Rate limit excedido',
  })
  getSecurityStats() {
    return this.securityService.getSecurityStats();
  }

  @Post('cleanup')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Limpiar eventos antiguos',
    description: 'Elimina eventos de seguridad con más de 24 horas de antigüedad',
  })
  @ApiResponse({
    status: 200,
    description: 'Limpieza completada exitosamente',
  })
  @ApiResponse({
    status: 429,
    description: 'Demasiadas solicitudes - Rate limit excedido',
  })
  cleanupOldEvents() {
    this.securityService.cleanupOldEvents();
    return {
      message: 'Limpieza de eventos antiguos completada',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Estado de seguridad',
    description: 'Verifica el estado del sistema de seguridad',
  })
  @ApiResponse({
    status: 200,
    description: 'Sistema de seguridad funcionando correctamente',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'healthy' },
        timestamp: { type: 'string', format: 'date-time' },
        securityFeatures: {
          type: 'array',
          items: { type: 'string' },
          example: ['Input Validation', 'Rate Limiting', 'IP Blocking', 'Event Logging'],
        },
      },
    },
  })
  getSecurityHealth() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      securityFeatures: [
        'Input Validation',
        'Rate Limiting',
        'IP Blocking',
        'Event Logging',
        'XSS Protection',
        'SQL Injection Protection',
        'Path Traversal Protection',
        'Command Injection Protection',
        'Security Headers',
        'CORS Protection',
      ],
    };
  }
} 