import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService, LoginResponse } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto, RegisterDto, RefreshTokenDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autentica al usuario y retorna tokens JWT',
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', description: 'Token de acceso (1 hora)' },
        refresh_token: { type: 'string', description: 'Token de refresco (7 días)' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
            lastLogin: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
  })
  @ApiResponse({
    status: 429,
    description: 'Demasiados intentos de login',
  })
  async login(@Request() req, @Body() loginDto: LoginDto): Promise<LoginResponse> {
    const clientIP = this.getClientIP(req);
    return this.authService.login(req.user, clientIP);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description: 'Crea una nueva cuenta de usuario',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o usuario ya existe',
  })
  async register(@Request() req, @Body() registerDto: RegisterDto) {
    const clientIP = this.getClientIP(req);
    return this.authService.register(registerDto, clientIP);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refrescar token',
    description: 'Genera un nuevo token de acceso usando el refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'Token refrescado exitosamente',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', description: 'Nuevo token de acceso' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido',
  })
  async refresh(@Request() req, @Body() refreshDto: RefreshTokenDto) {
    const clientIP = this.getClientIP(req);
    return this.authService.refreshToken(refreshDto.refresh_token, clientIP);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cerrar sesión',
    description: 'Cierra la sesión del usuario actual',
  })
  @ApiResponse({
    status: 200,
    description: 'Sesión cerrada exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  async logout(@Request() req) {
    const clientIP = this.getClientIP(req);
    return this.authService.logout(req.user.id, clientIP);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener perfil del usuario',
    description: 'Retorna la información del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  getProfile(@Request() req) {
    return req.user;
  }

  /**
   * Sanitizes and validates IP address input to prevent XSS attacks
   * @param input - Raw IP input from headers
   * @returns Sanitized and validated IP address or 'unknown'
   */
  private sanitizeIP(input: string | undefined): string {
    if (!input || typeof input !== 'string') {
      return 'unknown';
    }

    // Remove any potential XSS characters and whitespace
    const cleaned = input.trim().replace(/[<>\"'&\\]/g, '');
    
    // Validate IPv4 format (xxx.xxx.xxx.xxx)
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    
    // Validate IPv6 format (basic validation)
    const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
    
    if (ipv4Regex.test(cleaned)) {
      // Additional validation for IPv4 ranges
      const parts = cleaned.split('.');
      if (parts.every(part => parseInt(part, 10) <= 255)) {
        return cleaned;
      }
    }
    
    if (ipv6Regex.test(cleaned)) {
      return cleaned;
    }
    
    // If not a valid IP format, return 'unknown'
    return 'unknown';
  }

  /**
   * Securely extracts client IP address from request headers
   * @param req - Express request object
   * @returns Sanitized client IP address
   */
  private getClientIP(req: any): string {
    // Try to get IP from various headers in order of preference
    const forwardedFor = req.get('X-Forwarded-For');
    if (forwardedFor) {
      // X-Forwarded-For can contain multiple IPs, take the first one
      const firstIP = forwardedFor.split(',')[0];
      const sanitizedIP = this.sanitizeIP(firstIP);
      if (sanitizedIP !== 'unknown') {
        return sanitizedIP;
      }
    }

    // Fallback to other headers
    const realIP = this.sanitizeIP(req.get('X-Real-IP'));
    if (realIP !== 'unknown') {
      return realIP;
    }

    const cfConnectingIP = this.sanitizeIP(req.get('CF-Connecting-IP'));
    if (cfConnectingIP !== 'unknown') {
      return cfConnectingIP;
    }

    // Fallback to connection remote address
    const connectionIP = this.sanitizeIP(
      req.connection?.remoteAddress || req.socket?.remoteAddress
    );
    if (connectionIP !== 'unknown') {
      return connectionIP;
    }

    return 'unknown';
  }
} 