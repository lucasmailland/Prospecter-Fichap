/**
 * Sanitizador de datos para prevenir vulnerabilidades XSS
 * 
 * Este módulo proporciona funciones para sanitizar entrada de usuario
 * y prevenir ataques de Cross-Site Scripting (XSS).
 */

import clsx from 'clsx';

/**
 * Sanitiza texto eliminando caracteres peligrosos
 */
export function sanitizeText(text: string): string {
  if (typeof text !== 'string') return '';
  
  return text
    .replace(/[<>]/g, '') // Eliminar < y >
    .replace(/javascript:/gi, '') // Eliminar javascript:
    .replace(/on\w+=/gi, '') // Eliminar event handlers
    .trim();
}

/**
 * Sanitiza URL para prevenir XSS
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') return '';
  
  // Lista blanca de protocolos seguros
  const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
  
  try {
    const urlObj = new URL(url);
    if (!allowedProtocols.includes(urlObj.protocol)) {
      return '';
    }
    return url;
  } catch {
    // Si no es una URL válida, sanitizar como texto
    return sanitizeText(url);
  }
}

/**
 * Validaciones de entrada
 */
export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  phone: (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },
  
  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
};

/**
 * Escapar caracteres especiales para prevenir injection
 */
export function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Función para combinar clases CSS de forma segura
 * Soporta strings, objetos condicionales, arrays, etc.
 */
export function cn(...inputs: Parameters<typeof clsx>): string {
  return clsx(...inputs).trim();
}

// Re-exportar clsx para compatibilidad
export { clsx };

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