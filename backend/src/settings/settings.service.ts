import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    return this.prisma.systemConfiguration.findMany();
  }

  async updateSetting(key: string, value: string) {
    return this.prisma.systemConfiguration.upsert({
      where: { key },
      update: { value },
      create: { key, value, category: 'general' },
    });
  }
} 