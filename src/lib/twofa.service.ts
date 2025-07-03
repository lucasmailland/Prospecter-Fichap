import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import crypto from 'crypto';

export interface TwoFASetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
  manualEntryKey: string;
}

export interface TwoFAVerification {
  isValid: boolean;
  wasBackupCode?: boolean;
}

class TwoFAService {
  private readonly appName = process.env.APP_NAME || 'Prospecter-Fichap';
  private readonly issuer = process.env.APP_URL || 'http://localhost:3001';

  /**
   * Genera un nuevo secreto 2FA y códigos de respaldo
   */
  async generateSecret(userEmail: string): Promise<TwoFASetup> {
    // Generar secreto único
    const secret = speakeasy.generateSecret({
      name: `${this.appName} (${userEmail})`,
      issuer: this.appName,
      length: 32,
    });

    // Generar códigos de respaldo
    const backupCodes = this.generateBackupCodes();

    // Generar QR Code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

    return {
      secret: secret.base32!,
      qrCodeUrl,
      backupCodes,
      manualEntryKey: secret.base32!,
    };
  }

  /**
   * Verifica un código 2FA o código de respaldo
   */
  verifyToken(
    secret: string,
    token: string,
    backupCodes?: string[]
  ): TwoFAVerification {
    // Primero intentar verificar como código TOTP
    const isValidTOTP = speakeasy.totp.verify({
      secret,
      token,
      window: 2, // Permite +/- 30 segundos de tolerancia
      encoding: 'base32',
    });

    if (isValidTOTP) {
      return { isValid: true, wasBackupCode: false };
    }

    // Si no es válido como TOTP, verificar códigos de respaldo
    if (backupCodes && backupCodes.includes(token)) {
      return { isValid: true, wasBackupCode: true };
    }

    return { isValid: false };
  }

  /**
   * Genera códigos de respaldo seguros
   */
  generateBackupCodes(count: number = 8): string[] {
    const codes: string[] = [];
    
    for (let i = 0; i < count; i++) {
      // Generar código de 8 caracteres alphanuméricas
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      codes.push(code);
    }

    return codes;
  }

  /**
   * Quita un código de respaldo usado de la lista
   */
  removeUsedBackupCode(backupCodes: string[], usedCode: string): string[] {
    return backupCodes.filter(code => code !== usedCode);
  }

  /**
   * Encripta los códigos de respaldo para almacenamiento
   */
  encryptBackupCodes(codes: string[]): string {
    const key = process.env.NEXTAUTH_SECRET || 'fallback-key';
    const cipher = crypto.createCipher('aes-256-cbc', key);
    let encrypted = cipher.update(JSON.stringify(codes), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  /**
   * Desencripta los códigos de respaldo
   */
  decryptBackupCodes(encryptedCodes: string): string[] {
    try {
      const key = process.env.NEXTAUTH_SECRET || 'fallback-key';
      const decipher = crypto.createDecipher('aes-256-cbc', key);
      let decrypted = decipher.update(encryptedCodes, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Error decrypting backup codes:', error);
      return [];
    }
  }

  /**
   * Genera un código TOTP actual (para testing)
   */
  generateCurrentToken(secret: string): string {
    return speakeasy.totp({
      secret,
      encoding: 'base32',
    });
  }

  /**
   * Valida la configuración inicial de 2FA
   */
  validateSetup(secret: string, userToken: string): boolean {
    return speakeasy.totp.verify({
      secret,
      token: userToken,
      window: 2,
      encoding: 'base32',
    });
  }

  /**
   * Genera URI para configuración manual
   */
  generateManualEntryUri(userEmail: string, secret: string): string {
    return `otpauth://totp/${encodeURIComponent(`${this.appName}:${userEmail}`)}?secret=${secret}&issuer=${encodeURIComponent(this.appName)}`;
  }

  /**
   * Verifica si un secreto es válido
   */
  isValidSecret(secret: string): boolean {
    try {
      // Intentar generar un token con el secreto
      speakeasy.totp({ secret, encoding: 'base32' });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Tiempo restante hasta el próximo código (en segundos)
   */
  getTimeRemaining(): number {
    const now = Math.floor(Date.now() / 1000);
    const timeStep = 30; // TOTP usa pasos de 30 segundos
    return timeStep - (now % timeStep);
  }

  /**
   * Estadísticas del código actual
   */
  getTokenInfo(secret: string) {
    const token = this.generateCurrentToken(secret);
    const timeRemaining = this.getTimeRemaining();
    
    return {
      currentToken: token,
      timeRemaining,
      nextTokenIn: timeRemaining,
      isExpiringSoon: timeRemaining < 10,
    };
  }
}

export const twoFAService = new TwoFAService(); 