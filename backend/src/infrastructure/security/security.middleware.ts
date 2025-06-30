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

    // Security Headers para prevenir XSS y otras vulnerabilidades
    this.setSecurityHeaders(res);
    
    // Validar Content-Type para prevenir ataques
    this.validateContentType(req);
    
    // Sanitizar input básico
    this.sanitizeInput(req);
    
    // Log de seguridad
    this.logSecurityEvent(req);

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

  private setSecurityHeaders(res: Response) {
    // Prevenir XSS
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Content Security Policy estricta
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "connect-src 'self'; " +
      "font-src 'self'; " +
      "frame-ancestors 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self'"
    );
    
    // Prevenir clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Content type sniffing protection
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Referrer policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // HTTPS enforcement (HSTS)
    if (process.env.NODE_ENV === 'production') {
      res.setHeader(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
      );
      
      // Secure cookies in production
      res.setHeader(
        'Set-Cookie',
        'HttpOnly; Secure; SameSite=Strict'
      );
    }
    
    // Permissions policy
    res.setHeader(
      'Permissions-Policy',
      'geolocation=(), microphone=(), camera=(), fullscreen=(self)'
    );
    
    // Remove server information
    res.removeHeader('X-Powered-By');
    res.setHeader('Server', 'Prospecter-Fichap');
  }

  private validateContentType(req: Request) {
    // Solo para requests POST/PUT/PATCH
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      const contentType = req.headers['content-type'];
      
      if (contentType && !this.isAllowedContentType(contentType)) {
        throw new Error(`Invalid content type: ${contentType}`);
      }
    }
  }

  private isAllowedContentType(contentType: string): boolean {
    const allowedTypes = [
      'application/json',
      'application/x-www-form-urlencoded',
      'multipart/form-data',
      'text/plain'
    ];
    
    return allowedTypes.some(type => contentType.includes(type));
  }

  private sanitizeInput(req: Request) {
    // Sanitizar query parameters
    if (req.query) {
      req.query = this.sanitizeObject(req.query);
    }
    
    // Sanitizar body (solo para JSON)
    if (req.body && typeof req.body === 'object') {
      req.body = this.sanitizeObject(req.body);
    }
    
    // Sanitizar params
    if (req.params) {
      req.params = this.sanitizeObject(req.params);
    }
  }

  private sanitizeObject(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return this.sanitizeValue(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }

    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleanKey = this.sanitizeKey(key);
      sanitized[cleanKey] = this.sanitizeObject(value);
    }

    return sanitized;
  }

  private sanitizeKey(key: string): string {
    if (typeof key !== 'string') return '';
    
    // Remover caracteres peligrosos de keys
    return key
      .replace(/[<>'"&$]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 100); // Limitar longitud
  }

  private sanitizeValue(value: any): any {
    if (typeof value !== 'string') {
      return value;
    }

    // Detectar y bloquear patrones maliciosos
    const maliciousPatterns = [
      /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /on\w+\s*=/gi,
      /<iframe[\s\S]*?>/gi,
      /<embed[\s\S]*?>/gi,
      /<object[\s\S]*?>/gi,
      /expression\s*\(/gi,
      /eval\s*\(/gi,
      /setTimeout\s*\(/gi,
      /setInterval\s*\(/gi
    ];

    for (const pattern of maliciousPatterns) {
      if (pattern.test(value)) {
        // Log el intento de ataque
        console.warn(`🚨 XSS attempt detected: ${value.substring(0, 100)}`);
        return '';
      }
    }

    // Sanitización básica
    return value
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .trim()
      .substring(0, 1000); // Limitar longitud
  }

  private logSecurityEvent(req: Request) {
    const userAgent = req.headers['user-agent'] || 'unknown';
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const method = req.method;
    const url = req.url;
    
    // Log básico (en producción usar un logger más robusto)
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔒 Security: ${method} ${url} from ${ip}`);
    }
    
    // Detectar comportamiento sospechoso
    this.detectSuspiciousActivity(req);
  }

  private detectSuspiciousActivity(req: Request) {
    const suspiciousPatterns = [
      /\.\./,           // Directory traversal
      /\/etc\/passwd/,  // Unix password file
      /\/windows\//i,   // Windows paths
      /\bcmd\b/i,       // Command injection
      /\bexec\b/i,      // Command execution
      /\bunion\b.*\bselect\b/i, // SQL injection
      /\bdrop\b.*\btable\b/i,   // SQL injection
    ];

    const fullUrl = req.url;
    const body = JSON.stringify(req.body || {});
    const query = JSON.stringify(req.query || {});
    
    const testString = `${fullUrl} ${body} ${query}`.toLowerCase();
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(testString)) {
        console.warn(`🚨 Suspicious activity detected from ${req.ip}: ${pattern}`);
        
        // En producción, aquí se podría:
        // - Bloquear la IP temporalmente
        // - Enviar alerta al equipo de seguridad
        // - Incrementar rate limiting
        break;
      }
    }
  }
} 