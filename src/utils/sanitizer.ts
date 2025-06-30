/**
 * Sanitizador de datos para prevenir vulnerabilidades XSS
 * 
 * Este módulo proporciona funciones para sanitizar entrada de usuario
 * y prevenir ataques de Cross-Site Scripting (XSS).
 */

/**
 * Escapa caracteres HTML peligrosos
 */
export function escapeHtml(text: string): string {
  if (typeof text !== 'string') {
    return '';
  }

  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  return text.replace(/[&<>"'`=\/]/g, (s) => map[s]);
}

/**
 * Sanitiza texto para uso en atributos HTML
 */
export function sanitizeAttribute(value: string): string {
  if (typeof value !== 'string') {
    return '';
  }

  // Remover caracteres potencialmente peligrosos
  return value
    .replace(/[<>'"]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

/**
 * Sanitiza URLs para prevenir javascript: y data: schemes maliciosos
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') {
    return '';
  }

  const normalizedUrl = url.toLowerCase().trim();
  
  // Bloquear esquemas peligrosos
  const dangerousSchemes = [
    'javascript:',
    'vbscript:',
    'data:text/html',
    'data:text/javascript',
    'data:application/javascript'
  ];

  for (const scheme of dangerousSchemes) {
    if (normalizedUrl.startsWith(scheme)) {
      return '';
    }
  }

  // Solo permitir esquemas seguros
  const allowedSchemes = ['http:', 'https:', 'mailto:', 'tel:', 'ftp:'];
  const hasValidScheme = allowedSchemes.some(scheme => 
    normalizedUrl.startsWith(scheme)
  );

  // Si no tiene esquema, asumir que es relativo y seguro
  const hasScheme = normalizedUrl.includes(':');
  
  if (hasScheme && !hasValidScheme) {
    return '';
  }

  return url;
}

/**
 * Sanitiza texto para uso en JSON
 */
export function sanitizeJson(text: string): string {
  if (typeof text !== 'string') {
    return '';
  }

  return text
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * Valida y sanitiza input de email
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') {
    return '';
  }

  // Regex básico para email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  const sanitized = email.trim().toLowerCase();
  
  if (!emailRegex.test(sanitized)) {
    return '';
  }

  return sanitized;
}

/**
 * Sanitiza texto general removiendo scripts y elementos peligrosos
 */
export function sanitizeText(text: string): string {
  if (typeof text !== 'string') {
    return '';
  }

  return text
    // Remover tags script
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remover event handlers
    .replace(/\s*on\w+\s*=\s*['""][^'""]*['""]?/gi, '')
    // Remover javascript: y vbscript:
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    // Escapar HTML básico
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim();
}

/**
 * Hook para validar datos de formularios
 */
export function validateFormData(data: Record<string, any>): Record<string, string> {
  const sanitized: Record<string, string> = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Aplicar sanitización según el tipo de campo
      if (key.toLowerCase().includes('email')) {
        sanitized[key] = sanitizeEmail(value);
      } else if (key.toLowerCase().includes('url') || key.toLowerCase().includes('website')) {
        sanitized[key] = sanitizeUrl(value);
      } else {
        sanitized[key] = sanitizeText(value);
      }
    } else if (typeof value === 'number') {
      sanitized[key] = String(value);
    } else {
      sanitized[key] = '';
    }
  }

  return sanitized;
}

/**
 * Middleware para sanitizar props de componentes React
 */
export function sanitizeProps<T extends Record<string, any>>(props: T): T {
  const sanitized = { ...props };

  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === 'string') {
      (sanitized as any)[key] = sanitizeText(value);
    }
  }

  return sanitized;
} 