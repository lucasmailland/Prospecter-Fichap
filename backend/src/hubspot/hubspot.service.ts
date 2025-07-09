import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';

@Injectable()
export class HubspotService {
  constructor(private prisma: PrismaService) {}

  async getContacts() {
    return this.prisma.hubSpotContact.findMany({
      include: {
        lead: true,
      },
    });
  }

  async syncContacts() {
    // TODO: Implementar sincronización con HubSpot
    return { message: 'Sincronización iniciada' };
  }
} 