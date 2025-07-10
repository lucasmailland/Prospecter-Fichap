import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';
import { Lead, LeadSource } from '@prisma/client';

@Injectable()
export class ProspectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Lead[]> {
    return this.prisma.lead.findMany({
      include: {
        hubspotContact: true,
        leadScores: true,
        conversationAnalyses: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<Lead | null> {
    return this.prisma.lead.findUnique({
      where: { id },
      include: {
        hubspotContact: true,
        leadScores: true,
        conversationAnalyses: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async create(leadData: {
    email: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    jobTitle?: string;
    phone?: string;
    source?: string;
    userId: string;
  }): Promise<Lead> {
    const { userId, source, ...dataWithoutUserId } = leadData;
    return this.prisma.lead.create({
      data: {
        ...dataWithoutUserId,
        source: source as LeadSource || LeadSource.MANUAL,
        user: {
          connect: {
            id: userId
          }
        }
      },
      include: {
        hubspotContact: true,
        leadScores: true,
        conversationAnalyses: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async update(id: string, leadData: Partial<Lead>): Promise<Lead> {
    return this.prisma.lead.update({
      where: { id },
      data: leadData,
      include: {
        hubspotContact: true,
        leadScores: true,
        conversationAnalyses: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.lead.delete({
      where: { id },
    });
  }

  async bulkCreate(leads: any[]): Promise<{ count: number }> {
    return this.prisma.lead.createMany({
      data: leads,
    });
  }
} 