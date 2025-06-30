/**
 * Security sanitizer to prevent XSS and other security vulnerabilities
 */

export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function generateSecureTestEmail(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `test_${timestamp}_${random}@secure-test-domain.local`;
}
