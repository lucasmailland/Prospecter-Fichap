import { Test, TestingModule } from '@nestjs/testing';
import { SecurityService } from './security.service';

describe('SecurityService', () => {
  let service: SecurityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecurityService],
    }).compile();

    service = module.get<SecurityService>(SecurityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateInput', () => {
    it('should detect SQL injection attempts', () => {
      const maliciousInputs = [
        "'; DROP TABLE users; --",
        "SELECT * FROM users WHERE id = 1",
        "UNION SELECT password FROM users",
        "INSERT INTO users VALUES (1, 'hacker')",
      ];

      maliciousInputs.forEach(input => {
        const result = service.validateInput(input);
        expect(result.isValid).toBe(false);
        expect(result.threats).toContain('SQL_INJECTION_ATTEMPT');
      });
    });

    it('should detect XSS attempts', () => {
      const maliciousInputs = [
        '<script>alert("xss")</script>',
        'javascript:alert("xss")',
        'onload=alert("xss")',
        'onerror=alert("xss")',
      ];

      maliciousInputs.forEach(input => {
        const result = service.validateInput(input);
        expect(result.isValid).toBe(false);
        expect(result.threats).toContain('XSS_ATTEMPT');
      });
    });

    it('should detect path traversal attempts', () => {
      const maliciousInputs = [
        '../../../etc/passwd',
        '..\\..\\windows\\system32\\config\\sam',
        '%2e%2e%2f%2e%2e%2fetc%2fpasswd',
      ];

      maliciousInputs.forEach(input => {
        const result = service.validateInput(input);
        expect(result.isValid).toBe(false);
        expect(result.threats).toContain('PATH_TRAVERSAL_ATTEMPT');
      });
    });

    it('should detect command injection attempts', () => {
      const maliciousInputs = [
        'test; rm -rf /',
        'test && cat /etc/passwd',
        'test | whoami',
        'test `id`',
      ];

      maliciousInputs.forEach(input => {
        const result = service.validateInput(input);
        expect(result.isValid).toBe(false);
        expect(result.threats).toContain('COMMAND_INJECTION_ATTEMPT');
      });
    });

    it('should accept valid input', () => {
      const validInputs = [
        'John Doe',
        'john.doe@example.com',
        '123 Main Street',
        'Valid input with spaces',
      ];

      validInputs.forEach(input => {
        const result = service.validateInput(input);
        expect(result.isValid).toBe(true);
        expect(result.sanitized).toBe(input);
        expect(result.threats).toBeUndefined();
      });
    });

    it('should sanitize input when threats are detected', () => {
      const input = '<script>alert("xss")</script>John Doe';
      const result = service.validateInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.threats).toContain('XSS_ATTEMPT');
      expect(result.sanitized).toBe('scriptalert("xss")/scriptJohn Doe');
    });
  });

  describe('IP blocking', () => {
    it('should block IP after multiple failed attempts', () => {
      const testIP = '192.168.1.100';
      
      // Simular 4 intentos fallidos
      for (let i = 0; i < 4; i++) {
        service.recordFailedAttempt(testIP);
      }
      
      expect(service.isIPBlocked(testIP)).toBe(false);
      
      // 5to intento fallido debería bloquear la IP
      service.recordFailedAttempt(testIP);
      expect(service.isIPBlocked(testIP)).toBe(true);
    });

    it('should not block IP with few failed attempts', () => {
      const testIP = '192.168.1.101';
      
      service.recordFailedAttempt(testIP);
      service.recordFailedAttempt(testIP);
      
      expect(service.isIPBlocked(testIP)).toBe(false);
    });
  });

  describe('security event logging', () => {
    it('should log security events correctly', () => {
      const event = {
        eventType: 'AUTH_FAILURE' as const,
        ip: '192.168.1.100',
        userAgent: 'Test Browser',
        endpoint: '/api/auth/login',
        method: 'POST',
        details: 'Invalid credentials',
        severity: 'MEDIUM' as const,
      };

      service.logSecurityEvent(event);
      
      const stats = service.getSecurityStats();
      expect(stats.totalEvents).toBe(1);
      expect(stats.recentEvents).toHaveLength(1);
      expect(stats.recentEvents[0]).toMatchObject(event);
    });

    it('should detect suspicious activity', () => {
      const testIP = '192.168.1.102';
      
      // Simular muchas requests en poco tiempo
      for (let i = 0; i < 11; i++) {
        service.logSecurityEvent({
          eventType: 'API_ABUSE',
          ip: testIP,
          userAgent: 'Test Browser',
          endpoint: '/api/test',
          method: 'GET',
          details: `Request ${i + 1}`,
          severity: 'LOW',
        });
      }
      
      expect(service.isIPBlocked(testIP)).toBe(true);
    });
  });

  describe('security stats', () => {
    it('should return correct statistics', () => {
      // Agregar algunos eventos de prueba
      service.logSecurityEvent({
        eventType: 'AUTH_FAILURE',
        ip: '192.168.1.100',
        userAgent: 'Test Browser',
        endpoint: '/api/auth',
        method: 'POST',
        details: 'Test event 1',
        severity: 'HIGH',
      });

      service.logSecurityEvent({
        eventType: 'INVALID_INPUT',
        ip: '192.168.1.101',
        userAgent: 'Test Browser',
        endpoint: '/api/test',
        method: 'GET',
        details: 'Test event 2',
        severity: 'MEDIUM',
      });

      const stats = service.getSecurityStats();
      
      expect(stats.totalEvents).toBe(2);
      expect(stats.blockedIPs).toBe(0);
      expect(stats.suspiciousIPs).toBe(0);
      expect(stats.recentEvents).toHaveLength(2);
    });
  });

  describe('cleanup', () => {
    it('should cleanup old events', () => {
      // Agregar un evento
      service.logSecurityEvent({
        eventType: 'AUTH_FAILURE',
        ip: '192.168.1.100',
        userAgent: 'Test Browser',
        endpoint: '/api/auth',
        method: 'POST',
        details: 'Test event',
        severity: 'HIGH',
      });

      expect(service.getSecurityStats().totalEvents).toBe(1);
      
      // Simular limpieza (en realidad no limpia porque el evento es reciente)
      service.cleanupOldEvents();
      
      expect(service.getSecurityStats().totalEvents).toBe(1);
    });
  });
}); 