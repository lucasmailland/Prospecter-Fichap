import { PrismaService } from '@/common/database/prisma.service';
import { Lead } from '@prisma/client';
export declare class ProspectsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<Lead[]>;
    findById(id: string): Promise<Lead | null>;
    create(leadData: {
        email: string;
        firstName?: string;
        lastName?: string;
        company?: string;
        jobTitle?: string;
        phone?: string;
        source?: string;
    }): Promise<Lead>;
    update(id: string, leadData: Partial<Lead>): Promise<Lead>;
    delete(id: string): Promise<void>;
    bulkCreate(leads: any[]): Promise<{
        count: number;
    }>;
}
