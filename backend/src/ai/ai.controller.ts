import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('ai')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generar contenido con AI' })
  @ApiResponse({ status: 200, description: 'Contenido generado exitosamente' })
  async generateContent(@Body() data: { prompt: string }) {
    return this.aiService.generateContent(data.prompt);
  }

  @Post('analyze')
  @ApiOperation({ summary: 'Analizar texto con AI' })
  @ApiResponse({ status: 200, description: 'Texto analizado exitosamente' })
  async analyzeText(@Body() data: { text: string }) {
    return this.aiService.analyzeText(data.text);
  }
} 