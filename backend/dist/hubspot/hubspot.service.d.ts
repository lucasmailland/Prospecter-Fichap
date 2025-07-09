import { PrismaService } from '@/common/database/prisma.service';
export declare class HubspotService {
    private prisma;
    constructor(prisma: PrismaService);
    getContacts(): Promise<any>;
    syncContacts(): Promise<{
        message: string;
    }>;
}
