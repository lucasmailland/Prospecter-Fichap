import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SecurityService } from './security.service';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  constructor(private readonly securityService: SecurityService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const clientIP = this.getClientIP(req);
    const userAgent = req.get('User-Agent') || 'Unknown';
    const endpoint = req.path;
    const method = req.method;

    // Verificar si la IP está bloqueada
    if (this.securityService.isIPBlocked(clientIP)) {
      this.securityService.logSecurityEvent({
        eventType: 'API_ABUSE',
        ip: clientIP,
        userAgent,
        endpoint,
        method,
        details: `Blocked request from blacklisted IP: ${clientIP}`,
        severity: 'HIGH',
      });

      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }

    // Validar headers de seguridad
    this.validateSecurityHeaders(req, clientIP, userAgent, endpoint, method);

    // Validar entrada de datos
    this.validateRequestData(req, clientIP, userAgent, endpoint, method);

    // Agregar headers de seguridad a la respuesta
    this.addSecurityHeaders(res);

    next();
  }

  /**
   * Obtiene la IP real del cliente considerando proxies
   */
  private getClientIP(req: Request): string {
    return (
      req.get('X-Forwarded-For')?.split(',')[0] ||
      req.get('X-Real-IP') ||
      req.get('CF-Connecting-IP') ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      'unknown'
    );
  }

  /**
   * Valida headers de seguridad
   */
  private validateSecurityHeaders(
    req: Request,
    clientIP: string,
    userAgent: string,
    endpoint: string,
    method: string,
  ): void {
    // Verificar Content-Type en requests POST/PUT/PATCH
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const contentType = req.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        this.securityService.logSecurityEvent({
          eventType: 'INVALID_INPUT',
          ip: clientIP,
          userAgent,
          endpoint,
          method,
          details: `Invalid Content-Type: ${contentType}`,
          severity: 'MEDIUM',
        });
      }
    }

    // Verificar User-Agent
    if (!userAgent || userAgent === 'Unknown' || userAgent.length < 10) {
      this.securityService.logSecurityEvent({
        eventType: 'SUSPICIOUS_ACTIVITY',
        ip: clientIP,
        userAgent,
        endpoint,
        method,
        details: `Suspicious User-Agent: ${userAgent}`,
        severity: 'LOW',
      });
    }

    // Verificar Referer en requests sensibles
    if (endpoint.includes('/auth') || endpoint.includes('/admin')) {
      const referer = req.get('Referer');
      if (!referer || !referer.includes(req.get('Host') || '')) {
        this.securityService.logSecurityEvent({
          eventType: 'SUSPICIOUS_ACTIVITY',
          ip: clientIP,
          userAgent,
          endpoint,
          method,
          details: `Missing or invalid Referer header`,
          severity: 'MEDIUM',
        });
      }
    }
  }

  /**
   * Valida datos de la request
   */
  private validateRequestData(
    req: Request,
    clientIP: string,
    userAgent: string,
    endpoint: string,
    method: string,
  ): void {
    // Validar query parameters
    if (req.query) {
      for (const [key, value] of Object.entries(req.query)) {
        if (typeof value === 'string') {
          const validation = this.securityService.validateInput(value);
          if (!validation.isValid) {
            this.securityService.logSecurityEvent({
              eventType: 'INVALID_INPUT',
              ip: clientIP,
              userAgent,
              endpoint,
              method,
              details: `Malicious input in query param ${key}: ${validation.threats?.join(', ')}`,
              severity: 'HIGH',
            });
          }
        }
      }
    }

    // Validar body parameters
    if (req.body && typeof req.body === 'object') {
      for (const [key, value] of Object.entries(req.body)) {
        if (typeof value === 'string') {
          const validation = this.securityService.validateInput(value);
          if (!validation.isValid) {
            this.securityService.logSecurityEvent({
              eventType: 'INVALID_INPUT',
              ip: clientIP,
              userAgent,
              endpoint,
              method,
              details: `Malicious input in body param ${key}: ${validation.threats?.join(', ')}`,
              severity: 'HIGH',
            });
          }
        }
      }
    }

    // Validar URL parameters
    if (req.params) {
      for (const [key, value] of Object.entries(req.params)) {
        if (typeof value === 'string') {
          const validation = this.securityService.validateInput(value);
          if (!validation.isValid) {
            this.securityService.logSecurityEvent({
              eventType: 'INVALID_INPUT',
              ip: clientIP,
              userAgent,
              endpoint,
              method,
              details: `Malicious input in URL param ${key}: ${validation.threats?.join(', ')}`,
              severity: 'HIGH',
            });
          }
        }
      }
    }
  }

  /**
   * Agrega headers de seguridad a la respuesta
   */
  private addSecurityHeaders(res: Response): void {
    // Headers de seguridad básicos
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Content Security Policy
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"
    );

    // Strict Transport Security (solo en HTTPS)
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    // Permissions Policy
    res.setHeader(
      'Permissions-Policy',
      'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=()'
    );
  }
} 