import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SecurityService } from './security.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('security')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Post('scan')
  @ApiOperation({ summary: 'Ejecutar escaneo de seguridad' })
  @ApiResponse({ status: 200, description: 'Escaneo ejecutado exitosamente' })
  async runSecurityScan() {
    return this.securityService.runSecurityScan();
  }
} 