const clsx = require('clsx');

// Lista blanca de protocolos seguros
const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];

// Regex para validación de email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Sanitiza texto eliminando caracteres peligrosos
 */
function sanitizeText(text) {
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
function sanitizeUrl(url) {
  if (typeof url !== 'string') return '';
  
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
const validators = {
  email: (email) => {
    return emailRegex.test(email);
  },
  
  phone: (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },
  
  url: (url) => {
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
function escapeHtml(text) {
  const map = {
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
function cn(...inputs) {
  return clsx(...inputs).trim();
}

/**
 * Sanitiza texto para uso en atributos HTML
 */
function sanitizeAttribute(value) {
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
function sanitizeJson(text) {
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
function sanitizeEmail(email) {
  if (typeof email !== 'string') {
    return '';
  }

  const sanitized = email.trim().toLowerCase();
  
  if (!emailRegex.test(sanitized)) {
    return '';
  }

  return sanitized;
}

/**
 * Hook para validar datos de formularios
 */
function validateFormData(data) {
  const sanitized = {};

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
function sanitizeProps(props) {
  const sanitized = { ...props };

  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value);
    }
  }

  return sanitized;
}

module.exports = {
  sanitizeText,
  sanitizeUrl,
  validators,
  escapeHtml,
  cn,
  sanitizeAttribute,
  sanitizeJson,
  sanitizeEmail,
  validateFormData,
  sanitizeProps,
  clsx
}; 