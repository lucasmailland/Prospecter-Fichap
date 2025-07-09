import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener configuraciones' })
  @ApiResponse({ status: 200, description: 'Configuraciones obtenidas exitosamente' })
  async getSettings() {
    return this.settingsService.getSettings();
  }

  @Put(':key')
  @ApiOperation({ summary: 'Actualizar configuración' })
  @ApiResponse({ status: 200, description: 'Configuración actualizada exitosamente' })
  async updateSetting(@Param('key') key: string, @Body() data: { value: string }) {
    return this.settingsService.updateSetting(key, data.value);
  }
} 