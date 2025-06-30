import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';

export interface SecurityEvent {
  timestamp: Date;
  eventType: 'AUTH_FAILURE' | 'AUTH_SUCCESS' | 'USER_REGISTRATION' | 'USER_LOGOUT' | 'RATE_LIMIT_EXCEEDED' | 'INVALID_INPUT' | 'SUSPICIOUS_ACTIVITY' | 'API_ABUSE';
  ip: string;
  userAgent: string;
  endpoint: string;
  method: string;
  details: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

@Injectable()
export class SecurityService {
  private readonly logger = new Logger(SecurityService.name);
  private readonly securityEvents: SecurityEvent[] = [];
  private readonly suspiciousIPs = new Set<string>();
  private readonly failedAttempts = new Map<string, number>();

  /**
   * Registra un evento de seguridad
   */
  logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date(),
    };

    this.securityEvents.push(securityEvent);
    
    // Log según severidad
    switch (event.severity) {
      case 'CRITICAL':
        this.logger.error(`🚨 CRITICAL: ${event.eventType} - ${event.details}`, {
          ip: event.ip,
          endpoint: event.endpoint,
          userAgent: event.userAgent,
        });
        break;
      case 'HIGH':
        this.logger.warn(`⚠️ HIGH: ${event.eventType} - ${event.details}`, {
          ip: event.ip,
          endpoint: event.endpoint,
        });
        break;
      case 'MEDIUM':
        this.logger.warn(`⚠️ MEDIUM: ${event.eventType} - ${event.details}`, {
          ip: event.ip,
        });
        break;
      case 'LOW':
        this.logger.log(`ℹ️ LOW: ${event.eventType} - ${event.details}`);
        break;
    }

    // Verificar si la IP debe ser marcada como sospechosa
    this.checkSuspiciousActivity(event);
  }

  /**
   * Valida entrada de datos contra ataques comunes
   */
  validateInput(input: string): { isValid: boolean; sanitized: string; threats?: string[] } {
    const threats: string[] = [];
    let sanitized = input;

    // Detectar SQL Injection
    const sqlInjectionPattern = /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute|script)\b)/i;
    if (sqlInjectionPattern.test(input)) {
      threats.push('SQL_INJECTION_ATTEMPT');
    }

    // Detectar XSS
    const xssPattern = /<script|javascript:|vbscript:|onload=|onerror=|onclick=/i;
    if (xssPattern.test(input)) {
      threats.push('XSS_ATTEMPT');
    }

    // Detectar Path Traversal
    const pathTraversalPattern = /\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e%5c/i;
    if (pathTraversalPattern.test(input)) {
      threats.push('PATH_TRAVERSAL_ATTEMPT');
    }

    // Detectar Command Injection
    const commandInjectionPattern = /[;&|`$(){}[\]]/;
    if (commandInjectionPattern.test(input)) {
      threats.push('COMMAND_INJECTION_ATTEMPT');
    }

    // Sanitizar entrada
    sanitized = input
      .replace(/[<>]/g, '') // Remover < >
      .replace(/javascript:/gi, '') // Remover javascript:
      .replace(/on\w+=/gi, '') // Remover event handlers
      .trim();

    return {
      isValid: threats.length === 0,
      sanitized,
      threats: threats.length > 0 ? threats : undefined,
    };
  }

  /**
   * Verifica si una IP está en la lista negra
   */
  isIPBlocked(ip: string): boolean {
    return this.suspiciousIPs.has(ip);
  }

  /**
   * Registra un intento fallido de autenticación
   */
  recordFailedAttempt(ip: string): void {
    const attempts = this.failedAttempts.get(ip) || 0;
    this.failedAttempts.set(ip, attempts + 1);

    if (attempts + 1 >= 5) {
      this.suspiciousIPs.add(ip);
      this.logSecurityEvent({
        eventType: 'AUTH_FAILURE',
        ip,
        userAgent: 'Unknown',
        endpoint: 'auth',
        method: 'POST',
        details: `Multiple failed login attempts from IP: ${ip}`,
        severity: 'HIGH',
      });
    }
  }

  /**
   * Verifica actividad sospechosa
   */
  private checkSuspiciousActivity(event: Omit<SecurityEvent, 'timestamp'>): void {
    const recentEvents = this.securityEvents.filter(
      e => e.ip === event.ip && 
           e.timestamp > new Date(Date.now() - 5 * 60 * 1000) // Últimos 5 minutos
    );

    if (recentEvents.length > 10 && !this.suspiciousIPs.has(event.ip)) {
      this.suspiciousIPs.add(event.ip);
      // No llamar logSecurityEvent aquí para evitar recursión infinita
      this.logger.warn(`🚨 SUSPICIOUS_ACTIVITY: High activity detected from IP: ${event.ip} - ${recentEvents.length} events in 5 minutes`, {
        ip: event.ip,
        userAgent: event.userAgent,
        endpoint: 'multiple',
        method: 'multiple',
      });
    }
  }

  /**
   * Obtiene estadísticas de seguridad
   */
  getSecurityStats(): {
    totalEvents: number;
    blockedIPs: number;
    suspiciousIPs: number;
    recentEvents: SecurityEvent[];
  } {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    return {
      totalEvents: this.securityEvents.length,
      blockedIPs: this.suspiciousIPs.size,
      suspiciousIPs: this.suspiciousIPs.size,
      recentEvents: this.securityEvents.filter(e => e.timestamp > oneHourAgo),
    };
  }

  /**
   * Limpia eventos antiguos (más de 24 horas)
   */
  cleanupOldEvents(): void {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const initialLength = this.securityEvents.length;
    
    // Mantener solo eventos de las últimas 24 horas
    while (this.securityEvents.length > 0 && this.securityEvents[0].timestamp < oneDayAgo) {
      this.securityEvents.shift();
    }

    const removedCount = initialLength - this.securityEvents.length;
    if (removedCount > 0) {
      this.logger.log(`🧹 Cleaned up ${removedCount} old security events`);
    }
  }
} 