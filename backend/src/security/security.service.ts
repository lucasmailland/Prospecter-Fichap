import { Injectable } from '@nestjs/common';

@Injectable()
export class SecurityService {
  async runSecurityScan() {
    // TODO: Implementar escaneo de seguridad
    return { message: 'Escaneo de seguridad ejecutado' };
  }
} 