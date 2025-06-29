import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProspectsService } from '../../domain/services/prospects.service';
import { CreateProspectDto } from '../dto/create-prospect.dto';
import { UpdateProspectDto } from '../dto/update-prospect.dto';

@ApiTags('prospects')
@Controller('prospects')
export class ProspectsController {
  constructor(private readonly prospectsService: ProspectsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo prospecto' })
  @ApiResponse({ status: 201, description: 'Prospecto creado exitosamente' })
  create(@Body() createProspectDto: CreateProspectDto) {
    return this.prospectsService.create(createProspectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los prospectos' })
  @ApiResponse({ status: 200, description: 'Lista de prospectos' })
  findAll() {
    return this.prospectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un prospecto por ID' })
  @ApiResponse({ status: 200, description: 'Prospecto encontrado' })
  findOne(@Param('id') id: string) {
    return this.prospectsService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un prospecto' })
  @ApiResponse({ status: 200, description: 'Prospecto actualizado' })
  update(@Param('id') id: string, @Body() updateProspectDto: UpdateProspectDto) {
    return this.prospectsService.update(+id, updateProspectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un prospecto' })
  @ApiResponse({ status: 200, description: 'Prospecto eliminado' })
  remove(@Param('id') id: string) {
    return this.prospectsService.remove(+id);
  }
} 