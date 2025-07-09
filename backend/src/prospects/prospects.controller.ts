import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProspectsService } from './prospects.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { Lead } from '@prisma/client';

@ApiTags('prospects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('prospects')
export class ProspectsController {
  constructor(private readonly prospectsService: ProspectsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los prospectos' })
  @ApiResponse({ status: 200, description: 'Lista de prospectos obtenida exitosamente' })
  async findAll() {
    return this.prospectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener prospecto por ID' })
  @ApiResponse({ status: 200, description: 'Prospecto obtenido exitosamente' })
  @ApiResponse({ status: 404, description: 'Prospecto no encontrado' })
  async findById(@Param('id') id: string) {
    return this.prospectsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nuevo prospecto' })
  @ApiResponse({ status: 201, description: 'Prospecto creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() leadData: {
    email: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    jobTitle?: string;
    phone?: string;
    source?: string;
    userId: string;
  }) {
    return this.prospectsService.create(leadData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar prospecto' })
  @ApiResponse({ status: 200, description: 'Prospecto actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Prospecto no encontrado' })
  async update(@Param('id') id: string, @Body() leadData: Partial<Lead>) {
    return this.prospectsService.update(id, leadData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar prospecto' })
  @ApiResponse({ status: 204, description: 'Prospecto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Prospecto no encontrado' })
  async delete(@Param('id') id: string) {
    await this.prospectsService.delete(id);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Crear múltiples prospectos' })
  @ApiResponse({ status: 201, description: 'Prospectos creados exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async bulkCreate(@Body() leads: any[]) {
    return this.prospectsService.bulkCreate(leads);
  }
} 