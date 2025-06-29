import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { EnrichmentOrchestratorService } from '../../domain/services/enrichment-orchestrator.service';
import { EnrichLeadDto, BulkEnrichDto, LeadResponseDto } from '../dto/enrich-lead.dto';
import { Lead } from '../../domain/entities/lead.entity';
import { EnrichmentLog } from '../../domain/entities/enrichment-log.entity';

@ApiTags('Enrichment')
@Controller('enrichment')
@ApiBearerAuth()
export class EnrichmentController {
  constructor(
    private readonly enrichmentService: EnrichmentOrchestratorService,
  ) {}

  @Post('lead')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Enriquecer un lead específico',
    description: 'Realiza enriquecimiento completo de un lead incluyendo validación de email, enriquecimiento de empresa y persona, y scoring',
  })
  @ApiResponse({
    status: 200,
    description: 'Lead enriquecido exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        lead: { $ref: '#/components/schemas/LeadResponseDto' },
        totalCost: { type: 'number' },
        totalTime: { type: 'number' },
        logs: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              type: { type: 'string' },
              provider: { type: 'string' },
              status: { type: 'string' },
              responseTime: { type: 'number' },
              cost: { type: 'number' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Lead no encontrado',
  })
  async enrichLead(@Body() enrichDto: EnrichLeadDto) {
    const result = await this.enrichmentService.enrichLead(
      enrichDto.leadId,
      enrichDto.enrichmentTypes,
    );

    return {
      success: result.success,
      lead: result.lead ? this.mapLeadToResponse(result.lead) : null,
      totalCost: result.totalCost,
      totalTime: result.totalTime,
      logs: result.logs.map(log => ({
        id: log.id,
        type: log.type,
        provider: log.provider,
        status: log.status,
        responseTime: log.responseTime,
        cost: log.cost,
        errorMessage: log.errorMessage,
      })),
    };
  }

  @Post('bulk')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Enriquecimiento masivo de leads',
    description: 'Realiza enriquecimiento de múltiples leads en lote',
  })
  @ApiResponse({
    status: 200,
    description: 'Enriquecimiento masivo completado',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              leadId: { type: 'string' },
              lead: { $ref: '#/components/schemas/LeadResponseDto' },
              totalCost: { type: 'number' },
              totalTime: { type: 'number' },
            },
          },
        },
        summary: {
          type: 'object',
          properties: {
            totalLeads: { type: 'number' },
            successful: { type: 'number' },
            failed: { type: 'number' },
            totalCost: { type: 'number' },
            totalTime: { type: 'number' },
          },
        },
      },
    },
  })
  async bulkEnrich(@Body() bulkDto: BulkEnrichDto) {
    const results = await this.enrichmentService.bulkEnrich(
      bulkDto.leadIds,
      bulkDto.enrichmentTypes,
    );

    const summary = {
      totalLeads: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      totalCost: results.reduce((sum, r) => sum + r.totalCost, 0),
      totalTime: results.reduce((sum, r) => sum + r.totalTime, 0),
    };

    return {
      success: summary.failed === 0,
      results: results.map(result => ({
        success: result.success,
        leadId: result.lead?.id,
        lead: result.lead ? this.mapLeadToResponse(result.lead) : null,
        totalCost: result.totalCost,
        totalTime: result.totalTime,
      })),
      summary,
    };
  }

  @Get('providers/status')
  @ApiOperation({
    summary: 'Obtener estado de los proveedores de APIs',
    description: 'Retorna el estado actual de todos los proveedores de APIs externas',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado de los proveedores',
    schema: {
      type: 'object',
      properties: {
        providers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              provider: { type: 'string' },
              isActive: { type: 'boolean' },
              isRateLimited: { type: 'boolean' },
              remainingRequests: { type: 'number' },
              costPerRequest: { type: 'number' },
              priority: { type: 'number' },
            },
          },
        },
      },
    },
  })
  async getProvidersStatus() {
    // Este método necesitaría acceso a los proveedores individuales
    // Por ahora retornamos un mock
    return {
      providers: [
        {
          name: 'MailboxLayer',
          provider: 'mailboxlayer',
          isActive: true,
          isRateLimited: false,
          remainingRequests: 95,
          costPerRequest: 0.01,
          priority: 1,
        },
        {
          name: 'Hunter',
          provider: 'hunter',
          isActive: true,
          isRateLimited: false,
          remainingRequests: 20,
          costPerRequest: 0.02,
          priority: 2,
        },
        {
          name: 'Clearbit',
          provider: 'clearbit',
          isActive: true,
          isRateLimited: false,
          remainingRequests: 950,
          costPerRequest: 0.05,
          priority: 3,
        },
      ],
    };
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Obtener estadísticas de enriquecimiento',
    description: 'Retorna estadísticas generales del sistema de enriquecimiento',
  })
  @ApiQuery({
    name: 'days',
    required: false,
    type: Number,
    description: 'Número de días para las estadísticas (por defecto 30)',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de enriquecimiento',
    schema: {
      type: 'object',
      properties: {
        totalEnrichments: { type: 'number' },
        successfulEnrichments: { type: 'number' },
        failedEnrichments: { type: 'number' },
        totalCost: { type: 'number' },
        averageResponseTime: { type: 'number' },
        topProviders: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              provider: { type: 'string' },
              requests: { type: 'number' },
              successRate: { type: 'number' },
              totalCost: { type: 'number' },
            },
          },
        },
        enrichmentTypes: {
          type: 'object',
          properties: {
            email_validation: { type: 'number' },
            company_enrichment: { type: 'number' },
            person_enrichment: { type: 'number' },
            scoring: { type: 'number' },
          },
        },
      },
    },
  })
  async getEnrichmentStats(@Query('days') days: number = 30) {
    // Este método necesitaría acceso al repositorio de logs
    // Por ahora retornamos un mock
    return {
      totalEnrichments: 1250,
      successfulEnrichments: 1180,
      failedEnrichments: 70,
      totalCost: 45.50,
      averageResponseTime: 1250,
      topProviders: [
        {
          provider: 'MailboxLayer',
          requests: 800,
          successRate: 0.95,
          totalCost: 8.00,
        },
        {
          provider: 'Hunter',
          requests: 300,
          successRate: 0.88,
          totalCost: 6.00,
        },
        {
          provider: 'Clearbit',
          requests: 150,
          successRate: 0.92,
          totalCost: 7.50,
        },
      ],
      enrichmentTypes: {
        email_validation: 800,
        company_enrichment: 150,
        person_enrichment: 300,
        scoring: 1250,
      },
    };
  }

  private mapLeadToResponse(lead: Lead): LeadResponseDto {
    return {
      id: lead.id,
      email: lead.email,
      firstName: lead.firstName,
      lastName: lead.lastName,
      fullName: lead.fullName,
      company: lead.company,
      jobTitle: lead.jobTitle,
      score: lead.score,
      priority: lead.priority,
      status: lead.status,
      isEmailValid: lead.isEmailValid,
      isHighPriority: lead.isHighPriority,
      isReadyForContact: lead.isReadyForContact,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
    };
  }
} 