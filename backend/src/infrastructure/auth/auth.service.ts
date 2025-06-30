import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SecurityService } from '../security/security.service';
import { UserRole } from '../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    role: string;
    lastLogin: Date;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly securityService: SecurityService,
  ) {}

  /**
   * Valida credenciales de usuario
   */
  async validateUser(email: string, password: string, clientIP: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      
      if (!user) {
        this.securityService.recordFailedAttempt(clientIP);
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        this.securityService.recordFailedAttempt(clientIP);
        throw new UnauthorizedException('Invalid credentials');
      }

      // Verificar si la cuenta está bloqueada
      if (user.isBlocked) {
        this.securityService.logSecurityEvent({
          eventType: 'AUTH_FAILURE',
          ip: clientIP,
          userAgent: 'Unknown',
          endpoint: '/auth/login',
          method: 'POST',
          details: `Login attempt to blocked account: ${email}`,
          severity: 'HIGH',
        });
        throw new UnauthorizedException('Account is blocked');
      }

      // Actualizar último login
      await this.usersService.updateLastLogin(user.id);

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        lastLogin: new Date(),
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      this.securityService.logSecurityEvent({
        eventType: 'AUTH_FAILURE',
        ip: clientIP,
        userAgent: 'Unknown',
        endpoint: '/auth/login',
        method: 'POST',
        details: `Authentication error: ${error.message}`,
        severity: 'MEDIUM',
      });
      
      throw new UnauthorizedException('Authentication failed');
    }
  }

  /**
   * Genera tokens JWT
   */
  async login(user: any, clientIP: string): Promise<LoginResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '1h' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);

    // Log successful login
    this.securityService.logSecurityEvent({
      eventType: 'AUTH_SUCCESS',
      ip: clientIP,
      userAgent: 'Unknown',
      endpoint: '/auth/login',
      method: 'POST',
      details: `Successful login for user: ${user.email}`,
      severity: 'LOW',
    });

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    };
  }

  /**
   * Refresca token JWT
   */
  async refreshToken(refresh_token: string, clientIP: string): Promise<{ access_token: string }> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(refresh_token);
      
      const user = await this.usersService.findById(payload.sub);
      if (!user || user.isBlocked) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const access_token = await this.jwtService.signAsync(newPayload, { expiresIn: '1h' });

      return { access_token };
    } catch (error) {
      this.securityService.logSecurityEvent({
        eventType: 'AUTH_FAILURE',
        ip: clientIP,
        userAgent: 'Unknown',
        endpoint: '/auth/refresh',
        method: 'POST',
        details: `Invalid refresh token attempt`,
        severity: 'MEDIUM',
      });
      
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Registra un nuevo usuario
   */
  async register(userData: {
    email: string;
    password: string;
    name: string;
    role?: string;
  }, clientIP: string): Promise<{ message: string; user: any }> {
    // Validar entrada
    const emailValidation = this.securityService.validateInput(userData.email);
    const passwordValidation = this.securityService.validateInput(userData.password);
    const nameValidation = this.securityService.validateInput(userData.name);

    if (!emailValidation.isValid || !passwordValidation.isValid || !nameValidation.isValid) {
      this.securityService.logSecurityEvent({
        eventType: 'INVALID_INPUT',
        ip: clientIP,
        userAgent: 'Unknown',
        endpoint: '/auth/register',
        method: 'POST',
        details: `Malicious input in registration attempt`,
        severity: 'HIGH',
      });
      throw new BadRequestException('Invalid input data');
    }

    // Verificar si el usuario ya existe
    const existingUser = await this.usersService.findByEmail(userData.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Crear usuario
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const user = await this.usersService.create({
      ...userData,
      password: hashedPassword,
      role: userData.role as UserRole || UserRole.USER,
    });

    this.securityService.logSecurityEvent({
      eventType: 'USER_REGISTRATION',
      ip: clientIP,
      userAgent: 'Unknown',
      endpoint: '/auth/register',
      method: 'POST',
      details: `New user registered: ${userData.email}`,
      severity: 'LOW',
    });

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  /**
   * Cierra sesión
   */
  async logout(userId: string, clientIP: string): Promise<{ message: string }> {
    // En una implementación real, aquí invalidarías el token
    // Por ahora, solo logueamos el evento
    
    this.securityService.logSecurityEvent({
      eventType: 'USER_LOGOUT',
      ip: clientIP,
      userAgent: 'Unknown',
      endpoint: '/auth/logout',
      method: 'POST',
      details: `User logout: ${userId}`,
      severity: 'LOW',
    });

    return { message: 'Logged out successfully' };
  }
} 