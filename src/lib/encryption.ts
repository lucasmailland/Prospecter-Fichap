import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || (() => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('ENCRYPTION_KEY must be set in production');
  }
  return crypto.randomBytes(32).toString('hex');
})();
const ALGORITHM = 'aes-256-gcm';

export function encrypt(text: string): string {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
  } catch (error) {
// console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

export function decrypt(encryptedData: string): string {
  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
// console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

// Función para generar una clave de encriptación segura
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Función para hash de contraseñas (para uso con bcrypt)
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + ENCRYPTION_KEY).digest('hex');
}

// Función para verificar contraseñas
export function verifyPassword(password: string, hash: string): boolean {
  const passwordHash = hashPassword(password);
  return passwordHash === hash;
} 